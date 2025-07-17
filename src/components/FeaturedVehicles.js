'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Starburst from './Starburst';

// Fallback mock data for featured vehicles (used if API fails)
const mockFeaturedVehicles = [
  {
    id: '1',
    make: 'Albany',
    model: 'Emperor',
    price: 12500,
    mileage: 75000,
    condition: 'Good',
    color: 'Blue',
    imageUrl: 'https://media.discordapp.net/attachments/423286896983277568/1394345384045711502/IMG_5018.png?ex=6879c495&is=68787315&hm=1348fa9dd41b0b008e58856d67971ac8210ddc154cacc364699b75edea162bc5&=&format=webp&quality=lossless&width=1011&height=715',
    bgColor: '#3498db',
    isUpgraded: false
  },
  {
    id: '2',
    make: 'Declasse',
    model: 'Vamos',
    price: 18900,
    mileage: 45000,
    condition: 'Excellent',
    color: 'Red',
    imageUrl: 'https://media.discordapp.net/attachments/423286896983277568/1394345384045711502/IMG_5018.png?ex=6879c495&is=68787315&hm=1348fa9dd41b0b008e58856d67971ac8210ddc154cacc364699b75edea162bc5&=&format=webp&quality=lossless&width=1011&height=715',
    bgColor: '#e74c3c',
    isUpgraded: true
  },
  {
    id: '3',
    make: 'Vapid',
    model: 'Dominator',
    price: 22500,
    mileage: 35000,
    condition: 'Like New',
    color: 'Black',
    imageUrl: 'https://media.discordapp.net/attachments/423286896983277568/1394345384045711502/IMG_5018.png?ex=6879c495&is=68787315&hm=1348fa9dd41b0b008e58856d67971ac8210ddc154cacc364699b75edea162bc5&=&format=webp&quality=lossless&width=1011&height=715',
    bgColor: '#2c3e50',
    isUpgraded: true
  }
];

// Default placeholder image
const defaultImageUrl = 'https://media.discordapp.net/attachments/423286896983277568/1394345384045711502/IMG_5018.png?ex=6879c495&is=68787315&hm=1348fa9dd41b0b008e58856d67971ac8210ddc154cacc364699b75edea162bc5&=&format=webp&quality=lossless&width=1011&height=715';

export default function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [expandedImage, setExpandedImage] = useState(null);
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // Fetch vehicles from API
        const response = await fetch('/api/vehicles');
        
        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        
        const data = await response.json();
        
        // Get 3 random vehicles for featured section
        let featuredVehicles = data.vehicles;
        
        if (featuredVehicles.length > 3) {
          // Shuffle array and take first 3
          featuredVehicles = [...featuredVehicles]
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        } else if (featuredVehicles.length === 0) {
          // Use mock data if no vehicles are returned
          featuredVehicles = mockFeaturedVehicles;
        }
        
        // Add background colors and default image URL if they don't exist
        featuredVehicles = featuredVehicles.map(vehicle => {
          const updatedVehicle = { ...vehicle };
          
          if (!updatedVehicle.bgColor) {
            // Generate a random color if none exists
            const colors = ['#3498db', '#e74c3c', '#2c3e50', '#27ae60', '#f39c12', '#8e44ad', '#16a085'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            updatedVehicle.bgColor = randomColor;
          }
          
          if (!updatedVehicle.imageUrl) {
            updatedVehicle.imageUrl = defaultImageUrl;
          }
          
          return updatedVehicle;
        });
        
        setVehicles(featuredVehicles);
      } catch (error) {
        console.error('Error fetching featured vehicles:', error);
        // Use mock data as fallback
        setVehicles(mockFeaturedVehicles);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, []);
  
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
  
  if (loading) {
    return <div>Loading featured vehicles...</div>;
  }
  
  return (
    <>
      <div className="grid">
        {vehicles.map((vehicle) => (
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