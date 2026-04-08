'use client';
import React, { useEffect, useState } from 'react';

export default function RecordsTable({ refresh, onUpdate }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [updateError, setUpdateError] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/records');
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/records/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchRecords();
        onUpdate();
      }
    } catch (err) {
      alert('Failed to delete record');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    setUpdateError('');
    setEditData({
      location: record.location,
      start: record.dateRange.start,
      end: record.dateRange.end,
      temperature: record.temperature,
      description: record.description,
      humidity: record.humidity,
      windSpeed: record.windSpeed,
    });
  };

  const handleUpdate = async (id) => {
    setUpdateError('');

    if (!editData.location || !editData.location.trim()) {
      setUpdateError('Location cannot be empty');
      return;
    }

    if (!editData.start || !editData.end) {
      setUpdateError('Start and end dates are required');
      return;
    }

    if (new Date(editData.start) > new Date(editData.end)) {
      setUpdateError('Start date cannot be after end date');
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/records/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: editData.location.trim(),
          dateRange: { start: editData.start, end: editData.end },
          temperature: editData.temperature,
          description: editData.description,
          humidity: editData.humidity,
          windSpeed: editData.windSpeed,
        }),
      });
      if (res.ok) {
        setEditingId(null);
        setUpdateError('');
        fetchRecords();
        onUpdate();
      } else {
        const data = await res.json();
        setUpdateError(data.error || 'Failed to update record');
      }
    } catch (err) {
      setUpdateError('Failed to update record. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const inputClass = "bg-white text-black border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-black w-full";

  if (loading) return <div className="text-black text-center mb-6 text-sm">Loading records...</div>;

  if (records.length === 0) return (
    <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50 text-gray-500 text-center text-sm">
      No saved records yet. Search for a city and save a record!
    </div>
  );

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50">
      <h3 className="text-lg font-bold text-black mb-4">Saved Weather Records</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-black">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 text-xs uppercase">
              <th className="text-left py-2 px-3">Location</th>
              <th className="text-left py-2 px-3">Start Date</th>
              <th className="text-left py-2 px-3">End Date</th>
              <th className="text-left py-2 px-3">Temp</th>
              <th className="text-left py-2 px-3">Description</th>
              <th className="text-left py-2 px-3">Humidity</th>
              <th className="text-left py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <React.Fragment key={record._id}>
                {editingId === record._id && updateError && (
                  <tr>
                    <td colSpan={7} className="px-3 py-2">
                      <div className="bg-red-50 border border-red-300 text-red-700 rounded px-3 py-2 text-xs">
                        {updateError}
                      </div>
                    </td>
                  </tr>
                )}
                <tr className="border-b border-gray-100 hover:bg-white transition">
                  {editingId === record._id ? (
                    <>
                      <td className="py-2 px-3">
                        <input className={inputClass} value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} />
                      </td>
                      <td className="py-2 px-3">
                        <input type="date" className={inputClass} value={editData.start} onChange={(e) => setEditData({ ...editData, start: e.target.value })} />
                      </td>
                      <td className="py-2 px-3">
                        <input type="date" className={inputClass} value={editData.end} onChange={(e) => setEditData({ ...editData, end: e.target.value })} />
                      </td>
                      <td className="py-2 px-3">
                        <input type="number" className={inputClass} value={editData.temperature} onChange={(e) => setEditData({ ...editData, temperature: e.target.value })} />
                      </td>
                      <td className="py-2 px-3">
                        <input className={inputClass} value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
                      </td>
                      <td className="py-2 px-3">
                        <input type="number" className={inputClass} value={editData.humidity} onChange={(e) => setEditData({ ...editData, humidity: e.target.value })} />
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(record._id)}
                            disabled={updating}
                            className="bg-black hover:bg-gray-800 text-white font-semibold px-3 py-1 rounded text-xs transition disabled:opacity-50"
                          >
                            {updating ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => { setEditingId(null); setUpdateError(''); }}
                            className="bg-white hover:bg-gray-100 text-black font-semibold px-3 py-1 rounded text-xs border border-gray-300 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-3 text-black">{record.location}</td>
                      <td className="py-2 px-3 text-black">{record.dateRange.start}</td>
                      <td className="py-2 px-3 text-black">{record.dateRange.end}</td>
                      <td className="py-2 px-3 text-black">{Math.round(record.temperature)}°C</td>
                      <td className="py-2 px-3 text-black capitalize">{record.description}</td>
                      <td className="py-2 px-3 text-black">{record.humidity}%</td>
                      <td className="py-2 px-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(record)} className="bg-white hover:bg-black hover:text-white text-black font-semibold px-3 py-1 rounded text-xs border border-gray-300 transition">Edit</button>
                          <button onClick={() => handleDelete(record._id)} className="bg-white hover:bg-red-500 hover:text-white text-black font-semibold px-3 py-1 rounded text-xs border border-gray-300 transition">Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}