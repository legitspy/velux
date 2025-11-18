
export interface Address {
  name: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

export type ShipmentStatus = 'Pending' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception' | 'Pending Delivery';

export interface ScanEvent {
  timestamp: string;
  location: string;
  status: ShipmentStatus;
  description: string;
}

export interface SimulationData {
  timestamp: string;
  currentLocation: string;
  nextLocation: string;
  distanceRemaining: string;
  statusUpdate: string;
}

export interface Shipment {
  trackingId: string;
  status: ShipmentStatus;
  origin: Address;
  destination: Address;
  estimatedDelivery: string;
  actualDelivery?: string;
  carrier: string;
  weight: number;
  dimensions: string;
  service: string;
  scanHistory: ScanEvent[];
  simulationData?: SimulationData;
}
