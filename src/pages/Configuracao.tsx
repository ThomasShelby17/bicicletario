import React, { useEffect, useState } from 'react';
import ThemeSelector from '../components/ThemeSelector';
import { importClientsFromFile, exportClientsToFile, Client } from '../utils/excel';
import ClientMenu from '../components/ClientMenu';

const STORAGE_KEY = 'clients';

function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('failed to load clients', e);
    return [];
  }
}

function saveClients(clients: Client[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export default function Configuracao() {
  const [clients, setClients] = useState<Client[]>(() => loadClients());
  const [query, setQuery] = useState('');

  useEffect(() => {
    saveClients(clients);
  }, [clients]);

  const onImport = async (file: File | null) => {
    if (!file) return;
    try {
      const imported = await importClientsFromFile(file);
      // merge by CPF: update if exists, otherwise insert
      const map = new Map<string, Client>();
      clients.forEach(c => map.set((c.cpf || '').replace(/\D/g, ''), c));
      imported.forEach(ic => {
        const key = (ic.cpf || '').replace(/\D/g, '');
        if (!key) return; // skip invalid
        if (map.has(key)) {
          const existing = map.get(key)!;
          map.set(key, { ...existing, ...ic });
        } else {
          map.set(key, ic);
        }
      });
      const merged = Array.from(map.values());
      setClients(merged);
      alert(`Importado: ${imported.length} linha(s).`);
    } catch (e) {
      console.error(e);
      alert('Erro ao importar arquivo. Verifique o formato.');
    }
  };

  const onExport = () => {
    exportClientsToFile(clients);
  };

  const onRemoveClient = (cpf: string) => {
    const norm = (cpf || '').replace(/\D/g, '');
    if (!norm) return;
    if (!confirm('Confirma remover este cliente?')) return;
    const filtered = clients.filter(c => (c.cpf || '').replace(/\D/g, '') !== norm);
    setClients(filtered);
  };

  const onAddBikeToClient = (cpf: string, bike: { model: string; serial?: string }) => {
    const norm = (cpf || '').replace(/\D/g, '');
    setClients(prev => prev.map(c => {
      if ((c.cpf || '').replace(/\D/g, '') !== norm) return c;
      const bikes = c.bikes ? [...c.bikes] : [];
      bikes.push({ id: String(Date.now()), ...bike });
      return { ...c, bikes };
    }));
  };

  const filtered = clients.filter(c => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.cpf || '').toLowerCase().includes(q) ||
      (c.number || '').toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Configuração</h1>
      <ThemeSelector />

      <section style={{ marginTop: 20 }}>
        <h2>Importar clientes</h2>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={e => onImport(e.target.files ? e.target.files[0] : null)}
        />
        <p>Formato: colunas na ordem nome,numero,cpf</p>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Exportar clientes</h2>
        <button onClick={onExport}>Exportar (.xlsx)</button>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Buscar clientes</h2>
        <input
          placeholder="Buscar por nome, CPF ou número"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ width: '100%', padding: 8 }}
        />
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Clientes ({filtered.length})</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filtered.map(c => (
            <li key={c.cpf || c.number || Math.random()} style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div><strong>{c.name}</strong></div>
                <div>Número: {c.number}</div>
                <div>CPF: {c.cpf}</div>
              </div>
              <div>
                <ClientMenu client={c} onRemove={() => onRemoveClient(c.cpf || '')} onAddBike={(bike) => onAddBikeToClient(c.cpf || '', bike)} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}