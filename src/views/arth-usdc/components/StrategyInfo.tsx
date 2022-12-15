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
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
          <br/>
          <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled</p>
          <br/>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>
      }
      />
    </div>
  )
}

export default StrategyInfo;
