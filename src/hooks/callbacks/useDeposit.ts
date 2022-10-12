import {useCallback} from 'react';

import {useAddPopup} from '../../state/application/hooks';
import {useTransactionAdder} from '../../state/transactions/hooks';

import useCore from '../useCore';
import formatErrorMessage from '../../utils/formatErrorMessage';
import { DECIMALS_18 } from '../../utils/constants';
import { getDisplayBalance } from '../../utils/formatBalance';
import useGetOutputDetails from '../state/useGetOutputDetails';
import { findHintsForNominalCollateralRatio } from '../../utils';

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

        const [
          upperHint,
          lowerHint,
        ]: string[] = await findHintsForNominalCollateralRatio(
          outputDetails.value.ethColl.mul(DECIMALS_18.mul(100)).div(outputDetails.value.arthDesired),
          core.getSortedTroves(),
          core.getHintHelpers(),
          core.getTroveManager(),
          core.myAccount,
        );

        const troveParams =  {
          maxFee: DECIMALS_18,
          upperHint: upperHint,
          lowerHint: lowerHint,
          ethAmount: outputDetails.value.ethColl,
          arthAmount: outputDetails.value.arthDesired,
        }
        
        const mintParams = {
          tickLower: "-76020",
          tickUpper: "-39120",
          ethAmountMin: 1, // outputDetails.value.ethMin,
          ethAmountDesired: outputDetails.value.eth.sub(outputDetails.value.ethColl),
          arthAmountMin: 1, // outputDetails.value.arthMin,
          arthAmountDesired: outputDetails.value.arthDesired,
        };
        
        const response = await strategyContract.deposit(
          troveParams,
          mintParams,
          1,
          [],
          {
            value: outputDetails.value.eth,
          },
        );
          
        addTransaction(response, {
          summary: `Deposit ${Number(getDisplayBalance(outputDetails.value.eth, 18, 3))} ETH.`
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
