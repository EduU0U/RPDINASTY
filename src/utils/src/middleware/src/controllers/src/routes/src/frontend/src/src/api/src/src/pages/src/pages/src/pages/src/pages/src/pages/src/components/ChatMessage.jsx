import React from 'react';

export default function ChatMessage({ message }) {
  if (message.type === 'system') return <div className="msg-system">{message.content}</div>;
  return <div className="msg-user"><b>{message.senderUserId}</b>: {message.content}</div>;
}
