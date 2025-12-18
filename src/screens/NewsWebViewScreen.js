import React from 'react';
import { WebView } from 'react-native-webview';

export default function NewsWebViewScreen({ route }) {
  const { url } = route.params;
  return <WebView source={{ uri: url }} style={{ flex: 1 }} />;
}