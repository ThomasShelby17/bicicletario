import React, { useState, useRef, useEffect } from 'react';
import BikeForm from './BikeForm';
import type { Client } from '../utils/excel';

export default function ClientMenu({
  client,
  onRemove,
  onAddBike,
}: {
  client: Client;
  onRemove: () => void;
  onAddBike: (bike: { id?: string; model: string; serial?: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [openBike, setOpenBike] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // close menu on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  function handleRemove() {
    setOpen(false);
    if (confirm('Confirma remoção do cliente? Essa ação é irreversível.')) {
      onRemove();
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(s => !s)} aria-label="menu" title="Mais opções">⋯</button>

      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', border: '1px solid #ddd', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', zIndex: 50, minWidth: 160 }}>
          <button style={{ display: 'block', width: '100%', padding: 10, textAlign: 'left', background: 'transparent', border: 0 }} onClick={() => { setOpen(false); setOpenBike(true); }}>
            Cadastrar bicicleta
          </button>
          <button style={{ display: 'block', width: '100%', padding: 10, textAlign: 'left', background: 'transparent', border: 0, color: '#c00' }} onClick={handleRemove}>
            Remover cliente
          </button>
        </div>
      )}

      {openBike && (
        <BikeForm
          clienteCpf={client.cpf}
          onClose={() => setOpenBike(false)}
          onSave={(bike) => {
            onAddBike(bike);
            setOpenBike(false);
          }}
        />
      )}
    </div>
  );
}