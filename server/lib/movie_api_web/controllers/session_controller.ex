defmodule MovieApiWeb.SessionController do
  use MovieApiWeb, :controller

  def create(conn, %{"name" => name, "password" => password}) do
    user = MovieApi.Users.authenticate(name, password)
    if user do
      session = %{
        user_id: user.id,
        name: name,
        token: Phoenix.Token.sign(conn, "user_id", user.id)
      }
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:created, Jason.encode!(%{"session" => session}))
    else
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:unauthorized, Jason.encode!(%{"error" => "failed"}))
    end
  end
end
