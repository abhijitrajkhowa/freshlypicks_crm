import { GET_ALL_ORDERS } from '../types';

const orders = (state = [], action) => {
  switch (action.type) {
    case GET_ALL_ORDERS:
      return (state = action.payload);
  }
  return state;
};

export default orders;
