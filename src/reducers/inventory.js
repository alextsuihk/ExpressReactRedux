const initialState = [];

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'INVENTORY_POPULATE_SUCCESS': {
      const newState = action.json;
      return newState;
    }

    case 'INVENTORY_CLEAR_SUCCESS':
    case 'INVENTORY_POPULATE_FAILURE': {
      const newState = Object.assign({}, initialState);
      return newState;
    }

    default: {
      return state;
    }
  }
}
