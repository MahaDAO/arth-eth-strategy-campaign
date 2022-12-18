import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { useMediaQuery } from "react-responsive";

import OpenPosition from "./OpenPosition";
import Header from "./components/Header";
import styled from "styled-components";
import TextWrapper from "../../components/TextWrapper";
import useGetIsEligible from "../../hooks/state/useGetIsEligible";
import LoadingPage from "../../components/LoadingPage";
import ActionButton from "../../components/ActionButton";
import PostionDetails from "./PostionDetails";

import useGetPositionDetails from "../../hooks/state/useGetPositionDetails";
import SummaryView from "./components/SummaryView";
import StrategyInfo from "./components/StrategyInfo";

import bgImage from '../../assets/images/bg.png';

const Campaign = () => {
  const [ethAmount, setEthAmount] = useState<string>("");

  const isEligible = useGetIsEligible();
  const positionDetails = useGetPositionDetails();
  const isMobile = useMediaQuery({ maxWidth: '600px' });

  return (
    <div className={'custom-container'}>
      <BgImage src={bgImage} />
      <Header />
      {
        isEligible.isLoading
          ? <LoadingPage />
          : <Grid container spacing={3}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <div className={'mo-custom-container'}>
                {
                  isMobile && <StrategyInfo />
                }
                <FormPart isEligibile={isEligible.value}>
                  {!isEligible.value && <Hidden>
                    <div>
                      <TextWrapper
                        text={<div>Check your eligibility</div>}
                        align={'center'}
                        className={'m-b-4'}
                      />
                      <div style={{ width: 'max-content', margin: "auto" }}>
                        <ActionButton
                          text={'Check'}
                          onClick={() => {
                          }}
                        />
                      </div>
                    </div>
                  </Hidden>}
                  {
                    positionDetails.value?.isActive
                      ? <PostionDetails />
                      : <OpenPosition ethAmount={ethAmount} setEthAmount={setEthAmount} />
                  }
                </FormPart>
              </div>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <div className={'mo-custom-container'}>
                {!isMobile && <StrategyInfo />}
                {!positionDetails.value?.isActive && <SummaryView ethAmount={ethAmount} />}
                {/* <PoolInfo /> */}
                {/* <AprInfo /> */}
              </div>
            </Grid>
          </Grid>
      }
    </div>
  )
}

export default Campaign;

const BgImage = styled.img`
  position: absolute;
  left: 0;
  width: 100vw;
  top: 0;
  z-index: -1;
  height: 100vh;
  opacity: 0.5;
`

const FormPart = styled.div<{ isEligibile: boolean }>`
  position: relative;
  padding: ${(props) => props.isEligibile ? '0' : '16px'};
`

const Hidden = styled.div`
  position: absolute;
  background: aliceblue;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 2;
  background: rgba(255, 255, 255, 0.02);
  -webkit-backdrop-filter: blur(21px);
  backdrop-filter: blur(21px);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
