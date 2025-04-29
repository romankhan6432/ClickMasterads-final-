'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/modules/store';
import { MaintenanceSettings } from '@/modules/private/settings/types';

export default function MaintenanceModel() {
    const maintenanceData = useSelector((state: RootState) => state.private.settings.maintenance);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (maintenanceData?.isEnabled) {
            setIsOpen(true);
        }
    }, [maintenanceData]);

    if (!maintenanceData?.isEnabled) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            <div className="relative bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🔧</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white">
                        Maintenance Mode
                    </h2>
                    
                    <p className="text-gray-300">
                        {maintenanceData.message || 'We are currently performing maintenance. Please check back later.'}
                    </p>
                    
                    {maintenanceData.endTime && (
                        <p className="text-sm text-gray-400">
                            Estimated completion: {new Date(maintenanceData.endTime).toLocaleString()}
                        </p>
                    )}
                    
                    <button
                        onClick={() => setIsOpen(false)}
                        className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
} 