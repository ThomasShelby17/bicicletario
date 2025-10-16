# 🚲 Sistema de Gerenciamento de Bicicletário

Sistema completo para gerenciamento de estacionamento de bicicletas, desenvolvido para **BICICLETARIO SHOP. BOULEVARD V.V.**

## ✨ Funcionalidades

### 📋 Gestão de Cadastros
- ✅ Cadastro de clientes com validação de CPF
- ✅ Cadastro de múltiplas bicicletas por cliente
- ✅ Busca rápida por nome ou CPF
- ✅ Formatação automática de CPF e telefone

### 📊 Controle de Registros
- ✅ Registro de entrada de bicicletas
- ✅ Registro de saída de bicicletas
- ✅ Visualização de registros por data
- ✅ Histórico completo de movimentação
- ✅ Exportação para CSV
- ✅ Exportação para PDF

### 🎨 Interface
- ✅ Tema claro e escuro
- ✅ Design responsivo
- ✅ Interface intuitiva em português
- ✅ Ícones modernos (Lucide)

## 📁 Organização do Código

O projeto está organizado em módulos para facilitar manutenção:

```
📂 js/
  ├── 📂 cadastros/          → Módulo de cadastros
  │   ├── clientes.js        → Gerenciamento de clientes
  │   └── bicicletas.js      → Gerenciamento de bicicletas
  │
  ├── 📂 registros/          → Módulo de registros
  │   └── registros-diarios.js → Registros de entrada/saída
  │
  └── 📂 shared/             → Código compartilhado
      ├── utils.js           → Funções utilitárias
      └── storage.js         → Gerenciamento de dados
```

## 🚀 Como Usar

### Cadastrar Cliente
1. Preencha o formulário com nome, CPF e telefone
2. Clique em "Salvar Cliente"
3. O CPF é validado automaticamente

### Adicionar Bicicleta
1. Selecione um cliente da lista
2. Clique em "Adicionar Bicicleta"
3. Preencha modelo, marca e cor
4. Clique em "Adicionar"

### Registrar Entrada
1. Selecione um cliente
2. Clique em "Registrar Entrada" na bicicleta desejada
3. Confirme o registro com data/hora atual

### Registrar Saída
1. Vá para aba "Registros Diários"
2. Selecione a data
3. Clique em "Registrar Saída" na bicicleta

### Exportar Dados
1. Na aba "Registros Diários", selecione uma data
2. Clique em "Exportar"
3. Escolha CSV ou PDF

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Estilos**: Tailwind CSS
- **Ícones**: Lucide Icons
- **Exportação PDF**: jsPDF
- **Armazenamento**: localStorage
- **Servidor Dev**: Python HTTP Server

## 📱 Suporte

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet
- ✅ Mobile (responsivo)

## 🔒 Privacidade

Todos os dados são armazenados localmente no navegador (localStorage). Nenhuma informação é enviada para servidores externos.

## 📚 Documentação

- `replit.md` - Documentação técnica completa
- `ESTRUTURA.md` - Detalhes da arquitetura modular
- `legado/` - Código anterior para referência

## 🎯 Desenvolvido para

Lojas de estacionamento de bicicletas que precisam de um sistema simples e eficiente para controlar entrada e saída de bicicletas de seus clientes.

---

**Versão**: 2.0 (Modular)  
**Última atualização**: 16/10/2025
