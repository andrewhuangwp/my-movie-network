defmodule MovieApi.Messages.Message do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:body, :user_id, :id, :user]}


  schema "messages" do
    field :body, :string

    belongs_to :user, MovieApi.Users.User
    belongs_to :room, MovieApi.Rooms.Room

    timestamps()
  end

  @doc false
  def changeset(message, attrs) do
    message
    |> cast(attrs, [:body, :user_id, :room_id])
    |> validate_required([:body, :user_id, :room_id])
  end
end
