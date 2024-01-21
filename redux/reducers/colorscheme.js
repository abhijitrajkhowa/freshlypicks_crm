import { SET_COLOR_SCHEME } from '../types';

const colorScheme = (state = 'blue', action) => {
  switch (action.type) {
    case SET_COLOR_SCHEME:
      return (state = action.payload || 'blue');
    default:
      return state;
  }
};

export default colorScheme;
