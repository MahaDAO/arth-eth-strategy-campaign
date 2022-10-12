import React from "react";
import TextWrapper from "../../../components/TextWrapper";
import DataField from "../../../components/DataField";
import theme from "../../../theme";

import useGetCollateralPrice from '../../../hooks/state/TroveManager/useCollateralPriceFeed';
import { getDisplayBalance } from "../../../utils/formatBalance";

const PoolInfo = () => {
  const price = useGetCollateralPrice();

  return (
    <div className={'material-primary m-b-24'}>
      <TextWrapper
        text={'Pool Info'}
        fontFamily={'Syne'}
        fontSize={16}
        fontWeight={600}
        className={'m-b-24'}
      />
      <div className={'m-b-12'}>
        <DataField
          label={'TVL'}
          labelFontWeight={600}
          value={'$300k'}
          valueFontColor={'white'}
          valueFontWeight={600}
          valueFontSize={18}
        />
        <DataField
          label={''}
          value={'$2000'}
          valueFontSize={14}
          valueFontColor={theme.color.transparent[100]}
        />
      </div>
      <div className={'m-b-12'}>
        <DataField
          label={'ETH Price'}
          labelFontWeight={600}
          value={Number(getDisplayBalance(price.value, 18, 3)).toLocaleString('en-US', { maximumFractionDigits: 3}) + " ARTH"}
          valueFontColor={'white'}
          valueFontWeight={600}
        />
        <DataField
          label={''}
          value={'$2000'}
          valueFontSize={14}
          valueFontColor={theme.color.transparent[100]}
        />
      </div>
      <div className={'m-b-12'}>
        <DataField
          label={'Collateral Ratio'}
          labelFontWeight={600}
          value={'300%'}
          valueFontColor={'white'}
          valueFontWeight={600}
        />
      </div>
      <div className={'m-b-12'}>
        <DataField
          label={'No of Participants'}
          labelFontWeight={600}
          value={'100'}
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

export default PoolInfo;
