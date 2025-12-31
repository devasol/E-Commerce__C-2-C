# C-2-C E-Commerce Platform

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v18.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.x-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)

A comprehensive full-stack e-commerce platform built with the MERN stack, featuring advanced payment integration, admin dashboard, and responsive design.

## 🚀 Features

- **Full-Stack Application**: Built with React, Node.js, Express, and MongoDB
- **Advanced Payment System**: Integrated TeleBirr payment gateway for Ethiopian mobile payments
- **Admin Dashboard**: Complete administrative control with analytics and order management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **JWT Authentication**: Secure user authentication and authorization
- **Shopping Cart**: Full cart functionality with persistent storage
- **Order Management**: Complete order tracking and management system
- **Email Notifications**: Automated order confirmations and updates
- **PDF Receipts**: Automatic receipt generation and download
- **Product Management**: CRUD operations for products and categories

## 🛠️ Tech Stack

### Frontend
- **React 18**: Component-based UI library
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Data visualization and analytics
- **React Icons**: SVG icon library
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JSON Web Tokens (JWT)**: Authentication mechanism
- **Stripe**: Payment processing (additional payment option)
- **Nodemailer**: Email service integration
- **Multer**: File upload handling
- **Puppeteer**: PDF generation for receipts

### Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **Concurrently**: Running multiple npm scripts
- **Nodemon**: Development server with auto-restart

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.x or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local instance or MongoDB Atlas account)
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/devasol/E-Commerce__C-2-C.git
cd E-Commerce__C-2-C
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Configuration

Create `.env` files in both the `backend` and `frontend` directories:

**Backend (.env in backend directory):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_EMAIL=your_smtp_email
SMTP_PASSWORD=your_smtp_password
TELEBIRR_APP_ID=your_telebirr_app_id
TELEBIRR_APP_SECRET=your_telebirr_app_secret
TELEBIRR_CALLBACK_URL=your_telebirr_callback_url
STRIPE_API_KEY=your_stripe_api_key
FRONTEND_URL=http://localhost:3001
```

**Frontend (.env in frontend directory):**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### 4. Run the Application

**Option 1: Run both servers simultaneously (Recommended)**
```bash
npm run dev
```

**Option 2: Run servers separately**

In one terminal (Backend):
```bash
cd backend
npm run dev
```

In another terminal (Frontend):
```bash
cd frontend
npm run start
```

The application will be available at `http://localhost:3001`

## 🏗️ Project Structure

```
E-Commerce__C-2-C/
├── backend/                 # Express.js server
│   ├── config/             # Database and configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Authentication and validation
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── utils/              # Utility functions
│   └── server.js           # Server entry point
├── frontend/               # React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main application component
├── .env.example           # Environment variables template
└── package.json           # Root package configuration
```

## 💳 Payment System

This platform features an advanced payment system with TeleBirr integration for Ethiopian mobile payments:

### Supported Payment Methods
- **TeleBirr**: Primary payment method for Ethiopian users
- **Stripe**: Additional payment gateway (coming soon)

### Payment Flow
1. User adds products to cart
2. Proceeds to checkout with shipping information
3. Selects payment method (TeleBirr)
4. Payment is processed immediately
5. Order is created and marked as paid
6. Email confirmation and PDF receipt are sent automatically

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Admin Dashboard**: Comprehensive analytics and management tools
- **Product Catalog**: Filterable and searchable product listings
- **Shopping Experience**: Intuitive cart and checkout process

## 🔐 Authentication & Authorization

- **JWT-based Authentication**: Secure token-based system
- **Role-based Access**: Different permissions for users and admins
- **Protected Routes**: Secure access to sensitive areas
- **Password Encryption**: Bcrypt for secure password storage

## 📊 Admin Dashboard

The admin dashboard provides comprehensive control over the platform:

- **Analytics**: Sales, revenue, and user metrics
- **Product Management**: Add, edit, and remove products
- **Order Management**: Track and update order statuses
- **User Management**: View and manage user accounts
- **Category Management**: Organize products by categories

## 📧 Email Notifications

Automated email system for:
- Order confirmations
- Payment confirmations
- Shipping updates
- Promotional emails

## 📄 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart/item/:productId` - Remove item
- `DELETE /api/cart` - Clear cart

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id` - Update order (admin only)

## 🧪 Testing

Run tests for the frontend:
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred database
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or GitHub Pages
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Issues

If you encounter any issues, please open an issue in the [GitHub repository](https://github.com/devasol/E-Commerce__C-2-C/issues).

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please contact the project maintainers or open an issue in the repository.

## 🙏 Acknowledgments

- Thanks to the open-source community for the amazing libraries and tools
- Special thanks to TeleBirr for the payment integration
- Inspired by modern e-commerce best practices

---

<div align="center">

**Made with ❤️ by the C-2-C E-Commerce Team**

[Back to Top](#c-2-c-e-commerce-platform)

</div>