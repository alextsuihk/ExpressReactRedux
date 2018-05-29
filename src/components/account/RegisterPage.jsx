import React from 'react';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Button, FormGroup, Label } from 'reactstrap';

const passwordConfirmMessage = (showMessage, password, passwordConfirm) => {
  if (!showMessage) {
    return null;
  }

  const style = { color: 'red' };
  if (password === passwordConfirm) {
    return (<span>Passwords match correctly</span>);
  }
  return (<span style={style}>Passwords do NOT match</span>);
};

export default class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    // component state
    this.state = {
      nickname: '',
      password: '',
      passwordConfirm: '',
      company: '',
      wechat: '',
      email: '',
      mobile: '',
      passwordMatchShow: false,
    };

    // bound function
    this.handleInputChange = this.handleInputChange.bind(this);
    //this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
  }

  // Handle input changes
  handleInputChange(e) {
    this.setState({ [e.currentTarget.id]: e.target.value });

    if ([e.currentTarget.id][0] === 'password' || [e.currentTarget.id][0] === 'passwordConfirm') {
      this.setState({ passwordMatchShow: true });
    }
  }

  // Handle submission once all form data is valid
  handleValidSubmit() {
    const { registerFunction } = this.props;
    const formData = this.state;
    registerFunction(formData);
  }

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-10 col-sm-7 col-md-5 col-lg-4">
          <h2>Create an Account</h2>
          <AvForm onValidSubmit={this.handleValidSubmit}>

            <AvGroup>
              <Label for="company">公司</Label>
              <AvInput
                autoComplete="company"
                id="company"
                name="company"
                onChange={this.handleInputChange}
                placeholder="公司缩写"
                type="text"
                value={this.state.company}
              />
              <AvFeedback>An username is required.</AvFeedback>
            </AvGroup>

            <AvGroup>
              <Label for="nickname">姓名</Label>
              <AvInput
                autoComplete="name"
                id="nickname"
                name="nickname"
                onChange={this.handleInputChange}
                placeholder="Nickname"
                required
                type="text"
                value={this.state.nickname}
              />
              <AvFeedback>An username is required.</AvFeedback>
            </AvGroup>

            <AvGroup>
              <Label for="password">Password</Label>
              <AvInput
                autoComplete="password"
                id="password"
                minLength="6"
                name="password"
                onChange={this.handleInputChange}
                placeholder="your password"
                required
                type="password"
                value={this.state.password}
              />
              <AvFeedback>Password must have at least 6 characters long</AvFeedback>
{/*              &nbsp;
              <span>
                We recommend a password service like &nbsp;
                <a href="https://www.lastpass.com/" target="_blank" rel="noopener noreferrer">LastPass</a>
                &nbsp;or <a href="https://1password.com/" target="_blank" rel="noopener noreferrer">1Password</a>
              </span>*/}
            </AvGroup>

            <AvGroup>
              <Label for="passwordConfirm">Password Again</Label>
              <AvInput
                id="passwordConfirm"
                autoComplete="new-password"
                name="passwordConfirm"
                onChange={this.handleInputChange}
                placeholder="password again"
                required
                type="password"
                value={this.state.passwordConfirm}
              />
              { passwordConfirmMessage(this.state.passwordMatchShow, this.state.password, this.state.passwordConfirm) }
            </AvGroup>

            <AvGroup>
              <Label for="mobile">手机号码</Label>
              <AvInput
                autoComplete="mobile"
                id="mobile"
                name="mobile"
                onChange={this.handleInputChange}
                placeholder="1234567890"
                required
                type="mobile"
                value={this.state.mobile}
              />
              <AvFeedback>Mobile is required.</AvFeedback>
            </AvGroup>

            <AvGroup>
              <Label for="email">Email</Label>
              <AvInput
                autoComplete="email"
                id="email"
                name="email"
                onChange={this.handleInputChange}
                placeholder="example@component.asia"
                required
                type="email"
                value={this.state.email}
              />
              <AvFeedback>A valid email is required.</AvFeedback>
            </AvGroup>


            <AvGroup>
              <Label for="wechat">微信号</Label>
              <AvInput
                autoComplete="wechat"
                id="wechat"
                name="wechat"
                onChange={this.handleInputChange}
                placeholder="微信号"
                required
                type="text"
                value={this.state.wechat}
              />
              <AvFeedback>Wechat required</AvFeedback>
            </AvGroup>

            <FormGroup>
              <Button color="primary">Register</Button>
            </FormGroup>
          </AvForm>
        </div>
      </div>
    );
  }
}
