## 🌐 Overview

This project consists of two parts:

### 🖥️ Frontend

- Built with **HTML/CSS/JavaScript** (Vanilla)
- Provides a modern UI for administrators/developers

### ⚙️ Backend

- Built with **Node.js** and **Express**
- Handles all operations with `config.json` file:
  - `GET /config` — Fetch the current configuration
  - `POST /config/add` — Add new or extend existing key-value
  - `PUT /config/update` — Update (overwrite) an existing key
  - `DELETE /config/delete` — Remove a key from config

## 🧩 Folder Structure
```
config-manager/
│
├── backend/
│ ├── controller # Handle API logic
│ ├── routes/ # API routes for config
│ ├── utils # Reusable helper functions
│ ├── config.json # Main configuration file
│ └── server.js # Express server
│
├── public/
│ ├── index.html # Main interface
│ └── main.js # JS logic for interaction
```
## 🚀 How to Run

### Backend
```
cd backend
npm install
node index.js | npm start
```
### Frontend

Serve using Live Server (e.g., VS Code Live Server extension), or
Simply open public/index.html in your web browser

## 📋 Development & API Log

You can follow the progress in this [Google Sheet](https://docs.google.com/spreadsheets/d/1KjBnDNFjInifJiUMZg0Zh9LJAyaHfq_iDOqlDEVautk/edit?usp=sharing).

And API log in this [Google Sheet](https://docs.google.com/spreadsheets/d/17pI7uH4Sonk-_QXhemJXQuzJaWaG__3R2RsCFRCizpI/edit?usp=sharing).
