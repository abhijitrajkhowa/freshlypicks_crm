import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import promiseMiddleware from 'redux-promise';
import rootReducer from '../reducers';

import getAllProductData from '../actions/getAllProductData';
import getAllOrders from '../actions/getAllOrders';

// const ConfigureStore = () => {
//   const store = configureStore({
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware({
//         immutableCheck: false,
//       }).concat(promiseMiddleware),
//     reducer: rootReducer,
//   });
//   store.dispatch(getAllProductData());
//   store.dispatch(getAllOrders());

//   return store;
// };

// export default ConfigureStore;

const ConfigureStore = () => {
  const store = configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }).concat(promiseMiddleware),
    reducer: rootReducer,
  });
  store.dispatch(getAllProductData());
  store.dispatch(getAllOrders());

  return store;
};

export default ConfigureStore;
