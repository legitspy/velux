
import { Shipment, ShipmentStatus, Address, ScanEvent, SimulationData } from '../types';

const mockShipments = new Map<string, Shipment>([
  ['VE-123456789', {
    trackingId: 'VE-123456789',
    status: 'In Transit',
    origin: { name: 'Sender Inc.', street: '123 Main St', city: 'New York', state: 'NY', postalCode: '10001', country: 'USA' },
    destination: { name: 'Receiver Co.', street: '456 Baker St', city: 'London', state: '', postalCode: 'W1U 8ED', country: 'UK' },
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    carrier: 'VeluXpress Air',
    weight: 2.5,
    dimensions: '12x8x4 in',
    service: 'International Priority',
    scanHistory: [
      { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), location: 'New York, NY', status: 'Pending', description: 'Shipment information received' },
      { timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), location: 'JFK International Airport, NY', status: 'In Transit', description: 'Departed from origin facility' },
      { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), location: 'Heathrow Airport, London', status: 'In Transit', description: 'Arrived at destination airport' },
      { timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(), location: 'London Distribution Center', status: 'In Transit', description: 'Customs clearance complete' },
    ],
  }],
  ['VE-987654321', {
    trackingId: 'VE-987654321',
    status: 'Delivered',
    origin: { name: 'Sakura Goods', street: '7-1, Nishi-Shinjuku 2-chome', city: 'Tokyo', state: '', postalCode: '163-8001', country: 'Japan' },
    destination: { name: 'John Smith', street: '1 Infinite Loop', city: 'San Francisco', state: 'CA', postalCode: '94107', country: 'USA' },
    estimatedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    carrier: 'VeluXpress Ocean',
    weight: 15.0,
    dimensions: '24x24x18 in',
    service: 'Standard Freight',
    scanHistory: [
       { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), location: 'Tokyo Port, Japan', status: 'In Transit', description: 'Departed from Port' },
       { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), location: 'Oakland Port, CA', status: 'In Transit', description: 'Arrived at Port' },
       { timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), location: 'San Francisco, CA', status: 'Out for Delivery', description: 'Out for delivery' },
       { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), location: 'San Francisco, CA', status: 'Delivered', description: 'Delivered to recipient' },
    ],
  }],
  ['VE-555555555', {
    trackingId: 'VE-555555555',
    status: 'Out for Delivery',
    origin: { name: 'Klaus GmbH', street: 'Unter den Linden 77', city: 'Berlin', state: '', postalCode: '10117', country: 'Germany' },
    destination: { name: 'Pierre Martin', street: '99 Rue de Rivoli', city: 'Paris', state: '', postalCode: '75001', country: 'France' },
    estimatedDelivery: new Date().toISOString(),
    carrier: 'VeluXpress Ground',
    weight: 0.8,
    dimensions: '6x4x2 in',
    service: 'Next Day Ground',
    scanHistory: [
      { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), location: 'Berlin, Germany', status: 'Pending', description: 'Picked up by courier' },
      { timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(), location: 'Paris, France', status: 'In Transit', description: 'Arrived at local facility' },
      { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), location: 'Paris, France', status: 'Out for Delivery', description: 'On vehicle for delivery' },
    ],
  }],
]);

const normalizeTrackingId = (trackingId: string): string => {
    const sanitized = trackingId.replace(/[^a-zA-Z0-9]/g, '');
    const prefix = sanitized.substring(0, 2).toUpperCase();
    const number = sanitized.substring(2);
    return `${prefix}-${number}`;
};

// Simulation Data for Constance Beausoliel
const CONSTANCE_ID = 'VE-581403056';

const generateConstanceShipment = (): Shipment => {
  const now = new Date();
  let year = now.getFullYear();
  // Adjust year if current date is before October to assume these events happened last year
  if (now.getMonth() < 9) { 
      year -= 1;
  }

  // Helper to create ISO string for specific Toronto time
  // Month is 1-based for this helper for clarity
  const createDate = (month: number, day: number, hour: number, minute: number, offset: number) => {
      const y = year;
      const m = month.toString().padStart(2, '0');
      const d = day.toString().padStart(2, '0');
      const h = hour.toString().padStart(2, '0');
      const min = minute.toString().padStart(2, '0');
      const off = offset < 0 ? `-${Math.abs(offset).toString().padStart(2, '0')}:00` : `+${offset.toString().padStart(2, '0')}:00`;
      return new Date(`${y}-${m}-${d}T${h}:${min}:00${off}`).toISOString();
  };

  // Hardcoded history as requested
  // Using Oct 24 and Nov 18-20 sequence
  const historyList = [
      { date: createDate(10, 24, 11, 0, -4), loc: 'Vineland Station, ON', status: 'Pending', desc: 'Shipment information received' },
      { date: createDate(11, 18, 17, 31, -5), loc: 'Vineland Station', status: 'In Transit', desc: 'Departed from origin facility' },
      { date: createDate(11, 18, 23, 31, -5), loc: 'Grimsby', status: 'In Transit', desc: 'Arrived at Grimsby' },
      { date: createDate(11, 19, 5, 31, -5), loc: 'Stoney Creek', status: 'In Transit', desc: 'Arrived at Stoney Creek' },
      { date: createDate(11, 19, 11, 31, -5), loc: 'Hamilton', status: 'In Transit', desc: 'Arrived at Hamilton' },
      { date: createDate(11, 19, 17, 31, -5), loc: 'Burlington', status: 'In Transit', desc: 'Arrived at Burlington' },
      { date: createDate(11, 19, 23, 31, -5), loc: 'Oakville', status: 'In Transit', desc: 'Arrived at Oakville' },
      { date: createDate(11, 20, 5, 31, -5), loc: 'Mississauga', status: 'In Transit', desc: 'Arrived at Mississauga' },
      { date: createDate(11, 20, 11, 31, -5), loc: 'Milton', status: 'In Transit', desc: 'Arrived at Milton' },
      { date: createDate(11, 20, 17, 31, -5), loc: 'Cambridge', status: 'Exception', desc: 'Arrived at Cambridge' },
  ];

  const scanHistory: ScanEvent[] = historyList.map(h => ({
      timestamp: h.date,
      location: h.loc,
      status: h.status as ShipmentStatus,
      description: h.desc
  }));

  const lastEvent = historyList[historyList.length - 1];

  // Estimated delivery paused
  const estimatedDelivery = new Date(new Date(lastEvent.date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return {
    trackingId: CONSTANCE_ID,
    status: 'Exception',
    origin: { name: 'T&C Border Concierge', street: '100 Border Lane', city: 'Vineland Station', state: 'ON', postalCode: 'L0R 2E0', country: 'Canada' },
    destination: { name: 'Constance Beausoliel', street: '254 Orchard Ave', city: 'Lakeside', state: 'ON', postalCode: 'N0M 2G0', country: 'Canada' },
    estimatedDelivery: estimatedDelivery,
    carrier: 'VeluXpress Freight',
    weight: 427,
    dimensions: '48x48x48 in',
    service: 'International Ground Freight',
    scanHistory: scanHistory, 
    simulationData: {
        timestamp: new Date(lastEvent.date).toLocaleString('en-US', { 
            weekday: 'short', 
            hour: 'numeric', 
            minute: 'numeric', 
            timeZoneName: 'short',
            timeZone: 'America/Toronto'
        }),
        currentLocation: 'Cambridge, ON',
        nextLocation: 'Woodstock, ON',
        distanceRemaining: '70 km',
        statusUpdate: 'Shipment is held for inspection at our Cambridge, ON facility.'
    }
  };
};


export const getShipmentByTrackingId = (trackingId: string): Promise<Shipment | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedId = normalizeTrackingId(trackingId);
      
      if (normalizedId === CONSTANCE_ID) {
          const shipment = generateConstanceShipment();
          resolve(shipment);
          return;
      }

      const shipment = mockShipments.get(normalizedId);
      resolve(shipment);
    }, 700);
  });
};

interface CreateShipmentData {
  origin: Address;
  destination: Address;
  weight: number;
  dimensions: string;
}

export const createShipment = (data: CreateShipmentData): Promise<Shipment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const trackingId = `VE-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const newShipment: Shipment = {
        ...data,
        trackingId,
        status: 'Pending',
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        carrier: 'VeluXpress Ground',
        service: 'Standard Ground',
        scanHistory: [
          { 
            timestamp: new Date().toISOString(), 
            location: `${data.origin.city}, ${data.origin.state || data.origin.country}`, 
            status: 'Pending', 
            description: 'Shipment information received' 
          },
        ],
      };
      mockShipments.set(trackingId, newShipment);
      resolve(newShipment);
    }, 1000);
  });
};
