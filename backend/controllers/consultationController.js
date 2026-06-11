const path = require('path');
const fs = require('fs');
const Consultation = require('../models/Consultation');

// @desc    Get all consultations (search, filter, sort, paginate)
// @route   GET /api/consultations
// @access  Private
const getConsultations = async (req, res, next) => {
  try {
    const {
      search = '',
      status,
      dateFrom,
      dateTo,
      sort = 'newest',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { createdBy: req.user._id };

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status && ['pending', 'completed', 'archived'].includes(status)) {
      query.status = status;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.consultationDate = {};
      if (dateFrom) query.consultationDate.$gte = new Date(dateFrom);
      if (dateTo) query.consultationDate.$lte = new Date(dateTo);
    }

    // Sort
    const sortOption = sort === 'oldest' ? { consultationDate: 1 } : { consultationDate: -1 };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [consultations, total] = await Promise.all([
      Consultation.find(query).sort(sortOption).skip(skip).limit(limitNum).lean(),
      Consultation.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: consultations,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single consultation
// @route   GET /api/consultations/:id
// @access  Private
const getConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found.' });
    }

    res.json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
};

// @desc    Create consultation
// @route   POST /api/consultations
// @access  Private
const createConsultation = async (req, res, next) => {
  try {
    const { title, clientName, consultationDate, notes, status, duration } = req.body;

    const consultationData = {
      title,
      clientName,
      consultationDate,
      notes: notes || '',
      status: status || 'pending',
      duration: duration ? parseFloat(duration) : 0,
      createdBy: req.user._id,
    };

    if (req.file) {
      consultationData.recordingUrl = `/uploads/${req.file.filename}`;
      consultationData.originalFileName = req.file.originalname;
      consultationData.mimeType = req.file.mimetype;
      consultationData.fileSize = req.file.size;
    }

    const consultation = await Consultation.create(consultationData);

    res.status(201).json({
      success: true,
      message: 'Consultation created successfully.',
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update consultation
// @route   PUT /api/consultations/:id
// @access  Private
const updateConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found.' });
    }

    const { title, clientName, consultationDate, notes, status, duration } = req.body;

    if (title !== undefined) consultation.title = title;
    if (clientName !== undefined) consultation.clientName = clientName;
    if (consultationDate !== undefined) consultation.consultationDate = consultationDate;
    if (notes !== undefined) consultation.notes = notes;
    if (status !== undefined) consultation.status = status;
    if (duration !== undefined) consultation.duration = parseFloat(duration);

    // Handle new file upload
    if (req.file) {
      // Delete old file
      if (consultation.recordingUrl) {
        const oldPath = path.join(__dirname, '..', consultation.recordingUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      consultation.recordingUrl = `/uploads/${req.file.filename}`;
      consultation.originalFileName = req.file.originalname;
      consultation.mimeType = req.file.mimetype;
      consultation.fileSize = req.file.size;
    }

    await consultation.save();

    res.json({
      success: true,
      message: 'Consultation updated successfully.',
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete consultation
// @route   DELETE /api/consultations/:id
// @access  Private
const deleteConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found.' });
    }

    // Delete file from disk
    if (consultation.recordingUrl) {
      const filePath = path.join(__dirname, '..', consultation.recordingUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await consultation.deleteOne();

    res.json({ success: true, message: 'Consultation deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics summary
// @route   GET /api/consultations/analytics/summary
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalResult, statusBreakdown, monthlyData, recentConsultations] = await Promise.all([
      // Total counts and duration
      Consultation.aggregate([
        { $match: { createdBy: userId } },
        {
          $group: {
            _id: null,
            totalConsultations: { $sum: 1 },
            totalDuration: { $sum: '$duration' },
          },
        },
      ]),

      // Status breakdown
      Consultation.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // Monthly consultations (last 6 months)
      Consultation.aggregate([
        {
          $match: {
            createdBy: userId,
            consultationDate: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$consultationDate' },
              month: { $month: '$consultationDate' },
            },
            count: { $sum: 1 },
            totalDuration: { $sum: '$duration' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),

      // Recent 5 consultations
      Consultation.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title clientName consultationDate status duration')
        .lean(),
    ]);

    const stats = totalResult[0] || { totalConsultations: 0, totalDuration: 0 };

    res.json({
      success: true,
      data: {
        totalConsultations: stats.totalConsultations,
        totalDuration: stats.totalDuration,
        statusBreakdown: statusBreakdown.reduce((acc, s) => {
          acc[s._id] = s.count;
          return acc;
        }, {}),
        monthlyData,
        recentConsultations,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConsultations,
  getConsultation,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getAnalytics,
};
