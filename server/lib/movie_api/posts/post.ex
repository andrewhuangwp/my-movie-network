defmodule MovieApi.Posts.Post do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:name, :body, :id]}

  schema "posts" do
    field :body, :string
    field :name, :string
    belongs_to :user, MovieApi.Users.User

    has_many :comments, MovieApi.Comments.Comment, on_delete: :delete_all
    has_many :likes, MovieApi.Likes.Like, on_delete: :delete_all

    timestamps()
  end

  @doc false
  def changeset(post, attrs) do
    post
    |> cast(attrs, [:body, :name, :user_id])
    |> validate_required([:body, :name, :user_id])
  end
end
