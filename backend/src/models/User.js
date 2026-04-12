import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    sparse: true // allows null/undefined values to pass uniqueness check
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    enum: ['KhachHang', 'NhanVien', 'QuanTriVien'],
    default: 'KhachHang'
  },
  status: {
    type: Number,
    default: 1 // 1: Active, 0: Locked
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
