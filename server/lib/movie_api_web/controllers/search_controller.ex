defmodule MovieApiWeb.SearchController do
  use MovieApiWeb, :controller

  alias MovieApi.Posts
  alias MovieApi.Posts.Post

  def create(conn, %{"query" => query, "page" => page}) do
    key = "661a68d8b581293f508460301d6cdfe5"
    url = "https://api.themoviedb.org/3/search/movie?api_key=#{key}&language=en-US&query=#{query}&page=#{page}"
    case HTTPoison.get(url) do
      {:ok, %{status_code: 200, body: body}} ->
        result = Jason.decode!(body)
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:created, Jason.encode!(%{"result" => result}))

      {:ok, %{status_code: 404}} ->
        # do something with a 404
        IO.inspect("404")

      {:error, %{reason: reason}} ->
        # do something with an error
        IO.inspect(reason)
    end
  end
end
