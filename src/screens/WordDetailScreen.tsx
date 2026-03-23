import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
  X, 
  Star, 
  Check, 
  Image as ImageIcon, 
  Book,
  SpeakerHigh
} from 'phosphor-react-native';
import WebView from '../components/common/WebView';
import { useUserStore } from '../stores/userStore';
import { getWordById } from '../data/words';
import { colors, spacing, fontSize } from '../constants/theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WordDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const { wordId } = route.params as { wordId: string };
  const word = getWordById(wordId);
  
  const {
    settings,
    markWord,
    unmarkWord,
    isStarWord,
    isPassWord,
  } = useUserStore();

  const [showImage, setShowImage] = React.useState(false);
  const [showDict, setShowDict] = React.useState(false);

  if (!word) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>单词未找到</Text>
      </View>
    );
  }

  const handleMarkStar = () => {
    if (isStarWord(wordId)) {
      unmarkWord(wordId);
    } else {
      markWord(wordId, 'star');
    }
  };

  const handleMarkPass = () => {
    if (isPassWord(wordId)) {
      unmarkWord(wordId);
    } else {
      markWord(wordId, 'pass');
    }
  };

  const getImageUrl = () => {
    const query = encodeURIComponent(word.word);
    if (settings.imageSource === 'bing') {
      return `https://www.bing.com/images/search?q=${query}`;
    }
    return `https://www.google.com/search?tbm=isch&q=${query}`;
  };

  const getDictUrl = () => {
    const query = encodeURIComponent(word.word);
    if (settings.dictSource === 'bing') {
      return `https://www.bing.com/dict/search?q=${query}`;
    }
    return `https://www.google.com/search?q=define+${query}`;
  };

  return (
    <View style={styles.container}>
      {/* 关闭按钮 */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <X size={20} color={colors.text} weight="bold" />
      </TouchableOpacity>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* 单词基本信息 */}
        <View style={styles.header}>
          <Text style={styles.wordText}>{word.word}</Text>
          <Text style={styles.phoneticText}>{word.phonetic}</Text>
          <Text style={styles.posText}>{word.pos}</Text>
          <Text style={styles.meaningText}>{word.meaning}</Text>
        </View>

        {/* 标记按钮 */}
        <View style={styles.markButtons}>
          <TouchableOpacity
            style={[
              styles.markButton,
              isStarWord(wordId) && styles.starButtonActive,
            ]}
            onPress={handleMarkStar}
          >
            <Star 
              size={20} 
              color={isStarWord(wordId) ? colors.star : colors.textSecondary} 
              weight={isStarWord(wordId) ? "fill" : "regular"}
            />
            <Text style={[styles.markButtonText, isStarWord(wordId) && styles.starButtonText]}>
              {isStarWord(wordId) ? '已标记重点学' : '标记重点学'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.markButton,
              isPassWord(wordId) && styles.passButtonActive,
            ]}
            onPress={handleMarkPass}
          >
            <Check 
              size={20} 
              color={isPassWord(wordId) ? colors.pass : colors.textSecondary} 
              weight="bold"
            />
            <Text style={[styles.markButtonText, isPassWord(wordId) && styles.passButtonText]}>
              {isPassWord(wordId) ? '已标记已掌握' : '标记已掌握'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 词根词缀 */}
        {word.etymology && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>词根词缀</Text>
            <Text style={styles.sectionText}>{word.etymology}</Text>
          </View>
        )}

        {/* 关联词汇 */}
        {word.relatedWords && word.relatedWords.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>关联词汇</Text>
            <View style={styles.relatedWordsContainer}>
              {word.relatedWords.map((relatedWord, index) => (
                <View key={index} style={styles.relatedWordTag}>
                  <Text style={styles.relatedWordText}>{relatedWord}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 例句 */}
        {word.examples && word.examples.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>例句</Text>
            {word.examples.map((example, index) => (
              <View key={index} style={styles.exampleItem}>
                <Text style={styles.exampleSentence}>{example.sentence}</Text>
                <Text style={styles.exampleTranslation}>{example.translation}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 展开图片 */}
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setShowImage(!showImage)}
        >
          <ImageIcon size={20} color={colors.primary} weight="regular" />
          <Text style={styles.expandButtonText}>
            {showImage ? '收起图片' : '展开图片'}
          </Text>
        </TouchableOpacity>

        {showImage && (
          <View style={styles.webviewContainer}>
            <WebView
              source={{ uri: getImageUrl() }}
              style={styles.webview}
              startInLoadingState
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>加载中...</Text>
                </View>
              )}
            />
          </View>
        )}

        {/* 展开字典 */}
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setShowDict(!showDict)}
        >
          <Book size={20} color={colors.primary} weight="regular" />
          <Text style={styles.expandButtonText}>
            {showDict ? '收起字典' : '展开字典'}
          </Text>
        </TouchableOpacity>

        {showDict && (
          <View style={styles.webviewContainer}>
            <WebView
              source={{ uri: getDictUrl() }}
              style={styles.webview}
              startInLoadingState
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>加载中...</Text>
                </View>
              )}
            />
          </View>
        )}

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
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: fontSize.lg,
    color: colors.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: 60,
  },
  header: {
    marginBottom: spacing.xl,
  },
  wordText: {
    fontSize: fontSize['4xl'],
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  phoneticText: {
    fontSize: fontSize.lg,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  posText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  meaningText: {
    fontSize: fontSize.xl,
    color: colors.text,
  },
  markButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  markButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
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
  markButtonText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  section: {
    marginBottom: spacing.xl,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  sectionText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  relatedWordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  relatedWordTag: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  relatedWordText: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  exampleItem: {
    marginBottom: spacing.md,
  },
  exampleSentence: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
  exampleTranslation: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  expandButton: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  expandButtonText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
  webviewContainer: {
    height: 400,
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  bottomPadding: {
    height: 40,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
});
