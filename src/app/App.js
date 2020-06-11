import React, { Component } from "react";
import "./App.css";
import { Route, withRouter, Switch } from "react-router-dom";

import { getCurrentUser, getGalleryNav } from "../util/APIUtils";
import { ACCESS_TOKEN } from "../constants";

import Login from "../user/login/Login";
import Signup from "../user/signup/Signup";
import Home from "../common/Home";
import Profile from "../user/profile/Profile";
import Gallery from "../image/Gallery";
import Pic from "../image/Pic";
import AppHeader from "../common/AppHeader";
import NotFound from "../common/NotFound";
import LoadingIndicator from "../common/LoadingIndicator";
import PrivateRoute from "../common/PrivateRoute";

import { Layout, notification } from "antd";
const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      navs: [],
      isAuthenticated: false,
      isLoading: false,
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.loadNav = this.loadNav.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: "topRight",
      top: 70,
      duration: 3,
    });
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true,
    });
    getCurrentUser()
      .then((response) => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  loadNav() {
    this.setState({
      isLoading: true,
    });
    getGalleryNav().then((response) => {
      this.setState({
        navs: response,
        isAuthenticated: true,
        isLoading: false,
      });
    });
  }

  componentWillMount() {
    this.loadCurrentUser();
    this.loadNav();
  }

  handleLogout(
    redirectTo = "/",
    notificationType = "success",
    description = "You've successfully logged out."
  ) {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      nav: null,
      isAuthenticated: false,
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: "des Lauriers World",
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: "des Lauriers World",
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.loadNav();
    this.props.history.push("/");
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    return (
      <Layout className="app-container">
        <AppHeader
          isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          navs={this.state.navs}
          onLogout={this.handleLogout}
        />
        <Content className="app-content">
          <div className="container">
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Home
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                path="/login"
                render={(props) => (
                  <Login onLogin={this.handleLogin} {...props} />
                )}
              ></Route>
              <Route path="/signup" component={Signup}></Route>
              <PrivateRoute
                authenticated={this.state.isAuthenticated}
                path="/users/:username"
                component={withRouter(Profile)}
                handleLogout={this.handleLogout}
              ></PrivateRoute>
              <PrivateRoute
                authenticated={this.state.isAuthenticated}
                exact
                path="/gallery/:album"
                component={withRouter(Gallery)}
                handleLogout={this.handleLogout}
              ></PrivateRoute>
              <PrivateRoute
                authenticated={this.state.isAuthenticated}
                exact
                path="/gallery/pic/:uuid"
                component={withRouter(Pic)}
              ></PrivateRoute>
              <Route component={NotFound}></Route>
            </Switch>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default withRouter(App);
