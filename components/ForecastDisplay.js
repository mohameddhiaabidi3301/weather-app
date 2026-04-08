'use client';

export default function ForecastDisplay({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50">
      <h3 className="text-lg font-bold text-black mb-4">5-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {forecast.map((day, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-gray-400 text-xs">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.description}
              className="w-12 h-12 mx-auto grayscale"
            />
            <p className="text-xl font-bold text-black">{Math.round(day.temp)}°C</p>
            <p className="text-gray-400 text-xs capitalize">{day.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}