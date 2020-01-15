import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authenticated ? (
        <Component {...rest} {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

// class PrivateRoute extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     if (this.props.authenticated) {
//       return <Route {...this.props} />;
//     } else {
//       return <Redirect to="/login" />;
//     }
//   }
// }

export default PrivateRoute;
