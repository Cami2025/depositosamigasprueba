console.log("🚀 script.js se ha cargado correctamente.");

import { database, auth } from "./firebase-config.js";
import { ref, push, onValue, remove, set, get } from "firebase/database";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getDatabase, enableIndexedDbPersistence } from "firebase/firestore";

// ✅ Habilitar persistencia en IndexedDB para datos sin conexión
const db = getDatabase();
enableIndexedDbPersistence(db)
  .then(() => console.log("✅ Modo offline de Firebase activado"))
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log("❗ Persistencia no disponible (múltiples pestañas abiertas)");
    } else if (err.code === 'unimplemented') {
      console.log("❗ El navegador no soporta la persistencia offline");
    }
  });

// ✅ Configurar la persistencia de la sesión de autenticación
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Error al configurar la persistencia de sesión:", error.message);
});

// Obtener los contenedores del HTML
const loginContainer = document.getElementById("login-container");
const appContent = document.getElementById("app-content");

// Control de autenticación
onAuthStateChanged(auth, (user) => {
  if (!user) {
    mostrarLogin();
    if (loginContainer) loginContainer.style.display = "block";
