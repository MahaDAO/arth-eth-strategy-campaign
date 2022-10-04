import {BigNumber} from 'ethers';
import {useCallback, useEffect, useState} from 'react';
import {useWallet} from 'use-wallet';

import {useBlockNumber} from '../../state/application/hooks';
import useCore from '../useCore';

type State = {
  isLoading: boolean;
  value: any;
};

const useGetPositionDetails = () => {
  const [balance, setBalance] = useState<State>({isLoading: true, value: {}});

  const core = useCore();
  const {account} = useWallet();
  const blockNumber = useBlockNumber();

  const fetchBalance = useCallback(async () => {
    if (!account) {
      setBalance({isLoading: false, value: BigNumber.from(0)});
      return;
    }
    
    const strategyContract = core.getARTHETHTroveLpStrategy();
    const positionDetails = await strategyContract.positions(account);
    setBalance({isLoading: false, value: positionDetails});
  }, [account, core]);

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

export default useGetPositionDetails;
