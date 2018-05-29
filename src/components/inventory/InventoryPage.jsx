import React from 'react';
import { Button, Form, FormGroup, Input, Label, Table } from 'reactstrap';

import ListInventory from './ListInventory';
import AddInventory from './AddInventory';


//import { UpdateInventory } from ''


export default class InventoryPage extends React.Component {
  constructor(props) {
    super(props);

    // component state
    this.state = {
      dialogAddInventory: false,
    };

    // bound functions
    this.handleAutoRefreshDropDownOnChange = this.handleAutoRefreshDropDownOnChange.bind(this);
    this.handleDialogAddInventoryToggle = this.handleDialogAddInventoryToggle.bind(this);
  }

  //implement auto-refresh in componentMount ?

  handleAutoRefreshDropDownOnChange(event) {
    const { setAutoRefreshFunction } = this.props;
    const autoRefreshValue = event.target.value;
    setAutoRefreshFunction(autoRefreshValue);
  }


  // Handle Dialog Add Invnetory
  handleDialogAddInventoryToggle() {
    this.setState({
      dialogAddInventory: !this.state.dialogAddInventory,
    });
  }


  renderAutoRefreshDropDown() {
    const { autoRefresh } = this.props;

    const refreshOptions = [
      { name: 'Disabled', interval: 0 },
      { name: '30 seconds', interval: 30 },
      { name: '1 minute', interval: 60 },
      { name: '15 minutes', interval: 900 },
      { name: '30 minutes', interval: 1800 },
    ];
    const optionItems = refreshOptions.map(refresh =>
      <option key={refresh.interval} value={refresh.interval}>{refresh.name}</option>);

    return (
      <span>
        <select id="autoRefresh" onChange={this.handleAutoRefreshDropDownOnChange} value={autoRefresh}>
          {optionItems}
        </select>
      </span>
    );
  }

  render() {
    const {
      bidInventoryFunction,
      category,
      inventory,
      upsertInventoryFunction,
    } = this.props;

    const { isLoggedIn } = this.props.authentication;

    return (
      <div>
        <div>
          <span style={{ float: 'left' }}>Change Language (Pending)</span>
          { isLoggedIn ?
            <Button
              color="info"
              className="float_center"
              onClick={this.handleDialogAddInventoryToggle}
              value="add"
            > {this.state.dialogAddInventory ? 'Close Dialog' : 'Add Inventory' }
            </Button>
            : null
          }

          <span style={{ float: 'right' }}>Auto Refresh interval: { this.renderAutoRefreshDropDown() }</span>
        </div>
        <div style={{ clear: 'both' }}>
          { this.state.dialogAddInventory ? <AddInventory
            upsertInventoryFunction={upsertInventoryFunction}
            category={category}
            handleDialogAddInventoryToggle={this.handleDialogAddInventoryToggle}
          /> : null }
          { !inventory ? 'Loading......' : null }
          { inventory && inventory.length === 0 ? 'No Data' : null }
          { inventory && inventory.length > 0 ? <ListInventory
            bidInventoryFunction={bidInventoryFunction}
            inventory={inventory}
            isLoggedIn={isLoggedIn}
          /> : null}
        </div>

      </div>
    );
  }
}
