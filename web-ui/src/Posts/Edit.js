import { Row, Col, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  put_post,
  get_post,
  delete_post,
  fetch_users,
  fetch_posts,
} from "../api";
import { Unauthorized } from "../Error";

import pick from "lodash/pick";

function EditPost({ session }) {
  const history = useHistory();
  const { id } = useParams();
  const [post, setPost] = useState({
    name: "",
    body: "",
    user_id: "",
    pass_msg: "",
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    get_post(id)
      .then((result) => {
        console.log(result);
        setPost({
          name: result.data.name,
          body: result.data.body,
          user_id: "",
          pass_msg: "",
        });
      })
      .catch((err) => {
        setError(true);
      });
  }, []);

  function onSubmit(ev) {
    ev.preventDefault();

    let data = pick(post, ["name", "body"]);
    data.user_id = session.user_id;
    put_post(id, {id, post: data}).then((result) => {
      if (result.error) {
        alert("Invalid Params. Try again.");
      } else {
        fetch_posts();
        history.push(`/posts/${result.data.id}`);
      }
    });
  }

  function deletePost() {
    delete_post(id).then((data) => {
      if (data.error) {
        alert("Invalid Params. Try again.");
      } else {
        fetch_posts();
        history.push("/");
      }
    });
  }

  function validate(u1) {
    if (u1.name === "" || u1.body === "") {
      return "Name and body cannot be empty.";
    }

    return "";
  }

  function update(field, ev) {
    let u1 = Object.assign({}, post);
    u1[field] = ev.target.value;
    u1.pass_msg = validate(u1);
    setPost(u1);
  }


  return (
    <div>
      {session !== null ? (
        error ? (
          <Unauthorized />
        ) : (
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(ev) => update("name", ev)}
                value={post.name}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Body</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                onChange={(ev) => update("body", ev)}
                value={post.body}
              />
            </Form.Group>
            <p className="text-danger">{post.pass_msg}</p>
            <Button
              variant="primary"
              type="submit"
              disabled={post.pass_msg !== ""}
            >
              Save
            </Button>
            <Button className="ml-2" variant="danger" onClick={deletePost}>
              Delete
            </Button>
          </Form>
        )
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}

export default connect(({ session }) => ({ session }))(EditPost);