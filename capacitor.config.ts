import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.supple.mobility',
  appName: 'Supple',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
    backgroundColor: '#F7F9FA',
  },
};

export default config;
