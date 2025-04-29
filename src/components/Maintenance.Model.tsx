import { useState, useEffect, FC } from 'react';
import { motion } from 'framer-motion';

interface MaintenanceData {
    startTime: string;
    endTime: string;
    message: string;
    isEnabled: boolean;
}

export const MaintenanceModel : FC<any>= (props) => {
    const [progress, setProgress] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isAnimating, setIsAnimating] = useState(true);

    const maintenanceData =  props.data;
    
    useEffect(() => {
        const startTime = new Date(maintenanceData.startTime);
        const endTime = new Date(maintenanceData.endTime);
        
        const updateProgress = () => {
            const now = new Date();
            setCurrentTime(now);
            
            if (now < startTime) {
                setProgress(0);
                const timeUntilStart = startTime.getTime() - now.getTime();
                setEstimatedTime(`${Math.ceil(timeUntilStart / 60000)} minutes until maintenance starts`);
            } else if (now > endTime) {
                setProgress(100);
                setIsAnimating(false);
                setEstimatedTime('Maintenance completed');
            } else {
                const totalDuration = endTime.getTime() - startTime.getTime();
                const elapsedTime = now.getTime() - startTime.getTime();
                const currentProgress = (elapsedTime / totalDuration) * 100;
                setProgress(Math.min(currentProgress, 100));
                
                const remainingTime = endTime.getTime() - now.getTime();
                setEstimatedTime(`${Math.ceil(remainingTime / 60000)} minutes remaining`);
            }
        };

        updateProgress();
        const interval = setInterval(updateProgress, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg">
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-[95%] sm:max-w-md mx-auto"
                >
                    {/* Background Effects */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-slow hidden sm:block"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow hidden sm:block"></div>

                    {/* Main Card */}
                    <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full transform transition-all duration-300 hover:scale-[1.02] border border-white/20">
                        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-6">
                            {/* Animated Icon */}
                            <motion.div 
                                className="relative"
                                animate={{ 
                                    rotate: isAnimating ? 360 : 0,
                                    scale: isAnimating ? [1, 1.1, 1] : 1
                                }}
                                transition={{ 
                                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                }}
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-30 animate-pulse-slow"></div>
                                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-3 md:p-4 rounded-full">
                                    <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </div>
                            </motion.div>

                            {/* Title */}
                            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text text-center">
                                Under Maintenance
                            </h1>

                            {/* Current Time */}
                            <div className="text-sm text-gray-500">
                                Current Time: {formatTime(currentTime)}
                            </div>

                            {/* Progress Section */}
                            <div className="w-full max-w-[90%] sm:max-w-xs space-y-2">
                                <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                                    <span>Progress</span>
                                    <span className="font-semibold">{progress.toFixed(2)}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <div className="text-xs text-gray-500 text-center">
                                    Estimated completion in: {estimatedTime}
                                </div>
                            </div>

                            {/* Status Messages */}
                            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center">
                                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                                    {maintenanceData.message}
                                </p>
                                <p className="text-xs sm:text-sm md:text-base text-gray-600">
                                    We'll be back shortly. Thank you for your patience.
                                </p>
                            </div>

                            {/* Support Section */}
                            <div className="w-full max-w-[90%] sm:max-w-xs space-y-3 sm:space-y-4 pt-3 sm:pt-4">
                                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Support Team</h3>
                                    <div className="space-y-2 sm:space-y-3">
                                        <motion.div 
                                            whileHover={{ scale: 1.02 }}
                                            className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 hover:bg-white/30 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.95 1.24-5.54 3.64-.52.36-.99.53-1.41.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.38-.49 1.05-.75 4.12-1.79 6.87-2.97 8.26-3.54 3.93-1.6 4.75-1.87 5.27-1.87.11 0 .36.03.52.18.14.14.18.33.2.52-.01.18.01.47 0 .66z" />
                                            </svg>
                                            <a href="https://t.me/Nur6432" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-blue-600 hover:text-blue-700 transition-colors">
                                                Channel: @Nur islam Roman
                                            </a>
                                        </motion.div>
                                        <motion.div 
                                            whileHover={{ scale: 1.02 }}
                                            className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 hover:bg-white/30 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.95 1.24-5.54 3.64-.52.36-.99.53-1.41.52-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.38-.49 1.05-.75 4.12-1.79 6.87-2.97 8.26-3.54 3.93-1.6 4.75-1.87 5.27-1.87.11 0 .36.03.52.18.14.14.18.33.2.52-.01.18.01.47 0 .66z" />
                                            </svg>
                                            <a href="https://t.me/nurislamroman" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-blue-600 hover:text-blue-700 transition-colors">
                                                Admin/CEO: @Nur islam Roman
                                            </a>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
