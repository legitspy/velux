
import React from 'react';
import { Address, ShipmentStatus } from '../types';
import { Icon } from './common/Icon';
import Card from './common/Card';

interface ShipmentJourneyMapProps {
  origin: Address;
  destination: Address;
  status: ShipmentStatus;
  carrier: string;
  currentLocation?: string; // New prop
  progress?: number; // New prop
}

const getStatusIndex = (s: ShipmentStatus): number => {
    const order: ShipmentStatus[] = ['Pending', 'In Transit', 'Out for Delivery', 'Delivered'];
    if (s === 'Pending Delivery') return 0;
    if (s === 'Exception') return 1; // Default Exception to "In Transit" visual state if no progress provided
    const index = order.indexOf(s);
    return index === -1 ? 0 : index;
};

const getTransitIcon = (carrier: string): string => {
    const lowerCarrier = carrier.toLowerCase();
    if (lowerCarrier.includes('air')) return 'airplane';
    if (lowerCarrier.includes('ocean')) return 'ship';
    return 'truck';
};

const ShipmentJourneyMap: React.FC<ShipmentJourneyMapProps> = ({ origin, destination, status, carrier, currentLocation, progress }) => {
    const calculatedPercentage = (getStatusIndex(status) / 3) * 100;
    const progressPercentage = typeof progress === 'number' ? progress : Math.min(100, Math.max(0, calculatedPercentage));
    const transitIcon = getTransitIcon(carrier);

    // Determine label text
    let statusLabel = 'On Route';
    if (status === 'Delivered') statusLabel = 'Arrived';
    if (currentLocation) statusLabel = currentLocation;

    return (
        <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-black/5">
            <div className="relative h-80 w-full bg-[#eef2f6]">
                {/* Map Background SVG */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                     <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                             <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    
                    {/* Base Terrain */}
                    <rect width="100%" height="100%" fill="#f3f4f6" />
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Water Bodies */}
                    <path d="M0,150 Q200,200 400,150 T800,200 V320 H0 Z" fill="#bfdbfe" opacity="0.5"/>
                    <path d="M800,0 Q700,100 900,150 T1200,50 V0 Z" fill="#bfdbfe" opacity="0.5"/>

                    {/* Green Zones / Parks */}
                    <path d="M100,50 Q150,20 200,50 T250,100 Q200,130 100,50 Z" fill="#dcfce7" opacity="0.6"/>
                    <path d="M600,250 Q650,220 700,250 T650,280 Z" fill="#dcfce7" opacity="0.6"/>
                    <circle cx="900" cy="250" r="60" fill="#dcfce7" opacity="0.6" />

                    {/* City Zones (Blobs) */}
                    <circle cx="100" cy="160" r="40" fill="#e5e7eb" opacity="0.8" />
                    <circle cx="90%" cy="160" r="40" fill="#e5e7eb" opacity="0.8" />

                    {/* Road Network (Background Roads) */}
                    <g stroke="white" strokeWidth="4" fill="none" opacity="0.7">
                         <path d="M50,0 V320" />
                         <path d="M250,0 V320" />
                         <path d="M450,0 V320" />
                         <path d="M650,0 V320" />
                         <path d="M850,0 V320" />
                         <path d="M0,80 H1200" />
                         <path d="M0,240 H1200" />
                    </g>

                    {/* Major Highways */}
                    <g stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="shadow-sm">
                        <path d="M0,160 C300,140 600,180 1200,160" />
                    </g>
                    <g stroke="#fcd34d" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M0,160 C300,140 600,180 1200,160" />
                    </g>
                </svg>

                {/* Map UI Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/5 to-transparent h-24"></div>

                {/* Active Route Layer */}
                <div className="absolute top-0 bottom-0 left-[10%] right-[10%] flex items-center">
                    {/* Route Container */}
                    <div className="relative w-full h-full flex items-center">
                         {/* Background Track */}
                        <div className="absolute w-full h-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 shadow-sm"></div>
                        
                        {/* Progress Track */}
                        <div 
                            className="absolute h-3 bg-brand-primary rounded-l-full shadow-[0_0_12px_rgba(79,70,229,0.5)] transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>

                         {/* Origin Pin */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                            <div className="w-5 h-5 bg-white border-4 border-gray-500 rounded-full shadow-lg ring-1 ring-black/10"></div>
                            <div className="mt-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded shadow-md border border-gray-200 text-[10px] font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">
                                {origin.city}
                            </div>
                        </div>

                        {/* Destination Pin */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 flex flex-col items-center">
                             <div className="w-6 h-6 bg-white border-4 border-brand-secondary rounded-full shadow-lg ring-1 ring-black/10 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-brand-secondary rounded-full"></div>
                            </div>
                             <div className="mt-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded shadow-md border border-gray-200 text-[10px] font-bold text-gray-800 uppercase tracking-wide whitespace-nowrap">
                                {destination.city}
                            </div>
                        </div>

                        {/* Vehicle Marker */}
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ease-out"
                            style={{ left: `${progressPercentage}%` }}
                        >
                            <div className="relative -translate-x-1/2 -translate-y-1/2">
                                {/* Radar Ping */}
                                {status !== 'Delivered' && <div className="absolute inset-0 bg-brand-primary/40 rounded-full animate-ping w-12 h-12 -m-3"></div>}
                                
                                {/* Truck Icon Circle */}
                                <div className={`relative w-10 h-10 ${status === 'Exception' ? 'bg-error' : 'bg-brand-primary'} rounded-full shadow-xl border-2 border-white flex items-center justify-center transform transition hover:scale-110`}>
                                    <Icon name={status === 'Exception' ? 'exclamationTriangle' : transitIcon} className="h-5 w-5 text-white" />
                                </div>

                                {/* Dynamic Label */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-white text-xs font-semibold rounded-full shadow-lg whitespace-nowrap flex items-center gap-2">
                                    <span>{statusLabel}</span>
                                    {status !== 'Delivered' && status !== 'Exception' && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>}
                                    {status === 'Exception' && <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Map Legend / Footer */}
            <div className="bg-white px-4 py-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <div className="flex gap-6">
                     <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${status === 'Exception' ? 'bg-error' : 'bg-brand-primary'}`}></div>
                        <span className="font-medium">Vehicle Location</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-8 h-1.5 bg-brand-primary rounded-full"></div>
                        <span className="font-medium">Route Traveled</span>
                    </div>
                </div>
                <div className="font-mono text-[10px] text-gray-400 uppercase tracking-wider">Live Satellite View</div>
            </div>
        </Card>
    );
};

export default ShipmentJourneyMap;
