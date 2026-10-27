import { useContext } from "react";
import { UnitContext } from "../context/UnitContext.js";
import { describeWeather, formatTemp } from "../utils/weather.js";

export default function ForecastDay({ day, isToday }) {
  const { unit } = useContext(UnitContext);
  const { icon, text } = describeWeather(day.code);
  const dayName = new Date(`${day.date}T00:00`).toLocaleDateString("en-US", { weekday: "short" });

  return (
    // ? : · this or that
    <div className={isToday ? "forecast-card today" : "forecast-card"}>
      <p><strong>{isToday ? "Today" : dayName}</strong></p>
      <p className="forecast-icon" title={text}>{icon}</p>
      <p>{formatTemp(day.max, unit)} / {formatTemp(day.min, unit)}</p>
    </div>
  );
}
