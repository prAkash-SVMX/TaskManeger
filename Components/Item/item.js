import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';

const Card = ({ title, description, isComplete, navigation, saveFunction ,id}) => {
  const [newisComplete, setnewIsComplete] = useState(isComplete);
  const toggleComplete = () => {
    const updatedIsComplete = !newisComplete;
    setnewIsComplete(updatedIsComplete);
    // Call saveFunction with the updated isComplete value
    saveFunction({
      title,
      description,
      isComplete: updatedIsComplete,
      id
    });

  };

  const handlePress = () => {
    navigation.navigate('ItemDetail', { title, description, isComplete, saveFunction,id });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.cardContainer}>
        <View
          style={[
            styles.card,
            { backgroundColor: isComplete ? '#e6e6e6' : '#ffffff' },
          ]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>Mark as Complete:</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isComplete ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleComplete}
            value={isComplete}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  card: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  toggleText: {
    fontSize: 16,
    marginRight: 10,
  },
});

export default Card;
