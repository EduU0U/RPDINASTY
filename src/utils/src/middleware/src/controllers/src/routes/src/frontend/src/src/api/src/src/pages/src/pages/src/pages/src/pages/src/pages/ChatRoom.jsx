import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { api, setToken } from '../api/api';
import ChatMessage from '../components/ChatMessage';
import OpenChest from '../components/OpenChest';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
let socket;

export default function ChatRoom() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showChest, setShowChest] = useState(null);
  const userId = localStorage.getItem('userId');
  const scrollRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setToken(token);

    socket = io(SOCKET_URL);
    socket.emit('join_chat', chatId);

    socket.on('new_message', msg => setMessages(prev => [...prev, msg]));
    socket.on('system_message', msg => setMessages(prev => [...prev, { ...msg, type: 'system' }]));

    return () => {
      socket.emit('leave_chat', chatId);
      socket.disconnect();
    };
  }, [chatId]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = () => {
    if (!text) return;
    if (text.startsWith('/openbau')) {
      setShowChest('Você ganhou Espada de Bronze!');
      text = '';
      return;
    }
    socket.emit('send_message', { chatId, senderUserId: userId, content: text });
    setText('');
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map((m, idx) => <ChatMessage key={idx} message={m} />)}
        <div ref={scrollRef}></div>
      </div>
      {showChest && <OpenChest text={showChest} onClose={()=>setShowChest(null)} />}
      <div className="chat-input">
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter' && sendMessage()} />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
