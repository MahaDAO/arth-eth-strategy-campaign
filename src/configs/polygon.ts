import { Configuration } from "../utils/interface";

const configurations: { [env: string]: Configuration } = {
  137: {
    networkName: "Polygon",
    networkDisplayName: "Polygon",
    networkIconName: "Polygon",
    chainId: 1,
    etherscanUrl: "https://polygonscan.com",
    defaultProvider: "https://polygon-rpc.com/",
    deployments: require("../protocol/deployments/polygon.json"),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
    blockchainToken: "MATIC",
    blockchainTokenName: "MATIC",
    blockchainTokenDecimals: 18,
    networkSetupDocLink:
      "https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/",
    supportedTokens: ["MAHA", "USDC", "ARTH"],
    decimalOverrides: {
      USDC: 6,
    },
  },
};

export default configurations;
