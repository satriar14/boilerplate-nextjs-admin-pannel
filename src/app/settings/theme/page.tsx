"use client";

import { useState } from "react";
import {
  Card,
  Row,
  Col,
  ColorPicker,
  Switch,
  Select,
  Button,
  Space,
  Typography,
  Alert,
  Input,
  message,
  App,
} from "antd";
import { CopyOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  setColor,
  setHarmonyType,
  setAutoGenerate,
  resetColors,
  saveTheme,
  setThemeType,
  ThemeColors,
  ThemeType,
} from "@/lib/redux/slices/themeGeneratorSlice";
import { getContrastRatio, meetsContrastAA } from "@/lib/utils/colorUtils";
import LivePreview from "@/components/theme-generator/LivePreview";
import ContrastChecker from "@/components/theme-generator/ContrastChecker";
import PageTransition from "@/components/animations/PageTransition";

const { Title, Text } = Typography;
const { Option } = Select;

export default function ThemeGeneratorPage() {
  const dispatch = useAppDispatch();
  const { message: messageApi } = App.useApp();
  const { colors, harmonyType, autoGenerate, isCustomThemeActive, themeType } =
    useAppSelector((state) => state.themeGenerator);
  const [exportFormat, setExportFormat] = useState<"css" | "tailwind">("css");

  const handleColorChange = (key: keyof ThemeColors, color: any) => {
    // Handle both ColorPicker color object and hex string
    const hexValue = typeof color === "string" ? color : color.toHexString();
    dispatch(setColor({ key, value: hexValue }));
  };

  const handleExport = () => {
    let exportText = "";

    if (exportFormat === "css") {
      exportText = `:root {
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-background: ${colors.background};
  --color-surface: ${colors.surface};
  --color-text-heading: ${colors.textHeading};
  --color-text-body: ${colors.textBody};
  --color-success: ${colors.success};
  --color-error: ${colors.error};
  --color-warning: ${colors.warning};
  --color-info: ${colors.info};
}`;
    } else {
      exportText = `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${colors.primary}',
        secondary: '${colors.secondary}',
        accent: '${colors.accent}',
        background: '${colors.background}',
        surface: '${colors.surface}',
        'text-heading': '${colors.textHeading}',
        'text-body': '${colors.textBody}',
        success: '${colors.success}',
        error: '${colors.error}',
        warning: '${colors.warning}',
        info: '${colors.info}',
      },
    },
  },
};`;
    }

    navigator.clipboard.writeText(exportText);
    messageApi.success(
      `${exportFormat.toUpperCase()} config copied to clipboard!`
    );
  };

  return (
    <PageTransition>
      <div>
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="text-gray-900 dark:text-gray-100">
            Dynamic Theme Generator
          </Title>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => dispatch(resetColors())}>
              Reset
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => {
                dispatch(saveTheme());
                messageApi.success("Theme saved and applied successfully!");
              }}>
              Save Theme
            </Button>
            {isCustomThemeActive && (
              <span style={{ color: "#52c41a", fontSize: "12px" }}>
                ✓ Custom theme active
              </span>
            )}
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          {/* Color Controls */}
          <Col xs={24} lg={10}>
            <Card title="Color Controls" className="mb-4">
              <Space direction="vertical" className="w-full" size="large">
                {/* Theme Type Selector */}
                <div>
                  <Text strong className="block mb-2">
                    Theme Type
                  </Text>
                  <Select
                    value={themeType}
                    onChange={(value: ThemeType) =>
                      dispatch(setThemeType(value))
                    }
                    className="w-full">
                    <Option value="light">
                      Light - Clean and bright theme
                    </Option>
                    <Option value="dark">Dark - Dark mode theme</Option>
                    <Option value="modern">Modern - Contemporary design</Option>
                    <Option value="corporate">
                      Corporate - Professional business theme
                    </Option>
                    <Option value="vibrant">Vibrant - Bold and colorful</Option>
                    <Option value="minimal">Minimal - Simple and clean</Option>
                    <Option value="custom">
                      Custom - Create your own theme
                    </Option>
                  </Select>
                  {themeType !== "custom" && (
                    <Text
                      type="secondary"
                      style={{
                        fontSize: "12px",
                        display: "block",
                        marginTop: "4px",
                      }}>
                      Preset theme selected. Switch to "Custom" to edit colors
                      manually.
                    </Text>
                  )}
                </div>

                {/* Auto Generate Toggle */}
                <div className="flex justify-between items-center">
                  <Text strong>Auto-generate Harmony Colors</Text>
                  <Switch
                    defaultChecked={false}
                    checked={autoGenerate}
                    onChange={(checked) => dispatch(setAutoGenerate(checked))}
                    disabled={themeType !== "custom"}
                  />
                </div>

                {/* Harmony Type */}
                {autoGenerate && (
                  <div>
                    <Text strong className="block mb-2">
                      Harmony Type
                    </Text>
                    <Select
                      value={harmonyType}
                      onChange={(value) => dispatch(setHarmonyType(value))}
                      className="w-full">
                      <Option value="complementary">Complementary</Option>
                      <Option value="analogous">Analogous</Option>
                      <Option value="triadic">Triadic</Option>
                    </Select>
                  </div>
                )}

                {/* Primary Colors */}
                <div>
                  <Text strong className="block mb-2">
                    Primary Color
                  </Text>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        backgroundColor: colors.primary,
                        border: "1px solid rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}
                    />
                    <div className="flex-1">
                      <ColorPicker
                        value={colors.primary}
                        onChange={(color) =>
                          handleColorChange("primary", color)
                        }
                        showText
                        format="hex"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Text strong className="block mb-2">
                    Secondary Color
                  </Text>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        backgroundColor: colors.secondary,
                        border: "1px solid rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}
                    />
                    <div className="flex-1">
                      <ColorPicker
                        value={colors.secondary}
                        onChange={(color) =>
                          handleColorChange("secondary", color)
                        }
                        showText
                        disabled={autoGenerate}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Text strong className="block mb-2">
                    Accent Color
                  </Text>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        backgroundColor: colors.accent,
                        border: "1px solid rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}
                    />
                    <div className="flex-1">
                      <ColorPicker
                        value={colors.accent}
                        onChange={(color) => handleColorChange("accent", color)}
                        showText
                        disabled={autoGenerate}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Background Colors */}
                <div>
                  <Text strong className="block mb-2">
                    Background
                  </Text>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        backgroundColor: colors.background,
                        border: "1px solid rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}
                    />
                    <div className="flex-1">
                      <ColorPicker
                        value={colors.background}
                        onChange={(color) =>
                          handleColorChange("background", color)
                        }
                        showText
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Text strong className="block mb-2">
                    Surface
                  </Text>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        backgroundColor: colors.surface,
                        border: "1px solid rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}
                    />
                    <div className="flex-1">
                      <ColorPicker
                        value={colors.surface}
                        onChange={(color) =>
                          handleColorChange("surface", color)
                        }
                        showText
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Text Colors */}
                <div>
                  <Text strong className="block mb-2">
                    Text Heading
                  </Text>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        backgroundColor: colors.textHeading,
                        border: "1px solid rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}
                    />
                    <div className="flex-1">
                      <ColorPicker
                        value={colors.textHeading}
                        onChange={(color) =>
                          handleColorChange("textHeading", color)
                        }
                        showText
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Text strong className="block mb-2">
                    Text Body
                  </Text>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        backgroundColor: colors.textBody,
                        border: "1px solid rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}
                    />
                    <div className="flex-1">
                      <ColorPicker
                        value={colors.textBody}
                        onChange={(color) =>
                          handleColorChange("textBody", color)
                        }
                        showText
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Colors */}
                <div>
                  <Text strong className="block mb-2">
                    Success
                  </Text>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        backgroundColor: colors.success,
                        border: "1px solid rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}
                    />
                    <div className="flex-1">
                      <ColorPicker
                        value={colors.success}
                        onChange={(color) =>
                          handleColorChange("success", color)
                        }
                        showText
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Text strong className="block mb-2">
                    Error
                  </Text>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        backgroundColor: colors.error,
                        border: "1px solid rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}
                    />
                    <div className="flex-1">
                      <ColorPicker
                        value={colors.error}
                        onChange={(color) => handleColorChange("error", color)}
                        showText
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Text strong className="block mb-2">
                    Warning
                  </Text>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        backgroundColor: colors.warning,
                        border: "1px solid rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}
                    />
                    <div className="flex-1">
                      <ColorPicker
                        value={colors.warning}
                        onChange={(color) =>
                          handleColorChange("warning", color)
                        }
                        showText
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Text strong className="block mb-2">
                    Info
                  </Text>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        backgroundColor: colors.info,
                        border: "1px solid rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}
                    />
                    <div className="flex-1">
                      <ColorPicker
                        value={colors.info}
                        onChange={(color) => handleColorChange("info", color)}
                        showText
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </Space>
            </Card>

            {/* Export Section */}
            <Card title="Export Theme" className="mb-4">
              <Space direction="vertical" className="w-full" size="middle">
                <div>
                  <Text strong className="block mb-2">
                    Export Format
                  </Text>
                  <Select
                    value={exportFormat}
                    onChange={setExportFormat}
                    className="w-full">
                    <Option value="css">CSS Variables</Option>
                    <Option value="tailwind">Tailwind Config</Option>
                  </Select>
                </div>
                <Button
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={handleExport}
                  block>
                  Copy {exportFormat.toUpperCase()} Config
                </Button>
              </Space>
            </Card>

            {/* Contrast Checker */}
            <ContrastChecker colors={colors} />
          </Col>

          {/* Live Preview */}
          <Col xs={24} lg={14}>
            <Card title="Live Preview">
              <LivePreview colors={colors} />
            </Card>
          </Col>
        </Row>
      </div>
    </PageTransition>
  );
}
