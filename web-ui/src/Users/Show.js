import { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Button, Table } from "react-bootstrap";
import { get_user } from "../api";
import { NotFound } from "../Error";

function Post({ post }) {
  return (
    <tr>
      <td>
        <Link to={`/posts/${post.id}`}>{post.name}</Link>
      </td>
    </tr>
  );
}

function List({ list }) {
  return (
    <tr>
      <td>
        <Link to={`/lists/${list.id}`}>{list.name}</Link>
      </td>
    </tr>
  );
}

function UserProfile({ session }) {
  const { id } = useParams();
  const history = useHistory();
  const [user, setUser] = useState({
    name: "",
    posts: [],
    lists: [],
    follows: [],
    followers: []
  });
  const [error, setError] = useState(false);
  

  useEffect(() => {
    get_user(id)
      .then((data) => {
        console.log(data);
        setUser({
          name: data.name,
          posts: data.posts ? data.posts : [],
          lists: data.lists ? data.lists : [],
          follows: data.follows ? data.follows : [],
          followers: data.followers ? data.followers : [],
        });
      })
      .catch((err) => {
        setError(true);
      });
  }, []);
  return (
    <div>
      {error ? (
        <NotFound />
      ) : (
        <Row>
          <Col>
            <h1>{user.name}'s Profile</h1>
            <h3> Posts Created</h3>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {user.posts.map((post) => (
                  <Post post={post} key={post.id} />
                ))}
              </tbody>
            </Table>
            <h3> Lists Created</h3>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {user.lists.map((list) => (
                  <List list={list} key={list.id} />
                ))}
              </tbody>
            </Table>
            {session ? (
              session.user_id.toString() === id ? (
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    history.push(`/users/edit/${id}`);
                  }}
                >
                  Edit Profile
                </Button>
              ) : null
            ) : null}
          </Col>
        </Row>
      )}
    </div>
  );
}

export default connect(({ session }) => ({ session }))(UserProfile);