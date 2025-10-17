import * as XLSX from 'xlsx';

export type Client = {
  name: string;
  number: string;
  cpf: string;
  bikes?: Array<{ id: string; model: string; serial?: string }>;
};

/**
 * Import clients from an uploaded file (xlsx, xls, csv).
 * Expects columns in order: nome, numero, cpf OR a header row containing these names.
 * Returns an array of Client with fields name, number, cpf.
 */
export async function importClientsFromFile(file: File): Promise<Client[]> {
  const buf = await file.arrayBuffer();
  const workbook = XLSX.read(buf, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  const result: Client[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    // Skip completely empty rows
    if (!row || row.length === 0 || row.every((c: any) => c === '' || c === null || c === undefined)) continue;

    // Detect header row (first row with strings like 'nome' or 'cpf')
    if (i === 0) {
      const first = String(row[0] || '').toLowerCase();
      const second = String(row[1] || '').toLowerCase();
      const third = String(row[2] || '').toLowerCase();
      if (first.includes('nome') || first.includes('name') || second.includes('numero') || third.includes('cpf')) {
        continue; // skip header
      }
    }

    // Read by order: [nome, numero, cpf]
    const nome = String(row[0] || '').trim();
    const numero = String(row[1] || '').trim();
    const cpf = String(row[2] || '').trim();

    if (nome || numero || cpf) {
      result.push({ name: nome, number: numero, cpf: cpf, bikes: [] });
    }
  }

  return result;
}

/**
 * Export clients to an .xlsx file with header row [nome, numero, cpf].
 */
export function exportClientsToFile(list: Client[]) {
  const data = [
    ['nome', 'numero', 'cpf'],
    ...list.map(c => [c.name || '', c.number || '', c.cpf || '']),
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'clientes');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'clientes.xlsx';
  a.click();
  URL.revokeObjectURL(url);
}