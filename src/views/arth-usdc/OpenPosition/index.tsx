import React, {useMemo, useState} from "react";
import styled from "styled-components";
import {parseUnits} from "ethers/lib/utils";

import useTokenBalance from "../../../hooks/useTokenBalance";

import InputContainer from "../../../components/InputContainer";
import Input from "../../../components/Input";
import States from "../../../components/States";
import DataField from "../../../components/DataField";
import CollateralDropDown from "../../../components/CollateralDropDown";
import Button from "../../../components/Button";

import TextWrapper from "../../../components/TextWrapper";
import useDeposit from "../../../hooks/callbacks/usdc-strategy/useDeposit";
import ActionButton from "../../../components/ActionButton";
import {getDisplayBalance} from "../../../utils/formatBalance";
import InfoTip from "../../../components/InfoTip";
import AprInfo from "../components/AprInfo";
import useCore from "../../../hooks/useCore";
import {useGetChainId} from "../../../utils/NetworksCustomHooks";
import {BigNumber} from "ethers";
import useApprove, {ApprovalState} from "../../../hooks/callbacks/useApprove";
import Confetti from "react-confetti";
import SuccesModal from "../../../components/SuccesModal";
import useGetDepositAmount from "../../../hooks/state/usdc-strategy/useGetDepositAmount";
import PositionDetails from "../PostionDetails";
import {useMediaQuery} from "react-responsive";
import SummaryView from "../components/SummaryView";

const OpenPosition = (props: { USDCAmount: string, setUSDCAmount: React.Dispatch<React.SetStateAction<string>> }) => {
  const {USDCAmount, setUSDCAmount} = props;

  const core = useCore();
  const chainId = useGetChainId()
  const balance = useTokenBalance(core._tokens[chainId]["USDC"]);
  const [success, setSuccess] = useState<boolean>(false);
  const depositedAmount = useGetDepositAmount();

  const isInputGreaterThanMax = useMemo(() => {
    const bnUSDCAmount = BigNumber.from(parseUnits(USDCAmount || "0", 6));
    return bnUSDCAmount.gt(balance.value);
  }, [USDCAmount, balance]);

  const depositHandler = useDeposit(USDCAmount);
  const onDepositClick = () => {
    depositHandler(
      () => setSuccess(true)
    ).then(r => {
    });
  }

  const isMobile = useMediaQuery({maxWidth: '600px'});

  const [approveStatus, approve] = useApprove(
    core._tokens[chainId]['USDC'],
    core.getARTHUSDCCurveLpStrategy().address,
  );

  const isApproved = useMemo(
    () => approveStatus === ApprovalState.APPROVED,
    [approveStatus]
  );
  const isApproving = useMemo(
    () => approveStatus === ApprovalState.PENDING,
    [approveStatus]
  );

  return (
    <div>
      {success && <div style={{position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99}}>
        <Confetti
          recycle={true}
          onConfettiComplete={() => console.log('finished')}
          numberOfPieces={500}
          width={window.innerWidth}
        />
      </div>}
      <SuccesModal
        modalOpen={success}
        buttonType="transparent"
        buttonText="Continue"
        setModalOpen={() => setSuccess(false)}
        title={'Congrats 🎉 You are now supporting a vision to create an inflation-proof future!'}
        subTitle={<div>
          Join the <span className="bold">#farming</span> channel in our <a href={'https://discord.com/invite/mahadao'}
                                                                            className={'links'}>Discord </a>
          and be a part of our awesome community.
        </div>}
      />
      {
        depositedAmount.value.gt(0) && !depositedAmount.isLoading
          ? <PositionDetails/>
          : <div>
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
                  msg={isInputGreaterThanMax ? "*USDC balance not sufficient" : ""}
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
                {
                  isApproved
                    ? <ActionButton
                      text={"Deposit"}
                      onClick={onDepositClick}
                      disabled={isInputGreaterThanMax || !Number(USDCAmount)}
                    />
                    : <ActionButton
                      onClick={approve}
                      loading={isApproving}
                      tracking_id={"approve_USDC"}
                      tracking_params={{
                        collateral: 'USDC'
                      }}
                      text={'Approve USDC'}
                    >
                    </ActionButton>
                }
              </div>
            </Form>
            {isMobile && <SummaryView USDCAmount={USDCAmount}/>}
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
      }

    </div>
  );
};

export default OpenPosition;

const Form = styled.div``;

const Rewards = styled.div``;

const RewardsBtn = styled.div`
  width: 150px;
`;
