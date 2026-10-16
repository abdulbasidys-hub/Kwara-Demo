export const uid = (prefix = 'id') => prefix + Math.random().toString(36).slice(2, 9);

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

export const fmtDateTime = (d) =>
  new Date(d).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const fmtMoney = (n) => '₦' + Number(n || 0).toLocaleString('en-NG');

export const fmtSize = (b) => (b >= 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB');

export const initials = (name = '') =>
  name
    .replace(/^(Dr\.|Mr\.|Mrs\.|Prof\.)\s*/, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export function exportCSV(filename, rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.map(esc).join(','), ...rows.map((r) => headers.map((h) => esc(r[h])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const MAX_UPLOAD = 2e6;

// Reads a File into { name, size, dataUrl } so it can be stored and downloaded later
export const readFile = (file) =>
  new Promise((resolve, reject) => {
    if (file.size > MAX_UPLOAD) return reject(new Error(`${file.name} is larger than 2 MB`));
    const r = new FileReader();
    r.onload = () => resolve({ name: file.name, size: file.size, dataUrl: r.result });
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

export function downloadFile({ name, dataUrl }) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = name;
  a.click();
}
