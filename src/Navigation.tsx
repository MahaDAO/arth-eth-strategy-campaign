import {Redirect, Route, Switch} from "react-router-dom";

import Page from "./components/Page/Page";
import Home from "./views/Home";
import NoPageFound from "./components/NoPageFound";
import Campaign from "./views/Campaign";

const Navigation = () => {
  return (
    <Switch>
      {/*<Route exact path="/">
        <Page availableNetworks={[137, 1337]}>
          <Home/>
        </Page>
      </Route>*/}
      <Route exact path="/">
        <Page availableNetworks={[137, 1337]}>
          <Campaign />
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
