# SSC Exam Track Pro - Secure Role-Based Dynamic Landing Page System

A comprehensive, secure, and role-based SSC student productivity and motivational platform built with Next.js 15, Tailwind CSS 4, Firebase Authentication, MongoDB, and Google Gemini API.

## 🚀 **New Features: Role-Based Dynamic Landing Pages**

### **Role System Overview**
The platform now implements a sophisticated role-based access control system with dynamic landing pages:

- **Guest** → Not logged in users
- **Student** → Normal authenticated users (default role)
- **Advanced** → Premium users with enhanced features
- **Admin** → Platform administrators with full control

### **Dynamic Landing Pages**
Each user role sees a completely different home page experience:

#### **Guest Landing Page**
- Welcome message with sign-up CTA
- Feature showcase
- Motivational content preview
- Call-to-action for registration

#### **Student Landing Page**
- Personalized welcome with user's name
- Quick access to exam dashboard
- Progress summary and statistics
- Study streak tracking
- Quick action buttons

#### **Advanced Learner Landing Page**
- Premium features showcase
- Advanced tools access
- Enhanced study resources
- Priority feature access

#### **Admin Landing Page**
- Full platform control access
- User management tools
- Content moderation controls
- System analytics overview

## 🔐 **Security Features**

### **Route Protection**
- **Middleware-based protection** for all restricted routes
- **Role-based access control** at both frontend and backend
- **Secure token validation** using Firebase Admin SDK
- **Automatic redirects** to unauthorized page for invalid access

### **Protected Routes**
- `/admin/*` → Admin only
- `/advanced/*` → Advanced and Admin users
- `/student/*` → Student, Advanced, and Admin users
- `/` → Public (dynamic content based on role)

### **API Security**
- **Role verification** on all protected API endpoints
- **User permission checks** before data operations
- **Secure session management** with encrypted cookies
- **CSRF protection** and input validation

## 🏗️ **Technical Architecture**

### **Frontend Technologies**
- **Next.js 15** with App Router
- **Tailwind CSS 4** for modern, responsive design
- **Framer Motion** for smooth animations
- **React Context API** for state management
- **Role-based component rendering**

### **Backend Technologies**
- **Next.js API Routes** for backend logic
- **MongoDB with Mongoose** for data persistence
- **Firebase Authentication** for secure user management
- **Google Gemini API** for AI-powered motivation

### **Database Models**
Enhanced user schema with role management:
```javascript
{
  uid: String,           // Firebase UID
  email: String,         // User email
  role: String,          // guest, student, advanced, admin
  isAdmin: Boolean,      // Admin flag
  loginCount: Number,    // Login tracking
  examProgress: Object,  // Exam statistics
  studyStreak: Object,   // Study habit tracking
  permissions: Object,   // Role-based permissions
  createdAt: Date,       // Account creation date
  updatedAt: Date        // Last update date
}
```

## 🎯 **Key Features**

### **1. Authentication & Authorization**
- Google Firebase Authentication
- Role-based access control
- Secure session management
- Automatic role upgrades

### **2. Dynamic Content System**
- Role-specific landing pages
- Conditional component rendering
- Personalized user experiences
- Adaptive navigation menus

### **3. Exam Management**
- Create and track multiple exam types
- Subject-based to-do lists
- Progress tracking and analytics
- Deadline management

### **4. AI-Powered Motivation**
- Daily motivational quotes
- Personalized study advice
- Problem-solving support
- Progress encouragement

### **5. Community Features**
- Blog creation and sharing
- Comment system with @mentions
- Like and interaction features
- Content moderation tools

### **6. Study Resources**
- PDF book library
- Category and grade filtering
- Online viewing and download
- Admin upload management

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB Atlas account
- Firebase project
- Google Gemini API key

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd exam-track-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env.local` file with:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/exam-track-pro

   # Google Gemini AI Configuration
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 **Role Management**

### **Automatic Role Upgrades**
Students are automatically upgraded to Advanced role when they meet criteria:
- **10+ login sessions**
- **5+ exams created**
- **Active study participation**

### **Manual Role Assignment**
Admins can manually assign roles through the admin panel:
- User role management
- Permission updates
- Role hierarchy enforcement

### **Role Permissions**
```javascript
const rolePermissions = {
  student: ['access_exams', 'create_blogs', 'view_books'],
  advanced: ['premium_features', 'advanced_analytics', 'priority_support'],
  admin: ['user_management', 'content_moderation', 'system_control']
};
```

## 📱 **Responsive Design**

- **Mobile-first approach** with Tailwind CSS
- **Progressive enhancement** for all devices
- **Touch-friendly interfaces** for mobile users
- **Adaptive layouts** for different screen sizes

## 🔒 **Security Best Practices**

- **Environment variables** for all sensitive data
- **Input validation** and sanitization
- **Role-based API access** control
- **Secure authentication** flow
- **Data encryption** for sensitive information
- **Regular security audits** and updates

## 🚀 **Deployment**

### **Vercel (Recommended)**
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### **Other Platforms**
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **DigitalOcean** - Custom server setup

## 📊 **Performance Features**

- **Next.js 15 optimizations** for fast loading
- **Image optimization** and lazy loading
- **Code splitting** and dynamic imports
- **Caching strategies** for better performance
- **Progressive Web App** capabilities

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

- **Documentation**: Check the docs folder
- **Issues**: Report bugs on GitHub
- **Discussions**: Join community discussions
- **Email**: Contact the development team

## 🔮 **Future Enhancements**

- **Real-time notifications** with WebSockets
- **Advanced analytics** and reporting
- **Mobile app** development
- **Integration** with learning management systems
- **AI-powered study planning**
- **Social learning** features
- **Gamification** elements

---

**Built with ❤️ for SSC students worldwide**
