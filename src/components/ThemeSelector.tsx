import React, { useEffect, useState } from 'react';

const THEME_KEY = 'app_theme'; // values: system | light | dark

function applyTheme(value: string) {
  const root = document.documentElement;
  if (value === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', value);
  }
}

export default function ThemeSelector() {
  const [theme, setTheme] = useState<string>(() => localStorage.getItem(THEME_KEY) || 'system');

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <div>
      <label style={{ marginRight: 12 }}>
        <input type="radio" name="theme" checked={theme === 'system'} onChange={() => setTheme('system')} />
        Sistema
      </label>
      <label style={{ marginRight: 12 }}>
        <input type="radio" name="theme" checked={theme === 'light'} onChange={() => setTheme('light')} />
        Claro
      </label>
      <label>
        <input type="radio" name="theme" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
        Escuro
      </label>
    </div>
  );
}