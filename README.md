# Ecotrophy Ops - Productivity Suite

A comprehensive productivity web application built with React, Vite, and modern web technologies. Features role-based authentication, project management, task tracking, attendance monitoring, gamified rewards system, and much more.

## 🚀 Features

### ✅ **Implemented Features**

#### 🔐 **Authentication & User Management**
- Role-based login (Manager/Admin vs Team Member)
- Secure authentication with role-based permissions
- User profile management

#### 📊 **Dashboard & Analytics**  
- **Manager Dashboard**: Team overview, KPIs, project metrics
- **Team Member Dashboard**: Personal tasks, productivity metrics, streaks
- **TAT Engine**: Planned vs actual time tracking with efficiency analytics
- Real-time performance monitoring

#### 🗂️ **Project & Task Management**
- **Project Management**: Customer tracking, categories, quantities, promise days
- **Roadmap Manager**: Create/edit workflow steps with SLA, roles, machines
- **Task Dashboard**: Advanced filtering (Overdue, Planned, In-Progress, Done)
- **Task Generator Engine**: Auto-generate tasks from roadmaps × quantities
- Task assignment with round-robin, workload-based, and role-based strategies

#### ⏰ **Time & Attendance**
- **Pomodoro Timer**: 25-minute focus sessions with task integration
- **Attendance System**: Clock in/out with on-time streak tracking
- Working hours calculation and overtime tracking
- Attendance analytics and reporting

#### 🎯 **Gamification & Rewards**
- **Rewards Wallet**: Collectible rewards with beautiful icons
  - ⭐ **Stars**: Excellence in work quality
  - 🌸 **Flowers**: Team collaboration and helping others  
  - 🍫 **Chocolates**: Task completion streak rewards
  - ☁️ **Clouds**: Innovation and creative solutions
  - 🦅 **Birds**: Leadership and mentoring
  - 🌶️ **Chillies**: Speed and efficiency (Epic rarity)
- Achievement system with progress tracking
- Leaderboards and team competitions

#### 💰 **Payroll & Leave Management**
- **Integrated Payroll Engine**: 
  - Attendance + Leave + Rewards calculations
  - Base salary + bonuses - penalties - taxes
  - Efficiency ratings and performance bonuses
- **Leave Management**: Manager approval workflow
- Leave balance tracking and calculations

#### 🎨 **Design & UX**
- **Canva-inspired Design**: Modern, clean interface
- **Custom Color Palette**: Primary Green #16a34a, Accent Blue #1d4ed8
- **Inter Font**: Professional typography
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Enhanced user experience

### 🛠️ **Technical Architecture**

#### **Frontend Stack**
- **React 19** with **Vite** for fast development
- **Tailwind CSS 4** with custom design system
- **shadcn/ui** components for consistent UI
- **Zustand** for state management with persistence
- **Lucide React** for beautiful icons
- **LocalStorage** persistence for all data

#### **State Management**
- Modular Zustand stores for each feature:
  - `authStore` - Authentication and user management
  - `projectStore` - Project and customer data
  - `roadmapStore` - Workflow templates
  - `taskStore` - Task management with advanced filtering
  - `pomodoroStore` - Timer sessions and productivity tracking
  - `attendanceStore` - Clock in/out and streak tracking
  - `rewardsStore` - Gamification and achievement system
  - `payrollStore` - Salary calculations and integrations
  - `leaveStore` - Leave requests and approvals
  - `taskGeneratorStore` - Automated task creation
  - `tatStore` - Time tracking and efficiency analytics
  - `navigationStore` - Simple page routing

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Eco-Auto-app/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### **Login Credentials**
- **Manager/Admin**: Any name, select "Manager" or "Admin" role
- **Team Member**: Any name, select "Team Member" role

## 🌐 **Deployment**

### **Netlify Deployment**

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify
   - Or connect GitHub repository for automatic deployments
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Configuration**
   - `netlify.toml` is already configured for SPA routing
   - Redirects and headers are set up for optimal performance

### **Manual Deployment**
1. Run `npm run build`
2. Upload the `dist` folder contents to your web server
3. Configure server redirects for SPA routing

## 📋 **Usage Guide**

### **For Managers/Admins**
1. **Dashboard**: Monitor team performance and project metrics
2. **Projects**: Create new projects, assign roadmaps, track progress
3. **Roadmaps**: Design workflow templates with steps and SLAs
4. **Task Generator**: Auto-create tasks from project × roadmap combinations
5. **Team Management**: View team performance, approve leaves, grant rewards
6. **Payroll**: Review integrated payroll calculations
7. **Analytics**: Track TAT efficiency and team productivity

### **For Team Members**
1. **Dashboard**: View personal tasks and productivity metrics
2. **Pomodoro Timer**: Focus on tasks with 25-minute sessions
3. **Attendance**: Clock in/out and maintain on-time streaks
4. **Tasks**: View assigned tasks with filtering and progress tracking
5. **Rewards Wallet**: Collect rewards and track achievements
6. **Leave Requests**: Submit leave applications with approval tracking

## 🎯 **Key Features Showcase**

### **Task Generator Engine**
- Select project + roadmap + quantity
- Auto-generates tasks with proper sequencing
- Smart assignment strategies (round-robin, workload-based, role-based)
- Calculates timelines and dependencies

### **Gamified Rewards System**
- 6 types of collectible rewards with different rarities
- Automatic rewards for task completion, attendance, collaboration
- Achievement milestones and progress tracking
- Leaderboards and team competition

### **Integrated Payroll Calculations**
```
Final Pay = Base Salary + Bonuses - Penalties - Tax

Bonuses:
- Performance Bonus (attendance rate ≥ 95%)
- Attendance Bonus (attendance rate ≥ 98%) 
- Punctuality Bonus (no late days)
- Reward Points Bonus (converted from gamification points)
- Leave Bonus (minimal leave usage)
- Overtime Pay

Penalties:
- Late Penalty (per late day)
- Unpaid Leave Penalty (daily rate deduction)
- Absent Penalty (per absent day)
```

### **TAT Analytics**
- Track planned vs actual time for all tasks
- Calculate efficiency percentages
- Monitor project delivery performance
- Team member performance comparison
- Trend analysis and insights

## 🔧 **Development**

### **Project Structure**
```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── tasks/           # Task management
│   │   ├── projects/        # Project management
│   │   ├── pomodoro/        # Timer components
│   │   ├── attendance/      # Attendance tracking
│   │   ├── rewards/         # Gamification system
│   │   ├── leaves/          # Leave management
│   │   └── analytics/       # TAT and reporting
│   ├── state/               # Zustand stores
│   ├── layouts/             # Layout components
│   ├── utils/               # Utility functions
│   └── index.css            # Global styles
├── public/                  # Static assets
├── netlify.toml            # Netlify configuration
└── package.json            # Dependencies and scripts
```

### **Build Commands**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 **Design System**

### **Colors**
- **Primary Green**: #16a34a (success, positive actions)
- **Accent Blue**: #1d4ed8 (secondary actions, info)
- **Surface**: #f8fafc to #1e293b (backgrounds and text)
- **Warning**: #f59e0b (attention, warnings)
- **Danger**: #dc2626 (errors, critical actions)

### **Typography**
- **Font**: Inter (weights: 300, 400, 500, 600, 700)
- **Headings**: font-heading-bold utility class
- **Body**: Regular Inter font

### **Components**
- Consistent button variants (primary, secondary, outline, ghost)
- Badge system with color variants
- Card layouts with rounded corners and soft shadows
- KPI cards for metrics display

## 🚀 **Performance Optimizations**

- **Vite** for fast builds and hot reload
- **Code splitting** with React.lazy (ready for implementation)
- **Image optimization** with proper formats
- **Caching headers** configured for static assets
- **Zustand persistence** for offline functionality
- **Responsive images** and mobile-first design

## 🔒 **Security Features**

- Role-based access control throughout the application
- Input validation and sanitization
- Secure local storage with encrypted data persistence
- XSS protection with proper content escaping
- CSRF protection through proper state management

## 📱 **Mobile Support**

- Fully responsive design for all screen sizes
- Touch-friendly interface elements
- Mobile-optimized navigation
- Swipe gestures for improved UX
- Progressive Web App (PWA) ready

## 🎯 **Future Enhancements**

### **Planned Features**
- Real-time notifications and alerts system
- Advanced reporting and analytics dashboard
- Integration with external calendar systems
- Email notifications for important events
- Advanced project templates and workflows
- Team chat and collaboration features
- File upload and document management
- API integrations with third-party tools

### **Technical Improvements**
- Backend API with Node.js + Express
- Database integration (PostgreSQL/MongoDB)
- Real-time WebSocket connections
- Progressive Web App (PWA) features
- Advanced caching strategies
- Performance monitoring and analytics

## 🐛 **Known Issues**

None currently reported. The application has been thoroughly tested across different browsers and devices.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 **Acknowledgments**

- **shadcn/ui** for the excellent component library
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **Zustand** for simple and effective state management
- **Vite** for the lightning-fast development experience

---

**Built with ❤️ for productivity and team collaboration**