'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Starburst from '@/components/Starburst';

// Default placeholder image
const defaultImageUrl = 'https://media.discordapp.net/attachments/423286896983277568/1394345384045711502/IMG_5018.png?ex=6879c495&is=68787315&hm=1348fa9dd41b0b008e58856d67971ac8210ddc154cacc364699b75edea162bc5&=&format=webp&quality=lossless&width=1011&height=715';

// Fallback mock data for secret (stolen) vehicles
const mockSecretVehicles = [
  {
    id: 's1',
    make: 'Pegassi',
    model: 'Zentorno',
    price: 65000,
    mileage: 8500,
    condition: 'Excellent',
    color: 'Matte Black',
    imageUrl: defaultImageUrl,
    bgColor: '#1a1a1a',
    isUpgraded: true
  },
  {
    id: 's2',
    make: 'Truffade',
    model: 'Adder',
    price: 85000,
    mileage: 5200,
    condition: 'Like New',
    color: 'Orange',
    imageUrl: defaultImageUrl,
    bgColor: '#e67e22',
    isUpgraded: true
  },
  {
    id: 's3',
    make: 'Överflöd',
    model: 'Entity XF',
    price: 72000,
    mileage: 7800,
    condition: 'Excellent',
    color: 'Red',
    imageUrl: defaultImageUrl,
    bgColor: '#c0392b',
    isUpgraded: true
  },
  {
    id: 's4',
    make: 'Grotti',
    model: 'Turismo R',
    price: 68000,
    mileage: 9200,
    condition: 'Good',
    color: 'White',
    imageUrl: defaultImageUrl,
    bgColor: '#ecf0f1',
    isUpgraded: false
  }
];

export default function SecretInventory() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const [expandedImage, setExpandedImage] = useState(null);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for authentication in session storage first (client-side)
        const isAuth = sessionStorage.getItem('secretInventoryAuth') === 'true';
        
        if (isAuth) {
          setIsAuthenticated(true);
          fetchVehicles();
        } else {
          // Check for authentication cookie (server-side)
          const response = await fetch('/api/auth/check?type=secret');
          const data = await response.json();
          
          if (data.authenticated) {
            setIsAuthenticated(true);
            sessionStorage.setItem('secretInventoryAuth', 'true');
            fetchVehicles();
          } else {
            setIsAuthenticated(false);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const fetchVehicles = async () => {
    try {
      // Fetch secret vehicles from API
      const response = await fetch('/api/vehicles?secret=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch secret vehicles');
      }
      
      const data = await response.json();
      
      if (data.vehicles && data.vehicles.length > 0) {
        // Add background colors and default image URL if they don't exist
        const vehiclesWithColors = data.vehicles.filter(v => v.isSecret).map(vehicle => {
          const updatedVehicle = { ...vehicle };
          
          if (!updatedVehicle.bgColor) {
            // Generate a color based on the vehicle's make
            const colors = {
              'Pegassi': '#1a1a1a',
              'Truffade': '#e67e22',
              'Överflöd': '#c0392b',
              'Grotti': '#ecf0f1',
              'default': '#34495e'
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
        setVehicles(mockSecretVehicles);
      }
    } catch (error) {
      console.error('Error fetching secret vehicles:', error);
      // Use mock data as fallback
      setVehicles(mockSecretVehicles);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Authenticate with API
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'secret',
          password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('secretInventoryAuth', 'true');
        fetchVehicles();
      } else {
        setError(data.error || 'Incorrect password. Access denied.');
        setPassword('');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('Authentication failed. Please try again.');
      setPassword('');
    }
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
  
  if (!isAuthenticated) {
    return (
      <main>
        <Header />
        
        <div className="container" style={{ 
          marginTop: '4rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh'
        }}>
          <div style={{
            maxWidth: '400px',
            width: '100%',
            padding: '2rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Secret Inventory</h1>
            <p style={{ marginBottom: '2rem', textAlign: 'center' }}>
              This area is restricted. Please enter the password to continue.
            </p>
            
            <form onSubmit={handlePasswordSubmit}>
              {error && (
                <div style={{ 
                  backgroundColor: '#ffebee', 
                  color: '#c62828', 
                  padding: '0.75rem', 
                  borderRadius: '4px',
                  marginBottom: '1rem'
                }}>
                  {error}
                </div>
              )}
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                  required
                  autoFocus
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#ccc',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  Access
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <Footer />
      </main>
    );
  }
  
  return (
    <>
      <main>
        <Header />
        
        <div className="container" style={{ marginTop: '2rem' }}>
          <div style={{ 
            backgroundColor: '#000', 
            color: '#fff', 
            padding: '1.5rem', 
            borderRadius: '8px',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h1 style={{ color: '#fff' }}>Secret Inventory</h1>
            <p style={{ marginBottom: '0' }}>
              These vehicles have "fallen off the truck" and are available at special prices.
              <strong style={{ display: 'block', marginTop: '0.5rem' }}>
                No questions asked. Cash only. No paperwork.
              </strong>
            </p>
          </div>
          
          {loading ? (
            <div>Loading secret inventory...</div>
          ) : (
            <div className="grid">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="card" style={{ border: '2px solid #ff0000' }}>
                  <div style={{ position: 'relative' }}>
                    {imageErrors[vehicle.id] ? (
                      // Fallback to colored background if image fails to load
                      <div 
                        style={{ 
                          position: 'relative', 
                          height: '200px',
                          backgroundColor: vehicle.bgColor || '#34495e',
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
                    
                    <div style={{ 
                      backgroundColor: '#ffebee', 
                      padding: '0.75rem', 
                      borderRadius: '4px',
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      fontSize: '0.9rem'
                    }}>
                      <strong>Note:</strong> No registration papers available. Cash only.
                    </div>
                    
                    <button className="btn btn-primary" style={{ width: '100%' }}>
                      Contact About This Vehicle
                    </button>
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