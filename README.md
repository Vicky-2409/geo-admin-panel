# Geo-Enabled User Admin Panel

A modern Next.js-based admin dashboard with geolocation tracking, role-based access control, and user management capabilities.

## 🌟 Features

- **Authentication & Authorization**
  - Secure user registration with password hashing
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Rate limiting for login attempts
  - Refresh token implementation

- **Geolocation Tracking**
  - IP-based location detection
  - Login history with location data
  - City and country tracking
  - Timestamp recording

- **User Management**
  - Admin dashboard for user management
  - User profile viewing
  - Login history tracking
  - Create new users (Admin only)

- **Modern UI/UX**
  - Responsive design with TailwindCSS
  - Dark/Light theme support
  - Clean and intuitive interface
  - Loading states and error handling

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd geo-enabled-user-admin-panel
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/geo-admin-panel

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# API Keys (if needed)
IPINFO_TOKEN=your-ipinfo-token
```

4. Seed the database with an admin user:
```bash
npm run seed
# or
yarn seed
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 🔑 Testing the Application

### Default Admin Credentials
- Email: admin@test.com
- Password: admin123

### User Registration
1. Navigate to `/register`
2. Fill in the registration form:
   - Name
   - Email
   - Password (minimum 6 characters)
3. Submit the form
4. You'll be redirected to the dashboard upon successful registration

### User Login
1. Navigate to `/login`
2. Enter your credentials:
   - Email
   - Password
3. Submit the form
4. You'll be redirected to the dashboard upon successful login

### Admin Features
1. Log in with admin credentials
2. Access the admin dashboard at `/dashboard`
3. View all users
4. Create new users
5. Monitor login history

### User Features
1. Log in with user credentials
2. Access your profile at `/dashboard`
3. View your login history
4. Update your profile information

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - TypeScript
  - TailwindCSS
  - React Hook Form
  - Axios

- **Backend**
  - Next.js API Routes
  - MongoDB
  - Mongoose
  - JWT Authentication
  - bcrypt

- **Development**
  - ESLint
  - Prettier
  - TypeScript
  - Husky

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── lib/                 # Utility functions and configurations
├── models/             # Mongoose models
├── types/              # TypeScript type definitions
└── scripts/            # Database seeding and utility scripts
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Rate limiting for login attempts
- Input validation and sanitization
- Protected API routes
- Role-based access control

## 🎨 Theme Support

The application supports both light and dark themes:
- Automatic theme detection based on system preferences
- Manual theme toggle in the dashboard
- Persistent theme selection

## �� API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "user" | "admin"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### User Management Endpoints

#### Get User Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

#### Get All Users (Admin Only)
```http
GET /api/users
Authorization: Bearer <token>
```

#### Create User (Admin Only)
```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "user" | "admin"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database
- All contributors who have helped shape this project