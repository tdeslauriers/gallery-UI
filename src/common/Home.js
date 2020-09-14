import React, { Component } from "react";

class Home extends Component {
  constructor(props) {
    super(props);
    this.setState = {
      isLoading: false
    };
  }
  render() {
    return (
      <div>
        {this.props.isAuthenticated ? (
          <div className="container p-3">
            <div>
              <h2>This is the home page for my homies.</h2>
            </div>
          </div>
        ) : (
          <div className="container-fluid p-3">
            <div>
              <h2>Please login to continue.</h2>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Home;
