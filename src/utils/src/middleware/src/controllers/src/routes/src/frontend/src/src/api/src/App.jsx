import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';
import CharacterCreation from './pages/CharacterCreation';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chats" element={<ChatList />} />
      <Route path="/chat/:chatId" element={<ChatRoom />} />
      <Route path="/create-character/:chatId" element={<CharacterCreation />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
