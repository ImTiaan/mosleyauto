'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KonamiCode() {
  const router = useRouter();
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // The Konami Code sequence
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      // If the password prompt is shown, don't process Konami code
      if (showPrompt) return;
      
      // Check if the key pressed matches the next key in the sequence
      if (e.key === konamiCode[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        setKonamiIndex(nextIndex);
        
        // If the full sequence is entered, show the password prompt
        if (nextIndex === konamiCode.length) {
          setShowPrompt(true);
          setKonamiIndex(0); // Reset the index
        }
      } else {
        setKonamiIndex(0); // Reset on incorrect sequence
      }
    };
    
    // Add the event listener to the document
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [konamiIndex, showPrompt]);
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        // Set authentication in session storage
        sessionStorage.setItem('secretInventoryAuth', 'true');
        
        // Close the prompt
        setShowPrompt(false);
        setPassword('');
        
        // Redirect to the secret inventory
        router.push('/secret-inventory');
      } else {
        setError(data.error || 'Incorrect password. Access denied.');
        setPassword('');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('Authentication failed. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setShowPrompt(false);
    setPassword('');
    setError('');
  };
  
  if (!showPrompt) return null;
  
  return (
    <div style={{
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
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '100%',
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Secret Inventory Access</h2>
        <p style={{ marginBottom: '1.5rem' }}>Enter the password to access the secret inventory:</p>
        
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
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            placeholder="Enter password"
            autoFocus
            disabled={loading}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ccc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              disabled={loading}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--accent-color)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                position: 'relative',
              }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}