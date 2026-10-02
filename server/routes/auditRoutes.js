const express = require('express');
const router = express.Router();
const { AuditLog } = require('../models/modelRegistry');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/audit-logs
// @desc    Admin view audit log trail
router.get('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { action, targetModel, search, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (action && action !== 'ALL') filter.action = action;
    if (targetModel && targetModel !== 'ALL') filter.targetModel = targetModel;

    let logs = await AuditLog.find(filter);

    if (search) {
      const q = search.toLowerCase().trim();
      logs = logs.filter(l =>
        l.action.toLowerCase().includes(q) ||
        (l.performedBy?.name && l.performedBy.name.toLowerCase().includes(q)) ||
        (l.performedBy?.email && l.performedBy.email.toLowerCase().includes(q)) ||
        (l.targetModel && l.targetModel.toLowerCase().includes(q))
      );
    }

    logs.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    const total = logs.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = logs.slice(startIndex, startIndex + Number(limit));

    return res.status(200).json({
      success: true,
      message: 'Audit logs retrieved',
      data: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        logs: paginated
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
