export const Storage = {
    saveClients(clients) {
        localStorage.setItem('bicicletario_clients', JSON.stringify(clients));
    },

    loadClients() {
        const data = localStorage.getItem('bicicletario_clients');
        return data ? JSON.parse(data) : [];
    },

    saveRegistros(registros) {
        localStorage.setItem('bicicletario_registros', JSON.stringify(registros));
    },

    loadRegistros() {
        const data = localStorage.getItem('bicicletario_registros');
        return data ? JSON.parse(data) : [];
    },

    migrateOldData() {
        const oldData = localStorage.getItem('bicicletarioData');
        if (oldData && !localStorage.getItem('bicicletario_clients')) {
            try {
                const clientsWithRecords = JSON.parse(oldData);
                const newClients = [];
                const newRegistros = [];

                clientsWithRecords.forEach(client => {
                    const newClient = { ...client, bicicletas: [] };
                    (client.bicicletas || []).forEach(bike => {
                        const newBike = { ...bike };
                        if (bike.registros && Array.isArray(bike.registros)) {
                            bike.registros.forEach(registro => {
                                newRegistros.push({
                                    ...registro,
                                    clientId: client.id,
                                    bikeId: bike.id
                                });
                            });
                        }
                        delete newBike.registros;
                        newClient.bicicletas.push(newBike);
                    });
                    newClients.push(newClient);
                });

                this.saveClients(newClients);
                this.saveRegistros(newRegistros);
                localStorage.removeItem('bicicletarioData');
                return { clients: newClients, registros: newRegistros };
            } catch (error) {
                localStorage.removeItem('bicicletarioData');
            }
        }
        return null;
    }
};
