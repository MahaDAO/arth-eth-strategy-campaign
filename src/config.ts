import ethereum from "./configs/ethereum";
import { Configuration } from "./utils/interface";
import goerli from "./configs/goerli";
import polgyon from "./configs/polygon";
import { isProduction } from "./analytics/Mixpanel";
import { chain } from "wagmi";

const configurations: { [env: string]: Configuration } = {
  ...ethereum,
  ...polgyon,
  ...goerli,
};

export let ConfigChain = [chain.goerli, chain.mainnet];

if (isProduction) {
  delete configurations[5];
  ConfigChain = [chain.mainnet];
}

export default configurations;

export const getSupportedChains = (): number[] =>
  Object.keys(configurations).map((i) => Number(i));

export const getChainsRpc = (): object => {
  var returnObj = {};
  Object.entries(configurations).map(
    // @ts-ignore
    ([k, d]) => (returnObj[k] = d.defaultProvider)
  );
  return returnObj;
};
