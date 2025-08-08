# FitPal

FitPal is a mobile workout companion built with **React Native** and **Expo**. The app gamifies weightlifting by letting you train alongside a virtual gym buddy that levels up as you log workouts.


# I recomend checking out these images of the App and its UI to get a better feel for it

https://drive.google.com/drive/folders/1vsNmwWpDVS9z5safRQsNMvZAXI1bLIdV?usp=sharing


## Features

- **Character progression** – Earn experience from each set and watch your buddy evolve.
- **Workout tracking** – Create routines, record sets and reps, and review past sessions in a calendar view.
- **Stats dashboard** – See weekly and yearly totals of weight lifted and share your progress.
- **Customization** – Personalize your buddy with outfits and backgrounds.
- **Notifications** – Optional reminders encourage you to lift if you haven’t logged a workout in a while.
- **Sign in** – Supports email/password, Google and Apple sign‑in using Firebase.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (Expo):
   ```bash
   npm start
   ```
3. The app entry point is `App.js`. Source files live under `src/`.

## Project Structure

- `src/components` – Reusable UI components.
- `src/screens` – App screens (Gym, History, Character customization, etc.).
- `src/navigation` – Navigation configuration.
- `src/context` – React context providers for state such as authentication and stats.

## Contributing

This project currently has no automated tests. If you add features, consider writing tests with **Jest** and **React Native Testing Library** and running:

```bash
npm test
```

---
Built with cross‑platform compatibility in mind, FitPal aims to make tracking workouts fun and approachable without overwhelming users.
