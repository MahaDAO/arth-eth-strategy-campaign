import {BigNumber, utils} from 'ethers';
import React, {useCallback, useEffect, useState} from "react";
import styled from 'styled-components';

import config, {getSupportedChains} from '../../config';
import {useGetActiveChainId, useGetUpdateActiveChainId} from '../../state/chains/hooks';
import theme from '../../theme';
import detectEthereumProvider from "@metamask/detect-provider";
import {useWallet} from "use-wallet";
import useCore from "../../hooks/useCore";
import IconLoader from "../IconLoader";
import TextWrapper from "../TextWrapper";

const NetworkChange = () => {
  const activeChainId = useGetActiveChainId();
  const setChainId = useGetUpdateActiveChainId();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [wrongNetwork, setWrongNetwork] = React.useState<boolean>(false);
  const getAvailableChains = getSupportedChains();
  const core = useCore();
  const {account}: { account: any } = useWallet();

  const processNetwork = useCallback(async () => {
    const provider: any = await detectEthereumProvider();

    if (provider) {
      const chainId = Number(await provider.request({method: 'eth_chainId'}));
      setWrongNetwork(!getSupportedChains().includes(chainId));
    }
  }, []);

  useEffect(() => {
    processNetwork();
  }, [core, account, processNetwork]);

  const addNetworkToMetamask = (chainId: number) => {
    if (window.ethereum) {
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
          switchMetamaskChain(chainId);
        })
        .catch((error: any) => {
          if (error.code === 4001) {
            console.log('We cannot encrypt anything without the key.');
          }
        });
    }
  };

  const switchMetamaskChain = (chainId: number) => {
    if (window.ethereum) {
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
        .then(() => {
          console.log('Changed');
          setOpenModal(false);
          setChainId(chainId);
          window.location.reload();
        })
        .catch((error: any) => {
          console.log('switchMetamaskChain error', error);
          if (error.code === 4902) addNetworkToMetamask(chainId);
        });
    }
  };

  return (
    <div className={'m-r-12'}>
      <DisplayView onClick={() => getAvailableChains.length > 1 ? setOpenModal(!openModal) : {}}>
        {getAvailableChains.length > 1
          ? <div className="single-line-center-between">
            <IconLoader
              iconName={config[activeChainId].networkIconName}
              iconType={'chains'}
              width={24}
              height={24}
              className={'m-r-8'}
            />
            <TextWrapper text={config[activeChainId].networkDisplayName} className={'m-r-12'}/>
            <IconLoader iconName={'ArrowDown'} iconType={'arrow'}/>
          </div>
          : <div className="single-line-center-between">
            <IconLoader
              iconName={config[activeChainId].networkIconName}
              iconType={'chains'}
              width={24}
              height={24}
              className={'m-r-8'}
            />
            <TextWrapper text={config[activeChainId].networkDisplayName}/>
          </div>
        }
        <SignalDot
          color={wrongNetwork
            ? theme.color.red[300]
            : theme.color.green[300]}
        />
      </DisplayView>
      {openModal && (
        <MainDiv>
          <BackgroundAbsolute onClick={() => setOpenModal(false)}/>
          <PositionDiv>
            <NetworkDropDown>
              {getAvailableChains.map((data) => {
                const active = activeChainId === data;
                return (
                  <DifNetName
                    key={config[data].networkDisplayName}
                    style={
                      active
                        ? {background: 'rgba(255, 255, 255, 0.08)'}
                        : {background: 'transparent'}
                    }
                    onClick={() => switchMetamaskChain(data)}
                  >
                    <div className="single-line-center-between">
                      <div className="single-line-center-start">
                        <IconLoader
                          iconName={config[data].networkIconName}
                          iconType={'chains'}
                          width={24}
                          height={24}
                          className={'m-r-8'}
                        />
                        <TextWrapper text={config[data].networkDisplayName}/>
                      </div>
                      {active &&
                        <ActiveDot
                          color={wrongNetwork
                            ? theme.color.red[300]
                            : theme.color.green[300]}
                        />
                      }
                    </div>
                  </DifNetName>
                );
              })}
            </NetworkDropDown>
          </PositionDiv>
        </MainDiv>
      )}
    </div>
  );
};

export default NetworkChange;

const DisplayView = styled.div`
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  padding: 10px 15px;
  cursor: pointer;
  position: relative;
`;

const NetworkDropDown = styled.div`
  position: absolute;
  top: 74px;
  right: 230px;
  background: ${theme.color.gradients.brown_gradient};
  width: 188px;
  border-radius: 6px;
  backdrop-filter: blur(21px);
  padding: 20px 20px 12px;
`;

const DifNetName = styled.div`
  border-radius: 6px;
  padding: 8px 12px;
  width: 148px;
  margin-bottom: 8px;
  cursor: pointer;
`;

const ActiveDot = styled.div<{ color: string }>`
  height: 6px;
  width: 6px;
  background: ${({color}) => color};
  border-radius: 50%;
`;

const BackgroundAbsolute = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  width: 100vw;
  height: 100vh;
  z-index: 0;
`;

const MainDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  width: 100vw;
  height: 100vh;
`;

const PositionDiv = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
  position: relative;
`;

const SignalDot = styled.div<{ color: string }>`
  position: absolute;
  top: -4px;
  right: -4px;
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: ${({color}) => color};
`
