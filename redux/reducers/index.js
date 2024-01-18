import { combineReducers } from 'redux';
import user from './user';
import themeReducer from './themeReducer';

const rootReducer = combineReducers({
  user,
  themeReducer,
});

export default rootReducer;
