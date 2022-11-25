import {useCallback} from 'react';
import { BigNumber } from 'ethers';
import { useWallet } from 'use-wallet';

import {useAddPopup} from '../../state/application/hooks';
import {useTransactionAdder} from '../../state/transactions/hooks';

import useCore from '../useCore';
import formatErrorMessage from '../../utils/formatErrorMessage';
import { DECIMALS_18, ZERO_ADDRESS } from '../../utils/constants';
import { getDisplayBalance } from '../../utils/formatBalance';
import { useSlippage } from '../../state/slippage/hooks';

const useWithdraw = (tokenId: BigNumber, liquidity: BigNumber, ethInUniV3: BigNumber, arthInUniV3: BigNumber) => {
  const core = useCore();
  const addPopup = useAddPopup();
  const slippage = useSlippage();
  const { account } = useWallet();
  const addTransaction = useTransactionAdder();

  const action = useCallback(async (callback?: () => void): Promise<void> => {
    try {
      const strategyContract = core.getARTHETHTroveLpStrategy();

      const troveParams =  {
        maxFee: DECIMALS_18,
        upperHint: ZERO_ADDRESS,
        lowerHint: ZERO_ADDRESS,
      }

      const slippageRounded = Math.floor(slippage.value * 1e3) / 1e3;
      const arthMin = !Number(slippage.value)
        ? arthInUniV3.mul(99).div(100)
        : arthInUniV3.sub(arthInUniV3.mul(slippageRounded * 1e3).div(1e5));
      const ethMin = !Number(slippage.value)
        ? ethInUniV3.mul(99).div(100)
        : ethInUniV3.sub(ethInUniV3.mul(slippageRounded * 1e3).div(1e5));

      const withdrawParams = {
        tokenId: tokenId,
        liquidity: liquidity,
        arthOutMin: arthMin,
        ethOutMin: ethMin
      };

      const withdrawData = strategyContract.interface.encodeFunctionData('withdraw', [troveParams, ethInUniV3, 0, withdrawParams]);
      const flushData = strategyContract.interface.encodeFunctionData('flush', [account, false, 0]);
      const multicall = strategyContract.interface.encodeFunctionData('multicall', [[withdrawData, flushData]]);

      const txn: any = {
        to: strategyContract.address,
        data: multicall,
        value: BigNumber.from(0).toHexString(),
      }

      const provider = core.provider;
      const signer = await provider.getSigner();
      const response = await signer.sendTransaction(txn);

      addTransaction(response, {
        summary: `Withdraw ${Number(getDisplayBalance(liquidity, 18, 3))} from ARTH/ETH pool.`
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
  }, [core, account, addPopup, tokenId, ethInUniV3, liquidity, slippage, arthInUniV3, addTransaction]);

  return action;
}

export default useWithdraw;
