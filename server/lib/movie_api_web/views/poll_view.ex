defmodule MovieApiWeb.PollView do
  use MovieApiWeb, :view
  alias MovieApiWeb.PollView

  def render("index.json", %{polls: polls}) do
    %{data: render_many(polls, PollView, "poll.json")}
  end

  def render("show.json", %{poll: poll}) do
    %{data: render_one(poll, PollView, "poll.json")}
  end

  def render("poll.json", %{poll: poll}) do
    %{id: poll.id,
      desc: poll.desc,
      name: poll.name}
  end
end
