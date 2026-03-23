import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Star, Check, MagnifyingGlass } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '../stores/userStore';
import { getAllWords } from '../data/words';
import { Word, WordListFilter } from '../types';
import { colors, spacing, fontSize } from '../constants/theme';
import { DrawerParamList, RootStackParamList } from '../navigation/AppNavigator';
import HeaderNav, { HeaderNavContent, HEADER_HEIGHT } from '../components/common/HeaderNav';

type DrawerNavProp = DrawerNavigationProp<DrawerParamList>;
type StackNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function WordListScreen() {
  const navigation = useNavigation<DrawerNavProp & StackNavProp>();
  const insets = useSafeAreaInsets();
  const { starWords, passWords } = useUserStore();
  const [filter, setFilter] = useState<WordListFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  // 顶部固定区域高度：导航栏 + 搜索栏 + 筛选栏
  const STATS_BAR_HEIGHT = 44;
  const topFixedHeight = HEADER_HEIGHT + insets.top + 48 + spacing.lg * 2 + 36 + spacing.md;
  const statsBarHeight = STATS_BAR_HEIGHT + insets.bottom;

  const getFilteredWords = (): Word[] => {
    let filtered = getAllWords();

    // 按类型筛选
    switch (filter) {
      case 'star':
        filtered = filtered.filter(w => starWords.includes(w.id));
        break;
      case 'pass':
        filtered = filtered.filter(w => passWords.includes(w.id));
        break;
      default:
        break;
    }

    // 按搜索词筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        w =>
          w.word.toLowerCase().includes(query) ||
          w.meaning.includes(query)
      );
    }

    return filtered;
  };

  const handleWordPress = (wordId: string) => {
    navigation.navigate('WordDetail', { wordId });
  };

  const renderWordItem = ({ item }: { item: Word }) => {
    const isStar = starWords.includes(item.id);
    const isPass = passWords.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.wordItem}
        onPress={() => handleWordPress(item.id)}
      >
        <View style={styles.wordHeader}>
          <Text style={styles.wordText}>{item.word}</Text>
          <View style={styles.markers}>
            {isStar && <Star size={16} color={colors.star} weight="fill" />}
            {isPass && <Check size={16} color={colors.pass} weight="bold" />}
          </View>
        </View>
        <Text style={styles.phoneticText}>{item.phonetic}</Text>
        <Text style={styles.meaningText} numberOfLines={1}>
          {item.meaning}
        </Text>
      </TouchableOpacity>
    );
  };

  const filteredWords = getFilteredWords();

  return (
    <View style={styles.container}>
      {/* 导航栏 */}
      <HeaderNav 
        title="单词列表"
        onMenuPress={() => navigation.openDrawer()}
        scrollY={scrollPosition}
      />

      {/* 搜索栏 + 筛选栏 — 顶部留白考虑导航栏高度 */}
      <View style={[styles.topControls, { paddingTop: HEADER_HEIGHT + insets.top + spacing.sm }]}>
        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <MagnifyingGlass size={20} color={colors.textSecondary} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索单词..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.filterContainer}>
          {(['all', 'star', 'pass'] as WordListFilter[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterButton, filter === f && styles.filterButtonActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? '全部' : f === 'star' ? '重点学' : '已掌握'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 单词列表 */}
      <FlatList
        data={filteredWords}
        renderItem={renderWordItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContainer, { paddingBottom: statsBarHeight + spacing.md }]}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => setScrollPosition(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无单词</Text>
          </View>
        }
      />

      {/* 统计信息栏 - 自动适配 bottom 安全区 */}
      <View style={[styles.statsContainer, { paddingBottom: insets.bottom + spacing.md, height: statsBarHeight }]}>
        <Text style={styles.statsText}>
          共 {filteredWords.length} 个单词 | 重点学 {starWords.length} | 已掌握 {passWords.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topControls: {
    // paddingTop 由组件内联注入（含 insets.top + 导航栏高度）
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    backgroundColor: colors.background,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 44,
    marginBottom: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
    padding: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.background,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    // paddingBottom 由组件内联注入（含 statsBarHeight）
  },
  wordItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  wordText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  markers: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  starMarker: {
    fontSize: fontSize.md,
    color: colors.star,
  },
  passMarker: {
    fontSize: fontSize.md,
    color: colors.pass,
  },
  phoneticText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  meaningText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
  },
  statsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    // paddingBottom 和 height 由组件内联注入（含 insets.bottom）
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statsText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
