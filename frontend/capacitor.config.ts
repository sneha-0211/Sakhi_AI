import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.sakhiai.app',
  appName: 'SAKHI AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#FAF8F5",
      showSpinner: false,
      androidSplashResourceName: "splash"
    }
  }
};

export default config;
