import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logUserOut } from '../../actions/authentication';
import { setCategory } from '../../actions/app';

import Header from './Header';

class HeaderContainer extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.logUserOutFunction = this.logUserOutFunction.bind(this);
  }

  logUserOutFunction() {
    const { dispatch } = this.props;
    dispatch(logUserOut());
  }

  render() {
    const { authentication, setCategoryFunction } = this.props;
    return (
      <Header 
        authentication={authentication}
        setCategoryFunction={setCategoryFunction}
        logUserOutFunction={this.logUserOutFunction}
      />
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  setCategoryFunction: setCategory,
  dispatch,
}, dispatch);

export default connect(null, mapDispatchToProps)(HeaderContainer);
