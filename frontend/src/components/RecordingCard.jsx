import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mic2, MoreVertical, Pencil, Trash2, Download } from 'lucide-react';
import { formatDate, formatDuration } from '../utils/format';

const STATUS_CLASS = {
  pending: 'badge-pending',
  completed: 'badge-completed',
  archived: 'badge-archived',
};

export default function RecordingCard({ consultation, onDelete, index = 0 }) {
  const { _id, title, clientName, consultationDate, duration, status, recordingUrl } = consultation;
  const apiBase = import.meta.env.VITE_API_URL;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card group hover:border-primary-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-900/20"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Icon */}
        <div className="w-10 h-10 shrink-0 rounded-xl bg-primary-600/20 flex items-center justify-center mt-0.5">
          <Mic2 className="w-5 h-5 text-primary-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <Link
              to={`/consultation/${_id}`}
              className="font-semibold text-dark-text hover:text-primary-400 transition-colors truncate block"
            >
              {title}
            </Link>
            <span className={STATUS_CLASS[status] || 'badge bg-gray-500/20 text-gray-400'}>
              {status}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dark-muted">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {clientName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(consultationDate)}
            </span>
            {duration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(duration)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dark-border">
        <Link
          to={`/consultation/${_id}`}
          className="btn-primary text-xs py-2 px-3"
          id={`view-${_id}`}
        >
          View Details
        </Link>
        <Link
          to={`/consultation/${_id}/edit`}
          className="btn-secondary text-xs py-2 px-3"
          id={`edit-${_id}`}
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </Link>
        {recordingUrl && (
          <a
            href={`${apiBase}${recordingUrl}`}
            download
            className="btn-secondary text-xs py-2 px-3"
            id={`download-${_id}`}
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        )}
        <button
          onClick={() => onDelete(_id)}
          className="ml-auto btn-danger text-xs py-2 px-3"
          id={`delete-${_id}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </motion.div>
  );
}
