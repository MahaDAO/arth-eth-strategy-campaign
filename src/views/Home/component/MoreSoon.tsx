import React from "react";
import styled from "styled-components";
import TextWrapper from "../../../components/TextWrapper";

const MoreSoon = () => {
  return (
    <Main className={'material-secondary'}>
      <div className={'single-line-center-center'} style={{height: '100%'}}>
        <TextWrapper text={'More coming soon'} fontSize={24}/>
      </div>
    </Main>
  )
}

export default MoreSoon;

const Main = styled.div`
  border-radius: 6px;
  height: 100%;
`;
