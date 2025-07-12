import express from 'express';
import fs from 'fs';
import XLSX from 'xlsx';
import cors from 'cors';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const app = express();
const PORT = 3000;
const EXCEL_FILE = 'attendance.xlsx';

app.use(cors());
app.use(express.json());

app.post('/attendance', (req, res) => {
  const student = req.body;
  let workbook, worksheet, data = [];

  // Validate QR code expiration (if QR has timestamp data)
  if (student.expiresAt) {
    const now = new Date();
    const expirationDate = new Date(student.expiresAt);
    
    if (now > expirationDate) {
      return res.json({ 
        status: 'expired', 
        message: `QR code expired. Valid until ${student.validUntil || expirationDate.toLocaleDateString()}` 
      });
    }
  }

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
  const existingAttendance = data.find(s => s.id === student.id && s.timestamp && s.timestamp.slice(0, 10) === today);
  
  if (existingAttendance) {
    return res.json({ 
      status: 'duplicate',
      message: `Attendance already recorded for ${student.name} today at ${existingAttendance.timestamp}`,
      recordedTime: existingAttendance.timestamp
    });
  }

  // Add Nepali (Asia/Kathmandu) timestamp
  student.timestamp = dayjs().tz('Asia/Kathmandu').format('YYYY-MM-DD HH:mm:ss');
  data.push({
    id: student.id,
    name: student.name,
    class: student.class,
    team: student.team || '',
    timestamp: student.timestamp,
    Status: 'Present'
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

app.post('/mark-absent', (req, res) => {
  const STUDENT_FILE = 'students.xlsx';
  let students = [];
  if (fs.existsSync(STUDENT_FILE)) {
    const workbook = XLSX.readFile(STUDENT_FILE);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    students = XLSX.utils.sheet_to_json(worksheet);
  } else {
    return res.status(404).json({ status: 'no_students' });
  }

  const today = new Date().toISOString().slice(0, 10);
  let attendance = [];
  if (fs.existsSync(EXCEL_FILE)) {
    const workbook = XLSX.readFile(EXCEL_FILE);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    attendance = XLSX.utils.sheet_to_json(worksheet);
  }

  // Find students who are absent today
  const absentees = students.filter(stu =>
    !attendance.some(a => a.id === stu.id && a.timestamp && a.timestamp.slice(0, 10) === today && a.Status === 'Present')
  );

  // Add absent records
  absentees.forEach(stu => {
    attendance.push({
      id: stu.id,
      name: stu.name,
      class: stu.class,
      team: stu.team || '',
      timestamp: new Date().toISOString(),
      Status: 'Absent'
    });
  });

  // Write back to Excel
  const newSheet = XLSX.utils.json_to_sheet(attendance);
  let workbook = XLSX.utils.book_new();
  workbook.SheetNames[0] = 'Attendance';
  workbook.Sheets['Attendance'] = newSheet;
  XLSX.writeFile(workbook, EXCEL_FILE);

  res.json({ status: 'absentees_marked', count: absentees.length });
});

// Endpoint to download the attendance.xlsx file
app.get('/download-attendance', (req, res) => {
  const file = __dirname + '/attendance.xlsx';
  res.download(file, 'attendance.xlsx', (err) => {
    if (err) {
      res.status(404).send('Attendance file not found.');
    }
  });
});

// Endpoint to get attendance stats
app.get('/stats', (req, res) => {
  const STUDENT_FILE = 'students.xlsx';
  let students = [];
  if (fs.existsSync(STUDENT_FILE)) {
    const workbook = XLSX.readFile(STUDENT_FILE);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    students = XLSX.utils.sheet_to_json(worksheet);
  }
  const totalStudents = students.length;

  let presentToday = 0;
  const today = new Date().toISOString().slice(0, 10);
  if (fs.existsSync(EXCEL_FILE)) {
    const workbook = XLSX.readFile(EXCEL_FILE);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const attendance = XLSX.utils.sheet_to_json(worksheet);
    presentToday = attendance.filter(a => a.timestamp && a.timestamp.slice(0, 10) === today && a.Status === 'Present').length;
  }
  const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;
  res.json({ totalStudents, presentToday, attendanceRate });
});

// Endpoint to check if student is already present today
app.get('/check-attendance/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  let data = [];

  if (fs.existsSync(EXCEL_FILE)) {
    const workbook = XLSX.readFile(EXCEL_FILE);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(worksheet);
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayAttendance = data.find(s => s.id === studentId && s.timestamp && s.timestamp.slice(0, 10) === today);

  if (todayAttendance) {
    res.json({
      status: 'present',
      message: `Student already marked present today at ${todayAttendance.timestamp}`,
      recordedTime: todayAttendance.timestamp
    });
  } else {
    res.json({
      status: 'absent',
      message: 'Student not marked present today'
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
}); 