import {BigNumber} from "ethers";
import {useCallback, useEffect, useState} from "react";
import {useWallet} from "use-wallet";
import {useBlockNumber} from "../../../state/application/hooks";
import useCore from "../../useCore";
import {BNZERO} from "../../../utils/constants";

interface Values {
  depositedAt: number;
  lockDuration: number;
  totalUsdc: BigNumber;
  usdcSupplied: BigNumber;
  arthBorrowed: BigNumber;
  usdcInLp: BigNumber;
  lpTokensMinted: BigNumber;
};

type State = {
  isLoading: boolean;
  value: Values;
};


const defaultValues: Values = {
  "depositedAt": 0,
  "lockDuration": 0,
  "totalUsdc": BNZERO,
  "usdcSupplied": BNZERO,
  "arthBorrowed": BNZERO,
  "usdcInLp": BNZERO,
  "lpTokensMinted": BNZERO,
}

const useGetPositionDetails = () => {
  const [data, setData] = useState<State>({
    isLoading: true,
    value: defaultValues,
  });

  const core = useCore();
  const {account} = useWallet();
  const blockNumber = useBlockNumber();

  const fetchValue = useCallback(async () => {
    const contract = core.getARTHUSDCCurveLpStrategy();

    const position: Values = await contract.positions(account);

    setData({
      isLoading: false,
      value: position
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

export default useGetPositionDetails;
