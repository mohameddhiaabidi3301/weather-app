import axios from 'axios';
import { NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY;

function isCoordinates(location) {
  const parts = location.split(',');
  if (parts.length !== 2) return false;
  const lat = parseFloat(parts[0].trim());
  const lon = parseFloat(parts[1].trim());
  return !isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

async function geocodeLocation(location) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'WeatherApp/1.0' } }
    );
    const data = await res.json();
    if (data.length === 0) return null;
    return { lat: data[0].lat, lon: data[0].lon };
  } catch {
    return null;
  }
}

async function fetchWeatherByCoords(lat, lon) {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  const [currentRes, forecastRes] = await Promise.all([
    axios.get(currentUrl),
    axios.get(forecastUrl),
  ]);

  const forecast = forecastRes.data.list
    .filter((_, index) => index % 8 === 0)
    .slice(0, 5)
    .map((item) => ({
      date: item.dt_txt,
      temp: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));

  return {
    location: currentRes.data.name,
    country: currentRes.data.sys.country,
    temperature: currentRes.data.main.temp,
    feels_like: currentRes.data.main.feels_like,
    humidity: currentRes.data.main.humidity,
    windSpeed: currentRes.data.wind.speed,
    description: currentRes.data.weather[0].description,
    icon: currentRes.data.weather[0].icon,
    forecast,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  if (!location || ['null', 'undefined', 'none', 'n/a'].includes(location.toLowerCase().trim())) {
    return NextResponse.json({ error: 'Please enter a valid location.' }, { status: 400 });
  }

  try {
    if (isCoordinates(location)) {
      const [lat, lon] = location.split(',').map((v) => v.trim());
      const data = await fetchWeatherByCoords(lat, lon);
      return NextResponse.json(data);
    }

    try {
      const encoded = encodeURIComponent(location);
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encoded}&appid=${API_KEY}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encoded}&appid=${API_KEY}&units=metric`;

      const [currentRes, forecastRes] = await Promise.all([
        axios.get(currentUrl),
        axios.get(forecastUrl),
      ]);

      const forecast = forecastRes.data.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5)
        .map((item) => ({
          date: item.dt_txt,
          temp: item.main.temp,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        }));

      return NextResponse.json({
        location: currentRes.data.name,
        country: currentRes.data.sys.country,
        temperature: currentRes.data.main.temp,
        feels_like: currentRes.data.main.feels_like,
        humidity: currentRes.data.main.humidity,
        windSpeed: currentRes.data.wind.speed,
        description: currentRes.data.weather[0].description,
        icon: currentRes.data.weather[0].icon,
        forecast,
      });
    } catch (firstError) {
      if (firstError.response?.status !== 404) throw firstError;

      const coords = await geocodeLocation(location);
      if (!coords) {
        return NextResponse.json(
          { error: 'Location not found. Please try a city name, zip code, or coordinates.' },
          { status: 404 }
        );
      }

      const data = await fetchWeatherByCoords(coords.lat, coords.lon);
      return NextResponse.json(data);
    }
  } catch (error) {
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Location not found. Please try a city name, zip code, or coordinates.' },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: 'Failed to fetch weather data.' }, { status: 500 });
  }
}