'use client';

import { Spin } from 'antd';
import { useAppSelector } from '@/lib/redux/hooks';

export default function LoadingSpinner() {
  const { loading, loadingMessage } = useAppSelector((state) => state.ui);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <Spin size="large" />
        {loadingMessage && (
          <p className="mt-4 text-gray-700 dark:text-gray-300">{loadingMessage}</p>
        )}
      </div>
    </div>
  );
}

