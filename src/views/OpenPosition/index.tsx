import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { parseUnits } from "ethers/lib/utils";

import useGetNativeTokenBalance from "../../hooks/state/useGetNativeTokenBalance";

import InputContainer from "../../components/InputContainer";
import Input from "../../components/Input";
import States from "../../components/States";
import DataField from "../../components/DataField";
import CollateralDropDown from "../../components/CollateralDropDown";
import Button from "../../components/Button";

import theme from "../../theme";
import { getDisplayBalance } from "../../utils/formatBalance";
import {
  useGetDebtAmount,
  useGetCollateralRatio,
  useGetTotalDebtAmount,
  useGetLoanEth,
  useGetPositionEth
} from "./Calculations";
import TextWrapper from "../../components/TextWrapper";
import IconLoader from "../../components/IconLoader";
import TextButton from "../../components/TextButton";
import useDeposit from "../../hooks/callbacks/useDeposit";
import SlippageContainer from "../../components/SlippageContainer";
import useGetPositionDetails from "../../hooks/state/useGetOutputDetails";

const OpenPosition = () => {
  const [ethAmount, setEthAmount] = useState<string>('1');
  const [simplifieldView, setsimplifieldView] = useState<boolean>(false);

  const balance = useGetNativeTokenBalance();

  const loanEthAmount = useGetLoanEth(ethAmount);
  const positionEthAmount = useGetPositionEth(ethAmount);
  const debtAmount = useGetDebtAmount(loanEthAmount);
  const totaldebtAmount = useGetTotalDebtAmount(debtAmount);
  const collateralRatio = useGetCollateralRatio(loanEthAmount, totaldebtAmount);
  const positionOutputDetails = useGetPositionDetails(ethAmount);

  const isInputGreaterThanMax = useMemo(
    () => {
      const bnETHAmount = parseUnits(ethAmount || '0', 18);
      return bnETHAmount.gt(balance.value);
    },
    [ethAmount, balance]
  );

  const depositHandler = useDeposit(ethAmount);
  const onDepositClick = () => depositHandler();

  return (
    <div>
      <div className={'single-line-center-end'}>
        <TextWrapper text={'Slippage'} className={'m-r-8 m-b-4'} Fcolor={theme.color.transparent[100]} />
        <SlippageContainer />
      </div>
      <Form className={'m-b-24'}>
        <InputContainer
          label={'Enter Amount'}
          dataValueLoading={balance.isLoading}
          dataValue={`Balance: ${Number(getDisplayBalance(balance.value)).toLocaleString('en-US', { maximumFractionDigits: 3 })}`}
          className={'m-b-24'}
        >
          <States
            state={isInputGreaterThanMax ? 'error' : 'default'}
            msg={isInputGreaterThanMax ? '*ETH balance not sufficient' : ''}
          >
            <div className={'single-line-center-end'}>
              <Input
                value={ethAmount}
                setValue={setEthAmount}
                maxTag={true}
                onMaxClick={() => {
                  setEthAmount(getDisplayBalance(balance.value, 18));
                }}
              />
              <CollateralDropDown selectedSymbol={'ETH'} />
            </div>
          </States>
        </InputContainer>
        <div className={'m-t-24'}>
          <Button
            text={'Deposit'}
            onClick={onDepositClick}
            disabled={isInputGreaterThanMax || !Number(ethAmount)}
          />
        </div>
      </Form>
      <Rewards className={'material-primary m-b-24'}>
        <div className={'single-line-center-between m-b-24'}>
          <TextWrapper text={'Rewards'} fontSize={24} fontFamily={'Syne'} />
          <RewardsBtn>
            <Button text={'Collect Rewards'} size={'sm'} disabled={true} />
          </RewardsBtn>
        </div>
        <div className={'m-b-12'}>
          <DataField
            label={'Estimated MAHA Rewards (@30%)'}
            labelFontWeight={600}
            labelFontColor={'white'}
            value={'2,000 MAHA'}
            valueFontSize={16}
            valueFontWeight={600}
            valueFontColor={'white'}
            className={'m-b-2'}
          />
          <DataField
            label={''}
            value={'$2000'}
            valueFontSize={14}
            valueFontColor={theme.color.transparent[100]}
          />
        </div>
      </Rewards>
      <div className={'material-primary m-b-24'}>
        <div className={'single-line-center-end'}>
          <TextButton
            text={simplifieldView ? 'Text view' : 'Simplified view'}
            fontSize={12}
            className={'m-b-12'}
            onClick={() => setsimplifieldView(!simplifieldView)} />
        </div>
        {!simplifieldView
          ? <div>
            <TextWrapper
              text={
                <div>
                  You are contributing <span
                    className={'bold'}>{Number(ethAmount).toLocaleString('en-US', { maximumFractionDigits: 3 })}
                    <IconLoader iconName={'ETH'} iconType={'tokenSymbol'} width={12}
                      className={'m-l-4 m-r-4'} />ETH &#127881;</span> out of which <span
                        className={'bold'}>{Number(getDisplayBalance(positionOutputDetails.value.ethColl, 18)).toLocaleString('en-US', { maximumFractionDigits: 3 })}
                    <IconLoader iconName={'ETH'} iconType={'tokenSymbol'} width={12}
                      className={'m-l-4 m-r-4'} />ETH</span> is being used as collateral to mint <span
                        className={'bold'}>{Number(getDisplayBalance(positionOutputDetails.value.arthDesired, 18)).toLocaleString('en-US', { maximumFractionDigits: 3 })}
                    <IconLoader iconName={'ARTH'} iconType={'tokenSymbol'} width={12}
                      className={'m-l-4 m-r-4'} />ARTH</span> (at
                  a <b>300%</b> collateral
                  ratio), which
                  along with <span
                    className={'bold'}>{Number(getDisplayBalance(positionOutputDetails.value.eth.sub(positionOutputDetails.value.ethColl), 18)).toLocaleString('en-US', { maximumFractionDigits: 3 })}
                    <IconLoader iconName={'ETH'} iconType={'tokenSymbol'} width={12}
                      className={'m-l-4 m-r-4'} />ETH</span> is
                  used to provide liquidity to the <span className={'bold'}>ARTH/ETH 0.3%</span> pair.
                </div>
              }
              className={'m-b-16'}
              lineHeight={'140%'}
              fontSize={16}
            // Fcolor={theme.color.transparent[100]}
            />
            <TextWrapper
              text={
                <div>
                  You have so far
                  earned <span className={'bold'}>0.2 ETH</span> and <span className={'bold'}>10 ARTH</span> from
                  trading fees, and <span className={'bold'}>10 MAHA</span> from the farming
                  rewards. You are currently contributing <span className={'bold'}>10%</span> &#128571; to the mission
                  of creating financial liberty with <span className={'bold'}>ARTH</span> and <span
                    className={'bold'}>MAHA</span>.
                </div>
              }
              lineHeight={'140%'}
              fontSize={16}
            // Fcolor={theme.color.transparent[100]}
            />
          </div>
          : <div>
            <div className={'m-b-12'}>
              <DataField
                label={'Debt amount'}
                labelFontWeight={600}
                value={Number(debtAmount.value).toLocaleString('en-US', { maximumFractionDigits: 3 }) + ' ARTH'}
                valueFontColor={'white'}
                valueFontWeight={600}
              />
              <DataField
                label={'Minimum cr should be 250%'}
                labelFontSize={10}
              />
            </div>
            <div className={'m-b-12'}>
              <DataField
                label={'Collateral Ratio'}
                labelFontWeight={600}
                value={Number(getDisplayBalance(collateralRatio.value, 18, 3)).toLocaleString('en-US', { maximumFractionDigits: 3 }) + '%'}
                valueFontColor={theme.color.green[300]}
                valueFontWeight={600}
              />
              <DataField
                label={'Minimum cr should be 200%'}
                labelFontSize={10}
              />
            </div>
            <div className={'m-b-12'}>
              <DataField
                label={'Your Position'}
                labelFontWeight={600}
                value={`${Number(positionEthAmount).toLocaleString('en-US', { maximumFractionDigits: 3 })} ETH`}
                valueFontColor={'white'}
                valueFontWeight={600}
              />
              <DataField
                label={'These are the estimated value actual value might change'}
                labelFontSize={10}
                value={Number(debtAmount.value).toLocaleString('en-US', { maximumFractionDigits: 3 }) + ' ARTH'}
                valueFontColor={'white'}
                valueFontWeight={600}
                position={'start-between'}
              />
            </div>
            <div className={'m-b-12'}>
              <DataField
                label={'Your contribution to the TVL'}
                labelFontWeight={600}
                value={'30%'}
                valueFontColor={'white'}
                valueFontWeight={600}
              />
              <DataField
                label={'These are the estimated value actual value might change'}
                labelFontSize={10}
              />
            </div>
          </div>}
      </div>
    </div>
  )
}

export default OpenPosition;

const Form = styled.div`

`;

const DebtAmount = styled.div`
  background: ${theme.color.transparent[400]};
  padding: 12px;
  border-radius: 6px;
`

const LoanInfo = styled.div`

`

const Rewards = styled.div`
`

const RewardsBtn = styled.div`
  width: 150px;
`
