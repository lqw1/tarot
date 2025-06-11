import CryptoJS from 'crypto-js';

// Supply encrypt service for local storage
export default class LocalStorageService {
  //ZeissZui
  private static SECRET_KEY = CryptoJS.enc.Utf8.parse('5a656973735a7569');
  //DigitalS
  private static SECRET_IV = CryptoJS.enc.Utf8.parse('4469676974616c53');

  static USER_INFO = 'userInfo';
  static ACC_TOKEN = 'accToken';

  private static storageConfig: Record<string, any> = {
    type: 'localStorage',
    prefix: 'Zeiss',
    isEncrypt: true,
  };

  static setStorage = (key: string | number, value: any): void => {
    const formatKey = `${key}`;
    const formatValue = JSON.stringify(value);
    const invalidKey = ['null', 'undefined'];
    if (invalidKey.includes(formatKey)) return;

    const encryptValue = LocalStorageService.storageConfig.isEncrypt
      ? LocalStorageService.encrypt(formatValue)
      : formatValue;
    const addedPrefix = LocalStorageService.addPrefix(formatKey);

    window[LocalStorageService.storageConfig.type].setItem(
      addedPrefix,
      encryptValue
    );
  };

  static getStorage = (key: string | number): any => {
    const addedPrefix = LocalStorageService.addPrefix(`${key}`);
    const storageValue =
      window[LocalStorageService.storageConfig.type].getItem(addedPrefix);
    if (!storageValue) return null;

    return LocalStorageService.storageConfig.isEncrypt
      ? JSON.parse(LocalStorageService.decrypt(storageValue))
      : JSON.parse(storageValue);
  };

  static removeStorage = (key: string | number): void => {
    const addedPrefix = LocalStorageService.addPrefix(`${key}`);
    window[LocalStorageService.storageConfig.type].removeItem(addedPrefix);
  };

  static clearStorage = () => {
    window[LocalStorageService.storageConfig.type].clear();
  };

  static isSupportStorage = (): boolean => {
    return !!typeof Storage;
  };

  private static encrypt = (data: string): string => {
    const dataHex = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(
      dataHex,
      LocalStorageService.SECRET_KEY,
      {
        iv: LocalStorageService.SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return encrypted.ciphertext.toString();
  };

  private static decrypt = (data: string): string => {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
    const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(str, LocalStorageService.SECRET_KEY, {
      iv: LocalStorageService.SECRET_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  };

  private static addPrefix = (key: string): string => {
    return LocalStorageService.storageConfig.prefix
      ? `${LocalStorageService.storageConfig.prefix}_${key}`
      : key;
  };

  private static removePrefix = (key: string): string => {
    const prefix = LocalStorageService.storageConfig.prefix;
    return prefix ? key.substring(prefix.length + 2) : key;
  };
}
