import {BigNumber} from "ethers";
import {useCallback, useEffect, useState} from "react";
import {useWallet} from "use-wallet";
import {useBlockNumber} from "../../../state/application/hooks";
import useCore from "../../useCore";
import {BasicBooleanState, BasicState} from "../../../utils/interface";
import {LOADING_DEFAULT_BASIC_STATE, NON_LOADING_DEFAULT_BASIC_STATE} from "../../../utils/constants";

const useGetDepositedAmount = () => {
  const [data, setData] = useState<BasicState>(LOADING_DEFAULT_BASIC_STATE);

  const core = useCore();
  const {account} = useWallet();
  const blockNumber = useBlockNumber();

  const fetchValue = useCallback(async () => {
    if (!account) {
      setData(NON_LOADING_DEFAULT_BASIC_STATE);
      return;
    }

    const contract = core.getARTHUSDCCurveLpStrategy();
    const balance: BigNumber = await contract.balanceOf(account);
    setData({
      isLoading: false,
      value: balance,
    })

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

export default useGetDepositedAmount;
