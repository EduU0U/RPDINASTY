import React, { useEffect, useState } from 'react';
import { api } from '../api/api';

export default function Guilds() {
  const [guilds, setGuilds] = useState([]);
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [lore, setLore] = useState('');

  useEffect(() => { api.get('/guilds').then(res => setGuilds(res.data)); }, []);

  const create = async () => {
    const res = await api.post('/guilds/create', { name, tag, lore });
    setGuilds([...guilds, res.data.guild]);
  };

  return (
    <div>
      <h2>Guildas</h2>
      <ul>{guilds.map(g => <li key={g.id}>{g.tag} - {g.name}</li>)}</ul>
      <h3>Criar Guilda</h3>
      <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Tag" value={tag} onChange={e=>setTag(e.target.value)} />
      <input placeholder="Lore" value={lore} onChange={e=>setLore(e.target.value)} />
      <button onClick={create}>Criar</button>
    </div>
  );
}
