defmodule MovieApiWeb.SearchView do
  use MovieApiWeb, :view
  alias MovieApiWeb.SearchView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{result: result}) do
    %{data: render_one(result, SearchView, "search.json")}
  end

  def render("search.json", %{result: result}) do
    %{result: result}
  end
end
