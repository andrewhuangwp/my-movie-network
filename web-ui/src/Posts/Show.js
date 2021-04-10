import { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Button, Card, ListGroup, Form } from "react-bootstrap";
import {
  get_post,
  create_like,
  delete_comment,
  delete_like,
  create_comment,
} from "../api";
import { NotFound } from "../Error";

function Comment({ reload, comment, session }) {
  function deleteComment() {
    delete_comment(comment.id).then(() => {
      reload();
    });
  }
  return (
    <ListGroup.Item key={comment.id}>
      Name: {comment.user.name}
      <p>{comment.body}</p>
      {session ? (session.user_id === comment.user_id ? (
        <Button
          variant="danger"
          onClick={() => {
            deleteComment();
          }}
        >
          Delete
        </Button>)
      : null) : null}
    </ListGroup.Item>
  );
}

function ShowPost({ session }) {
  const { id } = useParams();
  const history = useHistory();
  const [post, setPost] = useState({
    user_name: "",
    name: "",
    body: "",
    comments: [],
    likes: [],
    user_id: "",
  });
  const [error, setError] = useState(false);
  const [body, setBody] = useState("");

  // Determines if current user has liked post.
  function isLiked() {
    let liked = false;
    post.likes.map((like) => {
      if (like.user_id == session.user_id.toString()) {
        liked = true;
      }
    });
    return liked;
  }

  function Like() {
    create_like({ user_id: session.user_id, post_id: id })
      .then(() => {
        reload();
      })
      .catch((err) => {
        setError(true);
      });
  }

  function Unlike() {
    let like_id = null;
    post.likes.map((like) => {
      if (like.user_id == session.user_id) {
        like_id = like.id;
      }
    });
    if (like_id != null) {
      delete_like(like_id)
        .then(() => {
          reload();
        })
        .catch((err) => {
          setError(true);
        });
    }
  }

  function reload() {
    get_post(id)
      .then((result) => {
        console.log("reloading...");
        setPost({
          name: result.data.name,
          body: result.data.body,
          comments: result.data.comments,
          likes: result.data.likes,
          user_id: result.data.user_id,
          user_name: result.data.user.name,
        });
      })
      .catch((err) => {
        setError(true);
      });
  }

  function updateBody(ev) {
    setBody(ev.target.value);
  }

  function onSubmit(ev) {
    ev.preventDefault();
    create_comment({
      body: body,
      post_id: id,
      user_id: session.user_id,
    })
      .then(() => {
        setBody("");
        reload();
      })
      .catch((err) => {
        setError(true);
      });
  }

  useEffect(() => {
    get_post(id)
      .then((result) => {
        console.log(result);
        setPost({
          name: result.data.name,
          body: result.data.body,
          comments: result.data.comments,
          likes: result.data.likes,
          user_id: result.data.user_id,
          user_name: result.data.user.name,
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
          <Col md="12 mb-2 mt-2">
            <Card>
              <Card.Body>
                <h1>{post.name}</h1>
                <h6>By {post.user_name}</h6>
                <p>{post.body}</p>
                {session ? (
                  session.user_id ? (
                    <div>
                      {" "}
                      <Button
                        variant="outline-primary"
                        onClick={() => {
                          Like();
                        }}
                        disabled={isLiked()}
                      >
                        Like
                      </Button>
                      <Button
                        variant="outline-danger ml-2"
                        onClick={() => {
                          Unlike();
                        }}
                        disabled={!isLiked()}
                      >
                        Unlike
                      </Button>
                    </div>
                  ) : null
                ) : null}
                <p>Liked by {post.likes.length} users</p>

                {session ? (
                  session.user_id.toString() === post.user_id ? (
                    <Button
                      variant="outline-primary ml-2"
                      onClick={() => {
                        history.push(`/posts/edit/${id}`);
                      }}
                    >
                      Edit Post
                    </Button>
                  ) : null
                ) : null}
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <h3>Comments</h3>
                  {post.comments.map((comment) => (
                    <Comment
                      reload={reload}
                      comment={comment}
                      key={comment.id}
                      session={session}
                    />
                  ))}
                </ListGroup>
                {session ? (
                  session.user_id ? (
                    <Form onSubmit={onSubmit}>
                      <Form.Group>
                        <Form.Label>Create Comment</Form.Label>
                        <div className="flex-row">
                          <Form.Control
                            type="text"
                            onChange={updateBody}
                            value={body}
                            placeholder="Text"
                          />
                          <Button variant="outline-success mt-2" type="submit">
                            Save
                          </Button>
                        </div>
                      </Form.Group>
                    </Form>
                  ) : null
                ) : null}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default connect(({ session }) => ({ session }))(ShowPost);
