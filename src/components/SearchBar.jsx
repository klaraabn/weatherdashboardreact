import { useState } from "react";

function validate(form) {
  const errors = {};
  if (!form.city.trim()) errors.city = "Type a city name";
  else if (form.city.length > 50) errors.city = "Keep it under 50 characters";
  return errors;
}

export default function SearchBar({ onSearch }) {
  const [form, setForm] = useState({ city: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" }); // clear once fixed
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    onSearch(form.city.trim()); // event goes up to App
    setForm({ city: "" });
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} noValidate>
      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="Enter city name..."
        aria-label="City name"
        aria-invalid={!!errors.city}
      />
      <button type="submit">Search</button>
      <button type="button" className="secondary" onClick={() => onSearch("Mansourieh")}>
        Mansourieh
      </button>
      {errors.city && <p className="input-error">{errors.city}</p>}
    </form>
  );
}
