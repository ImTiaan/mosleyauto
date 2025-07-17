import { NextResponse } from 'next/server';
import { isBlobConfigured } from '@/lib/blob';

/**
 * GET handler for checking API health
 */
export async function GET() {
  try {
    // Check if Vercel Blob is configured
    const blobConfigured = isBlobConfigured();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      blobConfigured,
      message: 'Mosley Auto API is running'
    });
  } catch (error) {
    console.error('Error checking API health:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'API health check failed',
        error: error.message
      },
      { status: 500 }
    );
  }
}