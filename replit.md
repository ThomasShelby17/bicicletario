# Sistema de Gerenciamento de Bicicletário

## Overview
Sistema de gerenciamento de bicicletário (Bicicletário Shop) construído com JavaScript vanilla, HTML e CSS. A aplicação permite gerenciar clientes, registrar bicicletas e rastrear entradas/saídas de um estacionamento de bicicletas.

## Estrutura do Projeto

```
📁 PROJETO BICICLETÁRIO
├── 📄 index.html              # Página HTML principal
├── 📄 style.css               # Estilos personalizados e dark mode
├── 📄 server.py              # Servidor HTTP Python para desenvolvimento
├── 📄 app.js                 # [LEGADO] Código monolítico original
│
├── 📁 js/                    # Código JavaScript modular
│   ├── 📄 app-modular.js    # Aplicação principal (ponto de entrada)
│   │
│   ├── 📁 cadastros/        # PASTA DE CADASTROS
│   │   ├── 📄 clientes.js   # Gerenciamento de clientes
│   │   └── 📄 bicicletas.js # Gerenciamento de bicicletas
│   │
│   ├── 📁 registros/        # PASTA DE REGISTROS
│   │   └── 📄 registros-diarios.js  # Registros diários de entrada/saída
│   │
│   └── 📁 shared/           # UTILITÁRIOS COMPARTILHADOS
│       ├── 📄 utils.js      # Funções utilitárias (UUID, formatação, validação)
│       └── 📄 storage.js    # Gerenciamento de localStorage
```

## Funcionalidades

### 📋 Módulo de Cadastros (js/cadastros/)
- **Clientes**: 
  - Adicionar novos clientes com validação de CPF
  - Buscar clientes por nome ou CPF
  - Validação de CPF brasileiro
  - Formatação automática de CPF e telefone

- **Bicicletas**:
  - Cadastrar múltiplas bicicletas por cliente
  - Informações: modelo, marca e cor
  - Visualizar histórico de movimentação

### 📊 Módulo de Registros (js/registros/)
- **Registros Diários**:
  - Registrar entrada de bicicletas
  - Registrar saída de bicicletas
  - Visualizar registros por data
  - Filtrar registros por cliente ou bicicleta
  - Exportar dados para CSV e PDF

### 🔧 Utilitários Compartilhados (js/shared/)
- **utils.js**: Funções de formatação, validação CPF, geração de UUID
- **storage.js**: Gerenciamento centralizado de localStorage, migração de dados

## Stack Tecnológica
- Vanilla JavaScript (ES6+ Modules)
- Tailwind CSS (via CDN)
- Lucide Icons (via CDN)
- LocalStorage para persistência de dados
- jsPDF para exportação em PDF
- Python HTTP Server para desenvolvimento

## Arquitetura

### Estrutura Modular
O código foi organizado em módulos ES6 separados por responsabilidade:

1. **App Principal** (`app-modular.js`)
   - Inicialização da aplicação
   - Gerenciamento de tema (dark/light)
   - Controle de abas
   - Modais

2. **Cadastros** (`js/cadastros/`)
   - Separação de responsabilidades entre clientes e bicicletas
   - Cada módulo gerencia sua própria interface e lógica

3. **Registros** (`js/registros/`)
   - Gerenciamento completo de registros diários
   - Funcionalidades de busca e exportação

4. **Shared** (`js/shared/`)
   - Código reutilizável
   - Funções utilitárias
   - Gerenciamento de dados

### Fluxo de Dados
- Dados armazenados em localStorage
- Estrutura separada para clientes (`bicicletario_clients`) e registros (`bicicletario_registros`)
- Sistema de migração automática de dados antigos

## Mudanças Recentes
- **16/10/2025**: Reestruturação completa do código em módulos ES6
  - Criada pasta `js/cadastros/` para gerenciamento de clientes e bicicletas
  - Criada pasta `js/registros/` para registros diários
  - Criada pasta `js/shared/` para utilitários compartilhados
  - Mantido `app.js` legado para referência
  - Corrigidos erros de sintaxe JavaScript (escape sequences)

- **Setup Inicial**: 
  - Configurado servidor Python HTTP
  - Configurado workflow para desenvolvimento
  - Criado sistema de deploy

## Preferências do Usuário
- Idioma: Português (Brasil)
- Aplicação projetada para lojas locais de estacionamento de bicicletas
- Interface com suporte a tema escuro/claro

## Desenvolvimento
A aplicação roda na porta 5000 usando servidor HTTP Python com headers de cache-control desabilitados para garantir que as atualizações sejam visíveis imediatamente.

## Como Usar

### Para Desenvolvedores
1. O servidor inicia automaticamente na porta 5000
2. Acesse via navegador para usar a aplicação
3. Código modular facilita manutenção e extensão

### Para Usuários Finais
1. **Cadastrar Cliente**: Preencha nome, CPF e telefone
2. **Adicionar Bicicleta**: Selecione cliente e adicione bicicleta
3. **Registrar Entrada**: Clique em "Registrar Entrada" na bicicleta
4. **Registrar Saída**: Vá em "Registros Diários" e clique em "Registrar Saída"
5. **Exportar Dados**: Use os botões de exportação para CSV ou PDF
