import {useWallet} from 'use-wallet';
import {BigNumber, utils} from 'ethers';
import React, {useCallback, useEffect, useState} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

import Button from '../Button';
import config, {getSupportedChains} from '../../config';
import useCore from '../../hooks/useCore';
import {ButtonProps} from '../Button/Button';

import ChooseWallet from '../TopBar/components/modal/WalletInfo/ChooseWallet';
import {switchMetamaskChain} from "../../utils/NetworkChange";

const ActionButton = (props: ButtonProps) => {
  const core = useCore();
  const {account, ethereum}: { account: any, ethereum?: any } = useWallet();

  const [showWarning, setShowWarning] = React.useState<boolean>(false);
  const [showWalletOption, setShowWalletOption] = useState<boolean>(false);

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
            onClick={() => switchMetamaskChain(1)}
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
