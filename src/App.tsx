import {Provider} from "react-redux";
import React, {useEffect} from 'react';
import {SnackbarProvider} from "notistack";
import {useWallet, UseWalletProvider} from 'use-wallet';
import {HashRouter as Router} from 'react-router-dom';

import './App.css';
import './index.css';

import Popups from "./components/Popups";

import Navigation from './Navigation';
import TopBar from './components/TopBar';
import ModalsProvider from './context/Modals';
import ProtocolProvider from './context/Provider';

import store from "./state";
import {getChainsRpc, getSupportedChains} from './config';
import useCore from "./hooks/useCore";
import Updaters from "./state/Updaters";
import {isProduction} from "./analytics/Mixpanel";
import {ThemeProvider} from "styled-components";
import theme from "./theme";
import {useGetUpdateActiveChainId} from "./state/chains/hooks";

import '@rainbow-me/rainbowkit/styles.css';

import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig
} from "wagmi";
import {publicProvider} from 'wagmi/providers/public';
import ChainUpdater from "./components/ChainUpdater";
import {myCustomTheme} from "./utils/rainbowKitCustomTheme";

const Providers: React.FC = ({children}) => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <WalletProvider>
          <RainbowProvider>
            {children}
          </RainbowProvider>
        </WalletProvider>
      </Provider>
    </ThemeProvider>
  );
};

const WalletProvider: React.FC = ({children}) => {
  return (
    <UseWalletProvider
      connectors={{
        injected: {
          chainId: getSupportedChains(),
        },
        walletconnect: {
          chainId: getSupportedChains(),
          bridge: 'https://bridge.walletconnect.org',
          pollingInterval: 12000,
          rpc: {...getChainsRpc()},
        },
      }}
    >
      <Updaters/>
      <ProtocolProvider>
        <AppContent>{children}</AppContent>
      </ProtocolProvider>
    </UseWalletProvider>
  );
};

const RainbowProvider: React.FC = ({children}) => {
  const {chains, provider} = configureChains([chain.goerli], [publicProvider()]);

  const {connectors} = getDefaultWallets({
    appName: 'Arth Eth Strategy',
    chains
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={myCustomTheme} showRecentTransactions={true}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

const AppContent: React.FC = ({children}) => {
  const core = useCore();
  const {ethereum} = useWallet();
  const setChainId = useGetUpdateActiveChainId();

  useEffect(() => {
    if (ethereum)
      // @ts-ignore
      ethereum.on('chainChanged', (chainId) => {
        console.log('chain changed', chainId);
        setChainId(chainId);
      });
  }, [ethereum, setChainId]);

  if (!core) return <div/>;

  return (
    <ModalsProvider>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        maxSnack={2}
        autoHideDuration={2500}
      >
        <>
          <Popups/>
          {children}
        </>
      </SnackbarProvider>
    </ModalsProvider>
  );
};

export let isMobileGlobal = false;

const App: React.FC = () => {
  const makeUnPassive = (ev: any) => {
    ev.preventDefault();
  };

  useEffect(() => {
    document.body.addEventListener('touchmove', makeUnPassive, {passive: true});
    return () => document.body.removeEventListener('touchmove', makeUnPassive);
  }, []);

  return (
    <Providers>
      <Router>
        <TopBar/>
        <ChainUpdater/>
        <Navigation/>
      </Router>
    </Providers>
  );
};

export default App;

if (isProduction) console.log = function () {
};
