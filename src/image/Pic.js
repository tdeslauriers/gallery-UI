import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import "./Pic.css";

import LoadingIndicator from "../common/LoadingIndicator";
import NotFound from "../common/NotFound";
import ServerError from "../common/ServerError";
import { getImage } from "../util/APIUtils";

class Pic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      comments: [],
      isLoading: false,
      notFound: false,
      serverError: false,
    };

    this.loadImage = this.loadImage.bind(this);
  }

  loadImage(uuid) {
    this.setState({
      isLoading: true,
    });

    getImage(uuid)
      .then((response) => {
        this.setState({
          image: response,
          isLoading: false,
        });
      })
      .catch((error) => {
        if (error.status === 404) {
          this.setState({
            notFound: true,
            isLoading: false,
          });
        } else {
          this.setState({
            serverError: true,
            isLoading: false,
          });
        }
      });
  }

  componentWillMount() {
    const uuid = this.props.match.params.uuid;
    this.loadImage(uuid);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.uuid !== this.props.match.params.uuid) {
      this.loadImage(this.props.match.params.uuid);
    }
  }

  render() {
    const { image, comments } = this.state;
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    if (this.state.notFound) {
      return <NotFound />;
    }
    if (this.state.serverError) {
      return <ServerError />;
    }
    return (
      <div name="container">
        <div className="pic-title">
          <h1>Title: {image.description}</h1>
        </div>
        <div className="pic">
          <img
            className="full-resolution"
            alt="full-resolution"
            src={
              process.env.PUBLIC_URL + `/images/fullresolution/${image.name}`
            }
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Pic);
