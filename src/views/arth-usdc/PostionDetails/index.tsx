import styled from "styled-components";
import React, {useMemo} from "react";

import TextWrapper from "../../../components/TextWrapper";
import Button from "../../../components/Button";
import TextButton from "../../../components/TextButton";
import DataField from "../../../components/DataField";
import theme from "../../../theme";
import {getDisplayBalance} from "../../../utils/formatBalance";
import AprInfo from "../components/AprInfo";

import useGetDepositAmount from "../../../hooks/state/usdc-strategy/useGetDepositAmount";
import useGetPositionDetails from "../../../hooks/state/usdc-strategy/useGetPositionDetails";
import useGetMahaRewards from "../../../hooks/state/usdc-strategy/useGetMahaRewards";
import useWithdraw from "../../../hooks/callbacks/usdc-strategy/useWithdraw";
import useClaimRewards from "../../../hooks/callbacks/usdc-strategy/useClaimRewards";
import {LOADING_DEFAULT_BOOLEAN_STATE} from "../../../utils/constants";
import {BasicBooleanState} from "../../../utils/interface";
import InfoTip from "../../../components/InfoTip";

const PositionDetails = () => {
  const claimHandler = useClaimRewards();
  const mahaRewards = useGetMahaRewards();
  const positionDetails = useGetPositionDetails();
  const depositedAmount = useGetDepositAmount();

  const withdrawHandler = useWithdraw();
  const onWithdrawClick = () => withdrawHandler();

  const underPenaltyPeriod: BasicBooleanState = useMemo(() => {
    if (positionDetails.isLoading) return LOADING_DEFAULT_BOOLEAN_STATE
    else {
      const start = Number(`${Number(positionDetails.value.depositedAt)}000`)
      const lockedDuration = Number(`${Number(positionDetails.value.lockDuration)}000`)
      const check = new Date().getTime() < start + lockedDuration;
      return {
        isLoading: false,
        value: check
      }
    }
  }, [positionDetails])

  console.log('data', underPenaltyPeriod);

  return (
    <div>
      <div className={'material-secondary m-b-24'}>
        <div className={'m-b-12'}>
          <DataField
            label={'Your USDC collateral deposited'}
            labelFontSize={16}
            labelFontColor={'white'}
            isValueLoading={depositedAmount.isLoading}
            value={`${Number(getDisplayBalance(depositedAmount.value, 6)).toLocaleString('en-US', {maximumFractionDigits: 3})} USDC`}
            valueFontColor={'white'}
            valueFontSize={18}
            valueFontWeight={600}
            className={'m-b-4'}
          />

        </div>
        <div className={'m-b-12'}>
          <DataField
            label={'ARTH borrowed'}
            labelFontSize={16}
            labelFontColor={'white'}
            isValueLoading={positionDetails.isLoading}
            value={`${Number(getDisplayBalance(positionDetails.value.arthBorrowed, 18)).toLocaleString('en-US', {maximumFractionDigits: 3})} ARTH`}
            valueFontSize={16}
          />
          <DataField
            label={'ARTH borrowed from mahalend and deposited to curve pool'}
            labelFontSize={12}
            labelFontColor={theme.color.transparent[100]}
          />
        </div>
        <div className={'m-b-12'}>
          <DataField
            label={'USDC Deposited to curve pool'}
            labelFontSize={16}
            labelFontColor={'white'}
            value={`${Number(getDisplayBalance(positionDetails.value.usdcInLp, 6, 3)).toLocaleString('en-US', {maximumFractionDigits: 3})} USDC`}
            valueFontSize={16}
            className={'m-b-4'}
          />
        </div>
        {underPenaltyPeriod.value &&
          <InfoTip type={'Warning'}
                   msg={'you will be charged 100USDC early withdrawal penalty which will be lifted after the penalty period'}/>
        }
        <div className={'m-t-32'}>
          <TextButton
            text={'Close Position'}
            onClick={onWithdrawClick}
            align={'center'}
          />
        </div>
      </div>
      <Rewards className={'material-primary m-b-24'}>
        <div className={'single-line-center-between m-b-24'}>
          <TextWrapper text={'Rewards'} fontSize={24} fontFamily={'Syne'}/>
          <RewardsBtn>
            <Button
              onClick={claimHandler}
              text={'Collect Rewards'}
              size={'sm'}
              disabled={mahaRewards.value.lte(0)}
            />
          </RewardsBtn>
        </div>
        <div className={'m-b-12'}>
          <DataField
            label={'MAHA Rewards'}
            labelFontWeight={600}
            labelFontColor={'white'}
            value={Number(getDisplayBalance(mahaRewards.value, 18, 3)).toLocaleString('en-US', {maximumFractionDigits: 4}) + " MAHA"}
            valueFontSize={16}
            valueFontWeight={600}
            valueFontColor={'white'}
            className={'m-b-2'}
          />
        </div>
        <AprInfo/>
      </Rewards>
    </div>
  )
}

export default PositionDetails;

const Rewards = styled.div`
  padding: 24px;
  border-radius: 6px;
`;

const RewardsBtn = styled.div`
  width: 150px;
`
