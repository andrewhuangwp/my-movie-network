defmodule MovieApi.Repo do
  use Ecto.Repo,
    otp_app: :movie_api,
    adapter: Ecto.Adapters.Postgres
end
