import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { comparePassword, generateTokens, getClientIP } from '@/lib/auth';
import { getGeolocationData } from '@/lib/geolocation';
import { checkRateLimit, getRemainingAttempts } from '@/lib/rateLimit';
import User from '@/models/User';
import { LoginRequest } from '@/types';

// Ensure this is a named export
export const POST = async (request: NextRequest) => {
  const clientIP = await getClientIP(request);
  
  try {
    // Check rate limiting
    const rateLimit = await checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      const resetTime = rateLimit.resetTime ? new Date(rateLimit.resetTime).toLocaleTimeString() : '';
      return NextResponse.json(
        { 
          success: false, 
          message: `Too many login attempts. Try again after ${resetTime}`,
          remainingAttempts: 0
        },
        { status: 429 }
      );
    }

    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email and password are required',
          remainingAttempts: await getRemainingAttempts(clientIP)
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password',
          remainingAttempts: await getRemainingAttempts(clientIP)
        },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password',
          remainingAttempts: await getRemainingAttempts(clientIP)
        },
        { status: 401 }
      );
    }

    // Get geolocation data
    let geoData = { city: 'Unknown', country: 'Unknown' };
    try {
      geoData = await getGeolocationData(clientIP);
    } catch (error) {
      console.error('Geolocation error:', error);
    }

    // Add login history
    user.loginHistory.push({
      ip: clientIP,
      city: geoData.city,
      country: geoData.country,
      loggedInAt: new Date(),
    });

    // Keep only last 50 login records to prevent bloating
    if (user.loginHistory.length > 50) {
      user.loginHistory = user.loginHistory.slice(-50);
    }

    await user.save();

    // Generate tokens
    const tokens = await generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Create response with user data (excluding password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      loginHistory: user.loginHistory,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: userResponse,
        token: tokens.accessToken,
      },
      { status: 200 }
    );

    // Set refresh token as HTTP-only cookie
    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        remainingAttempts: await getRemainingAttempts(clientIP)
      },
      { status: 500 }
    );
  }
};