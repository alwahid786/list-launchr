const express = require('express');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');
const upload = require('../utils/fileUpload');

const router = express.Router();

// Helper function to handle file upload errors
const handleUploadErrors = (err, req, res, next) => {
  if (err) {
    // Clean up any uploaded files if an error occurs
    if (req.file) {
      fs.unlink(req.file.path, () => {
        console.log(`Cleaned up file: ${req.file.path}`);
      });
    }
    
    // Handle multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size limit exceeded (5MB maximum)'
      });
    }
    
    // Handle other errors
    return res.status(400).json({
      success: false,
      message: err.message || 'An error occurred during file upload'
    });
  }
  
  next();
};

// @desc    Upload file
// @route   POST /api/uploads
// @access  Private
router.post('/', protect, (req, res, next) => {
  // Apply upload middleware with error handling
  upload.single('file')(req, res, (err) => {
    // If error from multer, handle it
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      });
    }
    
    // Continue to the route handler if no error
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }
    
    // Verify that the file is an image by checking mime type
    if (!req.file.mimetype.startsWith('image/')) {
      // Remove the file if it's not an image
      fs.unlink(req.file.path, () => {});
      
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed'
      });
    }
    
    // Create the file URL
    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Get file size in KB for response
    const fileSizeInKB = Math.round(req.file.size / 1024);
    
    res.status(200).json({
      success: true,
      data: {
        fileName: req.file.filename,
        fileUrl,
        fileSize: fileSizeInKB,
        mimeType: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up the file if it exists
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    
    res.status(500).json({
      success: false,
      message: 'File upload failed due to server error'
    });
  }
});

// @desc    Delete uploaded file
// @route   DELETE /api/uploads/:filename
// @access  Private
router.delete('/:filename', protect, async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Prevent path traversal attacks
    const sanitizedFilename = path.basename(filename);
    
    // Full path to the file
    const filePath = path.join(__dirname, '../uploads', sanitizedFilename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
});

module.exports = router;