import { useCallback, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { useBlockNumber } from "../../../state/application/hooks";
import useCore from "../../useCore";

type State = {
  isLoading: boolean;
  value: boolean;
};

export default () => {
  const [value, setValue] = useState<State>({ isLoading: true, value: false });

  const core = useCore();
  const { account } = useWallet();
  const blockNumber = useBlockNumber();

  const fetchValue = useCallback(async () => {
    if (!account) {
      setValue({ isLoading: false, value: false });
      return;
    }

    const priceFeedContract = core.getPriceFeed();
    const price = await priceFeedContract.callStatic.fetchPrice();
    const contract = core.getTroveManager();
    const value = await contract.checkRecoveryMode(price);
    setValue({ isLoading: false, value: value });
  }, [core, account]);

  useEffect(() => {
    if (core.isUnlocked) {
      fetchValue().catch((err) =>
        console.error(`Failed to fetch checkRecoveryMode() for ETH: ${err}`)
      );
    }
  }, [core.isUnlocked, account, blockNumber, fetchValue]);

  return value;
};
