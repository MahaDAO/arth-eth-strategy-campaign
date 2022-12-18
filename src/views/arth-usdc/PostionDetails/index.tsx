import styled from "styled-components";
import theme from "../../../theme";
import DataField from "../../../components/DataField";
import React, {useMemo} from "react";
import TextWrapper from "../../../components/TextWrapper";
import Button from "../../../components/Button";
import TextButton from "../../../components/TextButton";
import useGetPositionDetails from "../../../hooks/state/useGetPositionDetails";
import {getDisplayBalance} from "../../../utils/formatBalance";
import useCollateralPriceFeed from "../../../hooks/state/TroveManager/useCollateralPriceFeed";
import {BigNumber} from "ethers";
import useWithdraw from "../../../hooks/callbacks/useWithdraw";
import useGetMahaRewards from "../../../hooks/state/useGetMahaRewards";
import useClaimRewards from "../../../hooks/callbacks/useClaimRewards";
import AprInfo from "../components/AprInfo";
import {BNZERO} from "../../../utils/constants";

const PositionDetails = () => {
  const price = useCollateralPriceFeed()
  const claimHandler = useClaimRewards();
  const mahaRewards = useGetMahaRewards();
  const positionDetails = useGetPositionDetails();

  const withdrawHandler = useWithdraw(
    positionDetails.value.ethForLoan,
    positionDetails.value.arthFromLoan
  );
  const onWithdrawClick = () => withdrawHandler();

  const cr = useMemo(() => {
    if (price.isLoading || positionDetails.isLoading) return BigNumber.from(0)
    if (positionDetails.value.arthFromLoan.lte(0)) return BigNumber.from(0)
    return price.value.mul(positionDetails.value.ethForLoan).div(positionDetails.value.arthFromLoan);
  }, [price, positionDetails]);

  return (
    <div>
      <div className={'material-secondary m-b-24'}>
        <div className={'m-b-12'}>
          <DataField
            label={'Your USDC collateral deposited'}
            labelFontSize={16}
            labelFontColor={'white'}
            value={`${Number(getDisplayBalance(BNZERO, 18)).toLocaleString('en-US', {maximumFractionDigits: 3})} USDC`}
            valueFontColor={'white'}
            valueFontSize={16}
            valueFontWeight={600}
            className={'m-b-4'}
          />

        </div>
        {/*<div className={'m-b-12'}>
          <DataField
            label={'USDC supplied to mahalend'}
            labelFontSize={16}
            labelFontColor={'white'}
            value={`${Number(getDisplayBalance(BNZERO, 18)).toLocaleString('en-US', {maximumFractionDigits: 3})} USDC`}
            valueFontColor={theme.color.transparent[100]}
            valueFontSize={16}
            valueFontWeight={600}
            className={'m-b-4'}
          />
        </div>*/}
        <div className={'m-b-12'}>
          <DataField
            label={'Debt amount'}
            labelFontSize={16}
            labelFontColor={'white'}
            value={`${Number(getDisplayBalance(BNZERO, 18)).toLocaleString('en-US', {maximumFractionDigits: 3})} ARTH`}
            valueFontColor={theme.color.transparent[100]}
            valueFontSize={16}
            valueFontWeight={600}
            className={'m-b-4'}
          />
          <DataField
            label={'ARTH borrowed from mahalend'}
            labelFontSize={12}
            labelFontColor={theme.color.transparent[100]}
          />
        </div>
        <div className={'m-b-12'}>
          <DataField
            label={'ARTH/USDC deposited to curve finance pool'}
            labelFontSize={16}
            labelFontColor={'white'}
            value={`${Number(getDisplayBalance(BNZERO, 16, 3)).toLocaleString('en-US', {maximumFractionDigits: 3})}ARTH/USDC`}
            valueFontColor={theme.color.transparent[100]}
            valueFontSize={16}
            valueFontWeight={600}
            className={'m-b-4'}
          />
        </div>
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

const PositionContainer = styled.div`
  position: relative;
  padding-top: 44px;
`

const Rewards = styled.div`
  padding: 24px;
  border-radius: 6px;
`

const RewardsBtn = styled.div`
  width: 150px;
`

const InRangeTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.color.transparent[300]};
  position: absolute;
  right: 8px;
  top: 8px;
  height: 24px;
  width: 90px;
  border-radius: 6px;
`

const TagColor = styled.div<{ color: string }>`
  background: ${(props) => props.color};
  height: 8px;
  width: 8px;
  border-radius: 50%;
  margin-right: 8px;
`;
