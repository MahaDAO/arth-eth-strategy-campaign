import { createReducer } from '@reduxjs/toolkit';

import { updateSlippage } from './actions';

export interface ApplicationState {
  id: number;
  value: number;
}

const initialState: ApplicationState = {
  id: 1,
  value: 0.1,
};

export default createReducer(initialState, (builder) =>
  builder.addCase(updateSlippage, (state, action) => {
    state.value = action.payload.value;
    state.id = action.payload.id;
  }),
);
