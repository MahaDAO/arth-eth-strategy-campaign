import {BigNumber, Contract} from 'ethers';
import { ZERO_ADDRESS } from './constants';
import { BigNumberish } from '@ethersproject/bignumber';
import assert from 'assert';

import {MAX_UINT_256} from './constants';

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const truncateMiddle = function (
  fullStr: string = '',
  strLen: number,
  separator?: string,
) {
  if (fullStr.length <= strLen) return fullStr;
  separator = separator || '...';

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 3),
    backChars = Math.floor(charsToShow / 3);

  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};

export const InputValidation = function (
  value: string = " ",
  balance: BigNumber,
  collateral: string,
  toCheckFor: ["MAX", "DECIMALS"]
) {
  let returnObj = {
    status: "Success",
    restrict: false,
    msg: "",
  };

  if (toCheckFor.includes("MAX")) {
    if (Number(value) > Number(balance)) {
      returnObj = {
        status: "Warning",
        restrict: true,
        msg: "Input cannot be more than your wallet balance",
      }

      return returnObj;
    }
  }
};

const randomInteger = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

function* generateTrials(totalNumberOfTrials: number): IterableIterator<number> {
  const MAX_TRIALS_AT_ONCE = 2500;
  assert(Number.isInteger(totalNumberOfTrials) && totalNumberOfTrials > 0);
  while (totalNumberOfTrials) {
    const numberOfTrials = Math.min(totalNumberOfTrials, MAX_TRIALS_AT_ONCE);
    yield numberOfTrials;

    totalNumberOfTrials -= numberOfTrials;
  }
}

export async function findHintsForNominalCollateralRatio(
  nominalCollateralRatio: BigNumber,
  sortedTroves: Contract,
  hintHelpers: Contract,
  troveManager: Contract,
  ownAddress?: string,
): Promise<[string, string]> {
  const numberOfTroves = await troveManager.getTroveOwnersCount();
  if (!numberOfTroves || numberOfTroves.lte(0)) {
    return [ZERO_ADDRESS, ZERO_ADDRESS];
  }

  if (nominalCollateralRatio.eq(BigNumber.from(MAX_UINT_256))) {
    return [ZERO_ADDRESS, await sortedTroves.getFirst()];
  }

  const totalNumberOfTrials = Math.ceil(10 * Math.sqrt(numberOfTroves));
  const [firstTrials, ...restOfTrials]: any = generateTrials(totalNumberOfTrials);

  const collectApproxHint = (
    {
      latestRandomSeed,
      results,
    }: {
      latestRandomSeed: BigNumberish;
      results: { diff: BigNumber; hintAddress: string }[];
    },
    numberOfTrials: number,
  ) =>
    hintHelpers
      .getApproxHint(nominalCollateralRatio, numberOfTrials, latestRandomSeed)
      .then(({ latestRandomSeed, ...result }: any) => ({
        latestRandomSeed,
        results: [...results, result],
      }));

  const { results } = await restOfTrials.reduce(
    (p: any, numberOfTrials: number) =>
      p.then((state: any) => collectApproxHint(state, numberOfTrials)),
    collectApproxHint({ latestRandomSeed: randomInteger(), results: [] }, firstTrials),
  );

  const { hintAddress } = results.reduce((a: any, b: any) => (a.diff.lt(b.diff) ? a : b));

  let [prev, next] = await sortedTroves.findInsertPosition(
    nominalCollateralRatio,
    hintAddress,
    hintAddress,
  );

  if (ownAddress) {
    // In the case of reinsertion, the address of the Trove being reinserted is not a usable hint,
    // because it is deleted from the list before the reinsertion.
    // "Jump over" the Trove to get the proper hint.
    if (prev === ownAddress) {
      prev = await sortedTroves.getPrev(prev);
    } else if (next === ownAddress) {
      next = await sortedTroves.getNext(next);
    }
  }

  return prev === ZERO_ADDRESS
    ? [next, next]
    : next === ZERO_ADDRESS
    ? [prev, prev]
    : [prev, next];
}

