import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../api/api';

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    setToken(token);

    api.get('/chats').then(res => setChats(res.data));
  }, []);

  const enterChat = (chat) => {
    if (chat.type === 'rpg') navigate(`/create-character/${chat.id}`);
    else navigate(`/chat/${chat.id}`);
  };

  return (
    <div className="chat-list">
      <h2>Chats Disponíveis</h2>
      <ul>
        {chats.map(c => (
          <li key={c.id} onClick={() => enterChat(c)}>
            {c.image_url && <img src={`http://localhost:4000/${c.image_url}`} alt="" />}
            <span>{c.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
