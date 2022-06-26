import React, {useState} from 'react';
import {
  Button,
  Modal,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
} from 'react-native';
import {loadSecretKey} from '../../utils/encryptedStorage';
import {getKeypairFromSecretKeyString} from '../../utils/solanaUtils';
import {SaveKeyModal} from '../SaveKeyModal';
import {Separator} from '../Separator';

export type MenuModalProps = {
  isVisible: boolean;
  setIsVisible: Function;
  setKeypair: Function;
};

export const MenuModal = (props: MenuModalProps) => {
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
                  props.setKeypair(
                    getKeypairFromSecretKeyString(await loadSecretKey()),
                  );
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

const styles = StyleSheet.create({
  walletBalanceText: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  menuModalView: {
    width: '60%',
  },
  centerModalViewTextInput: {
    borderColor: 'gray',
    borderWidth: 1,
    alignSelf: 'flex-start',
    width: 100,
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
