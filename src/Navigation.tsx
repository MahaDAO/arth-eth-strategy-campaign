import {Redirect, Route, Switch} from "react-router-dom";

import Page from "./components/Page/Page";
import NoPageFound from "./components/NoPageFound";
import ARTHETH from "./views/arth-eth";
import ARTHUSDC from "./views/arth-usdc";
import Home from "./views/Home";
import ComingSoon from "./components/ComingSoon";
import ReDepolying from "./components/ReDepolying";

const Navigation = () => {

  return (
    <Switch>
      <Route exact path="*">
        <Page>
          <ReDepolying/>
        </Page>
      </Route>
    </Switch>
  )

  return (
    <Switch>
      <Route exact path="/">
        <Page>
          <Home/>
        </Page>
      </Route>
      <Route exact path="/arth-eth-strategy">
        <Page>
          <ARTHETH/>
        </Page>
      </Route>
      <Route exact path="/arth-usdc-strategy">
        <Page>
          <ARTHUSDC/>
        </Page>
      </Route>
      <Route exact path="*">
        <NoPageFound/>
      </Route>
    </Switch>
  );
}

export default Navigation;
