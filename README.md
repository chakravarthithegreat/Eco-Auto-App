# Eco-Auto App - Employee Management System

A modern employee management system built with React, Vite, and Netlify Functions.

## 🚀 Features

- **Employee Management**: Add, edit, and manage employee information
- **Attendance Tracking**: Real-time attendance monitoring with check-in/check-out
- **Task Management**: Assign and track tasks with progress monitoring
- **Dashboard Analytics**: Real-time insights and performance metrics
- **Leave Management**: Request and approve leave applications
- **Payroll Overview**: Basic payroll information and summaries
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Netlify Functions (Serverless)
- **Database**: MongoDB Atlas
- **State Management**: Zustand
- **UI Components**: Lucide React Icons, Framer Motion
- **Charts**: Recharts
- **Routing**: React Router DOM

## 📦 Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── layouts/        # Layout components
│   ├── services/       # API services
│   ├── state/          # Zustand stores
│   ├── utils/          # Utility functions
│   └── main.jsx        # App entry point
├── netlify/
│   └── functions/
│       └── api.js      # Serverless API functions
├── public/             # Static assets
├── netlify.toml        # Netlify configuration
└── package.json
```

## 🚀 Deployment

This project is configured for **Netlify deployment** with serverless functions.

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Netlify account

### Environment Variables

Set these in your Netlify dashboard:

```bash
MONGODB_URI=your_mongodb_atlas_connection_string
NODE_ENV=production
```

### Deploy to Netlify

1. **Connect Repository**
   - Connect your GitHub repository to Netlify
   - Set build directory to `frontend`

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Deploy**
   - Netlify will automatically build and deploy your app
   - Functions will be available at `/.netlify/functions/api`

## 🏃‍♂️ Local Development

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📡 API Endpoints

All API endpoints are handled by Netlify Functions:

- `GET /api/health` - Health check
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance record
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `POST /api/auth/login` - User authentication
- `GET /api/dashboard/hours` - Dashboard hours data
- `GET /api/dashboard/team-split` - Team distribution data

## 🔧 Configuration

### Netlify Functions

The API is implemented as serverless functions in `netlify/functions/api.js`:

- Handles all `/api/*` routes
- Connects to MongoDB Atlas
- Implements authentication
- Manages all CRUD operations

### Database Schema

- **Employees**: Personal info, contact details, employment data
- **Attendance**: Check-in/out times, locations, status
- **Tasks**: Task details, assignments, progress tracking
- **Leaves**: Leave requests and approvals
- **EmployeeAuth**: Authentication credentials

## 📱 PWA Features

- Service Worker for offline functionality
- App manifest for mobile installation
- Push notifications support
- Offline data caching

## 🎨 UI/UX Features

- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer Motion transitions
- **Toast Notifications**: User feedback system
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: Graceful error boundaries

## 🔒 Security

- CORS enabled for API endpoints
- Input validation and sanitization
- Rate limiting on API functions
- Secure MongoDB connection
- Environment variable protection

## 📊 Performance

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format support
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Static asset caching strategies
- **CDN**: Netlify's global CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

**Built with ❤️ for modern employee management**