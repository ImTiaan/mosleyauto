'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for authentication in session storage first (client-side)
        const isAuth = sessionStorage.getItem('adminAuth') === 'true';
        
        if (isAuth) {
          setIsAuthenticated(true);
          router.push('/admin/dashboard');
        } else {
          // Check for authentication cookie (server-side)
          const response = await fetch('/api/auth/check?type=admin');
          const data = await response.json();
          
          if (data.authenticated) {
            setIsAuthenticated(true);
            sessionStorage.setItem('adminAuth', 'true');
            router.push('/admin/dashboard');
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleSubmit = async (e) => {
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
          type: 'admin',
          password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Set admin authentication in session storage
        sessionStorage.setItem('adminAuth', 'true');
        // Redirect to admin dashboard
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid password. Please try again.');
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
  
  // If checking authentication or already authenticated, show loading
  if (checkingAuth || isAuthenticated) {
    return (
      <main>
        <Header />
        <div className="container" style={{ 
          marginTop: '4rem',
          display: 'flex',
          justifyContent: 'center',
          minHeight: '60vh'
        }}>
          <p>Loading...</p>
        </div>
        <Footer />
      </main>
    );
  }
  
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
          <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Admin Login</h1>
          <p style={{ marginBottom: '2rem', textAlign: 'center' }}>
            Enter your password to access the admin dashboard.
          </p>
          
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
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              style={{ 
                width: '100%', 
                padding: '0.75rem 1.5rem',
                position: 'relative'
              }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}