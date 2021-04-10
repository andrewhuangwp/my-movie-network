import { Row, Col, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { create_list, fetch_lists } from "../api";
import { Unauthorized } from "../Error";

import pick from "lodash/pick";


function NewList({ session }) {
  const history = useHistory();
  const [list, setList] = useState({
    name: "",
    user_id: "",
  });

  function onSubmit(ev) {
    ev.preventDefault();

    let data = pick(list, ["name"]);
    data.user_id = session.user_id;
    create_list(data).then((result) => {
      if (result.error) {
        alert("Invalid Params. Try again.");
      } else {
        console.log(result);
        fetch_lists();
        history.push(`/lists/${result.data.id}`);
      }
    });
  }

  function validate(u1) {
    if (u1.name === ""){
      return "Name cannot be empty."
    }

    return "";
  }

  function update(field, ev) {
    let u1 = Object.assign({}, list);
    u1[field] = ev.target.value;
    u1.pass_msg = validate(u1);
    setList(u1);
  }

  return (
    <div>
      {session !== null ? (
        <Form onSubmit={onSubmit}>
          <h1>Create New List</h1>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              onChange={(ev) => update("name", ev)}
              value={list.name}
            />
          </Form.Group>
          <p className="text-danger">{list.pass_msg}</p>
          <Button
            variant="primary"
            type="submit"
            disabled={list.pass_msg !== ""}
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

export default connect(({ session }) => ({ session }))(NewList);