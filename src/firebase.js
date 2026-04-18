// ============================================================
// 🔥 FIREBASE CONFIG
// 1. Go to firebase.google.com
// 2. Create a project
// 3. Go to Project Settings
// 4. Copy your config and paste it below
// ============================================================

export const FIREBASE_CONFIG = null;

// PASTE YOUR CONFIG HERE LIKE THIS:
// export const FIREBASE_CONFIG = {
//   apiKey: "AIza...",
//   authDomain: "your-app.firebaseapp.com",
//   projectId: "your-project-id",
//   storageBucket: "your-app.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "1:123456789:web:abc123"
// };

// ============================================================
// Firebase loader — do not change below this line
// ============================================================

let _db = null;
let _addDoc = null;
let _collection = null;
let _getDocs = null;
let _query = null;
let _orderBy = null;
let _deleteDoc = null;
let _doc = null;
let firebaseReady = false;

export async function initFirebase() {
  if (!FIREBASE_CONFIG || firebaseReady) return firebaseReady;
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js");
    const fb = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js");
    const app = initializeApp(FIREBASE_CONFIG);
    _db = fb.getFirestore(app);
    _addDoc = fb.addDoc;
    _collection = fb.collection;
    _getDocs = fb.getDocs;
    _query = fb.query;
    _orderBy = fb.orderBy;
    _deleteDoc = fb.deleteDoc;
    _doc = fb.doc;
    firebaseReady = true;
    return true;
  } catch (e) {
    console.warn("Firebase init failed, using localStorage", e);
    return false;
  }
}

export { _db, _addDoc, _collection, _getDocs, _query, _orderBy, _deleteDoc, _doc };
