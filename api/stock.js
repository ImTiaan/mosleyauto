// Vercel Serverless Function for Stock Management
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import Status from 'http-status-codes';

const DATA_FILE = join(process.cwd(), 'data', 'vehicles.json');

// Initialize data file if it doesn't exist
function initializeDataFile() {
    if (!existsSync(DATA_FILE)) {
        const initialData = {
            vehicles: [
                {
                    id: 1,
                    make: "Vapid",
                    model: "Dominator",
                    year: 2020,
                    price: 45000,
                    mileage: 15000,
                    color: "Metallic Red",
                    transmission: "Manual",
                    description: "AMAZING muscle car! Perfect for cruising the streets of Los Santos! LOW MILEAGE and EXCELLENT condition!",
                    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&crop=center"
                },
                {
                    id: 2,
                    make: "Pfister",
                    model: "811",
                    year: 2019,
                    price: 125000,
                    mileage: 8500,
                    color: "Pearl White",
                    transmission: "Automatic",
                    description: "SUPERCAR ALERT! This beauty will turn heads everywhere you go! PRISTINE condition and LIGHTNING fast!",
                    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center"
                },
                {
                    id: 3,
                    make: "Declasse",
                    model: "Vamos",
                    year: 2018,
                    price: 35000,
                    mileage: 22000,
                    color: "Classic Blue",
                    transmission: "Manual",
                    description: "CLASSIC American muscle! Perfect for weekend drives and showing off! GREAT PRICE for this beauty!",
                    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&crop=center"
                }
            ]
        };
        
        try {
            writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
        } catch (error) {
            console.error('Error initializing data file:', error);
        }
    }
}

// Read vehicles data
function readVehicles() {
    try {
        initializeDataFile();
        const data = readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading vehicles:', error);
        return { vehicles: [] };
    }
}

// Write vehicles data
function writeVehicles(data) {
    try {
        writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing vehicles:', error);
        return false;
    }
}

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(Status.OK).end();
    }
    
    try {
        switch (req.method) {
            case 'GET':
                // Get all vehicles (public endpoint)
                const data = readVehicles();
                return res.status(Status.OK).json({
                    success: true,
                    vehicles: data.vehicles || []
                });
                
            case 'POST':
                // Add new vehicle (admin only)
                const { adminKey, vehicle } = req.body;
                
                // Simple admin authentication
                if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'mosley2024') {
                    return res.status(Status.UNAUTHORIZED).json({
                        success: false,
                        message: 'Unauthorized access'
                    });
                }
                
                if (!vehicle || !vehicle.make || !vehicle.model || !vehicle.year || !vehicle.price) {
                    return res.status(Status.BAD_REQUEST).json({
                        success: false,
                        message: 'Missing required vehicle information'
                    });
                }
                
                const currentData = readVehicles();
                const newId = Math.max(...currentData.vehicles.map(v => v.id || 0), 0) + 1;
                
                const newVehicle = {
                    id: newId,
                    make: vehicle.make,
                    model: vehicle.model,
                    year: parseInt(vehicle.year),
                    price: parseFloat(vehicle.price),
                    mileage: parseInt(vehicle.mileage || 0),
                    color: vehicle.color || 'Unknown',
                    transmission: vehicle.transmission || 'Automatic',
                    description: vehicle.description || 'Great car!',
                    image: vehicle.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&crop=center'
                };
                
                currentData.vehicles.push(newVehicle);
                
                if (writeVehicles(currentData)) {
                    return res.status(Status.CREATED).json({
                        success: true,
                        message: 'Vehicle added successfully',
                        vehicle: newVehicle
                    });
                } else {
                    return res.status(Status.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Failed to save vehicle'
                    });
                }
                
            case 'DELETE':
                // Delete vehicle (admin only)
                const { adminKey: deleteAdminKey, vehicleId } = req.body;
                
                if (deleteAdminKey !== process.env.ADMIN_KEY && deleteAdminKey !== 'mosley2024') {
                    return res.status(Status.UNAUTHORIZED).json({
                        success: false,
                        message: 'Unauthorized access'
                    });
                }
                
                if (!vehicleId) {
                    return res.status(Status.BAD_REQUEST).json({
                        success: false,
                        message: 'Vehicle ID is required'
                    });
                }
                
                const deleteData = readVehicles();
                const vehicleIndex = deleteData.vehicles.findIndex(v => v.id === parseInt(vehicleId));
                
                if (vehicleIndex === -1) {
                    return res.status(Status.NOT_FOUND).json({
                        success: false,
                        message: 'Vehicle not found'
                    });
                }
                
                const deletedVehicle = deleteData.vehicles.splice(vehicleIndex, 1)[0];
                
                if (writeVehicles(deleteData)) {
                    return res.status(Status.OK).json({
                        success: true,
                        message: 'Vehicle deleted successfully',
                        vehicle: deletedVehicle
                    });
                } else {
                    return res.status(Status.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Failed to delete vehicle'
                    });
                }
                
            default:
                return res.status(Status.METHOD_NOT_ALLOWED).json({
                    success: false,
                    message: 'Method not allowed'
                });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error'
        });
    }
}