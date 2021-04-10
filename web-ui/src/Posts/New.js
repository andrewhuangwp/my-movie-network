import { Row, Col, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { create_post, fetch_posts } from "../api";
import { Unauthorized } from "../Error";

import pick from "lodash/pick";


function NewPost({ session }) {
  const history = useHistory();
  const [post, setPost] = useState({
    name: "",
    body: "",
    user_id: "",
  });

  function onSubmit(ev) {
    ev.preventDefault();

    let data = pick(post, ["name", "body"]);
    data.user_id = session.user_id;
    console.log(data.user_id);
    create_post(data).then((result) => {
      if (result.error) {
        alert("Invalid Params. Try again.");
      } else {
        console.log(result);
        fetch_posts();
        history.push(`/posts/${result.data.id}`);
      }
    });
  }

  function validate(u1) {
    if (u1.name === "" || u1.body ===""){
      return "Name and body cannot be empty."
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
        <Form onSubmit={onSubmit}>
          <h1>Create New Post</h1>
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
        </Form>
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}

export default connect(({ session }) => ({ session }))(NewPost);