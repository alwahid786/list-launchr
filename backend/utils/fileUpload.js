const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Helper to sanitize filenames
const sanitizeFilename = (filename) => {
  // Remove any path components (no directories in filenames)
  filename = path.basename(filename);
  
  // Replace spaces with hyphens and remove special characters
  filename = filename
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^\w\-\.]/g, '')      // Remove all non-word chars except hyphens and periods
    .replace(/\-\-+/g, '-')         // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')             // Trim hyphens from start
    .replace(/-+$/, '');            // Trim hyphens from end
    
  return filename;
};

// Generate a secure filename
const generateSecureFilename = (originalname) => {
  // Get file extension
  const ext = path.extname(originalname).toLowerCase();
  
  // Generate random string
  const randomStr = crypto.randomBytes(16).toString('hex');
  
  // Get timestamp
  const timestamp = Date.now();
  
  // Sanitize original filename (without extension)
  const filenameSanitized = sanitizeFilename(
    path.basename(originalname, ext).substring(0, 40)
  );
  
  // Construct the new filename: sanitized-name-timestamp-randomstring.ext
  return `${filenameSanitized}-${timestamp}-${randomStr}${ext}`;
};

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, generateSecureFilename(file.originalname));
  }
});

// Restrict file types to known image formats
const fileFilter = (req, file, cb) => {
  // Allowed MIME types
  const allowedMimeTypes = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/gif', 
    'image/webp'
  ];
  
  // Check MIME type
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed.'), false);
  }

  // Check file extension
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (!extname) {
    return cb(new Error('File extension not allowed.'), false);
  }
  
  // All good, accept the file
  cb(null, true);
};

// Initialize upload with security settings
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1 // Only allow one file per request
  },
  fileFilter: fileFilter
});

module.exports = upload;