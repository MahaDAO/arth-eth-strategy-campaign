import {useGetChainId} from "../../utils/NetworksCustomHooks";
import React, {useEffect} from "react";
import {useGetUpdateActiveChainId} from "../../state/chains/hooks";

const ChainUpdater = () => {
  const chainId = useGetChainId();
  const setChainId = useGetUpdateActiveChainId();

  useEffect(() => {
    setChainId(chainId);
  }, [chainId, setChainId])

  return <div/>
}

export default ChainUpdater;
