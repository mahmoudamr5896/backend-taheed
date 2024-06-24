import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email: String,
    verificationCode: String,
    phone: String,
    fullName: String,
    nationalID: String,
    motorcycleCount: Number,
    receiptDocument: String,
    isVerified: { type: Boolean, default: false }
  });
  
  const User = mongoose.model('User', userSchema);
export default User;