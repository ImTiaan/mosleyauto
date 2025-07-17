'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Contact() {
  
  return (
    <main>
      <Header />
      
      <div className="container" style={{ marginTop: '2rem' }}>
        <h1>Contact Us</h1>
        <p style={{ marginBottom: '2rem' }}>Have questions or need assistance? Reach out to us!</p>
        
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          marginBottom: '3rem'
        }}>
          <div>
            <h2>Visit Our Dealership</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              We're located at the corner of Carson and Strawberry, opposite the mega mall in Los Santos.
            </p>
            
            <h3 style={{ marginTop: '1.5rem' }}>Contact Information</h3>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Main Phone:</strong> 555 - 8791
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <strong>Mobile Repairs & Towing:</strong>
                <div style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <div>554 - 4749</div>
                  <div>555 - 3641</div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                    (One of our two mechanics will be on duty)
                  </div>
                </div>
              </li>
            </ul>
            
            <div style={{
              width: '100%',
              marginTop: '1.5rem',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <img
                src="/images/General/mosley_map.png"
                alt="Mosley Auto Location Map"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px'
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}