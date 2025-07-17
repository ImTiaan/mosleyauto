import { NextResponse } from 'next/server';
import { getVehicles, addVehicle } from '@/lib/blob';

/**
 * GET handler for fetching vehicles
 */
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const isSecret = searchParams.get('secret') === 'true';
    
    // Check if user is authorized for secret inventory
    if (isSecret) {
      // In a real app, this would check a session or token
      // For now, we'll allow it in the API but protect the UI
    }
    
    // Get vehicles from storage
    const vehicles = await getVehicles(isSecret);
    
    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for adding a vehicle
 */
export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.make || !body.model || !body.price || !body.mileage || !body.color) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user is authorized for adding vehicles
    // In a real app, this would check a session or token
    // For now, we'll allow it in the API but protect the UI
    
    // Add vehicle to storage
    const vehicle = await addVehicle(body);
    
    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to add vehicle' },
      { status: 500 }
    );
  }
}