import {BigNumber, utils} from 'ethers';
import React, {useState} from 'react';
import styled from 'styled-components';
import {useWallet} from 'use-wallet';

import config from '../../../config';
import {truncateMiddle} from '../../../utils';

import ChooseWallet from './modal/WalletInfo/ChooseWallet';
import DesktopWalletInfo from './modal/WalletInfo/DesktopWalletInfo';
import theme from "../../../theme";
import {useGetActiveChainId} from "../../../state/chains/hooks";
import {BackgroundAbsolute} from '../../Selector';
import TextWrapper from "../../TextWrapper";
import Button from "../../Button";
import IconLoader from "../../IconLoader";
import WrongNetworkModal from "../../WrongNetworkModal";

interface AccountButtonProps {
  showWarning: boolean;
}

const AccountButton: React.FC<AccountButtonProps> = ({
                                                       showWarning = false,
                                                     }: AccountButtonProps) => {
  const [showWalletInfo, setShowWalletInfo] = useState<boolean>(false);
  const [showWalletOption, setShowWalletOption] = useState<boolean>(false);
  const [showWrongNeworkModal, setShowWrongNeworkModal] = useState<boolean>(false);
  const {account} = useWallet();
  const chainId = useGetActiveChainId()

  const switchMetamaskChain = () => {
    if (window.ethereum) {
      window.ethereum
        // @ts-ignore
        .request({
          method: 'wallet_switchEthereumChain',
          params: [
            {chainId: utils.hexStripZeros(BigNumber.from(config.chainId).toHexString())},
          ],
        })
        .then(() => {
          window.location.reload();
        })
        .catch((error: any) => {
          if (error.code === 4902) addNetworkToMetamask();
        });
    }
  };

  const addNetworkToMetamask = () => {
    if (window.ethereum) {
      window.ethereum
        // @ts-ignore
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: utils.hexStripZeros(BigNumber.from(config.chainId).toHexString()),
              chainName: config.networkName,
              rpcUrls: [config[chainId].defaultProvider],
              iconUrls: [],
              blockExplorerUrls: [config.etherscanUrl],
              nativeCurrency: {
                name: config.blockchainTokenName,
                symbol: config.blockchainToken,
                decimals: config.blockchainTokenDecimals,
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
  };

  return (
    <>
      <WrongNetworkModal openModal={showWrongNeworkModal} onModalClose={() => setShowWrongNeworkModal(false)}/>
      <ChooseWallet openModal={showWalletOption} onClose={() => setShowWalletOption(false)}/>
      {showWalletInfo && <BackgroundAbsolute onClick={() => setShowWalletInfo(false)}/>}
      <StyledAccountButton>
        {showWarning ? (
          <WrongNetworkButton onClick={() => setShowWrongNeworkModal(true)}>
            <TextWrapper text={'Wrong Network'} align={'center'} fontWeight={600}/>
          </WrongNetworkButton>
        ) : !account ? (
          <Button
            variant="transparent"
            text="Connect"
            tracking_id={'connect_wallet'}
            onClick={() => {
              setShowWalletOption(true);
            }}
          />
        ) : (
          <Button
            onClick={() => setShowWalletInfo(!showWalletInfo)}
            variant={'transparent'}
            text={truncateMiddle(account, 12, '...')}
          >
            <IconLoader iconName={'Wallet'} width={24} height={24} className="m-r-8"/>
          </Button>
        )}
      </StyledAccountButton>
      <DesktopWalletInfo
        modalOpen={showWalletInfo}
        onClose={() => {
          setShowWalletInfo(false);
        }}
      />
    </>
  );
};

const StyledAccountButton = styled.div``;

export default AccountButton;

const WrongNetworkButton = styled.div`
  padding: 10px 22px;
  width: 100%;
  background: ${theme.color.red[300]};
  border-radius: 6px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
