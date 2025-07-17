import Link from 'next/link';

// Services data
const services = [
  {
    id: 'tow',
    name: 'Car Tow',
    price: 800,
    description: 'Stuck somewhere? We\'ll tow your vehicle to our shop or any location in Los Santos.',
    icon: '🚚'
  },
  {
    id: 'repairs',
    name: 'Repairs in Store',
    price: 500,
    description: 'Full service repairs at our shop. We\'ll fix any issue with your vehicle.',
    icon: '🔧'
  },
  {
    id: 'mobile',
    name: 'Mobile Repairs',
    price: 700,
    description: 'Can\'t make it to our shop? We\'ll come to you and fix your vehicle on the spot.',
    icon: '🚗'
  },
  {
    id: 'tyre',
    name: 'Tyre Replacement',
    price: 250,
    description: 'Get new tyres installed quickly and at a competitive price.',
    icon: '🛞'
  },
  {
    id: 'ignition',
    name: 'Ignition Replacement',
    price: 1500,
    description: 'Having trouble starting your vehicle? We\'ll replace your ignition system.',
    icon: '🔑'
  },
  {
    id: 'paint',
    name: 'Spray Paint Car',
    price: 750,
    description: 'Give your vehicle a fresh new look with our professional paint service.',
    icon: '🎨'
  }
];

export default function ServicesOverview() {
  // Display only the first 3 services on the home page
  const featuredServices = services.slice(0, 3);
  
  return (
    <div>
      <div className="grid">
        {featuredServices.map((service) => (
          <div key={service.id} className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {service.icon}
            </div>
            <h3>{service.name}</h3>
            <p style={{ 
              color: 'var(--primary-color)', 
              fontWeight: 'bold', 
              fontSize: '1.5rem',
              margin: '0.5rem 0'
            }}>
              ${service.price}
            </p>
            <p style={{ marginBottom: '1.5rem' }}>{service.description}</p>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link href="/services" className="btn btn-primary">
          View All Services
        </Link>
      </div>
    </div>
  );
}