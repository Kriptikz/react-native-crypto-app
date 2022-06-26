import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

import Modal from './src/MyModal';

class SomeScreen extends React.Component {
  state = {
    isModalVisible: false,
  };

  showModal = () => this.setState({isModalVisible: true});
  hideModal = () => this.setState({isModalVisible: false});
  render() {
    return (
      <View>
        <Button onPress={this.showModal} title="title" />
        <Modal visible={this.state.isModalVisible} dismiss={this.hideModal}>
          <Text>Hello, I am modal</Text>
        </Modal>
      </View>
    );
  }
}
const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return <SomeScreen />;
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;
