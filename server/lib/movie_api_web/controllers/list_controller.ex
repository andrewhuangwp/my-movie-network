defmodule MovieApiWeb.ListController do
  use MovieApiWeb, :controller

  alias MovieApi.Lists
  alias MovieApi.Lists.List
  alias MovieApiWeb.Plugs

  action_fallback MovieApiWeb.FallbackController

  plug Plugs.RequireAuth when action in [:create]
  plug :ownerRequired when action in [:update, :delete]

  def ownerRequired(conn, _args) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    case Phoenix.Token.verify(conn, "user_id", token, max_age: 86400) do
      {:ok, user_id} ->
        list = MovieApi.Lists.get_list!(conn.params["id"])
        if list.user_id == user_id do
          conn
        else
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(:unauthorized, Jason.encode!(%{"error" => "Unauthorized: only event owner may change event."}))
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
    lists = Lists.list_list()
    render(conn, "index.json", lists: lists)
  end

  def create(conn, %{"list" => list_params}) do
    case Lists.create_list(list_params) do
      {:ok, %List{} = list} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.list_path(conn, :show, list))
        |> render("show_less.json", list: list)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity, Jason.encode!(%{"error" => "failed"}))
    end
  end

  def show(conn, %{"id" => id}) do
    list = Lists.get_list!(id)
    render(conn, "show.json", list: list)
  end

  def update(conn, %{"id" => id, "list" => list_params}) do
    list = Lists.get_list!(id)

    with {:ok, %List{} = list} <- Lists.update_list(list, list_params) do
      render(conn, "show.json", list: list)
    end
  end

  def delete(conn, %{"id" => id}) do
    list = Lists.get_list!(id)

    with {:ok, %List{}} <- Lists.delete_list(list) do
      send_resp(conn, :no_content, "")
    end
  end
end
