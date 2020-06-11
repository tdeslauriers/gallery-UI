import React, { Component } from "react";

class Home extends Component {
  constructor(props) {
    super(props);
    this.setState = {
      isLoading: false,
    };
  }
  render() {
    return (
      <div>
        <div className="container p-3">
          <div>
            <h2>This is the home page for my homies.</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
