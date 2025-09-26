import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../api/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [nick, setNick] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('nick', nick);
      if (avatar) formData.append('avatar', avatar);

      const res = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      navigate('/chats');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao registrar');
    }
  };

  return (
    <div className="auth-container">
      <h2>Registrar</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Nick" value={nick} onChange={e=>setNick(e.target.value)} />
        <input type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} />
        <input type="file" accept="image/*" onChange={e=>setAvatar(e.target.files[0])} />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}
