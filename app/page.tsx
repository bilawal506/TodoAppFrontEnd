"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import './globals.css'; // Make sure this is the correct path for your project

interface Todo {
  id: string;
  content: string;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoContent, setTodoContent] = useState('');
  const [todoId, setTodoId] = useState('');
  const [action, setAction] = useState('Add');
  
  const fetchTodos = async () => {
    try {
      const response = await axios.get('https://related-frog-charmed.ngrok-free.app/todos/');
      console.log("This should be the data", response.data);
      if (Array.isArray(response.data)) {
        setTodos(response.data); 
      } else {
        console.error('Received data is not an array', response.data);
        // Add additional logging or handling here
      }
    } catch (error) {
      console.error('There was an error fetching the todos:', error);
      setTodos([]); // In case of error, ensure todos is still an array
    }
  };
  

  const handleSubmit = async () => {
    try {
      const url = action === 'Add'
        ? 'https://related-frog-charmed.ngrok-free.app/todos/'
        : `https://related-frog-charmed.ngrok-free.app/todos/${todoId}`;

      const method = action === 'Delete' ? 'delete' : action === 'Add' ? 'post' : 'patch';
      const data = action === 'Delete' ? {} : { id: todoId, content: todoContent };

      await axios({ method, url, data });
      setTodoContent('');
      setTodoId('');
      fetchTodos();
    } catch (error) {
      console.error(`There was an error processing the todo: ${error}`);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="app">
      <div className="header">
        <h1 style={{"fontSize":50}}>Welcome, User!</h1>
      </div>
      <div className="todo-interface">
        <select className="action-select" value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="Add">Add</option>
          <option value="Update">Update</option>
          <option value="Delete">Delete</option>
        </select>
        <input
          className="todo-input"
          type="text"
          placeholder="Enter Todo ID"
          value={todoId}
          onChange={(e) => setTodoId(e.target.value)}
        />
        {action !== 'Delete' && (
          <input
            className="todo-input"
            type="text"
            placeholder="What do you need to do?"
            value={todoContent}
            onChange={(e) => setTodoContent(e.target.value)}
          />
        )}
        <button onClick={handleSubmit} className="submit-button">
          {action}
        </button>
      </div>
      <div className="todo-list-container">
        {todos.length ? todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <span style={{"marginRight":-325}}>ID: {todo.id}</span>
            <span>{todo.content}</span>
            <div className="todo-actions">
              <button onClick={() => { setTodoId(todo.id); setTodoContent(todo.content); setAction('Update'); }} className="edit-button">
                Edit
              </button>
              <button onClick={() => { setTodoId(todo.id); setAction('Delete'); handleSubmit(); }} className="delete-button">
                Delete
              </button>
            </div>
          </div>)) : (<p className="no-todos">No todos to show</p>)}
      </div>
    </div>
  );
};

export default TodoApp;
