import {Redirect, Route, Switch} from "react-router-dom";

import Page from "./components/Page/Page";
import NoPageFound from "./components/NoPageFound";
import Campaign from "./views/Campaign";
import {useGetChainId} from "./utils/NetworksCustomHooks";
import {useNetwork} from "wagmi";

const Navigation = () => {
  const chainId = useGetChainId();
  const {chain} = useNetwork();

  console.log('chain', chainId, chain);

  return (
    <Switch>
      {/*<Route exact path="/">
        <Page availableNetworks={[137, 1337]}>
          <Home/>
        </Page>
      </Route>*/}
      <Route exact path="/">
        <Page availableNetworks={[137, 1337]}>
          <Campaign/>
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
