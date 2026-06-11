import { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Download,
  SkipBack, SkipForward, Maximize2
} from 'lucide-react';
import { formatDuration } from '../utils/format';

export default function AudioVideoPlayer({ src, mimeType, fileName }) {
  const mediaRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);

  const isVideo = mimeType?.startsWith('video');

  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;

    const onLoaded = () => { setDuration(el.duration || 0); setLoading(false); };
    const onTime = () => setCurrentTime(el.currentTime);
    const onEnded = () => setPlaying(false);

    el.addEventListener('loadedmetadata', onLoaded);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('loadedmetadata', onLoaded);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const el = mediaRef.current;
    if (!el) return;
    if (playing) { el.pause(); } else { el.play(); }
    setPlaying(!playing);
  };

  const seek = (e) => {
    const el = mediaRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    el.currentTime = pct * duration;
  };

  const skip = (secs) => {
    const el = mediaRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(duration, el.currentTime + secs));
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (mediaRef.current) mediaRef.current.volume = val;
    setMuted(val === 0);
  };

  const toggleMute = () => {
    const el = mediaRef.current;
    if (!el) return;
    el.muted = !muted;
    setMuted(!muted);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-dark-bg rounded-2xl overflow-hidden border border-dark-border">
      {/* Video element */}
      {isVideo ? (
        <video
          ref={mediaRef}
          src={src}
          className="w-full max-h-80 bg-black"
          preload="metadata"
        />
      ) : (
        <audio ref={mediaRef} src={src} preload="metadata" />
      )}

      {/* Controls */}
      <div className="p-4 space-y-3">
        {/* Progress bar */}
        <div
          className="relative h-2 bg-dark-border rounded-full cursor-pointer group"
          onClick={seek}
          id="player-progress-bar"
        >
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Time */}
        <div className="flex justify-between text-xs text-dark-muted font-mono">
          <span>{formatDuration(currentTime)}</span>
          <span>{loading ? '—' : formatDuration(duration)}</span>
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-3">
          {/* Skip back */}
          <button
            onClick={() => skip(-10)}
            className="p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-white/5 transition-all"
            id="skip-back-btn"
            title="Skip back 10s"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            disabled={loading}
            className="w-11 h-11 bg-primary-600 hover:bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary-900/40 transition-all active:scale-95 disabled:opacity-50"
            id="play-pause-btn"
          >
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Skip forward */}
          <button
            onClick={() => skip(10)}
            className="p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-white/5 transition-all"
            id="skip-forward-btn"
            title="Skip forward 10s"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2 ml-2">
            <button onClick={toggleMute} className="text-dark-muted hover:text-dark-text transition-colors">
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="w-20 h-1.5 accent-primary-500 cursor-pointer"
            />
          </div>

          {/* Download */}
          <a
            href={src}
            download={fileName || 'recording'}
            className="ml-auto p-2 rounded-xl text-dark-muted hover:text-accent-400 hover:bg-accent-500/10 transition-all"
            id="download-recording-btn"
            title="Download recording"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
