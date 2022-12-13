import React from "react";
import DataField from "../../../components/DataField";
import theme from "../../../theme";

const AprInfo = () => {
  return (
    <div className={'material-primary m-b-24'}>
      <div className={'m-b-12'}>
        <DataField
          label={'APR'}
          labelFontWeight={600}
          labelFontSize={18}
          value={'5%'}
          valueFontColor={theme.color.primary[300]}
          valueFontSize={18}
          valueFontWeight={600}
        />
      </div>
      {/* <DataField
        label={'MAHA APR'}
        labelFontSize={14}
        value={'12%'}
        valueFontWeight={600}
        valueFontColor={theme.color.green[300]}
        className={'m-b-4'}
      /> */}
    </div>
  )
}

export default AprInfo;
