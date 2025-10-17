# DD Store - E-Commerce Cart & Discount System

## 🚀 Features

### User Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Product Catalog**: Browse products across multiple categories
- **Shopping Cart**: Add/remove products with real-time updates
- **Smart Discount Engine**: Automatic discount application based on:
  - Product-specific rules (BOGO, Buy X for Y)
  - Category-wide discounts (Percentage off)
  - Quantity-based triggers
- **Checkout System**: View discounted prices and order summary
- **Persistent Cart**: Cart data persists across sessions

### Admin Features

- **Admin Dashboard**: Dedicated admin panel with role-based access control
- **Discount Management**: Full CRUD operations for discount rules
  - Create new discount rules
  - Edit existing discounts
  - Delete discount rules
  - Toggle discount status (Active/Inactive)
- **Discount Types Supported**:
  - **BOGO**: Buy One Get One Free
  - **Buy X for Y**: Buy X items, pay for Y items
  - **Percentage Off**: Category or product-specific percentage discounts
- **Access Control**: Admins cannot access the store (purchase separation)

## 🛠️ Technologies Used

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - UI component library
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cookie Parser** - Cookie handling
- **Helmet** - Security headers
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

## 🔧 Setup Instructions

## Prerequisites

- **Node.js** (v22.20.0 or higher)
- **npm**

### Project Setup

1.  **Navigate to the server directory:**

        cd server

2.  **Install dependencies:**

        npm install

3.  **Navigate to the client directory:**

        cd client

4.  **Install dependencies:**

        npm install

5.  **Rename the given `.env.txt` file to `.env` and place it in the server directory:**

6.  **Navigate to the root directory**:

        cd ../

7.  **Install dependencies:**

        npm install

8.  **Start the development server:**

        npm run dev

    The server and frontend will start at `http://localhost:8000` and `http://localhost:5173` respectively.

### Database Seeding (Optional):

If you want to populate the database with sample data (however i have already done this step there is no need to do it):

1.  **Navigate to the server directory:**

        cd server

2.  **Run the seed script:**

        npm run seed

    This will create:
    - **8 sample products** (T-shirt, Jeans, Sneakers, Laptop, Smartphone, Coffee Mug, Book, Headphones)
    - **3 discount rules** (BOGO on T-shirts, Buy 2 Sneakers for 1, 50% off Clothing)

    Or seed individually:

        npm run seed:products    # Seed products only
        npm run seed:discounts   # Seed discounts only

## 🔐 Authentication & Authorization

- **JWT tokens** stored in **httpOnly cookies** for security
- **Role-based access control** (User vs Admin)
- **Password hashing** with bcryptjs
- **Admin key** required for admin registration (admin123) to register as an admin
- **Protected routes** on both frontend and backend
- **Automatic redirection** based on user role

## 💡 Discount System Logic

### BOGO (Buy One Get One)

- Every 2nd item is free
- Example: Buy 3 T-shirts, pay for 2

### Buy X for Y

- Buy X quantity, pay for Y quantity
- Example: Buy 2 Sneakers, pay for 1

### Percentage Off

- Fixed percentage discount
- Can be product-specific or category-wide
- Example: 50% off all Clothing

### Priority

1.  Product-specific discounts (checked first)
2.  Category-wide discounts (if no product discount)
3.  Only one discount applied per product
