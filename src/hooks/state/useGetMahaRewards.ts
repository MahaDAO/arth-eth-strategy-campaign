import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import useCore from '../useCore';
import { BasicState } from '../../utils/interface';
import { useBlockNumber } from '../../state/application/hooks';
import { LOADING_DEFAULT_BASIC_STATE, NON_LOADING_DEFAULT_BASIC_STATE } from '../../utils/constants';
import { useWallet } from 'use-wallet';

const useGetMahaRewards = () => {
  const [balance, setBalance] = useState<BasicState>(LOADING_DEFAULT_BASIC_STATE);

  const core = useCore();
  const { account } = useWallet();
  const blockNumber = useBlockNumber();

  const fetchBalance = useCallback(async () => {
    const strategyContract = core.getARTHETHTroveLpStrategy();
    const bal: BigNumber = await strategyContract.earned(account);
    setBalance({ isLoading: false, value: bal });
  }, [core, account]);

  useEffect(() => {
    if (core && account) {
      fetchBalance().catch((err) => {
        setBalance(NON_LOADING_DEFAULT_BASIC_STATE);
        console.error(
          `Failed to fetch maha rewards ${account}: ${err.stack} `,
        );
      });
    } else {
      setBalance(NON_LOADING_DEFAULT_BASIC_STATE);
    }
  }, [account, blockNumber, core, fetchBalance]);

  return balance;
};

export default useGetMahaRewards;
