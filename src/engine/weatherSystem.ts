export interface EnvironmentWeather {
  theme: 'morning_park' | 'sunny_street' | 'sunset_city' | 'valley_mist' | 'neon_night';
  skyGradientTop: string;
  skyGradientBottom: string;
  ambientLightColor: string;
  fogDensity: number;
}

export const WEATHER_THEMES: Record<string, EnvironmentWeather> = {
  park: {
    theme: 'morning_park',
    skyGradientTop: '#061a12',
    skyGradientBottom: '#113324',
    ambientLightColor: 'rgba(132, 204, 22, 0.2)',
    fogDensity: 0.15,
  },
  street: {
    theme: 'sunny_street',
    skyGradientTop: '#0a1d15',
    skyGradientBottom: '#1b3d2c',
    ambientLightColor: 'rgba(163, 230, 53, 0.25)',
    fogDensity: 0.1,
  },
  city: {
    theme: 'sunset_city',
    skyGradientTop: '#1a180e',
    skyGradientBottom: '#332911',
    ambientLightColor: 'rgba(245, 158, 11, 0.2)',
    fogDensity: 0.2,
  },
  valley: {
    theme: 'valley_mist',
    skyGradientTop: '#0d1f19',
    skyGradientBottom: '#18382c',
    ambientLightColor: 'rgba(16, 185, 129, 0.2)',
    fogDensity: 0.35,
  },
  marathon: {
    theme: 'neon_night',
    skyGradientTop: '#070f0c',
    skyGradientBottom: '#0e1f18',
    ambientLightColor: 'rgba(132, 204, 22, 0.35)',
    fogDensity: 0.08,
  },
};

export function getWeatherForLevel(env: string): EnvironmentWeather {
  return WEATHER_THEMES[env] || WEATHER_THEMES.park;
}
