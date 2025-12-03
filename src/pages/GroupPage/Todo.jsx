import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";
import { useUserData } from "../../context/UserDataContext.jsx";

export default function GroupTodos() {
  const { userData } = useUserData();
  const { groupID } = useParams();

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [groupMembers, setGroupMembers] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await api.get(`/todos/${groupID}`);
        setTodos(res.data);
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    };

    fetchTodos();
  }, [groupID]);

  const handleCreateTodo = async () => {
    try {
      const res = await api.post("/todos", {
        groupId: groupID,
        text: newTodo.trim(),
      });
      // Optimistically update or re-fetch. Since we populate createdBy, we might need to manually add it or re-fetch.
      // For simplicity, let's re-fetch or construct the object.
      // The response contains the new todo. createdBy is the ID.
      // We need the name.
      const newTodoItem = {
          ...res.data,
          createdBy: { _id: userData.uid, name: userData.name }
      };
      setTodos((prev) => [...prev, newTodoItem]);
      setNewTodo("");
    } catch (error) {
      alert("Error adding todo:", error);
    }
  };

  const toggleTodoCompletion = async (todoId) => {
    try {
      await api.put(`/todos/${todoId}`);
      setTodos((prev) =>
        prev.map((t) =>
          t._id === todoId ? { ...t, completed: !t.completed } : t
        )
      );
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
                key={todo._id}
                className="p-4 rounded-lg shadow flex items-center justify-between bg-white"
              >
              <div>
                <h3 className="text-lg font-medium">{todo.text}</h3>
                <p className="text-sm text-gray-500">
                  Created by:{" "}
                  <span className="font-bold">
                    {todo.createdBy?._id === userData.uid
                      ? "You"
                      : todo.createdBy?.name || "Unknown"}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoCompletion(todo._id)}
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
