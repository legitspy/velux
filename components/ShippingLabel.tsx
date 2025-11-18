import React from 'react';
import { Shipment, Address } from '../types';
import Logo from './common/Logo';
// Fix: Import the Button component.
import Button from './common/Button';

const AddressBlock: React.FC<{ title: string; address: Address }> = ({ title, address }) => (
    <div>
        <p className="text-xs text-gray-500 font-bold uppercase">{title}</p>
        <div className="text-sm">
            <p className="font-semibold">{address.name}</p>
            {address.company && <p>{address.company}</p>}
            <p>{address.street}</p>
            <p>{address.city}, {address.state} {address.postalCode}</p>
            <p>{address.country}</p>
        </div>
    </div>
);

const ShippingLabel: React.FC<{ shipment: Shipment }> = ({ shipment }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
        <style>{`
            @media print {
                body, html {
                    background-color: #fff;
                }
                main {
                    padding: 0 !important;
                }
                body * {
                    visibility: hidden;
                }
                #shipping-label-container, #shipping-label-container * {
                    visibility: visible;
                }
                #shipping-label-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #shipping-label {
                    margin: 0;
                    border: 2px solid #000;
                    border-radius: 0;
                    transform: scale(1.5); /* Make label bigger on print */
                }
                .no-print {
                    display: none;
                }
            }
        `}</style>
        <div id="shipping-label-container">
            <div id="shipping-label" className="bg-white p-6 border-2 border-dashed rounded-lg max-w-lg mx-auto">
                <div className="grid grid-cols-3 gap-4 items-center pb-4 border-b">
                    <Logo className="text-lg col-span-2" />
                    <p className="text-right text-xs font-bold">{shipment.service.toUpperCase()}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-4 py-4 border-b">
                    <AddressBlock title="FROM" address={shipment.origin} />
                    <AddressBlock title="TO" address={shipment.destination} />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-4 text-sm border-b">
                    <div><span className="font-bold">Weight:</span> {shipment.weight} kg</div>
                    <div><span className="font-bold">Dimensions:</span> {shipment.dimensions}</div>
                    <div><span className="font-bold">Carrier:</span> {shipment.carrier}</div>
                </div>
                <div className="text-center pt-4">
                    <p className="text-xs font-bold">TRACKING #</p>
                    <div className="flex justify-center mt-2">
                        <div className="flex items-end h-12 space-x-px" aria-label={`Barcode for tracking number ${shipment.trackingId}`}>
                            {[...Array(60)].map((_, i) => (
                                <div key={i} className="bg-black" style={{ width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 80 + 20}%`}}></div>
                            ))}
                        </div>
                    </div>
                    <p className="font-mono text-lg sm:text-xl tracking-widest mt-1 break-all">{shipment.trackingId}</p>
                </div>
            </div>
        </div>
        <div className="text-center mt-6 no-print">
             <Button onClick={handlePrint}>Print Label</Button>
        </div>
        </>
    );
};

export default ShippingLabel;