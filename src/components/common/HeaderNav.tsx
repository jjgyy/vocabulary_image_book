import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, ScrollView, ScrollViewProps, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { List, CaretLeft } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, fontSize } from '../../constants/theme';

// 导航栏基础内容高度（不含安全区）
export const HEADER_HEIGHT = 44;

// 毛玻璃效果开始渐现的滚动距离（px）
const FADE_START = 0;
const FADE_END = 60;

interface HeaderNavProps {
  title: string;
  /** 根页面传 onMenuPress 显示菜单按钮，二级页面传 onBack 显示返回按钮 */
  onMenuPress?: () => void;
  onBack?: () => void;
  /** 当前页面滚动偏移量，用于控制毛玻璃渐现 */
  scrollY?: number;
  /** 右侧可选操作按钮 */
  rightAction?: { icon: React.ReactNode; onPress: () => void };
}

// 带导航栏的页面内容包装组件
interface HeaderNavContentProps extends ScrollViewProps {
  children: React.ReactNode;
  onScrollPositionChange?: (y: number) => void;
  /** 额外底部 padding（如底部控制栏高度），会自动叠加 insets.bottom */
  extraBottomPadding?: number;
}

export function HeaderNavContent({ children, onScrollPositionChange, extraBottomPadding = 0, ...scrollViewProps }: HeaderNavContentProps) {
  const insets = useSafeAreaInsets();
  const topPadding = HEADER_HEIGHT + insets.top + spacing.sm;
  const bottomPadding = extraBottomPadding + insets.bottom;

  return (
    <ScrollView
      {...scrollViewProps}
      contentContainerStyle={[
        { paddingTop: topPadding, paddingBottom: bottomPadding },
        scrollViewProps.contentContainerStyle,
      ]}
      onScroll={(event) => {
        onScrollPositionChange?.(event.nativeEvent.contentOffset.y);
        scrollViewProps.onScroll?.(event);
      }}
      scrollEventThrottle={16}
    >
      {children}
    </ScrollView>
  );
}

export default function HeaderNav({ 
  title, 
  onMenuPress,
  onBack,
  scrollY = 0,
  rightAction,
}: HeaderNavProps) {
  const insets = useSafeAreaInsets();
  const headerHeight = HEADER_HEIGHT + insets.top;

  // 毛玻璃背景透明度：随 scrollY 从 0 渐变到 1
  const bgOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const clampedBg = Math.min(Math.max((scrollY - FADE_START) / (FADE_END - FADE_START), 0), 1);

    Animated.timing(bgOpacity, {
      toValue: clampedBg,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [scrollY]);

  return (
    <View style={[styles.header, { height: headerHeight, paddingTop: insets.top }]} testID="header-nav">
      {/* 毛玻璃背景层 - 使用原生 BlurView，随滚动渐现 */}
      <Animated.View
        style={[styles.headerBackground, { opacity: bgOpacity }]}
        testID="header-bg"
      >
        {Platform.OS === 'ios' ? (
          // iOS 原生 UIVisualEffectView 毛玻璃
          <BlurView
            intensity={40}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        ) : (
          // Web / Android 用 CSS backdrop-filter
          <View
            style={[
              StyleSheet.absoluteFill,
              Platform.select({
                web: {
                  backdropFilter: 'blur(20px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                } as any,
                android: {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                },
              }),
            ]}
          />
        )}
      </Animated.View>

      {/* 导航栏内容行 */}
      <View style={styles.headerContent} testID="header-content">
        {/* 左侧：返回按钮 or 菜单按钮 */}
        <TouchableOpacity
          style={styles.circleButton}
          onPress={onBack ?? onMenuPress}
          testID={onBack ? 'back-button' : 'menu-button'}
          activeOpacity={0.7}
        >
          {onBack
            ? <CaretLeft size={18} color={colors.text} weight="bold" />
            : <List size={18} color={colors.text} weight="regular" />
          }
        </TouchableOpacity>

        {/* 居中标题：绝对定位居中，不受左侧按钮影响 */}
        <Text
          style={styles.headerTitle}
          testID="header-title"
        >
          {title}
        </Text>

        {/* 右侧可选操作按钮 */}
        {rightAction && (
          <TouchableOpacity
            style={[styles.circleButton, styles.rightButton]}
            onPress={rightAction.onPress}
            activeOpacity={0.7}
          >
            {rightAction.icon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    justifyContent: 'flex-end',
    // 无底部边界线
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden', // BlurView 需要 overflow hidden 才能裁剪
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HEADER_HEIGHT - spacing.xs,
  },
  circleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
  },
  rightButton: {
    marginLeft: 'auto',
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 0.2,
    pointerEvents: 'none',
  },
});
