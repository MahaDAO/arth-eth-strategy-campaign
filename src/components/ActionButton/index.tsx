import React from 'react';

import Button from '../Button';
import {ButtonProps} from '../Button/Button';

import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount, useNetwork} from "wagmi";

const ActionButton = (props: ButtonProps) => {
  const {address: account, isDisconnected} = useAccount();
  const {chain} = useNetwork();

  return (
    <div>
      {
        isDisconnected || account === undefined || chain?.unsupported
          ? <div className={'action-connect-button'}><ConnectButton/></div>
          : <Button {...props} />
      }
    </div>
  );
}

export default ActionButton;
