import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  ActivityIndicator, StyleSheet, RefreshControl 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;

export default function NewsFeedScreen({ route, navigation }) {
  const { city } = route.params; // Requirement: City-based news
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Requirement: Pull-to-refresh
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    fetchNews();
    loadBookmarks();
  }, [city]); // Refetch if the user searches a new city

  // --- CORE LOGIC: API FETCHING ---
  const fetchNews = async () => {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${city}&sortBy=publishedAt&apiKey=${API_KEY}`
      );
      setNews(response.data.articles);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --- CORE LOGIC: BOOKMARK SYSTEM ---
  const loadBookmarks = async () => {
    try {
      const saved = await AsyncStorage.getItem('bookmarks');
      if (saved) setBookmarks(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleBookmark = async (article) => {
    let updated = [...bookmarks];
    const index = updated.findIndex(item => item.url === article.url);
    if (index > -1) {
      updated.splice(index, 1);
    } else {
      updated.push(article);
    }
    setBookmarks(updated);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  // --- REQUIREMENT: EMERGENCY SECTION ---
  const EmergencyBanner = () => (
    <View style={styles.alertBox}>
      <Text style={styles.alertTitle}>⚠️ City Emergency Update</Text>
      <Text style={styles.alertText}>
        Official city alerts for {city}: Please check for local transit updates and weather warnings in your area.
      </Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const isSaved = bookmarks.some(b => b.url === item.url);
    return (
      <View style={styles.card}>
        {/* Requirement: WebView integration */}
        <TouchableOpacity onPress={() => navigation.navigate('NewsWebView', { url: item.url })}>
          <Image 
            source={{ uri: item.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image' }} 
            style={styles.image} 
          />
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <View style={styles.footer}>
            <Text style={styles.date}>{new Date(item.publishedAt).toLocaleDateString()}</Text>
            <TouchableOpacity onPress={() => toggleBookmark(item)}>
              <Text style={[styles.bookmarkText, isSaved && styles.activeBookmark]}>
                {isSaved ? '★ Saved' : '☆ Bookmark'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Navigation to Bookmarks Screen */}
      <TouchableOpacity 
        style={styles.bookmarkHeader} 
        onPress={() => navigation.navigate('Bookmarks')}
      >
        <Text style={styles.bookmarkHeaderText}>Saved Articles: {bookmarks.length}</Text>
      </TouchableOpacity>

      <FlatList
        ListHeaderComponent={<EmergencyBanner />} // Emergency section at the top
        data={news}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E88E5']} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bookmarkHeader: { backgroundColor: '#fff', padding: 10, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
  bookmarkHeaderText: { color: '#1E88E5', fontWeight: 'bold' },
  alertBox: {
    backgroundColor: '#FFF4E5', padding: 15, margin: 10,
    borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#FFA000',
  },
  alertTitle: { fontWeight: 'bold', color: '#B26A00', fontSize: 16 },
  alertText: { color: '#663C00', fontSize: 13, marginTop: 4 },
  card: { backgroundColor: '#fff', marginHorizontal: 10, marginTop: 15, borderRadius: 12, overflow: 'hidden', elevation: 2 },
  image: { width: '100%', height: 180 },
  content: { padding: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderTopWidth: 1, paddingTop: 10, borderColor: '#eee' },
  date: { color: '#999', fontSize: 12 },
  bookmarkText: { fontWeight: 'bold', color: '#1E88E5' },
  activeBookmark: { color: '#FBC02D' }
});