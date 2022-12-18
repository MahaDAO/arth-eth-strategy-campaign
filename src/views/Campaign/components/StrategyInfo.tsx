import React from "react";
import TextWrapper from "../../../components/TextWrapper";

const StrategyInfo = () => {
  return (
    <div className={'material-primary m-b-24'}>
      <TextWrapper
        text={'Info'}
        fontFamily={'Syne'}
        fontSize={16}
        fontWeight={600}
        className={'m-b-12'}
      />
      <TextWrapper text={
        <div>
          <p>The ETH staking program is a simple way for ETH holders to benefit from the ARTH farms.</p>
          <br />
          <p>The ETH deposited here is used to collateralize and mint ARTH, and then is used to deposit
            into the MahaLend lending protocol.</p>
          <br />
        </div>
      }
      />
    </div>
  )
}

export default StrategyInfo;
