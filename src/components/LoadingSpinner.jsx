export default function LoadingSpinner() {
  return (
    <div className="loading" role="status">
      <div className="spinner" />
      <p>Loading weather data...</p>
    </div>
  );
}
