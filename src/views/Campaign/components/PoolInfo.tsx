import React from "react";
import TextWrapper from "../../../components/TextWrapper";
import DataField from "../../../components/DataField";
import theme from "../../../theme";

const PoolInfo = () => {
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
          label={'These are the estimated value actual value might change'}
          labelFontSize={10}
          value={'^ 6.78%'}
          valueFontColor={theme.color.green[300]}
          valueFontWeight={300}
          valueFontSize={12}
        />
      </div>
      <div className={'m-b-12'}>
        <DataField
          label={'Volume 24h'}
          labelFontWeight={600}
          value={'$3k'}
          valueFontColor={'white'}
          valueFontWeight={600}
          valueFontSize={18}
        />
        <DataField
          label={'These are the estimated value actual value might change'}
          labelFontSize={10}
          value={'^ 10.78%'}
          valueFontColor={theme.color.green[300]}
          valueFontWeight={300}
          valueFontSize={12}
        />
      </div>
      <div className={'m-b-12'}>
        <DataField
          label={'Trading fee 24h'}
          labelFontWeight={600}
          value={'$300'}
          valueFontColor={'white'}
          valueFontWeight={600}
          valueFontSize={18}
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
