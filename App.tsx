import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button, // Pastikan Button diimpor di sini
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import db from './src/database/database';

const App = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    gender: '',
  });

  const fetchUsersFromDB = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Users`,
        [],
        (tx, results) => {
          const rows = results.rows;
          let usersData = [];
          for (let i = 0; i < rows.length; i++) {
            usersData.push(rows.item(i));
          }
          setUsers(usersData);
        },
        (error) => {
          console.log('Error fetching data: ', error);
        }
      );
    });
  };

  const handleAddUser = () => {
    const age = parseInt(newUser.age, 10);
    if (
      newUser.firstName &&
      newUser.lastName &&
      newUser.email &&
      !isNaN(age) &&
      newUser.gender
    ) {
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO Users (firstName, lastName, email, age, gender) VALUES (?, ?, ?, ?, ?)`,
          [newUser.firstName, newUser.lastName, newUser.email, age, newUser.gender],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              Alert.alert('Berhasil!', 'User berhasil ditambahkan!');
              fetchUsersFromDB();
              setIsModalVisible(false);
              setNewUser({
                firstName: '',
                lastName: '',
                email: '',
                age: '',
                gender: '',
              });
            }
          },
          (error) => {
            console.log('Error inserting data: ', error);
          }
        );
      });
    } else {
      Alert.alert('Gagal!', 'Semua field harus diisi dengan benar!');
    }
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          firstName TEXT,
          lastName TEXT,
          email TEXT,
          age INTEGER,
          gender TEXT
        )`
      );
    });
    fetchUsersFromDB();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Pengguna</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userText}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.userText}>Email: {item.email}</Text>
            <Text style={styles.userText}>Usia: {item.age}</Text>
            <Text style={styles.userText}>Gender: {item.gender}</Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Tambah Pengguna</Text>
      </TouchableOpacity>

      {/* Modal untuk menambahkan user */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Pengguna</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama Depan"
              value={newUser.firstName}
              onChangeText={(text) =>
                setNewUser({ ...newUser, firstName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Nama Belakang"
              value={newUser.lastName}
              onChangeText={(text) =>
                setNewUser({ ...newUser, lastName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newUser.email}
              onChangeText={(text) =>
                setNewUser({ ...newUser, email: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Usia"
              keyboardType="numeric"
              value={newUser.age}
              onChangeText={(text) =>
                setNewUser({ ...newUser, age: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Jenis Kelamin (L/P)"
              value={newUser.gender}
              onChangeText={(text) =>
                setNewUser({ ...newUser, gender: text })
              }
            />
            <Button title="Tambah" onPress={handleAddUser} />
            <Button
              title="Batal"
              onPress={() => setIsModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  userCard: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  userText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default App;
