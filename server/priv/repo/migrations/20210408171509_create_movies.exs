defmodule MovieApi.Repo.Migrations.CreateMovies do
  use Ecto.Migration

  def change do
    create table(:movies) do
      add :title, :string, null: false
      add :api_id, :integer, null: false
      add :overview, :text
      add :release_date, :string
      add :poster_path, :string

      add :list_id, references(:lists, on_delete: :delete_all), null: false


      timestamps()
    end
    create index(:movies, [:list_id])
    create index(:movies, [:api_id])
  end
end
