import React from 'react'
import { useState } from 'react';
 import "./Todo.css";

function Todo() {
     const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

 const addTask = async () => {
  if (task.trim() === "") return;

  const response = await fetch('https://mern-todolist-session.onrender.com/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // important to send session cookie
    body: JSON.stringify({ task })
  });

  const data = await response.json();

  if (data.success) {
    setTodos([...todos, { 
      text: data.todo.text, 
      completed: data.todo.completed, 
      _id: data.todo._id 
    }]);
    setTask(""); // clear input
    alert("Task added");
  } else {
    alert("Task not added: " + (data.message || ""));
  }
};

  const toggleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

 const deleteTask = async (todo) => {
  // Remove from frontend
  setTodos(todos.filter(t => t !== todo));

  // Remove from backend
  const response = await fetch(`https://mern-todolist-session.onrender.com/delete/${todo._id}`, {
    method: 'DELETE',
      credentials: 'include'  // <-- important

  });

  const data = await response.json();
  if (data.success) {
    alert("Task deleted");
  } else {
    alert("Task not deleted");
  }





  };

  return (
     <>
          <div className="todo-container">
      <h1>Todo List</h1>

      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter task"
      />
      <button className="add-btn" onClick={addTask}>
        Add Task
      </button>

      <ul className="todo-list">
        {todos.map((todo, index) => (
  <li key={index}>
    <span
      onClick={() => toggleComplete(index)}
      className={todo.completed ? "completed" : ""}
    >
      {todo.text}
    </span>
    <button onClick={() => deleteTask(todo)}>Delete</button>
  </li>
))}

      </ul>
    </div>
     </>
  )
}

export default Todo