import React, { Component } from "react";
import Login from "../user/login/Login";

class Home extends Component {
  constructor(props) {
    super(props);
    this.setState = {
      isLoading: false
    };
  }
  render() {
    // if (!this.props.isAuthenticated) {
    //   return <Login />;
    // }
    return (
      <div>
        <div className="container-fluid p-3">
          <div>
            <h2>This is the home page for my homies.</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
