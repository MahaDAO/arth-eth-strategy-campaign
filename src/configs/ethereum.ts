import {Configuration} from "../utils/interface";

const configurations: { [env: string]: Configuration } = {
  1: {
    networkName: "Ethereum",
    networkDisplayName: "Ethereum",
    networkIconName: "Ethereum",
    chainId: 1,
    etherscanUrl: "https://etherscan.io",
    defaultProvider: "https://mainnet.infura.io/v3/",
    deployments: require("../protocol/deployments/ethereum.json"),
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
