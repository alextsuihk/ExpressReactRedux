import { combineReducers } from 'redux';
import AppReducer from '../reducers/app';
//import AlbumsReducer from '../reducers/albums';
//import ArtistsReducer from '../reducers/artists';
import AuthenticationReducer from '../reducers/authentication';
import InventoryReducer from '../reducers/inventory';
//import LatestReducer from '../reducers/latest';
//import ListReducer from '../reducers/list';
import MessagesReducer from '../reducers/messages';
import ProgressReducer from '../reducers/progress';
//import UserReducer from '../reducers/user';

const reducers = {
  app: AppReducer,
//  albums: AlbumsReducer,
//  artists: ArtistsReducer,
  authentication: AuthenticationReducer,
  inventory: InventoryReducer,
//  latest: LatestReducer,
//  list: ListReducer,
  messages: MessagesReducer,
  progress: ProgressReducer,
//  user: UserReducer,
};

export default combineReducers(reducers);
