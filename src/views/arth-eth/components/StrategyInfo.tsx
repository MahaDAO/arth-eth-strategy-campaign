import React from "react";
import TextWrapper from "../../../components/TextWrapper";

const StrategyInfo = () => {
  return (
    <div className={'material-primary m-b-24'}>
      <TextWrapper
        text={'About This Program'}
        fontFamily={'Syne'}
        fontSize={16}
        fontWeight={600}
        className={'m-b-12'}
      />
      <TextWrapper text={
        <div>
          <p className={'m-b-8'}>The ETH staking program is a simple way for users to earn a yield on their
            ETH by providing liquidity to the <a href={'https://mahadao.com'}
              className={'links'}> MahaDAO</a> ecosystem.</p>
          <p className={'m-b-8'}>The ETH you'll contribute here is used as collateral to mint ARTH (an
            inflation-proof stablecoin) and then it is deposited into MahaLend to provide liquidity for the
            ecosystem.</p>
          <p className={'m-b-8'}>Rewards are given out in MAHA, the governance token for the entire ecosystem. You can
            further lock MAHA for more staking rewards and other special benefits
            from the <a href={'https://gov.mahadao.com/#/locker'} className={'links'}>governance portal</a>.</p>
          <p className={'m-b-8'}>
            You can withdraw your ETH at any time from the program.
          </p>
        </div>
      }
      />
    </div>
  )
}

export default StrategyInfo;
