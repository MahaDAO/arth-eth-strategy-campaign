import React, {useState, useMemo} from "react";
import {parseUnits} from "ethers/lib/utils";

import DataField from "../../../components/DataField";

import TextWrapper from "../../../components/TextWrapper";
import IconLoader from "../../../components/IconLoader";
import TextButton from "../../../components/TextButton";
import useCollateralPriceFeed from "../../../hooks/state/TroveManager/useCollateralPriceFeed";
import useGetBorrowingFeeRateWithDecay from "../../../hooks/state/TroveManager/useGetBorrowingFeeRateWithDecay";
import {DECIMALS_18} from "../../../utils/constants";
import {BigNumber} from "ethers";
import {getDisplayBalance} from "../../../utils/formatBalance";

const SummaryView = (props: { ethAmount: string }) => {
  const [simplifieldView, setsimplifieldView] = useState<boolean>(false);

  const price = useCollateralPriceFeed();
  const borrowingFeeRate = useGetBorrowingFeeRateWithDecay();

  const arthOutputFromLoans = useMemo(() => {
    if (price.isLoading || borrowingFeeRate.isLoading) return BigNumber.from(0);

    const eth = parseUnits(props.ethAmount || "0", 18);
    let arthDesired: BigNumber = eth
      .mul(price.value)
      .mul(100)
      .div(310)
      .div(DECIMALS_18);

    // arthDesired = arthDesired
    //   .sub(arthDesired.mul(borrowingFeeRate.value).div(DECIMALS_18))
    //   .sub(DECIMALS_18.mul(50));

    return arthDesired.lte(0) ? BigNumber.from(0) : arthDesired;
  }, [price, props.ethAmount, borrowingFeeRate]);

  return (
    <div className={"material-primary m-b-24"}>
      <div className={"single-line-center-end"}>
        <TextButton
          text={simplifieldView ? "Text view" : "Simplified view"}
          fontSize={12}
          className={"m-b-12"}
          onClick={() => setsimplifieldView(!simplifieldView)}
        />
      </div>
      {!simplifieldView ? (
        <div>
          <TextWrapper
            text={
              <div>
                You are contributing{" "}
                <span className={"bold"}>
                  {Number(props.ethAmount).toLocaleString("en-US", {
                    maximumFractionDigits: 3,
                  })}
                  <IconLoader

                    iconName={"ETH"}
                    iconType={"tokenSymbol"}
                    width={12}
                    className={"m-l-4 m-r-4"}
                  />
                  ETH &#127881;
                </span>{" "}
                which is being used as collateral to mint{" "}
                <span className={"bold"}>
                  {Number(
                    getDisplayBalance(arthOutputFromLoans, 18)
                  ).toLocaleString("en-US", {maximumFractionDigits: 3})}
                  <IconLoader
                    iconName={"ARTH"}
                    iconType={"tokenSymbol"}
                    width={12}
                    className={"m-l-4 m-r-4"}
                  />
                  ARTH
                </span>{" "}
                (at a <b>~300%</b> collateral ratio), which is then
                deposited into <span className={"bold"}>MahaLend</span>.
              </div>
            }
            className={"m-b-16"}
            lineHeight={"140%"}
            fontSize={16}
          />
        </div>
      ) : (
        <div>
          <div className={"m-b-12"}>
            <DataField
              label={"Collateral amount"}
              labelFontWeight={600}
              value={
                Number(
                  getDisplayBalance(parseUnits(props.ethAmount || "0", 18), 18)
                ).toLocaleString("en-US", {maximumFractionDigits: 3}) +
                " ETH"
              }
              valueFontColor={"white"}
              valueFontWeight={600}
            />
          </div>
          <div className={"m-b-12"}>
            <DataField
              label={"Debt amount"}
              labelFontWeight={600}
              value={
                Number(
                  getDisplayBalance(arthOutputFromLoans, 18)
                ).toLocaleString("en-US", {maximumFractionDigits: 3}) +
                " ARTH"
              }
              valueFontColor={"white"}
              valueFontWeight={600}
            />
          </div>
          <div className={"m-b-12"}>
            <DataField
              label={"Collateral Ratio"}
              labelFontWeight={600}
              value={'~300%'}
              valueFontColor={"white"}
              valueFontWeight={600}
            />
          </div>
          <div className={"m-b-12"}>
            <DataField
              label={"Supply amount to lending pool"}
              labelFontWeight={600}
              value={
                Number(
                  getDisplayBalance(arthOutputFromLoans, 18)
                ).toLocaleString("en-US", {maximumFractionDigits: 3}) +
                " ARTH"
              }
              valueFontColor={"white"}
              valueFontWeight={600}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryView;
