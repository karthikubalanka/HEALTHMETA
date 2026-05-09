# React + Express Integration Demo

A complete example of connecting a React frontend with a Node.js Express backend, featuring CORS configuration, axios integration, and comprehensive error handling.

## 🚀 Features

- **React Frontend** with modern hooks and state management
- **Express Backend** with RESTful API endpoints
- **CORS Configuration** for seamless frontend-backend communication
- **Axios Integration** with interceptors and error handling
- **JSON Data Exchange** between frontend and backend
- **Comprehensive Error Handling** on both sides
- **Responsive Design** with modern CSS

## 📁 Project Structure

```
├── backend/
│   ├── server.js          # Express server with API endpoints
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styling
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── package.json       # Frontend dependencies
│   └── env.example        # Environment variables
└── README.md              # This file
```

## 🛠️ Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the backend server:**
```bash
npm start
# or for development with auto-restart
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the React development server:**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🔧 API Endpoints

### Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/hello` | Hello message endpoint |
| `GET` | `/api/data` | Fetch all data (with pagination) |
| `POST` | `/api/data` | Create new data entry |
| `PUT` | `/api/data/:id` | Update existing data |
| `DELETE` | `/api/data/:id` | Delete data entry |

### Example API Calls

```javascript
// GET request
const response = await axios.get('/api/hello?name=John');

// POST request
const response = await axios.post('/api/data', {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

// PUT request
const response = await axios.put('/api/data/1', {
  name: 'John Updated',
  age: 31
});

// DELETE request
const response = await axios.delete('/api/data/1');
```

## 🔒 CORS Configuration

The backend is configured with CORS to allow the React frontend to make requests:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

## 📡 Axios Configuration

The frontend uses axios with interceptors for request/response handling:

```javascript
// Request interceptor
axios.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Success`);
    return response;
  },
  (error) => {
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - Error:`, error.message);
    return Promise.reject(error);
  }
);
```

## 🎨 Frontend Features

### State Management
- **Loading States** - Visual feedback during API calls
- **Error Handling** - User-friendly error messages
- **Success Messages** - Confirmation of successful operations
- **Form Management** - Controlled inputs with validation

### UI Components
- **Responsive Design** - Works on desktop and mobile
- **Modern Styling** - Gradient backgrounds and smooth animations
- **Interactive Elements** - Hover effects and transitions
- **Data Display** - Clean presentation of fetched data

## 🛡️ Error Handling

### Backend Error Handling
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal server error',
    message: err.message || 'Something went wrong on the server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

### Frontend Error Handling
```javascript
// Centralized error handling
const handleError = (error, defaultMessage) => {
  let errorMessage = defaultMessage;
  
  if (error.response) {
    // Server responded with error status
    errorMessage = error.response.data?.message || error.response.data?.error || defaultMessage;
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'Network error: Unable to connect to server';
  } else {
    // Something else happened
    errorMessage = error.message || defaultMessage;
  }
  
  setError(errorMessage);
  setSuccess(null);
};
```

## 📊 JSON Data Exchange

All communication between frontend and backend uses JSON:

### Request Format
```javascript
// POST request body
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

### Response Format
```javascript
// Success response
{
  "success": true,
  "message": "Data created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}

// Error response
{
  "success": false,
  "error": "Validation error",
  "message": "Name and email are required fields"
}
```

## 🚀 Usage Examples

### 1. Fetch Hello Message
```javascript
const fetchHello = async () => {
  try {
    const response = await axios.get('/api/hello', {
      params: { name: 'React User' }
    });
    
    if (response.data.success) {
      setHelloMessage(response.data.message);
    }
  } catch (error) {
    handleError(error, 'Failed to get hello message');
  }
};
```

### 2. Create New Data
```javascript
const createData = async (formData) => {
  try {
    const response = await axios.post('/api/data', formData);
    
    if (response.data.success) {
      setSuccess(`Data created successfully! ID: ${response.data.data.id}`);
      fetchData(); // Refresh data list
    }
  } catch (error) {
    handleError(error, 'Failed to create data');
  }
};
```

### 3. Update Data
```javascript
const updateData = async (id, updatedData) => {
  try {
    const response = await axios.put(`/api/data/${id}`, updatedData);
    
    if (response.data.success) {
      setSuccess('Data updated successfully!');
      fetchData(); // Refresh data list
    }
  } catch (error) {
    handleError(error, 'Failed to update data');
  }
};
```

## 🔧 Environment Variables

### Backend (.env)
```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000/api
GENERATE_SOURCEMAP=false
```

## 🧪 Testing the Integration

1. **Start both servers:**
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

2. **Test the endpoints:**
   - Click "Get Hello Message" button
   - Fill out the form and click "Create Data"
   - View the data list and test update/delete operations

3. **Check browser console:**
   - See axios request/response logs
   - Monitor network requests in DevTools

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure backend is running on port 5000
   - Check CORS configuration in server.js
   - Verify frontend URL in CORS settings

2. **Network Errors:**
   - Check if backend server is running
   - Verify API_BASE_URL in frontend
   - Check firewall/antivirus settings

3. **Data Not Loading:**
   - Check browser console for errors
   - Verify API endpoints are working
   - Check network tab in DevTools

### Debug Tips

1. **Enable detailed logging:**
   ```javascript
   // In backend server.js
   console.log('Request received:', req.method, req.url);
   ```

2. **Check axios configuration:**
   ```javascript
   // In frontend App.js
   console.log('API Base URL:', API_BASE_URL);
   ```

3. **Test endpoints directly:**
   ```bash
   curl http://localhost:5000/api/health
   curl http://localhost:5000/api/hello?name=Test
   ```

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Update CORS origin to production URL
3. Use process manager like PM2
4. Set up reverse proxy with Nginx

### Frontend Deployment
1. Build the React app: `npm run build`
2. Serve static files with Nginx or CDN
3. Update API_BASE_URL to production backend
4. Configure environment variables

## 📝 License

MIT License - feel free to use this code for your projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Coding!** 🎉 This integration demonstrates best practices for connecting React frontends with Express backends.