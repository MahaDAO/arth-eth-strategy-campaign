import React, {useMemo} from "react";
import styled from "styled-components";
import {parseUnits} from "ethers/lib/utils";

import useGetNativeTokenBalance from "../../../hooks/state/useGetNativeTokenBalance";

import InputContainer from "../../../components/InputContainer";
import Input from "../../../components/Input";
import States from "../../../components/States";
import DataField from "../../../components/DataField";
import CollateralDropDown from "../../../components/CollateralDropDown";
import Button from "../../../components/Button";

import theme from "../../../theme";
import TextWrapper from "../../../components/TextWrapper";
import useDeposit from "../../../hooks/callbacks/useDeposit";
import ActionButton from "../../../components/ActionButton";
import {getDisplayBalance} from "../../../utils/formatBalance";
import InfoTip from "../../../components/InfoTip";
import AprInfo from "../components/AprInfo";
import useTokenBalance from "../../../hooks/useTokenBalance";
import useCore from "../../../hooks/useCore";
import {useGetChainId} from "../../../utils/NetworksCustomHooks";

const OpenPosition = (props: { USDCAmount: string, setUSDCAmount: React.Dispatch<React.SetStateAction<string>> }) => {
  const {USDCAmount, setUSDCAmount} = props;
  const core = useCore();
  const chainId = useGetChainId()
  const balance = useTokenBalance(core._tokens[chainId]["USDC"]);

  const isInputGreaterThanMax = useMemo(() => {
    return false
  }, [USDCAmount, balance]);

  const depositHandler = useDeposit(USDCAmount);
  const onDepositClick = () => depositHandler(() => {
  });

  return (
    <div>
      <Form className={"m-b-24"}>
        <InputContainer
          label={"Enter Amount"}
          dataValueLoading={balance.isLoading}
          dataValue={`Balance: ${Number(
            getDisplayBalance(balance.value, 6)
          ).toLocaleString("en-US", {maximumFractionDigits: 3})}`}
          className={"m-b-24"}
        >
          <States
            state={isInputGreaterThanMax ? "error" : "default"}
            msg={isInputGreaterThanMax ? "*ETH balance not sufficient" : ""}
          >
            <div className={"single-line-center-end"}>
              <Input
                value={USDCAmount}
                setValue={setUSDCAmount}
                maxTag={true}
                onMaxClick={() => {
                  setUSDCAmount(getDisplayBalance(balance.value, 6));
                }}
              />
              <CollateralDropDown selectedSymbol={"USDC"}/>
            </div>
          </States>
        </InputContainer>
        <div className={"m-t-24"}>
          <ActionButton
            text={"Deposit"}
            onClick={onDepositClick}
            disabled={isInputGreaterThanMax || !Number(USDCAmount)}
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
                 msg={<div>You have no rewards collected &#128542;, deposit some USDC and start earn
                   MAHA &#127881;</div>}/>
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
