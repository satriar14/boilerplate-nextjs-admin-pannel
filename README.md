# Next.js Admin Panel Boilerplate

A production-ready admin panel boilerplate built with Next.js (App Router), Redux Toolkit, Ant Design, and TailwindCSS. Perfect for building CMS, internal tools, or enterprise dashboards.

## 🚀 Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **Ant Design** - UI component library
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors
- **React Icons** - Icon library
- **Day.js** - Date utilities

## 📁 Project Structure

```
next-boilerplate/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   │   ├── login/        # Login page
│   │   │   └── register/     # Register page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── users/            # Users CRUD page (example)
│   │   ├── settings/         # Settings page
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Home page (redirects to dashboard)
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── layouts/          # Layout components
│   │   │   ├── ProtectedLayout.tsx  # Protected route wrapper
│   │   │   ├── Sidebar.tsx          # Sidebar navigation
│   │   │   └── Header.tsx            # Top header
│   │   ├── providers/        # Context providers
│   │   │   ├── ReduxProvider.tsx    # Redux store provider
│   │   │   └── AntdProvider.tsx     # Ant Design config provider
│   │   └── ui/               # UI components
│   │       └── LoadingSpinner.tsx   # Global loading spinner
│   ├── lib/
│   │   ├── redux/            # Redux configuration
│   │   │   ├── store.ts      # Redux store setup
│   │   │   ├── hooks.ts      # Typed Redux hooks
│   │   │   └── slices/       # Redux slices
│   │   │       ├── authSlice.ts     # Authentication state
│   │   │       └── uiSlice.ts       # UI state (theme, sidebar, loading)
│   │   └── api/              # API configuration
│   │       ├── axios.ts      # Axios instance with interceptors
│   │       ├── auth.ts       # Authentication API functions
│   │       └── users.ts      # Users API functions (example)
│   ├── hooks/                # Custom React hooks
│   │   └── useAuth.ts        # Authentication hook
│   ├── utils/                # Utility functions
│   │   └── format.ts         # Formatting utilities
│   └── middleware.ts         # Next.js middleware for route protection
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

3. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

### Default Credentials

For testing purposes, you can use any email/password combination. The authentication is currently using mock API functions.

## 📚 How to Use

### Authentication

The boilerplate includes a complete authentication system:

- **Login Page** (`/auth/login`) - User login with email and password
- **Register Page** (`/auth/register`) - User registration
- **Protected Routes** - Automatically redirects unauthenticated users to login
- **Token Management** - JWT tokens stored in localStorage and Redux

#### Using Authentication

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Redux Toolkit

The project uses Redux Toolkit for state management with two main slices:

#### Auth Slice

Manages authentication state:

```typescript
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setCredentials, logout } from '@/lib/redux/slices/authSlice';

// Get auth state
const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);

// Set credentials after login
dispatch(setCredentials({ user, token }));

// Logout
dispatch(logout());
```

#### UI Slice

Manages UI state (theme, sidebar, loading):

```typescript
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { toggleTheme, setLoading, toggleSidebar } from '@/lib/redux/slices/uiSlice';

// Get UI state
const { theme, sidebarCollapsed, loading } = useAppSelector((state) => state.ui);

// Toggle theme
dispatch(toggleTheme());

// Set loading state
dispatch(setLoading({ loading: true, message: 'Loading...' }));

// Toggle sidebar
dispatch(toggleSidebar());
```

### API Instance (Axios)

The Axios instance is pre-configured with:

- Base URL from environment variables
- Request interceptor that attaches JWT token from Redux
- Response interceptor that handles 401 errors and redirects to login

#### Using the API Instance

```typescript
import api from '@/lib/api/axios';

// GET request
const response = await api.get('/users');
const users = response.data;

// POST request
const response = await api.post('/users', { name: 'John', email: 'john@example.com' });

// PUT request
const response = await api.put(`/users/${id}`, { name: 'Jane' });

// DELETE request
await api.delete(`/users/${id}`);
```

#### Creating New API Modules

1. Create a new file in `src/lib/api/`:

```typescript
// src/lib/api/products.ts
import api from './axios';

export interface Product {
  id: string;
  name: string;
  price: number;
}

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: Omit<Product, 'id'>): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
```

2. Use it in your components:

```typescript
import { productsApi } from '@/lib/api/products';

const products = await productsApi.getAll();
```

### Adding a New Module/Page

1. **Create a new page:**

```typescript
// src/app/products/page.tsx
'use client';

import { Card, Typography } from 'antd';

const { Title } = Typography;

export default function ProductsPage() {
  return (
    <div>
      <Title level={2}>Products</Title>
      <Card>
        {/* Your content here */}
      </Card>
    </div>
  );
}
```

2. **Add to sidebar navigation:**

Edit `src/components/layouts/Sidebar.tsx`:

```typescript
const menuItems = [
  // ... existing items
  {
    key: '/products',
    icon: <ProductOutlined />,
    label: 'Products',
  },
];
```

3. **Add to protected routes (if needed):**

Edit `src/middleware.ts`:

```typescript
const protectedRoutes = ['/dashboard', '/users', '/products', '/settings'];
```

### Theme Switching

The boilerplate supports light/dark theme switching:

- Theme preference is saved in localStorage
- Automatically syncs with Ant Design theme
- Works with TailwindCSS dark mode

```typescript
import { useAppDispatch } from '@/lib/redux/hooks';
import { toggleTheme, setTheme } from '@/lib/redux/slices/uiSlice';

// Toggle between light/dark
dispatch(toggleTheme());

// Set specific theme
dispatch(setTheme('dark'));
```

### Global Loading Spinner

The loading spinner is controlled by Redux UI slice:

```typescript
import { useAppDispatch } from '@/lib/redux/hooks';
import { setLoading } from '@/lib/redux/slices/uiSlice';

// Show loading
dispatch(setLoading({ loading: true, message: 'Loading data...' }));

// Hide loading
dispatch(setLoading({ loading: false }));
```

## 🎨 Customization

### Styling

- **TailwindCSS**: Edit `src/app/globals.css` for global styles
- **Ant Design**: Customize theme in `src/components/providers/AntdProvider.tsx`

### Colors

Update TailwindCSS colors in `tailwind.config.js` (if using Tailwind v3) or in `globals.css` for Tailwind v4.

### Sidebar

Customize sidebar items in `src/components/layouts/Sidebar.tsx`.

## 🔒 Route Protection

Routes are protected using:

1. **Middleware** (`src/middleware.ts`) - Server-side route protection
2. **ProtectedLayout** (`src/components/layouts/ProtectedLayout.tsx`) - Client-side protection

Protected routes automatically redirect to `/auth/login` if user is not authenticated.

## 📝 Example: CRUD Operations

See `src/app/users/page.tsx` for a complete CRUD example with:

- Table listing
- Create modal
- Edit modal
- Delete confirmation
- Loading states
- Error handling

## 🚀 Building for Production

```bash
npm run build
npm start
```

## 📦 Key Features

- ✅ Authentication (Login/Register)
- ✅ Protected Routes
- ✅ Redux Toolkit State Management
- ✅ Axios with Interceptors
- ✅ Ant Design Components
- ✅ Responsive Sidebar Layout
- ✅ Theme Switching (Light/Dark)
- ✅ Global Loading Spinner
- ✅ Example CRUD Page
- ✅ TypeScript Support
- ✅ TailwindCSS Integration

## 🤝 Contributing

This is a boilerplate project. Feel free to fork and customize for your needs.

## 📄 License

MIT

## 🆘 Support

For issues and questions, please check the code comments or create an issue in the repository.

---

**Built with ❤️ using Next.js, Redux Toolkit, and Ant Design**
