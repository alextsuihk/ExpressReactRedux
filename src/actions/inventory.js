import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './progress';
import { addMessage, addErrorMessage } from './messages';

// Action Creators
export const clearInventory = () => ({ type: 'INVENTORY_CLEAR_SUCCESS' }); // clear inventory list in redux

export const inventoryPopulateFailure = error => ({ type: 'INVENTORY_POPULATE_FAILURE', error });
export const inventoryPopulateSuccess = json => ({ type: 'INVENTORY_POPULATE_SUCCESS', json });


export const inventoryAddFailure = error => ({ type: 'INVENTORY_ADD_FAILURE', error });
export const inventoryAddSuccess = json => ({ type: 'INVENTORY_ADD_SUCCESS', json });
export const inventoryBidFailure = error => ({ type: 'INVENTORY_BID_FAILURE', error });
export const inventoryBidSuccess = json => ({ type: 'INVENTORY_BID_SUCCESS', json });
export const inventoryUpdateFailure = error => ({ type: 'INVENTORY_UPDATE_FAILURE', error });
export const inventoryUpdateSuccess = json => ({ type: 'INVENTORY_UPDATE_SUCCESS', json });
export const inventoryCancelFailure = error => ({ type: 'INVENTORY_CANCEL_FAILURE', error });
export const inventoryCancelSuccess = json => ({ type: 'INVENTORY_CANCEL_SUCCESS', json });
export const inventorySearchFailure = error => ({ type: 'INVENTORY_SEARCH_FAILURE', error });
export const inventorySearchSuccess = json => ({ type: 'INVENTORY_SEARCH_SUCCESS', json });


export const dealCloseFailure = error => ({ type: 'BID_UPDATE_FAILURE', error });
export const dealCloseSuccess = json => ({ type: 'BUD_UPDATE_SUCCESS', json });

// Add/Update Inventory
export function upsertInventory(item) {
  return async (dispatch) => {
    // turn on spinner
    dispatch(incrementProgress());

    // contact the API
    await fetch(
      // where to contact
      '/api/inventory/upsert',
      // what to send
      {
        method: 'POST',
        body: JSON.stringify(item),
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
          dispatch(inventoryAddSuccess(json));
          dispatch(addMessage({ type: 'success', message: 'Inventory is added !' }));
        } else {
          dispatch(inventoryAddFailure(new Error(json.error)));
          dispatch(addErrorMessage(`Add Inventory Fails. ${json.error} Please try again (2252)`));
        }
      })
      .catch((error) => {
        dispatch(inventoryAddFailure(new Error(error)));
        dispatch(addErrorMessage(`Add Inventory Fails (2251) ${error}`));
      });

    // turn off spinner
    return dispatch(decrementProgress());
  };
}


// Bid Inventory (& counter offer)
export function bidInventory(item) {
  return async (dispatch) => {
    dispatch(inventoryBidSuccess());
  }
}


// Populate OfferList
export function populateInventory(UserObjectId = null) {
  return async (dispatch) => {
    // turn on spinner
    dispatch(incrementProgress());

    // Hit API
    await fetch(
      '/api/inventory/populate',
      {
        method: 'POST',
        body: JSON.stringify({
          uid: UserObjectId,
          cateogry: 'memory',
        }),
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
        if (!json.error) {
          return dispatch(inventoryPopulateSuccess(json));
        }
        dispatch(inventoryPopulateFailure(new Error(json.error)));
        return dispatch(addErrorMessage(`Internal Error (2152). Please try again ${JSON.stringify(json)}`));
      })
      .catch((error) => {
        dispatch(inventoryPopulateFailure(new Error(error)))
        dispatch(addErrorMessage(`Network Connection Issue (2151) ${error}`));
      });


    // turn off spinner
    return dispatch(decrementProgress());
  };
}

