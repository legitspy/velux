import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import HomePage from './components/Dashboard';
import TrackingPage from './components/TrackingPage';
import { Shipment } from './types';
import { getShipmentByTrackingId } from './services/shippingService';
import CreateLabelPage from './components/CreateLabelPage';
import AboutPage from './components/AboutPage';
import Logo from './components/common/Logo';

type Page = 'home' | 'tracking' | 'create-label' | 'about';

const Footer: React.FC<{
    onNavigateToHome: () => void;
    onNavigateToCreateLabel: () => void;
    onNavigateToAbout: () => void;
}> = ({ onNavigateToHome, onNavigateToCreateLabel, onNavigateToAbout }) => {
    return (
        <footer className="bg-surface border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex justify-center md:order-1">
                        <Logo />
                    </div>
                    <nav className="mt-4 md:mt-0 md:order-2 flex justify-center space-x-6 text-sm font-medium text-on-surface-secondary">
                        <button onClick={onNavigateToHome} className="hover:text-brand-primary transition-colors">Track</button>
                        <button onClick={onNavigateToCreateLabel} className="hover:text-brand-primary transition-colors">Create Label</button>
                        <button onClick={onNavigateToAbout} className="hover:text-brand-primary transition-colors">About Us</button>
                    </nav>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-on-surface-secondary">
                    <p>&copy; {new Date().getFullYear()} VeluXpress. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentShipment, setCurrentShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrackShipment = useCallback(async (trackingId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const shipment = await getShipmentByTrackingId(trackingId);
      if (shipment) {
        setCurrentShipment(shipment);
        setCurrentPage('tracking');
      } else {
        setError(`Shipment with tracking ID "${trackingId}" not found.`);
        setCurrentShipment(null);
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching shipment data.');
      setCurrentShipment(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const navigateToHome = useCallback(() => {
    setCurrentPage('home');
    setCurrentShipment(null);
    setError(null);
  }, []);
  
  const navigateToCreateLabel = useCallback(() => {
    setCurrentPage('create-label');
    setCurrentShipment(null);
    setError(null);
  }, []);

  const navigateToAbout = useCallback(() => {
    setCurrentPage('about');
    setCurrentShipment(null);
    setError(null);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onTrackShipment={handleTrackShipment}
            isLoading={isLoading}
            error={error}
            onNavigateToCreateLabel={navigateToCreateLabel}
          />
        );
      case 'tracking':
        if (currentShipment) {
          return (
            <TrackingPage
              shipment={currentShipment}
              onBack={navigateToHome}
            />
          );
        }
        // Fallback to home if no shipment is selected
        navigateToHome();
        return null;
      case 'create-label':
        return <CreateLabelPage onLabelCreated={(shipment) => {
          setCurrentShipment(shipment);
          setCurrentPage('tracking');
        }} />;
      case 'about':
        return <AboutPage onNavigateToCreateLabel={navigateToCreateLabel} onNavigateToHome={navigateToHome} />;
      default:
        return (
           <HomePage
            onTrackShipment={handleTrackShipment}
            isLoading={isLoading}
            error={error}
            onNavigateToCreateLabel={navigateToCreateLabel}
          />
        );
    }
  };

  return (
    <div className="min-h-screen font-sans text-on-surface antialiased flex flex-col">
      <Header 
        onLogoClick={navigateToHome} 
        onNavigateToHome={navigateToHome}
        onNavigateToCreateLabel={navigateToCreateLabel}
        onNavigateToAbout={navigateToAbout}
        currentPage={currentPage}
      />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      <Footer 
        onNavigateToHome={navigateToHome}
        onNavigateToCreateLabel={navigateToCreateLabel}
        onNavigateToAbout={navigateToAbout}
      />
    </div>
  );
};

export default App;