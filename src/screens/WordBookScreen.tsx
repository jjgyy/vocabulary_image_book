import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Check, BookOpen } from 'phosphor-react-native';
import { colors, spacing, fontSize } from '../constants/theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import HeaderNav from '../components/common/HeaderNav';
import { WORD_BOOKS, WordBook, WordBookCategory } from '../data/wordBooks';
import { useUserStore } from '../stores/userStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// 分类显示顺序（允许超出 WordBookCategory 类型的标签）
const CATEGORY_ORDER: string[] = [
  '四级',
  '六级',
  '考研',
  '高考',
  '专四',
  '专八',
  '托福',
  'TOEFL',
  '雅思',
  'GRE',
  'SAT',
  'GMAT',
  'BEC',
  '中考',
  '中学',
  '初中',
  '小学',
  '人教版',
  '北师版',
  '外研社版',
  '其他',
];

export default function WordBookScreen() {
  const navigation = useNavigation<NavigationProp>();
  const selectedBookId = useUserStore((s) => s.settings.selectedBookId);
  const selectWordBook = useUserStore((s) => s.selectWordBook);
  const [scrollPosition, setScrollPosition] = useState(0);

  // 按分类分组
  const grouped: Record<string, WordBook[]> = {};
  for (const book of WORD_BOOKS) {
    const cat = book.tags[0] ?? '其他';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(book);
  }

  // 按 CATEGORY_ORDER 排序分类，未收录的分类放末尾
  const categories = [
    ...CATEGORY_ORDER.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c as WordBookCategory)),
  ];

  const handleSelect = (book: WordBook) => {
    if (book.id === selectedBookId) {
      navigation.goBack();
      return;
    }
    Alert.alert(
      '切换单词书',
      `切换到「${book.name}」后，当前轮次将重新开始。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认切换',
          style: 'default',
          onPress: () => {
            selectWordBook(book.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <HeaderNav
        title="选择单词书"
        onBack={() => navigation.goBack()}
        scrollY={scrollPosition}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        onScroll={(e) => setScrollPosition(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {categories.map((cat) => (
          <View key={cat} style={styles.section}>
            <Text style={styles.sectionTitle}>{cat}</Text>
            <View style={styles.card}>
              {grouped[cat].map((book, index) => {
                const isSelected = book.id === selectedBookId;
                return (
                  <View key={book.id}>
                    {index > 0 && <View style={styles.separator} />}
                    <TouchableOpacity
                      style={styles.bookItem}
                      onPress={() => handleSelect(book)}
                      activeOpacity={0.7}
                    >
                      {/* 左侧图标 */}
                      <View style={[styles.iconWrap, isSelected && styles.iconWrapActive]}>
                        <BookOpen
                          size={18}
                          color={isSelected ? colors.primary : colors.textSecondary}
                          weight={isSelected ? 'fill' : 'regular'}
                        />
                      </View>

                      {/* 书名 & 词数 */}
                      <View style={styles.bookInfo}>
                        <Text
                          style={[styles.bookName, isSelected && styles.bookNameActive]}
                          numberOfLines={2}
                        >
                          {book.name}
                        </Text>
                        {book.wordCount > 0 && (
                          <Text style={styles.wordCount}>{book.wordCount} 词</Text>
                        )}
                      </View>

                      {/* 右侧对号 */}
                      {isSelected && (
                        <Check size={18} color={colors.primary} weight="bold" />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginLeft: 36 + spacing.md * 2,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.primary + '18',
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 20,
  },
  bookNameActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  wordCount: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  bottomPadding: {
    height: 40,
  },
});
