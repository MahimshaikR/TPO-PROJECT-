const { AuditLog } = require('../models/modelRegistry');

const logAudit = async (req, action, targetModel = '', targetId = '', details = {}) => {
  try {
    const performedBy = req.user ? {
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    } : {
      userId: 'ANONYMOUS',
      name: 'Guest/System',
      email: '',
      role: 'GUEST'
    };

    const ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

    await AuditLog.create({
      action,
      performedBy,
      targetModel,
      targetId: String(targetId || ''),
      ipAddress,
      details,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
};

module.exports = {
  logAudit
};
