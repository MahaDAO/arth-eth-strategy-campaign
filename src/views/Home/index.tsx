import Card from "./component/Card";
import {Grid} from "@material-ui/core";
import IconLoader from "../../components/IconLoader";
import MoreSoon from "./component/MoreSoon";
import bgImage from "../../assets/images/bg.png";
import React from "react";
import styled from "styled-components";

const Home = () => {
  return (
    <div className={'custom-container'}>
      <BgImage src={bgImage}/>
      <Grid container spacing={2}>
        <Grid item lg={4} md={6} sm={12} xs={12}>
          <Card
            title={'ARTH-ETH Strategy'}
            desc={<div><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. mmy text of the printing and
              typesetting industry</p>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. simply dummy text of the
                printing and.</p>
            </div>}
            learnMore={'/#/arth-eth-strategy'}
            icon={<IconLoader iconName={'ETH'} iconType={'tokenSymbol'} width={100}/>}
            visitLink={'/#/arth-eth-strategy'}
            trackingId={'visit-arth-eth-strategy'}
          />
        </Grid>
        <Grid item lg={4} md={6} sm={12} xs={12}>
          <Card
            title={'ARTH-USDC Strategy'}
            desc={<div><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. mmy text of the printing and
              typesetting industry</p>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. simply dummy text of the
                printing and.</p>
            </div>}
            icon={<IconLoader iconName={'USDC'} iconType={'tokenSymbol'} width={100}/>}
            learnMore={'/#/arth-usdc-strategy'}
            visitLink={'/#/arth-usdc-strategy'}
            trackingId={'visit-arth-usdc-strategy'}
            buttonDisabled={true}
            buttonText={'Coming soon'}
          />
        </Grid>
        <Grid item lg={4} md={6} sm={12} xs={12}>
          <MoreSoon/>
        </Grid>
      </Grid>
    </div>
  )
}

export default Home;

const BgImage = styled.img`
  position: absolute;
  left: 0;
  width: 100vw;
  top: 0;
  z-index: -1;
  height: 100vh;
  opacity: 0.5;
`
