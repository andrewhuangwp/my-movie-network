defmodule MovieApiWeb.ListView do
  use MovieApiWeb, :view
  alias MovieApiWeb.ListView

  def render("index.json", %{lists: lists}) do
    %{data: render_many(lists, ListView, "list.json")}
  end

  def render("show.json", %{list: list}) do
    %{data: render_one(list, ListView, "list.json")}
  end

  def render("show_less.json", %{list: list}) do
    %{data: render_one(list, ListView, "list_less.json")}
  end

  def render("list.json", %{list: list}) do
    IO.inspect(list)
    %{id: list.id,
      name: list.name,
      movies: list.movies,
      user: list.user,
      user_id: list.user_id}
  end

  def render("list_less.json", %{list: list}) do
    %{id: list.id,
      name: list.name,}
  end
end
