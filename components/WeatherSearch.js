'use client';
import { useState } from 'react';

export default function WeatherSearch({ onSearch, loading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSearch(input.trim());
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSearch(`${latitude},${longitude}`);
      },
      () => alert('Unable to retrieve location')
    );
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="City, landmark, coordinates, or zip+country (e.g. 10001,US)"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-800 text-base outline-none focus:border-black transition"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleGPS}
          disabled={loading}
          className="bg-white hover:bg-gray-100 text-black font-semibold px-6 py-3 rounded-lg border border-gray-300 transition"
        >
          My Location
        </button>
      </form>
    </div>
  );
}