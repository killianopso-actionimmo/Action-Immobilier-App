import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Delete, Check } from 'lucide-react';

interface PinLockScreenProps {
    onUnlock: () => void;
}

const PinLockScreen: React.FC<PinLockScreenProps> = ({ onUnlock }) => {
    const [pin, setPin] = useState('');
    const [storedPin, setStoredPin] = useState<string | null>(null);
    const [isFirstTime, setIsFirstTime] = useState(false);
    const [confirmPin, setConfirmPin] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('app_pin');
        if (!saved) {
            setIsFirstTime(true);
        } else {
            setStoredPin(saved);
        }
    }, []);

    const hashPin = async (pinCode: string): Promise<string> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(pinCode);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const handleNumberClick = (num: number) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            setError('');

            if (newPin.length === 4) {
                if (isFirstTime) {
                    if (!isConfirming) {
                        setConfirmPin(newPin);
                        setIsConfirming(true);
                        setPin('');
                    } else {
                        if (newPin === confirmPin) {
                            hashPin(newPin).then(hashed => {
                                localStorage.setItem('app_pin', hashed);
                                onUnlock();
                            });
                        } else {
                            setError('Les codes ne correspondent pas');
                            setPin('');
                            setConfirmPin('');
                            setIsConfirming(false);
                        }
                    }
                } else {
                    hashPin(newPin).then(hashed => {
                        if (hashed === storedPin) {
                            onUnlock();
                        } else {
                            setError('Code incorrect');
                            setPin('');
                        }
                    });
                }
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
        setError('');
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                {/* Logo/Title */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="mb-6"
                    >
                        <Lock className="w-16 h-16 mx-auto text-cyan-400 drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">Action Immo</h1>
                    <p className="text-gray-400 text-sm">
                        {isFirstTime
                            ? (isConfirming ? 'Confirmez votre code PIN' : 'Créez votre code PIN')
                            : 'Entrez votre code PIN'
                        }
                    </p>
                </div>

                {/* PIN Display */}
                <div className="glass-card p-8 mb-8">
                    <div className="flex justify-center gap-4 mb-4">
                        {[0, 1, 2, 3].map((index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${pin.length > index
                                        ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                                        : 'border-gray-700 bg-gray-900/50'
                                    }`}
                            >
                                {pin.length > index && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-4 h-4 rounded-full bg-cyan-400"
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm text-center"
                        >
                            {error}
                        </motion.p>
                    )}
                </div>

                {/* Keypad */}
                <div className="glass-card p-6">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <motion.button
                                key={num}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleNumberClick(num)}
                                className="h-16 rounded-xl bg-gray-900/50 border border-gray-700 text-white text-xl font-bold hover:border-cyan-400 hover:bg-cyan-400/10 transition-all"
                            >
                                {num}
                            </motion.button>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div></div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNumberClick(0)}
                            className="h-16 rounded-xl bg-gray-900/50 border border-gray-700 text-white text-xl font-bold hover:border-cyan-400 hover:bg-cyan-400/10 transition-all"
                        >
                            0
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDelete}
                            className="h-16 rounded-xl bg-gray-900/50 border border-gray-700 text-white hover:border-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center"
                        >
                            <Delete className="w-6 h-6" />
                        </motion.button>
                    </div>
                </div>

                {/* Info */}
                {isFirstTime && (
                    <p className="text-gray-500 text-xs text-center mt-6">
                        Votre code PIN sera stocké de manière sécurisée
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default PinLockScreen;
