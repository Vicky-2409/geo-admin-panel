'use server';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { connectToDatabase } from './mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets must be defined in environment variables');
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateTokens = async (payload: JWTPayload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

export const verifyToken = async (token: string): Promise<JWTPayload | null> => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = async (token: string): Promise<JWTPayload | null> => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};

export const getTokenFromRequest = async (request: NextRequest): Promise<string | null> => {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

export const getClientIP = async (request: NextRequest): Promise<string> => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (clientIP) {
    return clientIP;
  }
  
  // Fallback IP for development
  return '103.21.92.1';
};

export const requireAuth = async (request: NextRequest) => {
  const token = await getTokenFromRequest(request);
  
  if (!token) {
    throw new Error('No token provided');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    throw new Error('Invalid token');
  }

  await connectToDatabase();
  const user = await User.findById(payload.userId).select('-password');
  
  if (!user) {
    throw new Error('User not found');
  }

  return { user, payload };
};

export const requireAdmin = async (request: NextRequest) => {
  const { user, payload } = await requireAuth(request);
  
  if (payload.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return { user, payload };
};