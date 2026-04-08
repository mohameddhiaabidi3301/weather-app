// The Mongoose schema — stores location, date range, temperature, humidity, wind speed, forecast, and icons.
import mongoose from 'mongoose';

const WeatherSchema = new mongoose.Schema({
  location: { type: String, required: true },
  dateRange: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  temperature: { type: Number },
  description: { type: String },
  humidity: { type: Number },
  windSpeed: { type: Number },
  icon: { type: String },
  forecast: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Weather || mongoose.model('Weather', WeatherSchema);
