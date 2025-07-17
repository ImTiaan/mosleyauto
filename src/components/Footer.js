import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{
      backgroundColor: '#333',
      color: 'white',
      padding: '2rem 0',
      marginTop: '2rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
        }}>
          <div>
            <h3 className="mosley-font" style={{ color: 'white' }}>MOSLEY AUTO</h3>
            <p>The best used car dealership and repair shop in Los Santos.</p>
            <p style={{ marginTop: '1rem' }}>
              Corner of Carson and Strawberry,<br />
              Opposite the mega mall<br />
              Los Santos
            </p>
          </div>
          
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/" style={{ color: 'white' }}>Home</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/inventory" style={{ color: 'white' }}>Inventory</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/services" style={{ color: 'white' }}>Services</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/contact" style={{ color: 'white' }}>Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>Car Tow: $800</li>
              <li style={{ marginBottom: '0.5rem' }}>Repairs in Store: $500</li>
              <li style={{ marginBottom: '0.5rem' }}>Mobile Repairs: $700</li>
              <li style={{ marginBottom: '0.5rem' }}>Tyre Replacement: $250</li>
              <li style={{ marginBottom: '0.5rem' }}>Ignition Replacement: $1500</li>
              <li style={{ marginBottom: '0.5rem' }}>Spray Paint Car: $750</li>
            </ul>
          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '2rem',
          paddingTop: '1rem',
          textAlign: 'center',
        }}>
          <p>&copy; {currentYear} Mosley Auto. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
            This website is best viewed with Internet Explorer 6.0 or Netscape Navigator.
          </p>
        </div>
      </div>
    </footer>
  );
}