import { useMemo } from "react";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";

import {
  DECIMALS_18,
  LOADING_DEFAULT_BASIC_STATE,
  NON_LOADING_DEFAULT_BASIC_STATE,
} from "../../utils/constants";

import { BasicState } from "../../utils/interface";

import useCollateralPriceFeed from "../../hooks/state/TroveManager/useCollateralPriceFeed";
import troveDetails from "../../configs/troveDetails";

export const useGetLoanEth = (ethAmount: string): string => {
  return useMemo(() => {
    if (Number(ethAmount)) {
      return (Number(ethAmount) * troveDetails.collateralPerc).toString();
    } else {
      return "0";
    }
  }, [ethAmount]);
};

export const useGetPositionEth = (ethAmount: string): string => {
  return useMemo(() => {
    if (Number(ethAmount)) {
      return (Number(ethAmount) * (1 - troveDetails.collateralPerc)).toString();
    } else {
      return "0";
    }
  }, [ethAmount]);
};

export const useGetDebtAmount = (collateralValue: string): BasicState => {
  const collateralGMUPrice = useCollateralPriceFeed();

  return useMemo(() => {
    if (collateralGMUPrice.isLoading) {
      return LOADING_DEFAULT_BASIC_STATE;
    }

    if (Number(collateralValue)) {
      const collateralValueBN = BigNumber.from(parseUnits(collateralValue, 18));
      const debtAmount = collateralValueBN
        .mul(collateralGMUPrice.value)
        .mul(100)
        .div(troveDetails.cr.mul(DECIMALS_18));
      return {
        isLoading: false,
        value: debtAmount,
      };
    } else {
      return NON_LOADING_DEFAULT_BASIC_STATE;
    }
  }, [collateralGMUPrice.isLoading, collateralGMUPrice.value, collateralValue]);
};

export const useGetCollateralRatio = (
  collateralValue: string,
  totalDebt: BasicState
): BasicState => {
  return {
    isLoading: false,
    value: troveDetails.cr,
  };

  /*const collateralGMUPrice = useCollateralPriceFeed();

  return useMemo(() => {
    if (collateralGMUPrice.isLoading || totalDebt.isLoading) {
      return NON_LOADING_DEFAULT_BASIC_STATE;
    }
    if (!Number(collateralValue))
      return NON_LOADING_DEFAULT_BASIC_STATE;

    const collateralValueBN = BigNumber.from(parseUnits(collateralValue, 18));
    const ratio = collateralValueBN.mul(collateralGMUPrice.value).mul(100).div(totalDebt.value);
    console.log('checking', ratio)

    return {
      isLoading: false,
      value: ratio,
    };
  }, [collateralGMUPrice.isLoading, collateralGMUPrice.value, collateralValue, totalDebt]);
*/
};

export const useGetTotalDebtAmount = (debtAmount: BasicState): BasicState => {
  return {
    isLoading: debtAmount.isLoading,
    value: debtAmount.value,
  };
  /*const borrowingFee = useGetBorrowingFee(debtAmount);

  return useMemo(() => {
    if (borrowingFee.isLoading)
      return {
        isLoading: true,
        value: BigNumber.from(0),
      };
    if (!Number(debtAmount)) return {isLoading: false, value: BigNumber.from(0)};

    return {
      isLoading: false,
      value: BigNumber.from(parseUnits(debtAmount, 18))
        .add(troveDetails.liquidationReserve)
        .add(borrowingFee.value),
    };
  }, [borrowingFee.isLoading, borrowingFee.value, debtAmount]);*/
};
