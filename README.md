# Vercel Dashboard Mobile App

A functional, offline-capable mobile application built from static "Architectural Studio" UI prototypes. This app allows developers to track their web projects, manage local URLs, and securely store metadata offline right on their mobile device.

## Features

- **Local Storage Architecture**: All project data (including text metadata, settings, and base64 encoded thumbnail images) is seamlessly persisted locally to your device storage using `localStorage`, requiring zero internet dependencies for data management.
- **Project Workspaces**: Build and monitor the active status of deployed architectures, GitHub references, and local development endpoints.
- **Dynamic Routing**: Bottom Navigation handles view states between the Projects Timeline, Add Project Form, and local App Settings.
- **Native Android Capable**: Bundled into a native APK leveraging Capacitor v6.

## Technology Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3 (Custom color utility design system)
- **Routing**: React Router DOM
- **Mobile Packaging**: CapacitorJS 

## Getting Started

### Prerequisites

- Node.js (v18 and above recommended)
- Java SDK 17 (Required for Android Gradle Builds)
- Android Studio / Android SDK tools (Required to compile the APK)

### Local Development (Web View)

1. Clone or download the repository, then navigate to the app root:
   ```bash
   cd mobile-app
   ```
2. Install standard Node dependencies:
   ```bash
   npm install
   ```
3. Boot up the Vite dev server to view the app in a local browser:
   ```bash
   npm run dev
   ```

### Building the Android APK

1. Create an optimized production build of the Vite React framework:
   ```bash
   npm run build
   ```
2. Sync the built CSS, JS, and HTML assets into the Capacitor Android container:
   ```bash
   npx cap sync android
   ```
3. Execute the Gradle wrapper inside the Android folder to compile the APK:
   ```bash
   cd android
   gradlew.bat assembleDebug
   ```
4. The compiled application package will be available in:
   `android/app/build/outputs/apk/debug/app-debug.apk`

---
*Built via Antigravity AI*
