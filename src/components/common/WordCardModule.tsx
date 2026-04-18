import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SpeakerHigh } from 'phosphor-react-native';
import { CardModule } from '../../types';
import { colors, spacing, fontSize } from '../../constants/theme';

export interface WordData {
  word: string;
  phonetic: string;
  pos: string;
  meaning: string;
  etymology?: string;
  examples?: { sentence: string; translation: string }[];
  relatedWords?: string[];
}

interface Props {
  module: CardModule;
  word: WordData;
  onShowImages?: (url: string) => void;
  onShowDict?: (url: string) => void;
  onSpeak?: () => void;
}

export function WordCardModule({ module, word, onShowImages, onShowDict, onSpeak }: Props) {
  const encoded = encodeURIComponent(word.word);

  switch (module.id) {
    case 'word':
      return (
        <Text style={styles.wordText}>
          {word.word}
        </Text>
      );

    case 'phonetic':
      return (
        <TouchableOpacity style={styles.phoneticContainer} onPress={onSpeak} activeOpacity={0.7}>
          <SpeakerHigh size={20} color={colors.primary} weight="fill" />
          <Text style={styles.phoneticText}>{word.phonetic}</Text>
        </TouchableOpacity>
      );

    case 'pos':
      return (
        <Text style={styles.posText}>{word.pos}</Text>
      );

    case 'meaning':
      return (
        <Text style={styles.meaningText}>{word.meaning}</Text>
      );

    case 'etymology':
      return word.etymology ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>词根词缀</Text>
          <Text style={styles.sectionText}>{word.etymology}</Text>
        </View>
      ) : null;

    case 'examples':
      return word.examples && word.examples.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>例句</Text>
          {word.examples.map((example, index) => (
            <View key={index} style={styles.exampleItem}>
              <Text style={styles.exampleSentence}>{example.sentence}</Text>
              <Text style={styles.exampleTranslation}>{example.translation}</Text>
            </View>
          ))}
        </View>
      ) : null;

    case 'relatedWords':
      return word.relatedWords && word.relatedWords.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关联词汇</Text>
          <View style={styles.relatedWordsContainer}>
            {word.relatedWords.map((w, index) => (
              <View key={index} style={styles.relatedWordTag}>
                <Text style={styles.relatedWordText}>{w}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null;

    case 'imageButton': {
      const imageEngines = [
        { label: 'Bing 图片',   url: `https://www.bing.com/images/search?q=${encoded}` },
        { label: 'Google 图片', url: `https://www.google.com/search?tbm=isch&q=${encoded}` },
      ];
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>查图片</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.engineRow}>
            {imageEngines.map((engine) => (
              <TouchableOpacity
                key={engine.label}
                style={styles.engineChip}
                onPress={() => onShowImages?.(engine.url)}
                activeOpacity={0.7}
              >
                <Text style={styles.engineChipText}>{engine.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }

    case 'dictButton': {
      const dictEngines = [
        { label: 'Bing 词典', url: `https://www.bing.com/dict/search?q=${encoded}` },
      ];
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>查词典</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.engineRow}>
            {dictEngines.map((engine) => (
              <TouchableOpacity
                key={engine.label}
                style={styles.engineChip}
                onPress={() => onShowDict?.(engine.url)}
                activeOpacity={0.7}
              >
                <Text style={styles.engineChipText}>{engine.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }

    default:
      return null;
  }
}

const styles = StyleSheet.create({
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
  engineRow: {
    marginTop: spacing.sm,
  },
  engineChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  engineChipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  relatedWordsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
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
});
