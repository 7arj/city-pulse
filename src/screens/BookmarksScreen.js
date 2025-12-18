import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function BookmarksScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const isFocused = useIsFocused(); 

  useEffect(() => {
    if (isFocused) {
        AsyncStorage.getItem('bookmarks').then(data => {
            if (data) setItems(JSON.parse(data));
        });
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {items.length === 0 ? <Text style={styles.info}>No bookmarks yet!</Text> : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('NewsWebView', { url: item.url })}>
              <Image source={{ uri: item.urlToImage }} style={styles.img} />
              <Text style={styles.txt} numberOfLines={2}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  info: { textAlign: 'center', marginTop: 50, color: '#999' },
  item: { flexDirection: 'row', marginBottom: 15, alignItems: 'center', borderBottomWidth: 1, pb: 10, borderColor: '#eee' },
  img: { width: 80, height: 60, borderRadius: 5, marginRight: 10 },
  txt: { flex: 1, fontWeight: '500' }
});