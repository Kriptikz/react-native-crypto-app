import React, {useState} from 'react';
import {
  Button,
  StyleSheet,
  Modal,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';
import {saveSecretKey} from '../../utils/encryptedStorage';
import {Separator} from '../Separator';

type ModalVisibilityProps = {
  isVisible: boolean;
  setIsVisible: Function;
};

export const SaveKeyModal = (props: ModalVisibilityProps) => {
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

const styles = StyleSheet.create({
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
});
