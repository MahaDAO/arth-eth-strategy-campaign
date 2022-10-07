import {useCallback} from 'react';

import {useAddPopup} from '../../state/application/hooks';
import {useTransactionAdder} from '../../state/transactions/hooks';

import useCore from '../useCore';
import formatErrorMessage from '../../utils/formatErrorMessage';
import { DECIMALS_18, ZERO_ADDRESS } from '../../utils/constants';
import { getDisplayBalance } from '../../utils/formatBalance';
import useGetOutputDetails from '../state/useGetOutputDetails';

const useDeposit = (ethAmount: string) => {
  const core = useCore();
  const addPopup = useAddPopup();
  const addTransaction = useTransactionAdder();
  const outputDetails = useGetOutputDetails(ethAmount);

  const action = useCallback(async (callback?: () => void): Promise<void> => {
    if (outputDetails.isLoading) return;
    else {
      try {
        const strategyContract = core.getARTHETHTroveLpStrategy();

        const troveParams =  {
          maxFee: DECIMALS_18,
          upperHint: ZERO_ADDRESS,
          lowerHint: ZERO_ADDRESS
        }
        
        const mintParams = {
          token0: core._tokens[core._activeNetwork]['ARTH'],
          token1: core._tokens[core._activeNetwork]['WETH'],
          fee: "3000",
          tickLower: "62160",
          tickUpper: "69060",
          amount0Desired: outputDetails.value.amount0Desired,
          amount1Desired: outputDetails.value.amount1Desired,
          amount0Min: outputDetails.value.amount0Min,
          amount1Min: outputDetails.value.amount1Min,
          recipient: strategyContract.address,
          deadline: Math.floor(Date.now() / 1000) + 10 * 60,
        };
        
        const response = await strategyContract.deposit(
          outputDetails.value.amount0Desired,
          outputDetails.value.bnETHForTrove,
          troveParams,
          mintParams,
          1,
          [0x0, 0x0],
          {
            value: outputDetails.value.bnETHAmount
          },
        );
          
        addTransaction(response, {
          summary: `Deposit ${Number(getDisplayBalance(outputDetails.value.bnETHAmount, 18, 3))},.`
        });
  
        if (callback) callback();
      } catch (e: any) {
        addPopup({
          error: {
            message: formatErrorMessage(e?.data?.message || e?.message),
            stack: e?.stack,
          },
        });
      }
    }
  }, [core, addPopup, outputDetails, addTransaction]);

  return action;
}

export default useDeposit;
