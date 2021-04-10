defmodule MovieApiWeb.UserController do
  use MovieApiWeb, :controller

  alias MovieApi.Users
  alias MovieApi.Users.User

  action_fallback MovieApiWeb.FallbackController

  plug :selfRequired when action in [:update, :delete]

  # Must be user to edit or delete user profile.
  def selfRequired(conn, _args) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    case Phoenix.Token.verify(conn, "user_id", token, max_age: 86400) do
      {:ok, user_id} ->
        user = MovieApi.Users.get_user!(conn.params["id"])
        if user.id == user_id do
          conn
        else
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(:unauthorized, Jason.encode!(%{"error" => "Unauthorized: only original user may edit user profile."}))
          |> halt()
        end
      {:error, err} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity, Jason.encode!(%{"error" => err}))
        |> halt()
    end
  end

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    case Users.create_user(user_params) do
      {:ok, %User{} = user} ->
        conn
        |> MovieApiWeb.SessionController.create(%{"name" => user.name, "password" => user_params["password"]})
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity, Jason.encode!(%{"error" => "failed"}))
    end
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    IO.inspect(user)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Users.get_user!(id)

    with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    with {:ok, %User{}} <- Users.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
