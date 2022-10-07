import {Configuration} from "../utils/interface";

const configurations: { [env: string]: Configuration } = {
  5: {
    networkName: "Goerli",
    networkDisplayName: "Goerli",
    networkIconName: "Goerli",
    chainId: 5,
    etherscanUrl: "https://goerli.etherscan.io",
    defaultProvider:
      "https://goerli.infura.io/v3/69666afe933b4175afe4999170158a5f",
    deployments: require("../protocol/deployments/goerli.json"),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
    blockchainToken: "ETH",
    blockchainTokenName: "ETH",
    blockchainTokenDecimals: 18,
    networkSetupDocLink:
      "https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/",
    supportedTokens: ["MAHA", "ARTH", "WETH"],
    decimalOverrides: {},
  },
};

export default configurations;
