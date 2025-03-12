"use client";

import { db } from "../../lib/firebase";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const TestFirebase = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const addTestData = async () => {
    if (!name || !status) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "testCollection"), {
        name,
        status,
        timestamp: new Date(),
      });
      alert("Data added!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const deleteData = async (docId) => {
    if (!docId) {
      console.error("docId is undefined or null");
      return;
    }

    try {
      const docRef = doc(db, "testCollection", docId);
      await deleteDoc(docRef);
      alert("Data deleted!");
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "testCollection"));
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(fetchedData);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Firebase Test 🔥</h1>
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <button onClick={addTestData} className="bg-amber-50 text-red-400">
        Add Test Data
      </button>

      <h2>Stored Data:</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.name} - {item.status}
            <br />
            <button
              onClick={() => deleteData(item.id)}
              className="bg-amber-50 text-red-400"
            >
              Delete Test Data
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestFirebase;
