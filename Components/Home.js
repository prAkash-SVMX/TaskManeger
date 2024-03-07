import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Card from './Item/item';
import ItemDetailsScreen from './EditScreen/ItemDetails';
import NewItemAddScreen from './newTask/input';
import { MMKV } from 'react-native-mmkv';

const mmkv = new MMKV();

const HomeScreen = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [items, setItems] = useState([]);
  const isFocused = useIsFocused();
  const offsetX = useSharedValue(0);

  useEffect(() => {
    const storedItems = mmkv.getString('items');
    const parsedItems = storedItems ? JSON.parse(storedItems) : [];
    setItems(parsedItems);

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString());
    }, 1000);

    return () => clearInterval(interval);
  }, [isFocused]);

  const handleSaveItem = updatedItem => {
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      const updatedItems = [...items];
      updatedItems[index] = updatedItem;
      setItems(updatedItems);
      mmkv.set('items', JSON.stringify(updatedItems));
    }
  };

  const handleAddItem = newItem => {
    const updatedItems = [...items, ...newItem];
    setItems(updatedItems);
    mmkv.set('items', JSON.stringify(updatedItems));
  };

  const handleDeleteItem = id => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    mmkv.set('items', JSON.stringify(updatedItems));
  };

  const rightSwipeActions = () => {
    return (
      <View style={{ backgroundColor: '#ff8303', justifyContent: 'center', alignItems: 'flex-end' }}>
        <Text style={{ color: '#1b1a17', paddingHorizontal: 10, fontWeight: '600', paddingHorizontal: 30, paddingVertical: 20 }}>Delete</Text>
      </View>
    );
  };

  const renderItemSwipeable = ({ item }) => {
    return (
      <Swipeable
        renderRightActions={rightSwipeActions}
        onSwipeableRightOpen={() => handleDeleteItem(item.id)}>
        <Card
          title={item.title}
          isComplete={item.isComplete}
          description={item.description}
          saveFunction={handleSaveItem}
          navigation={navigation}
          id={item.id}
        />
      </Swipeable>
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetX.value }],
    };
  });

  const handlePress = () => {
    offsetX.value = withSpring(-100, {
      damping: 10,
      stiffness: 100,
      velocity: 2,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateTimeText}>{currentTime}</Text>
        <Text style={styles.dateTimeText}>{currentDate}</Text>
      </View>
      <TouchableOpacity style={styles.createTaskButton} onPress={handlePress}>
        <Text style={styles.createTaskButtonText}>Create Task</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <FlatList
          style={styles.flatList}
          data={items}
          renderItem={renderItemSwipeable}
          keyExtractor={(item, index) => index.toString()}
        />
      </Animated.View>
    </View>
  );
};

HomeScreen.navigationOptions = {
  title: 'Home',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  dateTimeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dateTimeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  createTaskButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  createTaskButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  animatedContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 10,
  },
  flatList: {
    flex: 1,
  },
});

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="NewItemAdd" component={NewItemAddScreen} options={{ title: 'Add New Item' }} />
          <Stack.Screen name="ItemDetail" component={ItemDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
