'use client';
import { useState } from 'react';

export default function WeatherDisplay({ weather, onSave }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSave = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date cannot be after end date');
      return;
    }
    onSave({ start: startDate, end: endDate });
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black">
            {weather.location}, {weather.country}
          </h2>
          <p className="text-gray-500 capitalize text-base mt-1">{weather.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="w-16 h-16 grayscale"
          />
          <span className="text-5xl font-bold text-black">{Math.round(weather.temperature)}°C</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">Feels Like</p>
          <p className="text-xl font-bold text-black">{Math.round(weather.feels_like)}°C</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">Humidity</p>
          <p className="text-xl font-bold text-black">{weather.humidity}%</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">Wind Speed</p>
          <p className="text-xl font-bold text-black">{weather.windSpeed} m/s</p>
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-black font-semibold mb-3 text-sm">Save this weather record</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-gray-400 text-xs block mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min="2000-01-01"
              max="2100-12-31"
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-800 outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs block mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min="2000-01-01"
              max="2100-12-31"
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-800 outline-none focus:border-black"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
}