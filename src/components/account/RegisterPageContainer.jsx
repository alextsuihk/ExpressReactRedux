import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { registerUser } from '../../actions/authentication';

import RegisterPage from './RegisterPage';

export class RegisterPageContainer extends React.Component {
  constructor(props) {
    super(props);

    // bound function
    this.registerFunction = this.registerFunction.bind(this);
  }

  registerFunction(userData) {
    const { dispatch } = this.props;
    dispatch(registerUser(userData));
  }

  render() {
    const { isLoggedIn, registrationSucceeded } = this.props.authentication;

    // Forward to a success page if registrationSucceeded
    if (registrationSucceeded) {
      return (
        <Redirect to="/account/registration-success" />
      );
    }

    // User needs to log out before registering
    if (isLoggedIn) {
      return (
        <p>Please log out first before registering as a new user </p>
      );
    }

    // other display the registration form
    return (
      <RegisterPage registerFunction={this.registerFunction} />
    );
  }
}

const mapStateToProps = state => ({ authentication: state.authentication });

export default connect(mapStateToProps)(RegisterPageContainer);
