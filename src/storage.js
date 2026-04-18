import {
  initFirebase,
  _db, _addDoc, _collection,
  _getDocs, _query, _orderBy,
  _deleteDoc, _doc
} from './firebase';

// ============================================================
// Storage — uses Firebase if configured, else localStorage
// ============================================================

export const Storage = {
  async save(record) {
    const ready = await initFirebase();
    if (ready && _db) {
      const ref = await _addDoc(_collection(_db, "cgpa_records"), record);
      return ref.id;
    } else {
      const data = JSON.parse(localStorage.getItem("cgpa_records") || "[]");
      const id = "local_" + Date.now();
      data.unshift({ ...record, id });
      localStorage.setItem("cgpa_records", JSON.stringify(data));
      return id;
    }
  },

  async fetchAll() {
    const ready = await initFirebase();
    if (ready && _db) {
      const snap = await _getDocs(
        _query(_collection(_db, "cgpa_records"), _orderBy("savedAt", "desc"))
      );
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      return JSON.parse(localStorage.getItem("cgpa_records") || "[]");
    }
  },

  async delete(id) {
    const ready = await initFirebase();
    if (ready && _db) {
      await _deleteDoc(_doc(_db, "cgpa_records", id));
    } else {
      const data = JSON.parse(localStorage.getItem("cgpa_records") || "[]");
      localStorage.setItem(
        "cgpa_records",
        JSON.stringify(data.filter(r => r.id !== id))
      );
    }
  }
};
