import {Configuration} from "../utils/interface";

const configurations: { [env: string]: Configuration } = {
  1337: {
    networkName: "Local Ethereum",
    networkDisplayName: "LEthereum",
    networkIconName: "Ethereum",
    chainId: 1337,
    etherscanUrl: "https://etherscan.io",
    defaultProvider: "http://127.0.0.1:8545",
    deployments: require("../protocol/deployments/local.json"),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
    blockchainToken: "ETH",
    blockchainTokenName: "ETH",
    blockchainTokenDecimals: 18,
    networkSetupDocLink:
      "https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/",
    supportedTokens: ["MAHA"],
    decimalOverrides: {
      USDC: 6,
    },
  },
};

export default configurations;
