defmodule MovieApi.Polls.Poll do
  use Ecto.Schema
  import Ecto.Changeset

  schema "polls" do
    field :desc, :string
    field :name, :string
    belongs_to :user, MovieApi.Users.User

    has_many :votes, MovieApi.Votes.Vote, on_delete: :delete_all

    timestamps()
  end

  @doc false
  def changeset(poll, attrs) do
    poll
    |> cast(attrs, [:desc, :name, :user_id])
    |> validate_required([:desc, :name, :user_id])
  end
end
