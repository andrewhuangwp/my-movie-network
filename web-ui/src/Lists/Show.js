import { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Button,
  Pagination,
  Form,
  Container,
  Image,
} from "react-bootstrap";
import {
  search_movie,
  get_list,
  delete_movie,
  create_movie,
  delete_list,
  fetch_lists,
} from "../api";
import { NotFound, Unauthorized } from "../Error";

export function Movie({ movie }) {
  let link = "https://image.tmdb.org/t/p/original/" + movie.poster_path;
  let overview = movie.overview.substring(0, 100);
  return (
    <Col>
      <h6>{movie.title}</h6>
      <Image src={link} thumbnail />
      <p>Release Date: {movie.release_date}</p>
      <p>Overview: {overview}...</p>
    </Col>
  );
}

function ShowList({ session }) {
  const { id } = useParams();
  const history = useHistory();
  const [list, setList] = useState({
    name: "",
    movies: [],
    user: null,
    user_id: null,
  });
  const [error, setError] = useState(true);

  function isOwner() {
    if (session === null || list.user == null) {
      return false;
    } else {
      return session.user_id === list.user_id;
    }
  }

  useEffect(() => {
    get_list(id)
      .then((data) => {
        setError(false);
        console.log(data);
        setList({
          name: data.name,
          movies: data.movies ? data.movies : [],
          user: data.user,
          user_id: data.user_id,
        });
      })
      .catch((err) => {
        setError(true);
      });
  }, []);

  function reload() {
    get_list(id)
      .then((data) => {
        setError(false);
        console.log(data);
        setList({
          name: data.name,
          movies: data.movies ? data.movies : [],
          user: data.user,
          user_id: data.user_id,
        });
      })
      .catch((err) => {
        setError(true);
      });
  }

  function removeMovie(movie) {
    delete_movie(movie).then((data) => {
      reload();
    });
  }

  function deleteList(list) {
    delete_list(list).then((data) => {
      fetch_lists();
      reload();
    });
  }
  return (
    <div>
      {error ? (
        <NotFound />
      ) : (
        <Container>
          <Row className="justify-content-center">
            <Col>
              <h1>{list.name}</h1>
              {list.user ? <h3> List Created by {list.user.name}</h3> : null}
              {isOwner() ? (
                <Button
                  variant="outline-danger"
                  className="mb-4"
                  onClick={() => {
                    deleteList(id);
                  }}
                >
                  Delete List
                </Button>
              ) : null}
            </Col>
          </Row>
          <Row>
            {list.movies.map((res) => (
              <Col md={3} key={res.id}>
                <Movie movie={res} />
                {isOwner() ? (
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      removeMovie(res.id);
                    }}
                  >
                    Remove from list
                  </Button>
                ) : null}
              </Col>
            ))}
          </Row>
          {isOwner() ? <SearchView list={id} reload={reload} /> : null}
        </Container>
      )}
    </div>
  );
}

function SearchMovie({ session, list, reload }) {
  const [result, setResult] = useState([]);
  const [active, setActive] = useState(1);
  const [total, setTotal] = useState(null);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");

  function addMovie(movie) {
    movie.list_id = list;
    create_movie(movie).then((resp) => {
      console.log(resp);
      reload();
    });
  }

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
                <h3 className="mt-4">Search for Movies:</h3>
                <Form.Group>
                  <Form.Label>Query</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(ev) => update(ev)}
                    value={query}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mb-4">
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
                  <Col md={3} key={res.id}>
                    <Movie movie={res} />
                    <Button
                      variant="outline-success"
                      className="mb-2"
                      onClick={() => {
                        addMovie({
                          api_id: res.id,
                          overview: res.overview,
                          poster_path: res.poster_path,
                          release_date: res.release_date,
                          title: res.title,
                        });
                      }}
                    >
                      Add to list
                    </Button>
                  </Col>
                ))}
              </Row>
              <Row className="justify-content-center" size="lg">
                {}
                <Pagination>
                  <Pagination.First onClick={(ev) => movePage(1)} />
                  <Pagination.Prev
                    onClick={(ev) => movePage(Math.max(active - 1, 1))}
                  />
                  {total > 20 && active > 1 ? <Pagination.Ellipsis /> : null}
                  {items.slice(active - 1, active + 19)}
                  {total > 20 ? <Pagination.Ellipsis /> : null}
                  <Pagination.Next
                    onClick={(ev) => movePage(Math.min(active + 1, total))}
                  />
                  <Pagination.Last onClick={(ev) => movePage(total)} />
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

let SearchView = connect(({ session }, props) => ({
  session: session,
  list: props.list,
  reload: props.reload,
}))(SearchMovie);

export default connect(({ session }) => ({ session }))(ShowList);
