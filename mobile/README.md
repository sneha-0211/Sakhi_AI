# SAKHI AI — Mobile Delivery & Android Packaging Guide

SAKHI AI is engineered as a mobile-first Progressive Web App (PWA) with **Capacitor 6** integration, enabling compilation to a native Android APK or Google Play App Bundle (AAB).

---

## 1. Prerequisites

To build and package the native Android APK:

1. **Node.js**: v18.0.0 or later (v22+ verified).
2. **Android Studio**: Android Studio (Ladybug, Hedgehog, or Flamingo+).
3. **Android SDK**: Android API level 33 or 34 (Android 13/14).
4. **Java Development Kit (JDK)**: OpenJDK 17 or 21 (bundled with Android Studio).
5. **Gradle**: Managed automatically via the Gradle wrapper (`gradlew`).

---

## 2. Quick Build Workflow

From the `frontend/` directory:

### Step 1: Build the Optimized Production Web Assets
```bash
npm run build
```
This compiles the TypeScript code and Tailwind design system into `frontend/dist/`.

### Step 2: Initialize or Sync Capacitor Android Platform
If the Android native directory has not yet been initialized:
```bash
npx cap add android
```
To sync the latest web assets, plugins, and configurations:
```bash
npx cap sync android
```

### Step 3: Open in Android Studio
```bash
npx cap open android
```
Alternatively, open Android Studio manually, choose **Open**, and navigate to `c:\Users\shris\Desktop\Code2App\frontend\android`.

---

## 3. Building the Debug APK

### Option A: Via Command Line (Gradle Wrapper)
Navigate to the `frontend/android` folder:
```bash
cd android
./gradlew assembleDebug
```
*(On Windows PowerShell, run: `.\gradlew.bat assembleDebug`)*

### Option B: Via Android Studio GUI
1. Wait for Android Studio to finish Gradle sync and index files.
2. In the top menu, select:
   **Build** ➔ **Build Bundle(s) / APK(s)** ➔ **Build APK(s)**.
3. When the build finishes, a notification will appear at the bottom right. Click **locate**.

---

## 4. APK Output Artifact Location

The generated debug APK will be located at:
```
frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 5. Installing the APK on a Device or Emulator

### Via ADB:
Connect your Android phone with **USB Debugging** enabled, or start an Android Virtual Device (AVD), then run:
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Via Direct Transfer:
Copy `app-debug.apk` to your phone's Downloads folder, tap the APK in your file manager, and allow **Install Unknown Apps** for your file manager.

---

## 6. Mobile Application Features in SAKHI AI

- **Touch & Gesture Responsive**: Designed with 48px touch targets, mobile bottom bar, and thumb-friendly navigation.
- **Privacy Protections**: No native telemetry, zero contacts/camera permissions requested, and session-only RAM caching.
- **Offline Safeguard Mode**: Works gracefully when airplane mode is on or network connection drops, serving verified emergency guidance from cached assets.
