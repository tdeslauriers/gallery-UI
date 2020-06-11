import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import "./Profile.css";
import { getUserProfile } from "../../util/APIUtils";
import { Avatar } from "antd";
import { getAvatarColor } from "../../util/Colors";
import { formatDate } from "../../util/Helper";
import LoadingIndicator from "../../common/LoadingIndicator";
import NotFound from "../../common/NotFound";
import ServerError from "../../common/ServerError";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: false,
    };
    this.loadUserProfile = this.loadUserProfile.bind(this);
  }

  loadUserProfile(username) {
    this.setState({
      isLoading: true,
    });

    getUserProfile(username)
      .then((response) => {
        this.setState({
          user: response,
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
    const username = this.props.match.params.username;
    this.loadUserProfile(username);
  }

  componentDidUpdate(nextProps) {
    if (this.props.match.params.username !== nextProps.match.params.username) {
      this.loadUserProfile(nextProps.match.params.username);
    }
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }

    if (this.state.notFound) {
      return <NotFound />;
    }

    if (this.state.serverError) {
      return <ServerError />;
    }
    console.log(this.state.user);
    return (
      <div className="profile">
        {this.state.user ? (
          <div className="user-profile">
            <div className="user-details">
              <div className="user-avatar">
                <Avatar
                  className="user-avatar-circle"
                  style={{
                    backgroundColor: getAvatarColor(this.state.user.lastname),
                  }}
                >
                  {this.state.user.lastname[0].toUpperCase()}
                </Avatar>
              </div>
              <div className="user-summary">
                <div className="first-name">{this.state.user.firstname}</div>
                <div className="last-name">{this.state.user.lastname}</div>
                <div className="username">@{this.state.user.username}</div>
                <div className="user-joined">
                  Joined {formatDate(this.state.user.joinedAt)}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(Profile);
