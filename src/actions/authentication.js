import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './progress';
import { addMessage, addErrorMessage, clearAllMessages } from './messages';

// Action Creators
export const loginAttempt = () => ({ type: 'AUTHENTICATION_LOGIN_ATTEMPT' });
export const loginFailure = error => ({ type: 'AUTHENTICATION_LOGIN_FAILURE', error });
export const loginSuccess = json => ({ type: 'AUTHENTICATION_LOGIN_SUCCESS', json });
export const logoutFailure = error => ({ type: 'AUTHENTICATION_LOGOUT_FAILURE', error });
export const logoutSuccess = () => ({ type: 'AUTHENTICATION_LOGOUT_SUCCESS' });
export const registrationFailure = error => ({ type: 'AUTHENTICATION_REGISTRATION_FAILURE', error });
export const registrationSuccess = () => ({ type: 'AUTHENTICATION_REGISTRATION_SUCCESS' });
export const registrationSuccessViewed = () => ({ type: 'AUTHENTICATION_REGISTRATION_SUCCESS_VIEWED' });
export const passwordResetClear = () => ({ type: 'AUTHENTICATION_PASSWORD_RESET_CLEAR' });
export const passwordResetFailure = error => ({ type: 'AUTHENTICATION_PASSWORD_RESET_FAILURE', error });
export const passwordResetSuccess = () => ({ type: 'AUTHENTICATION_PASSWORD_RESET_SUCCESS' });
export const passwordResetSuccessClear = () => ({ type: 'AUTHENTICATION_PASSWORD_RESET_SUCCESS_CLEAR' });
export const passwordResetHashCreated = () => ({ type: 'AUTHENTICATION_PASSWORD_RESET_HASH_CREATED' });
export const passwordResetHashFailure = error => ({ type: 'AUTHENTICATION_PASSWORD_RESET_HASH_FAILURE', error });
export const sessionCheckFailure = () => ({ type: 'AUTHENTICATION_SESSION_CHECK_FAILURE' });
export const sessionCheckSuccess = json => ({ type: 'AUTHENTICATION_SESSION_CHECK_SUCCESS', json });

// Check User Session
export function checkSession() {
  return async (dispatch) => {
    // contact API
    await fetch(
      // where to contact
      '/api/authentication/checksession',
      // what to send
      {
        method: 'GET',
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((json) => {
        if (json.username) {
          return dispatch(sessionCheckSuccess(json));
        }
        return dispatch(sessionCheckFailure());
      })
      .catch((error) => {
        dispatch(sessionCheckFailure(error));
        dispatch(addErrorMessage(`Network Connection Issue (1551) ${error}`));
      });
  };
}

// Log User in
export function logUserIn(userData) {
  return async (dispatch) => {
    // turn on spinner
    dispatch(incrementProgress());

    // register that a login attempt is being made
    dispatch(loginAttempt());

    // contact login API
    await fetch(
      // where to contact
      '/api/authentication/login',
      // what to send
      {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((json) => {
        if (json && json.enabled) {
          if (!json.emailVerified) {
            dispatch(addMessage({ type: 'warning', message: 'You email has NOT been verified' }));
          }
          dispatch(loginSuccess(json));
          dispatch(addMessage({ type: 'info', message: `Welcome Back, ${json.nickname}` }));
        } else if (json && !json.enabled) {
          dispatch(loginFailure());
          dispatch(addErrorMessage('Your account has been suspended (1152), please contact admin@component.asia'));
        } else {
          dispatch(loginFailure());
          dispatch(addErrorMessage(`Email or Password incorrect. Please try again ${JSON.stringify(json)}`));
        }
      })
      .catch((error) => {
        dispatch(loginFailure(new Error(error)));
        dispatch(addErrorMessage(`Network Connection Issue (1151) ${error}`));
      });

    // turn on spinner
    return dispatch(decrementProgress());
  };
}

// Log User Out
export function logUserOut() {
  return async (dispatch) => {
    // clear all message on screen
    dispatch(clearAllMessages());

    // turn on spinner
    dispatch(incrementProgress());

    // contact API
    await fetch(
      // where to contact
      '/api/authentication/logout',
      // what to send
      {
        method: 'GET',
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          dispatch(logoutSuccess());
        } else {
          dispatch(logoutFailure(new Error(response.status)));
          dispatch(addErrorMessage(`Logout Failure (1651)${response.status}`));
        }
      })
      .catch((error) => {
        dispatch(logoutFailure(new Error(error)));
        dispatch(addErrorMessage(`Network Connection Issue (1652)${Error(error)}`));
      });

    // turn off spinner
    return dispatch(decrementProgress());
  };
}

// Register a user
export function registerUser(userData) {
  return async (dispatch) => {
    // turn on spinner
    dispatch(incrementProgress());

    // contact the API
    await fetch(
      // where to contact
      '/api/authentication/register',
      // what to send
      {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then(async (json) => {
        if (json && json.username) {
          await dispatch(loginSuccess(json));
          await dispatch(registrationSuccess());
          dispatch(addMessage({ type: 'success', message: `Welcome, ${json.nickname}. Please check email to complete registration` }));
        } else {
          dispatch(registrationFailure(new Error(json.error)));
          dispatch(addErrorMessage(`Registration Fails. ${json.error} Please try again (1251)`));
        }
      })
      .catch((error) => {
        dispatch(registrationFailure(new Error(error)));
        dispatch(addErrorMessage(`Registration Fails (1252) ${error}`));
      });

    // turn off spinner
    return dispatch(decrementProgress());
  };
}

// send Email to API for hashing: request to an email to reset password
export function passwordResetRequest(email) {
  return async (dispatch) => {
    // turn on spinner
    dispatch(incrementProgress());
    // contact the API

    await fetch(
      // where to contact
      '/api/authentication/requestpasswordreset',
      // what to send
      {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((json) => {
        if (json.success) {
          return dispatch(passwordResetHashCreated(json));
        }
        dispatch(passwordResetHashFailure(new Error(json.error)));
        return dispatch(addErrorMessage(`Request Password Reset Fails. Please try again (1451) ${json.error}`));
      })
      .catch((error) => {
        dispatch(passwordResetHashFailure(error));
        dispatch(addErrorMessage(`Network Connection Issue. Please retry again (1452) ${error}`));
      });

    // turn on spinner
    return dispatch(decrementProgress());
  };
}

// Reset Password
export function passwordResetConfirm(data) {
  return async (dispatch) => {
    // turn on spinner
    dispatch(incrementProgress());

    // contact the API
    await fetch(
      // where to contact
      '/api/authentication/confirmpasswordreset',
      // what to send
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((json) => {
        if (json && json.success) {
          dispatch(passwordResetSuccess());
        } else {
          dispatch(passwordResetFailure(new Error(json.error)));
          dispatch(addErrorMessage(`Password Reset Fails (1351) ${json.error}`));
        }
      })
      .catch((error) => {
        dispatch(passwordResetFailure(new Error(error)));
        dispatch(addErrorMessage(`Network Connection Issue. Please retry again (1352)' ${error}`));
      });

    // turn off spinner
    return dispatch(decrementProgress());
  };
}
