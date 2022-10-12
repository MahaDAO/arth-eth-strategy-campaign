import { ethers, BigNumber, Contract } from 'ethers';
import {useCallback, useEffect, useState} from 'react';
import {useWallet} from 'use-wallet';

import {useBlockNumber} from '../../state/application/hooks';
import useCore from '../useCore';
import { Pool, Position } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'

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
    currentARTHInUniswwap: string
    currentETHInUniswap: string
    inRange: boolean
  };
};

interface Immutables {
  factory: string
  token0: string
  token1: string
  fee: number
  tickSpacing: number
  maxLiquidityPerTick: ethers.BigNumber
}

interface IState {
  liquidity: ethers.BigNumber
  sqrtPriceX96: ethers.BigNumber
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

async function getPoolImmutables(poolContract: Contract) {
  const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
    poolContract.factory(),
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.tickSpacing(),
    poolContract.maxLiquidityPerTick(),
  ])

  const immutables: Immutables = {
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  }
  return immutables
}

async function getPoolState(poolContract: Contract) {
  const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()])

  const PoolState: IState = {
    liquidity,
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  }

  return PoolState
}

const useGetPositionDetails = () => {
  const [balance, setBalance] = useState<State>({isLoading: true, value: {
    uniswapNftId: BigNumber.from(0),
    eth: BigNumber.from(0),
    coll: BigNumber.from(0),
    debt: BigNumber.from(0),
    liquidity: BigNumber.from(0),
    arthInUniswap: BigNumber.from(0),
    ethInUniswap: BigNumber.from(0),
    currentARTHInUniswwap: '0',
    currentETHInUniswap: '0',
    inRange: false
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
        ethInUniswap: BigNumber.from(0),
        currentARTHInUniswwap: '0',
        currentETHInUniswap: '0',
        inRange: false
      }});

      return;
    } else {
      const strategyContract = core.getARTHETHTroveLpStrategy();
      const positionDetails = await strategyContract.positions(account);
      const nftManagerContract  = core.getUniV3PositionManager();
      const nftDetails = await nftManagerContract.positions(positionDetails.uniswapNftId);

      const poolAddress = '0x0ed096027cA87500a4267E5Fe3D3A5D1Dc4fD755';
      const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, core.provider)
      const [immutables, state] = await Promise.all([getPoolImmutables(poolContract), getPoolState(poolContract)]);

      const TokenA = new Token(core._activeNetwork, immutables.token0, 18)
      const TokenB = new Token(core._activeNetwork, immutables.token1, 18)
      const pool = new Pool(
        TokenA,
        TokenB,
        immutables.fee,
        state.sqrtPriceX96.toString(),
        state.liquidity.toString(),
        state.tick
      )

      const position = new Position({ pool, liquidity: state.liquidity.toString(), tickLower: nftDetails.tickLower, tickUpper: nftDetails.tickUpper })
      
      const below = pool && pool.tickCurrent < nftDetails.tickLower;
      const above = pool && pool.tickCurrent >= nftDetails.tickUpper;
      const inRange: boolean = typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false
      
      setBalance(
        {
          isLoading: false, 
          value: { 
            ...positionDetails,
            currentARTHInUniswwap: TokenA.address === core._tokens[core._activeNetwork]['ARTH'].address 
              ? position.amount0.toSignificant(4)
              : position.amount1.toSignificant(4),
            currentETHInUniswap: TokenA.address === core._tokens[core._activeNetwork]['ARTH'].address 
            ? position.amount1.toSignificant(4)
            : position.amount0.toSignificant(4),
            inRange: inRange
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
