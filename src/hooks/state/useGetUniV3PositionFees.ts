import { BigNumber, Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import useCore from '../useCore';

import { useBlockNumber } from '../../state/application/hooks';
import { useWallet } from 'use-wallet';
import { MAX_UINT128 } from '../../utils/constants'
import ABI from '../../protocol/deployments/abi';

type IState = {
  isLoading: boolean,
  value: {
    arthAmount: BigNumber;
    ethAmount: BigNumber;
  }
}

const useGetUniV3PositionFees = (tokenId: BigNumber) => {
  const [balance, setBalance] = useState<IState>({
    isLoading: true,
    value: {
      arthAmount: BigNumber.from(0),
      ethAmount: BigNumber.from(0),
    }
  });

  const core = useCore();
  const { account } = useWallet();
  const blockNumber = useBlockNumber();

  const fetchBalance = useCallback(async () => {
    if (tokenId.lte(0)) {
      setBalance({
        isLoading: false,
        value: {
          arthAmount: BigNumber.from(0),
          ethAmount: BigNumber.from(0),
        }
      });
      return;
    } else {
      const signedContract = core.getUniV3PositionManager();

      const contract = new Contract(signedContract.address, ABI.UniV3PositionManager, core.provider);
      const owner = await contract.ownerOf(tokenId);

      const bal = await contract.callStatic.collect(
        {
          tokenId: tokenId,
          recipient: owner, // some tokens might fail if transferred to address(0)
          amount0Max: MAX_UINT128,
          amount1Max: MAX_UINT128,
        },
        {
          from: owner
        }
      );
      setBalance({ isLoading: false, value: { arthAmount: bal.amount0, ethAmount: bal.amount1 } });
    }
  }, [core, tokenId]);

  useEffect(() => {
    if (core && account) {
      fetchBalance().catch((err) => {
        setBalance({
          isLoading: false,
          value: {
            arthAmount: BigNumber.from(0),
            ethAmount: BigNumber.from(0),
          }
        });
        console.error(
          `Failed to fetch fee rewards ${account}: ${err.stack} `,
        );
      });
    } else {
      setBalance({
        isLoading: false,
        value: {
          arthAmount: BigNumber.from(0),
          ethAmount: BigNumber.from(0),
        }
      });
    }
  }, [account, blockNumber, core, tokenId, fetchBalance]);

  return balance;
};

export default useGetUniV3PositionFees;
