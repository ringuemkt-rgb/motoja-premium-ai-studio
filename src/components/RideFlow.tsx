import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CreditCard, X, CheckCircle2, Bike } from 'lucide-react';
import { RideStatus, RideState } from '../ribs/ride/types';
import { RideInteractor } from '../ribs/ride/interactor';
import { RideRouter } from '../ribs/ride/router';
import { cn } from '../utils/cn';

interface RideFlowProps {
  interactor: RideInteractor;
}

export default function RideFlow({ interactor }: RideFlowProps) {
  const [state, setState] = useState<RideState | null>(null);
  const [destinationInput, setDestinationInput] = useState('');

  useEffect(() => {
    interactor.setUpdateCallback((newState) => {
      setState(newState);
      if (newState.status === 'IDLE') {
        setDestinationInput('');
      }
    });
  }, [interactor]);

  if (!state) return null;

  const { status, origin, destination, price, eta, driver } = state;

  const handleRequest = () => {
    if (destinationInput.trim()) {
      interactor.requestRide(destinationInput);
    }
  };

  const handleCancel = () => {
    interactor.cancelRide();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <AnimatePresence mode="wait">
          {status === 'IDLE' && (
            <motion.div
              key="idle"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-[#151619] border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Bike className="text-orange-500 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">MotoJá Premium</h2>
                  <p className="text-xs text-white/40">Sua moto rápida e segura</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
                  <input
                    type="text"
                    value={origin}
                    readOnly
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-sm focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500" />
                  <input
                    type="text"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    placeholder="Para onde vamos de moto?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
              </div>

              {destinationInput.length > 3 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <button
                    onClick={handleRequest}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-orange-500/20"
                  >
                    Pedir MotoJá
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {status === 'SEARCHING' && (
            <motion.div
              key="searching"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-[#151619] border border-white/10 rounded-3xl p-8 shadow-2xl text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bike className="w-10 h-10 text-orange-500" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2 text-orange-500">Procurando Piloto...</h2>
              <p className="text-sm text-white/40 mb-8">Conectando você ao melhor piloto de moto.</p>
              <button
                onClick={handleCancel}
                className="text-sm font-semibold text-white/40 hover:text-white transition-colors"
              >
                Cancelar Solicitação
              </button>
            </motion.div>
          )}

          {status === 'ACCEPTED' && driver && (
            <motion.div
              key="accepted"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-[#151619] border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between mb-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-green-500 w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-green-500">Piloto a caminho</h2>
                    <p className="text-xs text-white/40">Chegada em {eta} min • R$ {price.toFixed(2)}</p>
                  </div>
                </div>
                <button 
                  onClick={handleCancel}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 opacity-40" />
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl overflow-hidden border border-white/5">
                    <img 
                      src={driver.photo} 
                      alt={driver.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="font-bold">{driver.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold">{driver.rating}</span>
                      <span className="text-[10px] text-white/40 ml-1">• {driver.vehicle}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-orange-500/20 text-orange-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-1">
                    {driver.plate}
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-3"
              >
                <button className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors text-sm border border-white/5">
                  Mensagem
                </button>
                <button className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors text-sm border border-white/5">
                  Ligar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
