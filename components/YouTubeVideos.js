'use client';
import { useEffect, useState } from 'react';

function decodeHTML(str) {
  if (typeof document === 'undefined') return str;
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

export default function YouTubeVideos({ location }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!location) return;
    const fetchVideos = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/youtube?location=' + encodeURIComponent(location));
        const data = await res.json();
        if (!res.ok) {
          setError('Could not load videos');
          return;
        }
        setVideos(data);
      } catch (err) {
        setError('Failed to load YouTube videos');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [location]);

  if (loading) return <div className="text-black text-center mb-6 text-sm">Loading videos...</div>;

  if (error) return (
    <div className="border border-red-300 bg-red-50 text-red-700 rounded-lg p-4 mb-6 text-center text-sm">{error}</div>
  );

  if (videos.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50">
      <h3 className="text-lg font-bold text-black mb-4">Videos about {location}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {videos.map((video) => (
          <a key={video.videoId} href={'https://www.youtube.com/watch?v=' + video.videoId} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
            <img src={video.thumbnail} alt={decodeHTML(video.title)} className="w-full" />
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-900">{decodeHTML(video.title)}</p>
              <p className="text-gray-600 text-xs mt-1">{video.channel}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}