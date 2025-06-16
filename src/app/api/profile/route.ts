import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import User from '@/models/User';

// GET - Get current user profile
export const GET = async (request: NextRequest) => {
  try {
    // Check authentication and get user
    const { payload } = await requireAuth(request);

    // Connect to database
    await connectToDatabase();

    // Get user with full profile including login history
    const user = await User.findById(payload.userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Profile retrieved successfully',
        data: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get profile error:', error);
    
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (error.message === 'User not found') {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
};