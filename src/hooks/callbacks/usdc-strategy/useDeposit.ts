import {useCallback} from "react";

import {useAddPopup} from "../../../state/application/hooks";
import {useTransactionAdder} from "../../../state/transactions/hooks";

import useCore from "../../useCore";
import formatErrorMessage from "../../../utils/formatErrorMessage";
import {formatToBN, getDisplayBalance} from "../../../utils/formatBalance";
import {parseUnits} from "ethers/lib/utils";
import {BigNumber} from "ethers";
import {useWallet} from "use-wallet";
import {BNZERO} from "../../../utils/constants";

const useDeposit = (usdcAmount: string) => {
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

          const usdcAmountBn = formatToBN(usdcAmount, 6);

          console.log('usdcAmountBn', usdcAmountBn, usdcAmount, getDisplayBalance(usdcAmountBn, 6, 3));

          /* const depositParams = {
             usdcSupplied: usdcAmountBn,
             minLiquidityReceived: BNZERO,
           }

           const gasLimit = (
             await strategyContract.estimateGas.deposit(usdcAmountBn, BNZERO)
           )
             .mul(120)
             .div(100); // add 20% more gas limit

           const response = await strategyContract.deposit(usdcAmountBn, BNZERO, {
             gasLimit,
           });*/

          const response = await strategyContract.deposit(usdcAmountBn, BNZERO);

          addTransaction(response, {
            summary: `Deposit ${Number(getDisplayBalance(usdcAmountBn, 6, 3))} USDC.`,
          });

          if (callback) callback();
        } catch (e: any) {
          console.log("useDeposit error", e);
          addPopup({
            error: {
              message: formatErrorMessage(e?.data?.message || e?.message),
              stack: e?.stack,
            },
          });
        }
      }
    },
    [core, addPopup, account, usdcAmount, addTransaction]
  );

  return action;
};

export default useDeposit;
