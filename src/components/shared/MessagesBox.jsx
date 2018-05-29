import React from 'react';
import { Alert, Table } from 'reactstrap';

export default class MessagesBox extends React.Component {
  constructor(props) {
    super(props);
  }

  listMessages(messages) {
    const { clearMessageFunction } = this.props;

    return messages.map((message, index) => (
      <div key={index}>
        <Alert color={message.type} isOpen toggle={() => clearMessageFunction(index)}>
          { message.message }
        </Alert>
      </div>
    ));
  }

  render() {
    const { messages } = this.props;
    return (
      <div >
        { this.listMessages(messages) }
      </div>
    );
  }
}
