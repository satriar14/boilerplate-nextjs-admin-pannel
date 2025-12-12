'use client';

import { Card, Alert, Space, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { ThemeColors } from '@/lib/redux/slices/themeGeneratorSlice';
import { getContrastRatio, meetsContrastAA } from '@/lib/utils/colorUtils';

const { Text } = Typography;

interface ContrastCheckerProps {
  colors: ThemeColors;
}

interface ContrastResult {
  label: string;
  foreground: string;
  background: string;
  ratio: number;
  passes: boolean;
  isLargeText?: boolean;
}

export default function ContrastChecker({ colors }: ContrastCheckerProps) {
  const checks: ContrastResult[] = [
    {
      label: 'Heading on Background',
      foreground: colors.textHeading,
      background: colors.background,
      ratio: getContrastRatio(colors.textHeading, colors.background),
      passes: meetsContrastAA(colors.textHeading, colors.background, true), // Heading is large text (3:1)
      isLargeText: true,
    },
    {
      label: 'Body Text on Background',
      foreground: colors.textBody,
      background: colors.background,
      ratio: getContrastRatio(colors.textBody, colors.background),
      passes: meetsContrastAA(colors.textBody, colors.background, false), // Body text is normal (4.5:1)
      isLargeText: false,
    },
    {
      label: 'Heading on Surface',
      foreground: colors.textHeading,
      background: colors.surface,
      ratio: getContrastRatio(colors.textHeading, colors.surface),
      passes: meetsContrastAA(colors.textHeading, colors.surface, true), // Heading is large text (3:1)
      isLargeText: true,
    },
    {
      label: 'Body Text on Surface',
      foreground: colors.textBody,
      background: colors.surface,
      ratio: getContrastRatio(colors.textBody, colors.surface),
      passes: meetsContrastAA(colors.textBody, colors.surface, false), // Body text is normal (4.5:1)
      isLargeText: false,
    },
    {
      label: 'Primary Button Text',
      foreground: '#ffffff',
      background: colors.primary,
      ratio: getContrastRatio('#ffffff', colors.primary),
      passes: meetsContrastAA('#ffffff', colors.primary, true), // Button text is usually large (3:1)
      isLargeText: true,
    },
    {
      label: 'Success Text on Background',
      foreground: colors.success,
      background: colors.background,
      ratio: getContrastRatio(colors.success, colors.background),
      passes: meetsContrastAA(colors.success, colors.background, false), // Status text is normal (4.5:1)
      isLargeText: false,
    },
    {
      label: 'Error Text on Background',
      foreground: colors.error,
      background: colors.background,
      ratio: getContrastRatio(colors.error, colors.background),
      passes: meetsContrastAA(colors.error, colors.background, false), // Status text is normal (4.5:1)
      isLargeText: false,
    },
  ];

  const failedChecks = checks.filter((check) => !check.passes);
  const passedChecks = checks.filter((check) => check.passes);

  return (
    <Card title="Contrast Checker (WCAG AA)" className="mb-4">
      <Space direction="vertical" className="w-full" size="small">
        {failedChecks.length > 0 && (
          <Alert
            message={`${failedChecks.length} contrast issue(s) found`}
            description="Some color combinations may not meet accessibility standards."
            type="warning"
            icon={<WarningOutlined />}
            showIcon
          />
        )}

        {failedChecks.length === 0 && (
          <Alert
            message="All contrast checks passed!"
            description="Your color combinations meet WCAG AA accessibility standards."
            type="success"
            icon={<CheckCircleOutlined />}
            showIcon
          />
        )}

        <div style={{ marginTop: '16px' }}>
          {checks.map((check, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: index < checks.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <div style={{ flex: 1 }}>
                <Text strong style={{ fontSize: '12px' }}>
                  {check.label}
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      backgroundColor: check.foreground,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }}
                  />
                  <Text style={{ fontSize: '11px', color: '#666' }}>on</Text>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      backgroundColor: check.background,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ textAlign: 'right' }}>
                  {check.passes ? (
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
                  )}
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                    {check.ratio.toFixed(2)}:1
                  </div>
                  <div style={{ fontSize: '10px', color: check.passes ? '#52c41a' : '#ff4d4f', marginTop: '2px' }}>
                    {check.passes ? 'Pass' : 'Fail'} (Min {check.isLargeText ? '3' : '4.5'}:1)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '12px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
          <Text style={{ fontSize: '11px', color: '#666' }}>
            <strong>WCAG AA Standards:</strong> Normal text requires 4.5:1 contrast ratio, large text requires 3:1.
          </Text>
        </div>
      </Space>
    </Card>
  );
}

