import { BigNumber } from 'ethers';
import {useCallback, useEffect, useState} from 'react';
import {useWallet} from 'use-wallet';

import {useBlockNumber} from '../../state/application/hooks';
import useCore from '../useCore';

type State = {
  isLoading: boolean;
  value: {
    uniswapNftId: BigNumber
    eth: BigNumber
    coll: BigNumber
    debt: BigNumber
    liquidity: BigNumber
    arthInUniswap: BigNumber
    ethInUniswap: BigNumber
  };
};

const useGetPositionDetails = () => {
  const [balance, setBalance] = useState<State>({isLoading: true, value: {
    uniswapNftId: BigNumber.from(0),
    eth: BigNumber.from(0),
    coll: BigNumber.from(0),
    debt: BigNumber.from(0),
    liquidity: BigNumber.from(0),
    arthInUniswap: BigNumber.from(0),
    ethInUniswap: BigNumber.from(0)
  }});

  const core = useCore();
  const {account} = useWallet();
  const blockNumber = useBlockNumber();

  const fetchBalance = useCallback(async () => {
    if (!account) {
      setBalance({isLoading: false, value: {
        uniswapNftId: BigNumber.from(0),
        eth: BigNumber.from(0),
        coll: BigNumber.from(0),
        debt: BigNumber.from(0),
        liquidity: BigNumber.from(0),
        arthInUniswap: BigNumber.from(0),
        ethInUniswap: BigNumber.from(0)
      }});

      return;
    } else {
      const strategyContract = core.getARTHETHTroveLpStrategy();
      const positionDetails = await strategyContract.positions(account);
      setBalance({isLoading: false, value: positionDetails});
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
