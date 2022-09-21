import Modal from "../Modal";
import TextWrapper from "../TextWrapper";
import React from "react";
import {BigNumber, utils} from "ethers";
import InfoTip from "../InfoTip";
import {IModalProps} from "../../utils/interface";
import config, {getSupportedChains} from "../../config";
import {useGetUpdateActiveChainId} from "../../state/chains/hooks";

const WrongNetworkModal = (props: IModalProps) => {
  const {openModal, onModalClose} = props;
  const getAvailableChains = getSupportedChains();
  const setChainId = useGetUpdateActiveChainId();

  const addNetworkToMetamask = (chainId: number) => {
    console.log('addNetworkToMetamask')
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

  const switchMetamaskChain = (chainId: number) => {
    console.log('switchMetamaskChain')
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
    <Modal
      open={openModal}
      handleClose={onModalClose}
      title={'Wrong Network'}
      closeButton
    >
      <TextWrapper
        text={'Please connect to a supported network in the dropdown menu or in your wallet.'}
        className={'m-b-24'}
        fontSize={16}
        align={'center'}
      />
      <TextWrapper
        text={'List of supported network:'}
        className={'m-b-8'}
        align={'center'}
      />
      <TextWrapper
        text={
          <div>
            {getAvailableChains.map((data, index) => {
              return (
                <span className={'m-r-8 links pointer'} onClick={() => switchMetamaskChain(data)} key={index}>
                {`${config[data].networkDisplayName}${getAvailableChains.length - 1 === index ? '' : ','}`}
              </span>
              )
            })}
          </div>
        }
        className={'m-b-8'}
        align={'center'}
      />
      <InfoTip type={'Info'} msg={'You can click on any of the network to add them to your wallet or switch network'}/>
    </Modal>
  )
}

export default WrongNetworkModal;
