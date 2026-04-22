import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SpeakerHigh, CheckCircle } from 'phosphor-react-native';
import { CardModule, Word, ExamQuestion } from '../../types';
import { colors, spacing, fontSize } from '../../constants/theme';

/** 向后兼容旧代码 */
export type WordData = Word;

interface Props {
  module: CardModule;
  word: WordData;
  onShowImages?: (url: string) => void;
  onShowDict?: (url: string) => void;
  onSpeak?: () => void;
}

/** 考试真题子组件，支持点击显示答案 */
function ExamModule({ questions }: { questions: ExamQuestion[] }) {
  const [revealed, setRevealed] = useState(false);
  const q = questions[0]; // 展示第一题
  if (!q) return null;
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
  return (
    <View style={styles.examSection}>
      <Text style={styles.sectionTitle}>考试真题</Text>
      <Text style={styles.examQuestion}>{q.question}</Text>
      {q.choices.map((c, i) => {
        const isCorrect = revealed && i === q.rightIndex;
        return (
          <View key={i} style={[styles.examChoice, isCorrect && styles.examChoiceCorrect]}>
            <Text style={styles.examChoiceIndex}>{labels[i] ?? i + 1}.</Text>
            <Text style={styles.examChoiceText}>{c}</Text>
            {isCorrect && <CheckCircle size={18} color={colors.primary} weight="fill" />}
          </View>
        );
      })}
      {!revealed ? (
        <TouchableOpacity style={styles.examRevealBtn} onPress={() => setRevealed(true)} activeOpacity={0.7}>
          <Text style={styles.examRevealText}>查看答案</Text>
        </TouchableOpacity>
      ) : q.explain ? (
        <Text style={styles.examExplain}>{q.explain}</Text>
      ) : null}
    </View>
  );
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
          <Text style={styles.sectionTitle}>记忆方法</Text>
          <Text style={styles.sectionText}>{word.etymology}</Text>
        </View>
      ) : null;

    case 'meaningEn':
      return word.meaningEn ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>英英释义</Text>
          <Text style={styles.sectionText}>{word.meaningEn}</Text>
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

    case 'phrase':
      return word.phrases && word.phrases.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>短语搭配</Text>
          {word.phrases.map((p, i) => (
            <View key={i} style={styles.phraseItem}>
              <Text style={styles.phraseEn}>{p.en}</Text>
              <Text style={styles.phraseCn}>{p.cn}</Text>
            </View>
          ))}
        </View>
      ) : null;

    case 'syno':
      return word.synonyms && word.synonyms.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>近义词</Text>
          {word.synonyms.map((group, i) => (
            <View key={i} style={styles.synoGroup}>
              {group.pos ? <Text style={styles.synoPos}>{group.pos}.</Text> : null}
              <View style={styles.relatedWordsContainer}>
                {group.words.map((w, j) => (
                  <View key={j} style={styles.relatedWordTag}>
                    <Text style={styles.relatedWordText}>{w}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : null;

    case 'rootWord':
      return word.rootWords && word.rootWords.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>同根词</Text>
          {word.rootWords.map((group, i) => (
            <View key={i} style={styles.rootGroup}>
              <Text style={styles.rootPos}>{group.pos}.</Text>
              {group.words.map((w, j) => (
                <View key={j} style={styles.rootItem}>
                  <Text style={styles.rootWord}>{w.word}</Text>
                  {w.meaning ? <Text style={styles.rootMeaning}>{w.meaning}</Text> : null}
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : null;

    case 'exam':
      return word.examQuestions && word.examQuestions.length > 0 ? (
        <ExamModule questions={word.examQuestions} />
      ) : null;

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
  phraseItem: {
    marginBottom: spacing.sm,
  },
  phraseEn: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: 2,
  },
  phraseCn: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  synoGroup: {
    marginBottom: spacing.sm,
  },
  synoPos: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: '600' as const,
    marginBottom: spacing.xs,
  },
  rootGroup: {
    marginBottom: spacing.md,
  },
  rootPos: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600' as const,
    marginBottom: spacing.xs,
  },
  rootItem: {
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
    gap: spacing.sm,
    marginBottom: 4,
    paddingLeft: spacing.sm,
  },
  rootWord: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500' as const,
  },
  rootMeaning: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    flex: 1,
  },
  examSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
  },
  examQuestion: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  examChoice: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  examChoiceCorrect: {
    backgroundColor: colors.primary + '18',
  },
  examChoiceIndex: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: '600' as const,
    width: 20,
  },
  examChoiceText: {
    fontSize: fontSize.md,
    color: colors.text,
    flex: 1,
  },
  examRevealBtn: {
    alignSelf: 'flex-start' as const,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    marginTop: spacing.sm,
  },
  examRevealText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '500' as const,
  },
  examExplain: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
});
