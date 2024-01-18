import { SET_DARK_THEME, SET_LIGHT_THEME } from '../types';

const themeReducer = (state = 'light', action) => {
  switch (action.type) {
    case SET_LIGHT_THEME:
      return 'light';
    case SET_DARK_THEME:
      return 'dark';
    default:
      return state;
  }
};

export default themeReducer;
