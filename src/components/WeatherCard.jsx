import { useContext } from "react";
import { UnitContext } from "../context/UnitContext.js";
import { describeWeather, formatTemp } from "../utils/weather.js";

export default function WeatherCard({ current }) {
  const { unit } = useContext(UnitContext);
  const { icon, text } = describeWeather(current.code);

  return (
    <>
      <p className="date">{new Date().toDateString()}</p>

      <div className="main-weather">
        <span className="icon">{icon}</span>
        <div>
          <h3>{formatTemp(current.temp, unit)}</h3>
          <p>{text}</p>
        </div>
      </div>

      <div className="extra-info">
        <p>Feels like: <strong>{formatTemp(current.feelsLike, unit)}</strong></p>
        <p>Humidity: <strong>{current.humidity}%</strong></p>
        <p>Wind: <strong>{current.wind} km/h</strong></p>
      </div>
    </>
  );
}
