import React, { useCallback } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import { X } from 'phosphor-react-native';
import WebView from './WebView';
import { colors, spacing, fontSize } from '../../constants/theme';
import { useUserStore } from '../../stores/userStore';

// 注入到 WebView 的 JS：拦截所有图片点击，把 src postMessage 出来
const INJECTED_JS = `
(function() {
  function findImgSrc(el) {
    // 向上找最近的 img 元素（点击可能在 img 内部元素）
    let node = el;
    while (node && node.tagName !== 'IMG') {
      node = node.parentElement;
    }
    if (!node) return null;
    // 优先 src，其次 data-src / currentSrc
    return node.src || node.getAttribute('data-src') || node.currentSrc || null;
  }

  document.addEventListener('click', function(e) {
    const src = findImgSrc(e.target);
    if (src && src.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'IMG_CLICK', src: src }));
    }
  }, true);

  // 标记已注入，防止重复
  window.__coverImageInjected = true;
})();
true;
`;

interface Props {
  visible: boolean;
  url: string;
  wordId: string;
  title?: string;
  onClose: () => void;
}

export default function CoverImageModal({ visible, url, wordId, title, onClose }: Props) {
  const { setCoverImage } = useUserStore();

  const handleMessage = useCallback((event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type !== 'IMG_CLICK') return;
      const src: string = data.src;
      if (!src) return;

      // 二次确认弹窗
      Alert.alert(
        '设为封面背景图',
        '将此图片设为该单词的封面背景？',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '确认设置',
            onPress: () => {
              setCoverImage(wordId, src);
              onClose(); // 确认后关闭 presenter
            },
          },
        ]
      );
    } catch {
      // ignore
    }
  }, [wordId, setCoverImage, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* 顶部栏 */}
        <View style={styles.header}>
          <Text style={styles.title}>{title ?? '查图片'}</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={16} color={colors.text} weight="bold" />
          </TouchableOpacity>
        </View>

        {/* 提示条 */}
        <View style={styles.hintBar}>
          <Text style={styles.hintText}>点击图片可将其设为该单词的封面</Text>
        </View>

        {/* WebView — 仅移动端注入 JS */}
        {url ? (
          <WebView
            source={{ uri: url }}
            style={{ flex: 1 }}
            startInLoadingState
            injectedJavaScript={Platform.OS !== 'web' ? INJECTED_JS : undefined}
            onMessage={Platform.OS !== 'web' ? handleMessage : undefined}
          />
        ) : null}

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(120,120,128,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBar: {
    backgroundColor: colors.primary + '15',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary + '30',
  },
  hintText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    textAlign: 'center',
  },
});
