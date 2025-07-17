'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './hero.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedVehicles from '@/components/FeaturedVehicles';
import ServicesOverview from '@/components/ServicesOverview';

export default function Home() {

  return (
    <main>
      <Header />
      
      <div className="hero-section">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>MOSLEY AUTO</h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>The Best Used Car Dealership in Los Santos!</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/inventory" className="btn btn-primary">
            View Inventory
          </Link>
          <Link href="/services" className="btn">
            Our Services
          </Link>
        </div>
        
      </div>
      
      <div className="container" style={{ marginTop: '2rem' }}>
        <section>
          <h2>Featured Vehicles</h2>
          <FeaturedVehicles />
        </section>
        
        <section style={{ marginTop: '3rem' }}>
          <h2>Our Services</h2>
          <ServicesOverview />
        </section>
        
        <section style={{ marginTop: '3rem', marginBottom: '3rem', textAlign: 'center' }}>
          <h2>Visit Us Today!</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Located at the corner of Carson and Strawberry, opposite the mega mall.
          </p>
          <div style={{
            width: '100%',
            marginTop: '1rem',
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
        </section>
      </div>
      
      <Footer />
    </main>
  );
}