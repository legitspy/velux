import React, { useState } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import { Icon } from './common/Icon';

interface HomePageProps {
  onTrackShipment: (trackingId: string) => void;
  isLoading: boolean;
  error: string | null;
  onNavigateToCreateLabel: () => void;
}

const HeroIllustration = () => (
    <svg viewBox="0 0 512 340" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <defs>
            <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#60A5FA', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#4F46E5', stopOpacity: 1}} />
            </linearGradient>
        </defs>
        <circle cx="256" cy="170" r="150" fill="url(#globeGradient)" opacity="0.2"/>
        <circle cx="256" cy="170" r="150" fill="none" stroke="#4F46E5" strokeWidth="2" opacity="0.3"/>
        <path d="M256 70 C 220 100, 210 150, 230 180 C 200 200, 210 250, 260 270 C 300 260, 310 200, 290 170 C 320 150, 310 100, 256 70 Z" fill="#4F46E5" opacity="0.1"/>
        <path d="M180 120 C 160 140, 150 180, 180 220 C 190 200, 210 180, 200 150 C 190 130, 180 120, 180 120 Z" fill="#4F46E5" opacity="0.1"/>
        <path d="M160 150 C 256 50, 350 150, 400 220" stroke="#F59E0B" strokeWidth="3" fill="none" strokeDasharray="8 8" />
        <g transform="translate(130 110) rotate(-15)">
          <rect x="0" y="0" width="80" height="50" rx="5" fill="#F59E0B" />
          <rect x="0" y="0" width="80" height="50" rx="5" stroke="#D97706" strokeWidth="2" fill="none"/>
          <line x1="0" y1="25" x2="80" y2="25" stroke="#D97706" strokeWidth="2" />
          <line x1="40" y1="0" x2="40" y2="50" stroke="#D97706" strokeWidth="2" />
        </g>
        <g transform="translate(390 215) rotate(30)">
            <path d="M2,15.25 L2,12.25 L18,5.25 L18,8.25 L2,15.25 Z M20,8.25 L22,7.75 L22,5.75 L20,6.25 L20,8.25 Z M2,16.75 L18,23.75 L18,20.75 L2,13.75 L2,16.75 Z" fill="#4F46E5"/>
        </g>
    </svg>
);

const HowItWorksIllustration = () => (
    <svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <g transform="translate(20, 30)">
            <rect x="0" y="0" width="80" height="50" fill="#FFF" stroke="#CBD5E1" rx="4"/>
            <line x1="10" y1="10" x2="40" y2="10" stroke="#E5E7EB" strokeWidth="2"/>
            <line x1="10" y1="18" x2="70" y2="18" stroke="#E5E7EB" strokeWidth="2"/>
            <line x1="10" y1="26" x2="60" y2="26" stroke="#E5E7EB" strokeWidth="2"/>
            <rect x="45" y="35" width="25" height="10" fill="#1F2937"/>
        </g>
        <path d="M110 55 C 130 55, 130 55, 150 55" stroke="#CBD5E1" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
        <path d="M145 50 L 150 55 L 145 60" stroke="#CBD5E1" strokeWidth="2" fill="none"/>
        <g transform="translate(160, 20)">
            <path d="M0 20 L30 0 L90 0 L60 20 Z" fill="#FBBF24"/>
            <path d="M0 20 L0 70 L60 90 L60 20 Z" fill="#F59E0B"/>
            <path d="M60 20 L90 0 L90 50 L60 70 Z" fill="#D97706"/>
        </g>
        <path d="M260 55 C 280 55, 280 55, 300 55" stroke="#CBD5E1" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
        <path d="M295 50 L 300 55 L 295 60" stroke="#CBD5E1" strokeWidth="2" fill="none"/>
        <g transform="translate(310, 35)">
            <path d="M3,30 a1.5,1.5 0 0,1-3,0 a1.5,1.5 0 0,1 3,0zm12,0 a1.5,1.5 0 0,1-3,0 a1.5,1.5 0 0,1 3,0z M1 25 V 10 h 20 v 15 z M 21 25 h 5 l 4 -5 v -5 l -4 -5 h -5 z M1 10 L5 0 h 10 l 4 10" stroke="#4F46E5" strokeWidth="2" fill="none" transform="scale(1.3)"/>
        </g>
    </svg>
);


const Feature: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="text-center p-4">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-primary/10 mx-auto mb-4">
        <Icon name={icon} className="h-8 w-8 text-brand-primary" />
    </div>
    <h3 className="text-lg font-bold text-on-surface mb-2">{title}</h3>
    <p className="text-on-surface-secondary text-sm">{children}</p>
  </div>
);

const Step: React.FC<{ number: string; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-brand-secondary/10 text-brand-secondary-dark font-bold text-xl">
            {number}
        </div>
        <div>
            <h4 className="font-bold text-on-surface">{title}</h4>
            <p className="text-on-surface-secondary mt-1 text-sm">{children}</p>
        </div>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onTrackShipment, isLoading, error, onNavigateToCreateLabel }) => {
  const [trackingId, setTrackingId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      onTrackShipment(trackingId.trim());
    }
  };

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-8 items-center pt-8">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface leading-tight">
            Fast, Reliable, <span className="text-brand-primary">Global Shipping</span>
          </h1>
          <p className="text-lg text-on-surface-secondary">
            Your trusted partner for seamless shipping solutions, from local deliveries to international freight. Track your package instantly.
          </p>
          <Card className="p-4 mt-6 !bg-surface/80 backdrop-blur-sm shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your tracking ID"
                className="flex-grow !p-3 text-base !bg-white !text-on-surface !border-gray-300"
                aria-label="Tracking ID"
              />
              <Button type="submit" variant="primary" isLoading={isLoading} className="w-full sm:w-auto px-6 !py-3 text-base">
                Track Package
              </Button>
            </form>
            {error && <p className="mt-2 text-sm text-error text-center sm:text-left">{error}</p>}
          </Card>
        </div>
        <div className="hidden md:block">
          <HeroIllustration />
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-on-surface">Why Ship With VeluXpress?</h2>
            <p className="mt-2 text-on-surface-secondary max-w-2xl mx-auto">We combine cutting-edge technology with a commitment to reliability and customer service.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Feature icon="globe" title="Global Logistics">Effortlessly ship across borders with our robust international network.</Feature>
            <Feature icon="location" title="Real-Time Tracking">Stay updated from pickup to delivery with pin-point accurate tracking.</Feature>
            <Feature icon="shieldCheck" title="Secure & Insured">Your packages are protected with our security protocols and insurance options.</Feature>
            <Feature icon="truck" title="Business Solutions">Tailored logistics solutions for e-commerce and businesses of all sizes.</Feature>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center bg-gray-50 p-8 rounded-xl">
        <div>
            <h2 className="text-3xl font-bold text-on-surface mb-8">Get Started in 3 Simple Steps</h2>
            <div className="space-y-8">
                <Step number="1" title="Create Your Label">Quickly generate a shipping label with our easy-to-use online form.</Step>
                <Step number="2" title="Pack & Ship Your Item">Securely package your item and drop it off at a nearby location or schedule a pickup.</Step>
                <Step number="3" title="Track Your Package">Follow your shipment's journey in real-time until it reaches its destination.</Step>
            </div>
        </div>
        <div className="hidden md:flex items-center justify-center p-8">
            <HowItWorksIllustration />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-primary text-white text-center rounded-xl p-10 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Ship?</h2>
          <p className="max-w-xl mx-auto mb-6">
              Generate a shipping label in minutes and get your package on its way with VeluXpress.
          </p>
          <Button 
              onClick={onNavigateToCreateLabel} 
              variant="secondary" 
              className="text-lg py-3 px-8"
          >
              Create a Shipping Label
          </Button>
      </section>
    </div>
  );
};

export default HomePage;