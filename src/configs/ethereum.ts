import { Configuration } from "../utils/interface";

const configurations: { [env: string]: Configuration } = {
  1: {
    networkName: "Ethereum",
    networkDisplayName: "Ethereum",
    networkIconName: "Ethereum",
    chainId: 1,
    etherscanUrl: "https://etherscan.io",
    defaultProvider:
      "https://eth-mainnet.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
    deployments: require("../protocol/deployments/ethereum.json"),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
    blockchainToken: "ETH",
    blockchainTokenName: "ETH",
    blockchainTokenDecimals: 18,
    networkSetupDocLink:
      "https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/",
    supportedTokens: ["MAHA", "USDC"],
    decimalOverrides: {
      USDC: 6,
    },
    poolAddress: "0xE7cDba5e9b0D5E044AaB795cd3D659aAc8dB869B",
  },
};

export default configurations;
