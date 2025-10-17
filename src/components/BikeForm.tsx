import React, { useState } from 'react';

type Props = {
  clienteCpf: string;
  onClose: () => void;
  onSave: (bike: { id?: string; model: string; serial?: string }) => void;
};

export default function BikeForm({ clienteCpf, onClose, onSave }: Props) {
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!model.trim()) {
      alert('Informe o modelo da bike');
      return;
    }
    onSave({ id: String(Date.now()), model: model.trim(), serial: serial.trim() || undefined });
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 16, borderRadius: 6, width: 360 }}>
        <h3 style={{ marginTop: 0 }}>Cadastrar bicicleta para CPF: {clienteCpf}</h3>

        <div style={{ marginTop: 8 }}>
          <label style={{ display: 'block', fontSize: 13 }}>Modelo</label>
          <input value={model} onChange={e => setModel(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label style={{ display: 'block', fontSize: 13 }}>Serial / Identificação</label>
          <input value={serial} onChange={e => setSerial(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <button type="button" onClick={onClose} style={{ marginRight: 8 }}>Cancelar</button>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}