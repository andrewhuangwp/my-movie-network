defmodule MovieApiWeb.ListControllerTest do
  use MovieApiWeb.ConnCase

  alias MovieApi.Lists

  @create_attrs %{name: "some name"}
  @update_attrs %{name: "some updated name"}
  @invalid_attrs %{name: nil}

  def fixture(:list) do
    {:ok, list} = Lists.create_list(@create_attrs)
    list
  end

  describe "index" do
    test "lists all list", %{conn: conn} do
      conn = get(conn, Routes.list_path(conn, :index))
      assert html_response(conn, 200) =~ "Listing List"
    end
  end

  describe "new list" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.list_path(conn, :new))
      assert html_response(conn, 200) =~ "New List"
    end
  end

  describe "create list" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post(conn, Routes.list_path(conn, :create), list: @create_attrs)

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == Routes.list_path(conn, :show, id)

      conn = get(conn, Routes.list_path(conn, :show, id))
      assert html_response(conn, 200) =~ "Show List"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.list_path(conn, :create), list: @invalid_attrs)
      assert html_response(conn, 200) =~ "New List"
    end
  end

  describe "edit list" do
    setup [:create_list]

    test "renders form for editing chosen list", %{conn: conn, list: list} do
      conn = get(conn, Routes.list_path(conn, :edit, list))
      assert html_response(conn, 200) =~ "Edit List"
    end
  end

  describe "update list" do
    setup [:create_list]

    test "redirects when data is valid", %{conn: conn, list: list} do
      conn = put(conn, Routes.list_path(conn, :update, list), list: @update_attrs)
      assert redirected_to(conn) == Routes.list_path(conn, :show, list)

      conn = get(conn, Routes.list_path(conn, :show, list))
      assert html_response(conn, 200) =~ "some updated name"
    end

    test "renders errors when data is invalid", %{conn: conn, list: list} do
      conn = put(conn, Routes.list_path(conn, :update, list), list: @invalid_attrs)
      assert html_response(conn, 200) =~ "Edit List"
    end
  end

  describe "delete list" do
    setup [:create_list]

    test "deletes chosen list", %{conn: conn, list: list} do
      conn = delete(conn, Routes.list_path(conn, :delete, list))
      assert redirected_to(conn) == Routes.list_path(conn, :index)
      assert_error_sent 404, fn ->
        get(conn, Routes.list_path(conn, :show, list))
      end
    end
  end

  defp create_list(_) do
    list = fixture(:list)
    %{list: list}
  end
end
