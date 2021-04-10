defmodule MovieApiWeb.StatisticController do
  use MovieApiWeb, :controller


  alias MovieApi.Movies
  alias MovieApi.Likes
  alias MovieApi.Comments

  def show(conn, _params) do
    movies = Movies.list_movies()
    likes = Likes.list_likes()
    comments = Comments.list_comments()
    result = %{movies: movies, likes: likes, comments: comments}
    conn
    |> put_resp_header("content-type", "application/json; charset=UTF-8")
    |> send_resp(:created, Jason.encode!(%{"result" => result}))
  end
end
