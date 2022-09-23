import styled from "styled-components";
import theme from "../../theme";
import DataField from "../../components/DataField";
import React from "react";

const PositionDetails = () => {
  return (
    <div>
      <div className={'material-primary'}>
        <div className={'m-b-12'}>
          <DataField
            label={'Your Position'}
            labelFontWeight={600}
            value={`${Number('1200').toLocaleString('en-US', {maximumFractionDigits: 3})} ETH`}
            valueFontColor={'white'}
            valueFontWeight={600}
          />
          <DataField
            label={'These are the estimated value actual value might change'}
            labelFontSize={10}
            value={Number('1200').toLocaleString('en-US', {maximumFractionDigits: 3}) + ' ARTH'}
            valueFontColor={'white'}
            valueFontWeight={600}
            position={'start-between'}
          />
        </div>
      </div>
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

export default PositionDetails;

const Rewards = styled.div`
  background: ${theme.color.gradients.orange_gradient};
  padding: 24px;
  border-radius: 6px;
`
