import {
  Row,
  Col,
  Form,
  Button,
  Image,
  Container,
  Pagination,
} from "react-bootstrap";
import { connect } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { search_movie } from "../api";
import { Unauthorized } from "../Error";

export function Movie({ movie }) {
  let link = "https://image.tmdb.org/t/p/original/" + movie.poster_path;
  let overview = movie.overview.substring(0, 100);
  return (
    <Col xs={3}>
      <h6>{movie.title}</h6>
      <Image src={link} thumbnail />
      <p>Release Date: {movie.release_date}</p>
      <p>Overview: {overview}...</p>
    </Col>
  );
}

function SearchMovie({ session }) {
  const [result, setResult] = useState([]);
  const [active, setActive] = useState(1);
  const [total, setTotal] = useState(null);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");

  function onSubmit(ev) {
    ev.preventDefault();

    let data = encodeURIComponent(query);
    search_movie(data, "1").then((resp) => {
      if (resp.error) {
        alert("Invalid Params. Try again.");
      } else {
        console.log(resp);
        setResult(resp.result.results);
        setActive(resp.result.page);
        setTotal(resp.result.total_pages);
        let temp = [];
        for (let i = 1; i <= resp.result.total_pages; i++) {
          temp.push(
            <Pagination.Item
              key={i}
              active={i == active}
              onClick={(ev) => newQuery(ev)}
            >
              {i}
            </Pagination.Item>
          );
        }
        setItems(temp);
      }
    });
  }

  function newQuery(ev) {
    ev.preventDefault();

    let page = ev.target.outerText;

    let data = encodeURIComponent(query);
    search_movie(data, page).then((resp) => {
      if (resp.error) {
        alert("Invalid Params. Try again.");
      } else {
        console.log(resp);
        setResult(resp.result.results);
        setActive(resp.result.page);
        setTotal(resp.result.total_pages);
        updateItems(resp.result.page, resp.result.total_pages);
      }
    });
  }

  function movePage(page) {

    let data = encodeURIComponent(query);
    search_movie(data, page).then((resp) => {
      if (resp.error) {
        alert("Invalid Params. Try again.");
      } else {
        console.log(resp);
        setResult(resp.result.results);
        setActive(resp.result.page);
        setTotal(resp.result.total_pages);
        updateItems(resp.result.page, resp.result.total_pages);
      }
    });
  }

  function updateItems(page, total) {
    let temp = [];
    for (let i = 1; i <= total; i++) {
      temp.push(
        <Pagination.Item
          key={i}
          active={i == page}
          onClick={(ev) => newQuery(ev)}
        >
          {i}
        </Pagination.Item>
      );
    }
    setItems(temp);
  }

  function update(ev) {
    setQuery(ev.target.value);
  }

  return (
    <div>
      {session !== null ? (
        <Container>
          <Row>
            <Col md={12}>
              <Form onSubmit={onSubmit}>
                <h3>Search for Movies:</h3>
                <Form.Group>
                  <Form.Label>Query</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(ev) => update(ev)}
                    value={query}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Search
                </Button>
              </Form>
            </Col>
          </Row>
          {total ? (
            <Container>
              <Row>
                <Col md={12}>
                  <h4 className="mt-2">Results</h4>
                </Col>
                {result.map((res) => (
                  <Movie key={res.id} movie={res} />
                ))}
              </Row>
              <Row className="justify-content-center" size="lg">
                {}
                <Pagination>
                  <Pagination.First onClick={(ev) => movePage(1)}/>
                  <Pagination.Prev onClick={(ev) => movePage(active - 1)}/>
                  {total > 20 && active > 1 ? <Pagination.Ellipsis /> : null}
                  {items.slice(active - 1, active + 19)}
                  {total > 20 ? <Pagination.Ellipsis /> : null}
                  <Pagination.Next onClick={(ev) => movePage(active + 1)}/>
                  <Pagination.Last onClick={(ev) => movePage(total)}/>
                </Pagination>
              </Row>
            </Container>
          ) : null}
        </Container>
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}

export default connect(({ session }) => ({ session }))(SearchMovie);
