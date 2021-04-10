defmodule MovieApi.Comments.Comment do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:body, :user_id, :id, :user]}

  schema "comments" do
    field :body, :string
    belongs_to :user, MovieApi.Users.User
    belongs_to :post, MovieApi.Posts.Post

    timestamps()
  end

  @doc false
  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:body, :user_id, :post_id])
    |> validate_required([:body, :user_id, :post_id])
  end
end
