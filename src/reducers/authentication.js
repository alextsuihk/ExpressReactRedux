const initialState = {
  nickname: '',
  id: '',
  isLoggedIn: false,
  isLoggingIn: false,
  isPasswordChanged: false,
  isPasswordReset: false,
  registrationSucceeded: false,
  username: '',
};

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case 'AUTHENTICATION_LOGIN_ATTEMPT': {
      const newState = Object.assign({}, state);
      newState.isLoggingIn = true;
      return newState;
    }

    case 'AUTHENTICATION_LOGIN_FAILURE':
    case 'AUTHENTICATION_SESSION_CHECK_FAILURE':
    case 'AUTHENTICATION_LOGOUT_SUCCESS': {
      const newState = Object.assign({}, initialState);
      return newState;
    }

    case 'AUTHENTICATION_LOGIN_SUCCESS':
    case 'AUTHENTICATION_SESSION_CHECK_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.nickname = action.json.nickname;
      newState.id = action.json._id;
      newState.isLoggedIn = true;
      newState.isLoggingIn = true;
      newState.username = action.json.username;
      return newState;
    }

    case 'AUTHENTICATION_LOGOUT_FAILURE':
    case 'AUTHENTICATION_REGISTRATION_FAILURE': {
      // handling error in reducers/error.js
      return state;
    }

    case 'AUTHENTICATION_PASSWORD_RESET_CLEAR':
    case 'AUTHENTICATION_PASSWORD_RESET_HASH_FAILURE': {
      const newState = Object.assign({}, state);
      newState.isPasswordReset = false;
      return newState;
    }

    case 'AUTHENTICATION_PASSWORD_RESET_HASH_CREATED': {
      const newState = Object.assign({}, state);
      newState.isPasswordReset = true;
      return newState;
    }

    case 'AUTHENTICATION_PASSWORD_RESET_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.isPasswordChanged = true;
      return newState;
    }

    case 'AUTHENTICATION_PASSWORD_RESET_SUCCESS_CLEAR': {
      const newState = Object.assign({}, state);
      newState.isPasswordChanged = false;
      return newState;
    }

    case 'AUTHENTICATION_REGISTRATION_SUCCESS': {
      const newState = Object.assign({}, state);
      newState.registrationSucceeded = true;
      return newState;
    }

    case 'AUTHENTICATION_REGISTRATION_SUCCESS_VIEWED': {
      const newState = Object.assign({}, state);
      newState.registrationSucceeded = false;
      return newState;
    }

    default: {
      return state;
    }
  }
}
