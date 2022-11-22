import ethereum from "./configs/ethereum";
import {Configuration} from "./utils/interface";
import goerli from "./configs/goerli";
import local from "./configs/local";
import {isProduction} from "./analytics/Mixpanel";

const configurations: { [env: string]: Configuration } = {
  // ...ethereum,
  ...local,
  // ...goerli,
};

if (isProduction) {
  delete configurations[5];
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
