import {useWallet} from 'use-wallet';
import {BigNumber, utils} from 'ethers';
import React, {useCallback, useEffect, useState} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

import Button from '../Button';
import config, {getSupportedChains} from '../../config';
import useCore from '../../hooks/useCore';
import {ButtonProps} from '../Button/Button';

import ChooseWallet from '../TopBar/components/modal/WalletInfo/ChooseWallet';

const ActionButton = (props: ButtonProps) => {
  const core = useCore();
  const {account, ethereum}: { account: any, ethereum?: any } = useWallet();

  const [showWarning, setShowWarning] = React.useState<boolean>(false);
  const [showWalletOption, setShowWalletOption] = useState<boolean>(false);

  const switchMetamaskChain = () => {
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: utils.hexStripZeros(BigNumber.from(config.chainId).toHexString())}],
      })
        .then(() => {
          window.location.reload();
        })
        .catch((error: any) => {
          if (error.code === 4902) addNetworkToMetamask();
        });
    }
  }

  const addNetworkToMetamask = () => {
    if (!ethereum?.request) return;
    if (ethereum) {
      ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: utils.hexStripZeros(BigNumber.from(config.chainId).toHexString()),
              chainName: config.networkName,
              rpcUrls: [],
              iconUrls: [],
              blockExplorerUrls: [config.etherscanUrl],
              nativeCurrency: {
                name: config.blockchainTokenName,
                symbol: config.blockchainToken,
                decimals: config.blockchainTokenDecimals
              },
            },
          ],
        })
        .then(() => {
          window.location.reload();
        })
        .catch((error: any) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error.
            console.log('We cannot encrypt anything without the key.');
          }
        });
    }
  }

  const processNetwork = useCallback(async () => {
    const provider: any = await detectEthereumProvider();

    if (provider) {
      const chainId = Number(await provider.request({method: 'eth_chainId'}));
      setShowWarning(!getSupportedChains().includes(chainId));
    }
  }, []);

  useEffect(() => {
    processNetwork();
  }, [core, processNetwork, account]);

  return (
    <div>
      <ChooseWallet
        openModal={showWalletOption}
        onClose={() => setShowWalletOption(false)}
      />
      {
        showWarning ? (
          <Button
            onClick={switchMetamaskChain}
            text="Switch network"
          />
        ) : (
          !account ? (
            <Button
              text="Connect Wallet"
              tracking_id={'connect_wallet_before_button'}
              onClick={() => {
                setShowWalletOption(true);
              }}
            />
          ) : (
            <Button
              {...props}
            />
          ))
      }
    </div>
  );
}

export default ActionButton;
