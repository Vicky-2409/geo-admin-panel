import mongoose, { Document, Schema } from 'mongoose';
import { LoginHistory } from '@/types';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  loginHistory: LoginHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const LoginHistorySchema = new Schema({
  ip: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  loggedInAt: {
    type: Date,
    default: Date.now,
  },
});

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    loginHistory: [LoginHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

// Check if the model exists before creating a new one
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;