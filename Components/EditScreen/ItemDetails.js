import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ItemDetailsScreen = ({route}) => {
  const {title, description, isComplete, saveFunction, id} = route.params;
  const navigation = useNavigation();
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [isNewComplete, setIsNewComplete] = useState(isComplete);

  const handleSave = () => {
    const object = {
      title: newTitle,
      description: newDescription,
      isComplete: isNewComplete,
      id: id,
    };
    const newarr = [];
    newarr.push(object);
    saveFunction(object);
    navigation.goBack(); // Navigate back after saving
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={newTitle}
        onChangeText={setNewTitle}
        placeholder="Title"
      />
      <TextInput
        style={styles.input}
        value={newDescription}
        onChangeText={setNewDescription}
        placeholder="Description"
        multiline
      />
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Complete:</Text>
        <Switch
          value={isNewComplete}
          onValueChange={setIsNewComplete}
          style={styles.switch}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchText: {
    marginRight: 10,
  },
  switch: {},
  saveButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ItemDetailsScreen;
