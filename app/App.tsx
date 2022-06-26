// React Native Counter Example using Hooks!

import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import * as web3 from '@solana/web3.js';
import {
  confirmTransaction,
  getConnection,
  getSolBalance,
  Networks,
  requestAirdrop,
  sendSol,
} from './src/utils/solanaUtils';
import {loadString, saveString} from './src/utils/encryptedStorage';
import {Separator} from './src/components/Separator';
import {MenuModal} from './src/components/MenuModal';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleGetSolBalance(
  connection: web3.Connection,
  publicKey: web3.PublicKey,
  setBalance: Function,
) {
  setBalance(await getSolBalance(connection, publicKey));
}

async function handleSendSol(
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

async function handleRequestAirdrop(
  connection: web3.Connection,
  toPublicKey: web3.PublicKey,
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

const App = () => {
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [sendAmountText, onChangeSendAmountText] = useState('Amount');
  const [sendSolIndicator, setSendSolIndicator] = useState(false);
  const [requestAirdropIndicator, setRequestAirdropIndicator] = useState(false);
  const [airdropButtonDisabled, setAirdropButtonDisabled] = useState(false);
  const [cachedStorageValue, setCachedStorageValue] = useState('');
  const [storageValueText, setStorageValueText] = useState('');
  const [menuModalIsVisible, setMenuModalIsVisible] = useState(false);

  const [keypair, setKeypair] = useState<web3.Keypair>(web3.Keypair.generate());

  const publicKeyString = keypair.publicKey.toString();
  const publicKey = keypair.publicKey;

  const connection = getConnection(Networks.DEV_SOLANA);

  return (
    <SafeAreaView>
      <View style={styles.menuButton}>
        <Button
          onPress={() => setMenuModalIsVisible(!menuModalIsVisible)}
          title="Menu"
        />
      </View>
      <MenuModal
        isVisible={menuModalIsVisible}
        setIsVisible={setMenuModalIsVisible}
        setKeypair={setKeypair}
      />
      <View style={styles.walletPublicKeyContainer}>
        <View style={styles.walletPublicKeyText}>
          <Text>
            {publicKeyString.slice(0, 5)}...
            {publicKeyString.slice(
              publicKeyString.length - 6,
              publicKeyString.length - 1,
            )}
          </Text>
        </View>
      </View>
      <View style={styles.walletBalanceContainer}>
        <Text style={styles.walletBalanceText}>{walletBalance} SOL</Text>
        <Button
          onPress={async () =>
            await handleGetSolBalance(connection, publicKey, setWalletBalance)
          }
          title="Refresh Balance"
        />
      </View>
      <Separator />
      <View style={styles.sendButtonContainer}>
        <TextInput
          style={styles.sendAmountTextInput}
          onChangeText={text => onChangeSendAmountText(text)}
          value={sendAmountText}
        />
        <Separator />
        <Button
          onPress={async () =>
            await handleSendSol(
              connection,
              keypair,
              new web3.PublicKey(
                'ALYRTCp2ZTczgUnaWm7zYN4XFgM5cKLMJrUm7E8WH9SN',
              ),
              Number(sendAmountText),
              setSendSolIndicator,
            )
          }
          title="Send"
        />
        <ActivityIndicator animating={sendSolIndicator} />
      </View>
      <View style={styles.sendButtonContainer}>
        <Button
          onPress={async () =>
            await handleRequestAirdrop(
              connection,
              publicKey,
              setRequestAirdropIndicator,
              setAirdropButtonDisabled,
            )
          }
          title="Request Airdrop"
          disabled={airdropButtonDisabled}
        />
        <ActivityIndicator animating={requestAirdropIndicator} />
      </View>
      <View style={styles.walletBalanceContainer}>
        <TextInput
          style={styles.sendAmountTextInput}
          onChangeText={text => setStorageValueText(text)}
          value={storageValueText}
        />
        <Separator />
        <Button
          onPress={async () => await saveString(storageValueText)}
          title="Save"
        />
        <Separator />
        <Text>{cachedStorageValue}</Text>
        <Button
          onPress={async () => setCachedStorageValue(await loadString())}
          title="Load"
        />
      </View>
      <Separator />
    </SafeAreaView>
  );
};

// React Native Styles
const styles = StyleSheet.create({
  menuButton: {
    alignSelf: 'flex-start',
  },
  sendButton: {
    alignSelf: 'center',
    width: 100,
  },
  sendButtonContainer: {
    alignSelf: 'center',
  },
  sendAmountTextInput: {
    borderColor: 'gray',
    borderWidth: 1,
    alignSelf: 'center',
    width: 100,
  },
  walletPublicKeyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  walletPublicKeyText: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletBalanceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletBalanceText: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  menuView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 22,
  },
  centerModalView: {
    flex: 1,
    paddingLeft: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default App;
