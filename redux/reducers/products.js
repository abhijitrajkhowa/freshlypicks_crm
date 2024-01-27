import { GET_ALL_PRODUCTS } from '../types';

const products = (state = [], action) => {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
      return (state = action.payload);
  }
  return state;
};

export default products;
