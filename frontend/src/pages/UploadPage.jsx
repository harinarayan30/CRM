import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultationAPI } from '../api';
import UploadDropzone from '../components/UploadDropzone';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

const STATUSES = ['pending', 'completed', 'archived'];

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: '',
    clientName: '',
    consultationDate: '',
    duration: '',
    status: 'pending',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (file) fd.append('recording', file);

      await consultationAPI.create(fd);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create consultation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn-secondary p-2.5" id="back-btn">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-dark-text">New Consultation</h1>
          <p className="text-dark-muted text-sm">Upload a recording and add consultation details</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File upload */}
          <div>
            <label className="label">Recording File <span className="text-dark-muted">(optional)</span></label>
            <UploadDropzone file={file} setFile={setFile} />
          </div>

          {/* Title */}
          <div>
            <label className="label" htmlFor="consultation-title">Consultation Title *</label>
            <input
              id="consultation-title"
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Q2 Strategy Session"
              className="input"
              required
            />
          </div>

          {/* Client Name */}
          <div>
            <label className="label" htmlFor="client-name">Client Name *</label>
            <input
              id="client-name"
              type="text"
              value={form.clientName}
              onChange={(e) => update('clientName', e.target.value)}
              placeholder="e.g. Acme Corporation"
              className="input"
              required
            />
          </div>

          {/* Date + Duration row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="consultation-date">Consultation Date *</label>
              <input
                id="consultation-date"
                type="date"
                value={form.consultationDate}
                onChange={(e) => update('consultationDate', e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="duration">Duration (seconds)</label>
              <input
                id="duration"
                type="number"
                value={form.duration}
                onChange={(e) => update('duration', e.target.value)}
                placeholder="e.g. 3600"
                className="input"
                min="0"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="label" htmlFor="status">Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className="input"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="label" htmlFor="upload-notes">Notes</label>
            <textarea
              id="upload-notes"
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Add consultation notes, key takeaways, action items..."
              rows={5}
              className="input resize-y min-h-[120px]"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 justify-center"
              id="submit-consultation-btn"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                : <><Save className="w-4 h-4" />Save Consultation</>
              }
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
