const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: ["https://list-launchr.vercel.app", "http://localhost:5173"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Special handling for Stripe webhooks
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    // Raw body for Stripe webhooks
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk.toString();
    });
    req.on('end', () => {
      req.rawBody = rawBody;
      next();
    });
  } else {
    // JSON body parsing for all other routes
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

// Static files for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ListLaunchr API' });
});

// Connect to MongoDB and set up routes
(async () => {
  try {
    // Connect to MongoDB
    const isConnected = await connectDB();
    
    // Health check route
    app.use('/api/health', (req, res) => {
      res.json({ 
        status: 'API is running', 
        dbConnected: isConnected 
      });
    });
    
    if (isConnected) {
      // API Routes
      app.use('/api/auth', require('./routes/auth'));
      app.use('/api/campaigns', require('./routes/campaigns'));
      app.use('/api/entries', require('./routes/entries'));
      app.use('/api/analytics', require('./routes/analytics'));
      app.use('/api/uploads', require('./routes/uploads'));
      app.use('/api/integrations', require('./routes/integrations'));
      app.use('/api/stripe', require('./routes/stripe'));
    } else {
      // Default response for all API routes if DB is not connected
      app.use('/api/auth', (req, res) => {
        res.status(503).json({
          success: false,
          message: 'Database connection not available. Please install MongoDB or update the connection string.'
        });
      });
      
      app.use('/api/campaigns', (req, res) => {
        res.status(503).json({
          success: false,
          message: 'Database connection not available. Please install MongoDB or update the connection string.'
        });
      });
      
      app.use('/api/entries', (req, res) => {
        res.status(503).json({
          success: false,
          message: 'Database connection not available. Please install MongoDB or update the connection string.'
        });
      });
      
      app.use('/api/analytics', (req, res) => {
        res.status(503).json({
          success: false,
          message: 'Database connection not available. Please install MongoDB or update the connection string.'
        });
      });
      
      app.use('/api/uploads', (req, res) => {
        res.status(503).json({
          success: false,
          message: 'Database connection not available. Please install MongoDB or update the connection string.'
        });
      });
      
      app.use('/api/integrations', (req, res) => {
        res.status(503).json({
          success: false,
          message: 'Database connection not available. Please install MongoDB or update the connection string.'
        });
      });
      
      app.use('/api/stripe', (req, res) => {
        res.status(503).json({
          success: false,
          message: 'Database connection not available. Please install MongoDB or update the connection string.'
        });
      });
    }
    
    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        message: err.message || 'Something went wrong on the server',
        error: process.env.NODE_ENV === 'development' ? err : {}
      });
    });
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();