import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../firebase.jsx";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUserData } from "../../context/UserDataContext.jsx";

export default function GroupTodos() {
  const { currentUser } = useAuth();
  const { userData } = useUserData();
  const { groupID } = useParams();

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [groupMembers, setGroupMembers] = useState(null);

  useEffect(() => {
    const getGroupData = async () => {
      const groupRef = doc(db, "groups", groupID);
      const groupSnap = await getDoc(groupRef);
      setGroupMembers(groupSnap.data().members);
    };
    getGroupData();

    const todosRef = collection(db, "groups", groupID, "todos");
    const q = query(todosRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todoList = [];

      snapshot.forEach((docSnap) => {
        const todoData = docSnap.data();
        const todoId = docSnap.id;

        const completionRef = doc(
          db,
          "groups",
          groupID,
          "todos",
          todoId,
          "completions",
          currentUser.uid
        );

        onSnapshot(completionRef, (completionSnap) => {
          const completed = completionSnap.exists()
            ? completionSnap.data().completed
            : false;

          setTodos((prev) => {
            const updated = prev.map((t) =>
              t.id === todoId ? { ...t, completed } : t
            );
            return updated;
          });
        });

        todoList.push({
          id: todoId,
          title: todoData.title,
          createdBy: todoData.createdBy,
          createdByName: todoData.createdByName,
          createdAt: todoData.createdAt,
          completed: false,
        });
      });

      setTodos(todoList);
    });

    return () => unsubscribe();
  }, [groupID, currentUser.uid]);

  const handleCreateTodo = async () => {

    try {
      await addDoc(collection(db, "groups", groupID, "todos"), {
        title: newTodo.trim(),
        createdBy: userData.uid,
        createdByName: userData.name,
        createdAt: serverTimestamp(),
      });

      for (const member of groupMembers) {
        const userRef = doc(db, "users", member.uid);
        await updateDoc(userRef, {
          totalTodos: increment(1),
        });
      }

      setNewTodo("");
    } catch (error) {
      alert("Error adding todo:", error);
    }
  };

  const toggleTodoCompletion = async (todoId) => {
    try {
      const completionRef = doc(
        db,
        "groups",
        groupID,
        "todos",
        todoId,
        "completions",
        userData.uid
      );

      await setDoc(completionRef, {
        completed: "completed",
        completedAt: serverTimestamp(),
      });

      const userRef = doc(db, "users", userData.uid);
      await updateDoc(userRef, {
        totalTodos: increment(-1),
      });
    } catch (err) {
      alert("Error toggling todo completion:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Group Todos</h2>

      <div className="flex gap-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleCreateTodo}
          className="bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] text-white px-5 py-2 rounded-lg hover:bg-white hover:text-black transition"
        >
          Add
        </button>
      </div>

      <div className="grid gap-4">
        {todos.map((todo) =>
          todo.completed ? null : (
            <div
              key={todo.id}
              className="p-4 rounded-lg shadow flex items-center justify-between bg-white"
            >
              <div>
                <h3 className="text-lg font-medium">{todo.title}</h3>
                <p className="text-sm text-gray-500">
                  Created by:{" "}
                  <span className="font-bold">
                    {todo.createdBy === userData.uid
                      ? "You"
                      : todo.createdByName}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoCompletion(todo.id)}
                  className="w-5 h-5"
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
