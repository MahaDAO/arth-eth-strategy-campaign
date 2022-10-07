import {BigNumber} from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import {useCallback, useEffect, useState} from 'react';
import {useWallet} from 'use-wallet';
import { useSlippage } from '../../state/slippage/hooks';

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
  const slippage = useSlippage();
  
  const fetchBalance = useCallback(async () => {
      const bnETHAmount = parseUnits(ethAmount || "0", 18);
      if (bnETHAmount.lte(0)) {
        setBalance({
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

        return;
      } else {
        const bnETHForTrove = bnETHAmount.mul(80).div(100);

        const contract = core.getTroveManager();
        const priceContract = core.getPriceFeed();
        
        const price: BigNumber = await priceContract.callStatic.fetchPrice();

        const allowedDebt = bnETHForTrove.mul(price).mul(100).div(300).div(DECIMALS_18);
        let mintable: BigNumber = allowedDebt;
        const gasCompensation = await contract.ARTH_GAS_COMPENSATION();
        const borrowingFee = await contract.getBorrowingFee(mintable);
        mintable = mintable.sub(borrowingFee).sub(gasCompensation);

        const slippageRounded = Math.floor(slippage.value * 1e3) / 1e3;
        const amount0Min = !Number(slippage.value)
          ? mintable.mul(99).div(100)
          : mintable.sub(mintable.mul(slippageRounded * 1e3).div(1e5));
        const diff = bnETHAmount.sub(bnETHForTrove);
        const amount1Min = !Number(slippage.value)
          ? diff.mul(99).div(100)
          : diff.sub(diff.mul(slippageRounded * 1e3).div(1e5));

        setBalance({
          isLoading: false,
          value: {
            bnETHForTrove,
            bnETHAmount,
            amount0Desired: mintable,
            amount1Desired: bnETHAmount.sub(bnETHForTrove),
            amount0Min: amount0Min,
            amount1Min: amount1Min,
          }
        });
      }
  }, [core, ethAmount,slippage]);

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
