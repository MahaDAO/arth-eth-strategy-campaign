import {useCallback} from 'react';

import {useAddPopup} from '../../state/application/hooks';
import {useTransactionAdder} from '../../state/transactions/hooks';

import useCore from '../useCore';
import formatErrorMessage from '../../utils/formatErrorMessage';

const useClaimRewards = () => {
  const core = useCore();
  const addPopup = useAddPopup();
  const addTransaction = useTransactionAdder();

  const action = useCallback(async (callback?: () => void): Promise<void> => {
    try {
      const strategyContract = core.getARTHETHTroveLpStrategy();
      const response = await strategyContract.collectRewards();
        
      addTransaction(response, {
        summary: `Claim rewards.`
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
  }, [core, addPopup, addTransaction]);

  return action;
}

export default useClaimRewards;
