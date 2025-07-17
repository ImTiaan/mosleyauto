'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Starburst from '@/components/Starburst';

// Default placeholder image
const defaultImageUrl = 'https://media.discordapp.net/attachments/423286896983277568/1394345384045711502/IMG_5018.png?ex=6879c495&is=68787315&hm=1348fa9dd41b0b008e58856d67971ac8210ddc154cacc364699b75edea162bc5&=&format=webp&quality=lossless&width=1011&height=715';

// Fallback mock data for vehicles (used if API fails)
const mockVehicles = [
  {
    id: '1',
    make: 'Albany',
    model: 'Emperor',
    price: 12500,
    mileage: 75000,
    condition: 'Fair',
    color: 'Blue',
    imageUrl: defaultImageUrl,
    bgColor: '#3498db',
    isUpgraded: false
  },
  {
    id: '2',
    make: 'Declasse',
    model: 'Vamos',
    price: 18900,
    mileage: 45000,
    condition: 'Good',
    color: 'Red',
    imageUrl: defaultImageUrl,
    bgColor: '#e74c3c',
    isUpgraded: true
  },
  {
    id: '3',
    make: 'Vapid',
    model: 'Dominator',
    price: 22500,
    mileage: 35000,
    condition: 'Pristine',
    color: 'Black',
    imageUrl: defaultImageUrl,
    bgColor: '#2c3e50',
    isUpgraded: true
  },
  {
    id: '4',
    make: 'Karin',
    model: 'Sultan',
    price: 24000,
    mileage: 28000,
    condition: 'Good',
    color: 'Silver',
    imageUrl: defaultImageUrl,
    bgColor: '#7f8c8d',
    isUpgraded: false
  },
  {
    id: '5',
    make: 'Bravado',
    model: 'Banshee',
    price: 35000,
    mileage: 15000,
    condition: 'Pristine',
    color: 'Yellow',
    imageUrl: defaultImageUrl,
    bgColor: '#f1c40f',
    isUpgraded: true
  },
  {
    id: '6',
    make: 'Pfister',
    model: 'Comet',
    price: 42000,
    mileage: 12000,
    condition: 'Pristine',
    color: 'White',
    imageUrl: defaultImageUrl,
    bgColor: '#ecf0f1',
    isUpgraded: false
  }
];

export default function Inventory() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const [expandedImage, setExpandedImage] = useState(null);
  const [filters, setFilters] = useState({
    make: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    isUpgraded: false
  });
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // Fetch vehicles from API
        const response = await fetch('/api/vehicles');
        
        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        
        const data = await response.json();
        
        if (data.vehicles && data.vehicles.length > 0) {
          // Add background colors and default image URL if they don't exist
          const vehiclesWithColors = data.vehicles.map(vehicle => {
            const updatedVehicle = { ...vehicle };
            
            if (!updatedVehicle.bgColor) {
              // Generate a color based on the vehicle's make
              const colors = {
                'Albany': '#3498db',
                'Declasse': '#e74c3c',
                'Vapid': '#2c3e50',
                'Karin': '#7f8c8d',
                'Bravado': '#f1c40f',
                'Pfister': '#ecf0f1',
                'default': '#95a5a6'
              };
              
              updatedVehicle.bgColor = colors[vehicle.make] || colors.default;
            }
            
            if (!updatedVehicle.imageUrl) {
              updatedVehicle.imageUrl = defaultImageUrl;
            }
            
            return updatedVehicle;
          });
          
          setVehicles(vehiclesWithColors);
        } else {
          // Use mock data if no vehicles are returned
          setVehicles(mockVehicles);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setError('Failed to load vehicles. Please try again later.');
        // Use mock data as fallback
        setVehicles(mockVehicles);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, []);
  
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleImageError = (id) => {
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };
  
  const handleImageClick = (vehicle) => {
    setExpandedImage(vehicle);
  };
  
  const closeExpandedImage = () => {
    setExpandedImage(null);
  };
  
  const filteredVehicles = vehicles.filter(vehicle => {
    // Filter by make
    if (filters.make && !vehicle.make.toLowerCase().includes(filters.make.toLowerCase())) {
      return false;
    }
    
    // Filter by min price
    if (filters.minPrice && vehicle.price < parseInt(filters.minPrice)) {
      return false;
    }
    
    // Filter by max price
    if (filters.maxPrice && vehicle.price > parseInt(filters.maxPrice)) {
      return false;
    }
    
    // Filter by condition
    if (filters.condition && vehicle.condition !== filters.condition) {
      return false;
    }
    
    // Filter by upgraded status
    if (filters.isUpgraded && !vehicle.isUpgraded) {
      return false;
    }
    
    return true;
  });
  
  return (
    <>
      <main>
        <Header />
        
        <div className="container" style={{ marginTop: '2rem' }}>
          <h1>Vehicle Inventory</h1>
          <p style={{ marginBottom: '2rem' }}>Browse our selection of quality used vehicles.</p>
          
          <div style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '1.5rem', 
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Filter Vehicles</h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <label htmlFor="make" style={{ display: 'block', marginBottom: '0.5rem' }}>Make:</label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={filters.make}
                  onChange={handleFilterChange}
                  style={{ width: '100%', padding: '0.5rem' }}
                  placeholder="Any make"
                />
              </div>
              
              <div>
                <label htmlFor="minPrice" style={{ display: 'block', marginBottom: '0.5rem' }}>Min Price:</label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  style={{ width: '100%', padding: '0.5rem' }}
                  placeholder="Min price"
                />
              </div>
              
              <div>
                <label htmlFor="maxPrice" style={{ display: 'block', marginBottom: '0.5rem' }}>Max Price:</label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  style={{ width: '100%', padding: '0.5rem' }}
                  placeholder="Max price"
                />
              </div>
              
              <div>
                <label htmlFor="condition" style={{ display: 'block', marginBottom: '0.5rem' }}>Condition:</label>
                <select
                  id="condition"
                  name="condition"
                  value={filters.condition}
                  onChange={handleFilterChange}
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <option value="">Any condition</option>
                  <option value="Pristine">Pristine</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Derelict">Derelict</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="isUpgraded"
                  name="isUpgraded"
                  checked={filters.isUpgraded}
                  onChange={handleFilterChange}
                  style={{ marginRight: '0.5rem' }}
                />
                <label htmlFor="isUpgraded">Upgraded vehicles only</label>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div>Loading vehicles...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : filteredVehicles.length === 0 ? (
            <div>No vehicles found matching your filters.</div>
          ) : (
            <div className="grid">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="card">
                  <div style={{ position: 'relative' }}>
                    {imageErrors[vehicle.id] ? (
                      // Fallback to colored background if image fails to load
                      <div 
                        style={{ 
                          position: 'relative', 
                          height: '200px',
                          backgroundColor: vehicle.bgColor || '#ccc',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.5rem',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                        }}
                      >
                        {vehicle.make} {vehicle.model}
                      </div>
                    ) : (
                      // Image component with error handling
                      <div 
                        style={{ position: 'relative', height: '200px', cursor: 'pointer' }}
                        onClick={() => handleImageClick(vehicle)}
                      >
                        <Image 
                          src={vehicle.imageUrl || defaultImageUrl}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          onError={() => handleImageError(vehicle.id)}
                        />
                      </div>
                    )}
                    
                  </div>
                  
                  <div className="card-content">
                    <h3 className="card-title">{vehicle.make} {vehicle.model}</h3>
                    <p className="card-price">${vehicle.price.toLocaleString()}</p>
                    <p>Mileage: {vehicle.mileage.toLocaleString()}</p>
                    <p>Condition: {vehicle.condition}</p>
                    <p>Color: {vehicle.color}</p>
                    {vehicle.isUpgraded && (
                      <p style={{
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginTop: '8px',
                        fontWeight: 'bold'
                      }}>
                        ✓ Upgraded
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Footer />
      </main>
      
      {expandedImage && typeof window !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
          onClick={closeExpandedImage}
        >
          <div 
            style={{
              position: 'relative',
              width: '80%',
              height: '80%',
              maxWidth: '1000px',
              maxHeight: '800px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image 
              src={expandedImage.imageUrl || defaultImageUrl}
              alt={`${expandedImage.make} ${expandedImage.model}`}
              fill
              style={{ objectFit: 'contain' }}
            />
            <button 
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
              onClick={closeExpandedImage}
            >
              ×
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}