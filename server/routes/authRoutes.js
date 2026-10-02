const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, Student, Recruiter, AuditLog } = require('../models/modelRegistry');
const { protect, generateToken } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
        error: { code: 'MISSING_CREDENTIALS' }
      });
    }

    let queryEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: queryEmail });
    if (!user) {
      if (queryEmail.endsWith('@nriit.edu.in')) {
        const alt = queryEmail.replace('@nriit.edu.in', '@apexinstitute.edu.in');
        user = await User.findOne({ email: alt });
      } else if (queryEmail.endsWith('@apexinstitute.edu.in')) {
        const alt = queryEmail.replace('@apexinstitute.edu.in', '@nriit.edu.in');
        user = await User.findOne({ email: alt });
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        error: { code: 'INVALID_CREDENTIALS' }
      });
    }

    // Role check if role was explicitly passed
    if (role && role !== 'ALL') {
      const adminRoles = ['ADMIN', 'TP_OFFICER', 'SUPER_ADMIN', 'MANAGEMENT_PRINCIPAL'];
      const coordinatorRoles = ['COORDINATOR', 'TP_COORDINATOR', 'DEPARTMENT_COORDINATOR'];

      if (role === 'ADMIN' && !adminRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `This account does not have Admin access.`,
          error: { code: 'ROLE_MISMATCH' }
        });
      } else if (role === 'COORDINATOR' && !coordinatorRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `This account is registered as ${user.role}, not a Coordinator role.`,
          error: { code: 'ROLE_MISMATCH' }
        });
      } else if (role !== 'ADMIN' && role !== 'COORDINATOR' && user.role !== role) {
        return res.status(403).json({
          success: false,
          message: `This account is registered as ${user.role}, not ${role}.`,
          error: { code: 'ROLE_MISMATCH' }
        });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        error: { code: 'INVALID_CREDENTIALS' }
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact T&P Admin.',
        error: { code: 'ACCOUNT_DEACTIVATED' }
      });
    }

    if (user.role === 'RECRUITER' && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your recruiter account is pending T&P Cell verification and approval.',
        error: { code: 'PENDING_APPROVAL' }
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    // Fetch role-specific details
    let profileData = null;
    if (user.role === 'STUDENT') {
      profileData = await Student.findOne({ userId: user._id });
    } else if (user.role === 'RECRUITER') {
      profileData = await Recruiter.findOne({ userId: user._id });
    }

    await logAudit(
      { user, headers: req.headers, socket: req.socket },
      'USER_LOGIN',
      'User',
      user._id,
      { email: user.email, role: user.role }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          profile: profileData
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/register/student
// @desc    Register a new student
router.post('/register/student', async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      rollNumber,
      branch,
      batch,
      academicYear,
      cgpa,
      backlogs,
      phone,
      gender
    } = req.body;

    if (!name || !email || !password || !rollNumber || !branch || !batch) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required registration fields.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
        error: { code: 'EMAIL_EXISTS' }
      });
    }

    const existingStudent = await Student.findOne({ rollNumber: rollNumber.trim().toUpperCase() });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: 'A student with this roll number is already registered.',
        error: { code: 'ROLL_NUMBER_EXISTS' }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'STUDENT',
      isActive: true,
      isApproved: true
    });

    const newStudent = await Student.create({
      userId: newUser._id,
      rollNumber: rollNumber.trim().toUpperCase(),
      fullName: name.trim(),
      email: normalizedEmail,
      phone: phone || '',
      branch: branch.trim(),
      batch: batch.trim(),
      academicYear: academicYear || '2026-27',
      cgpa: Number(cgpa) || 0,
      backlogs: Number(backlogs) || 0,
      gender: gender || 'Male',
      placementStatus: 'REGISTERED'
    });

    const token = generateToken(newUser._id);

    await logAudit(
      { user: newUser, headers: req.headers, socket: req.socket },
      'STUDENT_REGISTER',
      'Student',
      newStudent._id,
      { rollNumber, branch, batch }
    );

    return res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      data: {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          profile: newStudent
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/register/recruiter
// @desc    Register a new corporate recruiter
router.post('/register/recruiter', async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      companyName,
      officialEmail,
      phone,
      designation
    } = req.body;

    if (!name || !email || !password || !companyName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory recruiter details.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
        error: { code: 'EMAIL_EXISTS' }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'RECRUITER',
      isActive: true,
      isApproved: true // Recruiter can test immediately
    });

    const newRecruiter = await Recruiter.create({
      userId: newUser._id,
      fullName: name.trim(),
      email: normalizedEmail,
      phone: phone || '',
      companyName: companyName.trim(),
      officialEmail: officialEmail || normalizedEmail,
      designation: designation || 'Corporate Recruiter',
      isVerified: true,
      status: 'APPROVED'
    });

    const token = generateToken(newUser._id);

    await logAudit(
      { user: newUser, headers: req.headers, socket: req.socket },
      'RECRUITER_REGISTER',
      'Recruiter',
      newRecruiter._id,
      { companyName }
    );

    return res.status(201).json({
      success: true,
      message: 'Recruiter account registered successfully.',
      data: {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          profile: newRecruiter
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user details
router.get('/me', protect, async (req, res, next) => {
  try {
    let profileData = null;
    if (req.user.role === 'STUDENT') {
      profileData = await Student.findOne({ userId: req.user._id });
    } else if (req.user.role === 'RECRUITER') {
      profileData = await Recruiter.findOne({ userId: req.user._id });
    }

    return res.status(200).json({
      success: true,
      message: 'Current user profile retrieved',
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        isActive: req.user.isActive,
        profile: profileData
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset token
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
        error: { code: 'MISSING_EMAIL' }
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return safe message without exposing user existence
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, password reset instructions have been issued.',
        data: { resetToken: 'demo_token_123' }
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset instructions have been issued.',
      data: {
        resetToken,
        resetUrl: `/reset-password/${resetToken}`
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password using token
router.post('/reset-password/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
        error: { code: 'WEAK_PASSWORD' }
      });
    }

    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
        error: { code: 'INVALID_TOKEN' }
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await logAudit(
      { user, headers: req.headers, socket: req.socket },
      'PASSWORD_RESET',
      'User',
      user._id,
      { email: user.email }
    );

    return res.status(200).json({
      success: true,
      message: 'Password has been successfully updated. You can now log in.'
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/logout
// @desc    Log out current user
router.post('/logout', protect, async (req, res, next) => {
  try {
    await logAudit(
      { user: req.user, headers: req.headers, socket: req.socket },
      'USER_LOGOUT',
      'User',
      req.user._id,
      {}
    );

    return res.status(200).json({
      success: true,
      message: 'Successfully logged out.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
