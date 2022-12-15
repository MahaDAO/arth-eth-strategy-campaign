import {Redirect, Route, Switch} from "react-router-dom";

import Page from "./components/Page/Page";
import NoPageFound from "./components/NoPageFound";
import ARTHETH from "./views/arth-eth";
import ARTHUSDC from "./views/arth-usdc";

const Navigation = () => {

  return (
    <Switch>
      {/*<Route exact path="/">
        <Page availableNetworks={[137, 1337]}>
          <Home/>
        </Page>
      </Route>*/}
      <Route exact path="/arth-eth-strategy">
        <Page availableNetworks={[137, 1337]}>
          <ARTHETH/>
        </Page>
      </Route>
      <Route exact path="/arth-usdc-strategy">
        <Page availableNetworks={[137, 1337]}>
          <ARTHUSDC/>
        </Page>
      </Route>
      <Route exact path="*">
        <NoPageFound/>
      </Route>
      <Redirect to="/"/>
    </Switch>
  );
}

export default Navigation;
