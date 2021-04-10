import { Container } from "react-bootstrap";
import Nav from "./Nav";
import Home from "./Home";
import NewUser from "./Users/New";
import EditUser from "./Users/Edit";
import UserProfile from "./Users/Show";
import NewPost from "./Posts/New";
import EditPost from "./Posts/Edit";
import ShowPost from "./Posts/Show";
import SearchMovie from "./Search/Movie";
import NewList from "./Lists/New";
import ShowList from "./Lists/Show";
import NewRoom from "./Rooms/New";
import ShowRoom from "./Rooms/Show";
import AllRooms from "./Rooms/Index";
import Stats from "./stats";

import "./App.scss";

import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Nav />
      <Container>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>

          {/* Routes for users */}
          <Route path="/users/new" exact>
            <NewUser />
          </Route>
          <Route path="/users/:id" exact>
            <UserProfile />
          </Route>
          <Route path="/users/edit/:id" exact>
            <EditUser />
          </Route>

          {/* Routes for posts */}
          <Route path="/posts/new" exact>
            <NewPost />
          </Route>
          <Route path="/posts/:id" exact>
            <ShowPost />
          </Route>
          <Route path="/posts/edit/:id" exact>
            <EditPost />
          </Route>

          {/* Routes for search */}
          <Route path="/search/movies" exact>
            <SearchMovie />
          </Route>

          {/* Routes for lists */}
          <Route path="/lists/new" exact>
            <NewList />
          </Route>
          <Route path="/lists/:id" exact>
            <ShowList />
          </Route>

          {/* Routes for rooms */}
          <Route path="/rooms/new" exact>
            <NewRoom />
          </Route>
          <Route path="/rooms/:id" exact>
            <ShowRoom />
          </Route>
          <Route path="/rooms/" exact>
            <AllRooms />
          </Route>

          {/* Routes for stats */}
          <Route path="/statistics" exact>
            <Stats />
          </Route>
        </Switch>
      </Container>
    </div>
  );
}

export default App;
