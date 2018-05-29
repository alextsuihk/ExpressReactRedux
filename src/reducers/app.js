const initialState = {
  autoRefresh: 0,
  lang: 'en-us',
  category: 'memory',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_AUTO_REFRESH': {
      const newState = Object.assign({}, state);
      newState.autoRefresh = action.autoRefresh;
      return newState;
    }

    case 'SET_LANGUAGE': {
      const newState = Object.assign({}, state);
      newState.lang = action.lang;
      return newState;
    }

    case 'SET_CATEOGRY': {
      const newState = Object.assign({}, state);
      newState.category = action.category;
      return newState;
    }

    default: {
      return state;
    }
  }
}
