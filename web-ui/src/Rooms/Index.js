import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Row, Col, Table } from "react-bootstrap";

function Room({ room }) {
  return (
    <tr>
      <td>
        <Link to={`/rooms/${room.id}`}>{room.name}</Link>
      </td>
    </tr>
  );
}

function AllRooms({ rooms }) {
  let roomFeed = (
    <Col md="8">
      <h2 className="text-center">List of Current Rooms</h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <Room room={room} key={room.id} />
          ))}
        </tbody>
      </Table>
    </Col>
  );


  return (
    <div>
      <h1 className="text-center">Rooms</h1>

      <Row className="justify-content-center">
        {roomFeed}
      </Row>
    </div>
  );
}


export default connect(({ rooms }) => ({ rooms }))(AllRooms);
