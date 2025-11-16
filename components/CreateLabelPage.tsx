import React, { useState } from 'react';
import { Address, Shipment } from '../types';
import { createShipment } from '../services/shippingService';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import ShippingLabel from './ShippingLabel';

const AddressForm: React.FC<{ title: string, address: Address, setAddress: (addr: Address) => void }> = ({ title, address, setAddress }) => {
    const handleChange = (field: keyof Address, value: string) => {
        setAddress({ ...address, [field]: value });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Name" value={address.name} onChange={e => handleChange('name', e.target.value)} required />
                <Input placeholder="Company (Optional)" value={address.company || ''} onChange={e => handleChange('company', e.target.value)} />
            </div>
            <Input placeholder="Street Address" value={address.street} onChange={e => handleChange('street', e.target.value)} required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="City" value={address.city} onChange={e => handleChange('city', e.target.value)} required />
                <Input placeholder="State / Province" value={address.state} onChange={e => handleChange('state', e.target.value)} required />
                <Input placeholder="Postal Code" value={address.postalCode} onChange={e => handleChange('postalCode', e.target.value)} required />
            </div>
            <Input placeholder="Country" value={address.country} onChange={e => handleChange('country', e.target.value)} required />
        </div>
    );
};


const CreateLabelPage: React.FC<{ onLabelCreated: (shipment: Shipment) => void }> = ({ onLabelCreated }) => {
    const [origin, setOrigin] = useState<Address>({ name: '', street: '', city: '', state: '', postalCode: '', country: '' });
    const [destination, setDestination] = useState<Address>({ name: '', street: '', city: '', state: '', postalCode: '', country: '' });
    const [weight, setWeight] = useState(1);
    const [dimensions, setDimensions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedShipment, setGeneratedShipment] = useState<Shipment | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const newShipment = await createShipment({ origin, destination, weight, dimensions });
            setGeneratedShipment(newShipment);
        } catch (error) {
            console.error("Failed to create shipment", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (generatedShipment) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center bg-surface p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold">Label Created Successfully!</h2>
                    <p className="text-on-surface-secondary mt-2">Your tracking ID is <span className="font-bold text-brand-primary">{generatedShipment.trackingId}</span>.</p>
                     <div className="flex justify-center space-x-4 mt-6">
                        <Button onClick={() => setGeneratedShipment(null)}>Create Another Label</Button>
                        <Button variant="secondary" onClick={() => onLabelCreated(generatedShipment)}>Track This Shipment</Button>
                    </div>
                </div>
                <ShippingLabel shipment={generatedShipment} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Create New Shipping Label</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <Card className="p-6">
                    <AddressForm title="Origin Address (From)" address={origin} setAddress={setOrigin} />
                </Card>
                <Card className="p-6">
                    <AddressForm title="Destination Address (To)" address={destination} setAddress={setDestination} />
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Package Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-on-surface-secondary mb-1">Weight (kg)</label>
                            <Input id="weight" type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)} min="0.1" step="0.1" required />
                        </div>
                        <div>
                            <label htmlFor="dimensions" className="block text-sm font-medium text-on-surface-secondary mb-1">Dimensions (e.g., 12x8x4 in)</label>
                            <Input id="dimensions" type="text" value={dimensions} onChange={e => setDimensions(e.target.value)} placeholder="LxWxH in" required />
                        </div>
                    </div>
                </Card>
                <div className="flex justify-end">
                    <Button type="submit" isLoading={isLoading} className="px-8 py-3 text-base">
                        Generate Label
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateLabelPage;