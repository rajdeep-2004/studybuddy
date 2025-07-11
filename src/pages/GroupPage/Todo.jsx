import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
  increment,
  updateDoc,
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
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const todosRef = collection(db, "groups", groupID, "todos");
    const q = query(todosRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updates = snapshot.docs.map((docSnap) => {
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

        let completed = false;

        // Subscribe to completion status of each todo
        const unsubscribeCompletion = onSnapshot(
          completionRef,
          (completionSnap) => {
            if (completionSnap.exists()) {
              completed = completionSnap.data().completed;
            }
            setTodos((prevTodos) => {
              const updated = prevTodos.map((t) =>
                t.id === todoId ? { ...t, completed } : t
              );
              return updated;
            });
          }
        );

        return {
          id: todoId,
          title: todoData.title,
          createdBy: todoData.createdBy,
          createdByName: todoData.createdByName,
          createdAt: todoData.createdAt,
          completed,
        };
      });

      setTodos(updates);
    });

    return () => unsubscribe();
  }, [groupID, currentUser.uid]);

  const handleCreateTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      await addDoc(collection(db, "groups", groupID, "todos"), {
        title: newTodo,
        createdBy: userData.uid,
        createdByName: userData.name,
        createdAt: serverTimestamp(),
      });

      const groupRef = doc(db, "groups", groupID);
      const groupSnap = await getDoc(groupRef);
      const groupData = groupSnap.data();

      const promises = groupData.members.map(async (members) => {
        const userRef = doc(db, "users", members.uid);
        await updateDoc(userRef, { totalTodos: increment(1) });
      });

      await Promise.all(promises);

      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodoCompletion = async (todoId, currentValue) => {
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

      const newValue = !currentValue;

      await setDoc(completionRef, {
        completed: newValue,
        completedAt: serverTimestamp(),
      });

      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        completedTodos: increment(newValue ? 1 : -1),
      });
      setCompleted(newValue ? true : false);
    } catch (err) {
      console.error("Error toggling todo completion:", err);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const todoRef = doc(db, "groups", groupID, "todos", todoId);
      await deleteDoc(todoRef);

      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        totalTodos: increment(completed ? -1 : 1),
      });
    } catch (err) {
      console.error("Error deleting todo:", err);
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
          todo.completed ? (
            <></>
          ) : (
            <>
              {" "}
              <div
                key={todo.id}
                className={`p-4 rounded-lg shadow flex items-center justify-between ${"bg-white"}`}
              >
                <div>
                  <h3 className={`text-lg font-medium`}>{todo.title}</h3>
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
                    onChange={() =>
                      toggleTodoCompletion(todo.id, todo.completed)
                    }
                    className="w-5 h-5"
                  />
                  {todo.createdBy === currentUser.uid && (
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className=" rounded-lg bg-red-300 px-2 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
