import React, { useState } from "react";
import "./App.css";

// Map for mood + weather combination -> quote, outfit suggestion, background image
const moodWeatherMap = {
  "Sad_Rain": {
    quote: "Storms don't last forever.",
    outfit: "Carry a cozy hoodie and an umbrella.",
    bg: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
  },
  "Happy_Clear": {
    quote: "Shine on just like the sun!",
    outfit: "Light clothes and shades.",
    bg: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80"
  },
  "Tired_Clouds": {
    quote: "Clouds may linger, but you can rest and recharge.",
    outfit: "Comfy sweats and a soft scarf.",
    bg: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"
  },
  "Excited_Snow": {
    quote: "Let the world sparkle—just like you!",
    outfit: "Warm puffer jacket, boots & gloves.",
    bg: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
  },
  "Anxious_Thunderstorm": {
    quote: "After every storm, there is a rainbow.",
    outfit: "Raincoat and waterproof shoes.",
    bg: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80"
  },
  "Happy_Clouds": {
    quote: "Every cloud has a silver lining.",
    outfit: "Light sweater and jeans.",
    bg: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
  },
  "Sad_Clear": {
    quote: "Even the brightest days can start with a gentle tear.",
    outfit: "Casual tee, sunglasses, and headphones.",
    bg: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1200&q=80"
  },
  "Excited_Rain": {
    quote: "Dance in the rain; splash in every puddle.",
    outfit: "Waterproof boots and a playful poncho.",
    bg: "https://images.unsplash.com/photo-1428591501234-1ffcb0d6871f?auto=format&fit=crop&w=1200&q=80"
  },
  "Tired_Clear": {
    quote: "Let the sunshine recharge your energy.",
    outfit: "Simple shirt and relaxed shorts.",
    bg: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80"
  },
  "Anxious_Clouds": {
    quote: "Clouds drift by; so will this feeling.",
    outfit: "Cozy hoodie and headphones.",
    bg: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1200&q=80"
  },
  // Default fallback
  "default": {
    quote: "Make today your kind of day.",
    outfit: "Comfortable attire that makes you feel good.",
    bg: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
  }
};

// PUBLIC_INTERFACE
function App() {
  // State management for user input and weather data
  const [city, setCity] = useState("");
  const [mood, setMood] = useState("Happy");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null); // will store {location, temp, desc, icon, main}
  const [error, setError] = useState(null);

  // For background image
  const [bgImage, setBgImage] = useState(moodWeatherMap.default.bg);

  // List of mood options
  const moodOptions = ["Happy", "Sad", "Tired", "Anxious", "Excited"];

  // Helper to determine "main" weather group from OpenWeatherMap (e.g., Rain, Clear, Snow)
  function getWeatherMain(desc, owmMain) {
    // Prefer OWM's main field, fallback to matching in description
    if (owmMain) {
      // Standardize to Title case (e.g., Rain, Thunderstorm, Clear)
      return owmMain.charAt(0).toUpperCase() + owmMain.slice(1).toLowerCase();
    }
    if (desc) {
      let d = desc.toLowerCase();
      if (d.includes("rain")) return "Rain";
      if (d.includes("cloud")) return "Clouds";
      if (d.includes("snow")) return "Snow";
      if (d.includes("storm")) return "Thunderstorm";
      if (d.includes("clear")) return "Clear";
    }
    return "Clear";
  }

  // Fetch weather data from OpenWeatherMap API (extract main.temp and weather[0].main)
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
    const API_KEY = "7b7c85836bda41485369c43acbf566cf";
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
      // Extract weather main, temp, description, and icon
      const weatherMain = data.weather?.[0]?.main || "";
      const main = getWeatherMain(data.weather?.[0]?.description, weatherMain);
      const newWeather = {
        location: `${data.name}, ${data.sys?.country || ""}`,
        temp: Math.round(data.main.temp),
        desc: data.weather[0].description,
        icon: data.weather[0].icon,
        main, // e.g., "Rain", "Clear", etc.
      };
      setWeather(newWeather);

      // Compose mood + weather key
      const moodWeatherKey = (mood + "_" + main).replace(/\s/g, "");
      const moodData = moodWeatherMap[moodWeatherKey] || moodWeatherMap.default;
      setBgImage(moodData.bg);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Compose mood + weather key for UI
  const getMoodWeatherData = () => {
    if (!weather) return moodWeatherMap.default;
    const main = weather.main;
    const moodWeatherKey = (mood + "_" + main).replace(/\s/g, "");
    return moodWeatherMap[moodWeatherKey] || moodWeatherMap.default;
  };

  const moodWeatherData = getMoodWeatherData();

  return (
    <div
      className="app"
      style={{
        minHeight: "100vh",
        background: `url('${bgImage}') center center/cover no-repeat, var(--base-dark)`,
        transition: "background-image 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
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
          <div className="hero" style={{ paddingTop: 120, maxWidth: 480, margin: "0 auto" }}>
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
                background: "rgba(255,255,255,0.04)",
                borderRadius: 5,
                padding: weather || error ? 22 : 0,
                minHeight: 50,
                color: "var(--text-color)",
                border: weather || error ? "1px solid var(--border-color)" : "none",
                boxShadow: "0 2px 16px rgba(0,0,0,0.11)",
                backdropFilter: "blur(2.5px)"
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
                  {/* City and temp */}
                  <div style={{ fontWeight: "600", fontSize: "1.3rem" }}>
                    {weather.location}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                      alt={weather.desc}
                      style={{ width: 54, height: 54 }}
                    />
                    <span style={{ fontSize: "2.15rem", color: "var(--primary)", fontWeight: "600" }}>
                      {weather.temp}°C
                    </span>
                  </div>
                  {/* Mood and weather status */}
                  <div style={{ fontSize: "1.07rem", color: "var(--secondary)", marginTop: 0 }}>
                    Weather: {weather.main}
                  </div>
                  <div style={{ fontSize: "1.08rem", marginTop: 3 }}>
                    Mood: <span style={{ color: "var(--accent)" }}>{mood}</span>
                  </div>
                  {/* Motivational quote */}
                  <div style={{
                    marginTop: 20,
                    fontStyle: "italic",
                    fontSize: "1.08rem",
                    color: "#ffe8a0",
                    textShadow: "1px 1px 5px rgba(38,38,38,0.2)"
                  }}>
                    “{moodWeatherData.quote}”
                  </div>
                  {/* Outfit suggestion */}
                  <div style={{
                    marginTop: 12,
                    fontSize: "1rem",
                    color: "#e5ffb3",
                    fontWeight: "500"
                  }}>
                    Suggestion: {moodWeatherData.outfit}
                  </div>
                </div>
              )}
            </div>
            {weather && (
              <p style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                marginTop: 20,
                textAlign: "center",
                fontStyle: "italic"
              }}>
                Background image adapts to your mood & weather!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;