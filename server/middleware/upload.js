const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const resumesDir = path.join(__dirname, '..', '..', 'uploads', 'resumes');
const documentsDir = path.join(__dirname, '..', '..', 'uploads', 'documents');

[resumesDir, documentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      cb(null, resumesDir);
    } else {
      cb(null, documentsDir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanExt = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.pdf';
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${cleanExt}`);
  }
});

// Security file filter
const fileFilter = (req, file, cb) => {
  const allowedResumeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const allowedDocTypes = [
    ...allowedResumeTypes,
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (file.fieldname === 'resume') {
    if (allowedResumeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid resume format. Only PDF, DOC, and DOCX files are permitted.'), false);
    }
  } else {
    if (allowedDocTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Allowed types: PDF, DOC, DOCX, JPG, PNG, WEBP.'), false);
    }
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10) // 5MB limit
  },
  fileFilter
});

module.exports = upload;
