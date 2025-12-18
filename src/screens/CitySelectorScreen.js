import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const CITIES = ['New York', 'London', 'Tokyo', 'Mumbai', 'Paris', 'Berlin', 'Dubai', 'Sydney'];

export default function CitySelectorScreen({ navigation }) {
  const [search, setSearch] = useState('');

  const filteredCities = CITIES.filter(city => 
    city.toLowerCase().includes(search.toLowerCase())
  );

  const handleManualSearch = () => {
    if (search.trim().length > 0) {
      navigation.navigate('NewsFeed', { city: search.trim() });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>City Pulse Explorer</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Type any city (e.g. Chicago)..."
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity style={styles.searchBtn} onPress={handleManualSearch}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.subHeader}>Quick Select</Text>
      <FlatList
        data={filteredCities}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.cityItem} 
            onPress={() => navigation.navigate('NewsFeed', { city: item })}
          >
            <Text style={styles.cityText}>{item}</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#1E88E5' },
  subHeader: { fontSize: 14, color: '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  searchContainer: { flexDirection: 'row', marginBottom: 20 },
  searchBar: { 
    flex: 1, height: 50, borderWidth: 1, borderColor: '#ddd', 
    borderRadius: 10, paddingHorizontal: 15, backgroundColor: '#f9f9f9' 
  },
  searchBtn: { backgroundColor: '#1E88E5', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 10, marginLeft: 10 },
  searchBtnText: { color: '#fff', fontWeight: 'bold' },
  cityItem: { 
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 18, borderBottomWidth: 1, borderBottomColor: '#eee' 
  },
  cityText: { fontSize: 18, color: '#444' },
  arrow: { fontSize: 18, color: '#1E88E5' }
});