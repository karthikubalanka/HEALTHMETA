const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('.'));

// Sample data store (in-memory)
let sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'HealthMate Backend is running!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// GET /api/hello - Sample GET endpoint
app.get('/api/hello', (req, res) => {
  try {
    const { name } = req.query;
    
    const response = {
      success: true,
      message: name ? `Hello, ${name}! Welcome to HealthMate!` : 'Hello from HealthMate Backend!',
      timestamp: new Date().toISOString(),
      data: {
        server: 'HealthMate Express.js',
        version: '1.0.0',
        environment: 'development'
      }
    };

    res.json(response);
  } catch (error) {
    console.error('GET /api/hello error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process hello request'
    });
  }
});

// POST /api/data - Sample POST endpoint
app.post('/api/data', (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Name and email are required fields'
      });
    }

    // Create new data entry
    const newEntry = {
      id: sampleData.length + 1,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      age: age || null,
      createdAt: new Date().toISOString()
    };

    // Add to sample data
    sampleData.push(newEntry);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Data created successfully',
      data: newEntry,
      totalRecords: sampleData.length
    });

  } catch (error) {
    console.error('POST /api/data error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create data entry'
    });
  }
});

// GET /api/data - Get all data
app.get('/api/data', (req, res) => {
  try {
    res.json({
      success: true,
      data: sampleData,
      totalRecords: sampleData.length
    });
  } catch (error) {
    console.error('GET /api/data error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch data'
    });
  }
});

// Chat endpoint for HealthMate
app.post('/api/chat', (req, res) => {
  try {
    const { message, session_id, user_id, language = 'en' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing message',
        message: 'Message is required'
      });
    }

    // Simple response logic
    let response = '';
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('covid') || lowerMessage.includes('coronavirus')) {
      response = `**COVID-19 Information**\n\n**Symptoms:** Fever, cough, shortness of breath, fatigue, body aches, loss of taste or smell\n\n**Prevention:** Wear masks, wash hands frequently, maintain social distance, get vaccinated, avoid crowded places\n\n**Description:** COVID-19 is a respiratory illness caused by the SARS-CoV-2 virus.`;
    } else if (lowerMessage.includes('flu') || lowerMessage.includes('influenza')) {
      response = `**Influenza (Flu) Information**\n\n**Symptoms:** Fever, cough, sore throat, runny nose, body aches, headache, fatigue\n\n**Prevention:** Annual flu vaccine, wash hands frequently, avoid close contact with sick people\n\n**Description:** Influenza is a viral infection that attacks the respiratory system.`;
    } else if (lowerMessage.includes('vaccine') || lowerMessage.includes('vaccination')) {
      response = `**Vaccination Information**\n\nVaccination is one of the most effective ways to prevent many diseases. I recommend consulting with a healthcare provider about available vaccines for your age group and health condition.\n\n**General Tips:**\n• Follow recommended vaccination schedules\n• Keep vaccination records up to date\n• Consult healthcare providers for travel vaccines`;
    } else if (lowerMessage.includes('symptom')) {
      response = `**General Health Symptoms**\n\nCommon symptoms to watch for:\n• Fever or chills\n• Cough or shortness of breath\n• Fatigue or body aches\n• Headache or sore throat\n• Nausea or vomiting\n\n**When to seek medical attention:**\n• Severe symptoms\n• Difficulty breathing\n• Persistent high fever\n• Emergency situations`;
    } else {
      response = `Hello! I'm HealthMate, your AI health assistant. I can help you with information about diseases, prevention tips, vaccination schedules, and general health advice.\n\n**What I can help with:**\n• Disease information and symptoms\n• Prevention strategies\n• Vaccination schedules\n• General health tips\n\nWhat would you like to know?`;
    }

    res.json({
      success: true,
      response: response,
      intent: 'general',
      entities: [],
      confidence: 0.8,
      suggestions: [
        'Tell me about COVID-19 symptoms',
        'How to prevent flu?',
        'Vaccination schedule',
        'General health tips'
      ],
      session_id: session_id || 'default',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Chat processing failed',
      message: 'Sorry, I encountered an error processing your request. Please try again.'
    });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'Something went wrong on the server'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HealthMate Backend running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend available at http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;


