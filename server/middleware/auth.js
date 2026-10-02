const jwt = require('jsonwebtoken');
const { User } = require('../models/modelRegistry');

const JWT_SECRET = process.env.JWT_SECRET || 'tpo_connect_production_secure_jwt_key_98374289374823974';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Please log in.',
      error: { code: 'UNAUTHORIZED' }
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
        error: { code: 'USER_NOT_FOUND' }
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact T&P Admin.',
        error: { code: 'ACCOUNT_INACTIVE' }
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.',
      error: { code: 'TOKEN_INVALID' }
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: { code: 'AUTH_REQUIRED' }
      });
    }

    // Institutional 7-role hierarchies:
    // 1. SUPER_ADMIN, 2. TP_OFFICER, 3. TP_COORDINATOR, 4. DEPARTMENT_COORDINATOR,
    // 5. STUDENT, 6. RECRUITER, 7. MANAGEMENT_PRINCIPAL
    const adminRoles = ['ADMIN', 'TP_OFFICER', 'SUPER_ADMIN', 'MANAGEMENT_PRINCIPAL'];
    const coordinatorRoles = ['COORDINATOR', 'TP_COORDINATOR', 'DEPARTMENT_COORDINATOR', ...adminRoles];
    const userRole = req.user.role;

    const hasPermission = roles.some(role => {
      if (role === 'ADMIN' && adminRoles.includes(userRole)) return true;
      if (role === 'COORDINATOR' && coordinatorRoles.includes(userRole)) return true;
      return role === userRole;
    });

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Role '${userRole}' is not authorized to access this route.`,
        error: { code: 'FORBIDDEN' }
      });
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (e) {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  generateToken,
  JWT_SECRET
};
