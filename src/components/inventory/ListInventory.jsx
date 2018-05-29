import React from 'react';
import { Button, Form, FormGroup, Input, Label, Table } from 'reactstrap';


const  formatNumber = (number) => {
  const nStr = number.toString(10);
  const x = nStr.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? `.${x[1]}` : '';
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    // x1 = x1.replace(rgx, '$1' + ',' + '$2');
    x1 = x1.replace(rgx, '$1,$2');
  }
  return x1 + x2;
};


export default class ListInventory extends React.Component {Component
  constructor(props) {
    super(props);

    // component state
    this.state = {
      id: null,
      comment: '',
      bid: -1,
      qty: -1,
      qtyError: '',
    };

    // bound functions
    this.handleDialogDropDownOnChange = this.handleDialogDropDownOnChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  // Handle Bid input changes
  handleInputChange(e, id = null) {
    const key = e.currentTarget.id;
    const val = e.target.value;
    this.setState({ [key]: val });
    this.setState({id: id});

    if (key === 'qty') {
      if (parseInt(val, 10) === parseFloat(val)) {
        this.setState({ qtyError: '' });
      } else {
        this.setState({ qtyError: 'WARNING: Qty must be an Integer' });
      }
    }
  }

  // Handle Submit Bid
  handleSubmit(e) {
    const { category, bidInventoryFunction } = this.props;
    const formData = this.state;
    formData.category = category;
    bidInventoryFunction(formData);
  }

  // Handle Dialog selection dropdown menu
  handleDialogDropDownOnChange(event, index = 0) {
    this.setState({
      dialogAction: event.target.value,
      dialogItemIndex: index,
    });
  }

  createTable(inventory) {
    return (
      <Table className="two-row-table" responsive>
        <thead>
          <tr>
            <th>卖方信用</th>
            <th>Part Number</th>
            <th>数量</th>
            <th>单价<br />(美元未税)</th>
            <th>人民币<br />拆算价</th>
            <th>交货地点</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{ this.listInventory(inventory) }</tbody>
      </Table>
    );
  }

  listInventory(inventory) {
    //const { user, authentication } = this.props;
    return inventory.map((item, index) => [
      <tr key={item._id}>
        <td>原厂(良)</td>
        <td>{item.part}</td>
        <td>
          { item.qty === -1 && <span>持续供货</span>}
          { item.qty === 0 && <span>不详</span>}
          { item.qty > 0 ? formatNumber(item.qty) : null}
        </td>
        <td>${item.ask}</td>
        <td>--</td>
        <td>{item.loc}</td>
        <td>{this.renderDialogDropDown(index)}</td>
      </tr>,
      <tr key={item.createdAt}>{ this.renderDialogBox(index, this.state.dialogAction, item) }</tr>,

    ]);
  }

  renderDialogBox(index, action = null, item = null) {
    if (index !== this.state.dialogItemIndex) {
      return null;
    }

    switch (action) {
      case 'bid':
        return this.renderDialogBoxBid(item, index);

      case 'detail':
        return null;

      default:
        return null;
    }
  }


  renderDialogBoxBid(item, index) {
    return (
      <td colSpan="7">
        <div className="row justify-content-center">
          <div className="col-10 dialog-box">
            "Show Warning Message if any"<br />
            <Form inline onSubmit={this.handleSubmit}>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="qty" className="mr-sm-2">需求数量</Label>
                <Input
                  id="qty"
                  name="qty"
                  onChange={event => this.handleInputChange(event, item._id)}
                  placeholder="Request Qty"
                  required
                  type="number"
                />
                { this.state.qtyError }
              </FormGroup>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="bid" className="mr-sm-2">目标价格</Label>
                <Input
                  id="bid"
                  name="bid"
                  onChange={event => this.handleInputChange(event, item._id)}
                  placeholder="biding price"
                  type="number"
                  step=".01"
                />
              </FormGroup>
              <FormGroup className="mb-6 mr-sm-10 mb-sm-0">
                <Label for="message">留言</Label>
                <Input
                  id="comment"
                  name="text"
                  onChange={event => this.handleInputChange(event, item._id)}
                  placeholder="optional message"
                  type="textarea"
                />
              </FormGroup>
              <FormGroup>
                <Button color="primary">Submit</Button>
                <Button onClick={event => this.handleDialogDropDownOnChange(event, index)} value="">Close</Button>

              </FormGroup>
            </Form>
          </div>
        </div>
      </td>
    );
  }

  renderDialogDropDown(index) {
    let { dialogAction } = this.state;

    if (this.state.dialogItemIndex !== index) {
      dialogAction = '';
    }

    const dialogOptions = ['', 'bid', 'detail', 'update', 'close'];
    const optionItems = dialogOptions.map(dialog =>
      <option key={dialog} value={dialog}>{dialog}</option>);

    return (
      <span>
        <select id="dialogAction" onChange={event => this.handleDialogDropDownOnChange(event, index)} value={dialogAction}>
          {optionItems}
        </select>
      </span>
    );
  }


  render() {
    const { inventory } = this.props;
    return (
      <div>
        {this.createTable(inventory)}
      </div>
    )
  }
}