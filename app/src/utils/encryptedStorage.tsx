import EncryptedStorage from 'react-native-encrypted-storage';

export async function saveSecretKey(secretKey: string) {
  try {
    await EncryptedStorage.setItem('secretKey', secretKey);

    // Congrats! You've just stored your first value!
  } catch (error) {
    // There was an error on the native side
    console.log('Error~:', error);
  }
}

export async function loadSecretKey(): Promise<string> {
  try {
    const secretKey = await EncryptedStorage.getItem('secretKey');
    console.log('secretKey: ', secretKey);

    if (secretKey) {
      return secretKey;
    }
    return '';
  } catch (error) {
    // There was an error on the native side
    console.log('Error~:', error);
    return '';
  }
}

export async function saveString(data: string) {
  try {
    await EncryptedStorage.setItem('data', data);

    // Congrats! You've just stored your first value!
  } catch (error) {
    // There was an error on the native side
    console.log('Error~:', error);
  }
}

export async function loadString(): Promise<string> {
  try {
    const data = await EncryptedStorage.getItem('data');
    console.log('Data: ', data);

    if (data) {
      return data;
    }

    return '';
  } catch (error) {
    // There was an error on the native side
    console.log('Error~:', error);
    return '';
  }
}
