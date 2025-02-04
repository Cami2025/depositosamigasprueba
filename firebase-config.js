// firebase-config.js

// Importar Firebase y sus servicios desde node_modules
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD8UPGQu94dzTyr3edIIbwrm8hlAOebJpo",
  authDomain: "fiestas-5f0e5.firebaseapp.com",
  databaseURL: "https://fiestas-5f0e5-default-rtdb.firebaseio.com",
  projectId: "fiestas-5f0e5",
  storageBucket: "fiestas-5f0e5.firebasestorage.app",
  messagingSenderId: "528292695738",
  appId: "1:528292695738:web:1fd6193891a6840fb27c83"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Verificar conexión en la consola
console.log("🔥 Firebase conectado correctamente:", database);

export { database, auth };
