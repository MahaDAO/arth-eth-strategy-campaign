import {BigNumber} from 'ethers';
import {useCallback} from 'react';
import { parseUnits } from 'ethers/lib/utils';

import {useAddPopup} from '../../state/application/hooks';
import {useTransactionAdder} from '../../state/transactions/hooks';

import useCore from '../useCore';
import formatErrorMessage from '../../utils/formatErrorMessage';
import { DECIMALS_18, ZERO_ADDRESS } from '../../utils/constants';
import { getDisplayBalance } from '../../utils/formatBalance';

const useDeposit = (ethAmount: string) => {
  const core = useCore();
  const addPopup = useAddPopup();
  const addTransaction = useTransactionAdder();

  const action = useCallback(async (callback?: () => void): Promise<void> => {
    try {
      const bnETHAmount = parseUnits(ethAmount || "0", 18);
      const bnETHForTrove = bnETHAmount.div(2);

      const contract = core.getTroveManager();
      const priceContract = core.getPriceFeed();
      const strategyContract = core.getARTHETHTroveLpStrategy();

      const price: BigNumber = await priceContract.callStatic.fetchPrice();
      const trove = await contract.Troves(strategyContract.address);
      const pendingETHRewards = await contract.getPendingETHReward(strategyContract.address);
      const pendingDebt = await contract.getPendingARTHDebtReward(strategyContract.address);

      const debt = trove.debt.add(pendingDebt);
      const coll = trove.coll.add(pendingETHRewards).add(bnETHForTrove);
      const allowedDebt = coll.mul(price).mul(100).div(250).div(DECIMALS_18);
      const mintable = allowedDebt.sub(debt);

      const mintParams = {
        token0: "0x8CC0F052fff7eaD7f2EdCCcaC895502E884a8a71",
        token1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        fee: "3000",
        tickLower: "-73260",
        tickUpper: "-62160",
        amount0Desired: mintable,
        amount1Desired: bnETHAmount.sub(bnETHForTrove),
        amount0Min: mintable.div(2),
        amount1Min: bnETHAmount.sub(bnETHForTrove).div(2),
        recipient: ZERO_ADDRESS,
        deadline: Math.floor(Date.now() / 1000) + 10 * 60,
      };

      const response = await strategyContract.deposit(
        mintable,
        bnETHForTrove,
        DECIMALS_18,
        ZERO_ADDRESS,
        ZERO_ADDRESS,
        mintParams,
        {
          value: bnETHAmount
        },
      );

      addTransaction(response, {
        summary: `Deposit ${Number(getDisplayBalance(bnETHAmount, 18, 3))},.`
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
  }, [core, addPopup, ethAmount, addTransaction]);

  return action;
}

export default useDeposit;
