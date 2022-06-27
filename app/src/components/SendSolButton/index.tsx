import React from 'react';
import * as web3 from '@solana/web3.js';
import {Button} from 'react-native';
import {confirmTransaction, sendSol} from '../../utils/solanaUtils';

type SendSolButtonProps = {
  connection: web3.Connection;
  fromKeypair: web3.Keypair;
  toPublicKey: web3.PublicKey;
  amount: number;
  setSpinnerVisibility: Function;
};

async function onClick(
  connection: web3.Connection,
  fromKeypair: web3.Keypair,
  toPublicKey: web3.PublicKey,
  amount: number,
  setToggleSpinnerVisibility: Function,
) {
  console.log('Send amount: ', amount);

  if (!isNaN(amount)) {
    setToggleSpinnerVisibility(true);

    // send the transaction
    const signature = await sendSol(
      connection,
      fromKeypair,
      toPublicKey,
      amount,
    );

    const confirmed = confirmTransaction(connection, signature);

    console.log('Confirmed: ', confirmed);
    setToggleSpinnerVisibility(false);
  }
}

export const SendSolButton = (props: SendSolButtonProps) => {
  return (
    <Button
      onPress={async () =>
        await onClick(
          props.connection,
          props.fromKeypair,
          props.toPublicKey,
          props.amount,
          props.setSpinnerVisibility,
        )
      }
      title="Send"
    />
  );
};
