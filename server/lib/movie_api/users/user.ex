defmodule MovieApi.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:name]}

  schema "users" do
    field :name, :string
    field :password_hash, :string

    has_many :posts, MovieApi.Posts.Post, on_delete: :delete_all
    has_many :polls, MovieApi.Polls.Poll, on_delete: :delete_all
    has_many :lists, MovieApi.Lists.List, on_delete: :delete_all
    has_many :followers, MovieApi.Users.User, on_delete: :delete_all
    has_many :follows, MovieApi.Users.User, on_delete: :delete_all


    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name])
    |> add_password_hash(attrs["password"])
    |> validate_required([:name, :password_hash])
    |> unique_constraint(:name)
  end

  def add_password_hash(cset, nil) do
    cset
  end

  def add_password_hash(cset, password) do
    change(cset, Argon2.add_hash(password))
  end
end
