import React, { useState } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  // State management for user input and weather data
  const [city, setCity] = useState("");
  const [mood, setMood] = useState("Happy");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  // List of mood options
  const moodOptions = ["Happy", "Sad", "Tired", "Anxious", "Excited"];

  // Function to fetch weather for a given city from OpenWeatherMap API
  // Note: Replace "YOUR_OPENWEATHERMAP_API_KEY" below with your actual OpenWeatherMap API key.
  // You can sign up for a free API key at https://openweathermap.org/api
  // This is left as a placeholder for security reasons.
  const handleFetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setWeather(null);

    if (!city.trim()) {
      setError("Please enter a city name.");
      setLoading(false);
      return;
    }
    const API_KEY = "7b7c85836bda41485369c43acbf566cf"; // <-- OpenWeatherMap API key provided by user
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "City not found. Please check your spelling."
            : "Could not fetch the weather data."
        );
      }
      const data = await response.json();
      setWeather({
        location: `${data.name}, ${data.sys?.country || ""}`,
        temp: Math.round(data.main.temp),
        desc: data.weather[0].description,
        icon: data.weather[0].icon,
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar" aria-label="MoodWeather App Bar">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <div className="logo" tabIndex={0} aria-label="MoodWeather Logo">
              <span className="logo-symbol" aria-hidden="true">☁️</span> MoodWeather
            </div>
            <span style={{ flex: 1 }} />
          </div>
        </div>
      </nav>

      {/* Main vertical stack container */}
      <main>
        <div className="container">
          <div className="hero" style={{ paddingTop: 120, maxWidth: 440, margin: "0 auto" }}>
            <div className="subtitle" id="intro-desc">
              Check today's weather and reflect your mood.
            </div>
            <form
              aria-labelledby="form-title"
              style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}
              onSubmit={handleFetchWeather}
            >
              <label htmlFor="city-input" style={{ textAlign: "left", width: "100%" }}>
                City
                <input
                  id="city-input"
                  name="city"
                  type="text"
                  className="input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  aria-required="true"
                  aria-label="City"
                  style={{
                    width: "100%",
                    fontSize: "1.1rem",
                    padding: "10px 12px",
                    marginTop: 4,
                    borderRadius: 4,
                    border: "1px solid var(--border-color)",
                    background: "#23272f",
                    color: "var(--text-color)",
                    outline: "none",
                  }}
                  autoComplete="off"
                  placeholder="Enter city name..."
                />
              </label>
              <label htmlFor="mood-select" style={{ textAlign: "left", width: "100%" }}>
                Mood
                <select
                  id="mood-select"
                  name="mood"
                  className="input"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  aria-label="Mood"
                  style={{
                    width: "100%",
                    fontSize: "1.08rem",
                    padding: "10px 12px",
                    marginTop: 4,
                    borderRadius: 4,
                    border: "1px solid var(--border-color)",
                    background: "#23272f",
                    color: "var(--text-color)",
                    outline: "none",
                  }}
                >
                  {moodOptions.map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="btn btn-large"
                type="submit"
                disabled={loading}
                aria-busy={loading}
                style={{ marginTop: 12, marginBottom: 8 }}
              >
                {loading ? "Checking weather..." : "Fetch Weather"}
              </button>
            </form>
            {/* Weather and error display */}
            <div
              className="weather-display"
              aria-live="polite"
              style={{
                marginTop: 18,
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 5,
                padding: weather || error ? 20 : 0,
                minHeight: 40,
                color: "var(--text-color)",
                border: weather || error ? "1px solid var(--border-color)" : "none",
              }}
              role="region"
              aria-label="Weather result"
              tabIndex={0}
            >
              {/* Show error message, if any */}
              {error && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontWeight: "500",
                    fontSize: "1.07rem",
                  }}
                  role="alert"
                >
                  {error}
                </div>
              )}
              {/* Show weather, if loaded */}
              {weather && (
                <div>
                  <div style={{ fontWeight: "600", fontSize: "1.25rem" }}>
                    {weather.location}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                      alt={weather.desc}
                      style={{ width: 54, height: 54 }}
                    />
                    <span style={{ fontSize: "2.1rem", color: "var(--primary)" }}>
                      {weather.temp}°C
                    </span>
                  </div>
                  <div style={{ fontSize: "1.1rem", color: "var(--secondary)" }}>
                    {weather.desc.charAt(0).toUpperCase() + weather.desc.slice(1)}
                  </div>
                  <div style={{ fontSize: "1rem", marginTop: 8 }}>
                    Mood: <span style={{ color: "var(--accent)" }}>{mood}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;