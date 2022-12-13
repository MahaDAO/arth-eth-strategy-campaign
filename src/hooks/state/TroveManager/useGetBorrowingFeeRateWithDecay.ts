import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { useBlockNumber } from "../../../state/application/hooks";
import useCore from "../../useCore";

type State = {
  isLoading: boolean;
  value: BigNumber;
};

const useGetBorrowingFeeRateWithDecay = () => {
  const [data, setData] = useState<State>({
    isLoading: true,
    value: BigNumber.from(0),
  });

  const core = useCore();
  const { account } = useWallet();
  const blockNumber = useBlockNumber();

  const fetchValue = useCallback(async () => {
    if (!account) {
      setData({ isLoading: false, value: BigNumber.from(0) });
      return;
    }

    const contract = core.getTroveManager();
    const value: BigNumber = await contract.getBorrowingRateWithDecay();

    setData({
      isLoading: false,
      value: value,
    });
  }, [account, core]);

  useEffect(() => {
    if (core.isUnlocked) {
      fetchValue().catch((err) =>
        console.error(`Failed to fetch price: ${err}`)
      );
    }
  }, [blockNumber, core.isUnlocked, fetchValue]);

  return data;
};

export default useGetBorrowingFeeRateWithDecay;
