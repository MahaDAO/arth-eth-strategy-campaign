import React from 'react';
import styled from 'styled-components';

import Sidebar from "../Sidebar";
import Footer from "../Footer";

interface IProps {
  children: any;
  availableNetworks?: number[]
}

const Page = ({ children }: IProps) => {
  return (
    <MainPageContainer>
      <StyledPage>
        <StyledMain id={"main_page"}>
          {children}
          {/*<Footer/>*/}
        </StyledMain>
      </StyledPage>
    </MainPageContainer>
  )
}

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`;

const StyledMain = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 112px);
  padding-bottom: 80px;
  padding-top: calc(112px);

  @media (max-width: 600px) {
    padding-top: calc(112px);
    padding-bottom: 120px;
  }
`;

const MainPageContainer = styled.div`
  padding: 0 60px;
  width: 100vw;
  display: flex;
  @media (max-width: 600px) {
    padding: 0;
  }
`;

export default Page;
