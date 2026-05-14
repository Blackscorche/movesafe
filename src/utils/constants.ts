export const STEPS_DAILY_GOAL = 10000;
export const GC_PER_STEP_GOAL = 10;
export const STREAK_BONUS_GC = 2;
export const STREAK_BONUS_THRESHOLD = 10000;
export const STREAK_MILESTONES = [
  { days: 7, reward: 20 },
  { days: 15, reward: 50 },
  { days: 30, reward: 100 },
];
export const QR_REFRESH_INTERVAL_SECONDS = 30;
export const APP_VERSION = '1.0.0';
export const BUILD_NUMBER = '100';

export const STORE_CATEGORIES = [
  'Todos', 'Servicios', 'Salud', 'Fitness', 'Gastronomía',
  'Cuidado', 'Movilidad', 'Entretenimiento', 'Viajes',
];

// ONBOARDING SLIDES
export const ONBOARDING_SLIDES = [
  {
    key: 'walk',
    title: "Camina",
    subtitle: "Cada paso cuenta",
    body: "Conecta tu app de salud y gana GuaCoins por alcanzar tus metas diarias de pasos.",
    image: require('../assets/images/onboarding-walk.png'),
    accent: "#E45B25",
  },
  {
    key: 'earn',
    title: "Gana",
    subtitle: "Bienestar y recompensas reales",
    body: "Acumula GuaCoins todos los días. Mantén rachas para ganar bonificaciones especiales.",
    image: require('../assets/images/onboarding-run.png'),
    accent: "#FF4D8F",
  },
  {
    key: 'redeem',
    title: "Canjea",
    subtitle: "Ahorra en tus comercios",
    body: "Usa tus GuaCoins para obtener descuentos en farmacias, supermercados y más.",
    image: require('../assets/images/onboarding-redeem.png'),
    accent: "#00D4AA",
  },
];
