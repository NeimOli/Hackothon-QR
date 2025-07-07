# QR Code Attendance System

This project is a simple QR code attendance system using JavaScript.

## Features
- Generate QR codes for students (with JSON data)
- Scan QR codes using a browser camera
- Record attendance in an Excel file (`attendance.xlsx`)

## Folder Structure

```
QR-Attendance/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── attendance.xlsx   # (auto-created)
├── frontend/
│   ├── index.html
│   ├── generate.html
│   ├── scan.html
│   ├── qrcode.min.js
│   └── html5-qrcode.min.js
└── README.md
```

## Setup

### 1. Backend
```
cd backend
npm install
node server.js
```
- The server runs on `http://localhost:3000`
- Attendance is saved in `attendance.xlsx`

### 2. Frontend
- Open `frontend/index.html` in your browser.
- Use `generate.html` to create student QR codes.
- Use `scan.html` to scan and record attendance.

## Dependencies
- Backend: express, xlsx, cors
- Frontend: [qrcode.js](https://github.com/davidshimjs/qrcodejs), [html5-qrcode](https://github.com/mebjas/html5-qrcode)

---

**Enjoy your QR code attendance system!** # QR_Hack
# Hackothon-QR
# Hackothon-QR
# Hackothon-QR
