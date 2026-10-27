import { useEffect, useState } from "react";
import { UnitContext } from "./context/UnitContext.js";
import SearchBar from "./components/SearchBar.jsx";
import UnitToggle from "./components/UnitToggle.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import Card from "./components/Card.jsx";
import WeatherCard from "./components/WeatherCard.jsx";
import Forecast from "./components/Forecast.jsx";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const MANSOURIEH = { name: "Mansourieh", country: "Lebanon", latitude: 33.866, longitude: 35.583 };

export default function App() {
  const [city, setCity] = useState("Mansourieh"); // which city to show
  const [weather, setWeather] = useState(null);   // the fetched data
  const [status, setStatus] = useState("loading"); // 'loading' | 'error' | 'ready'
  const [errorMessage, setErrorMessage] = useState("");
  const [unit, setUnit] = useState("C");          // shared through Context

  // Runs after the first render, then again whenever `city` changes
  useEffect(() => {
    let ignore = false; // set to true by the cleanup

    async function load() {
      setStatus("loading");
      try {
        // 1) city name -> coordinates
        let place = MANSOURIEH;
        if (city.toLowerCase() !== "mansourieh") {
          const geoRes = await fetch(`${GEO_URL}?name=${encodeURIComponent(city)}&count=1`);
          if (!geoRes.ok) throw new Error(geoRes.status);
          const geoData = await geoRes.json();
          if (!geoData.results) {
            throw new Error(`Could not find "${city}". Check the spelling.`);
          }
          place = geoData.results[0];
        }

        // 2) coordinates -> weather
        const res = await fetch(
          `${WEATHER_URL}?latitude=${place.latitude}&longitude=${place.longitude}` +
            "&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code" +
            "&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto"
        );
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();

        // 3) API shape -> our shape
        const result = {
          place: `${place.name}, ${place.country}`,
          current: {
            temp: data.current.temperature_2m,
            feelsLike: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            wind: Math.round(data.current.wind_speed_10m),
            code: data.current.weather_code,
          },
          forecast: data.daily.time.slice(0, 3).map((date, i) => ({
            date,
            code: data.daily.weather_code[i],
            max: data.daily.temperature_2m_max[i],
            min: data.daily.temperature_2m_min[i],
          })),
        };

        if (ignore) return; // a newer search started, drop this old answer
        setWeather(result);
        setStatus("ready");
      } catch (err) {
        if (ignore) return;
        setErrorMessage(
          err.message.startsWith("Could not find")
            ? err.message
            : "Couldn't load the weather. Check your internet connection."
        );
        setStatus("error");
      }
    }

    load();

    // Cleanup: runs before the effect runs again (new city)
    return () => {
      ignore = true;
    };
  }, [city]);

  return (
    // 02 · provide — any component inside can read or change the unit
    <UnitContext.Provider value={{ unit, setUnit }}>
      <main className="container">
        <header className="header">
          <h1>Weather Dashboard</h1>
          <UnitToggle />
        </header>

        <SearchBar onSearch={setCity} />

        {status === "loading" && <LoadingSpinner />}
        {status === "error" && <ErrorMessage message={errorMessage} />}
        {status === "ready" && (
          <>
            <Card title={weather.place}>
              <WeatherCard current={weather.current} />
            </Card>
            <Card title="3-Day Forecast">
              <Forecast days={weather.forecast} />
            </Card>
          </>
        )}
      </main>
    </UnitContext.Provider>
  );
}
