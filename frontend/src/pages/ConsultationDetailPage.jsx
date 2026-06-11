import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { consultationAPI } from '../api';
import AudioVideoPlayer from '../components/AudioVideoPlayer';
import NotesEditor from '../components/NotesEditor';
import ConfirmModal from '../components/ConfirmModal';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Pencil, Trash2, Calendar, Clock, User,
  HardDrive, Loader2, AlertCircle, Download
} from 'lucide-react';
import { formatDate, formatDuration, formatFileSize } from '../utils/format';

const STATUS_CLASS = {
  pending: 'badge-pending',
  completed: 'badge-completed',
  archived: 'badge-archived',
};

export default function ConsultationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await consultationAPI.getOne(id);
        setConsultation(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load consultation.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSaveNotes = async (notes) => {
    const fd = new FormData();
    fd.append('notes', notes);
    const { data } = await consultationAPI.update(id, fd);
    setConsultation(data.data);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await consultationAPI.delete(id);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <p className="text-dark-muted">{error}</p>
      <button onClick={() => navigate(-1)} className="btn-secondary mt-4">Go back</button>
    </div>
  );

  const { title, clientName, consultationDate, duration, status, notes, recordingUrl, mimeType, originalFileName, fileSize } = consultation;
  const srcUrl = recordingUrl ? `${apiBase}${recordingUrl}` : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn-secondary p-2.5 self-start" id="back-btn">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-dark-text truncate">{title}</h1>
            <span className={STATUS_CLASS[status]}>{status}</span>
          </div>
          <p className="text-dark-muted text-sm mt-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {clientName}
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-center">
          <Link to={`/consultation/${id}/edit`} className="btn-secondary" id="edit-detail-btn">
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button onClick={() => setDeleteModal(true)} className="btn-danger" id="delete-detail-btn">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Meta info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-sm font-semibold text-dark-muted uppercase tracking-wide mb-4">Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-dark-muted flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5" /> Date
            </p>
            <p className="text-sm font-medium text-dark-text">{formatDate(consultationDate)}</p>
          </div>
          <div>
            <p className="text-xs text-dark-muted flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5" /> Duration
            </p>
            <p className="text-sm font-medium text-dark-text">{formatDuration(duration)}</p>
          </div>
          {fileSize > 0 && (
            <div>
              <p className="text-xs text-dark-muted flex items-center gap-1 mb-1">
                <HardDrive className="w-3.5 h-3.5" /> File Size
              </p>
              <p className="text-sm font-medium text-dark-text">{formatFileSize(fileSize)}</p>
            </div>
          )}
          {originalFileName && (
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-dark-muted mb-1">File Name</p>
              <p className="text-sm font-medium text-dark-text truncate" title={originalFileName}>
                {originalFileName}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Player */}
      {srcUrl && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-dark-muted uppercase tracking-wide">Recording</h2>
            <a href={srcUrl} download={originalFileName || 'recording'} className="btn-secondary text-xs py-1.5 px-3">
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
          </div>
          <AudioVideoPlayer src={srcUrl} mimeType={mimeType} fileName={originalFileName} />
        </motion.div>
      )}

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <NotesEditor notes={notes} onSave={handleSaveNotes} />
      </motion.div>

      {/* Delete Modal */}
      <ConfirmModal
        open={deleteModal}
        title="Delete Consultation"
        message={`"${title}" and its recording will be permanently deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
        loading={deleting}
      />
    </div>
  );
}
