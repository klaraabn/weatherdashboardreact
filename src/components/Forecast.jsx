import ForecastDay from "./ForecastDay.jsx";

export default function Forecast({ days }) {
  // if · whole component
  if (days.length === 0) {
    return <p>No forecast available.</p>;
  }

  return (
    <div className="forecast">
      {days.map((day, i) => (
        <ForecastDay key={day.date} day={day} isToday={i === 0} />
      ))}
    </div>
  );
}
