import express from 'express';
import fs from 'fs';
import XLSX from 'xlsx';
import cors from 'cors';

const app = express();
const PORT = 3000;
const EXCEL_FILE = 'attendance.xlsx';

app.use(cors());
app.use(express.json());

app.post('/attendance', (req, res) => {
  const student = req.body;
  let workbook, worksheet, data = [];

  // Load or create workbook
  if (fs.existsSync(EXCEL_FILE)) {
    workbook = XLSX.readFile(EXCEL_FILE);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(worksheet);
  } else {
    workbook = XLSX.utils.book_new();
  }

  // Check for duplicate attendance for today
  const today = new Date().toISOString().slice(0, 10);
  if (data.some(s => s.id === student.id && s.timestamp && s.timestamp.slice(0, 10) === today)) {
    return res.json({ status: 'duplicate' });
  }

  // Add timestamp
  student.timestamp = new Date().toISOString();
  data.push({
    id: student.id,
    name: student.name,
    class: student.class,
    team: student.team || '',
    timestamp: student.timestamp
  });

  // Write back to Excel
  const newSheet = XLSX.utils.json_to_sheet(data);
  workbook.SheetNames[0] = 'Attendance';
  workbook.Sheets['Attendance'] = newSheet;
  XLSX.writeFile(workbook, EXCEL_FILE);

  res.json({ status: 'success' });
});

app.post('/register-student', (req, res) => {
  const student = req.body; // { id, name, class }
  const STUDENT_FILE = 'students.xlsx';
  let workbook, worksheet, data = [];

  // Load or create workbook
  if (fs.existsSync(STUDENT_FILE)) {
    workbook = XLSX.readFile(STUDENT_FILE);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(worksheet);
  } else {
    workbook = XLSX.utils.book_new();
  }

  // Check for duplicate by id
  if (data.some(s => s.id === student.id)) {
    return res.json({ status: 'duplicate' });
  }

  // Add student
  data.push({ id: student.id, name: student.name, class: student.class, team: student.team || '' });
  const newSheet = XLSX.utils.json_to_sheet(data);
  workbook.SheetNames[0] = 'Students';
  workbook.Sheets['Students'] = newSheet;
  XLSX.writeFile(workbook, STUDENT_FILE);

  res.json({ status: 'success' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
}); 