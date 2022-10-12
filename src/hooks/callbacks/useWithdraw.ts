import {useCallback} from 'react';

import {useAddPopup} from '../../state/application/hooks';
import {useTransactionAdder} from '../../state/transactions/hooks';

import useCore from '../useCore';
import formatErrorMessage from '../../utils/formatErrorMessage';
import { DECIMALS_18, ZERO_ADDRESS } from '../../utils/constants';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BigNumber } from 'ethers';

const useWithdraw = (tokenId: BigNumber, liquidity: BigNumber, amount0Min: BigNumber, amount1Min: BigNumber) => {
  const core = useCore();
  const addPopup = useAddPopup();
  const addTransaction = useTransactionAdder();

  const action = useCallback(async (callback?: () => void): Promise<void> => {
    try {
      const strategyContract = core.getARTHETHTroveLpStrategy();

      const troveParams =  {
        maxFee: DECIMALS_18,
        upperHint: ZERO_ADDRESS,
        lowerHint: ZERO_ADDRESS,
        ethAmount: BigNumber.from(0),
        arthAmount: BigNumber.from(0),
      }

      const withdrawParams = {
        tokenId: tokenId,
        liquidity: liquidity,
        amount0Min: amount0Min,
        amount1Min: amount1Min,
        deadline: Math.floor(Date.now() / 1000) + 10 * 60
      };

      const response = await strategyContract.withdraw(
        troveParams,
        amount0Min,
        BigNumber.from(0),
        withdrawParams,
      );

      addTransaction(response, {
        summary: `Withdraw ${Number(getDisplayBalance(liquidity, 18, 3))} from ARTH/ETH pool.`
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
  }, [core, addPopup, tokenId, amount0Min, liquidity, amount1Min, addTransaction]);

  return action;
}

export default useWithdraw;
