# FitPal

A workout companion where your progress helps a virtual gym buddy grow. Built with React Native and Expo, FitPal combines workout logging, character progression, and a playful gym interface.

I built this around a personal question: could tracking workouts feel rewarding in the moment, instead of being another spreadsheet to maintain?

## A look inside

<p>
  <img src="docs/images/workout.png" alt="FitPal opening comic" width="240">
  <img src="docs/images/character.png" alt="FitPal character interface" width="240">
</p>

*Captured app screens, retained from my project portfolio. They illustrate the interface; they are not a claim of an App Store release.*

## What is here

- Workout and routine screens, set logging, and history views.
- A virtual character, experience progression, equipment, and backgrounds.
- Local state providers for workouts, history, and progression.
- Firebase authentication integration and optional notification flows.

The interesting product decision is tying progression to training: a practical logging tool and a playful companion share the same interaction.

## Run locally

Use Node.js and an Expo-compatible Android/iOS environment:

```bash
npm ci
npx expo start
```

Follow Expo's terminal instructions to open the app on a device or emulator. The app targets mobile; the presence of a web script does not establish web support. Firebase sign-in and provider-specific authentication require your own project configuration. Never use another person's account or production data for a demonstration.

To check the Android JavaScript bundle without publishing a native app:

```bash
npx expo export --platform android
```

## Code map

`App.js` composes the providers and navigation. `src/screens/` contains the product views; `src/components/` holds shared UI. `src/context/` owns local state and authentication, and `src/data/` contains character and equipment definitions.

## Project status

This is a portfolio project, not a supported production service. There is no automated test suite or verified store release. Authentication, notifications, and platform-specific behavior need device testing with a separately configured development backend. Source features and screenshots should not be read as evidence that every flow has been tested on both platforms.
