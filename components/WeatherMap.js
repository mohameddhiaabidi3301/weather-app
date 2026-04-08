'use client';
import { useEffect, useState, useRef } from 'react';

export default function WeatherMap({ location }) {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!location) return;
    const fetchCoords = async () => {
      setLoading(true);
      setError('');
      setCoords(null);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
        );
        const data = await res.json();
        if (data.length === 0) {
          setError('Location not found on map');
          return;
        }
        setCoords({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display: data[0].display_name });
      } catch (err) {
        setError('Failed to load map');
      } finally {
        setLoading(false);
      }
    };
    fetchCoords();
  }, [location]);

  useEffect(() => {
    if (!coords) return;

    let map = null;
    let cancelled = false;

    import('leaflet').then((L) => {
      if (cancelled) return;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const container = document.getElementById('weather-map');
      if (!container) return;

      if (container._leaflet_id) {
        container._leaflet_id = null;
        container.innerHTML = '';
      }

      try {
        map = L.map('weather-map', {
          dragging: true,
          touchZoom: true,
          scrollWheelZoom: 'center',
          doubleClickZoom: true,
          zoomControl: true,
          zoomSnap: 0.8,
          zoomDelta: 0.8,
          zoomAnimationThreshold: 4,
          markerZoomAnimation: true,
          maxZoom: 16,
        }).setView([coords.lat, coords.lon], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
          keepBuffer: 4,
          updateWhenIdle: true,
          updateWhenZooming: false,
        }).addTo(map);

        L.marker([coords.lat, coords.lon])
          .addTo(map)
          .bindPopup(`<b>${location}</b><br/>${coords.display}`)
          .openPopup();

        mapRef.current = map;
      } catch (e) {
        return;
      }
    });

    return () => {
      cancelled = true;
      try {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      } catch (e) {
      }
    };
  }, [coords]);

  if (!location) return null;

  if (loading) return (
    <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50 text-black text-center text-sm">
      Loading map...
    </div>
  );

  if (error) return (
    <div className="border border-red-300 bg-red-50 text-red-700 rounded-lg p-4 mb-6 text-center text-sm">
      {error}
    </div>
  );

  if (!coords) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50">
      <h3 className="text-lg font-bold text-black mb-4">Map — {location}</h3>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        id="weather-map"
        style={{
          height: '350px',
          width: '100%',
          borderRadius: '8px',
          zIndex: 0,
          position: 'relative',
          cursor: 'grab',
        }}
      />
    </div>
  );
}