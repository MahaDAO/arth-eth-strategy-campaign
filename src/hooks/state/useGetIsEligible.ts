import {useMemo} from 'react';

import {BasicBooleanState} from "../../utils/interface";
import {useWallet} from "use-wallet";
import {useGetAccount} from "../../utils/NetworksCustomHooks";

const useGetIsEligible = () => {
  const account = useGetAccount();

  const balance: BasicBooleanState = useMemo(() => {
    if (account) {
      return {isLoading: false, value: true}
    } else {
      return {isLoading: false, value: false};
    }
  }, [account]);

  return balance;
};

export default useGetIsEligible;
