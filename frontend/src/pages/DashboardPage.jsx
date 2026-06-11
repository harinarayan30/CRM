import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { consultationAPI } from '../api';
import RecordingCard from '../components/RecordingCard';
import SearchFilterBar from '../components/SearchFilterBar';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import { motion } from 'framer-motion';
import {
  UploadCloud, Mic2, Clock, CheckCircle2, Loader2, FolderOpen
} from 'lucide-react';
import { formatDuration } from '../utils/format';

export default function DashboardPage() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [stats, setStats] = useState({ total: 0, totalDuration: 0, completed: 0 });
  const [filters, setFilters] = useState({ search: '', status: '', dateFrom: '', dateTo: '', sort: 'newest' });
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);

  const fetchConsultations = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await consultationAPI.getAll({
        ...filters,
        page,
        limit: 10,
      });
      setConsultations(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await consultationAPI.getAnalytics();
      setStats({
        total: data.data.totalConsultations,
        totalDuration: data.data.totalDuration,
        completed: data.data.statusBreakdown?.completed || 0,
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await consultationAPI.delete(deleteId);
      setDeleteId(null);
      fetchConsultations();
      fetchStats();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const STAT_CARDS = [
    {
      label: 'Total Consultations',
      value: stats.total,
      icon: Mic2,
      color: 'text-primary-400',
      bg: 'bg-primary-600/15',
    },
    {
      label: 'Total Duration',
      value: formatDuration(stats.totalDuration),
      icon: Clock,
      color: 'text-accent-400',
      bg: 'bg-accent-500/15',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-500/15',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
            <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-dark-muted text-sm mt-1">Here's an overview of your consultations</p>
        </div>
        <Link to="/upload" className="btn-primary" id="new-consultation-btn">
          <UploadCloud className="w-4 h-4" />
          New Consultation
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="stat-card"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-dark-muted text-xs font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-dark-text mt-0.5">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <SearchFilterBar filters={filters} setFilters={setFilters} />

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-muted">
          {loading ? 'Loading…' : `${pagination.total} consultation${pagination.total !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : consultations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <FolderOpen className="w-16 h-16 text-dark-border mb-4" />
          <h3 className="text-lg font-semibold text-dark-text">No consultations found</h3>
          <p className="text-dark-muted text-sm mt-1 mb-6">
            {filters.search || filters.status
              ? 'Try adjusting your filters'
              : 'Upload your first consultation recording to get started'}
          </p>
          <Link to="/upload" className="btn-primary">
            <UploadCloud className="w-4 h-4" />
            Upload Recording
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {consultations.map((c, i) => (
            <RecordingCard
              key={c._id}
              consultation={c}
              onDelete={setDeleteId}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onChange={setPage}
        />
      )}

      {/* Delete modal */}
      <ConfirmModal
        open={!!deleteId}
        title="Delete Consultation"
        message="This will permanently delete the consultation and its recording. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
