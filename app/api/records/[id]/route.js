// Handles Updating and Deleting individual records.
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

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const { location, dateRange, temperature, description, humidity, windSpeed } = body;

    if (dateRange?.start && dateRange?.end) {
      if (new Date(dateRange.start) > new Date(dateRange.end)) {
        return NextResponse.json({ error: 'Start date cannot be after end date' }, { status: 400 });
      }
    }

    if (location) {
      const isValid = await validateLocation(location);
      if (!isValid) {
        return NextResponse.json(
          { error: `Location "${location}" could not be verified. Please enter a valid place name.` },
          { status: 400 }
        );
      }
    }

    const updated = await Weather.findByIdAndUpdate(
      params.id,
      {
        location,
        dateRange,
        temperature,
        description,
        humidity,
        windSpeed,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const deleted = await Weather.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Record deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
