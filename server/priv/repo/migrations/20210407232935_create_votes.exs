defmodule MovieApi.Repo.Migrations.CreateVotes do
  use Ecto.Migration

  def change do
    create table(:votes) do
      add :value, :string, null: false
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :poll_id, references(:polls, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:votes, [:user_id])
    create index(:votes, [:poll_id])
  end
end
