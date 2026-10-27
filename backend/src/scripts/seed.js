require('dotenv').config();
const { connectDB, getIsConnected } = require('../config/db');
const repository = require('../store/repository');

async function seed() {
  console.log('[Seed] Starting Smart School Training Portal Seeder...');
  await connectDB();

  const schools = await repository.getSchools();
  const users = await repository.getUsers();
  const events = await repository.getEvents();

  console.log(`[Seed] ✅ Current Database State:`);
  console.log(`       - Schools: ${schools.length}`);
  console.log(`       - Users: ${users.length}`);
  console.log(`       - Events: ${events.length}`);
  console.log(`[Seed] Ready for testing! Default Admin: admin@smartschool.edu / password123`);
  process.exit(0);
}

seed().catch(err => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
