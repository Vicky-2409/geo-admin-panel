'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { MapPin, Shield, Users, Activity } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Geo Admin Panel
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive admin dashboard with geolocation tracking, user management, 
            and role-based access control.
          </p>

          {!user ? (
            <div className="flex justify-center space-x-4 mb-12">
              <Link
                href="/register"
                className="btn btn-primary px-6 py-3 text-lg"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="btn btn-secondary px-6 py-3 text-lg"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="mb-12">
              <Link
                href="/dashboard"
                className="btn btn-primary px-6 py-3 text-lg"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <div className="card p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 mx-auto">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Geolocation Tracking</h3>
              <p className="text-muted-foreground">
                Automatically track user login locations with IP-based geolocation data.
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
              <p className="text-muted-foreground">
                JWT-based authentication with bcrypt password hashing and refresh tokens.
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">User Management</h3>
              <p className="text-muted-foreground">
                Complete user management system with role-based access control.
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 mx-auto">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Activity Monitoring</h3>
              <p className="text-muted-foreground">
                Track login history and user activities with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;