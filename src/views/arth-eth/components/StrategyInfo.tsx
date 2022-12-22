import React from "react";
import TextWrapper from "../../../components/TextWrapper";

const StrategyInfo = () => {
  return (
    <div className={'material-primary m-b-24'}>
      <TextWrapper
        text={'Information About This Program'}
        fontFamily={'Syne'}
        fontSize={16}
        fontWeight={600}
        className={'m-b-12'}
      />
      <TextWrapper text={
        <div>
          <p className={'m-b-8'}>The ETH staking program is a simple way for ETH holders to earn a yield by providing
            liquidity to the
            MahaDAO ecosystem .</p>
          <p className={'m-b-8'}>The ETH you contribute here is then used by the protocol as collateral to mint ARTH (an
            inflation-proof
            stablecoin) and then deposited into MahaLend to generate rewards.</p>
          <p className={'m-b-8'}>Rewards are distributed in $MAHA, the governance token in
            the MahaDAO
            ecosystem. The governance token can be locked for $MAHAX to earn staking rewards and access superior
            governance features on the governance portal <a href={'https://gov.mahadao.com/#/locker'}
                                                            className={'links'}>here</a>.</p>
          <p className={'m-b-8'}>
            The ETH staked can also be withdrawn at any time without any locking period.
          </p>
        </div>
      }
      />
    </div>
  )
}

export default StrategyInfo;
