import React from "react";
import { Grid } from "@material-ui/core";

import OpenPosition from "../OpenPosition";
import Header from "./components/Header";
import PoolInfo from "./components/PoolInfo";
import styled from "styled-components";
import TextWrapper from "../../components/TextWrapper";
import theme from "../../theme";
import useGetIsEligible from "../../hooks/state/useGetIsEligible";
import LoadingPage from "../../components/LoadingPage";
import ActionButton from "../../components/ActionButton";
import PostionDetails from "../PostionDetails";
import AprInfo from "./components/AprInfo";

import useGetPositionDetails from "../../hooks/state/useGetPositionDetails";
import SummaryView from "./components/SummaryView";

const Campaign = () => {
  const isEligible = useGetIsEligible();
  const positionDetails = useGetPositionDetails();

  return (
    <div className={'custom-container'}>
      <Header />
      {
        isEligible.isLoading
          ? <LoadingPage />
          : <Grid container spacing={3}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <div className={'mo-custom-container'}>
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
                      : <OpenPosition />
                  }
                </FormPart>
              </div>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <div className={'mo-custom-container'}>
                <SummaryView ethAmount="1" />
                {/* <PoolInfo /> */}
                <AprInfo />
              </div>
            </Grid>
          </Grid>
      }
    </div>
  )
}

export default Campaign;


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
