// Handles Creating and Reading weather records. 
import connectDB from '@/lib/mongodb';
import Weather from '@/models/Weather';
import { NextResponse } from 'next/server';

async function validateLocation(location) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'WeatherApp/1.0' } }
    );
    const data = await res.json();
    return data.length > 0;
  } catch {
    return true;
  }
}

export async function GET() {
  try {
    await connectDB();
    const records = await Weather.find().sort({ createdAt: -1 });
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { location, dateRange, temperature, description, humidity, windSpeed, icon, forecast } = body;

    if (!location || !dateRange?.start || !dateRange?.end) {
      return NextResponse.json({ error: 'Location and date range are required' }, { status: 400 });
    }

    if (new Date(dateRange.start) > new Date(dateRange.end)) {
      return NextResponse.json({ error: 'Start date cannot be after end date' }, { status: 400 });
    }

    const isValid = await validateLocation(location);
    if (!isValid) {
      return NextResponse.json(
        { error: `Location "${location}" could not be verified. Please enter a valid place name.` },
        { status: 400 }
      );
    }

    const record = await Weather.create({
      location,
      dateRange,
      temperature,
      description,
      humidity,
      windSpeed,
      icon,
      forecast,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('POST /api/records error:', error);
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}
