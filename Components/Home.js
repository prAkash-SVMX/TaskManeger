import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import {NavigationContainer, useIsFocused} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NewItemAddScreen from './newTask/input';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Card from './Item/item';
import {MMKV} from 'react-native-mmkv';
import ItemDetailsScreen from './EditScreen/ItemDetails';

const mmkv = new MMKV();

const HomeScreen = ({navigation}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [items, setItems] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(1));
  const isFocused = useIsFocused();
  const [isSwiping, setIsSwiping] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();

    const storedItems = mmkv.getString('items');
    const parsedItems = storedItems ? JSON.parse(storedItems) : [];
    console.log('storedItems:', parsedItems);
    setItems(parsedItems);

    if (isFocused) {
      timerRef.current = setInterval(() => {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString());
        setCurrentDate(now.toLocaleDateString());
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isFocused]);

  const handleSaveItem = updatedItem => {
    console.log('save function ', updatedItem);
    const index = items.findIndex(item => item.id === updatedItem.id);
    console.log('index', items);
    if (index !== -1) {
      const updatedItems = [...items];
      updatedItems[index] = updatedItem;

      setItems(updatedItems);
      mmkv.set('items', JSON.stringify(updatedItems));
    }
  };

  const handleAddItem = newItem => {
    const updatedItems = [...items, ...newItem];
    mmkv.set('items', JSON.stringify(updatedItems));
    setItems(updatedItems);
  };

  const handleDeleteItem = id => {
    console.log('hii', id);
    const updatedItems = items.filter(item => item.id !== id);
    mmkv.set('items', JSON.stringify(updatedItems));
    setItems(updatedItems);
  };

  const rightSwipeActions = () => {
    return (
      <View
        style={{
          backgroundColor: '#ff8303',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
        <Text
          style={{
            color: '#1b1a17',
            paddingHorizontal: 10,
            fontWeight: '600',
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}>
          Delete
        </Text>
      </View>
    );
  };

  const renderItemSwipeable = ({item}) => {
    if (!items.find(i => i.id === item.id)) {
      return null; // Don't render anything if the item is deleted
    }
    return (
      <Swipeable
        renderRightActions={rightSwipeActions}
        onSwipeableRightOpen={() => {
          setIsSwiping(true);
          handleDeleteItem(item.id);
          setIsSwiping(false);
        }}>
        <Card
          title={item.title}
          isComplete={item.isComplete}
          description={item.description}
          saveFunction={handleSaveItem}
          navigation={navigation}
          id={item.id}
          isSwiping={isSwiping}
        />
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.dateTimeContainer, {opacity: fadeAnim}]}>
        <Text style={styles.dateTimeText}>{currentTime}</Text>
        <Text style={styles.dateTimeText}>{currentDate}</Text>
      </Animated.View>
      <TouchableOpacity
        style={styles.createTaskButton}
        onPress={() => navigation.navigate('NewItemAdd', {handleAddItem})}>
        <Text style={styles.createTaskButtonText}>Create Task</Text>
      </TouchableOpacity>

      <FlatList
        style={styles.flatList}
        data={items}
        renderItem={renderItemSwipeable}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

HomeScreen.navigationOptions = {
  title: 'Home', // Set the title of the screen
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
  flatList: {
    flex: 1,
  },
});

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="NewItemAdd"
            component={NewItemAddScreen}
            options={{title: 'Add New Item'}}
          />
          <Stack.Screen name="ItemDetail" component={ItemDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
