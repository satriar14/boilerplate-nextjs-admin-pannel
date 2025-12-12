'use client';

import { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { confirmDelete, showSuccess, showError } from '@/utils/swal';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setLoading } from '@/lib/redux/slices/uiSlice';

interface DeleteButtonProps {
  /**
   * ID of the item to delete
   */
  itemId: string;
  
  /**
   * Name or identifier of the item (for confirmation message)
   */
  itemName?: string;
  
  /**
   * Delete handler function
   */
  onDelete: (id: string) => Promise<void>;
  
  /**
   * Callback after successful delete
   */
  onSuccess?: () => void;
  
  /**
   * Custom confirmation title
   */
  title?: string;
  
  /**
   * Custom confirmation text
   */
  text?: string;
  
  /**
   * Custom success message title
   */
  successTitle?: string;
  
  /**
   * Custom success message text
   */
  successText?: string;
  
  /**
   * Custom error message title
   */
  errorTitle?: string;
  
  /**
   * Custom error message text
   */
  errorText?: string;
  
  /**
   * Loading message
   */
  loadingMessage?: string;
  
  /**
   * Button size
   */
  size?: 'small' | 'middle' | 'large';
  
  /**
   * Show tooltip
   */
  showTooltip?: boolean;
  
  /**
   * Custom tooltip text
   */
  tooltipText?: string;
  
  /**
   * Button type
   */
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  
  /**
   * Additional className
   */
  className?: string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
}

export default function DeleteButton({
  itemId,
  itemName,
  onDelete,
  onSuccess,
  title,
  text,
  successTitle = 'Deleted!',
  successText,
  errorTitle = 'Error!',
  errorText,
  loadingMessage = 'Deleting...',
  size = 'small',
  showTooltip = true,
  tooltipText = 'Delete',
  type = 'primary',
  className,
  disabled = false,
}: DeleteButtonProps) {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Show confirmation dialog
    const confirmed = await confirmDelete(
      title || 'Are you sure?',
      text || `Are you sure you want to delete ${itemName || 'this item'}? This action cannot be undone.`,
      'Yes, delete it!',
      'Cancel'
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      dispatch(setLoading({ loading: true, message: loadingMessage }));
      
      await onDelete(itemId);
      
      dispatch(setLoading({ loading: false }));
      await showSuccess(
        successTitle,
        successText || `${itemName || 'Item'} has been deleted successfully.`,
        2000
      );
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      dispatch(setLoading({ loading: false }));
      await showError(
        errorTitle,
        errorText || `Failed to delete ${itemName || 'item'}. Please try again.`,
        3000
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const button = (
    <Button
      type={type}
      danger={type === 'primary'}
      icon={<DeleteOutlined />}
      size={size}
      onClick={handleDelete}
      loading={isDeleting}
      disabled={disabled || isDeleting}
      className={className}
    />
  );

  if (showTooltip) {
    return <Tooltip title={tooltipText}>{button}</Tooltip>;
  }

  return button;
}

