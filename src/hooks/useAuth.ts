import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { logout } from '@/lib/redux/slices/authSlice';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    logout: handleLogout,
  };
}

