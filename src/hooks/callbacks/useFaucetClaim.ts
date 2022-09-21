import {BigNumber, Contract} from 'ethers';
import {useCallback} from 'react';
import {useWallet} from 'use-wallet';

import ABIS from '../../protocol/deployments/abi';
import {useAddPopup} from '../../state/application/hooks';
import {useTransactionAdder} from '../../state/transactions/hooks';

import useCore from '../useCore';
import ERC20 from '../../protocol/ERC20';
import formatErrorMessage from '../../utils/formatErrorMessage';

const useFaucetClaim = () => {
  const core = useCore();
  const addPopup = useAddPopup();
  const {account} = useWallet();
  const addTransaction = useTransactionAdder();

  const action = useCallback(async (token: ERC20, callback?: () => void): Promise<void> => {
    try {
      const contract = new Contract(token.address, ABIS.MockERC20, core._signer);
      const response = await contract.mint(account, BigNumber.from(10).pow(token.decimal).mul(1000));

      addTransaction(response, {
        summary: `Claim ${token.symbol} from faucet.`
      });

      if (callback) callback();
    } catch (e: any) {
      addPopup({
        error: {
          message: formatErrorMessage(e?.data?.message || e?.message),
          stack: e?.stack,
        },
      });
    }
  }, [core, account, addPopup, addTransaction]);

  return action;
}

export default useFaucetClaim;
