import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../index';

import { updateSlippage } from './actions';

export function useUpdateSlippage(): (id: number, slippage: number) => void {
  const dispatch = useDispatch();

  return useCallback(
    (id: number, slippage: number) => dispatch(updateSlippage({ id, value: slippage })),
    [dispatch],
  );
}

export function useSlippage(): AppState['slippage'] {
  return useSelector((state: AppState) => state.slippage);
}
