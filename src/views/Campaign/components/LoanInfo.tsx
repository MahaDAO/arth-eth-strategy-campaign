import React from "react";
import TextWrapper from "../../../components/TextWrapper";
import DataField from "../../../components/DataField";
import theme from "../../../theme";

const LoanInfo = () => {
  return (
    <div className={'material-primary'}>
      <TextWrapper
        text={'Loan Info'}
        fontFamily={'Syne'}
        fontSize={16}
        fontWeight={600}
        className={'m-b-24'}
      />
      <div className={'m-b-12'}>
        <DataField
          label={'ETH Price'}
          labelFontWeight={600}
          value={'669 ARTH'}
          valueFontColor={'white'}
          valueFontWeight={600}
        />
        <DataField
          label={'These are the estimated value actual value might change'}
          labelFontSize={10}
        />
      </div>
      <div className={'m-b-12'}>
        <DataField
          label={'Total Collateral Ratio'}
          labelFontWeight={600}
          value={'220%'}
          valueFontColor={'white'}
          valueFontWeight={600}
        />
        <DataField
          label={'These are the estimated value actual value might change'}
          labelFontSize={10}
        />
      </div>
    </div>
  )
}

export default LoanInfo;
