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
  Modal,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as web3 from '@solana/web3.js';
import bs58 from 'bs58';
import {
  confirmTransaction,
  getConnection,
  getSolBalance,
  Networks,
  requestAirdrop,
  sendSol,
} from './src/solanaUtils';

type DataStored = {
  data: string;
};

type SecretKeyEncryptedStorage = {
  secretKey: string;
};

type MenuModalProps = {
  isVisible: boolean;
  setIsVisible: Function;
  setKeypair: Function;
};

type ModalVisibilityProps = {
  isVisible: boolean;
  setIsVisible: Function;
};

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function itSleeps() {
  console.log('itSleeps');
  await sleep(5_000);
  console.log('Done');
}

async function save(data: string) {
  try {
    await EncryptedStorage.setItem(
      'data',
      JSON.stringify({
        data: data,
      }),
    );

    // Congrats! You've just stored your first value!
  } catch (error) {
    // There was an error on the native side
    console.log('Error~:', error);
  }
}

async function load(): Promise<string> {
  try {
    const value = await EncryptedStorage.getItem('data');
    console.log('Value: ', value);

    if (value) {
      const result: DataStored = JSON.parse(value as string);
      console.log('Result: ', result);
      if (result.data) {
        return result.data;
      }
    }

    return '';
  } catch (error) {
    // There was an error on the native side
    console.log('Error~:', error);
    return '';
  }
}

async function saveSecretKey(secretKey: string) {
  try {
    await EncryptedStorage.setItem(
      'secretKey',
      JSON.stringify({
        secretKey: secretKey,
      }),
    );

    // Congrats! You've just stored your first value!
  } catch (error) {
    // There was an error on the native side
    console.log('Error~:', error);
  }
}

async function loadSecretKey(): Promise<string> {
  try {
    const keyValueString = await EncryptedStorage.getItem('secretKey');
    console.log('Key : Value: ', keyValueString);

    if (keyValueString) {
      const parsedKeyValue: SecretKeyEncryptedStorage =
        JSON.parse(keyValueString);
      console.log('Result: ', parsedKeyValue);
      if (parsedKeyValue.secretKey) {
        return parsedKeyValue.secretKey;
      }
    }

    return '';
  } catch (error) {
    // There was an error on the native side
    console.log('Error~:', error);
    return '';
  }
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

const Separator = () => {
  return <View style={styles.separator} />;
};

const SaveKeyModal = (props: ModalVisibilityProps) => {
  const [storageValueText, setStorageValueText] = useState('');
  return (
    <SafeAreaView>
      {props.isVisible ? (
        <View>
          <Modal
            animationType="none"
            transparent={true}
            visible={props.isVisible}>
            <View style={styles.centerModalView}>
              <TextInput
                style={styles.centerModalViewTextInput}
                onChangeText={text => setStorageValueText(text)}
                value={storageValueText}
              />
              <Separator />
              <Button
                onPress={async () => {
                  await saveSecretKey(storageValueText);
                  props.setIsVisible(false);
                }}
                title="Save"
              />
            </View>
          </Modal>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const MenuModal = (props: MenuModalProps) => {
  const [saveKeyModalIsVisible, setSaveKeyModalIsVisible] = useState(false);
  return (
    <SafeAreaView>
      {props.isVisible ? (
        <View>
          <Modal
            animationType="none"
            transparent={true}
            visible={props.isVisible}>
            <View style={styles.menuModalView}>
              <SaveKeyModal
                isVisible={saveKeyModalIsVisible}
                setIsVisible={setSaveKeyModalIsVisible}
              />
              <Button onPress={() => props.setIsVisible(false)} title="Menu" />
              <Separator />
              <Button
                onPress={async () => {
                  const loadedSecretKey = await loadSecretKey();
                  const keypair = web3.Keypair.fromSecretKey(
                    bs58.decode(loadedSecretKey),
                  );
                  props.setKeypair(keypair);
                }}
                title="Load Key"
              />
              <Separator />
              <Button
                onPress={() => setSaveKeyModalIsVisible(true)}
                title="Save Key"
              />
              <View style={styles.modalView}>
                <Text style={styles.walletBalanceText}>About Us</Text>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

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
        <View style={styles.separator} />
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
          onPress={async () => await save(storageValueText)}
          title="Save"
        />
        <Separator />
        <Text>{cachedStorageValue}</Text>
        <Button
          onPress={async () => setCachedStorageValue(await load())}
          title="Load"
        />
      </View>
      <Separator />
      <View style={styles.walletBalanceContainer}>
        <Button onPress={async () => await itSleeps()} title="Sleep" />
      </View>
    </SafeAreaView>
  );
};

// React Native Styles
const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
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
  centerModalViewTextInput: {
    borderColor: 'gray',
    borderWidth: 1,
    alignSelf: 'flex-start',
    width: 100,
  },
  menuModalView: {
    width: '60%',
  },
  modalView: {
    height: '80%',
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});

export default App;
