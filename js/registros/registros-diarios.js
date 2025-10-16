import { Utils } from '../shared/utils.js';
import { Storage } from '../shared/storage.js';

export class RegistrosManager {
    constructor(app) {
        this.app = app;
        this.elements = {
            addRegistroModal: document.getElementById('add-registro-modal'),
            addRegistroForm: document.getElementById('add-registro-form'),
            cancelAddRegistroBtn: document.getElementById('cancel-add-registro'),
            registroClientIdInput: document.getElementById('registro-client-id'),
            registroBikeIdInput: document.getElementById('registro-bike-id'),
            registroClientName: document.getElementById('registro-client-name'),
            registroBikeInfo: document.getElementById('registro-bike-info'),
            dailyRecordsDateInput: document.getElementById('daily-records-date'),
            dailyRecordsSearchInput: document.getElementById('daily-records-search'),
            dailyRecordsList: document.getElementById('daily-records-list'),
            exportBtn: document.getElementById('export-btn'),
            exportOptions: document.getElementById('export-options'),
            exportCsvBtn: document.getElementById('export-csv'),
            exportPdfBtn: document.getElementById('export-pdf'),
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.elements.addRegistroForm.addEventListener('submit', this.handleAddRegistro.bind(this));
        this.elements.cancelAddRegistroBtn.addEventListener('click', () => this.app.toggleModal('add-registro-modal', false));
        this.elements.dailyRecordsDateInput.addEventListener('change', this.renderDailyRecords.bind(this));
        this.elements.dailyRecordsSearchInput.addEventListener('input', this.renderDailyRecords.bind(this));
        this.elements.dailyRecordsList.addEventListener('click', this.handleRegisterSaida.bind(this));
        this.elements.dailyRecordsList.addEventListener('change', this.handleActionChange.bind(this));
        this.elements.exportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleExportMenu();
        });
        this.elements.exportCsvBtn.addEventListener('click', () => this.exportToCSV());
        this.elements.exportPdfBtn.addEventListener('click', () => this.exportToPDF());
        window.addEventListener('click', () => this.toggleExportMenu(false));
    }

    handleAddRegistro(e) {
        e.preventDefault();
        const clientId = this.elements.registroClientIdInput.value;
        const bikeId = this.elements.registroBikeIdInput.value;
        const client = this.app.data.clients.find(c => c.id === clientId);
        const bike = client?.bicicletas.find(b => b.id === bikeId);
        
        if(bike) {
            const newRegistro = { 
                id: Utils.generateUUID(), 
                dataHoraEntrada: new Date().toISOString(), 
                dataHoraSaida: null,
                clientId: clientId,
                bikeId: bikeId,
            };
            this.app.data.registros.push(newRegistro);
            Storage.saveRegistros(this.app.data.registros);
            
            this.app.bicicletasManager.renderClientDetails();
            if (this.app.data.activeTab === 'registros-diarios') {
                this.renderDailyRecords();
            }
            this.app.toggleModal('add-registro-modal', false);
        }
    }

    openAddRegistroModal(clientId, bikeId) {
        const client = this.app.data.clients.find(c => c.id === clientId);
        const bike = client?.bicicletas.find(b => b.id === bikeId);

        if (client && bike) {
            this.elements.addRegistroForm.reset();
            this.elements.registroClientIdInput.value = clientId;
            this.elements.registroBikeIdInput.value = bikeId;
            this.elements.registroClientName.textContent = client.nome;
            this.elements.registroBikeInfo.textContent = `${bike.modelo} (${bike.marca} - ${bike.cor})`;
            this.app.toggleModal('add-registro-modal', true);
        }
    }

    handleRegisterSaida(e) {
        if (e.target.closest('.register-saida-btn')) {
            const btn = e.target.closest('.register-saida-btn');
            const registroId = btn.dataset.registroId;
            const registro = this.app.data.registros.find(r => r.id === registroId);
            
            if (registro && !registro.dataHoraSaida) {
                registro.dataHoraSaida = new Date().toISOString();
                Storage.saveRegistros(this.app.data.registros);
                this.renderDailyRecords();
                this.app.bicicletasManager.renderClientDetails();
            }
        }
    }

    handleActionChange(e) {
        if (e.target.classList.contains('action-select')) {
            const select = e.target;
            const action = select.value;
            const registroId = select.dataset.registroId;
            const clientId = select.dataset.clientId;
            const bikeId = select.dataset.bikeId;
            
            if (!action) return;

            switch(action) {
                case 'saida':
                    this.registerSaida(registroId);
                    break;
                case 'remover':
                    this.removerAcesso(registroId);
                    break;
                case 'alterar':
                    this.alterarRegistro(registroId);
                    break;
                case 'adicionar':
                    this.adicionarBike(clientId, registroId);
                    break;
            }
            
            select.value = '';
        }
    }

    registerSaida(registroId) {
        const registro = this.app.data.registros.find(r => r.id === registroId);
        if (registro && !registro.dataHoraSaida) {
            registro.dataHoraSaida = new Date().toISOString();
            Storage.saveRegistros(this.app.data.registros);
            this.renderDailyRecords();
            this.app.bicicletasManager.renderClientDetails();
        }
    }

    removerAcesso(registroId) {
        if (confirm('Tem certeza que deseja remover o acesso desta bicicleta?')) {
            const registro = this.app.data.registros.find(r => r.id === registroId);
            if (registro && !registro.dataHoraSaida) {
                registro.dataHoraSaida = new Date().toISOString();
                registro.acessoRemovido = true;
                Storage.saveRegistros(this.app.data.registros);
                this.renderDailyRecords();
                this.app.bicicletasManager.renderClientDetails();
                alert('Acesso removido com sucesso!');
            }
        }
    }

    alterarRegistro(registroId) {
        const registro = this.app.data.registros.find(r => r.id === registroId);
        if (!registro) return;

        const novaEntrada = prompt('Digite a nova data/hora de entrada (formato: dd/mm/aaaa hh:mm):', 
            new Date(registro.dataHoraEntrada).toLocaleString('pt-BR'));
        
        if (novaEntrada) {
            const [dataPart, timePart] = novaEntrada.split(' ');
            const [dia, mes, ano] = dataPart.split('/');
            const [hora, minuto] = timePart.split(':');
            const novaData = new Date(ano, mes - 1, dia, hora, minuto);
            
            if (!isNaN(novaData.getTime())) {
                registro.dataHoraEntrada = novaData.toISOString();
                Storage.saveRegistros(this.app.data.registros);
                this.renderDailyRecords();
                alert('Registro alterado com sucesso!');
            } else {
                alert('Data/hora inválida!');
            }
        }
    }

    adicionarBike(clientId, registroId) {
        const client = this.app.data.clients.find(c => c.id === clientId);
        if (!client || !client.bicicletas || client.bicicletas.length === 0) {
            alert('Cliente não tem bicicletas cadastradas.');
            return;
        }

        const registroOriginal = this.app.data.registros.find(r => r.id === registroId);
        
        const bikesDisponiveis = client.bicicletas.filter(bike => {
            const temRegistroAberto = this.app.data.registros.some(r => 
                r.bikeId === bike.id && !r.dataHoraSaida
            );
            return !temRegistroAberto;
        });

        if (bikesDisponiveis.length === 0) {
            alert('Todas as bicicletas deste cliente já estão com registro aberto.');
            return;
        }

        let options = bikesDisponiveis.map((bike, idx) => 
            `${idx + 1}. ${bike.modelo} (${bike.marca} - ${bike.cor})`
        ).join('\n');
        
        const escolha = prompt(`Escolha uma bicicleta para adicionar:\n${options}\n\nDigite o número:`);
        
        if (escolha) {
            const index = parseInt(escolha) - 1;
            if (index >= 0 && index < bikesDisponiveis.length) {
                const bikeSelecionada = bikesDisponiveis[index];
                const novoRegistro = {
                    id: Utils.generateUUID(),
                    dataHoraEntrada: registroOriginal.dataHoraEntrada,
                    dataHoraSaida: null,
                    clientId: clientId,
                    bikeId: bikeSelecionada.id,
                };
                this.app.data.registros.push(novoRegistro);
                Storage.saveRegistros(this.app.data.registros);
                this.renderDailyRecords();
                alert('Bicicleta adicionada ao mesmo registro com sucesso!');
            } else {
                alert('Opção inválida!');
            }
        }
    }

    renderRegistrosTable(bikeId) {
        const bikeRegistros = this.app.data.registros.filter(r => r.bikeId === bikeId);
        if (!bikeRegistros || bikeRegistros.length === 0) {
            return '<p class="text-xs text-slate-500 dark:text-slate-400">Nenhum registro encontrado.</p>';
        }
        
        const sortedRegistros = [...bikeRegistros].sort((a, b) => new Date(b.dataHoraEntrada) - new Date(a.dataHoraEntrada));

        return `
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="text-left">
                        <tr class="border-b border-slate-200 dark:border-slate-700">
                            <th class="font-medium text-slate-500 dark:text-slate-400 py-2 pr-2">Entrada</th>
                            <th class="font-medium text-slate-500 dark:text-slate-400 py-2 px-2">Saída</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedRegistros.map(reg => `
                            <tr class="border-b border-slate-100 dark:border-slate-700/50">
                                <td class="py-2 pr-2 text-slate-600 dark:text-slate-300">${new Date(reg.dataHoraEntrada).toLocaleString('pt-BR')}</td>
                                <td class="py-2 px-2 text-slate-600 dark:text-slate-300">
                                    ${reg.dataHoraSaida ? new Date(reg.dataHoraSaida).toLocaleString('pt-BR') : '<span class="text-xs font-medium text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/50 px-2 py-1 rounded-full">Em aberto</span>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderDailyRecords() {
        const selectedDateStr = this.elements.dailyRecordsDateInput.value;
        if (!selectedDateStr) {
            this.elements.dailyRecordsList.innerHTML = `<p class="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Selecione uma data para ver os registros.</p>`;
            this.app.data.currentDailyRecords = [];
            return;
        }
        
        const dailyRecordsRaw = this.app.data.registros.filter(registro => 
            registro.dataHoraEntrada.startsWith(selectedDateStr)
        );

        let dailyRecords = dailyRecordsRaw.map(registro => {
            const client = this.app.data.clients.find(c => c.id === registro.clientId);
            if (!client) return null;
            const bike = client.bicicletas.find(b => b.id === registro.bikeId);
            if (!bike) return null;
            return { client, bike, registro };
        }).filter(Boolean);

        const searchTerm = this.elements.dailyRecordsSearchInput.value.toLowerCase();
        if (searchTerm) {
            dailyRecords = dailyRecords.filter(({ client, bike }) => 
                client.nome.toLowerCase().includes(searchTerm) ||
                client.cpf.includes(searchTerm) ||
                bike.modelo.toLowerCase().includes(searchTerm) ||
                bike.marca.toLowerCase().includes(searchTerm)
            );
        }

        this.app.data.currentDailyRecords = dailyRecords;

        if (dailyRecords.length === 0) {
            this.elements.dailyRecordsList.innerHTML = `<p class="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Nenhum registro encontrado para esta data.</p>`;
            return;
        }

        this.elements.dailyRecordsList.innerHTML = `
            <table class="w-full text-sm">
                <thead class="text-left bg-slate-50 dark:bg-slate-700/40">
                    <tr class="border-b border-slate-200 dark:border-slate-700">
                        <th class="font-semibold text-slate-600 dark:text-slate-300 p-3">Cliente</th>
                        <th class="font-semibold text-slate-600 dark:text-slate-300 p-3">Bicicleta</th>
                        <th class="font-semibold text-slate-600 dark:text-slate-300 p-3">Entrada</th>
                        <th class="font-semibold text-slate-600 dark:text-slate-300 p-3">Saída</th>
                        <th class="font-semibold text-slate-600 dark:text-slate-300 p-3">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    ${dailyRecords.map(({ client, bike, registro }) => `
                        <tr class="border-b border-slate-100 dark:border-slate-700">
                            <td class="p-3 align-top">
                                <p class="font-medium text-slate-800 dark:text-slate-100">${client.nome}</p>
                                <p class="text-xs text-slate-500 dark:text-slate-400">${client.cpf}</p>
                            </td>
                            <td class="p-3 align-top">
                                <p class="font-medium text-slate-800 dark:text-slate-100">${bike.modelo}</p>
                                <p class="text-xs text-slate-500 dark:text-slate-400">${bike.marca} - ${bike.cor}</p>
                            </td>
                            <td class="p-3 align-top text-slate-600 dark:text-slate-300">${new Date(registro.dataHoraEntrada).toLocaleString('pt-BR')}</td>
                            <td class="p-3 align-top text-slate-600 dark:text-slate-300">${registro.dataHoraSaida ? new Date(registro.dataHoraSaida).toLocaleString('pt-BR') : ''}</td>
                            <td class="p-3 align-top">
                                ${!registro.dataHoraSaida ? `
                                    <select class="action-select text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" 
                                            data-registro-id="${registro.id}" 
                                            data-client-id="${client.id}" 
                                            data-bike-id="${bike.id}">
                                        <option value="">Selecione uma ação</option>
                                        <option value="saida">🚪 Registrar Saída</option>
                                        <option value="remover">🚫 Remover Acesso</option>
                                        <option value="alterar">✏️ Alterar Registro</option>
                                        <option value="adicionar">➕ Adicionar Outra Bike</option>
                                    </select>
                                ` : `<span class="text-xs font-medium ${registro.acessoRemovido ? 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/50' : 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50'} px-2 py-1 rounded-full">${registro.acessoRemovido ? 'Acesso Removido' : 'Concluído'}</span>`}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        lucide.createIcons();
    }

    toggleExportMenu(show) {
        const isHidden = this.elements.exportOptions.classList.contains('hidden');
        if (show === undefined) {
            this.elements.exportOptions.classList.toggle('hidden');
        } else if (show && isHidden) {
            this.elements.exportOptions.classList.remove('hidden');
        } else if (!show && !isHidden) {
            this.elements.exportOptions.classList.add('hidden');
        }
    }

    exportToCSV() {
        this.toggleExportMenu(false);
        if (this.app.data.currentDailyRecords.length === 0) {
            alert('Não há dados para exportar.');
            return;
        }

        const headers = ['Cliente', 'CPF', 'Bicicleta', 'Marca', 'Cor', 'Entrada', 'Saída'];
        const escapeCsv = (field) => {
            if (field === null || field === undefined) return '';
            let str = String(field);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                str = '"' + str.replace(new RegExp('"', 'g'), '""') + '"';
            }
            return str;
        };

        const rows = this.app.data.currentDailyRecords.map(({ client, bike, registro }) => [
            escapeCsv(client.nome),
            escapeCsv(client.cpf),
            escapeCsv(bike.modelo),
            escapeCsv(bike.marca),
            escapeCsv(bike.cor),
            escapeCsv(new Date(registro.dataHoraEntrada).toLocaleString('pt-BR')),
            escapeCsv(registro.dataHoraSaida ? new Date(registro.dataHoraSaida).toLocaleString('pt-BR') : 'Em aberto')
        ]);

        let csvContent = headers.join(",") + "\r\n" + rows.map(e => e.join(",")).join("\r\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        const selectedDateStr = this.elements.dailyRecordsDateInput.value;
        link.setAttribute("download", `registros_${selectedDateStr || 'data_selecionada'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    exportToPDF() {
        this.toggleExportMenu(false);
        if (this.app.data.currentDailyRecords.length === 0) {
            alert('Não há dados para exportar.');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const head = [['Cliente', 'Bicicleta', 'Entrada', 'Saída']];
        const body = this.app.data.currentDailyRecords.map(({ client, bike, registro }) => [
            `${client.nome}\n(${client.cpf})`,
            `${bike.modelo}\n(${bike.marca} - ${bike.cor})`,
            new Date(registro.dataHoraEntrada).toLocaleString('pt-BR'),
            registro.dataHoraSaida ? new Date(registro.dataHoraSaida).toLocaleString('pt-BR') : 'Em aberto'
        ]);
        
        const selectedDateStr = this.elements.dailyRecordsDateInput.value;
        const selectedDate = new Date(selectedDateStr);
        const formattedDate = selectedDate.toLocaleDateString('pt-BR', {timeZone: 'UTC'});

        doc.text(`Registros do dia: ${formattedDate}`, 14, 15);
        doc.autoTable({
            startY: 20,
            head: head,
            body: body,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
        });

        doc.save(`registros_${selectedDateStr}.pdf`);
    }
}
