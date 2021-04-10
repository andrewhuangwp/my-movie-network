defmodule MovieApiWeb.PageController do
  use MovieApiWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
