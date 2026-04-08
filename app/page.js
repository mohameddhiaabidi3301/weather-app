'use client';
import { useState } from 'react';
import WeatherSearch from '@/components/WeatherSearch';
import WeatherDisplay from '@/components/WeatherDisplay';
import ForecastDisplay from '@/components/ForecastDisplay';
import RecordsTable from '@/components/RecordsTable';
import ExportButtons from '@/components/ExportButtons';
import YouTubeVideos from '@/components/YouTubeVideos';
import WeatherMap from '@/components/WeatherMap';

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [refreshRecords, setRefreshRecords] = useState(0);

  const handleSearch = async (searchLocation) => {
    setLoading(true);
    setError('');
    setWeather(null);
    setLocation(searchLocation);

    try {
      const res = await fetch(`/api/weather?location=${encodeURIComponent(searchLocation)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }
      setWeather(data);
    } catch (err) {
      setError('Failed to connect to weather service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecord = async (dateRange) => {
    if (!weather) return;
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: weather.location,
          dateRange,
          temperature: weather.temperature,
          description: weather.description,
          humidity: weather.humidity,
          windSpeed: weather.windSpeed,
          icon: weather.icon,
          forecast: weather.forecast,
        }),
      });
      if (res.ok) {
        setRefreshRecords((prev) => prev + 1);
        alert('Record saved successfully!');
      }
    } catch (err) {
      alert('Failed to save record');
    }
  };

  return (
    <main className="min-h-screen bg-white text-black p-4">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-8 pt-6 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-bold text-black mb-1">Weather App</h1>
          <p className="text-gray-500 text-sm">By Mohamed Dhia Abidi</p>
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 max-w-2xl mx-auto">
            <p className="text-gray-600 text-xs">
              <strong>PM Accelerator</strong> — The Product Manager Accelerator Program is designed to support PM professionals through every stage of their career.
              From students to Directors, we provide tailored coaching, resources, and community to help you land your dream job and excel in your career.
            </p>
          </div>
        </div>

        <WeatherSearch onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="border border-red-300 bg-red-50 text-red-700 rounded-lg p-4 mb-4 text-center text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-500 text-sm mt-8">
            Fetching weather data...
          </div>
        )}

        {weather && !loading && (
          <>
            <WeatherDisplay weather={weather} onSave={handleSaveRecord} />
            <ForecastDisplay forecast={weather.forecast} />
            <YouTubeVideos location={weather.location} />
            <WeatherMap location={`${weather.location},${weather.country}`} />
          </>
        )}

        <RecordsTable refresh={refreshRecords} onUpdate={() => setRefreshRecords((prev) => prev + 1)} />

        <ExportButtons />

      </div>
    </main>
  );
}