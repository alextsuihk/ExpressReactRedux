import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearMessage } from '../../actions/messages';

import MessagesBox from './MessagesBox';

class MessagesBoxContainer extends React.Component {
  constructor(props) {
    super(props);

    // Bound Functions
    this.clearMessage = this.clearMessage.bind(this);
  }

  clearMessage(index) {
    const { dispatch } = this.props;
    dispatch(clearMessage(index));
  }

  render() {
    const { messages } = this.props;
    return (
      <MessagesBox messages={messages} clearMessageFunction={this.clearMessage} />
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.messages,
  };
}

export default connect(mapStateToProps)(MessagesBoxContainer);
