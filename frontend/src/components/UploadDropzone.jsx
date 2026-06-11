import { useState, useCallback } from 'react';
import { UploadCloud, FileAudio, FileVideo, X, CheckCircle } from 'lucide-react';
import { formatFileSize } from '../utils/format';

export default function UploadDropzone({ file, setFile }) {
  const [dragOver, setDragOver] = useState(false);

  const processFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith('audio') && !f.type.startsWith('video')) {
      alert('Only audio and video files are supported.');
      return;
    }
    setFile(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    processFile(dropped);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);

  const onFileChange = (e) => processFile(e.target.files[0]);

  const isVideo = file?.type?.startsWith('video');
  const isAudio = file?.type?.startsWith('audio');

  return (
    <div>
      {!file ? (
        <label
          id="upload-dropzone"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
            ${dragOver
              ? 'border-primary-500 bg-primary-600/10 scale-[1.01]'
              : 'border-dark-border hover:border-primary-600/50 hover:bg-primary-600/5 bg-dark-bg'
            }`}
        >
          <input
            type="file"
            accept="audio/*,video/*"
            className="sr-only"
            onChange={onFileChange}
            id="file-input"
          />
          <UploadCloud className={`w-10 h-10 mb-3 transition-colors ${dragOver ? 'text-primary-400' : 'text-dark-muted'}`} />
          <p className="text-sm font-medium text-dark-text">
            Drag & drop or <span className="text-primary-400">browse files</span>
          </p>
          <p className="text-xs text-dark-muted mt-1">Supports MP3, MP4, WAV, MOV, M4A — Max 500MB</p>
        </label>
      ) : (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-dark-bg border border-accent-500/30">
          <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center shrink-0">
            {isVideo
              ? <FileVideo className="w-6 h-6 text-accent-400" />
              : <FileAudio className="w-6 h-6 text-accent-400" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-dark-text truncate">{file.name}</p>
            <p className="text-xs text-dark-muted mt-0.5">
              {formatFileSize(file.size)} · {file.type}
            </p>
          </div>
          <CheckCircle className="w-5 h-5 text-accent-400 shrink-0" />
          <button
            type="button"
            onClick={() => setFile(null)}
            className="p-1.5 rounded-lg text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
            id="remove-file-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
