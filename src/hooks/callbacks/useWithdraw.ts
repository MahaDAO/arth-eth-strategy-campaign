import { useCallback } from 'react';
import { BigNumber } from 'ethers';
import { useWallet } from 'use-wallet';

import { useAddPopup } from '../../state/application/hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';

import useCore from '../useCore';
import formatErrorMessage from '../../utils/formatErrorMessage';
import { DECIMALS_18 } from '../../utils/constants';
import { getDisplayBalance } from '../../utils/formatBalance';
import { findHintsForNominalCollateralRatio } from '../../utils';

const useWithdraw = (ethAmount: BigNumber, arthAmount: BigNumber) => {
  const core = useCore();
  const addPopup = useAddPopup();
  const { account } = useWallet();
  const addTransaction = useTransactionAdder();

  const action = useCallback(async (callback?: () => void): Promise<void> => {
    if (!account) return;

    else {
      try {
        const strategyContract = core.getARTHETHTroveLpStrategy();
        const trove = core.getTroveManager();

        const troveStatus = await trove.Troves(strategyContract.address);
        const newETH = troveStatus.coll.sub(ethAmount);
        const newARTH = troveStatus.debt.sub(arthAmount);

        const [upperHint, lowerHint]: string[] =
          await findHintsForNominalCollateralRatio(
            newETH.mul(DECIMALS_18.mul(100)).div(newARTH),
            core.getSortedTroves(),
            core.getHintHelpers(),
            core.getTroveManager(),
            core.myAccount
          );

        const loanParams = {
          maxFee: DECIMALS_18,
          upperHint: upperHint,
          lowerHint: lowerHint,
          arthAmount: 0
        }

        const response = await strategyContract.withdraw(loanParams);

        addTransaction(response, {
          summary: `Withdraw ${Number(getDisplayBalance(ethAmount, 18, 3))} ETH`
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
  }, [core, addPopup, account, ethAmount, arthAmount, addTransaction]);

  return action;
}

export default useWithdraw;
