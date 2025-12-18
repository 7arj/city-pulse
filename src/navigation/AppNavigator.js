import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// We will create these files in the next step
import CitySelectorScreen from '../screens/CitySelectorScreen';
import NewsFeedScreen from '../screens/NewsFeedScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import NewsWebViewScreen from '../screens/NewsWebViewScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1E88E5' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="CitySelector" component={CitySelectorScreen} options={{ title: 'City Pulse' }} />
      <Stack.Screen name="NewsFeed" component={NewsFeedScreen} options={({ route }) => ({ title: route.params.city })} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
      <Stack.Screen name="NewsWebView" component={NewsWebViewScreen} options={{ title: 'Article' }} />
    </Stack.Navigator>
  );
}