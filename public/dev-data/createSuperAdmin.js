const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../../models/adminModel');

dotenv.config({ path: './config.env' });

const DB_URI = process.env.DB_CONNECTION_STRING.replace(
  '<db_password>',
  process.env.DB_PASSWORD,
);
const createSuperAdmin = async () => {
  try {
    await mongoose.connect(DB_URI);
    const exists = await Admin.findOne({
      email: process.env.SUPER_ADMIN_EMAIL,
    });
    if (exists) {
      console.log('⚠️ Super Admin already exists');
      await mongoose.disconnect();
      return process.exit();
    }
    await Admin.create({
      fullName: 'Miyaad Shah Joy',
      email: process.env.SUPER_ADMIN_EMAIL,
      phone: '01700000000',
      gender: 'male',
      password: 'pass1234',
      passwordConfirm: 'pass1234',
      role: 'super-admin',
      isVerified: true,
      status: 'active',
      emailVerified: true,
    });

    console.log('✅ Super Admin created successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error creating Super Admin:', err);
    await mongoose.disconnect();

    process.exit(1);
  }
};
createSuperAdmin();
