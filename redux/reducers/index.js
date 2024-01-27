import { combineReducers } from 'redux';
import user from './user';
import themeReducer from './themeReducer';
import colorScheme from './colorscheme';
import products from './products';

const rootReducer = combineReducers({
  user,
  themeReducer,
  colorScheme,
  products,
});

export default rootReducer;
