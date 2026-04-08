'use client';
import { useState } from 'react';

export default function ExportButtons() {
  const [loadingFormat, setLoadingFormat] = useState(null);

  const handleExport = async (format) => {
    setLoadingFormat(format);
    try {
      const res = await fetch(`/api/export?format=${format}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather-data.${format === 'markdown' ? 'md' : format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed. Please try again.');
    } finally {
      setLoadingFormat(null);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50">
      <h3 className="text-lg font-bold text-black mb-4">Export Records</h3>
      <div className="flex flex-wrap gap-3">
        {['json', 'csv', 'xml', 'markdown', 'pdf'].map((format) => (
          <button
            key={format}
            onClick={() => handleExport(format)}
            disabled={loadingFormat !== null}
            className="bg-white hover:bg-black hover:text-white text-black font-semibold px-5 py-2 rounded-lg border border-gray-300 transition uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingFormat === format ? 'Exporting...' : format}
          </button>
        ))}
      </div>
    </div>
  );
}