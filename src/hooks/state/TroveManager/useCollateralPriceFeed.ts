import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { useBlockNumber } from "../../../state/application/hooks";
import useCore from "../../useCore";

type State = {
  isLoading: boolean;
  value: BigNumber;
};

const useCollateralPriceFeed = () => {
  const [data, setData] = useState<State>({
    isLoading: true,
    value: BigNumber.from(0),
  });

  const core = useCore();
  const { account } = useWallet();
  const blockNumber = useBlockNumber();
  const tokenDecimals = 18;

  const fetchValue = useCallback(async () => {
    if (!account) {
      setData({ isLoading: false, value: BigNumber.from(0) });
      return;
    }

    const contract = core.getPriceFeed();
    const price: BigNumber = await contract.callStatic.fetchPrice();
    const calcValue = price.div(
      BigNumber.from(10).pow(18 - (tokenDecimals || 18))
    );

    if (!data.value.eq(calcValue)) {
      setData({
        isLoading: false,
        value: calcValue,
      });
    }
  }, [account, core, tokenDecimals, data.value]);

  useEffect(() => {
    if (core.isUnlocked) {
      fetchValue().catch((err) =>
        console.error(`Failed to fetch price: ${err}`)
      );
    }
  }, [blockNumber, core.isUnlocked, fetchValue]);

  return data;
};

export default useCollateralPriceFeed;
