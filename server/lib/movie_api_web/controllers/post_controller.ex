defmodule MovieApiWeb.PostController do
  use MovieApiWeb, :controller

  alias MovieApi.Posts
  alias MovieApi.Posts.Post
  alias MovieApiWeb.Plugs
  alias MovieApi.Repo

  action_fallback MovieApiWeb.FallbackController

  plug Plugs.RequireAuth when action in [:create]
  plug :ownerRequired when action in [:update, :delete]

  # Require owner to make changes to post.
  def ownerRequired(conn, _args) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    case Phoenix.Token.verify(conn, "user_id", token, max_age: 86400) do
      {:ok, user_id} ->
        post = MovieApi.Posts.get_post!(conn.params["id"])
        if post.user_id == user_id do
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
    posts = Posts.list_posts()
    render(conn, "index.json", posts: posts)
  end

  def create(conn, %{"post" => post_params}) do
    case Posts.create_post(post_params) do
      {:ok, %Post{} = post} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.post_path(conn, :show, post))
        |> render("show_less.json", post: post)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity, Jason.encode!(%{"error" => "failed"}))
    end
  end

  def show(conn, %{"id" => id}) do
    post = Posts.get_post!(id)
    render(conn, "show.json", post: post)
  end

  def update(conn, %{"id" => id, "post" => post_params}) do
    post = Posts.get_post!(id)

    with {:ok, %Post{} = post} <- Posts.update_post(post, post_params) do
      render(conn, "show.json", post: post)
    end
  end

  def delete(conn, %{"id" => id}) do
    post = Posts.get_post!(id)

    with {:ok, %Post{}} <- Posts.delete_post(post) do
      send_resp(conn, :no_content, "")
    end
  end
end
