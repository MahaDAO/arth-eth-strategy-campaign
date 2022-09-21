import React, {useMemo, useState} from "react";
import InputContainer from "../../components/InputContainer";
import useGetNativeTokenBalance from "../../hooks/state/useGetNativeTokenBalance";
import {getDisplayBalance} from "../../utils/formatBalance";
import Input from "../../components/Input";
import States from "../../components/States";
import CollateralDropDown from "../../components/CollateralDropDown";
import styled from "styled-components";
import theme from "../../theme";
import DataField from "../../components/DataField";

const OpenPositon = () => {
  const balance = useGetNativeTokenBalance();
  const [ethAmount, setEthAmount] = useState<string>('10');

  const debtAmount = useMemo(() => {
    if (Number(ethAmount)) {
      return Number(ethAmount) * (85 / 15);
    } else {
      return '-';
    }
  }, [ethAmount])

  return (
    <div>
      <Values className={'m-b-24'}>
        <InputContainer
          label={'Enter Amount'}
          dataValueLoading={balance.isLoading}
          dataValue={`Balance: ${Number(getDisplayBalance(balance.value)).toLocaleString('en-US', {maximumFractionDigits: 3})}`}
          className={'m-b-24'}
        >
          <States
            state={'default'}
            msg={''}
          >
            <div className={'single-line-center-end'}>
              <Input
                value={ethAmount}
                setValue={setEthAmount}
                maxTag={true}
                onMaxClick={() => {
                  setEthAmount(getDisplayBalance(balance.value));
                }}
              />
              <CollateralDropDown selectedSymbol={'ETH'}/>
            </div>
          </States>
        </InputContainer>
        <DebtAmount>
          <DataField
            label={'Debt Amount'}
            labelFontWeight={600}
            value={debtAmount.toLocaleString('en-US', {maximumFractionDigits: 3})}
            labelFontSize={16}
            valueFontSize={16}
            valueFontColor={'white'}
            valueFontWeight={600}
            valueTag={'ARTH'}
          />
        </DebtAmount>
      </Values>
      <LoanInfo className={'material-primary m-b-24'}>
        <div className={'m-b-12'}>
          <DataField
            label={'Collateral Ratio'}
            labelFontWeight={600}
            value={'120%'}
            valueFontColor={theme.color.red[300]}
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
            value={'2 ETH'}
            valueFontColor={'white'}
            valueFontWeight={600}
          />
          <DataField
            label={'These are the estimated value actual value might change'}
            labelFontSize={10}
            value={'10 ARTH'}
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
      </LoanInfo>
      <Rewards>
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
        </div>
        <div className={''}>
          <DataField
            label={'Estimated Trading Fee Rewards'}
            labelFontWeight={600}
            labelFontColor={'white'}
            value={'20 ARTH'}
            valueFontSize={16}
            valueFontWeight={600}
            valueFontColor={'white'}
          />
          <DataField
            label={''}
            labelFontWeight={600}
            labelFontColor={'white'}
            value={'10 ETH'}
            valueFontSize={16}
            valueFontWeight={600}
            valueFontColor={'white'}
          />
        </div>
      </Rewards>
    </div>
  )
}

export default OpenPositon;

const Values = styled.div`

`;

const DebtAmount = styled.div`
  background: ${theme.color.transparent[400]};
  padding: 12px;
  border-radius: 6px;
`

const LoanInfo = styled.div`

`

const Rewards = styled.div`
  background: ${theme.color.gradients.orange_gradient};
  padding: 24px;
  border-radius: 6px;
`
