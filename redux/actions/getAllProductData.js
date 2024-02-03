import { baseUrl } from '../../utils/helper';
import { GET_ALL_PRODUCTS } from '../types';

const getAllProductData = () => {
  return async (dispatch) => {
    try {
      const response = await window.electron.invoke('api-request', {
        method: 'GET',
        url: `${baseUrl}/get-all-products`,
      });
      const data = JSON.parse(response.body);
      if (!data.error) {
        dispatch({
          type: GET_ALL_PRODUCTS,
          payload: data.products,
        });
        return data.products;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};

export default getAllProductData;
