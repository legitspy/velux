import { Shipment, ShipmentStatus, Address } from '../types';

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
  ['VE-581403056', {
    trackingId: 'VE-581403056',
    status: 'Pending Delivery',
    origin: { name: 'T&C Border Concierge', street: '100 Border Lane', city: 'Vineland Station', state: 'ON', postalCode: 'L0R 2E0', country: 'Canada' },
    destination: { name: 'Constance Beausoliel', street: '254 Orchard Ave', city: 'Lakeside', state: 'ON', postalCode: 'N0M 2G0', country: 'Canada' },
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    carrier: 'VeluXpress Freight',
    weight: 427,
    dimensions: '48x48x48 in',
    service: 'International Ground Freight',
    scanHistory: [
      { timestamp: new Date('2025-10-24T10:00:00Z').toISOString(), location: 'Vineland Station, ON', status: 'Pending', description: 'Received in storage facility' },
      { timestamp: new Date().toISOString(), location: 'Vineland Station, ON', status: 'Pending Delivery', description: 'Recipient’s address has been updated, awaiting shipping out' },
    ],
  }],
]);

const normalizeTrackingId = (trackingId: string): string => {
    // Remove spaces and invalid characters, keep only letters and numbers
    const sanitized = trackingId.replace(/[^a-zA-Z0-9]/g, '');
    // Extract prefix and numeric part
    const prefix = sanitized.substring(0, 2).toUpperCase();
    const number = sanitized.substring(2);
    // Combine with a hyphen
    return `${prefix}-${number}`;
};

export const getShipmentByTrackingId = (trackingId: string): Promise<Shipment | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedId = normalizeTrackingId(trackingId);
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