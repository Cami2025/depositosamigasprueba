console.log("🚀 script.js se ha cargado correctamente.");

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, getDoc, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
import { firebaseConfig } from "./firebase-config.js";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Habilitar persistencia offline
enableIndexedDbPersistence(db)
  .then(() => console.log("✅ Modo offline de Firestore activado"))
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log("❗ Persistencia no disponible (múltiples pestañas abiertas)");
    } else if (err.code === 'unimplemented') {
      console.log("❗ El navegador no soporta la persistencia offline");
    }
  });

// Configurar la persistencia de la sesión de autenticación
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
    if (appContent) appContent.style.display = "none";
  } else {
    if (loginContainer) loginContainer.style.display = "none";
    if (appContent) appContent.style.display = "block";
    cargarDepositos();
  }
});

function mostrarLogin() {
  if (!loginContainer) return;
  loginContainer.innerHTML = `
    <h2>Iniciar Sesión</h2>
    <input type="email" id="loginEmail" placeholder="Correo electrónico" required />
    <input type="password" id="loginPassword" placeholder="Contraseña" required />
    <button id="loginButton">Iniciar Sesión</button>
    <p id="offline-message" style="display: none; color: red;">⚠️ Sin conexión. No puedes iniciar sesión.</p>
  `;

  document.getElementById("loginButton").addEventListener("click", () => {
    if (!navigator.onLine) {
      document.getElementById("offline-message").style.display = "block";
      return;
    }

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => location.reload())
      .catch((error) => alert("Error al iniciar sesión: " + error.message));
  });
}

function logout() {
  signOut(auth)
    .then(() => {
      alert("Sesión cerrada.");
      location.reload();
    })
    .catch((error) => console.error("Error al cerrar sesión:", error.message));
}

const depositForm = document.getElementById('deposit-form');
const amountInput = document.getElementById('amount');
const nameInput = document.getElementById('name');
const totalAmountSpan = document.getElementById('total-amount');
const historyList = document.getElementById('history-list');

async function addDepositToFirestore(nombre, cantidad) {
  const fecha = new Date().toLocaleDateString();
  try {
    await addDoc(collection(db, "depositos"), { nombre, cantidad, fecha });
    actualizarTotal(cantidad);
  } catch (error) {
    console.error("Error al agregar depósito:", error);
  }
}

async function actualizarTotal(cantidad) {
  const totalRef = doc(db, "config", "totalMonto");
  const totalSnap = await getDoc(totalRef);

  let totalActual = totalSnap.exists() ? totalSnap.data().valor : 223910;
  const nuevoTotal = totalActual + cantidad;

  await updateDoc(totalRef, { valor: nuevoTotal }).catch(() => {
    console.log("Guardado localmente. Se sincronizará cuando haya conexión.");
  });

  totalAmountSpan.textContent = `$${nuevoTotal}`;
}

async function eliminarDeposito(id, cantidad) {
  try {
    await deleteDoc(doc(db, "depositos", id));
    actualizarTotal(-cantidad);
  } catch (error) {
    console.error("Error al eliminar depósito:", error);
  }
}

function cargarDepositos() {
  const depositosRef = collection(db, "depositos");

  onSnapshot(depositosRef, (snapshot) => {
    historyList.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      addDepositToDOM(data.nombre, data.cantidad, data.fecha, doc.id);
    });
  });
}

function addDepositToDOM(nombre, cantidad, fecha, id) {
  const listItem = document.createElement('li');
  listItem.innerHTML = `
    ${nombre} depositó $${cantidad} el ${fecha}
    <button class="delete-button">Eliminar</button>
  `;
  listItem.querySelector('.delete-button').addEventListener('click', () => {
    eliminarDeposito(id, cantidad);
    listItem.remove();
  });
  historyList.appendChild(listItem);
}

if (depositForm) {
  depositForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = nameInput.value.trim();
    const cantidad = parseInt(amountInput.value);

    if (!nombre || isNaN(cantidad) || cantidad <= 0) {
      alert('Por favor, ingresa un nombre y un monto válido.');
      return;
    }

    addDepositToFirestore(nombre, cantidad);

    const audio = document.getElementById('interaction-audio');
    if (audio) {
      audio.play();
    }

    nameInput.value = '';
    amountInput.value = '';
  });
}

// 🚀 Registro del Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registrado con éxito:', registration);
      })
      .catch(error => {
        console.error('❌ Error al registrar el Service Worker:', error);
      });
  });
}
