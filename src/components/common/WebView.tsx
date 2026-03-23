import React from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, fontSize } from '../../constants/theme';

interface WebViewProps {
  source: { uri: string };
  style?: any;
  startInLoadingState?: boolean;
  renderLoading?: () => React.ReactNode;
}

// Web 端使用 iframe，移动端使用 react-native-webview
export default function WebView(props: WebViewProps) {
  const { source, style, startInLoadingState, renderLoading } = props;
  const [loading, setLoading] = React.useState(startInLoadingState);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        {loading && (
          <View style={styles.loadingOverlay}>
            {renderLoading ? renderLoading() : <ActivityIndicator color={colors.primary} />}
          </View>
        )}
        <iframe
          src={source.uri}
          style={styles.iframe}
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </View>
    );
  }

  // 移动端使用原生 WebView
  const RNWebView = require('react-native-webview').WebView;
  return <RNWebView {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  iframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
  } as any,
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
