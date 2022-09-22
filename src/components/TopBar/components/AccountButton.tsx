import {BigNumber, utils} from 'ethers';
import React, {useState} from 'react';
import styled from 'styled-components';
import {useWallet} from 'use-wallet';

import config, {getSupportedChains} from '../../../config';
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
import {switchMetamaskChain} from "../../../utils/NetworkChange";

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
  const getAvailableChains = getSupportedChains();

  return (
    <>
      <WrongNetworkModal openModal={showWrongNeworkModal} onModalClose={() => setShowWrongNeworkModal(false)}/>
      <ChooseWallet openModal={showWalletOption} onClose={() => setShowWalletOption(false)}/>
      {showWalletInfo && <BackgroundAbsolute onClick={() => setShowWalletInfo(false)}/>}
      <StyledAccountButton>
        {showWarning ? (
          <WrongNetworkButton
            onClick={() =>
              getAvailableChains.length > 1
                ? setShowWrongNeworkModal(true)
                : switchMetamaskChain(getAvailableChains[0])}>
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
