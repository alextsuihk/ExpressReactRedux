// Action Creators
export const clearMessage = id => ({ type: 'MESSAGE_CLEAR', id });
export const clearAllMessages = () => ({ type: 'MESSAGE_CLEAR_ALL' });
export const addMessage = alert => ({ type: 'MESSAGE_ADD', alert });
export const addErrorMessage = error => ({ type: 'MESSAGE_ADD', alert: { type: 'danger', message: error } });
