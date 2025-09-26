import React, { useState } from 'react';
import { api } from '../api/api';

export default function AdminPanel() {
  const [chatId, setChatId] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const createEvent = async () => {
    await api.post('/admin/boss', { chatId, title, description: desc });
    alert('Evento criado!');
  };

  const grantChest = async () => {
    const charId = prompt('ID do personagem');
    const item = prompt('Nome do item');
    await api.post('/admin/grant-chest', { characterId: charId, item });
    alert('Baú concedido!');
  };

  return (
    <div>
      <h2>Painel Admin</h2>
      <h3>Criar Boss Event</h3>
      <input placeholder="Chat ID" value={chatId} onChange={e=>setChatId(e.target.value)} />
      <input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="Descrição" value={desc} onChange={e=>setDesc(e.target.value)} />
      <button onClick={createEvent}>Criar</button>
      <h3>Conceder Baú</h3>
      <button onClick={grantChest}>Conceder</button>
    </div>
  );
}
