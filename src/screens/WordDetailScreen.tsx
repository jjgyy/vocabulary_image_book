import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
  X, 
  Star, 
  Check, 
  SpeakerHigh
} from 'phosphor-react-native';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import WebView from '../components/common/WebView';
import CoverImageModal from '../components/common/CoverImageModal';
import { WordCardModule } from '../components/common/WordCardModule';
import { useUserStore } from '../stores/userStore';
import { getWordByIdFromBook } from '../data/wordBooks';
import { colors, spacing, fontSize } from '../constants/theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardModule } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WordDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { wordId } = route.params as { wordId: string };
  
  const {
    settings,
    markWord,
    unmarkWord,
    isStarWord,
    isPassWord,
    coverImages,
  } = useUserStore();

  const word = getWordByIdFromBook(settings.selectedBookId, wordId);

  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [dictUrl, setDictUrl] = React.useState<string | null>(null);

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

  const handleSpeak = () => {
    Speech.stop();
    Speech.speak(word.word, {
      rate: settings.speechRate,
      pitch: settings.speechPitch,
    });
  };

  return (
    <View style={styles.container}>
      {/* 封面背景图（固定在顶部） */}
      {coverImages[wordId] ? (
        <View style={styles.coverContainer} pointerEvents="none">
          <Image
            source={{ uri: coverImages[wordId] }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
          <View style={styles.coverOverlay} />
          {/* 底部渐变，自然过渡到白色背景 */}
          <LinearGradient
            colors={['rgba(255,255,255,0)', '#FFFFFF']}
            style={styles.coverGradient}
          />
        </View>
      ) : null}

      {/* 顶部关闭栏 */}
      <View style={[styles.topBar, { paddingTop: spacing.md }]}>
        <Text style={styles.topBarTitle}>{word.word}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <X size={16} color={colors.text} weight="bold" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + spacing.xl }]}
      >
        {/* 单词卡片 - 按 cardLayout 渲染 */}
        <View style={styles.wordCard}>
          {settings.cardLayout
            .filter((m: CardModule) => m.enabled)
            .map((module: CardModule) => (
              <WordCardModule
                key={module.id}
                module={module}
                word={word}
                onShowImages={(url) => setImageUrl(url)}
                onShowDict={(url) => setDictUrl(url)}
                onSpeak={handleSpeak}
              />
            ))
          }
        </View>

        {/* 标记按钮 */}
        <View style={styles.markButtons}>
          <TouchableOpacity
            style={[styles.markButton, isStarWord(wordId) && styles.starButtonActive]}
            onPress={handleMarkStar}
          >
            <Star size={18} color={isStarWord(wordId) ? colors.star : colors.textSecondary} weight={isStarWord(wordId) ? "fill" : "regular"} />
            <Text style={[styles.markButtonText, isStarWord(wordId) && styles.starButtonText]}>
              {isStarWord(wordId) ? '已标记重点学' : '标记重点学'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.markButton, isPassWord(wordId) && styles.passButtonActive]}
            onPress={handleMarkPass}
          >
            <Check size={18} color={isPassWord(wordId) ? colors.pass : colors.textSecondary} weight="bold" />
            <Text style={[styles.markButtonText, isPassWord(wordId) && styles.passButtonText]}>
              {isPassWord(wordId) ? '已标记已掌握' : '标记已掌握'}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* 图片 Modal — 支持点击设为封面 */}
      <CoverImageModal
        visible={!!imageUrl}
        url={imageUrl ?? ''}
        wordId={wordId}
        title={word.word}
        onClose={() => setImageUrl(null)}
      />

      {/* 字典 Modal */}
      <Modal
        visible={!!dictUrl}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDictUrl(null)}
      >
        <View style={styles.imageModal}>
          <View style={styles.imageModalHeader}>
            <Text style={styles.imageModalTitle}>{word.word} — 词典</Text>
            <TouchableOpacity style={styles.imageModalClose} onPress={() => setDictUrl(null)}>
              <X size={16} color={colors.text} weight="bold" />
            </TouchableOpacity>
          </View>
          {dictUrl ? <WebView source={{ uri: dictUrl }} style={{ flex: 1 }} startInLoadingState /> : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  topBarTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(120,120,128,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordCard: {
    paddingBottom: spacing.lg,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  imageModal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  imageModalTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  imageModalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(120,120,128,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
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
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
  coverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  coverGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
});
