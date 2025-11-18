
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
]);

const normalizeTrackingId = (trackingId: string): string => {
    const sanitized = trackingId.replace(/[^a-zA-Z0-9]/g, '');
    const prefix = sanitized.substring(0, 2).toUpperCase();
    const number = sanitized.substring(2);
    return `${prefix}-${number}`;
};

// Simulation Data for Constance Beausoliel
const CONSTANCE_ID = 'VE-581403056';

const SIMULATION_ROUTE = [
  { city: "Vineland Station, ON", msg: "Departed origin facility", dist: "185 km" },
  { city: "Grimsby, ON", msg: "Truck is heading west on the QEW toward Hamilton.", dist: "172 km" },
  { city: "Stoney Creek, ON", msg: "Passing through Stoney Creek, continuing west on QEW.", dist: "160 km" },
  { city: "Hamilton, ON", msg: "Arrived at Hamilton logistics hub for sorting.", dist: "150 km" },
  { city: "Burlington, ON", msg: "Crossing the Burlington Skyway Bridge.", dist: "142 km" },
  { city: "Oakville, ON", msg: "Heading east on the QEW toward Mississauga.", dist: "128 km" },
  { city: "Mississauga, ON", msg: "Processing at regional distribution center.", dist: "115 km" },
  { city: "Milton, ON", msg: "Departed hub, traveling west on Hwy 401.", dist: "95 km" },
  { city: "Cambridge, ON", msg: "Continuing west on Hwy 401 past Guelph Line.", dist: "70 km" },
  { city: "Woodstock, ON", msg: "In transit on Hwy 401, passing Woodstock.", dist: "45 km" },
  { city: "Ingersoll, ON", msg: "Exiting highway, taking local routes toward Thamesford.", dist: "30 km" },
  { city: "Thamesford, ON", msg: "Traveling north-west on Hwy 19.", dist: "18 km" },
  { city: "Lakeside, ON", msg: "Out for final delivery in Lakeside area.", dist: "5 km" },
  { city: "254 Orchard Ave, Lakeside, ON N0M 2G0", msg: "Shipment delivered.", dist: "0 km" }
];

const generateConstanceShipment = (): Shipment => {
  const now = Date.now();
  
  // Retrieve start time from storage to maintain consistency across navigation
  // Changed key to v2 to force a restart to "now" for this update
  const STORAGE_KEY = 'velux_constance_start_time_v2';
  let startTimeMs = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
  
  if (!startTimeMs || isNaN(startTimeMs)) {
      // Start NOW as per user request.
      startTimeMs = now;
      localStorage.setItem(STORAGE_KEY, startTimeMs.toString());
  }

  const startTime = new Date(startTimeMs);
  
  // Duration per step: 6 hours
  const STEP_DURATION_MS = 6 * 60 * 60 * 1000;
  
  const elapsed = now - startTimeMs;
  let stepIndex = Math.floor(elapsed / STEP_DURATION_MS);
  
  // Cap at final destination
  if (stepIndex >= SIMULATION_ROUTE.length - 1) {
    stepIndex = SIMULATION_ROUTE.length - 1;
  }
  
  const currentLeg = SIMULATION_ROUTE[stepIndex];
  const nextLeg = SIMULATION_ROUTE[stepIndex + 1] || currentLeg;
  const isDelivered = stepIndex === SIMULATION_ROUTE.length - 1;

  let status: ShipmentStatus = isDelivered ? 'Delivered' : 'In Transit';
  if (stepIndex === SIMULATION_ROUTE.length - 2) status = 'Out for Delivery';

  // Generate Scan History based on progress
  const scanHistory = [];
  
  // Initial Received scan
  // Fixed to 24 Oct, 11:00
  const currentYear = new Date().getFullYear();
  let rxYear = currentYear;
  const nowObj = new Date();
  
  // If today is before Oct 24 in the current year, assume the received date was last year 
  // to ensure it's in the past relative to potential "now" start times if they haven't reached Oct yet.
  if (nowObj.getMonth() < 9 || (nowObj.getMonth() === 9 && nowObj.getDate() < 24)) {
      rxYear -= 1;
  }
  
  // Construct ISO string for 24 Oct 11:00 AM
  // We use a fixed offset or date construction to ensure it displays as requested.
  // Assuming Toronto/Eastern time is desired context.
  const receivedDate = new Date(`${rxYear}-10-24T11:00:00-04:00`); // 11:00 AM EDT

  scanHistory.push({
    timestamp: receivedDate.toISOString(),
    location: 'Vineland Station, ON',
    status: 'Pending' as ShipmentStatus,
    description: 'Shipment information received'
  });

  // Add scans for each completed or current step
  for (let i = 0; i <= stepIndex; i++) {
      const leg = SIMULATION_ROUTE[i];
      const scanTime = new Date(startTimeMs + (i * STEP_DURATION_MS));
      
      // Ensure we don't show future timestamps if we just started (though stepIndex logic prevents this mostly)
      if (scanTime.getTime() <= now) {
           let scanStatus: ShipmentStatus = 'In Transit';
           let desc = `Arrived at ${leg.city.split(',')[0]}`;
           
           if (i === 0) {
               desc = "Departed from origin facility";
           } else if (i === SIMULATION_ROUTE.length - 1) {
               scanStatus = 'Delivered';
               desc = "Delivered to recipient";
           } else if (i === SIMULATION_ROUTE.length - 2) {
               scanStatus = 'Out for Delivery';
               desc = "Loaded on delivery vehicle";
           }

           scanHistory.push({
              timestamp: scanTime.toISOString(),
              location: leg.city.split(',')[0],
              status: scanStatus,
              description: desc
           });
      }
  }

  const totalSteps = SIMULATION_ROUTE.length - 1;
  const estimatedDeliveryTime = new Date(startTimeMs + totalSteps * STEP_DURATION_MS);
  
  // Current simulation state for the "Live" view
  // Timestamp updates in 6 hour increments based on current step
  const currentStepTime = new Date(startTimeMs + stepIndex * STEP_DURATION_MS);

  return {
    trackingId: CONSTANCE_ID,
    status: status,
    origin: { name: 'T&C Border Concierge', street: '100 Border Lane', city: 'Vineland Station', state: 'ON', postalCode: 'L0R 2E0', country: 'Canada' },
    destination: { name: 'Constance Beausoliel', street: '254 Orchard Ave', city: 'Lakeside', state: 'ON', postalCode: 'N0M 2G0', country: 'Canada' },
    estimatedDelivery: estimatedDeliveryTime.toISOString(),
    actualDelivery: isDelivered ? currentStepTime.toISOString() : undefined,
    carrier: 'VeluXpress Freight',
    weight: 427,
    dimensions: '48x48x48 in',
    service: 'International Ground Freight',
    scanHistory: scanHistory.reverse(),
    simulationData: {
        timestamp: currentStepTime.toLocaleString('en-US', { 
            weekday: 'short', 
            hour: 'numeric', 
            minute: 'numeric', 
            timeZoneName: 'short',
            timeZone: 'America/Toronto'
        }),
        currentLocation: currentLeg.city,
        nextLocation: isDelivered ? 'None' : nextLeg.city,
        distanceRemaining: currentLeg.dist,
        statusUpdate: currentLeg.msg
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
