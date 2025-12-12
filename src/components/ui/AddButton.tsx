'use client';

import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface AddButtonProps {
  /**
   * Click handler function
   */
  onClick: () => void;
  
  /**
   * Button text (full text for desktop)
   */
  text?: string;
  
  /**
   * Short text for mobile (if not provided, uses first word of text)
   */
  shortText?: string;
  
  /**
   * Button size
   */
  size?: 'small' | 'middle' | 'large';
  
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
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Show icon
   */
  showIcon?: boolean;
  
  /**
   * Custom icon
   */
  icon?: React.ReactNode;
}

export default function AddButton({
  onClick,
  text = 'Add',
  shortText,
  size = 'middle',
  type = 'primary',
  className = '',
  disabled = false,
  loading = false,
  showIcon = true,
  icon,
}: AddButtonProps) {
  // Generate short text from text if not provided
  const short = shortText || (text ? text.split(' ')[0] : 'Add');
  
  // Determine if we should show responsive text
  const hasResponsiveText = text && text !== short;

  return (
    <Button
      type={type}
      icon={showIcon ? (icon || <PlusOutlined />) : undefined}
      onClick={onClick}
      size={size}
      disabled={disabled}
      loading={loading}
      className={`${className} ${hasResponsiveText ? 'w-full sm:w-auto' : ''}`}
    >
      {hasResponsiveText ? (
        <>
          <span className="hidden sm:inline">{text}</span>
          <span className="sm:hidden">{short}</span>
        </>
      ) : (
        text
      )}
    </Button>
  );
}

