defmodule MovieApiWeb.StatisticView do
  use MovieApiWeb, :view
  alias MovieApiWeb.StatisticView

  def render("show.json", %{result: result}) do
    %{data: render_one(result, SearchView, "statistic.json")}
  end

  def render("statistic.json", %{result: result}) do
    IO.inspect(result)
    %{movies: result.movies, likes: result.likes, comments: result.comments}
  end
end
