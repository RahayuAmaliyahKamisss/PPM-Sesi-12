import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  TextInput,
} from 'react-native';
import axios from 'axios';

interface User {
  id: { value: string };
  name: { first: string; last: string };
  email: string;
  picture: { medium: string };
  phone: string;
  gender: string;
  location: { city: string; country: string };
  dob: { age: number };
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    gender: '',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in animation
  const scaleAnim = useRef(new Animated.Value(1)).current; // For bounce animation

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://randomuser.me/api/?results=5');
      setUsers(response.data.results);
      startFadeAnimation();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddUser = () => {
    if (
      newUser.firstName &&
      newUser.lastName &&
      newUser.email &&
      newUser.age &&
      newUser.gender
    ) {
      const newUserObject: User = {
        id: { value: `id${Date.now()}` },
        name: { first: newUser.firstName, last: newUser.lastName },
        email: newUser.email,
        picture: { medium: 'https://randomuser.me/api/portraits/lego/1.jpg' },
        phone: '123-456-7890',
        gender: newUser.gender,
        location: { city: 'Unknown', country: 'Unknown' },
        dob: { age: parseInt(newUser.age, 10) },
      };
      setUsers([...users, newUserObject]);
      setIsModalVisible(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        gender: '',
      });
      startFadeAnimation();
    } else {
      alert('Semua field harus diisi!');
    }
  };

  const startFadeAnimation = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.2, // Membesarkan tombol
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, // Kembali ke ukuran normal
      friction: 3, // Efek bounce
      tension: 100, // Kecepatan bounce
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>API dari Random User</Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.addButtonText}>Tambah User</Text>
        </TouchableOpacity>
      </Animated.View>
      {users.map((user, index) => (
        <Animated.View
          key={index}
          style={[styles.card, { opacity: fadeAnim }]}
        >
          <Image source={{ uri: user.picture.medium }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>
              {user.name.first} {user.name.last}
            </Text>
            <Text style={styles.gender}>Gender: {user.gender}</Text>
            <Text style={styles.dob}>Age: {user.dob.age}</Text>
          </View>
        </Animated.View>
      ))}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Tambah Data User</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama Depan"
              value={newUser.firstName}
              onChangeText={(text) =>
                setNewUser((prev) => ({ ...prev, firstName: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Nama Belakang"
              value={newUser.lastName}
              onChangeText={(text) =>
                setNewUser((prev) => ({ ...prev, lastName: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={newUser.email}
              onChangeText={(text) =>
                setNewUser((prev) => ({ ...prev, email: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Umur"
              keyboardType="numeric"
              value={newUser.age}
              onChangeText={(text) =>
                setNewUser((prev) => ({ ...prev, age: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Jenis Kelamin"
              value={newUser.gender}
              onChangeText={(text) =>
                setNewUser((prev) => ({ ...prev, gender: text }))
              }
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddUser}
              >
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
  info: {
    marginTop: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gender: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  dob: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
