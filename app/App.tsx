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
import {getConnection, Networks} from './src/utils/solanaUtils';
import {loadString, saveString} from './src/utils/encryptedStorage';
import {Separator} from './src/components/Separator';
import {MenuModal} from './src/components/MenuModal';
import {RequestAirdropButton} from './src/components/RequestAirdropButton';
import {RefreshBalanceButton} from './src/components/RefreshBalanceButton';
import {SendSolButton} from './src/components/SendSolButton';

const App = () => {
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [sendAmountText, onChangeSendAmountText] = useState('Amount');
  const [sendSolIndicator, setSendSolIndicator] = useState(false);
  const [requestAirdropIndicator, setRequestAirdropIndicator] = useState(false);
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
        <RefreshBalanceButton
          connection={connection}
          publicKey={publicKey}
          setWalletBalance={setWalletBalance}
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
        <SendSolButton
          connection={connection}
          fromKeypair={keypair}
          toPublicKey={
            new web3.PublicKey('ALYRTCp2ZTczgUnaWm7zYN4XFgM5cKLMJrUm7E8WH9SN')
          }
          amount={Number(sendAmountText)}
          setSpinnerVisibility={setSendSolIndicator}
        />
        <ActivityIndicator animating={sendSolIndicator} />
      </View>
      <View style={styles.sendButtonContainer}>
        <RequestAirdropButton
          connection={connection}
          publicKey={publicKey}
          setVisibility={setRequestAirdropIndicator}
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
});

export default App;
