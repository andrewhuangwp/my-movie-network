defmodule MovieApiWeb.PostView do
  use MovieApiWeb, :view
  alias MovieApiWeb.PostView

  def render("index.json", %{posts: posts}) do
    %{data: render_many(posts, PostView, "post.json")}
  end

  def render("show.json", %{post: post}) do
    %{data: render_one(post, PostView, "post.json")}
  end

  def render("show_less.json", %{post: post}) do
    %{data: render_one(post, PostView, "post_less.json")}
  end

  def render("post.json", %{post: post}) do
    %{id: post.id,
      body: post.body,
      name: post.name,
      comments: post.comments,
      likes: post.likes,
      user_id: post.user_id,
      user: post.user}
  end

  def render("post_less.json", %{post: post}) do
    %{id: post.id,
      body: post.body,
      name: post.name,
      user_id: post.user_id}
  end
end
