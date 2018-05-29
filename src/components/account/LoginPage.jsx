import React from 'react';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Button, FormGroup, Label } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    // component state
    this.state = {
      credential: '',
      password: '',
    };

    // bound functions
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
  }

  // Handle input changes
  handleInputChange(e) {
    this.setState({ [e.currentTarget.id]: e.target.value });
  }

  // Handle submission once all form data is valid
  handleValidSubmit() {
    const { loginFunction } = this.props;
    const formData = this.state;
    loginFunction(formData);
  }

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-10 col-sm-7 col-md-5 col-lg-4">
          <AvForm onValidSubmit={this.handleValidSubmit}>
            <AvGroup>
              <Label for="credential">Email or Mobile</Label>
              <AvInput
                autoComplete="mobile"
                id="credential"
                name="credential"
                onChange={this.handleInputChange}
                placeholder="email@component.asia"
                required
                type="text"
                value={this.state.credential}
              />
              <AvFeedback>A valid email or mobile is required to log in.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label for="password">Password</Label>
              <AvInput
                autoComplete="password"
                id="password"
                name="password"
                onChange={this.handleInputChange}
                placeholder="密码 password"
                required
                type="password"
                value={this.state.password}
              />
              <AvFeedback>Password is required to log in.</AvFeedback>
            </AvGroup>
            <FormGroup>
              <span><Link to="/account/password-reset">For your password ?</Link></span>
            </FormGroup>
            <FormGroup>
              <Button color="primary">Login</Button>
            </FormGroup>
          </AvForm>
        </div>
      </div>
    );
  }
}
