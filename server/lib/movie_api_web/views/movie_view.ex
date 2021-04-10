defmodule MovieApiWeb.MovieView do
  use MovieApiWeb, :view
  alias MovieApiWeb.MovieView

  def render("index.json", %{movies: movies}) do
    %{data: render_many(movies, MovieView, "movie.json")}
  end

  def render("show.json", %{movie: movie}) do
    %{data: render_one(movie, MovieView, "movie.json")}
  end

  def render("show_less.json", %{movie: movie}) do
    %{data: render_one(movie, MovieView, "movie_less.json")}
  end

  def render("movie.json", %{movie: movie}) do
    %{movie: movie}
  end

  def render("movie_less.json", %{movie: movie}) do
    %{movie: movie.title}
  end
end
