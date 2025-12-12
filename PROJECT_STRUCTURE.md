# Project Structure Overview

This document provides a quick overview of the project structure and key files.

## 📂 Directory Structure

```
next-boilerplate/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── auth/
│   │   │   ├── login/page.tsx       # Login page
│   │   │   └── register/page.tsx    # Register page
│   │   ├── dashboard/page.tsx        # Dashboard page
│   │   ├── users/page.tsx            # Users CRUD example
│   │   ├── settings/page.tsx         # Settings page
│   │   ├── layout.tsx                # Root layout
│   │   ├── layout-client-init.tsx    # Client-side initialization
│   │   ├── page.tsx                  # Home (redirects to dashboard)
│   │   └── globals.css               # Global styles
│   │
│   ├── components/
│   │   ├── layouts/                  # Layout components
│   │   │   ├── ProtectedLayout.tsx   # Protected route wrapper
│   │   │   ├── Sidebar.tsx           # Sidebar navigation
│   │   │   └── Header.tsx            # Top header with user menu
│   │   ├── providers/                # Context providers
│   │   │   ├── ReduxProvider.tsx     # Redux store provider
│   │   │   └── AntdProvider.tsx      # Ant Design config provider
│   │   └── ui/                       # Reusable UI components
│   │       └── LoadingSpinner.tsx    # Global loading spinner
│   │
│   ├── lib/
│   │   ├── redux/                    # Redux configuration
│   │   │   ├── store.ts              # Redux store setup
│   │   │   ├── hooks.ts              # Typed Redux hooks
│   │   │   └── slices/               # Redux slices
│   │   │       ├── authSlice.ts      # Auth state management
│   │   │       └── uiSlice.ts        # UI state (theme, sidebar, loading)
│   │   └── api/                      # API configuration
│   │       ├── axios.ts              # Axios instance with interceptors
│   │       ├── auth.ts               # Authentication API
│   │       └── users.ts              # Users API (example)
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── useAuth.ts                # Authentication hook
│   │
│   ├── utils/                        # Utility functions
│   │   └── format.ts                 # Formatting utilities
│   │
│   └── middleware.ts                 # Next.js middleware for route protection
│
├── public/                           # Static assets
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── README.md                         # Main documentation
└── PROJECT_STRUCTURE.md               # This file
```

## 🔑 Key Files

### State Management
- **`src/lib/redux/store.ts`** - Redux store configuration
- **`src/lib/redux/slices/authSlice.ts`** - Authentication state
- **`src/lib/redux/slices/uiSlice.ts`** - UI state (theme, sidebar, loading)
- **`src/lib/redux/hooks.ts`** - Typed Redux hooks

### API
- **`src/lib/api/axios.ts`** - Axios instance with interceptors
- **`src/lib/api/auth.ts`** - Authentication API functions
- **`src/lib/api/users.ts`** - Users API functions (example CRUD)

### Layout & Navigation
- **`src/components/layouts/ProtectedLayout.tsx`** - Protected route wrapper
- **`src/components/layouts/Sidebar.tsx`** - Sidebar navigation
- **`src/components/layouts/Header.tsx`** - Top header

### Authentication
- **`src/app/auth/login/page.tsx`** - Login page
- **`src/app/auth/register/page.tsx`** - Register page
- **`src/middleware.ts`** - Route protection middleware

### Pages
- **`src/app/dashboard/page.tsx`** - Dashboard with statistics
- **`src/app/users/page.tsx`** - Users CRUD example
- **`src/app/settings/page.tsx`** - Settings page

## 🎯 Quick Reference

### Adding a New Page
1. Create page in `src/app/[page-name]/page.tsx`
2. Add route to sidebar in `src/components/layouts/Sidebar.tsx`
3. Add to protected routes in `src/middleware.ts` (if needed)

### Adding a New API Module
1. Create file in `src/lib/api/[module].ts`
2. Use the axios instance: `import api from '@/lib/api/axios'`
3. Export API functions following the pattern in `users.ts`

### Adding a New Redux Slice
1. Create slice in `src/lib/redux/slices/[slice].ts`
2. Add reducer to `src/lib/redux/store.ts`
3. Export actions and use typed hooks from `src/lib/redux/hooks.ts`

### Using Authentication
```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, logout } = useAuth();
```

### Using Redux
```typescript
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';

const data = useAppSelector((state) => state.auth.user);
const dispatch = useAppDispatch();
```

### Using API
```typescript
import api from '@/lib/api/axios';

const response = await api.get('/endpoint');
```

