import {
  Nav,
  Navbar,
  Row,
  Col,
  Form,
  Button,
  Alert,
  NavDropdown,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { useState } from "react";

import { api_login } from "./api";

function LoginForm() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  function on_submit(ev) {
    ev.preventDefault();
    api_login(name, pass);
  }

  return (
    <Navbar.Collapse className="justify-content-end" style={{ width: "100%" }}>
      <Form onSubmit={on_submit} inline>
        <Form.Control
          name="name"
          type="text"
          placeholder="username"
          onChange={(ev) => setName(ev.target.value)}
          value={name}
        />
        <Form.Control
          name="password"
          type="password"
          placeholder="password"
          onChange={(ev) => setPass(ev.target.value)}
          value={pass}
        />
        <Button variant="primary" type="submit">
          Login
        </Button>
        <Button variant="outline-primary" className="ml-2">
          <Link to="/users/new">Register</Link>
        </Button>
      </Form>
    </Navbar.Collapse>
  );
}

let SessionInfo = connect()(({ session, dispatch }) => {
  function logout() {
    dispatch({ type: "session/clear" });
  }
  return (
    <Navbar.Collapse className="justify-content-end" style={{ width: "100%" }}>
      <Nav.Item>Logged in as {session.name} &nbsp;</Nav.Item>

      <NavDropdown title="View" id="basic-nav-dropdown">
        <Link to={`/users/${session.user_id}`}>Profile</Link>
        <Link to={`/rooms`}>Chat Rooms</Link>
        <Link to={`/statistics`}>Statistics</Link>
      </NavDropdown>

      <NavDropdown title="Search for" id="basic-nav-dropdown">
        <Link to={`/search/movies`}>Movies</Link>
      </NavDropdown>

      <NavDropdown title="Create" id="basic-nav-dropdown">
        <Link to={`/posts/new`}>New Post</Link>
        <Link to={`/lists/new`}>New List</Link>
        <Link to={`/rooms/new`}>New Chat Room</Link>
      </NavDropdown>

      <Nav.Item>
        <Button variant="outline-primary ml-2" onClick={logout}>
          Logout
        </Button>
      </Nav.Item>
    </Navbar.Collapse>
  );
});

function LOI({ session }) {
  if (session) {
    return <SessionInfo session={session} />;
  } else {
    return <LoginForm />;
  }
}

const LoginOrInfo = connect(({ session }) => ({ session }))(LOI);

function Link({ to, children }) {
  return (
    <NavLink to={to} exact className="nav-link" activeClassName="active">
      {children}
    </NavLink>
  );
}

function AppNav({ error }) {
  let error_row = null;

  if (error) {
    error_row = (
      <Row>
        <Col>
          <Alert variant="danger">{error}</Alert>
        </Col>
      </Row>
    );
  }

  return (
    <div>
      <Navbar bg="light" variant="dark">
        <Navbar.Brand>
          <Link to="/">Home</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />

        <LoginOrInfo />
      </Navbar>
      {error_row}
    </div>
  );
}

export default connect(({ error }) => ({ error }))(AppNav);
