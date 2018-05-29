import React from 'react';
import { Link } from 'react-router-dom';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Button, FormGroup, Label } from 'reactstrap';

export default class ResetPassword2Page extends React.Component {
  constructor(props) {
    super(props);

    // component state
    this.state = {
      password: '',
      passwordConfirm: '',
    };

    // Bound Functions
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
  }

  // Handle input changes
  handleInputChange(e) {
    this.setState({ [e.currentTarget.id]: e.target.value });
  }

  // Catch enter key
  handleKeyPress(target) {
    if (target.charCode === 13) {
      target.preventDefault();
      this.handleValidSubmit();
    }
  }

  // Handle submission once all form data is valid
  handleValidSubmit() {
    const { sendPasswordFunction } = this.props;
    const formData = this.state;
    sendPasswordFunction(formData.password);
  }

  render() {
    const { isPasswordChanged, isLoggedIn } = this.props.authentication;
    // If they have just changed a password, and are NOT logged in
    if (isPasswordChanged && !isLoggedIn) {
      return (
        <div className="row justify-content-center">
          <div className="col-10 col-sm-7 col-md-5 col-lg-4">
            <p>
              Your password is updated, and please &nbsp;
              <Link to="/account/login">login</Link>&nbsp;
               with new password.
            </p>
          </div>
        </div>
      );
    }

    if (isPasswordChanged && isLoggedIn) {
      return (
        <div className="row justify-content-center">
          <div className="col-10 col-sm-7 col-md-5 col-lg-4">
            <p>
              Your new password is accepted and updated.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="row justify-content-center">
        <div className="col-10 col-sm-7 col-md-5 col-lg-4">
          <p>
            Please enter and confirm a new password below to change the password
          </p>

          <AvForm onValidSubmit={this.handleValidSubmit}>
            <AvGroup>
              <Label for="password">Password</Label>
              <AvInput
                autoComplete="password"
                id="password"
                minLength="6"
                name="password"
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
                placeholder="password"
                required
                type="password"
                value={this.state.password}
              />
              <AvFeedback>Password must be at least 6 characters long</AvFeedback>
            </AvGroup>

            <AvGroup>
              <Label for="passwordConfirm">Confirm Password</Label>
              <AvInput
                autoComplete="password"
                id="passwordConfirm"
                minLength="6"
                name="passwordConfirm"
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
                placeholder="password again"
                required
                type="password"
                validate={{ match: { value: 'password' } }}
                value={this.state.passwordConfirm}
              />
              <AvFeedback>Password must match</AvFeedback>
            </AvGroup>

            <FormGroup>
              <Button color="primary">Change Password</Button>
            </FormGroup>

          </AvForm>

        </div>
      </div>
    );
  }
}
