import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";

function User({ user }) {
  return (
    <tr>
      <td>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </td>
    </tr>
  );
}

function Post({ post }) {
  return (
    <tr>
      <td>
        <Link to={`/posts/${post.id}`}>{post.name}</Link>
      </td>
      <td>{post.user.name}</td>
    </tr>
  );
}

function List({ list }) {
  return (
    <tr>
      <td>
        <Link to={`/lists/${list.id}`}>{list.name}</Link>
      </td>
      <td>{list.user.name}</td>
    </tr>
  );
}

function Home({ users, posts, lists }) {
  let userFeed = (
    <Col md="4">
      <h2>List of Current Users</h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <User user={user} key={user.id} />
          ))}
        </tbody>
      </Table>
    </Col>
  );

  let postFeed = (
    <Col md="4">
      <h2>List of All Posts</h2>
      <Table>
        <thead>
          <tr>
            <th>Post Name</th>
            <th>User Name</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </tbody>
      </Table>
    </Col>
  );

  let listFeed = (
    <Col md="4">
      <h2>List of All Lists</h2>
      <Table>
        <thead>
          <tr>
            <th>List Name</th>
            <th>User Name</th>
          </tr>
        </thead>
        <tbody>
          {lists.map((list) => (
            <List list={list} key={list.id} />
          ))}
        </tbody>
      </Table>
    </Col>
  );

  return (
    <div>
      <h1 className="text-center">My Movie Network</h1>

      <Row className="justify-content-center">
        {userFeed}
        {postFeed}
        {listFeed}
      </Row>
    </div>
  );
}

export default connect(({ users, posts, lists }) => ({ users, posts, lists }))(Home);
