import React from 'react';
import { Button, Form, FormGroup, Input, Label, Table } from 'reactstrap';

export default class ListInventory extends React.Component {Component
  constructor(props) {
    super(props);

    // component state
    this.state = {
      comment: '',
      part: '',
      ask: -1,
      qty: -1,
      qtyError: '',
    };

    // bound functions
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Handle Bid input changes
  handleInputChange(e) {
    const key = e.currentTarget.id;
    const val = e.target.value;
    this.setState({ [key]: val });

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
    const { category, upsertInventoryFunction } = this.props;
    const formData = this.state;
    formData.category = category;
    upsertInventoryFunction(formData);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} >
        <FormGroup>
          <h2>You could add new inventory here</h2>
        </FormGroup>
        <FormGroup>
          <Label for="part">Part Number</Label>
          <Input
            id="part"
            name="part"
            onChange={this.handleInputChange}
            placeholder="Part Number"
            required
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <Label for="qty">Qty (如持续供货，请填空)</Label>
          <Input
            id="qty"
            name="qty"
            onChange={this.handleInputChange}
            placeholder="Request Qty"
            required
            type="number"
          />
          { this.state.qtyError }
        </FormGroup>
        <FormGroup>
          <Label for="ask">Ask Price (USD)</Label>
          <Input
            id="ask"
            name="ask"
            onChange={this.handleInputChange}
            placeholder="biding price"
            type="number"
            step=".01"
          />
        </FormGroup>

        <FormGroup>
          <Label for="message">Comment (optional)</Label>
          <Input
            id="comment"
            name="text"
            onChange={this.handleInputChange}
            placeholder="optional message"
            type="textarea"
          />
        </FormGroup>
        <FormGroup>
          <Button color="primary">Submit</Button>
          <Button onClick={this.props.handleDialogAddInventoryToggle}>Close</Button>

        </FormGroup>
      </Form>
    )
  }

}

