'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import KonamiCode from './KonamiCode';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path) => {
    return pathname === path ? 'active' : '';
  };
  
  return (
    <>
      <KonamiCode />
      <header className="site-header">
        <div className="container header-container">
          <Link href="/" className="logo-link">
            <h1 className="mosley-font site-logo">
              MOSLEY AUTO
            </h1>
          </Link>
          
          <button 
            className="menu-toggle" 
            onClick={toggleMenu}
          >
            ☰
          </button>
          
          <nav className={`main-nav ${isMenuOpen ? 'menu-open' : ''}`}>
            <ul className="nav-list">
              <li>
                <Link href="/" className={isActive('/')}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/inventory" className={isActive('/inventory')}>
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/services" className={isActive('/services')}>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className={isActive('/contact')}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className={isActive('/admin')}>
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <style jsx>{`
        .site-header {
          background-color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1rem 0;
        }
        
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo-link {
          text-decoration: none;
        }
        
        .site-logo {
          margin: 0;
          font-size: 2.5rem;
          letter-spacing: 1px;
        }
        
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        .nav-list {
          display: flex;
          list-style: none;
          gap: 1.5rem;
          margin: 0;
          padding: 0;
        }
        
        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }
          
          .main-nav {
            display: none;
            position: absolute;
            top: 80px;
            left: 0;
            right: 0;
            background-color: white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 100;
          }
          
          .main-nav.menu-open {
            display: block;
          }
          
          .nav-list {
            flex-direction: column;
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}