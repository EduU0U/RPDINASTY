import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/api';

export default function CharacterCreation() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      formData.append('chatId', chatId);
      if (avatar) formData.append('avatar', avatar);

      await api.post('/characters/create', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/chat/${chatId}`);
    } catch (err) {
      console.error(err);
      alert('Erro ao criar personagem');
    }
  };

  return (
    <div className="character-creation">
      <h2>Criar Personagem</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome do personagem" value={name} onChange={e=>setName(e.target.value)} />
        <textarea placeholder="História curta" value={bio} onChange={e=>setBio(e.target.value)} />
        <input type="file" accept="image/*" onChange={e=>setAvatar(e.target.files[0])} />
        <button type="submit">Criar</button>
      </form>
    </div>
  );
}
