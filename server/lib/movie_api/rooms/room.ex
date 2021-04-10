defmodule MovieApi.Rooms.Room do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:name]}

  schema "rooms" do
    field :name, :string

    has_many :messages, MovieApi.Messages.Message, on_delete: :delete_all

    timestamps()
  end

  @doc false
  def changeset(room, attrs) do
    room
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
