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

const SummaryView = (props: { USDCAmount: string }) => {
  const [simplifieldView, setsimplifieldView] = useState<boolean>(false);

  const usdcDeposited = Number(props.USDCAmount) || 0;

  const usdcToSupply = usdcDeposited * (51 / 100);
  const arthBorrowed = (usdcToSupply) * (97 / 100);

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
                  {Number(props.USDCAmount).toLocaleString("en-US", {
                    maximumFractionDigits: 3,
                  })}
                  <IconLoader
                    iconName={"USDC"}
                    iconType={"tokenSymbol"}
                    width={12}
                    className={"m-l-4 m-r-4"}
                  />
                  USDC &#127881;
                </span>{" "}
                out of this which <span className={"bold"}>{Number(usdcToSupply).toFixed(2)} USDC</span> is used to
                borrow <span className={"bold"}>{Number(arthBorrowed).toFixed(2)} ARTH</span> from MahaLend and
                the remaining USDC and borrowed ARTH is then deposited
                into the <span className={"bold"}>ARTH/USDC curve pool</span>.
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
              value={`${Number(props.USDCAmount).toLocaleString("en-US", {
                maximumFractionDigits: 3,
              })} USDC`}
              valueFontColor={"white"}
              valueFontWeight={600}
            />
          </div>
          <div className={"m-b-12"}>
            <DataField
              label={"Debt amount"}
              labelFontWeight={600}
              value={`${Number(arthBorrowed).toFixed(2)} ARTH`}
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
