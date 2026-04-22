import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Text } from 'react-native-paper';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DotsSixVertical, Plus, X } from 'phosphor-react-native';
import { useUserStore } from '../stores/userStore';
import { CardModule, CardModuleType } from '../types';
import { colors, spacing, fontSize, shadows } from '../constants/theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import HeaderNav, { HEADER_HEIGHT } from '../components/common/HeaderNav';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WordCardModule } from '../components/common/WordCardModule';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock 数据，用于编辑器预览
const MOCK_WORD = {
  id: 'mock',
  word: 'ephemeral',
  phonetic: '/ɪˈfem.ər.əl/',
  pos: 'adj.',
  meaning: '短暂的；朝生暮死的',
  meaningEn: 'lasting for a very short time',
  etymology: 'epi-（在...上）+ hemer（日）→ 只活一天',
  examples: [{ sentence: 'Fame is ephemeral.', translation: '名声是短暂的。' }],
  relatedWords: ['temporary', 'transient', 'fleeting'],
  phrases: [{ en: 'ephemeral pleasure', cn: '短暂的快乐' }],
  synonyms: [{ pos: 'adj', meaning: '短暂的', words: ['temporary', 'transient'] }],
  rootWords: [{ pos: 'n', words: [{ word: 'ephemera', meaning: '短命的事物' }] }],
  examQuestions: [{
    question: 'The beauty of a sunset is ______.',
    choices: ['permanent', 'ephemeral', 'substantial', 'equivalent'],
    rightIndex: 1,
    explain: 'ephemeral 意为“短暂的”，此处形容日落的短暂之美。',
  }],
};

// 全部模块的元数据（顺序 = 默认顺序）
const ALL_MODULE_DEFS: { id: CardModuleType; label: string }[] = [
  { id: 'word',        label: '单词' },
  { id: 'phonetic',    label: '音标' },
  { id: 'pos',         label: '词性' },
  { id: 'meaning',     label: '中文释义' },
  { id: 'meaningEn',   label: '英英释义' },
  { id: 'etymology',   label: '记忆方法' },
  { id: 'examples',    label: '例句' },
  { id: 'phrase',      label: '短语搭配' },
  { id: 'syno',        label: '近义词' },
  { id: 'rootWord',    label: '同根词' },
  { id: 'relatedWords', label: '关联词汇' },
  { id: 'exam',        label: '考试真题' },
  { id: 'imageButton', label: '单词图片' },
  { id: 'dictButton',  label: '查词典' },
];

export default function CardLayoutScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { settings, updateCardLayout } = useUserStore();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showPicker, setShowPicker] = useState(false);

  // layout 只保存当前已启用（显示）的模块，按顺序
  const [layout, setLayout] = useState<CardModule[]>(
    (settings.cardLayout ?? []).filter(m => m.enabled)
  );

  // 未在 layout 中的模块，可在 picker 中添加
  const availableModules = ALL_MODULE_DEFS.filter(
    def => !layout.some(m => m.id === def.id)
  );

  const handleRemove = (id: CardModuleType) => {
    setLayout(prev => prev.filter(m => m.id !== id));
  };

  const handleAddModule = (def: { id: CardModuleType; label: string }) => {
    setLayout(prev => [...prev, { id: def.id, label: def.label, enabled: true }]);
    setShowPicker(false);
  };

  const handleSave = () => {
    // 重建完整布局：layout 中的在前（enabled:true），其余在后（enabled:false）
    const layoutIds = layout.map(m => m.id);
    const rest = ALL_MODULE_DEFS
      .filter(def => !layoutIds.includes(def.id))
      .map(def => ({ id: def.id, label: def.label, enabled: false }));
    const fullLayout: CardModule[] = [
      ...layout.map(m => ({ ...m, enabled: true })),
      ...rest,
    ];
    updateCardLayout(fullLayout);
    navigation.goBack();
  };

  const SAVE_BAR_HEIGHT = 64 + insets.bottom;

  const renderItem = ({ item, drag, isActive }: RenderItemParams<CardModule>) => {
    return (
      <ScaleDecorator activeScale={1.02}>
        <View style={[styles.moduleCard, isActive && styles.moduleCardActive]}>
          {/* 顶部操作栏 */}
          <View style={styles.moduleActions}>
            <TouchableOpacity
              onLongPress={drag}
              delayLongPress={100}
              style={styles.dragHandle}
            >
              <DotsSixVertical size={18} color={colors.textSecondary} weight="bold" />
              <Text style={styles.moduleLabel}>{item.label}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item.id)}
            >
              <X size={14} color={colors.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* 模块内容预览 */}
          <View style={styles.modulePreview} pointerEvents="none">
            <WordCardModule module={item} word={MOCK_WORD} />
          </View>
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <HeaderNav
        title="卡片布局"
        onBack={() => navigation.goBack()}
        scrollY={scrollPosition}
        rightAction={{
          icon: <Plus size={18} color={colors.text} weight="bold" />,
          onPress: () => setShowPicker(true),
        }}
      />

      <DraggableFlatList
        data={layout}
        keyExtractor={item => item.id}
        onDragEnd={({ data }) => setLayout(data)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: HEADER_HEIGHT + insets.top + spacing.md,
            paddingBottom: SAVE_BAR_HEIGHT + spacing.md,
          },
        ]}
        onScrollOffsetChange={setScrollPosition}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>还没有模块</Text>
            <Text style={styles.emptyHint}>点击右上角 + 添加模块</Text>
          </View>
        }
      />

      {/* 底部保存按钮 */}
      <View style={[styles.saveBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存布局</Text>
        </TouchableOpacity>
      </View>

      {/* 模块选择器 Modal */}
      <Modal
        visible={showPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.pickerModal}>
          {/* 选择器顶部 */}
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>添加模块</Text>
            <TouchableOpacity style={styles.pickerClose} onPress={() => setShowPicker(false)}>
              <X size={16} color={colors.text} weight="bold" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.pickerList}>
            {availableModules.length === 0 ? (
              <Text style={styles.pickerEmpty}>所有模块已添加</Text>
            ) : (
              availableModules.map(def => (
                <TouchableOpacity
                  key={def.id}
                  style={styles.pickerItem}
                  onPress={() => handleAddModule(def)}
                  activeOpacity={0.7}
                >
                  {/* 模块名称 */}
                  <Text style={styles.pickerItemLabel}>{def.label}</Text>

                  {/* 内容预览（使用 mock 数据） */}
                  <View style={styles.pickerItemPreview} pointerEvents="none">
                    <WordCardModule
                      module={{ id: def.id, label: def.label, enabled: true }}
                      word={MOCK_WORD}
                    />
                  </View>

                  {/* 添加指示 */}
                  <View style={styles.pickerAddBadge}>
                    <Plus size={14} color={colors.primary} weight="bold" />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },

  // 模块卡片
  moduleCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    ...shadows.sm,
  },
  moduleCardActive: {
    ...shadows.md,
    opacity: 0.95,
  },
  moduleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  dragHandle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    paddingVertical: spacing.xs,
  },
  moduleLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  removeButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(120,120,128,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modulePreview: {
    marginTop: spacing.xs,
  },

  // 空状态
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyHint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },

  // 保存栏
  saveBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  saveButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // 模块选择器
  pickerModal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  pickerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  pickerClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(120,120,128,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  pickerEmpty: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: fontSize.md,
    marginTop: 60,
  },
  pickerItem: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.sm,
    position: 'relative',
  },
  pickerItemLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  pickerItemPreview: {
    // 内容预览区
  },
  pickerAddBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,122,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
