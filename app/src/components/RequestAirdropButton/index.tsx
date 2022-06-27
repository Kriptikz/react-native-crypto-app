import React, {useState} from 'react';
import {Button} from 'react-native';
import {Connection, PublicKey} from '@solana/web3.js';
import {confirmTransaction, requestAirdrop} from '../../utils/solanaUtils';

type RequestAirdropButtonProps = {
  connection: Connection;
  publicKey: PublicKey;
  setVisibility: Function;
};

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function onClick(
  connection: Connection,
  toPublicKey: PublicKey,
  setVisibility: Function,
  setAirdropButtonDisabled: Function,
) {
  setVisibility(true);
  setAirdropButtonDisabled(true);

  const sig = await requestAirdrop(toPublicKey);

  await confirmTransaction(connection, sig);

  setVisibility(false);

  await sleep(10_000);
  setAirdropButtonDisabled(false);
}

export const RequestAirdropButton = (props: RequestAirdropButtonProps) => {
  const [airdropButtonDisabled, setAirdropButtonDisabled] = useState(false);

  return (
    <Button
      onPress={async () =>
        await onClick(
          props.connection,
          props.publicKey,
          props.setVisibility,
          setAirdropButtonDisabled,
        )
      }
      title="Request Airdrop"
      disabled={airdropButtonDisabled}
    />
  );
};
