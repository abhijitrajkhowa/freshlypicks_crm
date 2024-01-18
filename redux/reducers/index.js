import { combineReducers } from 'redux';
import user from './user';
import themeReducer from './themeReducer';
import colorScheme from './colorscheme';

const rootReducer = combineReducers({
  user,
  themeReducer,
  colorScheme,
});

export default rootReducer;
