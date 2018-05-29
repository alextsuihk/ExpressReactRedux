const initialState = [];

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'MESSAGE_ADD': {
      let type;
      switch (action.alert.type) {
        case undefined: {
          type = 'info';
          break;
        }
        case 'success':
        case 'info':
        case 'warning':
        case 'danger': {
          type = action.alert.type; // eslint-disable-line
          break;
        }
        default: {
          type = 'warning';
        }
      }

      const newState = [{
        type,
        message: `${action.alert.message ? action.alert.message : ''}`,
      }];

      const maxMessage = 5 - 1;
      const totalMessage = (state.length >= maxMessage) ? maxMessage : state.length;
      let j = 1;
      for (let i = 0; i < totalMessage; i++) {
        newState[j] = state[i];
        j += 1;
      }

      return newState;
    }

    case 'MESSAGE_CLEAR': {
      // ES6 filter,push, map do NOT work, use the classic for loop
      let j = 0;
      const newState = [];
      for (let i = 0; i < state.length; i++) {
        if (i !== action.id) {
          newState[j] = state[i];
          j += 1;
        }
      }
      return newState;
    }

    case 'MESSAGE_CLEAR_ALL': {
      const newState = [];
      return newState;
    }

    default: {
      return state;
    }
  }
}
