defmodule MovieApi.MoviesTest do
  use MovieApi.DataCase

  alias MovieApi.Movies

  describe "movies" do
    alias MovieApi.Movies.Movie

    @valid_attrs %{api_id: 42, overview: "some overview", poster_path: "some poster_path", release_date: "some release_date", title: "some title"}
    @update_attrs %{api_id: 43, overview: "some updated overview", poster_path: "some updated poster_path", release_date: "some updated release_date", title: "some updated title"}
    @invalid_attrs %{api_id: nil, overview: nil, poster_path: nil, release_date: nil, title: nil}

    def movie_fixture(attrs \\ %{}) do
      {:ok, movie} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Movies.create_movie()

      movie
    end

    test "list_movies/0 returns all movies" do
      movie = movie_fixture()
      assert Movies.list_movies() == [movie]
    end

    test "get_movie!/1 returns the movie with given id" do
      movie = movie_fixture()
      assert Movies.get_movie!(movie.id) == movie
    end

    test "create_movie/1 with valid data creates a movie" do
      assert {:ok, %Movie{} = movie} = Movies.create_movie(@valid_attrs)
      assert movie.api_id == 42
      assert movie.overview == "some overview"
      assert movie.poster_path == "some poster_path"
      assert movie.release_date == "some release_date"
      assert movie.title == "some title"
    end

    test "create_movie/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Movies.create_movie(@invalid_attrs)
    end

    test "update_movie/2 with valid data updates the movie" do
      movie = movie_fixture()
      assert {:ok, %Movie{} = movie} = Movies.update_movie(movie, @update_attrs)
      assert movie.api_id == 43
      assert movie.overview == "some updated overview"
      assert movie.poster_path == "some updated poster_path"
      assert movie.release_date == "some updated release_date"
      assert movie.title == "some updated title"
    end

    test "update_movie/2 with invalid data returns error changeset" do
      movie = movie_fixture()
      assert {:error, %Ecto.Changeset{}} = Movies.update_movie(movie, @invalid_attrs)
      assert movie == Movies.get_movie!(movie.id)
    end

    test "delete_movie/1 deletes the movie" do
      movie = movie_fixture()
      assert {:ok, %Movie{}} = Movies.delete_movie(movie)
      assert_raise Ecto.NoResultsError, fn -> Movies.get_movie!(movie.id) end
    end

    test "change_movie/1 returns a movie changeset" do
      movie = movie_fixture()
      assert %Ecto.Changeset{} = Movies.change_movie(movie)
    end
  end
end
