import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setAutoRefresh } from '../../actions/app';
import { bidInventory, clearInventory, populateInventory, upsertInventory } from '../../actions/inventory';
//import { deleteAlbum, populateAlbums } from '../../actions/albums';
//import { deleteArtist, populateArtists } from '../../actions/artists';
//import { userClearList, userLookup } from '../../actions/users';

import InventoryPage from './InventoryPage';

class InventoryPageContainer extends React.Component {
  constructor(props) {
    super(props);

    // component state
    this.state = {
    };
  }

  componentWillMount() {
    // Before component mounts, populate offerlist
    const { populateInventoryFunction } = this.props;
    populateInventoryFunction();
  }

  componentWillUnmount() {
    const { clearInventoryFunction } = this.props;
    clearInventoryFunction();
  }

  setAutoRefresh(interval) {
    const { dispatch } = this.props;
    dispatch(setAutoRefresh(interval));
  }

  render() {
    const {
      authentication,
      autoRefresh,
      bidInventoryFunction,
      category,
      inventory,
      setAutoRefreshFunction,
      upsertInventoryFunction,
    } = this.props;


    console.log('Dump Query String: ', this.props.location.search);

    return (
      <InventoryPage
        authentication={authentication}
        autoRefresh={autoRefresh}
        category={category}
        inventory={inventory}
        setAutoRefreshFunction={setAutoRefreshFunction}
        upsertInventoryFunction={upsertInventoryFunction}
        bidInventoryFunction={bidInventoryFunction}
      />
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  upsertInventoryFunction: upsertInventory,
  bidInventoryFunction: bidInventory,
  clearInventoryFunction: clearInventory,
  populateInventoryFunction: populateInventory,
  setAutoRefreshFunction: setAutoRefresh,
  dispatch,
}, dispatch);

const mapStateToProps = state => ({
  authentication: state.authentication,
  autoRefresh: state.app.autoRefresh,
  category: state.app.category,
  inventory: state.inventory,
});

export default connect(mapStateToProps, mapDispatchToProps)(InventoryPageContainer);
