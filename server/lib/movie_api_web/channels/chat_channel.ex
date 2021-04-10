defmodule MovieApiWeb.ChatChannel do
  use MovieApiWeb, :channel

  alias MovieApi.Rooms
  alias MovieApi.Messages
  alias MovieApi.Messages.Message

  @impl true
  def join("chat:" <> room_id, payload, socket) do
    if authorized?(payload) do
      room = Rooms.get_room!(room_id)
      IO.inspect(room)
      view = %{messages: room.messages, name: room.name}
      {:ok, view, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (chat:lobby).
  @impl true
  def handle_in("new message", %{"message" => message}, socket) do
    id = message["room_id"]
    IO.inspect(message)
    case Messages.create_message(message) do
      {:ok, %Message{} = message} ->
        room = Rooms.get_room!(id)
        view = %{messages: room.messages, name: room.name}
        broadcast(socket, "view", view)
        {:reply, {:ok, view}, socket}
      {:error, %Ecto.Changeset{} = changeset} ->
        {:error, %{reason: "error"}}
    end
  end

  # Add authorization logic here as required.
  defp authorized?(payload) do
    IO.inspect(payload)
    true
  end
end
