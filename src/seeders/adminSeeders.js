import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { MONGO_DB_URI } from '../config/env.config.js';
import admin from '../models/admin.js'; 

async function seedAdmin() {
    try {
        await mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        const existingAdmin = await admin.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log("Already 1 admin exists");
            return;
        }

        const adminCredentials = {
            name: "super admin",
            email: "superadmin@example.com",  // Add an email if it's required in your schema
            mobile: "1234567890",  // Fix the field name
            username: "superadmin",  // Add a username if it's required in your schema
            password: "superAdmin123",
            role: "admin",  // Fix the role field value to match your schema
            user_counter: 0,  // Add default values for required fields
            banned: 0,
            loginStatus: "active",
            last_login: new Date().toISOString(),
            col_view_permission: [],
            loginFor: 1
        };

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminCredentials.password, saltRounds);
        adminCredentials.password = hashedPassword;

        const newAdmin = new admin(adminCredentials);
        await newAdmin.save();
        console.log("Admin created successfully");
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedAdmin();
