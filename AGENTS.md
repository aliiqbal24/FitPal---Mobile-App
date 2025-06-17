# AGENTS

## Project: Gym Buddy App (React Native Expo)

This repository contains the Gym Buddy mobile application. The app is a social platform for weightlifters built with React Native and Expo. Users can track workouts, plan sessions, and level up a character as they exercise.

## Getting Started
- Install dependencies with `npm install`.
- Start the development server with `npm start` (runs `expo`).
- The entry point is `App.js`; source files live under `src/`.

## Code Guidelines
- Use functional components and React hooks.
- Keep components small and reusable inside `src/components`.
- Place navigation logic in `src/navigation` and screens in `src/screens`.
- Ensure cross-platform compatibility by avoiding platform-specific APIs unless necessary.
- Use `SafeAreaView` for safe layout across devices.
- Aim for performance by memoizing components with `React.memo` and using `useCallback`/`useMemo` when helpful.

## Testing
- There are currently no automated tests. Add tests using Jest and React Native Testing Library for new features.
- Run `npm test` once tests are added.

## Pull Requests
- Keep PRs focused and provide a summary of changes.
- Include test results in the PR description if applicable.
- Ensure the app builds via `npm start` before requesting review.
