import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { useSlippage } from '../../state/slippage/hooks';

import { useBlockNumber } from '../../state/application/hooks';
import { DECIMALS_18 } from '../../utils/constants';
import useCore from '../useCore';
import useGetBorrowingFeeRateWithDecay from './TroveManager/useGetBorrowingFeeRateWithDecay';

type State = {
  isLoading: boolean;
  value: {
    eth: BigNumber;
    ethColl: BigNumber;
    arthDesired: BigNumber;
    ethDesired: BigNumber;
    arthMin: BigNumber;
    ethMin: BigNumber;
  };
};

const useGetOutputDetails = (ethAmount: string) => {
  const [balance, setBalance] = useState<State>({
    isLoading: true,
    value: {
      eth: BigNumber.from(0),
      ethColl: BigNumber.from(0),
      arthDesired: BigNumber.from(0),
      ethDesired: BigNumber.from(0),
      arthMin: BigNumber.from(0),
      ethMin: BigNumber.from(0),
    }
  });

  const core = useCore();
  const { account } = useWallet();
  const blockNumber = useBlockNumber();
  const slippage = useSlippage();
  const borrowingFeeRate = useGetBorrowingFeeRateWithDecay();

  const fetchBalance = useCallback(async () => {
    const priceContract = core.getPriceFeed();
    const eth = parseUnits(ethAmount || "0", 18);

    if (eth.lte(0)) {
      setBalance({
        isLoading: false,
        value: {
          eth: BigNumber.from(0),
          ethColl: BigNumber.from(0),
          arthDesired: BigNumber.from(0),
          ethDesired: BigNumber.from(0),
          arthMin: BigNumber.from(0),
          ethMin: BigNumber.from(0),
        }
      });
      return;
    } else {
      const ethColl = eth.mul(100).div(100);
      const price: BigNumber = await priceContract.callStatic.fetchPrice();
      let arthDesired = ethColl.mul(price).mul(100).div(300).div(DECIMALS_18);
      arthDesired = arthDesired.sub(arthDesired.mul(borrowingFeeRate.value).div(DECIMALS_18)).sub(DECIMALS_18.mul(50));
      const slippageRounded = Math.floor(slippage.value * 1e3) / 1e3;
      const arthMin = !Number(slippage.value)
        ? arthDesired.mul(99).div(100)
        : arthDesired.sub(arthDesired.mul(slippageRounded * 1e3).div(1e5));
      const ethForLp = eth.sub(ethColl);
      const ethMin = !Number(slippage.value)
        ? ethForLp.mul(99).div(100)
        : ethForLp.sub(ethForLp.mul(slippageRounded * 1e3).div(1e5));

      setBalance({
        isLoading: false,
        value: {
          ethColl,
          eth: eth,
          arthDesired,
          arthMin,
          ethMin,
          ethDesired: eth.sub(ethColl)
        }
      });
    }
  }, [core, ethAmount, slippage, borrowingFeeRate]);

  useEffect(() => {
    if (core.isUnlocked) {
      fetchBalance().catch((err) =>
        console.error(
          `Failed to fetch output details of ${account}: ${err.stack} `,
        ),
      );
    }
  }, [blockNumber, account, core.isUnlocked, fetchBalance]);

  return balance;
};

export default useGetOutputDetails;
