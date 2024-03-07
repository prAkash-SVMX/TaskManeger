import React, { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';

const NewItemAddScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [id, setId] = useState(new Date().getTime());
  const [description, setDescription] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const handleAddItem = route.params.handleAddItem;
  const handleAddNewItem = () => {
    const newItem = {
      title,
      description,
      isComplete,
      id: id,
    };
    setId(new Date().getTime());
    const newData = [];
    newData.push(newItem);
    handleAddItem(newData);
    // Reset input fields and completion status
    setTitle('');
    setDescription('');
    setIsComplete(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Mark as Complete:</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isComplete ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setIsComplete(!isComplete)}
          value={isComplete}
        />
      </View>
      <TouchableOpacity onPress={handleAddNewItem} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleText: {
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default NewItemAddScreen;
