import React, { Component } from "react";
import {
  signup,
  checkEmailAvailability,
  checkUsernameAvailability
} from "../../util/APIUtils";
import "./Signup.css";
import { Link } from "react-router-dom";
import {
  FIRSTNAME_MIN_LENGTH,
  FIRSTNAME_MAX_LENGTH,
  LASTNAME_MIN_LENGTH,
  LASTNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH
} from "../../constants";
import { Form, Input, Button, notification } from "antd";
const FormItem = Form.Item;

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: {
        value: ""
      },
      lastname: {
        value: ""
      },
      username: {
        value: ""
      },
      email: {
        value: ""
      },
      password: {
        value: ""
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateUsernameAvailability = this.validateUsernameAvailability.bind(
      this
    );
    this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
  }

  handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue)
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const signupRequest = {
      firstname: this.state.firstname.value,
      lastname: this.state.lastname.value,
      email: this.state.email.value,
      username: this.state.username.value,
      password: this.state.password.value
    };
    signup(signupRequest)
      .then(response => {
        notification.success({
          message: "des Lauriers World",
          description:
            "Thanks! You're successfully registered. Please login to continue."
        });
        this.props.history.push("/login");
      })
      .catch(error => {
        notification.error({
          message: "des Lauriers World",
          description:
            error.message || "Sorry! Something went wrong. Please try again."
        });
      });
  }

  isFormValid() {
    return !(
      this.state.firstname.validateStatus === "success" &&
      this.state.lastname.validateStatus === "success" &&
      this.state.email.validateStatus === "success" &&
      this.state.username.validateStatus === "success" &&
      this.state.password.validateStatus === "success"
    );
  }

  render() {
    return (
      <div className="signup-container">
        <h1 className="page-title">Sign Up</h1>
        <div className="signup-content">
          <Form onSubmit={this.handleSubmit} className="signup-form">
            <FormItem
              label="First Name"
              validateStatus={this.state.firstname.validateStatus}
              help={this.state.firstname.errorMsg}
            >
              <Input
                size="large"
                name="firstname"
                autoComplete="off"
                placeholder="First name"
                value={this.state.firstname.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateFirstName)
                }
              />
            </FormItem>
            <FormItem
              label="Last Name"
              validateStatus={this.state.lastname.validateStatus}
              help={this.state.lastname.errorMsg}
            >
              <Input
                size="large"
                name="lastname"
                autoComplete="off"
                placeholder="last name"
                value={this.state.lastname.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateLastName)
                }
              />
            </FormItem>
            <FormItem
              label="Username"
              hasFeedback
              validateStatus={this.state.username.validateStatus}
              help={this.state.username.errorMsg}
            >
              <Input
                size="large"
                name="username"
                autoComplete="off"
                placeholder="Username"
                value={this.state.username.value}
                onBlur={this.validateUsernameAvailability}
                onChange={event =>
                  this.handleInputChange(event, this.validateUsername)
                }
              />
            </FormItem>
            <FormItem
              label="Email"
              hasFeedback
              validateStatus={this.state.email.validateStatus}
              help={this.state.email.errorMsg}
            >
              <Input
                size="large"
                name="email"
                type="email"
                autoComplete="off"
                placeholder="Email"
                value={this.state.email.value}
                onBlur={this.validateEmailAvailability}
                onChange={event =>
                  this.handleInputChange(event, this.validateEmail)
                }
              />
            </FormItem>
            <FormItem
              label="Password"
              validateStatus={this.state.password.validateStatus}
              help={this.state.password.errorMsg}
            >
              <Input
                size="large"
                name="password"
                type="password"
                autoComplete="off"
                placeholder="Password must be between 6 and 50 characters."
                value={this.state.password.value}
                onChange={event =>
                  this.handleInputChange(event, this.validatePassword)
                }
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="signup-form-button"
                disabled={this.isFormValid()}
              >
                Sign Up
              </Button>
              Already registered? <Link to="/login">Login Now!</Link>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }

  // Validation functions called above

  validateFirstName = firstname => {
    if (firstname.length < FIRSTNAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Entry is too short (Minimum ${FIRSTNAME_MIN_LENGTH} characters needed).`
      };
    } else if (firstname.length > FIRSTNAME_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Entry is too long (Maximum ${FIRSTNAME_MAX_LENGTH} characters allowed).`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  validateLastName = lastname => {
    if (lastname.length < LASTNAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Entry is too short (Minimum ${LASTNAME_MIN_LENGTH} characters needed).`
      };
    } else if (lastname.length > LASTNAME_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Entry is too long (Maximum ${LASTNAME_MAX_LENGTH} characters allowed).`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  validateEmail = email => {
    if (!email) {
      return {
        validateStatus: "error",
        errorMsg: "Email may not be empty"
      };
    }

    const EMAIL_REGEX = RegExp("[^@ ]+@[^@ ]+\\.[^@ ]+");
    if (!EMAIL_REGEX.test(email)) {
      return {
        validateStatus: "error",
        errorMsg: "Email not valid"
      };
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed).`
      };
    }

    return {
      validateStatus: null,
      errorMsg: null
    };
  };

  validateUsername = username => {
    if (username.length < USERNAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed).`
      };
    } else if (username.length > USERNAME_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed).`
      };
    } else {
      return {
        validateStatus: null,
        errorMsg: null
      };
    }
  };

  validateUsernameAvailability() {
    const usernameValue = this.state.username.value;
    const usernameValidation = this.validateUsername(usernameValue);

    if (usernameValidation.validateStatus === "error") {
      this.setState({
        username: {
          value: usernameValue,
          ...usernameValidation
        }
      });
      return;
    }

    this.setState({
      username: {
        value: usernameValue,
        validateStatus: "validating",
        errorMsg: null
      }
    });

    checkUsernameAvailability(usernameValue)
      .then(response => {
        if (response.available) {
          this.setState({
            username: {
              value: usernameValue,
              validateStatus: "success",
              errorMsg: null
            }
          });
        } else {
          this.setState({
            username: {
              value: usernameValue,
              validateStatus: "error",
              errorMsg: "This username is already taken"
            }
          });
        }
      })
      .catch(error => {
        // Marking validStatus as success, Form will be rechecked at server.
        this.setState({
          username: {
            value: usernameValue,
            validateStatus: "success",
            errorMsg: null
          }
        });
      });
  }

  validateEmailAvailability() {
    const emailValue = this.state.email.value;
    const emailValidation = this.validateEmail(emailValue);

    if (emailValidation.validateStatus === "error") {
      this.setState({
        email: {
          value: emailValue,
          ...emailValidation
        }
      });
      return;
    }

    this.setState({
      email: {
        value: emailValue,
        validateStatus: "validating",
        errorMsg: null
      }
    });

    checkEmailAvailability(emailValue)
      .then(response => {
        if (response.available) {
          this.setState({
            email: {
              value: emailValue,
              validateStatus: "success",
              errorMsg: null
            }
          });
        } else {
          this.setState({
            email: {
              value: emailValue,
              validateStatus: "error",
              errorMsg: "This email is already registered."
            }
          });
        }
      })
      .catch(error => {
        this.setState({
          email: {
            value: emailValue,
            validateStatus: "success",
            errorMsg: null
          }
        });
      });
  }

  validatePassword = password => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed).`
      };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed).`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };
}

export default Signup;
