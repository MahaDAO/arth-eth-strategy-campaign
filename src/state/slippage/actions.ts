import { createAction } from '@reduxjs/toolkit';

export const updateSlippage = createAction<{ id: number; value: number }>(
  'slippage/updateSlippage',
);
