const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'admin123'; // The password you want to use
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log('Hashed Password:', hashedPassword);
}

hashPassword().catch(console.error);