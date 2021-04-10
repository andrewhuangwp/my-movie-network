import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import { fetch_rooms, fetch_lists, fetch_posts, fetch_stats, fetch_users, load_defaults } from "./api";

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

function Stats({ users, posts, lists, rooms }) {


  return (
    <div>
      <h1 className="text-center">My Movie Network</h1>

      <Row className="justify-content-center">
        {lists.map((list) => <div key={list.id}>{list.name}</div>)}
      </Row>
    </div>
  );
}

export default connect(({ users, posts, lists, rooms }) => ({ users, posts, lists, rooms }))(Stats);
