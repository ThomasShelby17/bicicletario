# Sistema de Gerenciamento de Bicicletário

## Overview
This is a bicycle parking management system (Bicicletário Shop) built with vanilla JavaScript, HTML, and CSS. The application allows users to manage clients, register bicycles, and track entry/exit records for a bicycle parking facility.

## Project Structure
- `index.html` - Main HTML file with the application UI
- `app.js` - JavaScript application logic and state management
- `style.css` - Custom styles and dark mode support
- `server.py` - Python HTTP server for local development

## Features
- **Client Management**: Add and search for clients with CPF validation
- **Bicycle Registration**: Register multiple bicycles per client
- **Entry/Exit Tracking**: Record bicycle entry and exit times
- **Daily Records**: View and filter records by date
- **Data Export**: Export records to CSV and PDF formats
- **Dark Mode**: Toggle between light and dark themes
- **Data Persistence**: Uses browser localStorage for data storage

## Technology Stack
- Vanilla JavaScript (ES6+)
- Tailwind CSS (via CDN)
- Lucide Icons (via CDN)
- LocalStorage for data persistence
- jsPDF for PDF export functionality

## Architecture
The application follows a single-page architecture with:
- Client-side data management using localStorage
- Tab-based navigation (Clientes / Registros Diários)
- Modal dialogs for forms
- Real-time search and filtering

## Recent Changes
- Fixed JavaScript syntax errors in escape sequences (CSV/PDF export functions)
- Set up Python HTTP server for Replit deployment
- Configured workflow for development

## User Preferences
- Language: Portuguese (Brazil)
- Application is designed for local bicycle parking shops

## Development
The app runs on port 5000 using a Python HTTP server with cache-control headers disabled to ensure updates are visible immediately.
