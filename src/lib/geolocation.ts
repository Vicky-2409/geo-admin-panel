'use server';

import { GeolocationResponse } from '@/types';

interface GeolocationData {
  city: string;
  country: string;
}

export const getGeolocationData = async (ip: string): Promise<GeolocationData> => {
  // Skip localhost and development IPs
  if (ip === 'localhost' || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return {
      city: 'Local Development',
      country: 'Development Environment'
    };
  }

  try {
    // First try ipapi.co
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      throw new Error(`ipapi.co error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`ipapi.co error: ${data.reason || 'Unknown error'}`);
    }

    return {
      city: data.city || 'Unknown',
      country: data.country_name || 'Unknown',
    };
  } catch (error) {
    console.error('Primary geolocation error:', error);
    
    try {
      // Fallback to ipinfo.io
      const fallbackResponse = await fetch(`https://ipinfo.io/${ip}/json`);
      if (!fallbackResponse.ok) {
        throw new Error(`ipinfo.io error: ${fallbackResponse.status}`);
      }
      
      const fallbackData = await fallbackResponse.json();
      
      return {
        city: fallbackData.city || 'Unknown',
        country: fallbackData.country || 'Unknown',
      };
    } catch (fallbackError) {
      console.error('Fallback geolocation error:', fallbackError);
      return {
        city: 'Unknown',
        country: 'Unknown',
      };
    }
  }
};

// Alternative function using ipinfo.io (backup)
export const getGeolocationDataAlternative = async (ip: string): Promise<{
  city: string;
  country: string;
}> => {
  try {
    const response = await fetch(`https://ipinfo.io/${ip}/json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      city: data.city || 'Unknown',
      country: data.country || 'Unknown',
    };
  } catch (error) {
    console.error('Alternative geolocation API error:', error);
    return {
      city: 'Unknown',
      country: 'Unknown',
    };
  }
};