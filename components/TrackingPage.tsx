
import React from 'react';
import { Shipment, ScanEvent, ShipmentStatus, Address } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { Icon } from './common/Icon';
import ShipmentJourneyMap from './ShipmentJourneyMap';

interface TrackingPageProps {
  shipment: Shipment;
  onBack: () => void;
}

const statusStyles: { [key in ShipmentStatus]: { text: string; color: string; icon: string; } } = {
  'Delivered': { text: 'Delivered', color: 'text-success', icon: 'checkCircle' },
  'In Transit': { text: 'In Transit', color: 'text-blue-500', icon: 'truck' },
  'Out for Delivery': { text: 'Out for Delivery', color: 'text-amber-500', icon: 'truck' },
  'Pending': { text: 'Pending', color: 'text-gray-500', icon: 'package' },
  'Pending Delivery': { text: 'Pending Delivery', color: 'text-gray-500', icon: 'package' },
  'Exception': { text: 'Exception', color: 'text-error', icon: 'exclamationTriangle' },
};

const TimelineItem: React.FC<{ event: ScanEvent; isLast: boolean }> = ({ event, isLast }) => {
  const eventDate = new Date(event.timestamp);
  const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Toronto' });
  const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/Toronto' });
  
  // Safe fallback for status style
  const statusStyle = statusStyles[event.status] || statusStyles['In Transit'];
  const { icon, color } = statusStyle;

  return (
    <li className="relative flex gap-x-4">
      <div className={`absolute left-0 top-0 flex w-6 justify-center ${isLast ? '' : '-bottom-6'}`}>
        <div className="w-px bg-gray-200"></div>
      </div>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
        <div className={`h-1.5 w-1.5 rounded-full ring-1 ${isLast ? 'bg-brand-primary ring-brand-primary' : 'bg-gray-100 ring-gray-300'}`}></div>
      </div>
      <div className="flex-auto pb-6">
        <div className="flex items-center gap-x-2">
            <Icon name={icon} className={`h-5 w-5 ${color}`} />
            <p className="flex-auto font-semibold text-on-surface">{event.description}</p>
        </div>
        <p className="mt-1 text-sm text-on-surface-secondary">{event.location}</p>
        <time dateTime={event.timestamp} className="flex-none text-xs text-on-surface-secondary mt-1">
          {formattedDate}, {formattedTime}
        </time>
      </div>
    </li>
  );
};

const AddressDetail: React.FC<{ title: string; address: Address }> = ({ title, address }) => (
  <div>
    <h3 className="text-sm font-semibold text-on-surface-secondary uppercase tracking-wider">{title}</h3>
    <div className="mt-1 text-on-surface text-sm">
      <p className="font-medium">{address.name}</p>
      {address.company && <p>{address.company}</p>}
      <p>{address.street}</p>
      <p>{address.city}, {address.state} {address.postalCode}</p>
      <p>{address.country}</p>
    </div>
  </div>
);

const LiveStatusCard: React.FC<{ data: NonNullable<Shipment['simulationData']> }> = ({ data }) => (
    <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Icon name="truck" className="w-48 h-48" />
        </div>
        <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                    <h2 className="text-lg font-bold uppercase tracking-wider">Live Tracking Feed</h2>
                </div>
                <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-gray-300">{data.timestamp}</span>
            </div>
            
            <div className="mb-6">
                 <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Latest Status</p>
                 <p className="text-xl md:text-2xl font-light italic">"{data.statusUpdate}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/10 pt-4">
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Current Location</p>
                    <p className="font-semibold text-lg">{data.currentLocation}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Next Stop</p>
                    <p className="font-semibold text-lg">{data.nextLocation}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Distance Remaining</p>
                    <p className="font-semibold text-lg text-green-400">{data.distanceRemaining}</p>
                </div>
            </div>
        </div>
    </Card>
);

const TrackingPage: React.FC<TrackingPageProps> = ({ shipment, onBack }) => {
  const { status, trackingId, origin, destination, estimatedDelivery, scanHistory, simulationData } = shipment;
  const currentStatusInfo = statusStyles[status] || statusStyles['In Transit'];
  const sortedHistory = [...scanHistory].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Determine current location name for map
  let mapLocation = simulationData?.currentLocation;
  if (!mapLocation && sortedHistory.length > 0) {
      const loc = sortedHistory[0].location;
      mapLocation = loc.split(',')[0]; // Extract city from "City, State"
  }

  // Determine progress override
  let mapProgress = undefined;
  if (trackingId === 'VE-581403056') {
      mapProgress = 60; // Cambridge is approx 60% of way
  } else if (status === 'Exception') {
      mapProgress = 50; // Default exception to middle
  }

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost" className="!p-0">
        <Icon name="arrowLeft" className="h-5 w-5 mr-2" />
        Home
      </Button>

      {simulationData && (
          <LiveStatusCard data={simulationData} />
      )}

      <Card>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <p className="text-sm text-on-surface-secondary">Tracking ID</p>
              <h1 className="text-2xl font-bold text-on-surface break-all">{trackingId}</h1>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-md ${currentStatusInfo.color.replace('text-', 'bg-')}/10`}>
              <Icon name={currentStatusInfo.icon} className={`h-6 w-6 ${currentStatusInfo.color}`} />
              <span className={`font-semibold ${currentStatusInfo.color}`}>{currentStatusInfo.text}</span>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm text-on-surface-secondary">Estimated Delivery</p>
            <p className="font-semibold text-on-surface">
              {new Date(estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Toronto' })}
              {simulationData && ` at ${new Date(estimatedDelivery).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', timeZone: 'America/Toronto', timeZoneName: 'short'})}`}
            </p>
          </div>
        </div>
      </Card>

      <ShipmentJourneyMap 
        origin={origin} 
        destination={destination} 
        status={status} 
        carrier={shipment.carrier}
        currentLocation={mapLocation}
        progress={mapProgress}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-on-surface">Shipment History</h2>
              <ul className="mt-4">
                {sortedHistory.map((event, index) => (
                  <TimelineItem key={index} event={event} isLast={index === 0} />
                ))}
              </ul>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
             <div className="p-6">
                <h2 className="text-xl font-bold text-on-surface mb-4">Shipment Details</h2>
                <div className="space-y-6">
                    <AddressDetail title="Origin" address={origin} />
                    <AddressDetail title="Destination" address={destination} />
                    <div>
                        <h3 className="text-sm font-semibold text-on-surface-secondary uppercase tracking-wider">Additional Info</h3>
                         <dl className="mt-1 text-on-surface text-sm space-y-1">
                            <div className="flex justify-between">
                                <dt>Carrier:</dt>
                                <dd className="font-medium text-right">{shipment.carrier}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Service:</dt>
                                <dd className="font-medium text-right">{shipment.service}</dd>
                            </div>
                             <div className="flex justify-between">
                                <dt>Weight:</dt>
                                <dd className="font-medium text-right">{shipment.weight} kg</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Dimensions:</dt>
                                <dd className="font-medium text-right">{shipment.dimensions}</dd>
                            </div>
                         </dl>
                    </div>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
