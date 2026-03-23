// 主题类型定义 - 支持 Light/Dark 模式切换
export type ThemeType = 'light' | 'dark';

// 简约科技感配色方案 - Light 主题（主色调）
const lightColors = {
  // 主色调 - 科技蓝
  primary: '#2563EB', // 科技蓝
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  
  // 背景色 - 纯净白
  background: '#FFFFFF',
  surface: '#FAFAFA', // 卡片背景 - 微灰白
  surfaceLight: '#F5F5F5', // 高亮背景
  
  // 文字颜色
  text: '#111827', // 深灰黑 - 主文字
  textSecondary: '#6B7280', // 中灰 - 次要文字
  textMuted: '#9CA3AF', // 浅灰 - 弱化文字
  
  // 状态颜色
  star: '#F59E0B', // 重点学 - 琥珀金
  pass: '#10B981', // 已掌握 - 翠绿
  error: '#EF4444',
  warning: '#F59E0B',
  
  // 边框和分割线 - 极浅灰
  border: '#E5E7EB',
  divider: '#F3F4F6',
  
  // 透明
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Dark 主题配色（预留）
const darkColors = {
  // 主色调
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#60A5FA',
  
  // 背景色
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',
  
  // 文字颜色
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  
  // 状态颜色
  star: '#FBBF24',
  pass: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  
  // 边框和分割线
  border: '#374151',
  divider: '#1F2937',
  
  // 透明
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

// 获取主题颜色的函数（支持动态切换）
export const getColors = (theme: ThemeType = 'light') => {
  return theme === 'dark' ? darkColors : lightColors;
};

// 默认导出 light 主题颜色
export const colors = lightColors;

// 字体大小
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

// 间距
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

// 圆角
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

// 阴影 - 更柔和的科技感阴影
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  // 卡片悬浮效果
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
};

// React Native Paper 主题配置
export const paperTheme = {
  colors: {
    primary: colors.primary,
    background: colors.background,
    surface: colors.surface,
    accent: colors.primary,
    text: colors.text,
    disabled: colors.textMuted,
    placeholder: colors.textMuted,
    backdrop: colors.overlay,
    onSurface: colors.text,
    notification: colors.primary,
  },
  roundness: borderRadius.md,
};
