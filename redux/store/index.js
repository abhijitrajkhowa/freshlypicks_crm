import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import promiseMiddleware from 'redux-promise';
import rootReducer from '../reducers';

const ConfigureStore = () => {
  const store = configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(promiseMiddleware),
    reducer: rootReducer,
  });

  return store;
};

export default ConfigureStore;
