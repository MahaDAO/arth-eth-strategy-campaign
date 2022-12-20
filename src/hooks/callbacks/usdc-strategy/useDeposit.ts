import { useCallback } from "react";
import { InterestRate } from '@aave/contract-helpers';

import { useAddPopup } from "../../../state/application/hooks";
import { useTransactionAdder } from "../../../state/transactions/hooks";

import useCore from "../../useCore";
import formatErrorMessage from "../../../utils/formatErrorMessage";
import { getDisplayBalance } from "../../../utils/formatBalance";
import { parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { useWallet } from "use-wallet";

const useDeposit = (usdcAmount: string) => {
  const core = useCore();
  const addPopup = useAddPopup();
  const { account } = useWallet();
  const addTransaction = useTransactionAdder();

  const action = useCallback(
    async (callback?: () => void): Promise<void> => {
      if (!account) return;
      else {
        try {
          const strategyContract = core.getARTHUSDCCurveLpStrategy();

          const usdcAmountBn = BigNumber.from(parseUnits(usdcAmount || "0", 6));
          const usdcForLending = usdcAmountBn.div(2);
          const usdcForLiquidity = usdcAmountBn.sub(usdcForLending);
          console.log("HERE", usdcForLiquidity);

          const depositParams = {
            arthToBorrow: BigNumber.from(1).pow(18),
            totalUsdcSupplied: usdcAmountBn,
            minUsdcInLp: 0,
            minArthInLp: 0,
            minLiquidityReceived: 0,
            lendingReferralCode: 0,
            interestRateMode: 2
          }

          const gasLimit = (
            await strategyContract.estimateGas.deposit(depositParams)
          )
            .mul(120)
            .div(100); // add 20% more gas limit

          const response = await strategyContract.deposit(depositParams, {
            gasLimit,
          });

          addTransaction(response, {
            summary: `Deposit ${Number(getDisplayBalance(usdcAmountBn, 6, 3))} USDC.`,
          });

          if (callback) callback();
        } catch (e: any) {
          console.log("ERror", e);
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
