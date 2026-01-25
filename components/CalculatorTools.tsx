import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Home, DollarSign } from 'lucide-react';

const CalculatorTools: React.FC = () => {
    // Frais de Notaire
    const [purchasePrice, setPurchasePrice] = useState('');
    const [notaryFees, setNotaryFees] = useState<number | null>(null);

    // Plus-Value
    const [buyPrice, setBuyPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [holdingYears, setHoldingYears] = useState('');
    const [capitalGain, setCapitalGain] = useState<{ gross: number, taxable: number, tax: number } | null>(null);

    // Prêt
    const [loanAmount, setLoanAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [loanDuration, setLoanDuration] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState<{ payment: number, total: number, interest: number } | null>(null);

    const calculateNotaryFees = () => {
        const price = parseFloat(purchasePrice);
        if (isNaN(price) || price <= 0) return;

        // Simplified calculation: ~7-8% for old properties, ~2-3% for new
        const rate = 0.075; // 7.5% average for old properties
        const fees = price * rate;
        setNotaryFees(fees);
    };

    const calculateCapitalGain = () => {
        const buy = parseFloat(buyPrice);
        const sell = parseFloat(sellPrice);
        const years = parseInt(holdingYears);

        if (isNaN(buy) || isNaN(sell) || isNaN(years)) return;

        const gross = sell - buy;

        // Tax exemption after 22 years for income tax, 30 years for social charges
        const incomeTaxReduction = Math.min(years, 22) * 6; // 6% per year
        const socialChargesReduction = Math.min(years, 30) * 1.65; // 1.65% per year for first 22 years, then 9% for 8 years

        const totalReduction = incomeTaxReduction + socialChargesReduction;
        const taxableGain = gross * (1 - totalReduction / 100);

        // Tax rate: 19% income tax + 17.2% social charges = 36.2%
        const tax = Math.max(0, taxableGain * 0.362);

        setCapitalGain({
            gross,
            taxable: Math.max(0, taxableGain),
            tax
        });
    };

    const calculateLoan = () => {
        const amount = parseFloat(loanAmount);
        const rate = parseFloat(interestRate) / 100 / 12; // Monthly rate
        const months = parseInt(loanDuration) * 12;

        if (isNaN(amount) || isNaN(rate) || isNaN(months) || amount <= 0 || months <= 0) return;

        // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
        const payment = amount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
        const total = payment * months;
        const interest = total - amount;

        setMonthlyPayment({
            payment,
            total,
            interest
        });
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Calculatrice Express</h2>
                <p className="text-slate-600">Outils de calcul instantanés pour vos estimations</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Frais de Notaire */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className="card-premium p-6 space-y-4"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Home size={24} className="text-blue-600" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">Frais de Notaire</h3>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Prix d'achat (€)</label>
                            <input
                                type="number"
                                value={purchasePrice}
                                onChange={(e) => setPurchasePrice(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                placeholder="300000"
                            />
                        </div>

                        <button
                            onClick={calculateNotaryFees}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Calculer
                        </button>

                        {notaryFees !== null && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-blue-50 rounded-lg border border-blue-100"
                            >
                                <div className="text-sm text-blue-600 font-medium mb-1">Frais estimés</div>
                                <div className="text-2xl font-bold text-blue-700">
                                    {notaryFees.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                                </div>
                                <div className="text-xs text-blue-600 mt-2">
                                    ~7.5% du prix (ancien)
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Plus-Value Immobilière */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-premium p-6 space-y-4"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-emerald-50 rounded-xl">
                            <TrendingUp size={24} className="text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">Plus-Value</h3>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Prix d'achat (€)</label>
                            <input
                                type="number"
                                value={buyPrice}
                                onChange={(e) => setBuyPrice(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                placeholder="250000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Prix de vente (€)</label>
                            <input
                                type="number"
                                value={sellPrice}
                                onChange={(e) => setSellPrice(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                placeholder="350000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Durée détention (années)</label>
                            <input
                                type="number"
                                value={holdingYears}
                                onChange={(e) => setHoldingYears(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                placeholder="10"
                            />
                        </div>

                        <button
                            onClick={calculateCapitalGain}
                            className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Calculer
                        </button>

                        {capitalGain !== null && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 space-y-2"
                            >
                                <div>
                                    <div className="text-xs text-emerald-600">Plus-value brute</div>
                                    <div className="text-lg font-bold text-emerald-700">
                                        {capitalGain.gross.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-emerald-600">Impôt estimé</div>
                                    <div className="text-lg font-bold text-emerald-700">
                                        {capitalGain.tax.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                                    </div>
                                </div>
                                <div className="text-xs text-emerald-600 pt-2 border-t border-emerald-200">
                                    Net après impôt: {(capitalGain.gross - capitalGain.tax).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Comparateur de Prêts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-premium p-6 space-y-4"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-amber-50 rounded-xl">
                            <DollarSign size={24} className="text-amber-600" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">Prêt Immobilier</h3>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Montant emprunté (€)</label>
                            <input
                                type="number"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                placeholder="200000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Taux d'intérêt (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={interestRate}
                                onChange={(e) => setInterestRate(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                placeholder="3.5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Durée (années)</label>
                            <input
                                type="number"
                                value={loanDuration}
                                onChange={(e) => setLoanDuration(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                placeholder="20"
                            />
                        </div>

                        <button
                            onClick={calculateLoan}
                            className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Calculer
                        </button>

                        {monthlyPayment !== null && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-amber-50 rounded-lg border border-amber-100 space-y-2"
                            >
                                <div>
                                    <div className="text-xs text-amber-600">Mensualité</div>
                                    <div className="text-2xl font-bold text-amber-700">
                                        {monthlyPayment.payment.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200">
                                    <div>
                                        <div className="text-xs text-amber-600">Coût total</div>
                                        <div className="text-sm font-bold text-amber-700">
                                            {monthlyPayment.total.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-amber-600">Intérêts</div>
                                        <div className="text-sm font-bold text-amber-700">
                                            {monthlyPayment.interest.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CalculatorTools;
