defmodule MovieApi.Lists.List do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:name, :id]}

  schema "lists" do
    field :name, :string
    belongs_to :user, MovieApi.Users.User

    has_many :movies, MovieApi.Movies.Movie, on_delete: :delete_all

    timestamps()
  end

  @doc false
  def changeset(list, attrs) do
    list
    |> cast(attrs, [:name, :user_id])
    |> validate_required([:name, :user_id])
  end
end
