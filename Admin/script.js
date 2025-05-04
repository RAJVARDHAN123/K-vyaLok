import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getDatabase, ref, push, set, update, remove, get, child } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyAnk8ApGJZd85R8eT2ryg72jUd90VEyuAQ",
  authDomain: "test-pro-e6152.firebaseapp.com",
  databaseURL: "https://test-pro-e6152-default-rtdb.firebaseio.com",
  projectId: "test-pro-e6152",
  storageBucket: "test-pro-e6152.appspot.com",
  messagingSenderId: "766763484355",
  appId: "1:766763484355:web:db970872019c63a507ce76"
};

// 🔧 Prevent duplicate app init
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const form = document.getElementById('shayariForm');
const input = document.getElementById('shayariInput');
const list = document.getElementById('shayariList');

const status = document.getElementById("status");

let editingKey = null;


logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    status.textContent = "You have been logged out.";
  } catch (error) {
    status.textContent = `Logout error: ${error.message}`;
  }
});

// Submit form
form.onsubmit = async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  if (editingKey) {
    await update(ref(db, 'shayaris/' + editingKey), { text });
    editingKey = null;
    window.localStorage.setItem("e01", null);
    loadShayaris();
  } else {
    const newRef = push(ref(db, 'shayaris'));
    await set(newRef, { text });
  }

  input.value = '';
  loadShayaris();
};

function loadShayaris() {
  if(window.localStorage.getItem('e01') !== 'null'){
    get(ref(db, 'shayaris')).then((snapshot) => {
      const data = snapshot.val();
      list.innerHTML = '';
  
      for (let key in data) {
        const item = data[key];
        if(key == window.localStorage.getItem('e01')){
        editShayari(key, item.text);
      }
      }
    });
  }else{
  get(ref(db, 'shayaris')).then((snapshot) => {
    const data = snapshot.val();
    list.innerHTML = '';

    for (let key in data) {
      const item = data[key];
      const card = document.createElement('div');
      card.className = 'shayari-card';
      card.innerHTML = `
        <div class="shayari-text">${item.text}</div>
        <div class="card-actions">
          <i class="e fa fa-pen" onclick="editShayari('${key}', \`${item.text.replace(/`/g, "\\`")}\`)"></i>
          <i class="e fa fa-trash" onclick="deleteShayari('${key}')"></i>
        </div>
      `;
      list.appendChild(card);
    }
  });
}
}

function editShayari(key, text) {
  input.value = text;
  editingKey = key;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteShayari(key) {
  if (confirm("Are you sure you want to delete this Shayari?")) {
    remove(ref(db, 'shayaris/' + key)).then(loadShayaris);
  }
}

window.onload = loadShayaris;
