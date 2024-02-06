import { combineReducers } from 'redux';
import user from './user';
import themeReducer from './themeReducer';
import colorScheme from './colorscheme';
import products from './products';
import orders from './orders';
import date from './date';

const rootReducer = combineReducers({
  user,
  themeReducer,
  colorScheme,
  products,
  orders,
  date,
});

export default rootReducer;
