const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, Student, Recruiter } = require('../models/modelRegistry');
const { protect, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/users
// @desc    Admin list all users with role and status filtering
router.get('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { role, search, status } = req.query;
    const filter = {};
    if (role && role !== 'ALL') filter.role = role;
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    let users = await User.find(filter);

    if (search) {
      const q = search.toLowerCase().trim();
      users = users.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    }

    const safeUsers = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      isActive: u.isActive,
      isApproved: u.isApproved,
      lastLogin: u.lastLogin,
      createdAt: u.createdAt
    }));

    return res.status(200).json({
      success: true,
      message: 'Users retrieved',
      data: safeUsers
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/users
// @desc    Admin create new user
router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists.',
        error: { code: 'EMAIL_EXISTS' }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      isActive: true,
      isApproved: true
    });

    await logAudit(req, 'CREATE_USER', 'User', user._id, { email: user.email, role: user.role });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/users/:id/role
// @desc    Admin update user role
router.patch('/:id/role', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['STUDENT', 'RECRUITER', 'COORDINATOR', 'ADMIN', 'TP_OFFICER', 'SUPER_ADMIN'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${validRoles.join(', ')}`,
        error: { code: 'INVALID_ROLE' }
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    user.role = role;
    await user.save();

    await logAudit(req, 'CHANGE_USER_ROLE', 'User', user._id, { newRole: role });

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: { _id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/users/:id/status
// @desc    Admin activate or deactivate user
router.patch('/:id/status', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    user.isActive = !!isActive;
    await user.save();

    await logAudit(req, 'TOGGLE_USER_STATUS', 'User', user._id, { isActive: user.isActive });

    return res.status(200).json({
      success: true,
      message: `User status set to ${user.isActive ? 'Active' : 'Inactive'}`,
      data: { _id: user._id, email: user.email, isActive: user.isActive }
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/users/:id
// @desc    Admin delete user
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await User.findByIdAndDelete(user._id);
    // Also clean up linked student or recruiter records
    await Student.deleteMany({ userId: user._id });
    await Recruiter.deleteMany({ userId: user._id });

    await logAudit(req, 'DELETE_USER', 'User', user._id, { email: user.email });

    return res.status(200).json({
      success: true,
      message: 'User and linked records successfully removed.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
