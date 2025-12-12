/**
 * Color utility functions for theme generator
 */

export interface ColorHarmony {
  primary: string;
  secondary: string;
  accent: string;
}

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculate relative luminance for contrast checking
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 * WCAG AA requires at least 4.5:1 for normal text, 3:1 for large text
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standards
 */
export function meetsContrastAA(
  foreground: string,
  background: string,
  isLargeText = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Generate complementary color (180 degrees on color wheel)
 */
export function getComplementaryColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}

/**
 * Generate analogous colors (adjacent on color wheel)
 */
export function getAnalogousColors(hex: string): { color1: string; color2: string } {
  const rgb = hexToRgb(hex);
  if (!rgb) return { color1: hex, color2: hex };

  // Simple analogous: shift hue by ±30 degrees
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const h1 = (hsl.h + 30) % 360;
  const h2 = (hsl.h - 30 + 360) % 360;

  return {
    color1: hslToHex(h1, hsl.s, hsl.l),
    color2: hslToHex(h2, hsl.s, hsl.l),
  };
}

/**
 * Generate triadic colors (120 degrees apart)
 */
export function getTriadicColors(hex: string): { color1: string; color2: string } {
  const rgb = hexToRgb(hex);
  if (!rgb) return { color1: hex, color2: hex };

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const h1 = (hsl.h + 120) % 360;
  const h2 = (hsl.h + 240) % 360;

  return {
    color1: hslToHex(h1, hsl.s, hsl.l),
    color2: hslToHex(h2, hsl.s, hsl.l),
  };
}

/**
 * RGB to HSL conversion
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * HSL to Hex conversion
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return rgbToHex(r, g, b);
}

/**
 * Generate color harmony based on primary color
 */
export function generateColorHarmony(
  primary: string,
  harmonyType: 'complementary' | 'analogous' | 'triadic' = 'complementary'
): ColorHarmony {
  let secondary = '';
  let accent = '';

  switch (harmonyType) {
    case 'complementary':
      secondary = getComplementaryColor(primary);
      accent = getAnalogousColors(primary).color1;
      break;
    case 'analogous':
      const analogous = getAnalogousColors(primary);
      secondary = analogous.color1;
      accent = analogous.color2;
      break;
    case 'triadic':
      const triadic = getTriadicColors(primary);
      secondary = triadic.color1;
      accent = triadic.color2;
      break;
  }

  return { primary, secondary, accent };
}

/**
 * Adjust color brightness
 */
export function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = 1 + percent / 100;
  const r = Math.min(255, Math.max(0, Math.round(rgb.r * factor)));
  const g = Math.min(255, Math.max(0, Math.round(rgb.g * factor)));
  const b = Math.min(255, Math.max(0, Math.round(rgb.b * factor)));

  return rgbToHex(r, g, b);
}

/**
 * Convert hex color to rgba with opacity
 */
export function hexToRgba(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

