import React from 'react';
import styled from 'styled-components';

import ComingSoonImg from '../../assets/images/ComingSoon.svg';
import theme from '../../theme';
import TextWrapper from "../TextWrapper";
import {ConnectButton} from "@rainbow-me/rainbowkit";

const ComingSoon = () => {
  return (
    <MainContainer className="single-line-center-center mo-custom-container">
      <div className="text-center">
        <div className="single-line-center-center">
          <img src={ComingSoonImg} alt={'ComingSoon'} className="m-b-24"/>
        </div>
        <TextWrapper
          text={'Wrong Network'}
          fontWeight={'bold'}
          fontSize={32}
          fontFamily={'Syne'}
          className="m-b-4"
          align={'center'}
        />
        <TextWrapper
          text={'Your connected network is unsupported.'}
          fontWeight={300}
          Fcolor={theme.color.transparent[100]}
          align={'center'}
        />
        <Connect className={'single-line-center-start m-t-32 m-auto'}>
          <ConnectButton/>
        </Connect>
      </div>
    </MainContainer>
  );
};

export default ComingSoon;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
`;


const Connect = styled.div`
  width: 170px;
`
