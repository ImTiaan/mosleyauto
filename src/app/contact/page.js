'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'General Inquiry'
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would send the form data to a server
    // For now, we'll just simulate a successful submission
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: true,
        error: true,
        message: 'Please fill out all required fields.'
      });
      return;
    }
    
    // Simulate API delay
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        error: false,
        message: 'Thank you for your message! We\'ll get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: 'General Inquiry'
      });
    }, 1000);
  };
  
  return (
    <main>
      <Header />
      
      <div className="container" style={{ marginTop: '2rem' }}>
        <h1>Contact Us</h1>
        <p style={{ marginBottom: '2rem' }}>Have questions or need assistance? Reach out to us!</p>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div>
            <h2>Visit Our Dealership</h2>
            <p style={{ marginBottom: '1rem' }}>
              We're located at the corner of Carson and Strawberry, opposite the mega mall in Los Santos.
            </p>
            
            <h3>Business Hours</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>Monday - Friday: 9:00 AM - 7:00 PM</li>
              <li style={{ marginBottom: '0.5rem' }}>Saturday: 10:00 AM - 6:00 PM</li>
              <li style={{ marginBottom: '0.5rem' }}>Sunday: Closed</li>
            </ul>
            
            <h3 style={{ marginTop: '1.5rem' }}>Contact Information</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Phone:</strong> (555) 123-4567
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Email:</strong> info@mosleyauto.com
              </li>
            </ul>
            
            <div style={{ 
              width: '100%', 
              height: '300px', 
              backgroundColor: '#ccc', 
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <p>Map Image Will Go Here</p>
            </div>
          </div>
          
          <div>
            <h2>Send Us a Message</h2>
            
            {formStatus.submitted && (
              <div style={{ 
                padding: '1rem', 
                backgroundColor: formStatus.error ? '#ffebee' : '#e8f5e9',
                color: formStatus.error ? '#c62828' : '#2e7d32',
                borderRadius: '4px',
                marginBottom: '1.5rem'
              }}>
                {formStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Email <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Vehicle Purchase">Vehicle Purchase</option>
                  <option value="Service Appointment">Service Appointment</option>
                  <option value="Parts Order">Parts Order</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Message <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    minHeight: '150px',
                    resize: 'vertical'
                  }}
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}