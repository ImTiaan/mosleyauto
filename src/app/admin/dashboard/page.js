'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminVehicleForm from '@/components/AdminVehicleForm';
import AdminVehicleList from '@/components/AdminVehicleList';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('regular');
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for authentication in session storage first (client-side)
        const isAuth = sessionStorage.getItem('adminAuth') === 'true';
        
        if (isAuth) {
          setIsAuthenticated(true);
          setLoading(false);
        } else {
          // Check for authentication cookie (server-side)
          const response = await fetch('/api/auth/check?type=admin');
          const data = await response.json();
          
          if (data.authenticated) {
            setIsAuthenticated(true);
            sessionStorage.setItem('adminAuth', 'true');
          } else {
            setIsAuthenticated(false);
            router.push('/admin');
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setLoading(false);
        router.push('/admin');
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleLogout = async () => {
    try {
      // Logout from API
      await fetch('/api/auth?type=admin', {
        method: 'DELETE',
      });
      
      // Clear session storage
      sessionStorage.removeItem('adminAuth');
      
      // Redirect to admin login
      router.push('/admin');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect even if API call fails
      sessionStorage.removeItem('adminAuth');
      router.push('/admin');
    }
  };
  
  if (loading) {
    return (
      <main>
        <Header />
        <div className="container" style={{ marginTop: '2rem', minHeight: '60vh' }}>
          <p>Loading...</p>
        </div>
        <Footer />
      </main>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <main>
      <Header />
      
      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1>Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="btn"
            style={{ backgroundColor: '#666' }}
          >
            Logout
          </button>
        </div>
        
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #ccc',
          marginBottom: '2rem'
        }}>
          <button 
            onClick={() => setActiveTab('regular')}
            style={{ 
              padding: '1rem 1.5rem',
              backgroundColor: activeTab === 'regular' ? 'var(--accent-color)' : 'transparent',
              color: activeTab === 'regular' ? 'white' : 'inherit',
              border: 'none',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              cursor: 'pointer',
              fontWeight: activeTab === 'regular' ? 'bold' : 'normal',
            }}
          >
            Regular Inventory
          </button>
          <button 
            onClick={() => setActiveTab('secret')}
            style={{ 
              padding: '1rem 1.5rem',
              backgroundColor: activeTab === 'secret' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'secret' ? 'white' : 'inherit',
              border: 'none',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              cursor: 'pointer',
              fontWeight: activeTab === 'secret' ? 'bold' : 'normal',
              marginLeft: '0.5rem'
            }}
          >
            Secret Inventory
          </button>
        </div>
        
        {activeTab === 'regular' ? (
          <div>
            <h2>Manage Regular Inventory</h2>
            <p style={{ marginBottom: '2rem' }}>
              Add, edit, or remove vehicles from the regular inventory.
            </p>
            
            <div style={{ 
              backgroundColor: '#f9f9f9',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h3>Add New Vehicle</h3>
              <AdminVehicleForm 
                isSecret={false} 
                onSubmitSuccess={() => {
                  // Force refresh of vehicle list
                  const event = new CustomEvent('refreshVehicles', { detail: { isSecret: false } });
                  window.dispatchEvent(event);
                }}
              />
            </div>
            
            <h3>Current Inventory</h3>
            <AdminVehicleList isSecret={false} />
          </div>
        ) : (
          <div>
            <h2>Manage Secret Inventory</h2>
            <p style={{ marginBottom: '2rem' }}>
              Add, edit, or remove vehicles from the secret inventory.
              <strong style={{ display: 'block', color: 'var(--primary-color)', marginTop: '0.5rem' }}>
                Remember: These vehicles are only visible through the secret access page.
              </strong>
            </p>
            
            <div style={{ 
              backgroundColor: '#f9f9f9',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '2px solid var(--primary-color)'
            }}>
              <h3>Add New Secret Vehicle</h3>
              <AdminVehicleForm 
                isSecret={true} 
                onSubmitSuccess={() => {
                  // Force refresh of vehicle list
                  const event = new CustomEvent('refreshVehicles', { detail: { isSecret: true } });
                  window.dispatchEvent(event);
                }}
              />
            </div>
            
            <h3>Current Secret Inventory</h3>
            <AdminVehicleList isSecret={true} />
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}