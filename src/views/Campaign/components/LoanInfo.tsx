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
    </div>
  )
}

export default LoanInfo;
