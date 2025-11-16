import React from 'react';
import Button from './common/Button';
import { Icon } from './common/Icon';
import Logo from './common/Logo';

interface AboutPageProps {
  onNavigateToCreateLabel: () => void;
  onNavigateToHome: () => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg h-full">
        <div className="bg-brand-primary/10 p-3 rounded-full mb-4">
            <Icon name={icon} className="h-8 w-8 text-brand-primary" />
        </div>
        <h3 className="text-lg font-bold text-on-surface mb-2">{title}</h3>
        <p className="text-on-surface-secondary text-sm">{children}</p>
    </div>
);


const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToCreateLabel, onNavigateToHome }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
            {/* Hero Section */}
            <section className="text-center p-8 bg-surface rounded-xl shadow-md">
                <Logo className="justify-center text-4xl mb-4" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4">
                    Connecting Your World,<br/> One Shipment at a Time.
                </h1>
                <p className="text-lg text-on-surface-secondary max-w-2xl mx-auto">
                    At VeluXpress, we're more than just a logistics company. We are your dedicated partner in global commerce, committed to providing seamless, reliable, and intelligent shipping solutions that empower your business and connect you to what matters most.
                </p>
            </section>

            {/* Why Choose Us Section */}
            <section>
                <h2 className="text-3xl font-bold text-center text-on-surface mb-8">Why Choose VeluXpress?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard icon="globe" title="Global Reach">
                        Our extensive network spans across continents, ensuring your packages reach their destination, no matter how remote.
                    </FeatureCard>
                    <FeatureCard icon="chip" title="Cutting-Edge Technology">
                        Experience unparalleled transparency with our real-time tracking, automated label generation, and streamlined digital services.
                    </FeatureCard>
                    <FeatureCard icon="heart" title="Customer-Centric Support">
                        Our dedicated support team is available around the clock to assist you, ensuring a smooth and hassle-free shipping experience.
                    </FeatureCard>
                    <FeatureCard icon="shieldCheck" title="Security & Reliability">
                        We treat every package with the utmost care. Our commitment to security and on-time delivery is the cornerstone of our service.
                    </FeatureCard>
                </div>
            </section>
            
            {/* Call to Action Section */}
            <section className="bg-brand-primary text-white text-center rounded-xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold mb-4">Ready to Ship with Confidence?</h2>
                <p className="max-w-xl mx-auto mb-6">
                    Join thousands of satisfied customers who trust VeluXpress for their shipping needs. Get started today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button 
                        onClick={onNavigateToCreateLabel} 
                        variant="secondary" 
                        className="w-full sm:w-auto text-lg py-3 px-8"
                    >
                        Create a Label
                    </Button>
                    <Button 
                        onClick={onNavigateToHome} 
                        variant="ghost"
                        className="w-full sm:w-auto text-lg py-3 px-8 bg-white/10 hover:bg-white/20 text-white"
                    >
                        Track a Shipment
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;