export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    loginHistory: LoginHistory[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface LoginHistory {
    ip: string;
    city: string;
    country: string;
    loggedInAt: Date;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
  }
  
  export interface GeolocationResponse {
    ip: string;
    city: string;
    region: string;
    country: string;
    country_name: string;
    country_code: string;
    continent_code: string;
    postal: string;
    latitude: number;
    longitude: number;
    timezone: string;
    currency: string;
    languages: string;
    org: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'user';
  }
  
  export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }
  
  export interface RateLimitData {
    count: number;
    lastAttempt: number;
    blocked: boolean;
  }
  
  export interface JWTPayload {
    userId: string;
    email: string;
    role: 'admin' | 'user';
  }