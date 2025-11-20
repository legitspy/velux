import React from 'react';
import { ShipmentStatus } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { Icon } from './common/Icon';

interface ShipmentActionsProps {
    status: ShipmentStatus;
}

const ActionButton: React.FC<{icon: string; text: string; disabled: boolean}> = ({icon, text, disabled}) => (
    <Button
        variant="ghost"
        className="w-full !justify-start !p-3 text-on-surface-secondary hover:text-on-surface hover:bg-gray-100"
        disabled={disabled}
    >
        <Icon name={icon} className="h-5 w-5 mr-3" />
        <span>{text}</span>
    </Button>
);

const ShipmentActions: React.FC<ShipmentActionsProps> = ({ status }) => {
    const isDelivered = status === 'Delivered';

    return (
        <Card>
            <div className="p-6">
                <h2 className="text-xl font-bold text-on-surface mb-2">Manage Delivery</h2>
                <div className="space-y-2 mt-4">
                    <ActionButton icon="pauseCircle" text="Hold at Facility" disabled={isDelivered} />
                    <ActionButton icon="calendar" text="Reschedule Delivery" disabled={isDelivered} />
                    <ActionButton icon="exclamationTriangle" text="Report an Issue" disabled={false} />
                    <ActionButton icon="questionMarkCircle" text="Contact Support" disabled={false} />
                </div>
            </div>
        </Card>
    );
};

export default ShipmentActions;
