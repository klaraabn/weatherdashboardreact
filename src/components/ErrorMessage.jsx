export default function ErrorMessage({ message }) {
  return (
    <p className="error-msg" role="alert">
      {message}
    </p>
  );
}
