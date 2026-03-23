import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Animated
} from 'react-native';
import { Text } from 'react-native-paper';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { 
  Star, 
  Check, 
  CaretLeft, 
  CaretRight, 
  SpeakerHigh,
  ArrowClockwise
} from 'phosphor-react-native';
import { useUserStore } from '../stores/userStore';
import { getWordById } from '../data/words';
import { colors, spacing, fontSize, shadows } from '../constants/theme';
import { DrawerParamList } from '../navigation/AppNavigator';
import HeaderNav, { HeaderNavContent, HEADER_HEIGHT } from '../components/common/HeaderNav';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

export default function LearningScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  // 底部控制栏高度：内容区 + 安全区
  const CONTROL_BAR_CONTENT_HEIGHT = 80; // 控制栏自身内容高度
  const controlBarHeight = CONTROL_BAR_CONTENT_HEIGHT + insets.bottom;
  const {
    initializeDailyWords,
    currentRoundWords,
    getCurrentWordId,
    nextWord,
    prevWord,
    markWord,
    unmarkWord,
    isStarWord,
    isPassWord,
    getProgress,
    hasCompletedRound,
    startNewRound,
  } = useUserStore();

  useEffect(() => {
    initializeDailyWords();
  }, []);

  // 导航栏毛玻璃渐变由 HeaderNav 内部自动处理，只需传递 scrollPosition
  const [scrollPosition, setScrollPosition] = useState(0);

  const currentWordId = getCurrentWordId();
  const currentWord = currentWordId ? getWordById(currentWordId) : null;
  const progress = getProgress();
  const completed = hasCompletedRound();
  const { settings } = useUserStore();

  const handleMarkStar = () => {
    if (!currentWordId) return;
    if (isStarWord(currentWordId)) {
      unmarkWord(currentWordId);
    } else {
      markWord(currentWordId, 'star');
    }
  };

  const handleMarkPass = () => {
    if (!currentWordId) return;
    if (isPassWord(currentWordId)) {
      unmarkWord(currentWordId);
    } else {
      markWord(currentWordId, 'pass');
    }
  };

  const handleSpeak = () => {
    if (!currentWord) return;
    Speech.stop();
    Speech.speak(currentWord.word, {
      rate: settings.speechRate,
      pitch: settings.speechPitch,
    });
  };

  if (!currentWord) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="learning-screen">
      {/* 动态导航栏 */}
      <HeaderNav 
        title="学习模式"
        onMenuPress={() => navigation.openDrawer()}
        scrollY={scrollPosition}
      />

      {/* 单词卡片区域 */}
      <HeaderNavContent
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
                onScrollPositionChange={setScrollPosition}
        extraBottomPadding={controlBarHeight + 16}
        testID="word-scroll"
      >
        <View style={styles.wordCard} testID="word-card">
          <Text style={styles.wordText} testID="word-text">{currentWord.word}</Text>
          <TouchableOpacity style={styles.phoneticContainer} onPress={handleSpeak} testID="phonetic-btn">
            <SpeakerHigh size={20} color={colors.primary} weight="fill" />
            <Text style={styles.phoneticText} testID="phonetic-text">{currentWord.phonetic}</Text>
          </TouchableOpacity>
          <Text style={styles.posText} testID="pos-text">{currentWord.pos}</Text>
          <Text style={styles.meaningText} testID="meaning-text">{currentWord.meaning}</Text>
          
          {currentWord.etymology && (
            <View style={styles.section} testID="etymology-section">
              <Text style={styles.sectionTitle} testID="etymology-title">词根词缀</Text>
              <Text style={styles.sectionText} testID="etymology-text">{currentWord.etymology}</Text>
            </View>
          )}
          
          {currentWord.examples && currentWord.examples.length > 0 && (
            <View style={styles.section} testID="examples-section">
              <Text style={styles.sectionTitle} testID="examples-title">例句</Text>
              {currentWord.examples.map((example, index) => (
                <View key={index} style={styles.exampleItem} testID={`example-${index}`}>
                  <Text style={styles.exampleSentence} testID={`example-sentence-${index}`}>{example.sentence}</Text>
                  <Text style={styles.exampleTranslation} testID={`example-translation-${index}`}>{example.translation}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </HeaderNavContent>

      {/* 进度条 - 显示在控制栏上方 */}
      <View style={[styles.progressContainer, { bottom: controlBarHeight }]} testID="progress-container">
        <View style={styles.progressBar} testID="progress-bar">
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} testID="progress-fill" />
        </View>
        <Text style={styles.progressText} testID="progress-text">
          {Math.round(progress * currentRoundWords.length)}/{currentRoundWords.length}
        </Text>
      </View>

      {/* 底部控制栏 */}
      <View style={[styles.controlBar, { paddingBottom: insets.bottom + spacing.md, height: controlBarHeight }]} testID="control-bar">
        <TouchableOpacity
          style={[styles.controlButton, isStarWord(currentWordId!) && styles.starButtonActive]}
          onPress={handleMarkStar}
          testID="star-btn"
        >
          <Star 
            size={20} 
            color={isStarWord(currentWordId!) ? colors.star : colors.textSecondary} 
            weight={isStarWord(currentWordId!) ? "fill" : "regular"}
          />
          <Text style={[styles.controlButtonText, isStarWord(currentWordId!) && styles.starButtonText]}>
            重点学
          </Text>
        </TouchableOpacity>

        <View style={styles.navButtons} testID="nav-buttons">
          <TouchableOpacity style={styles.navButton} onPress={prevWord} testID="prev-btn">
            <CaretLeft size={24} color="#FFFFFF" weight="bold" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={nextWord} testID="next-btn">
            <CaretRight size={24} color="#FFFFFF" weight="bold" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.controlButton, isPassWord(currentWordId!) && styles.passButtonActive]}
          onPress={handleMarkPass}
          testID="pass-btn"
        >
          <Check 
            size={20} 
            color={isPassWord(currentWordId!) ? colors.pass : colors.textSecondary} 
            weight="bold"
          />
          <Text style={[styles.controlButtonText, isPassWord(currentWordId!) && styles.passButtonText]}>
            已掌握
          </Text>
        </TouchableOpacity>
      </View>

      {/* 完成轮次提示 */}
      {completed && (
        <TouchableOpacity style={styles.completeButton} onPress={startNewRound}>
          <ArrowClockwise size={20} color="#FFFFFF" weight="bold" />
          <Text style={styles.completeButtonText}>再来一轮</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  floatingMenuButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 100,
    ...shadows.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    // paddingBottom 由 HeaderNavContent 的 extraBottomPadding 动态处理
  },
  wordCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  wordText: {
    fontSize: fontSize['4xl'],
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  phoneticContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  phoneticText: {
    fontSize: fontSize.lg,
    color: colors.primary,
    fontWeight: '500',
  },
  posText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  meaningText: {
    fontSize: fontSize['2xl'],
    color: colors.text,
    marginBottom: spacing.lg,
    fontWeight: '500',
  },
  section: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  sectionText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  exampleItem: {
    marginBottom: spacing.md,
  },
  exampleSentence: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  exampleTranslation: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  progressContainer: {
    position: 'absolute',
    // bottom 由组件内联注入（动态跟随 controlBarHeight）
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: colors.divider,
    borderRadius: 1.5,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 1.5,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    minWidth: 40,
    textAlign: 'right',
  },
  controlBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    // paddingBottom 和 height 由组件内联注入（含 insets.bottom）
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  controlButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.surface,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'column',
    gap: 2,
  },
  controlButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  starButtonActive: {
    backgroundColor: colors.star + '15',
    borderColor: colors.star + '40',
  },
  starButtonText: {
    color: colors.star,
  },
  passButtonActive: {
    backgroundColor: colors.pass + '15',
    borderColor: colors.pass + '40',
  },
  passButtonText: {
    color: colors.pass,
  },
  navButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  navButtonText: {
    fontSize: fontSize.xl,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  completeButton: {
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.md,
  },
  completeButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
});
