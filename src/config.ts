import ethereum from "./configs/ethereum";
import { Configuration } from "./utils/interface";
import goerli from "./configs/goerli";
import polgyon from "./configs/polygon";
import { isProduction } from "./analytics/Mixpanel";

const configurations: { [env: string]: Configuration } = {
  ...ethereum,
  ...polgyon,
  ...goerli,
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
