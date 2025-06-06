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
        // Layered gradient overlay for contrast and readability
        background: `linear-gradient(135deg,rgba(30,40,58,0.82),rgba(28,28,45,0.54)), url('${bgImage}') center center/cover no-repeat, var(--base-dark)`,
        transition: "background-image 0.7s cubic-bezier(.4,0,0.2,1),background 0.6s cubic-bezier(.4,0,0.2,1)"
      }}
    >
      {/* Navbar */}
      <nav className="navbar" aria-label="MoodWeather App Bar">
        <div className="container navbar-inner">
          <div className="logo" tabIndex={0} aria-label="MoodWeather Logo">
            <span className="logo-symbol" aria-hidden="true">☁️</span> MoodWeather
          </div>
        </div>
      </nav>

      {/* Main vertical stack container */}
      <main>
        <div className="container">
          <section className="hero cool-hero">
            <h2 className="subtitle" id="intro-desc">
              Check today's weather and reflect your mood.
            </h2>
            <form
              aria-labelledby="form-title"
              className="weather-form"
              onSubmit={handleFetchWeather}
            >
              <label htmlFor="city-input" className="form-label">
                City
                <input
                  id="city-input"
                  name="city"
                  type="text"
                  className="input cool-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  aria-required="true"
                  aria-label="City"
                  autoComplete="off"
                  placeholder="Enter city name..."
                  spellCheck={false}
                />
              </label>
              <label htmlFor="mood-select" className="form-label">
                Mood
                <select
                  id="mood-select"
                  name="mood"
                  className="input cool-select"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  aria-label="Mood"
                >
                  {moodOptions.map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="btn btn-large cool-btn"
                type="submit"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  <span>
                    <span className="btn-icon" aria-hidden="true">🌈</span>
                    Fetch Weather
                  </span>
                )}
              </button>
            </form>
            {/* Weather and error display */}
            <div
              className={`weather-display weather-card${!!(weather || error) ? " active" : ""}`}
              aria-live="polite"
              role="region"
              aria-label="Weather result"
              tabIndex={0}
            >
              {/* Show error message, if any */}
              {error && (
                <div
                  className="weather-error"
                  role="alert"
                >
                  {error}
                </div>
              )}
              {/* Show weather, if loaded */}
              {weather && (
                <div>
                  <div className="weather-location">{weather.location}</div>
                  <div className="weather-main-row">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                      alt={weather.desc}
                      className="weather-icon"
                    />
                    <span className="weather-temp">{weather.temp}°C</span>
                  </div>
                  {/* Mood and weather status */}
                  <div className="weather-mainline">
                    Weather: <span className="weather-main">{weather.main}</span>
                  </div>
                  <div className="weather-moodline">
                    Mood: <span className="weather-mood">{mood}</span>
                  </div>
                  <div className="weather-quote">
                    “{moodWeatherData.quote}”
                  </div>
                  <div className="weather-suggestion">
                    Suggestion: {moodWeatherData.outfit}
                  </div>
                </div>
              )}
            </div>
            {weather && (
              <p className="bg-disclaimer">
                Background image adapts to your mood & weather!
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;