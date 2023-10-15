import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'brcar.com',
  appName: 'brcar',
  webDir: 'www',
  loggingBehavior: 'debug',
  server: {
    androidScheme: 'http',
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      iosKeychainPrefix: 'bcar',
      iosBiometric: {
        biometricAuth: false,
        biometricTitle: 'Biometric login for capacitor sqlite',
      },
      androidIsEncryption: false,
      androidBiometric: {
        biometricAuth: false,
        biometricTitle: 'Biometric login for capacitor sqlite',
        biometricSubTitle: 'Log in using your biometric',
      },
      electronIsEncryption: false,
      electronWindowsLocation: 'C:\\ProgramData\\CapacitorDatabases',
      electronMacLocation: '/Users/Hugo/CapacitorDatabases',
      electronLinuxLocation: 'Databases',
    },
  },
};
export default config;
