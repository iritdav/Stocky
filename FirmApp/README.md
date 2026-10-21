# FirmApp

A mobile-first calorie tracking web app. See [`spec.md`](../spec.md) at the repo root for the full product spec and [`CLAUDE.md`](../CLAUDE.md) for coding standards.

## Firebase setup

This app needs a Firebase project with **Authentication** (email/password provider enabled) and **Firestore** turned on.

1. Create a project at [Firebase console](https://console.firebase.google.com/).
2. Enable the Email/Password sign-in provider under Authentication.
3. Create a Firestore database (production mode).
4. In Project Settings, add a Web app and copy its config values.
5. Copy `.env.example` to `.env` and fill in the `VITE_FIREBASE_*` values from step 4.
6. Set the project id in `.firebaserc` (repo root) if you plan to deploy.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Deploy to Firebase Hosting

From the repo root, after `npm run build`:

```sh
firebase deploy
```

(Requires the [Firebase CLI](https://firebase.google.com/docs/cli) and a project id set in `.firebaserc`.)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).
