import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { NavLink } from "react-router-dom";
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

import { useGetActiveChainId } from '../../../state/chains/hooks';
import { truncateMiddle } from '../../../utils';
import MobileNetworkChange from '../../NetworkChange/MobileNetworkChange';
import MobileTransactionInfo from '../components/modal/Transaction/MobileTransactionInfo';

import MobileWalletInfo from './modal/WalletInfo/MobileWalletInfo';
import theme from "../../../theme";
import config from "../../../config";
import WrongNetworkModal from "../../WrongNetworkModal";
import { BackgroundAbsolute } from '../../Selector';
import TextWrapper from "../../TextWrapper";
import Button from "../../Button";
import IconLoader from "../../IconLoader";

interface props {
  openMenu: boolean;
  isMainnet: boolean;
  showWarning: boolean;
  onClick: () => void;
  onWalletClick: () => void;
}

const MobileNav = (props: props) => {
  const isMobile = useMediaQuery({ maxWidth: '600px' });
  const { account, connect } = useWallet();
  const chainId = useGetActiveChainId();
  const [showWalletInfo, setShowWalletInfo] = useState<boolean>(false);
  const [showTxModal, setShowTxModal] = useState<boolean>(false);
  const [showWrongNeworkModal, setShowWrongNeworkModal] = useState<boolean>(false);

  return (
    <div>
      <MobileWalletInfo
        modalOpen={showWalletInfo && isMobile}
        onClose={() => setShowWalletInfo(false)}
      />
      <WrongNetworkModal openModal={showWrongNeworkModal} onModalClose={() => setShowWrongNeworkModal(false)} />
      <MobileTransactionInfo openModal={showTxModal} onDismiss={() => setShowTxModal(false)} />

      {props.openMenu && <BackgroundAbsolute onClick={() => props.onClick()} />}
      <StyledNav
        style={{
          width: props.openMenu ? '100%' : '0%',
          opacity: props.openMenu ? 1 : 0
        }}>
        <WalletButton className="bottom-divider">
          {props.showWarning ? (
            <WrongNetworkButton onClick={() => setShowWrongNeworkModal(true)}>
              <TextWrapper text={'Wrong Network'} align={'center'} fontWeight={600} />
            </WrongNetworkButton>
          ) : !account ? (
            <Button
              text="Connect"
              tracking_id={'connect_wallet'}
              onClick={() => {
                connect('injected')
                  .then(() => {
                    console.log('Connected');
                    localStorage.removeItem('disconnectWallet');
                  })
                  .catch((e) => {
                    console.log('Connection error', e);
                  });
              }}
            />
          ) : (
            <div className="w-100 p-b-20 bottom-divider">
              <div className="m-b-8">
                <Button
                  onClick={() => setShowWalletInfo(!showWalletInfo)}
                  variant={'transparent'}
                  text={truncateMiddle(account, 12, '...')}
                >
                  <IconLoader iconName={'Wallet'} width={24} height={24} className="m-r-8" />
                </Button>
              </div>

              <Button
                onClick={() => {
                  setShowTxModal(true);
                }}
                variant={'transparent'}
                text={'Transactions'}
              >
                <IconLoader iconName={'Transaction'} width={24} height={24} className="m-r-8" />
              </Button>
            </div>
          )}
          <div className={'m-t-16'}>
            <MobileNetworkChange />
          </div>
        </WalletButton>
        <TopMenu className="bottom-divider">
          <StyledLink exact activeClassName="activeSidebar" onClick={props.onClick} to="/locker">
            Lock MAHA
          </StyledLink>
          <StyledLink exact activeClassName="activeSidebar" onClick={props.onClick} to="/pools-vote">
            Pools Vote
          </StyledLink>
          <StyledLink exact activeClassName="activeSidebar" onClick={props.onClick} to="/v3staking">
            Farming
          </StyledLink>
          <StyledLink exact activeClassName="activeSidebar" onClick={props.onClick} to="/rewards">
            Rewards &amp; Fees
          </StyledLink>
          <StyledLink exact activeClassName="activeSidebar" onClick={props.onClick} to="/pool-incentives">
            Pool Incentives
          </StyledLink>
          {/* <StyledLink exact activeClassName="activeSidebar" onClick={props.onClick} to="/fees">
            Fees
          </StyledLink> */}
          <StyledLinkHref href="https://www.tally.xyz/governance/eip155:1:0xFfEC018583152aB5f056c5323f1f68b701bF1Bc5"
            target={"_blank"}>
            <div className={"single-line-center-start"}>
              <p>Governance</p>
              <IconLoader iconName={"ArrowLinkColored"} iconType={"arrow"} />
            </div>
          </StyledLinkHref>
          <StyledLinkHref href="https://debt.mahadao.com" target={"_blank"}>
            <div className={"single-line-center-start"}>
              <p>Debt Pool</p>
              <IconLoader iconName={"ArrowLinkColored"} iconType={"arrow"} />
            </div>
          </StyledLinkHref>
          <StyledLinkHref href="https://discuss.mahadao.com" target={"_blank"}>
            <div className={"single-line-center-start"}>
              <p>Forums</p>
              <IconLoader iconName={"ArrowLinkColored"} iconType={"arrow"} />
            </div>
          </StyledLinkHref>

          <StyledLink exact activeClassName="activeSidebar" onClick={props.onClick} to="/delegation">
            Delegation
          </StyledLink>

          {config[chainId].chainId !== 1 &&
            <StyledLink exact activeClassName="activeSidebar" onClick={props.onClick} to="/faucet">
              Faucet
            </StyledLink>
          }
        </TopMenu>
        <BottomMenu className="bottom-divider">
          <StyledLinkHref href="https://dune.com/mahadao/staking-governance" target={'_blank'}>
            <div className={"single-line-center-start"}>
              <p>Analytics</p>
              <IconLoader iconName={"ArrowLinkColored"} iconType={"arrow"} />
            </div>
          </StyledLinkHref>
          <StyledLinkHref href="https://docs.mahadao.com/governance/governance-portal" target={'_blank'}>
            <div className={"single-line-center-start"}>
              <p>Documentation</p>
              <IconLoader iconName={"ArrowLinkColored"} iconType={"arrow"} />
            </div>
          </StyledLinkHref>
          <StyledLinkHref
            href="https://www.youtube.com/watch?v=qxtyvcckgGg&list=PL2bcCoQ5RXeGh-Gkh1QZE_SjevMIDdtgN&index=8"
            target={'_blank'}>
            <div className={"single-line-center-start"}>
              <p>Video Tutorials</p>
              <IconLoader iconName={"ArrowLinkColored"} iconType={"arrow"} />
            </div>
          </StyledLinkHref>
        </BottomMenu>
      </StyledNav>
    </div>
  );
};

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 70px;
  width: 100%;
  left: 0;
  background: #1e1d1d;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  height: calc(100vh - 72px);
  overflow-y: scroll;
  transition: 0.2s ease-out;
  z-index: 111;
`;

const TopMenu = styled.div`
  padding: 24px 12px 16px 12px;
  width: 100%;
`;

const BottomMenu = styled.div`
  padding: 24px 12px 16px 12px;
  width: 100%;
`;

const WalletButton = styled.div`
  padding: 24px 12px 16px 12px;
  width: 100%;
`;

const StyledLink = styled(NavLink)`
  padding: 8px 16px;
  width: 100%;
  border-radius: 2px;
  display: block;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff88;
  margin-bottom: 8px;

  &:hover {
    outline: 1px solid rgba(255, 255, 255, 0.08);
    color: #ffffff88;
    opacity: 1;
  }
`;

const StyledLinkHref = styled.a`
  padding: 8px 16px;
  width: 100%;
  border-radius: 2px;
  display: block;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff88;
  margin-bottom: 8px;

  &:hover {
    outline: 1px solid rgba(255, 255, 255, 0.08);
    color: #ffffff88;
    opacity: 1;
  }

  &:active {
    background: rgba(255, 255, 255, 0.01);
    border-radius: 2px;
    width: 100%;
    color: #ffffff88;
    opacity: 1;
  }
`;

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

export default MobileNav;
