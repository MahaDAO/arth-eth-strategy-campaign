import { useMemo } from 'react';

import { BasicBooleanState } from "../../utils/interface";
import { useWallet } from "use-wallet";

const useGetIsEligible = () => {
  const { account } = useWallet();

  const balance: BasicBooleanState = useMemo(() => {
    if (account) {
      return { isLoading: false, value: true }
    } else {
      return { isLoading: false, value: false };
    }
  }, [account]);

  return balance;
};

export default useGetIsEligible;
