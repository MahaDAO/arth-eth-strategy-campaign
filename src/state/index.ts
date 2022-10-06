import {createLogger} from 'redux-logger';
import {load, save} from 'redux-localstorage-simple';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import {isProduction} from "../analytics/Mixpanel";
import application from './application/reducer';
import transactions from './transactions/reducer';
import chains from './chains/reducer';
import slippage from './slippage/reducer';

const PERSISTED_KEYS: string[] = ['transactions', 'slippage'];

const store = configureStore({
  reducer: {
    application,
    transactions,
    chains,
    slippage,
  },
  middleware: isProduction
    ? [
      ...getDefaultMiddleware({serializableCheck: false, thunk: false}),
      save({states: PERSISTED_KEYS}),
    ]
    : [
      ...getDefaultMiddleware({serializableCheck: false, thunk: false}),
      save({states: PERSISTED_KEYS}),
      createLogger(),
    ]
  ,
  preloadedState: load({states: PERSISTED_KEYS}),
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
