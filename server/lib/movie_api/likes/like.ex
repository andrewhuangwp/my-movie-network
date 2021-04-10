defmodule MovieApi.Likes.Like do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:post_id, :user_id, :id, :user]}

  schema "likes" do
    belongs_to :user, MovieApi.Users.User
    belongs_to :post, MovieApi.Posts.Post

    timestamps()
  end

  @doc false
  def changeset(like, attrs) do
    like
    |> cast(attrs, [:user_id, :post_id])
    |> validate_required([:user_id, :post_id])
  end
end
