import { GET_USER_DATA, CLEAR_USER_DATA } from '../types';

const user = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_DATA:
      return (state = action.payload);
    case CLEAR_USER_DATA:
      return (state = {});
  }
  return state;
};

export default user;
