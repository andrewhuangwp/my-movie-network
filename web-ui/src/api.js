import store from './store';

const url = "http://my-movie-network.normalwebsite.art/api/v1";

async function api_get(path) {
  let text = await fetch(url + path, {});
  let resp = await text.json();
  return resp.data;
}

async function api_get_verified(path) {
  let state = store.getState();
  let session = state?.session;
  if (session === undefined) {
    return false;
  }
  let token = session?.token;

  let opts = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token,
    }
  };
  let text = await fetch(url + path, opts);
  return await text.json();
}

async function api_post(path, data) {
  let state = store.getState();
  let token = state?.session?.token;

  let opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token,
    },
    body: JSON.stringify(data),
  };
  let text = await fetch(url + path, opts);
  return await text.json();
}

// HTTP Delete Request using fetch
async function api_delete(path) {
  let state = store.getState();
  let token = state?.session?.token;

  let opts = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token,
    }
  }
  let text = await fetch(url + path, opts);
  return await text.text();
}

// HTTP Put Request using fetch
async function api_put(path, data) {
  let state = store.getState();
  let token = state?.session?.token;
  
  let opts = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token,
    },
    body: JSON.stringify(data)
  }
  let text = await fetch(url + path, opts);
  return await text.json();
}

export function fetch_users() {
  api_get("/users").then((data) => {
    let action = {
      type: 'users/set',
      data: data,
    }
    store.dispatch(action);
  });
}

export function fetch_posts() {
  api_get("/posts").then((data) => {
    let action = {
      type: 'posts/set',
      data: data,
    }
    store.dispatch(action);
  });
}

export function fetch_lists() {
  api_get("/lists").then((data) => {
    let action = {
      type: 'lists/set',
      data: data,
    }
    store.dispatch(action);
  });
}

export function fetch_rooms() {
  api_get("/rooms").then((data) => {
    let action = {
      type: 'rooms/set',
      data: data,
    }
    store.dispatch(action);
  });
}

export function fetch_stats() {
  return api_get("/statistics/1");
}

export function search_movie(query, page) {
  return api_post("/search", {query, page});
}

export function api_login(name, password) {
  api_post("/session", {name, password}).then((data) => {
    console.log("login resp", data);
    if (data.session) {
      let action = {
        type: 'session/set',
        data: data.session,
      }
      store.dispatch(action);
    }
    else if (data.error) {
     let action = {
        type: 'error/set',
        data: data.error,
      }
      store.dispatch(action);
    }
  });
}

export function create_user(user) {
  return api_post("/users", {user});
}

export function get_user(user) {
  return api_get("/users/" + user);
}

export function put_user(user, data) {
  return api_put("/users/" + user, data);
}

export function delete_user(user) {
  return api_delete("/users/" + user);
}

export function create_post(post) {
  return api_post("/posts", {post});
}

export function get_post(post) {
  return api_get_verified("/posts/" + post);
}

export function put_post(post, data) {
  return api_put("/posts/" + post, data);
}

export function delete_post(post) {
  return api_delete("/posts/" + post);
}

export function create_like(like) {
  return api_post("/likes", {like});
}

export function get_like(like) {
  return api_get("/likes/" + like);
}

export function delete_like(like) {
  return api_delete("/likes/" + like);
}

export function create_comment(comment) {
  return api_post("/comments", {comment});
}

export function get_comment(comment) {
  return api_get("/comments/" + comment);
}

export function put_comment(comment, data) {
  return api_put("/comments/" + comment, data);
}

export function delete_comment(comment) {
  return api_delete("/comments/" + comment);
}

export function create_poll(poll) {
  return api_post("/polls", {poll});
}

export function get_poll(poll) {
  return api_get("/polls/" + poll);
}

export function put_poll(poll, data) {
  return api_put("/polls/" + poll, data);
}

export function delete_poll(poll) {
  return api_delete("/polls/" + poll);
}

export function create_list(list) {
  return api_post("/lists", {list});
}

export function get_list(list) {
  return api_get("/lists/" + list);
}

export function put_list(list, data) {
  return api_put("/lists/" + list, data);
}

export function delete_list(list) {
  return api_delete("/lists/" + list);
}

export function create_vote(vote) {
  return api_post("/votes", {vote});
}

export function get_vote(vote) {
  return api_get("/votes/" + vote);
}

export function put_vote(vote, data) {
  return api_put("/votes/" + vote, data);
}

export function delete_vote(vote) {
  return api_delete("/votes/" + vote);
}

export function create_movie(movie) {
  return api_post("/movies", {movie});
}

export function get_movie(movie) {
  return api_get("/movies/" + movie);
}

export function put_movie(movie, data) {
  return api_put("/movies/" + movie, data);
}

export function delete_movie(movie) {
  return api_delete("/movies/" + movie);
}

export function create_room(room) {
  return api_post("/rooms/", {room});
}

export function get_room(room) {
  return api_get("/rooms/" + room);
}

export function get_movies() {
  return api_get("/movies");
}



export function load_defaults() {
    fetch_users();
    fetch_lists();
    fetch_posts();
    fetch_rooms();
}