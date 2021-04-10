import { useEffect, useState, React } from "react";
import { connect } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Table, Container, Button } from "react-bootstrap";
import {
  fetch_rooms,
  fetch_lists,
  fetch_posts,
  fetch_stats,
  fetch_users,
  load_defaults,
  get_movies,
  get_user,
} from "./api";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  VerticalBarSeries,
  ChartLabel,
  LineSeries,
  HeatmapSeries,
} from "react-vis";
import { NotFound } from "./Error";

function YearPopularity({ movies }) {
  let data = [];
  let map = new Map();
  movies.map((movie) => {
    let date = parseInt(movie.movie.release_date);
    if (map.get(date) !== undefined) {
      map.set(date, map.get(date) + 1);
    } else {
      map.set(date, 1);
    }
  });
  const iterator = map.keys();
  for (let i = 0; i < map.size; i++) {
    let key = iterator.next().value;
    if (key !== undefined) {
      let value = map.get(key);
      data.push({ x: key, y: value });
    }
  }
  return (
    <XYPlot xType="ordinal" width={600} height={600}>
      <XAxis />
      <YAxis />
      <ChartLabel
        text="X Axis"
        className="alt-x-label"
        includeMargin={false}
        xPercent={0.025}
        yPercent={1.01}
      />
      <ChartLabel
        text="Y Axis"
        className="alt-y-label"
        includeMargin={false}
        xPercent={0.06}
        yPercent={0.06}
        style={{
          transform: "rotate(-90)",
          textAnchor: "end",
        }}
      />
      <HorizontalGridLines />
      <VerticalGridLines />
      <LineSeries data={data} />
    </XYPlot>
  );
}

function TopFive({ movies }) {
  let data = [];
  let map = new Map();
  movies.map((movie) => {
    if (map.get(movie.movie.title) !== undefined) {
      map.set(movie.movie.title, map.get(movie.movie.title) + 1);
    } else {
      map.set(movie.movie.title, 1);
    }
  });

  let sorted = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
  console.log(sorted);

  const iterator = sorted.keys();
  for (let i = 0; i < 5; i++) {
    let key = iterator.next().value;
    if (key !== undefined) {
      let value = sorted.get(key);
      data.push({ x: key, y: value });
    }
  }
  return (
    <XYPlot xType="ordinal" width={600} height={600}>
      <XAxis />
      <YAxis />
      <ChartLabel
        text="X Axis"
        className="alt-x-label"
        includeMargin={false}
        xPercent={0.025}
        yPercent={1.01}
      />
      <ChartLabel
        text="Y Axis"
        className="alt-y-label"
        includeMargin={false}
        xPercent={0.06}
        yPercent={0.06}
        style={{
          transform: "rotate(-90)",
          textAnchor: "end",
        }}
      />
      <HorizontalGridLines />
      <VerticalGridLines />
      <VerticalBarSeries data={data} />
    </XYPlot>
  );
}

function TopFiveActive({ users }) {
  let data = [];
  users.map((user) => {
    let activity = user.lists.length + user.posts.length;
    data.push({x: user.name, y: activity})
  });
  data = data.slice(0, 5);

  return (
    <XYPlot xType="ordinal" width={600} height={600}>
      <XAxis />
      <YAxis />
      <ChartLabel
        text="X Axis"
        className="alt-x-label"
        includeMargin={false}
        xPercent={0.025}
        yPercent={1.01}
      />
      <ChartLabel
        text="Y Axis"
        className="alt-y-label"
        includeMargin={false}
        xPercent={0.06}
        yPercent={0.06}
        style={{
          transform: "rotate(-90)",
          textAnchor: "end",
        }}
      />
      <HorizontalGridLines />
      <VerticalGridLines />
      <VerticalBarSeries data={data} />
    </XYPlot>
  );
}

function TopFiveWriters({ users }) {
  let data = [];
  console.log(users);
  users.map((user) => {
    let count = 0;
    user.posts.map((post) => {
      count += post.body.length;
    })
    data.push({x: user.name, y: count})
  });

  return (
    <XYPlot xType="ordinal" width={600} height={600}>
      <XAxis />
      <YAxis />
      <ChartLabel
        text="X Axis"
        className="alt-x-label"
        includeMargin={false}
        xPercent={0.025}
        yPercent={1.01}
      />
      <ChartLabel
        text="Y Axis"
        className="alt-y-label"
        includeMargin={false}
        xPercent={0.06}
        yPercent={0.06}
        style={{
          transform: "rotate(-90)",
          textAnchor: "end",
        }}
      />
      <HorizontalGridLines />
      <VerticalGridLines />
      <VerticalBarSeries data={data} />
    </XYPlot>
  );
}

function TopFiveLiked({ posts }) {
  let data = [];
  posts.map((post) => {
    let liked = post.likes.length;
    data.push({x: post.name, y: liked})
  });

  return (
    <XYPlot xType="ordinal" width={600} height={600}>
      <XAxis />
      <YAxis />
      <ChartLabel
        text="X Axis"
        className="alt-x-label"
        includeMargin={false}
        xPercent={0.025}
        yPercent={1.01}
      />
      <ChartLabel
        text="Y Axis"
        className="alt-y-label"
        includeMargin={false}
        xPercent={0.06}
        yPercent={0.06}
        style={{
          transform: "rotate(-90)",
          textAnchor: "end",
        }}
      />
      <HorizontalGridLines />
      <VerticalGridLines />
      <VerticalBarSeries data={data} />
    </XYPlot>
  );
}

function TopFiveEngagement({ posts }) {
  let data = [];
  posts.map((post) => {
    let count = post.comments.length;
    data.push({x: post.name, y: count})
  });

  return (
    <XYPlot xType="ordinal" width={600} height={600}>
      <XAxis />
      <YAxis />
      <ChartLabel
        text="X Axis"
        className="alt-x-label"
        includeMargin={false}
        xPercent={0.025}
        yPercent={1.01}
      />
      <ChartLabel
        text="Y Axis"
        className="alt-y-label"
        includeMargin={false}
        xPercent={0.06}
        yPercent={0.06}
        style={{
          transform: "rotate(-90)",
          textAnchor: "end",
        }}
      />
      <HorizontalGridLines />
      <VerticalGridLines />
      <VerticalBarSeries data={data} />
    </XYPlot>
  );
}

function Stats({ session, users, posts }) {
  const [mdata, setMdata] = useState([]);
  const [error, setError] = useState(false);
  console.log(posts);

  useEffect(() => {
    get_movies()
      .then((data) => {
        console.log(data);
        setMdata(data);
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
        <Row className="text-center">
          <Col>
            <h1>Statistics</h1>
            <h3> Top 5 Most Popular Movies</h3>
            <h6> Movie Title vs. Times Added to Lists</h6>
            <TopFive movies={mdata} />
          </Col>
          <Col>
            <h3> Years with Most Popular Movies</h3>
            <h6> Movie Release Date vs. Times Movie Added to Lists</h6>
            <YearPopularity movies={mdata} />
          </Col>
          <Col>
            <h3> Top 5 Most Active Users</h3>
            <h6> User Name vs. Post and List Count</h6>
            <TopFiveActive users={users} />
          </Col>
          <Col>
            <h3> Top 5 Most Written</h3>
            <h6> User Name vs. Characters Written</h6>
            <TopFiveWriters users={users} />
          </Col>
          <Col>
            <h3> Top 5 Most Liked Posts</h3>
            <h6> Post Name vs. Number of Likes</h6>
            <TopFiveLiked posts={posts} />
          </Col>
          <Col>
            <h3> Top 5 Most Engaged Posts</h3>
            <h6> Post Name vs. Number of Comments</h6>
            <TopFiveEngagement posts={posts} />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default connect(({ session, users, posts }) => ({ session, users, posts }))(Stats);
