import  mongoose from 'mongoose';
import  bcrypt from 'bcrypt';
// import admin from "../models/admin"
export default async function seedAdmin (){
    await mongoose.connect(DB).then(()=>{
        console.log("db connect for insert the info in admin")
    }).catch(()=>{
        console.log("Error:",err)
    });

    const existingAdmin = await admin.findOne({role:1})
    if (!existingAdmin) {
        const adminCredentials = {
            name: "super admin",
            mobileNumber: 1234567890,
            role: 0,
            password: "superAdmin123",
            knowPassword: "superAdmin123",
            isVerified:true
        }
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminCredentials.password, saltRounds);
        adminCredentials.password = hashedPassword;
        let adminCreate = await admin.create(adminCredentials)
    }
};

seedAdmin().then(()=>{
    process.exit(0);
}).catch((err)=>{
    process.exit(1);
})
