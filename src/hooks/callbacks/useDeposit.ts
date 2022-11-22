import { ethers } from 'ethers';
import {useCallback} from 'react';
import { Pool } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'

import {useAddPopup} from '../../state/application/hooks';
import {useTransactionAdder} from '../../state/transactions/hooks';

import useCore from '../useCore';
import formatErrorMessage from '../../utils/formatErrorMessage';
import { DECIMALS_18 } from '../../utils/constants';
import { getDisplayBalance } from '../../utils/formatBalance';
import useGetOutputDetails from '../state/useGetOutputDetails';
import { findHintsForNominalCollateralRatio, getTickFromPrice } from '../../utils';
import { calculateMinAndMaxPrice } from '../../utils/calculateMinAndMaxPrice';

const useDeposit = (ethAmount: string) => {
  const core = useCore();
  const addPopup = useAddPopup();
  const addTransaction = useTransactionAdder();
  const outputDetails = useGetOutputDetails(ethAmount);

  const action = useCallback(async (callback?: () => void): Promise<void> => {
    const provider = core.provider;
    const poolAddress: string = core.config('poolAddress', core._activeNetwork);
    const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider)

    if (outputDetails.isLoading) return;
    else {
      try {
        const strategyContract = core.getARTHETHTroveLpStrategy();

        const [
          upperHint,
          lowerHint,
        ]: string[] = await findHintsForNominalCollateralRatio(
          outputDetails.value.ethColl.mul(DECIMALS_18.mul(100)).div(outputDetails.value.arthDesired),
          core.getSortedTroves(),
          core.getHintHelpers(),
          core.getTroveManager(),
          core.myAccount,
        );

        const troveParams =  {
          maxFee: DECIMALS_18,
          upperHint: upperHint,
          lowerHint: lowerHint,
          ethAmount: outputDetails.value.ethColl,
          arthAmount: outputDetails.value.arthDesired,
        }
        
        const [, token0, token1, fee, , ] = await Promise.all([
          poolContract.factory(),
          poolContract.token0(),
          poolContract.token1(),
          poolContract.fee(),
          poolContract.tickSpacing(),
          poolContract.maxLiquidityPerTick(),
        ]);
        const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()]);
        const TokenA = new Token(1, token0, 18);
        const TokenB = new Token(1, token1, 18);
        const pool = new Pool(
          TokenA,
          TokenB,
          fee,
          slot.sqrtPriceX96.toString(),
          liquidity.toString(),
          slot.tick
        );
        
        const x: number = token0 === core._tokens[core._activeNetwork]['ARTH'].address
          ? Number(ethers.utils.formatUnits(outputDetails.value.arthMin, 18))
          : Number(ethers.utils.formatUnits(outputDetails.value.ethMin, 18))

        const y: number = token0 === core._tokens[core._activeNetwork]['ARTH'].address
          ? Number(ethers.utils.formatUnits(outputDetails.value.ethMin, 18))
          : Number(ethers.utils.formatUnits(outputDetails.value.arthMin, 18))

        const currentPrice: number = token0 === core._tokens[core._activeNetwork]['ARTH'].address
          ? Number(pool.token0Price.toSignificant(6))
          : Number(pool.token1Price.toSignificant(6))

        const token1V2: number = token0 === core._tokens[core._activeNetwork]['ARTH'].address
          ? Number(ethers.utils.formatUnits(await core._tokens[core._activeNetwork]['ARTH'].balanceOf(poolAddress), 18))
          : Number(ethers.utils.formatUnits(await core._tokens[core._activeNetwork]['WETH'].balanceOf(poolAddress), 18))
        
        const token2V2: number = token0 === core._tokens[core._activeNetwork]['ARTH'].address
        ? Number(ethers.utils.formatUnits(await core._tokens[core._activeNetwork]['WETH'].balanceOf(poolAddress), 18))
        : Number(ethers.utils.formatUnits(await core._tokens[core._activeNetwork]['ARTH'].balanceOf(poolAddress), 18))

        const minMaxPrice = await calculateMinAndMaxPrice(
          x,
          y,
          currentPrice,
          token1V2,
          token2V2,
          2
        );

        const tickLower = getTickFromPrice(
          minMaxPrice.priceMin,
          pool,
          token0 === core._tokens[core._activeNetwork]['ARTH'].address ? 1 : 0
        );

        const tickUpper = getTickFromPrice(
          minMaxPrice.priceMax,
          pool,
          token0 === core._tokens[core._activeNetwork]['ARTH'].address ? 0 : 1
        );
        
        console.log("Prices", minMaxPrice, {tickLower, tickUpper});

        const mintParams = {
          tickLower: tickLower.toString(),
          tickUpper: tickUpper.toString(),
          ethAmountMin: outputDetails.value.ethMin,
          ethAmountDesired: outputDetails.value.eth.sub(outputDetails.value.ethColl),
          arthAmountMin: outputDetails.value.arthMin,
          arthAmountDesired: outputDetails.value.arthDesired,
        };
        
        const response = await strategyContract.deposit(
          troveParams,
          mintParams,
          // TODO: add whitelisting logic here.
          {
            value: outputDetails.value.eth,
          },
        );
          
        addTransaction(response, {
          summary: `Deposit ${Number(getDisplayBalance(outputDetails.value.eth, 18, 3))} ETH.`
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
    }
  }, [core, addPopup, outputDetails, addTransaction]);

  return action;
}

export default useDeposit;
