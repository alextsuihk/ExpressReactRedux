import React from 'react';
import { connect } from 'react-redux';
import { passwordResetConfirm, passwordResetSuccessClear } from '../../actions/authentication';
import ResetPassword2Page from './ResetPassword2Page';

export class ResetPassword2PageContainer extends React.Component {
  constructor(props) {
    super(props);

    // Bound functions
    this.sendPasswordFunction = this.sendPasswordFunction.bind(this);
  }

  // Clear password changed state on unmount
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(passwordResetSuccessClear());
  }

  sendPasswordFunction(password) {
    const { dispatch } = this.props;
    const data = {
      hash: this.props.match.params.hash,
      password,
    };
    dispatch(passwordResetConfirm(data));
  }

  render() {
    const { authentication } = this.props;
    return (
      <ResetPassword2Page
        authentication={authentication}
        sendPasswordFunction={this.sendPasswordFunction}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
  };
}

export default connect(mapStateToProps)(ResetPassword2PageContainer);
