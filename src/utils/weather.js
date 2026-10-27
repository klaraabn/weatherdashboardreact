// Weather code -> icon + text (Open-Meteo WMO codes)
const WEATHER_CODES = {
  0: { icon: "☀️", text: "Clear sky" },
  1: { icon: "🌤️", text: "Mainly clear" },
  2: { icon: "⛅", text: "Partly cloudy" },
  3: { icon: "☁️", text: "Overcast" },
  45: { icon: "🌫️", text: "Foggy" },
  48: { icon: "🌫️", text: "Foggy" },
  51: { icon: "🌦️", text: "Drizzle" },
  53: { icon: "🌦️", text: "Drizzle" },
  55: { icon: "🌦️", text: "Drizzle" },
  61: { icon: "🌧️", text: "Light rain" },
  63: { icon: "🌧️", text: "Rain" },
  65: { icon: "🌧️", text: "Heavy rain" },
  71: { icon: "❄️", text: "Snow" },
  80: { icon: "🌦️", text: "Rain showers" },
  95: { icon: "⛈️", text: "Thunderstorm" },
};

export function describeWeather(code) {
  return WEATHER_CODES[code] || { icon: "🌡️", text: "Unknown" };
}

// The API always gives °C. We convert only when displaying.
export function formatTemp(celsius, unit) {
  const value = unit === "F" ? celsius * 9 / 5 + 32 : celsius;
  return `${Math.round(value)}°${unit}`;
}
