import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Text, List, Divider, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { 
  Star, 
  Check, 
  BookOpen, 
  Gear, 
  CaretRight,
  Minus,
  Plus
} from 'phosphor-react-native';
import { useUserStore } from '../stores/userStore';
import { colors, spacing, fontSize } from '../constants/theme';
import { DrawerParamList } from '../navigation/AppNavigator';
import HeaderNav, { HeaderNavContent } from '../components/common/HeaderNav';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { settings, updateSettings, starWords, passWords } = useUserStore();
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleRateChange = (increment: number) => {
    const newRate = Math.max(0.5, Math.min(2.0, settings.speechRate + increment));
    updateSettings({ speechRate: newRate });
  };

  const handlePitchChange = (increment: number) => {
    const newPitch = Math.max(0.5, Math.min(2.0, settings.speechPitch + increment));
    updateSettings({ speechPitch: newPitch });
  };

  const openDataSourceSettings = () => {
    // 预留：打开数据源设置
  };

  return (
    <View style={styles.container}>
      {/* 导航栏 */}
      <HeaderNav 
        title="设置"
        onMenuPress={() => navigation.openDrawer()}
        scrollY={scrollPosition}
      />

      <HeaderNavContent
        style={styles.scrollView}
        onScrollPositionChange={setScrollPosition}
      >
      {/* 学习统计 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>学习统计</Text>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Star size={24} color={colors.star} weight="fill" />
            <Text style={styles.statValue}>{starWords.length}</Text>
            <Text style={styles.statLabel}>重点学</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Check size={24} color={colors.pass} weight="bold" />
            <Text style={styles.statValue}>{passWords.length}</Text>
            <Text style={styles.statLabel}>已掌握</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <BookOpen size={24} color={colors.primary} weight="regular" />
            <Text style={styles.statValue}>{starWords.length + passWords.length}</Text>
            <Text style={styles.statLabel}>总标记</Text>
          </View>
        </View>
      </View>

      {/* 发音设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>发音设置</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>语速</Text>
            <View style={styles.settingControl}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handleRateChange(-0.1)}
              >
                <Minus size={16} color={colors.primary} weight="bold" />
              </TouchableOpacity>
              <Text style={styles.settingValue}>{settings.speechRate.toFixed(1)}x</Text>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handleRateChange(0.1)}
              >
                <Plus size={16} color={colors.primary} weight="bold" />
              </TouchableOpacity>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>音调</Text>
            <View style={styles.settingControl}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handlePitchChange(-0.1)}
              >
                <Minus size={16} color={colors.primary} weight="bold" />
              </TouchableOpacity>
              <Text style={styles.settingValue}>{settings.speechPitch.toFixed(1)}</Text>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handlePitchChange(0.1)}
              >
                <Plus size={16} color={colors.primary} weight="bold" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 数据源设置（预留） */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>数据源设置</Text>
        <View style={styles.settingCard}>
          <TouchableOpacity style={styles.listItem} onPress={openDataSourceSettings}>
            <Text style={styles.listItemText}>图片来源</Text>
            <Text style={styles.listItemValue}>
              {settings.imageSource === 'bing' ? 'Bing 图片' : 'Google 图片'}
            </Text>
          </TouchableOpacity>

          <Divider style={styles.divider} />

          <TouchableOpacity style={styles.listItem} onPress={openDataSourceSettings}>
            <Text style={styles.listItemText}>词典来源</Text>
            <Text style={styles.listItemValue}>
              {settings.dictSource === 'bing' ? 'Bing 词典' : 'Google 词典'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hintText}>云端同步功能即将推出</Text>
      </View>

      {/* 关于 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关于</Text>
        <View style={styles.settingCard}>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>版本</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.divider,
  },
  settingCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  settingLabel: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  settingControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    fontSize: fontSize.lg,
    color: colors.primary,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'center',
  },
  divider: {
    backgroundColor: colors.divider,
    height: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  listItemText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  listItemValue: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  hintText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  aboutLabel: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  aboutValue: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  bottomPadding: {
    height: 40,
  },
});
