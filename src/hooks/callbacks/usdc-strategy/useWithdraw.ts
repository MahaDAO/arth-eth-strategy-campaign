import {useCallback} from "react";
import {useWallet} from "use-wallet";

import {useAddPopup} from "../../../state/application/hooks";
import {useTransactionAdder} from "../../../state/transactions/hooks";

import useCore from "../../useCore";
import formatErrorMessage from "../../../utils/formatErrorMessage";

const useWithdraw = () => {
  const core = useCore();
  const addPopup = useAddPopup();
  const {account} = useWallet();
  const addTransaction = useTransactionAdder();

  const action = useCallback(
    async (callback?: () => void): Promise<void> => {
      if (!account) return;
      else {
        try {
          const strategyContract = core.getARTHUSDCCurveLpStrategy();

          const gasLimit = (await strategyContract.withdraw())
            .mul(120)
            .div(100); // add 20% more gas limit

          const response = await strategyContract.withdraw({
            gasLimit,
          });

          addTransaction(response, {
            summary: `Withdraw USDC`,
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
    },
    [core, addPopup, account, addTransaction]
  );

  return action;
};

export default useWithdraw;
