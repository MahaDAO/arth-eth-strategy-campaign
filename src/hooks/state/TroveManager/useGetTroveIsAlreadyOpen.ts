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

    const contract = core.getSortedTroves();
    const value = await contract.contains(core.myAccount);
    setValue({ isLoading: false, value: value });
  }, [core, account]);

  useEffect(() => {
    if (core.isUnlocked) {
      fetchValue().catch((err) =>
        console.error(`Failed to fetch trove details: ${err}`)
      );
    }
  }, [core.isUnlocked, core.myAccount, account, blockNumber, fetchValue]);

  return value;
};
