import { useCallback } from 'react';
import { BigNumber } from 'ethers';
import { useWallet } from 'use-wallet';

import { useAddPopup } from '../../state/application/hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';

import useCore from '../useCore';
import formatErrorMessage from '../../utils/formatErrorMessage';
import { DECIMALS_18, ZERO_ADDRESS } from '../../utils/constants';

const useWithdraw = (tokenId: BigNumber, liquidity: BigNumber, ethInUniV3: BigNumber, arthInUniV3: BigNumber) => {
  const core = useCore();
  const addPopup = useAddPopup();
  const { account } = useWallet();
  const addTransaction = useTransactionAdder();

  const action = useCallback(async (callback?: () => void): Promise<void> => {
    if (!account) return;

    else {
      try {
        const strategyContract = core.getARTHETHTroveLpStrategy();

        const loanParams = {
          maxFee: DECIMALS_18,
          upperHint: ZERO_ADDRESS,
          lowerHint: ZERO_ADDRESS,
          arthAmount: 0
        }

        const response = await strategyContract.withdraw(loanParams);

        addTransaction(response, {
          summary: `Withdraw from ARTH/ETH pool.`
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
  }, [core, addPopup, account, addTransaction]);

  return action;
}

export default useWithdraw;
