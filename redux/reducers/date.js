import { GET_DATE, SET_DATE } from '../types';
import moment from 'moment';

const initialState = {
  bookKeeping: moment().format('YYYY-MM-DD'),
  generateBill: moment().format('YYYY-MM-DD'),
  expenses: moment().format('YYYY-MM-DD'),
  inventory: moment().format('YYYY-MM-DD'),
};

const date = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATE:
      return {
        ...state,
        [action.payload.screen]: action.payload.date,
      };
    case GET_DATE:
      return state;
    default:
      return state;
  }
};

export default date;
