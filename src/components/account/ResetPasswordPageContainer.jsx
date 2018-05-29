import React from 'react';
import { connect } from 'react-redux';
import { passwordResetRequest, passwordResetClear } from '../../actions/authentication';

import ResetPasswordPage from './ResetPasswordPage';

export class ResetPasswordPageContainer extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.clearPasswordResetFunction = this.clearPasswordResetFunction.bind(this);
    this.resetPasswordRequestFunction = this.resetPasswordRequestFunction.bind(this);
  }

  clearPasswordResetFunction() {
    const { dispatch } = this.props;
    dispatch(passwordResetClear());
  }

  resetPasswordRequestFunction(email) {
    const { dispatch } = this.props;
    dispatch(passwordResetRequest(email));
  }

  render() {
    const { isPasswordReset } = this.props.authentication;
    return (
      <ResetPasswordPage
        clearPasswordResetFunction={this.clearPasswordResetFunction}
        isPasswordReset={isPasswordReset}
        resetPasswordRequestFunction={this.resetPasswordRequestFunction}
      />
    );
  }
}

const mapStateToProps = state => ({ authentication: state.authentication });

export default connect(mapStateToProps)(ResetPasswordPageContainer);
