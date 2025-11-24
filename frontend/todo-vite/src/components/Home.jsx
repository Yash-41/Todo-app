import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [updatingTask, setUpdatingTask] = useState(null);

  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user_id && token) {
      fetchTodos();
    } else {
      console.error("User not logged in!");
    }
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/tasks/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a title!");

    try {
      await axios.post(
        "http://localhost:3000/api/tasks/add",
        {
          UserId: parseInt(user_id),
          Title: title,
          Description: description,
          Status: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Task added 🎉", { position: "top-right", autoClose: 1500 });
      setTitle("");
      setDescription("");
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
      alert("Error adding task");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    try {
      await axios.patch(
        `http://localhost:3000/api/tasks/updatestatus/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTodos();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleUpdateClick = (todo) => {
    setUpdatingTask({
      id: todo.id,
      title: todo.title,
      description: todo.description,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updatingTask) return;

    try {
      await axios.put(
        `http://localhost:3000/api/tasks/${updatingTask.id}`,
        {
          Title: updatingTask.title,
          Description: updatingTask.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Task updated successfully!", { autoClose: 1500 });
      setUpdatingTask(null);
      fetchTodos();
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="home-container">
      <h2 className="home-title">Welcome to your To-Do Dashboard!</h2>

      <form className="add-todo-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Add a new title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="todo-input"
        />
        <input
          type="text"
          placeholder="Add description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="todo-input"
        />
        <button type="submit" className="todo-btn">Add</button>
      </form>

      {updatingTask && (
        <div className="update-modal">
          <form className="update-form" onSubmit={handleUpdateSubmit}>
            <h3>Update Task</h3>
            <input
              type="text"
              value={updatingTask.title}
              onChange={(e) =>
                setUpdatingTask({ ...updatingTask, title: e.target.value })
              }
              placeholder="Title"
            />
            <input
              type="text"
              value={updatingTask.description}
              onChange={(e) =>
                setUpdatingTask({ ...updatingTask, description: e.target.value })
              }
              placeholder="Description"
            />
            <div className="update-btn-group">
              <button type="submit" className="todo-btn">Save</button>
              <button
                type="button"
                className="delete-btn"
                onClick={() => setUpdatingTask(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="todo-list">
        {todos.length === 0 ? (
          <p>No todos yet! Add one above.</p>
        ) : (
          <table className="todo-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr
                  key={todo.id}
                  className={todo.status === "completed" ? "completed-row" : ""}
                >
                  <td><strong>{todo.title}</strong></td>
                  <td>{todo.description}</td>
                  <td>
                    <button
                      className={
                        todo.status === "completed"
                          ? "status-btn status-completed"
                          : "status-btn status-pending"
                      }
                      onClick={() => handleStatusToggle(todo.id, todo.status)}
                      title={todo.status === "completed" ? "Mark as pending" : "Mark as completed"}
                    >
                      {todo.status === "completed" ? "Completed ✔️" : "Pending ⏳"}
                    </button>
                  </td>
                  <td>
                    <div className="action-btn-group">
                      <button
                        className="update-btn action-btn"
                        onClick={() => handleUpdateClick(todo)}
                      >
                        Update
                      </button>
                      <button
                        className="delete-btn action-btn"
                        onClick={() => handleDelete(todo.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
