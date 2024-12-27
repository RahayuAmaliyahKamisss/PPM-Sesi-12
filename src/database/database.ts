import SQLite from 'react-native-sqlite-storage';

// Membuka atau membuat database
const db = SQLite.openDatabase(
  {
    name: 'UsersDatabase.db',
    location: 'default',
  },
  () => {
    console.log('Database connected!');
  },
  (error) => {
    console.log('Error: ', error);
  }
);

// Buat tabel jika belum ada
db.transaction((tx) => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      lastName TEXT,
      email TEXT,
      age INTEGER,
      gender TEXT
    )`,
    [],
    () => console.log('Table created successfully!'),
    (error) => console.log('Error creating table: ', error)
  );
});

export default db;
