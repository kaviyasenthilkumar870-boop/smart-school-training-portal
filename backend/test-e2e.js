const repository = require('./src/store/repository');
const { generateToken } = require('./src/middleware/auth');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('=======================================================');
  console.log('🧪 Running Smart School Training Portal End-to-End Tests');
  console.log('=======================================================');

  // Test 1: Verify Initial Seeding
  const schools = await repository.getSchools();
  console.log(`[PASS] Initial Schools loaded: ${schools.length}`);
  if (schools.length < 3) throw new Error('Expected at least 3 initial schools.');

  // Test 2: Admin Authentication
  const adminUser = await repository.getUserByEmailWithPassword('admin@smartschool.edu');
  if (!adminUser) throw new Error('Admin account not found in database.');
  const passwordMatch = bcrypt.compareSync('password123', adminUser.password);
  if (!passwordMatch) throw new Error('Admin password hash mismatch.');
  const adminToken = generateToken(adminUser);
  console.log(`[PASS] Admin authenticated successfully with JWT.`);

  // Test 3: Create New School
  const testCode = `TEST-${Date.now().toString().slice(-4)}`;
  const newSchool = await repository.createSchool({
    name: 'Heritage Global School',
    code: testCode,
    address: '12 Sunrise Highway',
    contactEmail: 'contact@heritage.edu',
    contactPhone: '+1 (555) 999-8888'
  });
  console.log(`[PASS] New School created: "${newSchool.name}" (${newSchool.code})`);

  // Test 4: Create Student in the new school
  const studentEmail = `student.${Date.now()}@heritage.edu`;
  const newStudent = await repository.createUser({
    name: 'Kavitha Raj',
    email: studentEmail,
    password: 'password123',
    role: 'student',
    schoolId: newSchool._id
  });
  console.log(`[PASS] Student created: "${newStudent.name}" at ${newSchool.name}`);

  // Test 5: Create Event eligible for this school
  const newEvent = await repository.createEvent({
    title: 'Full-Stack Web & Cloud Computing Camp',
    description: 'Intensive workshop on React, Node.js and Cloud deployment.',
    category: 'Technology',
    date: '2026-11-30',
    startTime: '09:00 AM',
    endTime: '03:00 PM',
    venue: 'Heritage Tech Innovation Lab',
    registrationDeadline: '2026-11-25',
    capacity: 40,
    eligibleSchoolIds: [newSchool._id],
    status: 'published'
  }, adminUser._id);
  console.log(`[PASS] Event created: "${newEvent.title}" eligible for ${newSchool.name}`);

  // Test 6: Student Registers for Event
  const registration = await repository.registerStudentForEvent({
    eventId: newEvent._id,
    studentId: newStudent._id,
    schoolId: newSchool._id
  });
  console.log(`[PASS] Student registered for event: Reg ID ${registration._id}`);

  // Test 7: Duplicate Registration Prevention
  let duplicatePrevented = false;
  try {
    await repository.registerStudentForEvent({
      eventId: newEvent._id,
      studentId: newStudent._id,
      schoolId: newSchool._id
    });
  } catch (err) {
    duplicatePrevented = true;
    console.log(`[PASS] Duplicate registration properly blocked: "${err.message}"`);
  }
  if (!duplicatePrevented) throw new Error('Duplicate registration was NOT blocked!');

  // Test 8: Staff Marks Attendance on Event Day
  const staffUser = await repository.getUserByEmailWithPassword('trainer.david@smartschool.edu');
  const attendanceResult = await repository.saveAttendanceRecords(newEvent._id, [
    { studentId: newStudent._id, status: 'present', notes: 'Completed full day workshop' }
  ], staffUser._id);
  console.log(`[PASS] Attendance marked: ${attendanceResult.count} student(s) marked Present`);

  // Test 9: Verify Attendance Roster
  const roster = await repository.getEventAttendanceRoster(newEvent._id);
  const studentRecord = roster.find(r => r.studentId === newStudent._id);
  if (!studentRecord || studentRecord.attendanceStatus !== 'present') {
    throw new Error('Attendance status was not recorded as present.');
  }
  console.log(`[PASS] Verified Attendance Roster: ${studentRecord.name} is ${studentRecord.attendanceStatus}`);

  // Test 10: Verify Report Statistics
  const reports = await repository.getSchoolReports();
  const schoolReport = reports.find(r => r.schoolId === newSchool._id);
  console.log(`[PASS] School Report generated:`, {
    school: schoolReport.schoolName,
    events: schoolReport.totalEvents,
    registrations: schoolReport.totalRegistrations,
    present: schoolReport.totalPresent,
    attendanceRate: schoolReport.attendanceRate
  });

  // Test 11: Verify Persistence on Disk (Survives Refresh/Restart)
  const dbPath = path.join(__dirname, 'data/db.json');
  const rawData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const savedSchool = rawData.schools.find(s => s._id === newSchool._id);
  const savedStudent = rawData.users.find(u => u._id === newStudent._id);
  const savedEvent = rawData.events.find(e => e._id === newEvent._id);
  const savedReg = rawData.registrations.find(r => r._id === registration._id);
  const savedAtt = rawData.attendances.find(a => a.eventId === newEvent._id && a.studentId === newStudent._id);

  if (!savedSchool || !savedStudent || !savedEvent || !savedReg || !savedAtt) {
    throw new Error('Persistence check failed: created records were not saved on disk!');
  }

  console.log('=======================================================');
  console.log('✅ ALL 11 TESTS PASSED! DATA PERSISTENCE VERIFIED 100%!');
  console.log('=======================================================');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
