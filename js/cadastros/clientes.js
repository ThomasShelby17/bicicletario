import { Utils } from '../shared/utils.js';
import { Storage } from '../shared/storage.js';

export class ClientesManager {
    constructor(app) {
        this.app = app;
        this.elements = {
            addClientForm: document.getElementById('add-client-form'),
            cpfInput: document.getElementById('cpf'),
            cpfError: document.getElementById('cpf-error'),
            telefoneInput: document.getElementById('telefone'),
            searchInput: document.getElementById('search'),
            clientList: document.getElementById('client-list'),
            clientDetailsSection: document.getElementById('client-details-section'),
            clientDetailsPlaceholder: document.getElementById('client-details-placeholder'),
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.elements.addClientForm.addEventListener('submit', this.handleAddClient.bind(this));
        this.elements.searchInput.addEventListener('input', (e) => this.renderClientList(e.target.value));
        this.elements.cpfInput.addEventListener('input', (e) => {
            e.target.value = Utils.formatCPF(e.target.value);
        });
        this.elements.telefoneInput.addEventListener('input', (e) => {
            e.target.value = Utils.formatTelefone(e.target.value);
        });
    }

    handleAddClient(e) {
        e.preventDefault();
        const formData = new FormData(this.elements.addClientForm);
        const nome = formData.get('nome');
        const cpf = formData.get('cpf');
        const telefone = formData.get('telefone');
        
        this.elements.cpfError.classList.add('hidden');
        this.elements.cpfInput.classList.remove('border-red-500');

        if (!Utils.validateCPF(cpf)) {
            this.elements.cpfError.textContent = 'CPF inválido.';
            this.elements.cpfError.classList.remove('hidden');
            this.elements.cpfInput.classList.add('border-red-500');
            return;
        }

        if(this.app.data.clients.some(c => c.cpf === cpf)) {
            this.elements.cpfError.textContent = 'CPF já cadastrado.';
            this.elements.cpfError.classList.remove('hidden');
            this.elements.cpfInput.classList.add('border-red-500');
            return;
        }

        const newClient = { id: Utils.generateUUID(), nome, cpf, telefone, bicicletas: [] };
        this.app.data.clients.push(newClient);
        Storage.saveClients(this.app.data.clients);
        this.renderClientList();
        this.elements.addClientForm.reset();
    }

    renderClientList(filter = '') {
        const lowercasedFilter = filter.toLowerCase();
        const filteredClients = this.app.data.clients.filter(client =>
            client.nome.toLowerCase().includes(lowercasedFilter) ||
            client.cpf.includes(filter)
        ).sort((a,b) => a.nome.localeCompare(b.nome));

        if (filteredClients.length === 0) {
            this.elements.clientList.innerHTML = `<p class="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Nenhum cliente encontrado.</p>`;
            return;
        }
        
        this.elements.clientList.innerHTML = filteredClients.map(client => `
            <div class="client-item p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-blue-400 cursor-pointer transition-colors dark:border-slate-700 dark:hover:bg-slate-700/50 dark:hover:border-blue-500 ${this.app.data.selectedClientId === client.id ? 'bg-blue-100 border-blue-400 dark:bg-blue-900/50 dark:border-blue-500' : ''}" data-id="${client.id}">
                <p class="font-semibold text-slate-800 dark:text-slate-100">${client.nome}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">${client.cpf}</p>
            </div>
        `).join('');

        this.elements.clientList.querySelectorAll('.client-item').forEach(item => {
            item.addEventListener('click', () => {
                this.app.data.selectedClientId = item.dataset.id;
                this.app.bicicletasManager.renderClientDetails();
                this.renderClientList(this.elements.searchInput.value);
            });
        });
    }
}
