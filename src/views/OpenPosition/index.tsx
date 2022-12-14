import React, {useMemo} from "react";
import styled from "styled-components";
import {parseUnits} from "ethers/lib/utils";

import useGetNativeTokenBalance from "../../hooks/state/useGetNativeTokenBalance";

import InputContainer from "../../components/InputContainer";
import Input from "../../components/Input";
import States from "../../components/States";
import DataField from "../../components/DataField";
import CollateralDropDown from "../../components/CollateralDropDown";
import Button from "../../components/Button";

import theme from "../../theme";
import TextWrapper from "../../components/TextWrapper";
import useDeposit from "../../hooks/callbacks/useDeposit";
import ActionButton from "../../components/ActionButton";
import {getDisplayBalance} from "../../utils/formatBalance";
import InfoTip from "../../components/InfoTip";
import AprInfo from "../Campaign/components/AprInfo";

const OpenPosition = (props: { ethAmount: string, setEthAmount: React.Dispatch<React.SetStateAction<string>> }) => {
  const {ethAmount, setEthAmount} = props;
  const balance = useGetNativeTokenBalance();

  const isInputGreaterThanMax = useMemo(() => {
    const bnETHAmount = parseUnits(ethAmount || "0", 18);
    return bnETHAmount.gt(balance.value);
  }, [ethAmount, balance]);

  const depositHandler = useDeposit(ethAmount);
  const onDepositClick = () => depositHandler();

  return (
    <div>
      <Form className={"m-b-24"}>
        <InputContainer
          label={"Enter Amount"}
          dataValueLoading={balance.isLoading}
          dataValue={`Balance: ${Number(
            getDisplayBalance(balance.value)
          ).toLocaleString("en-US", {maximumFractionDigits: 3})}`}
          className={"m-b-24"}
        >
          <States
            state={isInputGreaterThanMax ? "error" : "default"}
            msg={isInputGreaterThanMax ? "*ETH balance not sufficient" : ""}
          >
            <div className={"single-line-center-end"}>
              <Input
                value={ethAmount}
                setValue={setEthAmount}
                maxTag={true}
                onMaxClick={() => {
                  setEthAmount(getDisplayBalance(balance.value, 18));
                }}
              />
              <CollateralDropDown selectedSymbol={"ETH"}/>
            </div>
          </States>
        </InputContainer>
        <div className={"m-t-24"}>
          <ActionButton
            text={"Deposit"}
            onClick={onDepositClick}
            disabled={isInputGreaterThanMax || !Number(ethAmount)}
          />
        </div>
      </Form>
      <Rewards className={"material-primary m-b-24"}>
        <div className={"single-line-center-between m-b-24"}>
          <TextWrapper text={"Rewards"} fontSize={24} fontFamily={"Syne"}/>
          <RewardsBtn>
            <Button text={"Collect Rewards"} size={"sm"} disabled={true}/>
          </RewardsBtn>
        </div>
        <AprInfo/>
        <div className={"m-b-8"}>
          <DataField
            label={"Earned Rewards"}
            labelFontWeight={600}
            labelFontColor={"white"}
            value={"0.00 MAHA"}
            valueFontSize={18}
            valueFontWeight={600}
            valueFontColor={"white"}
            className={"m-b-2"}
          />
        </div>
        <InfoTip type={'Info'}
                 msg={<div> Oops &#128542;! you have no rewards collected, deposit ETH and earn MAHA &#127881;
                 </div>}/>
      </Rewards>
    </div>
  );
};

export default OpenPosition;

const Form = styled.div``;

const Rewards = styled.div``;

const RewardsBtn = styled.div`
  width: 150px;
`;
