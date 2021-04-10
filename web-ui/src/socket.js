import { Socket } from "phoenix";

const socket = new Socket(`ws://localhost:4000/socket`, {
  params: {},
});
socket.connect();

let state = {
  name: "",
  messages: "",
};
let channel;
let callback = null;

export function state_update(st) {
  console.log("New state", st);
  state = st;
  if (callback) {
    callback(state);
  }
}

function broadcast_update(st) {
  const user = state.user;
  state = st;
  state.user = user;
  state_update(state);
}

export function ch_join(update) {
  callback = update.setRoom(state);
  callback(state);
}

export function ch_join_channel(room, update) {
  channel = socket.channel("chat:" + room, {});
  channel
    .join()
    .receive("ok", (resp) => {
      update.setRoom(resp);
      console.log(resp);
    })
    .receive("error", (resp) => {
      console.log("Unable to join", resp);
    });
  channel.on("view", (resp) => {
    update.setRoom(resp);
    console.log(resp);
  });
}

export function ch_new_message(message, update) {
  channel
    .push("new message", { message })
    .receive("ok", (resp) => {
      update.setRoom(resp);
      console.log(resp);
    })
    .receive("error", (resp) => {
      console.log("Unable to push", resp);
    });
}
