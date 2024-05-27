import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMessage) {
        await axios.put(`http://localhost:5000/messages/${editingMessage.id}`, { username, message });
        setEditingMessage(null);
      } else {
        await axios.post('http://localhost:5000/messages', { username, message });
      }
      setUsername('');
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error submitting message:', error);
    }
  };

  const handleEdit = (msg) => {
    setUsername(msg.username);
    setMessage(msg.message);
    setEditingMessage(msg);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/messages/${id}`);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div>
      <h1>Message Board</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button type="submit">{editingMessage ? 'Update' : 'Post'}</button>
      </form>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.username}</strong>: {msg.message}
            <button onClick={() => handleEdit(msg)}>Edit</button>
            <button onClick={() => handleDelete(msg.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
