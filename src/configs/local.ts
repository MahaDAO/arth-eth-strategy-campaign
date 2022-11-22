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
    supportedTokens: ["MAHA", "ARTH", "WETH"],
    decimalOverrides: {
      USDC: 6,
    },
    poolAddress: "0xE7cDba5e9b0D5E044AaB795cd3D659aAc8dB869B"
  },
};

export default configurations;
