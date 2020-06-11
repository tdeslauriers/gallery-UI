import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";

import "./Gallery.css";

import LoadingIndicator from "../common/LoadingIndicator";
import NotFound from "../common/NotFound";
import ServerError from "../common/ServerError";

import { getImageList } from "../util/APIUtils";

import { Card, Row, Col, Icon, Divider, Button } from "antd";
const { Meta } = Card;

class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pics: [],
      isLoading: false,
    };
    this.loadAlbumList = this.loadAlbumList.bind(this);
  }

  loadAlbumList(album) {
    this.setState({
      isLoading: true,
    });

    getImageList(album)
      .then((response) => {
        this.setState({
          pics: response,
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

  componentDidMount() {
    const album = this.props.match.params.album;
    this.loadAlbumList(album);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.album !== this.props.match.params.album) {
      this.loadAlbumList(this.props.match.params.album);
    }
  }

  render() {
    const { pics } = this.state;
    const album = this.props.match.params.album;
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
      <div>
        <Row type="flex" justify="space-between" align="bottom">
          {pics.map((pic) => (
            <Col span={4} className="picCol" key={pic.uuid}>
              <Link to={process.env.PUBLIC_URL + `/gallery/pic/` + pic.uuid}>
                <Card
                  hoverable
                  actions={[
                    <Icon type="picture" key="picture" />,
                    <Icon type="edit" key="edit" />,
                  ]}
                  className="img-thumbnail"
                  style={{ width: 150 }}
                  cover={
                    <img
                      alt="thumbnails"
                      src={
                        process.env.PUBLIC_URL + `/images/thumbs/${pic.name}`
                      }
                    />
                  }
                >
                  <Meta disabled description={pic.description} />
                </Card>
              </Link>
              <div>
                <Divider />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default withRouter(Gallery);
