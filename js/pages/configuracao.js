export class ConfiguracaoManager {
    constructor(app) {
        this.app = app;
        this.elements = {
            themeSystemBtn: document.getElementById('theme-system'),
            themeLightBtn: document.getElementById('theme-light'),
            themeDarkBtn: document.getElementById('theme-dark'),
            importBtn: document.getElementById('import-clients-btn'),
            exportBtn: document.getElementById('export-clients-btn'),
            importFileInput: document.getElementById('import-file-input'),
            searchInput: document.getElementById('config-search-input'),
            clientList: document.getElementById('config-client-list'),
        };
        
        this.addEventListeners();
        this.loadThemePreference();
        this.renderClientList();
    }
    
    addEventListeners() {
        this.elements.themeSystemBtn?.addEventListener('click', () => this.setTheme('system'));
        this.elements.themeLightBtn?.addEventListener('click', () => this.setTheme('light'));
        this.elements.themeDarkBtn?.addEventListener('click', () => this.setTheme('dark'));
        this.elements.importBtn?.addEventListener('click', () => this.elements.importFileInput?.click());
        this.elements.exportBtn?.addEventListener('click', () => this.exportClients());
        this.elements.importFileInput?.addEventListener('change', (e) => this.importClients(e));
        this.elements.searchInput?.addEventListener('input', (e) => this.filterClients(e.target.value));
    }
    
    loadThemePreference() {
        const savedTheme = localStorage.getItem('app_theme') || 'system';
        this.setTheme(savedTheme, false);
    }
    
    setTheme(theme, save = true) {
        if (save) {
            localStorage.setItem('app_theme', theme);
        }
        
        // Update button states
        [this.elements.themeSystemBtn, this.elements.themeLightBtn, this.elements.themeDarkBtn].forEach(btn => {
            btn?.classList.remove('bg-blue-500', 'text-white');
            btn?.classList.add('bg-slate-100', 'text-slate-700');
        });
        
        let activeBtn;
        if (theme === 'system') {
            activeBtn = this.elements.themeSystemBtn;
        } else if (theme === 'light') {
            activeBtn = this.elements.themeLightBtn;
        } else if (theme === 'dark') {
            activeBtn = this.elements.themeDarkBtn;
        }
        
        activeBtn?.classList.remove('bg-slate-100', 'text-slate-700');
        activeBtn?.classList.add('bg-blue-500', 'text-white');
        
        // Apply theme to document
        this.applyTheme(theme);
    }
    
    applyTheme(theme) {
        const htmlElement = document.documentElement;
        
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                htmlElement.classList.add('dark');
            } else {
                htmlElement.classList.remove('dark');
            }
        } else if (theme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
        
        // Update theme toggle icon in header
        if (this.app?.elements?.theme) {
            const isDark = htmlElement.classList.contains('dark');
            if (isDark) {
                this.app.elements.theme.icons.dark?.classList.remove('hidden');
                this.app.elements.theme.icons.light?.classList.add('hidden');
            } else {
                this.app.elements.theme.icons.dark?.classList.add('hidden');
                this.app.elements.theme.icons.light?.classList.remove('hidden');
            }
        }
    }
    
    async importClients(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (fileExtension === 'csv') {
            await this.importFromCSV(file);
        } else if (fileExtension === 'xlsx') {
            await this.importFromXLSX(file);
        } else {
            alert('Formato de arquivo não suportado. Use .xlsx ou .csv');
            return;
        }
        
        // Clear file input
        event.target.value = '';
    }
    
    async importFromCSV(file) {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        
        // Skip header if exists
        const startIndex = lines[0].toLowerCase().includes('nome') ? 1 : 0;
        const newClients = [];
        
        for (let i = startIndex; i < lines.length; i++) {
            const parts = lines[i].split(',').map(p => p.trim());
            if (parts.length >= 3) {
                const [nome, numero, cpf] = parts;
                if (nome && numero && cpf) {
                    newClients.push({
                        id: Date.now() + i,
                        nome,
                        numero,
                        cpf,
                        bicicletas: []
                    });
                }
            }
        }
        
        if (newClients.length > 0) {
            this.app.data.clients.push(...newClients);
            this.app.clientesManager.renderClientList();
            this.renderClientList();
            alert(`${newClients.length} cliente(s) importado(s) com sucesso!`);
        } else {
            alert('Nenhum cliente válido encontrado no arquivo.');
        }
    }
    
    async importFromXLSX(file) {
        // This would require the xlsx library
        // For now, show a message
        alert('Importação de XLSX requer a biblioteca xlsx. Execute: npm install xlsx');
    }
    
    exportClients() {
        const clients = this.app.data.clients;
        
        if (clients.length === 0) {
            alert('Não há clientes para exportar.');
            return;
        }
        
        // Export as CSV
        const headers = 'nome,numero,cpf\n';
        const rows = clients.map(c => `${c.nome},${c.numero},${c.cpf}`).join('\n');
        const csv = headers + rows;
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    filterClients(searchTerm) {
        const term = searchTerm.toLowerCase();
        const clients = this.app.data.clients;
        
        const filtered = clients.filter(client => 
            client.nome.toLowerCase().includes(term) ||
            client.cpf.includes(term) ||
            client.numero.includes(term)
        );
        
        this.renderClientList(filtered);
    }
    
    renderClientList(clientsToRender = null) {
        const clients = clientsToRender || this.app.data.clients;
        const container = this.elements.clientList;
        
        if (!container) return;
        
        if (clients.length === 0) {
            container.innerHTML = '<p class="text-slate-500 text-center py-4">Nenhum cliente encontrado.</p>';
            return;
        }
        
        container.innerHTML = clients.map(client => `
            <div class="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="font-semibold text-slate-900 dark:text-slate-100">${client.nome}</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400">CPF: ${client.cpf}</p>
                        <p class="text-sm text-slate-500 dark:text-slate-400">Nº: ${client.numero}</p>
                        ${client.bicicletas && client.bicicletas.length > 0 ? 
                            `<p class="text-xs text-blue-600 dark:text-blue-400 mt-1">${client.bicicletas.length} bicicleta(s)</p>` 
                            : ''
                        }
                    </div>
                    <div class="flex gap-2">
                        <button onclick="app.configuracaoManager.addBike('${client.id}')" 
                                class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded" 
                                title="Cadastrar bicicleta">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="18.5" cy="17.5" r="3.5"/>
                                <circle cx="5.5" cy="17.5" r="3.5"/>
                                <circle cx="15" cy="5" r="1"/>
                                <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
                            </svg>
                        </button>
                        <button onclick="app.configuracaoManager.removeClient('${client.id}')" 
                                class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded" 
                                title="Remover cliente">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    addBike(clientId) {
        // This would integrate with BikeForm component
        // For now, just show an alert
        const client = this.app.data.clients.find(c => c.id == clientId);
        if (client) {
            alert(`Funcionalidade de cadastrar bicicleta para ${client.nome} será implementada.`);
        }
    }
    
    removeClient(clientId) {
        const client = this.app.data.clients.find(c => c.id == clientId);
        if (!client) return;
        
        if (confirm(`Tem certeza que deseja remover ${client.nome}?`)) {
            this.app.data.clients = this.app.data.clients.filter(c => c.id != clientId);
            this.app.clientesManager.renderClientList();
            this.renderClientList();
            alert('Cliente removido com sucesso!');
        }
    }
}
