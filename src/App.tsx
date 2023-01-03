import { Provider } from "react-redux";
import React, { useEffect } from "react";
import { SnackbarProvider } from "notistack";
import { useWallet, UseWalletProvider } from "use-wallet";
import { HashRouter as Router } from "react-router-dom";

import "./App.css";
import "./index.css";

import Popups from "./components/Popups";

import Navigation from "./Navigation";
import TopBar from "./components/TopBar";
import ModalsProvider from "./context/Modals";
import ProtocolProvider from "./context/Provider";

import store from "./state";
import { ConfigChain, getChainsRpc, getSupportedChains } from "./config";
import useCore from "./hooks/useCore";
import Updaters from "./state/Updaters";
import { isProduction } from "./analytics/Mixpanel";
import { ThemeProvider } from "styled-components";
import theme from "./theme";
import { useGetUpdateActiveChainId } from "./state/chains/hooks";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from 'wagmi/providers/alchemy'

import ChainUpdater from "./components/ChainUpdater";
import { myCustomTheme } from "./utils/rainbowKitCustomTheme";

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <WalletProvider>
          <RainbowProvider>{children}</RainbowProvider>
        </WalletProvider>
      </Provider>
    </ThemeProvider>
  );
};

const WalletProvider: React.FC = ({ children }) => {
  return (
    <UseWalletProvider
      connectors={{
        injected: {
          chainId: getSupportedChains(),
        },
        walletconnect: {
          chainId: getSupportedChains(),
          bridge: "https://bridge.walletconnect.org",
          pollingInterval: 12000,
          rpc: { ...getChainsRpc() },
        },
      }}
    >
      <Updaters />
      <ProtocolProvider>
        <AppContent>{children}</AppContent>
      </ProtocolProvider>
    </UseWalletProvider>
  );
};

const RainbowProvider: React.FC = ({ children }) => {
  const { chains, provider } = configureChains(
    ConfigChain,
    [
      isProduction ? alchemyProvider({ apiKey: 'Pqa8x2474ELXnBdyrbgHJE8WciGvie2H' })
        : infuraProvider({ apiKey: 'd3f7dbf6880a410981a74ff7ef8c95cd' })
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "ARTH Vaults",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={myCustomTheme}
        showRecentTransactions={true}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

const AppContent: React.FC = ({ children }) => {
  const core = useCore();
  const { ethereum } = useWallet();
  const setChainId = useGetUpdateActiveChainId();

  useEffect(() => {
    if (ethereum)
      ethereum.on("chainChanged", (chainId: number) => {
        console.log("chain changed", chainId);
        setChainId(chainId);
      });
  }, [ethereum, setChainId]);

  if (!core) return <div />;

  return (
    <ModalsProvider>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        maxSnack={2}
        autoHideDuration={2500}
      >
        <>
          <Popups />
          {children}
        </>
      </SnackbarProvider>
    </ModalsProvider>
  );
};

export const isMobileGlobal = false;

const App: React.FC = () => {
  const makeUnPassive = (ev: any) => {
    ev.preventDefault();
  };

  useEffect(() => {
    document.body.addEventListener("touchmove", makeUnPassive, {
      passive: true,
    });
    return () => document.body.removeEventListener("touchmove", makeUnPassive);
  }, []);

  return (
    <Providers>
      <Router>
        <TopBar />
        <ChainUpdater />
        <Navigation />
      </Router>
    </Providers>
  );
};

export default App;

if (isProduction) console.log = function () {
};
