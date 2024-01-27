import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import promiseMiddleware from 'redux-promise';
import rootReducer from '../reducers';

import getAllProductData from '../actions/getAllProductData';

const ConfigureStore = () => {
  const store = configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(promiseMiddleware),
    reducer: rootReducer,
  });

  store.dispatch(getAllProductData());

  return store;
};

export default ConfigureStore;
