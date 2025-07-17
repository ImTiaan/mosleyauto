'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminVehicleForm from './AdminVehicleForm';

// Default placeholder image
const defaultImageUrl = 'https://media.discordapp.net/attachments/423286896983277568/1394345384045711502/IMG_5018.png?ex=6879c495&is=68787315&hm=1348fa9dd41b0b008e58856d67971ac8210ddc154cacc364699b75edea162bc5&=&format=webp&quality=lossless&width=1011&height=715';

export default function AdminVehicleList({ isSecret = false }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  
  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch vehicles from API
      const response = await fetch(`/api/vehicles?secret=${isSecret}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      
      const data = await response.json();
      
      // Filter vehicles based on isSecret flag
      const filteredVehicles = data.vehicles.filter(v => v.isSecret === isSecret);
      
      // Add background colors and default image URL if they don't exist
      const vehiclesWithColors = filteredVehicles.map(vehicle => {
        const updatedVehicle = { ...vehicle };
        
        if (!updatedVehicle.bgColor) {
          // Generate a color based on the vehicle's make
          const regularColors = {
            'Albany': '#3498db',
            'Declasse': '#e74c3c',
            'Vapid': '#2c3e50',
            'Karin': '#7f8c8d',
            'Bravado': '#f1c40f',
            'Pfister': '#ecf0f1',
            'default': '#95a5a6'
          };
          
          const secretColors = {
            'Pegassi': '#1a1a1a',
            'Truffade': '#e67e22',
            'Överflöd': '#c0392b',
            'Grotti': '#ecf0f1',
            'default': '#34495e'
          };
          
          const colors = isSecret ? secretColors : regularColors;
          updatedVehicle.bgColor = colors[vehicle.make] || colors.default;
        }
        
        if (!updatedVehicle.imageUrl) {
          updatedVehicle.imageUrl = defaultImageUrl;
        }
        
        return updatedVehicle;
      });
      
      setVehicles(vehiclesWithColors);
      // Reset image errors when fetching new vehicles
      setImageErrors({});
    } catch (error) {
      console.error(`Error fetching ${isSecret ? 'secret' : 'regular'} vehicles:`, error);
      setError(`Failed to load vehicles. ${error.message}`);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchVehicles();
    
    // Listen for refresh events from the form
    const handleRefresh = (event) => {
      if (event.detail.isSecret === isSecret) {
        fetchVehicles();
      }
    };
    
    window.addEventListener('refreshVehicles', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshVehicles', handleRefresh);
    };
  }, [isSecret]);
  
  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowEditForm(true);
    // Scroll to the edit form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const handleDelete = async (id) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }
    
    setLoading(true);
    
    try {
      // Delete vehicle via API
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }
      
      // Remove the vehicle from the list
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
      setDeleteConfirm(null);
      
    } catch (error) {
      console.error(`Error deleting vehicle:`, error);
      setError(`Failed to delete vehicle. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditSubmitSuccess = () => {
    // Refresh the vehicle list
    fetchVehicles();
    
    // Close the edit form
    setShowEditForm(false);
    setEditingVehicle(null);
  };
  
  const cancelEdit = () => {
    setShowEditForm(false);
    setEditingVehicle(null);
  };
  
  const handleImageError = (id) => {
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };
  
  if (loading && vehicles.length === 0) {
    return <div>Loading vehicles...</div>;
  }
  
  if (error) {
    return (
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#ffebee', 
        color: '#c62828',
        borderRadius: '4px',
        marginBottom: '1rem'
      }}>
        {error}
      </div>
    );
  }
  
  if (vehicles.length === 0) {
    return (
      <div style={{ 
        padding: '2rem', 
        backgroundColor: '#f9f9f9', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p>No vehicles in the {isSecret ? 'secret' : 'regular'} inventory yet.</p>
      </div>
    );
  }
  
  return (
    <div>
      {showEditForm && editingVehicle && (
        <div style={{ 
          backgroundColor: '#f9f9f9',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: isSecret ? '2px solid var(--primary-color)' : '2px solid var(--accent-color)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3>Edit Vehicle: {editingVehicle.make} {editingVehicle.model}</h3>
            <button 
              onClick={cancelEdit}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
          
          <AdminVehicleForm 
            isSecret={isSecret} 
            editVehicle={editingVehicle} 
            onSubmitSuccess={handleEditSubmitSuccess} 
          />
        </div>
      )}
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: isSecret ? 'var(--primary-color)' : 'var(--accent-color)', color: 'white' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Vehicle</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Make/Model</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Price</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Details</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Upgraded</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.75rem', width: '100px' }}>
                  {imageErrors[vehicle.id] ? (
                    // Fallback to colored background if image fails to load
                    <div 
                      style={{ 
                        width: '80px', 
                        height: '60px',
                        backgroundColor: vehicle.bgColor || '#ccc',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        borderRadius: '4px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      {vehicle.make}<br />{vehicle.model}
                    </div>
                  ) : (
                    // Image with error handling
                    <div style={{ position: 'relative', width: '80px', height: '60px', borderRadius: '4px', overflow: 'hidden' }}>
                      <Image 
                        src={vehicle.imageUrl || defaultImageUrl}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        onError={() => handleImageError(vehicle.id)}
                      />
                    </div>
                  )}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <strong>{vehicle.make} {vehicle.model}</strong>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  ${vehicle.price.toLocaleString()}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <div>Mileage: {vehicle.mileage.toLocaleString()}</div>
                  <div>Condition: {vehicle.condition}</div>
                  <div>Color: {vehicle.color}</div>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                  {vehicle.isUpgraded ? '✓' : '✗'}
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleEdit(vehicle)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: deleteConfirm === vehicle.id ? '#d32f2f' : '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {deleteConfirm === vehicle.id ? 'Confirm' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}