/**
 * Utility functions for working with Vercel Blob storage
 * Includes fallbacks for local development
 */
import { list, put, del } from '@vercel/blob';

// Mock data for local development
const mockVehicles = [
  {
    id: 'mock-1',
    make: 'Albany',
    model: 'Emperor',
    price: 12500,
    mileage: 75000,
    condition: 'Good',
    color: 'Blue',
    imageUrl: 'https://media.discordapp.net/attachments/423286896983277568/1394345384045711502/IMG_5018.png?ex=6879c495&is=68787315&hm=1348fa9dd41b0b008e58856d67971ac8210ddc154cacc364699b75edea162bc5&=&format=webp&quality=lossless&width=1011&height=715',
    bgColor: '#3498db',
    isUpgraded: false,
    isSecret: false
  },
  {
    id: 'mock-2',
    make: 'Declasse',
    model: 'Vamos',
    price: 18900,
    mileage: 45000,
    condition: 'Excellent',
    color: 'Red',
    imageUrl: 'https://media.discordapp.net/attachments/423286896983277568/1394345384045711502/IMG_5018.png?ex=6879c495&is=68787315&hm=1348fa9dd41b0b008e58856d67971ac8210ddc154cacc364699b75edea162bc5&=&format=webp&quality=lossless&width=1011&height=715',
    bgColor: '#e74c3c',
    isUpgraded: true,
    isSecret: false
  },
  {
    id: 'mock-3',
    make: 'Vapid',
    model: 'Dominator',
    price: 22500,
    mileage: 35000,
    condition: 'Like New',
    color: 'Black',
    imageUrl: 'https://media.discordapp.net/attachments/423286896983277568/1394345384045711502/IMG_5018.png?ex=6879c495&is=68787315&hm=1348fa9dd41b0b008e58856d67971ac8210ddc154cacc364699b75edea162bc5&=&format=webp&quality=lossless&width=1011&height=715',
    bgColor: '#2c3e50',
    isUpgraded: true,
    isSecret: false
  },
  {
    id: 'mock-4',
    make: 'Pegassi',
    model: 'Zentorno',
    price: 65000,
    mileage: 8500,
    condition: 'Excellent',
    color: 'Matte Black',
    imageUrl: 'https://media.discordapp.net/attachments/423286896983277568/1394345384045711502/IMG_5018.png?ex=6879c495&is=68787315&hm=1348fa9dd41b0b008e58856d67971ac8210ddc154cacc364699b75edea162bc5&=&format=webp&quality=lossless&width=1011&height=715',
    bgColor: '#1a1a1a',
    isUpgraded: true,
    isSecret: true
  }
];

// Mock storage for local development
// Initialize with localStorage if available (client-side) or with mock data (server-side)
let localBlobStorage = {
  vehicles: [...mockVehicles],
  nextId: mockVehicles.length + 1
};

// Try to load from localStorage if we're in the browser
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const savedData = localStorage.getItem('mosleyAutoVehicles');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      localBlobStorage = parsedData;
    } else {
      // Initialize localStorage with mock data
      localStorage.setItem('mosleyAutoVehicles', JSON.stringify(localBlobStorage));
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }
}

// Helper function to save to localStorage
const saveToLocalStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('mosleyAutoVehicles', JSON.stringify(localBlobStorage));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
};

/**
 * Check if Vercel Blob is properly configured
 * @returns {boolean} True if Vercel Blob is configured, false otherwise
 */
export function isBlobConfigured() {
  return process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_STORE_ID;
}

/**
 * Get all vehicles from storage
 * @param {boolean} isSecret Whether to get secret inventory vehicles
 * @returns {Promise<Array>} Array of vehicles
 */
export async function getVehicles(isSecret = false) {
  if (isBlobConfigured()) {
    try {
      // Use Vercel Blob to fetch data
      const prefix = isSecret ? 'secret-vehicles/' : 'vehicles/';
      const { blobs } = await list({ prefix });
      
      // Process the blobs to get the vehicle data
      const vehicles = await Promise.all(
        blobs.map(async (blob) => {
          const response = await fetch(blob.url);
          const vehicle = await response.json();
          return vehicle;
        })
      );
      
      return vehicles;
    } catch (error) {
      console.error('Error fetching vehicles from Vercel Blob:', error);
      // Fallback to local storage if there's an error
      return localBlobStorage.vehicles.filter(v => v.isSecret === isSecret);
    }
  } else {
    // Use local storage for development
    return localBlobStorage.vehicles.filter(v => v.isSecret === isSecret);
  }
}

/**
 * Add a vehicle to storage
 * @param {Object} vehicle Vehicle data to add
 * @returns {Promise<Object>} Added vehicle with ID
 */
export async function addVehicle(vehicle) {
  if (isBlobConfigured()) {
    try {
      // Generate a unique ID for the vehicle
      const id = `blob-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const vehicleWithId = { ...vehicle, id };
      
      // Determine the path based on whether it's a secret vehicle
      const path = vehicle.isSecret ? `secret-vehicles/${id}.json` : `vehicles/${id}.json`;
      
      // Store the vehicle data in Vercel Blob
      await put(path, JSON.stringify(vehicleWithId), { access: 'public' });
      
      // Also add to local storage for immediate access
      localBlobStorage.vehicles.push(vehicleWithId);
      saveToLocalStorage();
      
      return vehicleWithId;
    } catch (error) {
      console.error('Error adding vehicle to Vercel Blob:', error);
      
      // Fallback to local storage if there's an error
      const id = `fallback-${localBlobStorage.nextId++}`;
      const vehicleWithId = { ...vehicle, id };
      localBlobStorage.vehicles.push(vehicleWithId);
      saveToLocalStorage();
      return vehicleWithId;
    }
  } else {
    // Use local storage for development
    const id = `local-${localBlobStorage.nextId++}`;
    const vehicleWithId = { ...vehicle, id };
    localBlobStorage.vehicles.push(vehicleWithId);
    saveToLocalStorage();
    return vehicleWithId;
  }
}

/**
 * Update a vehicle in storage
 * @param {string} id Vehicle ID to update
 * @param {Object} vehicle Updated vehicle data
 * @returns {Promise<Object>} Updated vehicle
 */
export async function updateVehicle(id, vehicle) {
  if (isBlobConfigured()) {
    try {
      // Determine the path based on whether it's a secret vehicle
      const oldPath = vehicle.isSecret ? `secret-vehicles/${id}.json` : `vehicles/${id}.json`;
      const newPath = vehicle.isSecret ? `secret-vehicles/${id}.json` : `vehicles/${id}.json`;
      
      // Delete the old blob if the path has changed
      if (oldPath !== newPath) {
        await del(oldPath);
      }
      
      // Create the updated vehicle object
      const updatedVehicle = { ...vehicle, id };
      
      // Store the updated vehicle data in Vercel Blob
      await put(newPath, JSON.stringify(updatedVehicle), { access: 'public' });
      
      // Also update in local storage for immediate access
      const index = localBlobStorage.vehicles.findIndex(v => v.id === id);
      if (index !== -1) {
        localBlobStorage.vehicles[index] = updatedVehicle;
        saveToLocalStorage();
      }
      
      return updatedVehicle;
    } catch (error) {
      console.error('Error updating vehicle in Vercel Blob:', error);
      
      // Fallback to local storage if there's an error
      const index = localBlobStorage.vehicles.findIndex(v => v.id === id);
      if (index !== -1) {
        const updatedVehicle = { ...vehicle, id };
        localBlobStorage.vehicles[index] = updatedVehicle;
        saveToLocalStorage();
        return updatedVehicle;
      } else {
        throw new Error(`Vehicle with ID ${id} not found`);
      }
    }
  } else {
    // Use local storage for development
    const index = localBlobStorage.vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      const updatedVehicle = { ...vehicle, id };
      localBlobStorage.vehicles[index] = updatedVehicle;
      saveToLocalStorage();
      return updatedVehicle;
    } else {
      throw new Error(`Vehicle with ID ${id} not found`);
    }
  }
}

/**
 * Delete a vehicle from storage
 * @param {string} id Vehicle ID to delete
 * @returns {Promise<boolean>} True if successful
 */
export async function deleteVehicle(id) {
  if (isBlobConfigured()) {
    try {
      // Find the vehicle to determine if it's secret
      const vehicle = localBlobStorage.vehicles.find(v => v.id === id);
      if (!vehicle) {
        throw new Error(`Vehicle with ID ${id} not found`);
      }
      
      // Determine the path based on whether it's a secret vehicle
      const path = vehicle.isSecret ? `secret-vehicles/${id}.json` : `vehicles/${id}.json`;
      
      // Delete the vehicle data from Vercel Blob
      await del(path);
      
      // Also delete from local storage for immediate access
      const index = localBlobStorage.vehicles.findIndex(v => v.id === id);
      if (index !== -1) {
        localBlobStorage.vehicles.splice(index, 1);
        saveToLocalStorage();
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting vehicle from Vercel Blob:', error);
      
      // Fallback to local storage if there's an error
      const index = localBlobStorage.vehicles.findIndex(v => v.id === id);
      if (index !== -1) {
        localBlobStorage.vehicles.splice(index, 1);
        saveToLocalStorage();
        return true;
      } else {
        throw new Error(`Vehicle with ID ${id} not found`);
      }
    }
  } else {
    // Use local storage for development
    const index = localBlobStorage.vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      localBlobStorage.vehicles.splice(index, 1);
      saveToLocalStorage();
      return true;
    } else {
      throw new Error(`Vehicle with ID ${id} not found`);
    }
  }
}

/**
 * Initialize the Vercel Blob storage with mock data if it's empty
 * This is useful for development and testing
 */
export async function initializeBlobStorage() {
  if (isBlobConfigured()) {
    try {
      // Check if there are any vehicles in the Blob storage
      const { blobs: regularBlobs } = await list({ prefix: 'vehicles/' });
      const { blobs: secretBlobs } = await list({ prefix: 'secret-vehicles/' });
      
      // If there are no vehicles, initialize with mock data
      if (regularBlobs.length === 0 && secretBlobs.length === 0) {
        console.log('Initializing Vercel Blob storage with mock data...');
        
        // Add regular vehicles
        for (const vehicle of mockVehicles.filter(v => !v.isSecret)) {
          await put(`vehicles/${vehicle.id}.json`, JSON.stringify(vehicle), { access: 'public' });
        }
        
        // Add secret vehicles
        for (const vehicle of mockVehicles.filter(v => v.isSecret)) {
          await put(`secret-vehicles/${vehicle.id}.json`, JSON.stringify(vehicle), { access: 'public' });
        }
        
        console.log('Vercel Blob storage initialized with mock data.');
      }
    } catch (error) {
      console.error('Error initializing Vercel Blob storage:', error);
    }
  }
}

// Initialize Blob storage when the module is loaded (server-side only)
if (typeof window === 'undefined' && isBlobConfigured()) {
  initializeBlobStorage().catch(console.error);
}