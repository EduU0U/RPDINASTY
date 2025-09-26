import React, { useEffect, useState } from 'react';

export default function OpenChest({ text, onClose }) {
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(true); }, []);

  return (
    <div className={`chest-overlay ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="chest-bubble">
        <p>{text}</p>
        <small>(Clique para fechar)</small>
      </div>
    </div>
  );
}
