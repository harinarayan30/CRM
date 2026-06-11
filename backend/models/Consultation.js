const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      maxlength: [100, 'Client name cannot exceed 100 characters'],
    },
    recordingUrl: {
      type: String,
      default: null,
    },
    originalFileName: {
      type: String,
      default: null,
    },
    mimeType: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    consultationDate: {
      type: Date,
      required: [true, 'Consultation date is required'],
    },
    notes: {
      type: String,
      default: '',
      maxlength: [10000, 'Notes cannot exceed 10,000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'archived'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Text index for full-text search
consultationSchema.index({ title: 'text', clientName: 'text', notes: 'text' });
consultationSchema.index({ createdBy: 1, consultationDate: -1 });

module.exports = mongoose.model('Consultation', consultationSchema);
