import { useCallback } from "react";

import { useAddPopup } from "../../state/application/hooks";
import { useTransactionAdder } from "../../state/transactions/hooks";

import useCore from "../useCore";
import formatErrorMessage from "../../utils/formatErrorMessage";
import { DECIMALS_18 } from "../../utils/constants";
import { getDisplayBalance } from "../../utils/formatBalance";
import { findHintsForNominalCollateralRatio } from "../../utils";
import { useWallet } from "use-wallet";
import useGetBorrowingFeeRateWithDecay from "../state/TroveManager/useGetBorrowingFeeRateWithDecay";
import { parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";

const useDeposit = (ethAmount: string) => {
  const core = useCore();
  const addPopup = useAddPopup();
  const { account } = useWallet();
  const addTransaction = useTransactionAdder();
  const borrowingFeeRate = useGetBorrowingFeeRateWithDecay();

  const action = useCallback(
    async (onSuccess: () => void, callback?: () => void): Promise<void> => {
      if (!account) return;
      else {
        try {
          const priceContract = core.getPriceFeed();
          const strategyContract = core.getARTHETHTroveLpStrategy();
          const trove = core.getTroveManager();

          const eth = parseUnits(ethAmount || "0", 18);
          const price: BigNumber = await priceContract.callStatic.fetchPrice();

          const arthDesired: BigNumber = eth
            .mul(price)
            .mul(100)
            .div(310)
            .div(DECIMALS_18);

          // arthDesired = arthDesired
          //   .sub(arthDesired.mul(borrowingFeeRate.value).div(DECIMALS_18))
          //   .sub(DECIMALS_18.mul(50));

          const troveStatus = await trove.Troves(strategyContract.address);
          const newETH = eth.add(troveStatus.coll);
          const newARTH = arthDesired.add(troveStatus.debt);

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
            arthAmount: arthDesired,
          };

          const gasLimit = (
            await strategyContract.estimateGas.deposit(
              loanParams.maxFee,
              loanParams.upperHint,
              loanParams.lowerHint,
              loanParams.arthAmount,
              {
                value: eth,
              }
            )
          )
            .mul(120)
            .div(100); // add 20% more gas limit

          const response = await strategyContract.deposit(
            loanParams.maxFee,
            loanParams.upperHint,
            loanParams.lowerHint,
            loanParams.arthAmount,
            {
              value: eth,
              gasLimit,
            }
          );

          addTransaction(response, {
            summary: `Deposit ${Number(getDisplayBalance(eth, 18, 3))} ETH.`,
          });

          const tx = await response.wait();

          if (tx?.status === 1) onSuccess();
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
    [core, addPopup, account, borrowingFeeRate, ethAmount, addTransaction]
  );

  return action;
};

export default useDeposit;
