import Swal from 'sweetalert2';
import { getEffectiveTheme } from './theme';
import { getStoredTheme } from './theme';

/**
 * Get the current theme for SweetAlert2
 */
const getSwalTheme = (): 'light' | 'dark' => {
  const themeMode = getStoredTheme();
  return getEffectiveTheme(themeMode);
};

/**
 * Show a confirmation dialog using SweetAlert2
 */
export const confirmDelete = async (
  title: string = 'Are you sure?',
  text: string = "You won't be able to revert this!",
  confirmButtonText: string = 'Yes, delete it!',
  cancelButtonText: string = 'Cancel'
): Promise<boolean> => {
  const theme = getSwalTheme();

  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: theme === 'dark' ? '#ef4444' : '#dc2626',
    cancelButtonColor: theme === 'dark' ? '#6b7280' : '#9ca3af',
    confirmButtonText,
    cancelButtonText,
    background: theme === 'dark' ? '#1f1f1f' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#111827',
    customClass: {
      popup: theme === 'dark' ? 'dark-swal' : 'light-swal',
      title: theme === 'dark' ? 'text-white' : 'text-gray-900',
      htmlContainer: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      confirmButton: 'swal2-confirm',
      cancelButton: 'swal2-cancel',
    },
    buttonsStyling: true,
    reverseButtons: false,
  });

  return result.isConfirmed;
};

/**
 * Show a success message using SweetAlert2
 */
export const showSuccess = async (
  title: string = 'Success!',
  text: string = 'Operation completed successfully.',
  timer: number = 2000
): Promise<void> => {
  const theme = getSwalTheme();

  await Swal.fire({
    title,
    text,
    icon: 'success',
    timer,
    showConfirmButton: false,
    background: theme === 'dark' ? '#1f1f1f' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#111827',
    customClass: {
      popup: theme === 'dark' ? 'dark-swal' : 'light-swal',
      title: theme === 'dark' ? 'text-white' : 'text-gray-900',
      htmlContainer: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    },
  });
};

/**
 * Show an error message using SweetAlert2
 */
export const showError = async (
  title: string = 'Error!',
  text: string = 'Something went wrong.',
  timer: number = 3000
): Promise<void> => {
  const theme = getSwalTheme();

  await Swal.fire({
    title,
    text,
    icon: 'error',
    timer,
    showConfirmButton: true,
    confirmButtonColor: theme === 'dark' ? '#ef4444' : '#dc2626',
    background: theme === 'dark' ? '#1f1f1f' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#111827',
    customClass: {
      popup: theme === 'dark' ? 'dark-swal' : 'light-swal',
      title: theme === 'dark' ? 'text-white' : 'text-gray-900',
      htmlContainer: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    },
  });
};

