import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';

import { useBlockNumber } from '../../state/application/hooks';
import useCore from '../useCore';

type State = {
  isLoading: boolean;
  value: {
    isActive: boolean;
    ethForLoan: BigNumber
    arthFromLoan: BigNumber
    arthInLendingPool: BigNumber
  };
};

const useGetPositionDetails = () => {
  const [balance, setBalance] = useState<State>({
    isLoading: true,
    value: {
      isActive: false,
      ethForLoan: BigNumber.from(0),
      arthFromLoan: BigNumber.from(0),
      arthInLendingPool: BigNumber.from(0),
    }
  });

  const core = useCore();
  const { account } = useWallet();
  const blockNumber = useBlockNumber();

  const fetchBalance = useCallback(async () => {
    if (!account) {
      setBalance({
        isLoading: false,
        value: {
          isActive: false,
          ethForLoan: BigNumber.from(0),
          arthFromLoan: BigNumber.from(0),
          arthInLendingPool: BigNumber.from(0),
        }
      });

      return;
    } else {
      const strategyContract = core.getARTHETHTroveLpStrategy();
      const positionDetails = await strategyContract.positions(account);

      setBalance(
        {
          isLoading: false,
          value: {
            ...positionDetails,
          }
        }
      );
    }
  }, [account, core]);

  useEffect(() => {
    if (core.isUnlocked) {
      fetchBalance().catch((err) =>
        console.error(
          `Failed to fetch position details of ${account}: ${err.stack} `,
        ),
      );
    }
  }, [blockNumber, account, core.isUnlocked, fetchBalance]);

  return balance;
};

export default useGetPositionDetails;
