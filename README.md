# Weather Dashboard using REACT

My Assignment 4 Weather Dashboard rebuilt as a **React + Vite** app, using the methods from Session 14 (React State & Interactivity) and Session 15 (Effects, Forms & Component Architecture).

- Opens on **Mansourieh, Lebanon** by default
- Search any city by name (validated form)
- Current weather + 3-day forecast
- °C / °F toggle shared through Context
- Loading, error and success screens
- Data from [Open-Meteo](https://open-meteo.com/): free, **no API key needed**

## Install and run

Requires [Node.js](https://nodejs.org/) 18 or newer.

```bash
# 1. Go into the project folder
cd weather-dashboard-react

# 2. Install the dependencies (creates node_modules)
npm install

# 3. Start the dev server
npm run dev
```

Open the link printed in the terminal (usually http://localhost:5173).

## Project structure

```
weather-dashboard-react/
├── index.html                 # page with <div id="root">
├── package.json               # dependencies + "dev" script
├── vite.config.js             # Vite + React plugin
└── src/
    ├── main.jsx               # renders <App /> into #root
    ├── App.jsx                # owns the state, fetches with useEffect
    ├── index.css              # styles (responsive)
    ├── context/
    │   └── UnitContext.js     # createContext for °C / °F
    ├── utils/
    │   └── weather.js         # weather-code icons + temperature formatting
    └── components/
        ├── SearchBar.jsx      # controlled form + validation
        ├── UnitToggle.jsx     # °C / °F button (reads Context)
        ├── LoadingSpinner.jsx # loading screen
        ├── ErrorMessage.jsx   # error screen
        ├── Card.jsx           # layout component using children
        ├── WeatherCard.jsx    # current weather
        ├── Forecast.jsx       # list of days
        └── ForecastDay.jsx    # one day
```

## Component tree

```
App   [city, weather, status, errorMessage, unit]
└── UnitContext.Provider  value={{ unit, setUnit }}
    ├── UnitToggle                       reads + changes unit (Context)
    ├── SearchBar        ← onSearch      events up
    ├── LoadingSpinner                   status === "loading"
    ├── ErrorMessage     ← message       status === "error"
    ├── Card title=place                 status === "ready"
    │   └── WeatherCard  ← current       reads unit (Context)
    └── Card title="3-Day Forecast"
        └── Forecast     ← days
            └── ForecastDay ← day, isToday   reads unit (Context)
```

## Methods from the slides, step by step

### 1. `useState`: giving a component memory (Session 14)
`App` holds `city`, `weather`, `status`, `errorMessage` and `unit`. `SearchBar` holds its own `form` and `errors`. Every change goes through the setter, which tells React to render again.

### 2. Replace state, don't change it (Session 14)
Objects are never mutated. In `SearchBar` a new object is created each time: `setForm({ ...form, [name]: value })`.

### 3. Event handling: pass the function, don't call it (Session 14)
- `onSubmit={handleSubmit}` passes the function.
- The Mansourieh button is wrapped: `onClick={() => onSearch("Mansourieh")}`, so it doesn't run during render.

### 4. Controlled form + validation (Session 15)
- **One state object:** the input's `name="city"` matches the key in `form`, and `handleChange` updates whichever key changed.
- **`validate(form)`:** returns an `errors` object. The city is required and must be under 50 characters.
- **On submit:** `preventDefault()`, then `validate`, then `setErrors`. If there are errors, it stops. Otherwise it calls `onSearch` and clears the field.
- **Showing errors:** the error appears under the field with `aria-invalid`. It is cleared as soon as the user starts fixing it.

### 5. `useEffect`: fetching data the React way (Session 15)
- **Dependency array `[city]`:** the effect runs after the first render, then again whenever `city` changes.
- **No async effect:** an `async function load()` is defined inside the effect and then called.
- **Errors:** `try / catch` with an `if (!res.ok) throw` check, as in Session 11.
- **Status:** `status` (`'loading' | 'error' | 'ready'`) decides which screen shows.
- **Field mapping:** the API's fields are renamed into our own shape (`temp`, `feelsLike`, `forecast`…) before going into state.
- **Cleanup:** the effect returns a function that sets `ignore = true`. If the user searches a new city before the old request finishes, the old answer is ignored. This also handles StrictMode running effects twice in development.

### 6. Lifting state up: data down, events up (Sessions 14 & 15)
`SearchBar` changes the city and the weather cards read it, so `city` lives in their closest common parent, `App`. `SearchBar` sends the new city up with `onSearch` (which is `setCity`). The data then goes down as props.

### 7. Conditional rendering: all three ways (Session 14)
- **`&&` (this or nothing):** in `App`, used to show the loading, error or ready screen.
- **`if` (whole component):** in `Forecast`, which returns "No forecast available." when the list is empty.
- **`? :` (this or that):** in `ForecastDay`, for the "Today" label and the `today` highlight class.

### 8. Lists & keys (Session 14)
`Forecast` maps the days to `<ForecastDay key={day.date} … />`. The date is unique, so it is a stable key (not the index).

### 9. Composition with `children` (Session 15)
`Card` is a layout component: it draws the frame and title, and `App` decides what goes inside (`WeatherCard` or `Forecast`).

### 10. Context for app-wide data (Session 15)
The slides list "units, like °C or °F" as a good fit for Context:
1. **Create:** `UnitContext.js` calls `createContext(null)`.
2. **Provide:** `App` wraps everything in `<UnitContext.Provider value={{ unit, setUnit }}>`, sharing both the state and its setter.
3. **Read:** `UnitToggle`, `WeatherCard` and `ForecastDay` call `useContext(UnitContext)`.

The temperature is always stored in °C and converted only when displayed, so the converted value is computed, not stored as extra state.

## Prop drilling note

No state is drilled more than two levels:
- `ForecastDay` is the deepest component (App → Card → Forecast → ForecastDay), but it gets `unit` from **Context**, so the components in between never pass it on.
- `Card` never sees the weather data. `App` builds its content and passes it in as `children` ("pass the component, not the data").
- The only data passed down is `days`. It goes from App to Forecast, which turns each item into one `ForecastDay`.

## Requirements checklist

| Requirement | Where |
|---|---|
| Vite project, runs with `npm run dev` | `package.json`, `vite.config.js` |
| ≥ 4 components, one per file | 8 components in `src/components/` + `App` |
| ≥ 2 pieces of `useState` | `city`, `weather`, `status`, `errorMessage`, `unit` (App); `form`, `errors` (SearchBar) |
| ≥ 1 `useEffect` for a side effect | fetch in `App.jsx`, deps `[city]`, with cleanup |
| Props across ≥ 2 parent/child pairs | App→SearchBar, App→ErrorMessage, App→Card, App→WeatherCard, App→Forecast, Forecast→ForecastDay |
| Loading, error, success states | `status` in `App.jsx` |
| Functional components + hooks only | no classes |
