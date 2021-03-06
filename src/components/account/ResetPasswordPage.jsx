import React from 'react';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Button, FormGroup, Label } from 'reactstrap';

export default class ResetPasswordPage extends React.Component {
  constructor(props) {
    super(props);

    // component state
    this.state = {
      email: '',
    };

    // bound functions
    this.clearPasswordReset = this.clearPasswordReset.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
  }

  // clear out the email form if we're rendering the success message
  componentWillReceiveProps(nextProps) {
    const { isPasswordReset } = nextProps;
    if (isPasswordReset) {
      this.setState({ email: '' });
    }
  }

  // show the form again so a new email can be sent
  clearPasswordReset(e) {
    e.preventDefault();
    const { clearPasswordResetFunction } = this.props;
    clearPasswordResetFunction();
  }

  // update state as email value changes
  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  // catch enter clicks
  handleKeyPress(target) {
    if (target.charCode === 13) {
      this.handleValidSubmit();
    }
  }

  handleValidSubmit() {
    const { resetPasswordRequestFunction } = this.props;
    const formData = this.state;
    resetPasswordRequestFunction(formData.email);
  }

  render() {
    const { isPasswordReset } = this.props;

    if (isPasswordReset) {
      return (
        <div className="row justify-content-center">
          <div className="col-10 col-sm-7 col-md-5 col-lg-4">
            <p>
              An email has been sent, containing a link to reset password.
              Please click that link to proceed with setting a new password.
            </p>
            <p>
              <a href="/account/reset-password" onClick={this.clearPasswordReset}>Re-send Email</a>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="row justify-content-center">
        <div className="col-10 col-sm-7 col-md-5 col-lg-4">
          <p>
               To reset your password, please enter your email below.<br />
            A password reset link will be sent to your mailbox.
          </p>
          <AvForm onValidSubmit={this.handleValidSubmit}>
            <AvGroup>
              <Label for="userEmail">Email</Label>
              <AvInput
                autoComplete="email"
                id="userEmail"
                name="userEmail"
                onChange={this.handleEmailChange}
                onKeyPress={this.handleKeyPress}
                placeholder="name@example.com"
                required
                type="email"
                value={this.state.email}
              />
              <AvFeedback>A valid email is required</AvFeedback>
            </AvGroup>
            <FormGroup>
              <Button color="primary">Reset Password</Button>
            </FormGroup>
          </AvForm>
          <p className="text-danger">
            <strong>Please also check the SPAM box as the email is mistakenly filtered </strong>
          </p>
        </div>
      </div>
    );
  }
}

