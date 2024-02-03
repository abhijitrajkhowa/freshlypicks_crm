import { baseUrl } from '../../utils/helper';
import { GET_ALL_ORDERS } from '../types';

const getAllOrders = () => {
  return async (dispatch) => {
    try {
      const response = await window.electron.invoke('api-request', {
        method: 'GET',
        url: `${baseUrl}/get-all-orders`,
      });
      const data = JSON.parse(response.body);
      if (!data.error) {
        dispatch({
          type: GET_ALL_ORDERS,
          payload: data.orders,
        });
        return data.orders;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};

export default getAllOrders;
