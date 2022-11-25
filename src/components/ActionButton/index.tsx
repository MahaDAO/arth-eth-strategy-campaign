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
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount, useNetwork} from "wagmi";

const ActionButton = (props: ButtonProps) => {
  const core = useCore();

  const [showWarning, setShowWarning] = React.useState<boolean>(false);
  const [showWalletOption, setShowWalletOption] = useState<boolean>(false);

  const {address: account, isDisconnected} = useAccount();
  const {chain} = useNetwork();

  console.log('account', account, !chain?.unsupported, isDisconnected);

  /*const processNetwork = useCallback(async () => {
    const provider: any = await detectEthereumProvider();

    if (provider) {
      const chainId = Number(await provider.request({method: 'eth_chainId'}));
      setShowWarning(!getSupportedChains().includes(chainId));
    }
  }, []);*/

  /*useEffect(() => {
    processNetwork();
  }, [core, processNetwork, account]);*/

  return (
    <div>
      <ChooseWallet
        openModal={showWalletOption}
        onClose={() => setShowWalletOption(false)}
      />
      {
        isDisconnected || account === undefined || chain?.unsupported
          ? <ConnectButton/>
          : <Button {...props} />
      }
    </div>
  );
}

export default ActionButton;
