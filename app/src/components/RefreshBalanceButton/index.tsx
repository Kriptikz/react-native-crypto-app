import React from 'react';
import * as web3 from '@solana/web3.js';
import {Button} from 'react-native';
import {getSolBalance} from '../../utils/solanaUtils';

type RefreshBalanceButtonProps = {
  connection: web3.Connection;
  publicKey: web3.PublicKey;
  setWalletBalance: Function;
};

async function onClick(
  connection: web3.Connection,
  publicKey: web3.PublicKey,
  setBalance: Function,
) {
  setBalance(await getSolBalance(connection, publicKey));
}

export const RefreshBalanceButton = (props: RefreshBalanceButtonProps) => {
  return (
    <Button
      onPress={async () =>
        await onClick(props.connection, props.publicKey, props.setWalletBalance)
      }
      title="Refresh Balance"
    />
  );
};
