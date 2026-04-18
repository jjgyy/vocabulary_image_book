import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SquaresFour, CaretRight } from 'phosphor-react-native';
import { colors, spacing, fontSize } from '../constants/theme';
import { DrawerParamList, RootStackParamList } from '../navigation/AppNavigator';
import HeaderNav, { HeaderNavContent } from '../components/common/HeaderNav';

type NavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<DrawerParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface MenuItem {
  label: string;
  description?: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [scrollPosition, setScrollPosition] = useState(0);

  const menuItems: MenuItem[] = [
    {
      label: '卡片布局',
      description: '自定义单词卡片的模块顺序与显示',
      icon: <SquaresFour size={22} color={colors.primary} weight="fill" />,
      onPress: () => navigation.navigate('CardLayout'),
    },
  ];

  return (
    <View style={styles.container}>
      <HeaderNav
        title="设置"
        onMenuPress={() => navigation.openDrawer()}
        scrollY={scrollPosition}
      />

      <HeaderNavContent
        style={styles.scrollView}
        onScrollPositionChange={setScrollPosition}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>应用</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <View key={item.label}>
                {index > 0 && <View style={styles.separator} />}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconWrap}>{item.icon}</View>
                  <View style={styles.menuTextWrap}>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    {item.description ? (
                      <Text style={styles.menuDescription}>{item.description}</Text>
                    ) : null}
                  </View>
                  <CaretRight size={16} color={colors.textMuted} weight="bold" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </HeaderNavContent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
  },
  menuLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text,
  },
  menuDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginLeft: 36 + spacing.md * 2,
  },
  bottomPadding: {
    height: 40,
  },
});
