import {BigNumber} from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import {useCallback, useEffect, useState} from 'react';
import {useWallet} from 'use-wallet';

import {useBlockNumber} from '../../state/application/hooks';
import { DECIMALS_18 } from '../../utils/constants';
import useCore from '../useCore';

type State = {
  isLoading: boolean;
  value: {
    bnETHAmount: BigNumber;
    bnETHForTrove: BigNumber;
    amount0Desired: BigNumber;
    amount1Desired: BigNumber;
    amount0Min: BigNumber;
    amount1Min: BigNumber;
  };
};

const useGetOutputDetails = (ethAmount: string) => {
  const [balance, setBalance] = useState<State>({
    isLoading: true, 
    value: {
      bnETHAmount: BigNumber.from(0),
      bnETHForTrove: BigNumber.from(0),
      amount0Desired: BigNumber.from(0),
      amount1Desired: BigNumber.from(0),
      amount0Min: BigNumber.from(0),
      amount1Min: BigNumber.from(0),
    }
  });

  const core = useCore();
  const {account} = useWallet();
  const blockNumber = useBlockNumber();

  const fetchBalance = useCallback(async () => {
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
      const mintable: BigNumber = allowedDebt.sub(debt);

      setBalance({
        isLoading: false,
        value: {
          bnETHForTrove,
          bnETHAmount,
          amount0Desired: mintable,
          amount1Desired: bnETHAmount.sub(bnETHForTrove),
          amount0Min: mintable.div(2),
          amount1Min: bnETHAmount.sub(bnETHForTrove).div(2),
        }
      });
  }, [core, ethAmount]);

  useEffect(() => {
    if (core.isUnlocked) {
      fetchBalance().catch((err) =>
        console.error(
          `Failed to fetch token balance of ${account}: ${err.stack} `,
        ),
      );
    }
  }, [blockNumber, account, core.isUnlocked, fetchBalance]);

  return balance;
};

export default useGetOutputDetails;
