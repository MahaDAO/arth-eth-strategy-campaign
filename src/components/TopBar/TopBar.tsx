import styled from 'styled-components';
import {useLocation} from "react-router-dom";
import {useMediaQuery} from "react-responsive";
import {useWallet} from "use-wallet";
import React, {useCallback, useEffect, useState} from 'react';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import detectEthereumProvider from '@metamask/detect-provider';

import IconLoader from "../IconLoader";
import {Mixpanel} from "../../analytics/Mixpanel";

import Button from "../Button";
import MobileNav from './components/MobileNav';
import AccountButton from './components/AccountButton';

import config, {getSupportedChains} from "../../config";
import useGaTracker from "../../analytics/useGATracker.js";
import MobileTransactionInfo from "./components/modal/Transaction/MobileTransactionInfo";
import DesktopTransactionInfo from "./components/modal/Transaction/DesktopTransactionInfo";
import useCore from '../../hooks/useCore';
import NetworkChange from "../NetworkChange";
import {useGetActiveChainId, useGetUpdateActiveChainId} from "../../state/chains/hooks";
import {useDispatch} from "react-redux";

const TopBar: React.FC = () => {
  useGaTracker();
  const core = useCore();
  const location = useLocation();
  const {account, connect, chainId} = useWallet();
  const isMobile = useMediaQuery({maxWidth: '600px'});
  const activeChainId = useGetActiveChainId();
  // const setAvailableChains = useUpdateAvailableChains();
  const dispatch = useDispatch();

  const [showTxModal, setShowTxModal] = useState<boolean>(false);
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
  const [showMobileMenu, toggleMobileMenu] = useState(false);
  const [showWarning, setShowWarning] = React.useState<boolean>(false);

  /*const processNetwork = useCallback(async () => {
    const provider: any = await detectEthereumProvider();

    if (provider) {
      const chainId = Number(await provider.request({method: 'eth_chainId'}));
      if (getAvailableChains.includes(chainId)) {
        setChainId(chainId);
      } else {
        setShowWarning(true)
      }
    }
  }, [getAvailableChains, setChainId]);*/

  useEffect(() => {
    if (core) {
      core.updateActiveNetwork(activeChainId, dispatch);
    }
  }, [activeChainId, core, dispatch]);

  useEffect(() => {
    Mixpanel.track(`ScreenView:${location.pathname}`, {
      networkName: config[activeChainId]?.networkDisplayName || '',
    });
  }, [activeChainId, location.pathname]);

  useEffect(() => {
    const shouldBeDisconnected = localStorage.getItem('disconnectWallet');
    if (!shouldBeDisconnected && !account) connect('injected').then(r => {
    });

    if (account) {
      Mixpanel.identify(account);
      Mixpanel.people.set({walletId: account});
    }

    // processNetwork()
  }, [account, connect]);

  /* useEffect(() => {
     setAvailableChains(getSupportedChains());
   }, [setAvailableChains]);*/

  return (
    <TopBarContainer>
      {
        isMobile
          ? <MobileTransactionInfo openModal={showTxModal} onDismiss={() => setShowTxModal(false)}/>
          : <DesktopTransactionInfo openModal={showTxModal} onDismiss={() => setShowTxModal(false)}/>
      }
      <StyledTopBar>
        <StyledTopBarInner>
          <HideonPhone>
            <div className="single-line-center-between">
              <div className="dialog-class">
                <IconLoader iconName={'Mahalg'} iconType={'brandLogo'} onClick={() => window.location.href = '/#/'}/>
              </div>
              <div className="single-line-center-start">
                {/*<IconLoader className={"pointer m-r-24"} iconName={'BentoMenu'} iconType={'misc'} onClick={() => {
                  setShowProjectModal(true)
                }} />*/}
                {
                  !!account &&
                  <IconLoader
                    iconName={'Transaction'}
                    className={'pointer m-r-12'}
                    onClick={() => setShowTxModal(true)}
                  />
                }
                {/*<NetworkChange/>*/}
                <ConnectButton showBalance={true}/>
              </div>
            </div>
          </HideonPhone>
          <HideOnBigScreen>
            <div className="single-line-center-between">
              <IconLoader iconName={'Mahalg'} iconType={'brandLogo'} onClick={() => window.location.href = '/#/'}/>
              <div>
                <IconLoader iconName={'BentoMenu'} iconType={'misc'} onClick={() => {
                  setShowProjectModal(true)
                }}/>
              </div>
            </div>
          </HideOnBigScreen>
          <HideOnBigScreen>
            <MobileNav
              openMenu={showMobileMenu}
              showWarning={showWarning}
              isMainnet={true}
              onClick={() => toggleMobileMenu(!showMobileMenu)}
              onWalletClick={() => {
              }}
            />
          </HideOnBigScreen>
        </StyledTopBarInner>
      </StyledTopBar>
    </TopBarContainer>
  );
};

const TopBarContainer = styled.div`
  position: fixed;
  z-index: 100;
  display: flex;
  flex-direction: column;
  width: 100%;
  top: 0;
`;

const HideonPhone = styled.div`
  width: 100%;
  display: block;
  @media (max-width: 600px) {
    display: none;
  };
`;

const HideOnBigScreen = styled.div`
  width: 100%;
  display: none;
  @media (max-width: 600px) {
    display: block;
  };
`;

const StyledTopBar = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  width: 100%;
  background: rgba(0, 0, 0);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
`;

const StyledTopBarInner = styled.div`
  align-content: center;
  display: flex;
  height: 72px;
  justify-content: space-between;
  width: 100%;
  padding: 0 60px;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

const WarningMsg = styled.div`
  display: block;
  background-color: #2A2827;
  padding: 12px 16px;
`;

export default TopBar;
