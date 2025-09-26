const sendMessage = () => {
  if (!text) return;
  if (text.startsWith('/openbau')) {
    setShowChest('Você ganhou Espada de Bronze!');
    setText('');
    return;
  }
  if (text.startsWith('/roll')) {
    const match = text.match(/\d+d\d+/);
    let result = 'Erro';
    if (match) {
      const [n, sides] = match[0].split('d').map(Number);
      const rolls = Array.from({length:n},()=>Math.floor(Math.random()*sides)+1);
      result = rolls.join(', ') + ` (total: ${rolls.reduce((a,b)=>a+b,0)})`;
    }
    setMessages(prev=>[...prev,{content:`${text} → ${result}`, type:'system'}]);
    setText('');
    return;
  }
  if (text.startsWith('/me')) {
    const action = text.slice(4);
    setMessages(prev=>[...prev,{content:`* ${action} *`, type:'system'}]);
    setText('');
    return;
  }

  socket.emit('send_message', { chatId, senderUserId: userId, content: text });
  setText('');
};
