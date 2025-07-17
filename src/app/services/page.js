'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Services data
const services = [
  {
    id: 'repairs',
    name: 'Repairs',
    price: 500,
    description: 'Full service repairs at our shop. We\'ll fix any issue with your vehicle, from minor dents to major mechanical problems. Our experienced mechanics use only the best tools and parts to ensure your vehicle runs smoothly.',
    icon: '🔧',
    features: [
      'Experienced mechanics',
      'Quality parts',
      'Comprehensive diagnostics',
      'Fair pricing',
      'Quick turnaround'
    ]
  },
  {
    id: 'tow',
    name: 'Towing',
    price: 800,
    description: 'Stuck somewhere? We\'ll tow your vehicle to our shop or any location in Los Santos. Our tow service is available 24/7 and covers the entire city. We pride ourselves on quick response times and professional service.',
    icon: '🚚',
    features: [
      'Available 24/7',
      'City-wide service',
      'Fast response times',
      'Professional drivers',
      'Secure vehicle transport'
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile Repairs',
    price: 700,
    description: 'Can\'t make it to our shop? We\'ll come to you and fix your vehicle on the spot. Our mobile repair service brings the expertise of our mechanics right to your location, saving you time and hassle.',
    icon: '🚗',
    features: [
      'On-site repairs',
      'Convenient scheduling',
      'Same quality as in-shop repairs',
      'Fully equipped mobile units',
      'Service at home or work'
    ]
  },
  {
    id: 'tyre',
    name: 'Tyre Replacement',
    price: 250,
    description: 'Get new tyres installed quickly and at a competitive price. We carry a wide selection of tyres for all types of vehicles, from economy to high-performance options. Our technicians will help you choose the right tyres for your driving needs.',
    icon: '🛞',
    features: [
      'Wide selection of brands',
      'Expert installation',
      'Wheel balancing included',
      'Proper disposal of old tyres',
      'Competitive pricing'
    ]
  },
  {
    id: 'ignition',
    name: 'Ignition Replacement',
    price: 1500,
    description: 'Having trouble starting your vehicle? We\'ll replace your ignition system with a new one. Our ignition replacement service includes a thorough inspection of your vehicle\'s electrical system to ensure everything works properly.',
    icon: '🔑',
    features: [
      'Quality replacement parts',
      'Expert installation',
      'Electrical system check',
      'Key programming',
      'Warranty on parts and labor'
    ]
  },
  {
    id: 'paint',
    name: 'Spray Job',
    price: 750,
    description: 'Give your vehicle a fresh new look with our professional paint service. Choose from a wide range of colors and finishes to customize your ride. Our paint jobs are durable and look great, helping your vehicle stand out on the streets of Los Santos.',
    icon: '🎨',
    features: [
      'Wide color selection',
      'Professional application',
      'Durable finish',
      'Custom designs available',
      'Quick turnaround'
    ]
  }
];

export default function Services() {
  return (
    <main>
      <Header />
      
      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <h1>Our Services</h1>
          <p>Quality automotive services at competitive prices.</p>
        </div>
        
        <div style={{ marginBottom: '3rem' }}>
          {services.map((service, index) => (
            <div 
              key={service.id} 
              style={{ 
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                padding: '2rem',
                marginBottom: '2rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ 
                  fontSize: '3rem',
                  backgroundColor: 'var(--accent-color)',
                  color: 'white',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {service.icon}
                </div>
                
                <div>
                  <h2 style={{ margin: 0 }}>{service.name}</h2>
                  <p style={{ 
                    color: 'var(--primary-color)', 
                    fontWeight: 'bold', 
                    fontSize: '1.5rem',
                    margin: '0.5rem 0'
                  }}>
                    ${service.price}
                  </p>
                </div>
              </div>
              
              <p>{service.description}</p>
              
              <div>
                <h3>Features:</h3>
                <ul style={{ 
                  listStyle: 'none',
                  padding: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.5rem'
                }}>
                  {service.features.map((feature, i) => (
                    <li key={i} style={{ 
                      padding: '0.5rem',
                      backgroundColor: 'rgba(0, 102, 204, 0.1)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ color: 'var(--accent-color)' }}>✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}