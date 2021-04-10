import { Row, Col, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { create_room, fetch_rooms } from "../api";
import { Unauthorized } from "../Error";

import pick from "lodash/pick";


function NewRoom({ session }) {
  const history = useHistory();
  const [room, setRoom] = useState({
    name: "",
    pass_msg: "",
  });

  function onSubmit(ev) {
    ev.preventDefault();

    let data = pick(room, ["name"]);
    create_room(data).then((result) => {
      if (result.error) {
        alert("Invalid Params. Try again.");
      } else {
        console.log(result);
        fetch_rooms();
        history.push(`/rooms/${result.data.id}`);
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
    let u1 = Object.assign({}, room);
    u1[field] = ev.target.value;
    u1.pass_msg = validate(u1);
    setRoom(u1);
  }

  return (
    <div>
      {session !== null ? (
        <Form onSubmit={onSubmit}>
          <h1>Create New Chat Room</h1>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              onChange={(ev) => update("name", ev)}
              value={room.name}
            />
          </Form.Group>
          <p className="text-danger">{room.pass_msg}</p>
          <Button
            variant="primary"
            type="submit"
            disabled={room.pass_msg !== ""}
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

export default connect(({ session }) => ({ session }))(NewRoom);