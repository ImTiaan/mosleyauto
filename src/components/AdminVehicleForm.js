'use client';

import { useState, useEffect } from 'react';
import vehicleData from '../../vehicle-data.json';

export default function AdminVehicleForm({ isSecret = false, editVehicle = null, onSubmitSuccess = () => {} }) {
  const initialFormState = editVehicle ? {
    ...editVehicle
  } : {
    manufacturer: '',
    make: '',
    model: '',
    price: '',
    mileage: '',
    condition: 'Good',
    color: '',
    imageUrl: 'https://media.discordapp.net/attachments/423286896983277568/1394345384045711502/IMG_5018.png?ex=6879c495&is=68787315&hm=1348fa9dd41b0b008e58856d67971ac8210ddc154cacc364699b75edea162bc5&=&format=webp&quality=lossless&width=1011&height=715',
    bgColor: '',
    isUpgraded: false,
    isSecret: isSecret
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [manualModelEntry, setManualModelEntry] = useState(false);
  
  // Color options based on vehicle type
  const regularColors = {
    'Albany': '#3498db',
    'Declasse': '#e74c3c',
    'Vapid': '#2c3e50',
    'Karin': '#7f8c8d',
    'Bravado': '#f1c40f',
    'Pfister': '#ecf0f1',
    'Other': '#95a5a6'
  };
  
  const secretColors = {
    'Pegassi': '#1a1a1a',
    'Truffade': '#e67e22',
    'Överflöd': '#c0392b',
    'Grotti': '#ecf0f1',
    'Other': '#34495e'
  };
  
  const colorOptions = isSecret ? secretColors : regularColors;
  
  // Update available models when manufacturer changes
  useEffect(() => {
    if (formData.manufacturer) {
      const selectedManufacturer = vehicleData.manufacturers.find(
        m => m.name === formData.manufacturer
      );
      
      if (selectedManufacturer) {
        setAvailableModels(selectedManufacturer.models);
        
        // Update the make field to match the in-game manufacturer name
        setFormData(prev => ({
          ...prev,
          make: selectedManufacturer.name
        }));
      } else {
        setAvailableModels([]);
      }
    } else {
      setAvailableModels([]);
    }
  }, [formData.manufacturer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'manufacturer') {
      // When manufacturer changes, reset the model
      setFormData(prev => ({
        ...prev,
        manufacturer: value,
        model: '',
        // Update bgColor based on manufacturer
        bgColor: colorOptions[value] || colorOptions['Other']
      }));
      
      // Reset manual entry when manufacturer changes
      if (manualModelEntry) {
        setManualModelEntry(false);
      }
    } else if (name === 'make') {
      // When make changes, update the bgColor if it exists in our predefined colors
      const newBgColor = colorOptions[value] || colorOptions['Other'];
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        bgColor: newBgColor
      }));
    } else if (name === 'manualModelEntry') {
      // Toggle between dropdown and manual entry
      setManualModelEntry(checked);
      
      // Clear the model field when switching modes
      setFormData(prev => ({
        ...prev,
        model: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate form
    if (!formData.make || !formData.model || !formData.price || !formData.mileage || !formData.color || !formData.imageUrl) {
      setError('Please fill out all required fields.');
      setLoading(false);
      return;
    }
    
    try {
      // Prepare data for API
      const vehicleData = {
        ...formData,
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        isSecret: isSecret,
        // If no bgColor is provided, use a default based on make
        bgColor: formData.bgColor || colorOptions[formData.make] || colorOptions['Other']
      };
      
      let response;
      
      if (editVehicle) {
        // Update existing vehicle
        response = await fetch(`/api/vehicles/${editVehicle.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vehicleData),
        });
      } else {
        // Add new vehicle
        response = await fetch('/api/vehicles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vehicleData),
        });
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save vehicle');
      }
      
      // Show success message
      setSuccess(editVehicle 
        ? `Vehicle updated successfully!` 
        : `Vehicle added to ${isSecret ? 'secret' : 'regular'} inventory successfully!`
      );
      
      // Reset form if not editing
      if (!editVehicle) {
        setFormData({
          ...initialFormState,
          isSecret: isSecret // Maintain the secret status
        });
      }
      
      // Call the success callback
      onSubmitSuccess(data.vehicle);
      
    } catch (err) {
      console.error('Error submitting vehicle:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
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
      
      {success && (
        <div style={{ 
          backgroundColor: '#e8f5e9', 
          color: '#2e7d32', 
          padding: '0.75rem', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {success}
        </div>
      )}
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <label htmlFor="manufacturer" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Manufacturer <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            required
            disabled={loading}
          >
            <option value="">Select Manufacturer</option>
            {vehicleData.manufacturers.map(manufacturer => (
              <option key={manufacturer.name} value={manufacturer.name}>
                {manufacturer.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="make" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Make <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            id="make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            required
            disabled={loading}
          />
          <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#666' }}>
            Auto-filled with the selected manufacturer
          </p>
        </div>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label htmlFor="model">
              Model <span style={{ color: 'red' }}>*</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="manualModelEntry"
                name="manualModelEntry"
                checked={manualModelEntry}
                onChange={handleChange}
                style={{ marginRight: '0.5rem' }}
                disabled={loading}
              />
              <label htmlFor="manualModelEntry" style={{ fontSize: '0.8rem', color: '#666' }}>
                Enter manually
              </label>
            </div>
          </div>
          
          {manualModelEntry ? (
            // Manual text input for model
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
              placeholder="Enter model name"
              required
              disabled={loading}
            />
          ) : (
            // Dropdown selection for model
            <select
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
              required
              disabled={loading || !formData.manufacturer}
            >
              <option value="">Select Model</option>
              {availableModels.map(model => (
                <option key={model.modelName} value={model.displayName}>
                  {model.displayName}
                </option>
              ))}
            </select>
          )}
          
          {!formData.manufacturer && !manualModelEntry && (
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#666' }}>
              Please select a manufacturer first or check "Enter manually"
            </p>
          )}
          {manualModelEntry && (
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#666' }}>
              You can enter any model name manually
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="price" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Price ($) <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            min="1"
            step="1"
            required
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="mileage" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Mileage <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="number"
            id="mileage"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            min="0"
            required
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="condition" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Condition <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            required
            disabled={loading}
          >
            <option value="Pristine">Pristine</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Derelict">Derelict</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="color" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Color <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            required
            disabled={loading}
          />
        </div>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="imageUrl" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Image URL <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          style={{ 
            width: '100%', 
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          required
          disabled={loading}
          placeholder="https://example.com/image.jpg"
        />
        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#666' }}>
          Enter the URL of the vehicle image. Default placeholder is provided.
        </p>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="bgColor" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Background Color (Optional)
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            type="color"
            id="bgColor"
            name="bgColor"
            value={formData.bgColor || '#cccccc'}
            onChange={handleChange}
            style={{ 
              width: '50px',
              height: '50px',
              padding: '0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            disabled={loading}
          />
          <div 
            style={{ 
              flex: 1,
              height: '50px',
              backgroundColor: formData.bgColor || '#cccccc',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {formData.make || 'Make'} {formData.model || 'Model'}
          </div>
        </div>
        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#666' }}>
          This color will be used as a fallback if the image fails to load.
        </p>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id="isUpgraded"
            name="isUpgraded"
            checked={formData.isUpgraded}
            onChange={handleChange}
            style={{ marginRight: '0.5rem' }}
            disabled={loading}
          />
          <label htmlFor="isUpgraded">
            This vehicle is upgraded
          </label>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          className={`btn ${isSecret ? 'btn-primary' : ''}`}
          style={{ 
            padding: '0.75rem 1.5rem',
            backgroundColor: isSecret ? 'var(--primary-color)' : 'var(--accent-color)',
            position: 'relative'
          }}
          disabled={loading}
        >
          {loading ? 'Saving...' : editVehicle ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
}