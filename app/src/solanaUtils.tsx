import * as web3 from '@solana/web3.js';

export enum Networks {
  DEV_SOLANA = 'https://api.devnet.solana.com',
  DEV_GENESYS = 'https://devnet.genesysgo.net/',
}

export function getConnection(network: Networks): web3.Connection {
  return new web3.Connection(network, 'confirmed');
}

export async function sendSol(
  connection: web3.Connection,
  fromKeypair: web3.Keypair,
  toPublicKey: web3.PublicKey,
  amount: number,
) {
  // Create transaction
  const transaction = new web3.Transaction();

  transaction.add(
    web3.SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toPublicKey,
      lamports: amount * web3.LAMPORTS_PER_SOL,
    }),
  );

  // send the transaction
  const result = await connection.sendTransaction(transaction, [fromKeypair]);

  return result;
}

export async function requestAirdrop(
  toPublicKey: web3.PublicKey,
): Promise<string> {
  const connection = getConnection(Networks.DEV_SOLANA);
  // send the transaction
  const result = await connection.requestAirdrop(
    toPublicKey,
    web3.LAMPORTS_PER_SOL,
  );
  console.log('Result: ', result);

  return result;
}

export async function confirmTransaction(
  connection: web3.Connection,
  signature: string,
) {
  return await connection.confirmTransaction(signature);
}

export async function getSolBalance(
  connection: web3.Connection,
  publicKey: web3.PublicKey,
) {
  return (await connection.getBalance(publicKey)) / web3.LAMPORTS_PER_SOL;
}
