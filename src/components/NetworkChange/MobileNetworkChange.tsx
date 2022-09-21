import {BigNumber, utils} from 'ethers';
import React, {useCallback, useEffect, useState} from "react";
import styled from 'styled-components';

import config, {getSupportedChains} from '../../config';
import {useGetActiveChainId, useGetUpdateActiveChainId} from '../../state/chains/hooks';
import theme from '../../theme';
import detectEthereumProvider from "@metamask/detect-provider";
import useCore from "../../hooks/useCore";
import {useWallet} from "use-wallet";
import IconLoader from "../IconLoader";
import TextWrapper from "../TextWrapper";
import Modal from "../Modal";

const MobileNetworkChange = () => {
  const activeChainId = useGetActiveChainId();
  const setChainId = useGetUpdateActiveChainId();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const getAvailableChains = getSupportedChains();
  const [wrongNetwork, setWrongNetwork] = React.useState<boolean>(false);

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
      // @ts-ignore
      window.ethereum.request({
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

  const switchMetamaskChain = (chainIds: number) => {
    if (window.ethereum) {
      // @ts-ignore
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: utils.hexStripZeros(
              BigNumber.from(config[chainIds].chainId).toHexString(),
            ),
          },
        ],
      })
        .then(() => {
          setOpenModal(false);
          setChainId(chainIds);
          window.location.reload();
        })
        .catch((error: any) => {
          addNetworkToMetamask(chainIds);
        });
    }
  };

  return (
    <div>
      <DisplayView onClick={() => setOpenModal(true)}>
        <div className="single-line-center-between">
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
        <SignalDot
          color={wrongNetwork
            ? theme.color.red[300]
            : theme.color.green[300]}
        />
      </DisplayView>
      <Modal
        handleClose={() => setOpenModal(false)}
        open={openModal}>
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
      </Modal>
    </div>
  );
};

export default MobileNetworkChange;

const DisplayView = styled.div`
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  padding: 10px 15px;
  cursor: pointer;
  position: relative;
`;

const DifNetName = styled.div`
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
  cursor: pointer;
`;

const ActiveDot = styled.div<{ color: string }>`
  height: 6px;
  width: 6px;
  background: ${({color}) => color};
  border-radius: 50%;
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
