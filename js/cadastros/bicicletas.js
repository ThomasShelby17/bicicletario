import { Utils } from '../shared/utils.js';
import { Storage } from '../shared/storage.js';

export class BicicletasManager {
    constructor(app) {
        this.app = app;
        this.elements = {
            clientDetailsSection: document.getElementById('client-details-section'),
            clientDetailsPlaceholder: document.getElementById('client-details-placeholder'),
            addBikeModal: document.getElementById('add-bike-modal'),
            addBikeForm: document.getElementById('add-bike-form'),
            cancelAddBikeBtn: document.getElementById('cancel-add-bike'),
            bikeClientIdInput: document.getElementById('bike-client-id'),
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.elements.addBikeForm.addEventListener('submit', this.handleAddBike.bind(this));
        this.elements.cancelAddBikeBtn.addEventListener('click', () => this.app.toggleModal('add-bike-modal', false));
    }

    handleAddBike(e) {
        e.preventDefault();
        const clientId = this.elements.bikeClientIdInput.value;
        const modelo = document.getElementById('bike-modelo').value;
        const marca = document.getElementById('bike-marca').value;
        const cor = document.getElementById('bike-cor').value;

        const client = this.app.data.clients.find(c => c.id === clientId);
        if (client) {
            const newBike = { id: Utils.generateUUID(), modelo, marca, cor };
            client.bicicletas.push(newBike);
            Storage.saveClients(this.app.data.clients);
            this.renderClientDetails();
            this.app.toggleModal('add-bike-modal', false);
        }
    }

    openAddBikeModal(clientId) {
        this.elements.addBikeForm.reset();
        this.elements.bikeClientIdInput.value = clientId;
        this.app.toggleModal('add-bike-modal', true);
    }

    renderClientDetails() {
        if (!this.app.data.selectedClientId) {
            this.elements.clientDetailsSection.classList.add('hidden');
            this.elements.clientDetailsPlaceholder.classList.remove('hidden');
            return;
        }
        
        const client = this.app.data.clients.find(c => c.id === this.app.data.selectedClientId);
        if (!client) return;

        this.elements.clientDetailsPlaceholder.classList.add('hidden');
        this.elements.clientDetailsSection.classList.remove('hidden');

        const bikesHTML = client.bicicletas.length > 0 ? client.bicicletas.map(bike => `
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 dark:bg-slate-700/40 dark:border-slate-700">
               <div class="flex justify-between items-start">
                    <div>
                        <p class="font-semibold text-slate-800 dark:text-slate-100">${bike.modelo} <span class="font-normal text-slate-600 dark:text-slate-300">(${bike.marca})</span></p>
                        <p class="text-sm text-slate-500 dark:text-slate-400">Cor: ${bike.cor}</p>
                    </div>
                    <button class="add-registro-btn flex items-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md shadow-sm transition-colors dark:bg-blue-500 dark:hover:bg-blue-600" data-bike-id="${bike.id}">
                        <i data-lucide="log-in" class="h-4 w-4 mr-1"></i>
                        Registrar Entrada
                    </button>
               </div>
               <div class="mt-4">
                    <h4 class="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Histórico de Movimentação</h4>
                    ${this.app.registrosManager.renderRegistrosTable(bike.id)}
               </div>
            </div>
        `).join('') : '<p class="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Nenhuma bicicleta cadastrada.</p>';

        this.elements.clientDetailsSection.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">${client.nome}</h3>
                    <p class="text-slate-500 dark:text-slate-400">${client.cpf} &bull; ${client.telefone}</p>
                </div>
                <button id="add-bike-to-client-btn" class="flex items-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow-sm transition-colors dark:bg-blue-500 dark:hover:bg-blue-600">
                    <i data-lucide="plus" class="h-4 w-4 mr-1"></i>
                    Adicionar Bicicleta
                </button>
            </div>
            <div class="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                ${bikesHTML}
            </div>
        `;

        lucide.createIcons();
        
        document.getElementById('add-bike-to-client-btn').addEventListener('click', () => this.openAddBikeModal(client.id));
        this.elements.clientDetailsSection.querySelectorAll('.add-registro-btn').forEach(btn => {
            btn.addEventListener('click', () => this.app.registrosManager.openAddRegistroModal(client.id, btn.dataset.bikeId));
        });
    }
}
