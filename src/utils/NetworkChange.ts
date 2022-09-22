import {BigNumber, utils} from "ethers";
import config from "../config";

export const switchMetamaskChain = (chainId: number) => {
  // @ts-ignore
  if (window.ethereum) {
    // @ts-ignore
    window.ethereum
      .request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: utils.hexStripZeros(
              BigNumber.from(config[chainId].chainId).toHexString(),
            ),
          },
        ],
      })
      .then((data: any) => {
        console.log('switchMetamaskChain data', data);
        window.location.reload();
      })
      .catch((error: any) => {
        console.log('switchMetamaskChain error', error);
        if (error.code === 4902) addNetworkToMetamask(chainId);
      });
  }
};

export const addNetworkToMetamask = (chainId: number) => {
  // @ts-ignore
  if (window.ethereum) {
    // @ts-ignore
    window.ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: utils.hexStripZeros(
              BigNumber.from(config[chainId].chainId).toHexString(),
            ),
            chainName: config[chainId].networkName,
            rpcUrls: [config[chainId].defaultProvider],
            iconUrls: [],
            blockExplorerUrls: [config[chainId].etherscanUrl],
            nativeCurrency: {
              name: config[chainId].blockchainTokenName,
              symbol: config[chainId].blockchainToken,
              decimals: config[chainId].blockchainTokenDecimals,
            },
          },
        ],
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error: any) => {
        if (error.code === 4001) {
          console.log('We cannot encrypt anything without the key.');
        }
      });
  }
};

