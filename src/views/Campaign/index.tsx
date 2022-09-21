import React from "react";
import {Grid} from "@material-ui/core";

import OpenPosition from "../OpenPosition";
import Header from "./components/Header";
import PoolInfo from "./components/PoolInfo";
import LoanInfo from "./components/LoanInfo";

const Campaign = () => {
  return (
    <div className={'custom-container'}>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Header/>
          <OpenPosition/>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <PoolInfo/>
          <LoanInfo/>
        </Grid>
      </Grid>
    </div>
  )
}

export default Campaign;
