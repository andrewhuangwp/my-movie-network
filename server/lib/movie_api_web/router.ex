defmodule MovieApiWeb.Router do
  use MovieApiWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api/v1", MovieApiWeb do
    pipe_through :api

    resources "/users", UserController, except: [:new, :edit]
    resources "/posts", PostController, except: [:new, :edit]
    resources "/rooms", RoomController, except: [:new, :edit]
    resources "/messages", MessageController, except: [:new, :edit]
    resources "/polls", PollController, except: [:new, :edit]
    resources "/comments", CommentController, except: [:new, :edit]
    resources "/likes", LikeController, except: [:new, :edit]
    resources "/votes", VoteController, except: [:new, :edit]
    resources "/lists", ListController, except: [:new, :edit]
    resources "/movies", MovieController, except: [:new, :edit]
    resources "/session", SessionController, only: [:create]
    resources "/statistics", StatisticController, only: [:show]
    resources "/search", SearchController, only: [:create]
  end

  # Other scopes may use custom stacks.
  # scope "/api", MovieApiWeb do
  #   pipe_through :api
  # end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser
      live_dashboard "/dashboard", metrics: MovieApiWeb.Telemetry
    end
  end
end
