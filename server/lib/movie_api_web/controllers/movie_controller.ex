defmodule MovieApiWeb.MovieController do
  use MovieApiWeb, :controller

  alias MovieApi.Movies
  alias MovieApi.Movies.Movie

  action_fallback MovieApiWeb.FallbackController

  def index(conn, _params) do
    movies = Movies.list_movies()
    render(conn, "index.json", movies: movies)
  end

  def create(conn, %{"movie" => movie_params}) do
    case Movies.create_movie(movie_params) do
      {:ok, %Movie{} = movie} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.movie_path(conn, :show, movie))
        |> render("show_less.json", movie: movie)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity, Jason.encode!(%{"error" => "failed"}))
    end
  end

  def show(conn, %{"id" => id}) do
    movie = Movies.get_movie!(id)
    render(conn, "show.json", movie: movie)
  end

  def edit(conn, %{"id" => id}) do
    movie = Movies.get_movie!(id)
    changeset = Movies.change_movie(movie)
    render(conn, "edit.html", movie: movie, changeset: changeset)
  end

  def update(conn, %{"id" => id, "movie" => movie_params}) do
    movie = Movies.get_movie!(id)

    with {:ok, %Movie{} = movie} <- Movies.update_movie(movie, movie_params) do
      render(conn, "show.json", movie: movie)
    end
  end

  def delete(conn, %{"id" => id}) do
    movie = Movies.get_movie!(id)

    with {:ok, %Movie{}} <- Movies.delete_movie(movie) do
      send_resp(conn, :no_content, "")
    end
  end
end
