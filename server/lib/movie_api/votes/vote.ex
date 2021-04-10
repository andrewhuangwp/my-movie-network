defmodule MovieApi.Votes.Vote do
  use Ecto.Schema
  import Ecto.Changeset

  schema "votes" do
    field :value, :string
    belongs_to :user, MovieApi.Users.User
    belongs_to :poll, MovieApi.Polls.Poll

    timestamps()
  end

  @doc false
  def changeset(vote, attrs) do
    vote
    |> cast(attrs, [:user_id, :poll_id])
    |> validate_required([:user_id, :poll_id])
  end
end
