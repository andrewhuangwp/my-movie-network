import { createStore, combineReducers } from 'redux';

function users(state = [], action) {
    switch (action.type) {
    case 'users/set':
        return action.data;
    default:
        return state;
    }
}

function posts(state = [], action) {
  switch (action.type) {
    case 'posts/set':
      return action.data;
    default:
      return state;
  }
}

function lists(state = [], action) {
  switch (action.type) {
    case 'lists/set':
      return action.data;
    default:
      return state;
  }
}

function rooms(state = [], action) {
  switch (action.type) {
    case 'rooms/set':
      return action.data;
    default:
      return state;
  }
}

function save_session(s) {
  let session = Object.assign({}, s, {time: Date.now()});
  localStorage.setItem("session", JSON.stringify(session));
}

function session(state = load_session(), action) {
  switch (action.type) {
  case 'session/set':
    save_session(action.data);
    return action.data;
  case 'session/clear':
    delete_session();
    return null;
  default:
    return state;
  }
}

function load_session() {
  let session = localStorage.getItem("session");
  if (!session) {
    return null;
  }
  session = JSON.parse(session);
  if (session === null) {
    return null;
  }
  let age = Date.now() - session.time;
  let hours = 60*60*1000;
  if (age < 24 * hours) {
    return session;
  }
  else {
    return null;
  }
}

function delete_session() {
  localStorage.setItem("session", null);
}

function user_form(state = {}, action) {
    switch (action.type) {
    case 'user_form/set':
        return action.data;
    default:
        return state
    }
}

function error(state = null, action) {
  switch (action.type) {
  case 'error/set':
    return action.data;
  case 'session/set':
    return null;
  default:
    return state;
  }
}

function root_reducer(state, action) {
  console.log("root reducer", state, action);

  let redu = combineReducers(
    {users, user_form, posts, session, error, lists, rooms}
  );

  let state1 = redu(state, action);
  console.log("state1", state1);

  return state1;
}

let store = createStore(root_reducer);
export default store;