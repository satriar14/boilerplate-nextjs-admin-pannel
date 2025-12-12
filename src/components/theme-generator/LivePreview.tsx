'use client';

import { Input, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ThemeColors } from '@/lib/redux/slices/themeGeneratorSlice';

interface LivePreviewProps {
  colors: ThemeColors;
}

export default function LivePreview({ colors }: LivePreviewProps) {
  const style = {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-background': colors.background,
    '--color-surface': colors.surface,
    '--color-text-heading': colors.textHeading,
    '--color-text-body': colors.textBody,
    '--color-success': colors.success,
    '--color-error': colors.error,
    '--color-warning': colors.warning,
    '--color-info': colors.info,
  } as React.CSSProperties;

  return (
    <div style={style}>
      <style>{`
        .theme-preview {
          background: var(--color-background);
          color: var(--color-text-body);
          padding: 24px;
          border-radius: 8px;
          min-height: 600px;
        }
        .theme-preview .preview-card {
          background: var(--color-surface);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }
        .theme-preview .preview-title {
          color: var(--color-text-heading);
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }
        .theme-preview .preview-text {
          color: var(--color-text-body);
          margin: 0;
        }
        .theme-preview .btn-primary {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }
        .theme-preview .btn-secondary {
          background: var(--color-secondary);
          border-color: var(--color-secondary);
          color: white;
        }
        .theme-preview .btn-accent {
          background: var(--color-accent);
          border-color: var(--color-accent);
          color: white;
        }
        .theme-preview .tag-success {
          background: var(--color-success);
          color: white;
          border: none;
        }
        .theme-preview .tag-error {
          background: var(--color-error);
          color: white;
          border: none;
        }
        .theme-preview .tag-warning {
          background: var(--color-warning);
          color: white;
          border: none;
        }
        .theme-preview .tag-info {
          background: var(--color-info);
          color: white;
          border: none;
        }
      `}</style>
      <div className="theme-preview">
        {/* Navigation Bar */}
        <div className="preview-card" style={{ marginBottom: '24px' }}>
          <Space>
            <button
              type="button"
              style={{
                color: 'var(--color-text-heading)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Home
            </button>
            <button
              type="button"
              style={{
                color: 'var(--color-text-body)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              About
            </button>
            <button
              type="button"
              style={{
                color: 'var(--color-text-body)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Contact
            </button>
          </Space>
        </div>

        {/* Hero Section */}
        <div className="preview-card">
          <h2 className="preview-title">Welcome to Theme Preview</h2>
          <p className="preview-text">
            This is a live preview of your custom theme. All colors update in real-time as you adjust them.
          </p>
          <Space style={{ marginTop: '16px' }}>
            <button
              className="btn-primary"
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              Get Started
            </button>
            <button
              className="btn-secondary"
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              Learn More
            </button>
          </Space>
        </div>

        {/* Form Section */}
        <div className="preview-card">
          <h3 className="preview-title" style={{ fontSize: '18px', marginBottom: '16px' }}>
            Contact Form
          </h3>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              placeholder="Your Name"
              style={{
                width: '100%',
                background: 'var(--color-surface)',
                borderColor: 'rgba(0, 0, 0, 0.2)',
                color: 'var(--color-text-body)',
              }}
            />
            <Input
              placeholder="Email Address"
              style={{
                width: '100%',
                background: 'var(--color-surface)',
                borderColor: 'rgba(0, 0, 0, 0.2)',
                color: 'var(--color-text-body)',
              }}
            />
            <button
              className="btn-primary"
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                background: 'var(--color-primary)',
              }}
            >
              Submit
            </button>
          </Space>
        </div>

        {/* Status Tags */}
        <div className="preview-card">
          <h3 className="preview-title" style={{ fontSize: '18px', marginBottom: '16px' }}>
            Status Indicators
          </h3>
          <Space wrap>
            <span
              className="tag-success"
              style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '12px' }}
            >
              <CheckCircleOutlined /> Success
            </span>
            <span
              className="tag-error"
              style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '12px' }}
            >
              <CloseCircleOutlined /> Error
            </span>
            <span
              className="tag-warning"
              style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '12px' }}
            >
              <WarningOutlined /> Warning
            </span>
            <span
              className="tag-info"
              style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '12px' }}
            >
              <InfoCircleOutlined /> Info
            </span>
          </Space>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginTop: '16px',
          }}
        >
          <div className="preview-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              128
            </div>
            <div className="preview-text" style={{ fontSize: '14px' }}>
              Total Users
            </div>
          </div>
          <div className="preview-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
              89
            </div>
            <div className="preview-text" style={{ fontSize: '14px' }}>
              Active Now
            </div>
          </div>
          <div className="preview-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
              234
            </div>
            <div className="preview-text" style={{ fontSize: '14px' }}>
              Completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
