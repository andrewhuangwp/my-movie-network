defmodule MovieApi.Movies.Movie do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:api_id, :overview, :poster_path, :release_date, :title, :id, :list_id]}

  schema "movies" do
    field :api_id, :integer
    field :overview, :string
    field :poster_path, :string
    field :release_date, :string
    field :title, :string

    belongs_to :list, MovieApi.Lists.List


    timestamps()
  end

  @doc false
  def changeset(movie, attrs) do
    movie
    |> cast(attrs, [:title, :api_id, :overview, :release_date, :poster_path, :list_id])
    |> validate_required([:title, :api_id, :overview, :release_date, :poster_path, :list_id])
  end
end
