# Rhythm — Habit & Schedule Tracker

A sleek, mobile-first habit tracking app with Firebase authentication, cloud sync, calendar integration, and smart reminders.

![Rhythm](https://img.shields.io/badge/Rhythm-Habit%20Tracker-34D399?style=for-the-badge)

## Features

- **Email/Password Authentication** — Secure login with Firebase Auth
- **Cloud Sync** — Habits and data sync across all devices via Firestore
- **Habit Tracking** — Weekly grid with streaks, completion percentages, and color-coded habits
- **Calendar Integration** — Sync your Teams/Outlook or Apple Calendar via ICS feed
- **Smart Reminders** — Browser notifications at habit time, 1hr follow-up, and end-of-day summary
- **Reports** — Weekly bar charts, 30-day heatmap, per-habit breakdowns, and CSV export
- **PWA Support** — Add to home screen for native app experience
- **Multi-user** — Anyone can create an account and track independently

## Quick Start

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add Project** → name it (e.g., `rhythm-tracker`)
3. Disable Google Analytics (optional) → **Create Project**

### 2. Enable Authentication

1. In Firebase Console → **Authentication** → **Get Started**
2. Click **Email/Password** → **Enable** → **Save**

### 3. Create Firestore Database

1. Go to **Firestore Database** → **Create Database**
2. Select **Start in production mode**
3. Choose a region close to you → **Enable**
4. Go to **Rules** tab and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Click **Publish**

### 4. Get Firebase Config

1. Go to **Project Settings** (gear icon) → **General**
2. Under "Your apps", click the **Web** icon (`</>`)
3. Register app name (e.g., `rhythm-web`) → **Register app**
4. Copy the `firebaseConfig` object

### 5. Update the Code

Open `index.html` and replace the placeholder config (around line 20):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 6. Deploy

#### Option A: GitHub Pages
1. Push to GitHub
2. Go to **Settings** → **Pages** → Deploy from **main** branch
3. Your app is live at `https://yourusername.github.io/rhythm-tracker/`

#### Option B: Custom Domain
1. In GitHub Pages settings, add your custom domain
2. Update DNS records as instructed
3. Add your domain to Firebase Auth → **Authorized domains**

#### Option C: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Calendar Setup

### Microsoft Teams / Outlook
1. Go to **Outlook** (web) → **Settings** → **Calendar**
2. **Shared calendars** → **Publish a calendar**
3. Select calendar → **Publish** → Copy the **ICS** link

### Apple Calendar
1. Go to [iCloud.com](https://www.icloud.com) → **Calendar**
2. Click the share icon next to your calendar
3. Check **Public Calendar** → Copy the link

Paste the ICS URL in the app's **Schedule** tab and click **Sync**.

## Project Structure

```
rhythm-tracker/
├── index.html      # Complete single-file app
└── README.md       # This file
```

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS (single file, no build step)
- **Auth**: Firebase Authentication (Email/Password)
- **Database**: Cloud Firestore (real-time sync)
- **Calendar**: ICS feed parser (RFC 5545)
- **Notifications**: Web Notifications API
- **Fonts**: Outfit + JetBrains Mono

## Security

- Firestore rules ensure users can only read/write their own data
- Passwords are handled entirely by Firebase (never stored in app)
- All data is scoped per authenticated user

## License

MIT
