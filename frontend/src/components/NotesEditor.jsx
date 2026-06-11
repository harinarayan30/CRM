import { useState } from 'react';
import { Pencil, Save, X, FileText } from 'lucide-react';

export default function NotesEditor({ notes, onSave, readOnly = false }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(value);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setValue(notes || '');
    setEditing(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary-400" />
          <h3 className="font-semibold text-dark-text">Consultation Notes</h3>
        </div>
        {!readOnly && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="btn-secondary text-xs py-1.5 px-3"
            id="edit-notes-btn"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
        {editing && (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary text-xs py-1.5 px-3"
              id="save-notes-btn"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary text-xs py-1.5 px-3"
              id="cancel-notes-btn"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={8}
          placeholder="Add your consultation notes here..."
          className="input resize-y min-h-[160px] font-mono text-sm leading-relaxed"
          id="notes-textarea"
          autoFocus
        />
      ) : (
        <div
          className={`min-h-[120px] p-4 rounded-xl bg-dark-bg border border-dark-border text-sm leading-relaxed
            ${value ? 'text-dark-text' : 'text-dark-muted italic'}`}
        >
          {value || 'No notes added yet. Click Edit to add notes.'}
        </div>
      )}
    </div>
  );
}
