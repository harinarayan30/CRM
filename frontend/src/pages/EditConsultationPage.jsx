import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { consultationAPI } from '../api';
import UploadDropzone from '../components/UploadDropzone';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';

const STATUSES = ['pending', 'completed', 'archived'];

export default function EditConsultationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await consultationAPI.getOne(id);
        const c = data.data;
        setForm({
          title: c.title || '',
          clientName: c.clientName || '',
          consultationDate: c.consultationDate ? c.consultationDate.split('T')[0] : '',
          duration: c.duration || '',
          status: c.status || 'pending',
          notes: c.notes || '',
        });
      } catch (err) {
        setError('Failed to load consultation.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('recording', file);
      await consultationAPI.update(id, fd);
      navigate(`/consultation/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update consultation.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );

  if (error && !form) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <p className="text-dark-muted">{error}</p>
      <button onClick={() => navigate(-1)} className="btn-secondary mt-4">Go back</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn-secondary p-2.5" id="back-btn">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Edit Consultation</h1>
          <p className="text-dark-muted text-sm">Update recording details and notes</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Replace Recording <span className="text-dark-muted">(optional)</span></label>
            <UploadDropzone file={file} setFile={setFile} />
          </div>

          <div>
            <label className="label" htmlFor="edit-title">Consultation Title *</label>
            <input id="edit-title" type="text" value={form.title}
              onChange={(e) => update('title', e.target.value)} className="input" required />
          </div>

          <div>
            <label className="label" htmlFor="edit-client">Client Name *</label>
            <input id="edit-client" type="text" value={form.clientName}
              onChange={(e) => update('clientName', e.target.value)} className="input" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="edit-date">Consultation Date *</label>
              <input id="edit-date" type="date" value={form.consultationDate}
                onChange={(e) => update('consultationDate', e.target.value)} className="input" required />
            </div>
            <div>
              <label className="label" htmlFor="edit-duration">Duration (seconds)</label>
              <input id="edit-duration" type="number" value={form.duration}
                onChange={(e) => update('duration', e.target.value)} className="input" min="0" />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="edit-status">Status</label>
            <select id="edit-status" value={form.status}
              onChange={(e) => update('status', e.target.value)} className="input">
              {STATUSES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="edit-notes">Notes</label>
            <textarea id="edit-notes" value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={6} className="input resize-y min-h-[140px]" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center" id="save-edit-btn">
              {saving
                ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                : <><Save className="w-4 h-4" />Save Changes</>
              }
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
