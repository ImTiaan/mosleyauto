import { NextResponse } from 'next/server';
import { updateVehicle, deleteVehicle } from '@/lib/blob';

// Mark this route as dynamic to fix Vercel deployment
export const dynamic = 'force-dynamic';

/**
 * PUT handler for updating a vehicle
 */
export async function PUT(request, { params }) {
  try {
    // Get vehicle ID from params
    const { id } = params;
    
    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.make || !body.model || !body.price || !body.mileage || !body.color || !body.imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user is authorized for updating vehicles
    // In a real app, this would check a session or token
    // For now, we'll allow it in the API but protect the UI
    
    // Update vehicle in storage
    const vehicle = await updateVehicle(id, body);
    
    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for deleting a vehicle
 */
export async function DELETE(request, { params }) {
  try {
    // Get vehicle ID from params
    const { id } = params;
    
    // Check if user is authorized for deleting vehicles
    // In a real app, this would check a session or token
    // For now, we'll allow it in the API but protect the UI
    
    // Delete vehicle from storage
    await deleteVehicle(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
}