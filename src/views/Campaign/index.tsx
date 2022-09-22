import React from "react";
import {Grid} from "@material-ui/core";

import OpenPosition from "../OpenPosition";
import Header from "./components/Header";
import PoolInfo from "./components/PoolInfo";
import styled from "styled-components";
import TextWrapper from "../../components/TextWrapper";
import Button from "../../components/Button";
import theme from "../../theme";
import DataField from "../../components/DataField";

const Campaign = () => {
  return (
    <div className={'custom-container'}>
      <Header/>
      <Grid container spacing={3}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <FormPart>
            <Hidden>
              <div>
                <TextWrapper
                  text={<div>Check your eligibility</div>}
                  align={'center'}
                  className={'m-b-4'}
                />
                <TextWrapper
                  text={<div>or fill <a href={'#'} className={'links'}>this</a> form if you want to be part of this
                  </div>}
                  align={'center'}
                  className={'m-b-32'}
                  Fcolor={theme.color.transparent[100]}
                />
                <div style={{width: '150px', margin: "auto"}}>
                  <Button
                    text={'Check'}
                    onClick={() => {
                    }}
                  />
                </div>
              </div>
            </Hidden>
            <OpenPosition/>
          </FormPart>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <PoolInfo/>
          <div className={'material-primary m-b-24'}>
            <div className={'m-b-12'}>
              <DataField
                label={'APR'}
                labelFontWeight={600}
                labelFontSize={18}
                value={'50%'}
                valueFontColor={theme.color.primary[300]}
                valueFontSize={18}
                valueFontWeight={600}
              />
              <DataField
                label={'some basic random text'}
                labelFontSize={10}
                value={'40% MAHA APR + 10% Trading Fee'}
                valueFontSize={12}
                valueFontColor={theme.color.transparent[100]}
              />
            </div>
          </div>
          {/*<LoanInfo/>*/}
        </Grid>
      </Grid>
    </div>
  )
}

export default Campaign;

const FormPart = styled.div`
  position: relative;
  padding: 16px;
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
