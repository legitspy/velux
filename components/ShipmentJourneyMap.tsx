import React from 'react';
import { Address, ShipmentStatus } from '../types';
import { Icon } from './common/Icon';
import Card from './common/Card';

interface ShipmentJourneyMapProps {
  origin: Address;
  destination: Address;
  status: ShipmentStatus;
  carrier: string;
}

const getStatusIndex = (s: ShipmentStatus): number => {
    const order: ShipmentStatus[] = ['Pending', 'In Transit', 'Out for Delivery', 'Delivered'];
    if (s === 'Pending Delivery') return 0; // treat as pending for progress
    const index = order.indexOf(s);
    return index === -1 ? 0 : index;
};

const getTransitIcon = (carrier: string): string => {
    const lowerCarrier = carrier.toLowerCase();
    if (lowerCarrier.includes('air')) return 'airplane';
    if (lowerCarrier.includes('ocean')) return 'ship';
    return 'truck';
};

const ShipmentJourneyMap: React.FC<ShipmentJourneyMapProps> = ({ origin, destination, status, carrier }) => {
    const progressPercentage = (getStatusIndex(status) / 3) * 100;
    const transitIcon = getTransitIcon(carrier);

    return (
        <Card>
            <div className="p-6">
                <h2 className="text-xl font-bold text-on-surface mb-4">Shipment Journey</h2>
                <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
                    {/* Simplified map background */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-30">
                        {/* Some decorative elements to look like a map */}
                        <div className="absolute top-4 left-1/4 w-1/2 h-px bg-gray-400"></div>
                        <div className="absolute bottom-4 left-1/3 w-1/3 h-px bg-gray-400"></div>
                        <div className="absolute top-1/4 left-8 w-px h-1/2 bg-gray-400"></div>
                        <div className="absolute top-1/3 right-8 w-px h-1/3 bg-gray-400"></div>
                    </div>
                    
                    {/* Journey Path */}
                    <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2">
                        <div className="relative h-1 bg-gray-300 rounded-full">
                            <div 
                                className="absolute top-0 left-0 h-1 bg-brand-primary rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                            
                            {/* Current Location Icon */}
                            <div 
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                                style={{ left: `${progressPercentage}%` }}
                            >
                                <div className="relative">
                                    <Icon name={transitIcon} className="h-6 w-6 text-brand-primary" />
                                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-brand-primary rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Origin Pin */}
                    <div className="absolute top-1/2 left-8 -translate-y-1/2 text-center">
                        <Icon name="building" className="h-6 w-6 text-on-surface mx-auto" />
                    </div>

                    {/* Destination Pin */}
                    <div className="absolute top-1/2 right-8 -translate-y-1/2 text-center">
                        <Icon name="home" className="h-6 w-6 text-on-surface mx-auto" />
                    </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-on-surface-secondary">
                    <p className="font-medium">{origin.city}</p>
                    <p className="font-medium">{destination.city}</p>
                </div>
            </div>
        </Card>
    );
};

export default ShipmentJourneyMap;