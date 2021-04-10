import { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Button, Table, Form } from "react-bootstrap";
import { get_room } from "../api";
import { Unauthorized } from "../Error";
import {
  ch_join,
  ch_new_message,
  ch_join_channel,
  state_update,
} from "../socket";

function MessageView({ message }) {
  return (
    <tr>
      <td>{message.user.name}</td>
      <td>{message.body}</td>
    </tr>
  );
}

function ShowRoom({ session }) {
  const { id } = useParams();
  const history = useHistory();
  const [room, setRoom] = useState({
    name: "",
    messages: [],
  });
  const [msg, setMsg] = useState("");
  const updateRoom = { setRoom: setRoom };

  useEffect(() => {
    get_room(id).then((data) => {
      setRoom({ name: data.name, messages: data.messages });
      ch_join_channel(id, updateRoom);
    });
  }, []);

  function onSubmit(ev) {
    ev.preventDefault();
    let message = { body: msg, user_id: session.user_id, room_id: id };
    ch_new_message(message, updateRoom);
    setMsg("");
  }

  function update(ev) {
    setMsg(ev.target.value);
  }
  return (
    <div>
      {session == null ? (
        <Unauthorized />
      ) : (
        <Row>
          <Col md={12}>
            <h1>Room {room.name}</h1>
            <h3>Messages</h3>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {room.messages ? room.messages.map((mes) => (
                  <MessageView message={mes} key={mes.id} />
                )) : null}
              </tbody>
            </Table>
          </Col>
          <Col>
            <Form onSubmit={onSubmit}>
              <h3>Send New Message</h3>
              <Form.Group>
                <Form.Label>Message</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(ev) => update(ev)}
                  value={msg}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mb-4">
                Send
              </Button>
            </Form>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default connect(({ session }) => ({ session }))(ShowRoom);
