import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, CheckCircle2, Bike, ShieldCheck, Clock3, MessageCircle, Phone, Siren, Package, Pill, Sparkles } from 'lucide-react';
import { RideState, RideCategory } from '../ribs/ride/types';
import { RideInteractor, RidePresentable } from '../ribs/ride/interactor';
import { cn } from '../utils/cn';

interface RideFlowProps {
  interactor: RideInteractor;
}

const categories: Array<{ label: RideCategory; icon: typeof Bike; helper: string }> = [
  { label: 'MotoJá Normal', icon: Bike, helper: 'Corrida rápida' },
  { label: 'MotoJá Expresso', icon: Sparkles, helper: 'Prioridade' },
  { label: 'Entrega', icon: Package, helper: 'Objeto pequeno' },
  { label: 'Farmácia', icon: Pill, helper: 'Pedido essencial' },
];

const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function RideFlow({ interactor }: RideFlowProps) {
  const [state, setState] = useState<RideState | null>(null);
  const [destinationInput, setDestinationInput] = useState('');
  const [category, setCategory] = useState<RideCategory>('MotoJá Normal');

  useEffect(() => {
    const presenter: RidePresentable = {
      updateState: (newState: RideState) => {
        setState(newState);
        if (newState.status === 'IDLE') {
          setDestinationInput('');
          setCategory('MotoJá Normal');
        }
      },
    };

    interactor.setPresenter(presenter);
  }, [interactor]);

  if (!state) return null;

  const { status, origin, destination, price, eta, driver, distanceKm, financials } = state;

  const handleRequest = () => {
    if (destinationInput.trim()) {
      interactor.requestRide(destinationInput, category);
    }
  };

  const handleCancel = () => interactor.cancelRide();

  const isMatching = status === 'REQUESTED' || status === 'MATCHING';
  const isAccepted = status === 'ACCEPTED' || status === 'ARRIVING' || status === 'IN_TRIP';

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
              className="bg-[#15151A]/95 backdrop-blur-xl border border-[#25252D] rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-[#FFC107]/10 rounded-2xl flex items-center justify-center border border-[#FFC107]/20">
                    <Bike className="text-[#FFC107] w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight">Para onde vamos?</h2>
                    <p className="text-xs text-[#B8B8C2]">Ituberá-BA • Mobilidade premium local</p>
                  </div>
                </div>
                <div className="text-[10px] font-black text-[#3DDC97] bg-[#3DDC97]/10 border border-[#3DDC97]/20 rounded-full px-2.5 py-1">
                  Online
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#4A90E2]" />
                  <input
                    type="text"
                    value={origin}
                    readOnly
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-sm focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FFC107]" />
                  <input
                    type="text"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    placeholder="Digite o destino"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-sm focus:outline-none focus:border-[#FFC107]/60 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {categories.map((item) => {
                  const Icon = item.icon;
                  const active = category === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setCategory(item.label)}
                      className={cn(
                        'p-3 rounded-2xl border text-left transition-all active:scale-[0.98]',
                        active ? 'bg-[#FFC107]/12 border-[#FFC107]/50 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      )}
                    >
                      <Icon className={cn('w-5 h-5 mb-2', active ? 'text-[#FFC107]' : 'text-white/40')} />
                      <p className="text-xs font-black leading-tight">{item.label}</p>
                      <p className="text-[10px] text-[#B8B8C2] mt-0.5">{item.helper}</p>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 mb-5">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3DDC97] mt-0.5" />
                  <p className="text-[11px] text-[#B8B8C2] leading-relaxed">
                    Preço mínimo da plataforma: <strong className="text-white">R$12,00</strong>. O repasse padrão é <strong className="text-white">80%</strong> para o piloto e <strong className="text-white">20%</strong> para a plataforma.
                  </p>
                </div>
              </div>

              <button
                disabled={destinationInput.trim().length < 3}
                onClick={handleRequest}
                className="w-full bg-[#FFC107] disabled:bg-white/10 disabled:text-white/30 text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-[#FFC107]/20 active:scale-[0.99]"
              >
                Chamar moto
              </button>
            </motion.div>
          )}

          {isMatching && (
            <motion.div
              key="matching"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-[#15151A]/95 backdrop-blur-xl border border-[#25252D] rounded-3xl p-8 shadow-2xl text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-[#FFC107]/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#FFC107] rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bike className="w-10 h-10 text-[#FFC107]" />
                </div>
              </div>
              <h2 className="text-xl font-black mb-2 text-[#FFC107]">Procurando moto perto de você...</h2>
              <p className="text-sm text-[#B8B8C2] mb-5">Destino: {destination || destinationInput}</p>
              <div className="grid grid-cols-3 gap-2 mb-7 text-center">
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <p className="text-[10px] text-[#B8B8C2]">Valor</p>
                  <p className="text-sm font-black">{formatCurrency(price)}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <p className="text-[10px] text-[#B8B8C2]">Tempo</p>
                  <p className="text-sm font-black">{eta} min</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <p className="text-[10px] text-[#B8B8C2]">Distância</p>
                  <p className="text-sm font-black">{distanceKm} km</p>
                </div>
              </div>
              <button onClick={handleCancel} className="text-sm font-bold text-white/45 hover:text-white transition-colors">
                Cancelar solicitação
              </button>
            </motion.div>
          )}

          {isAccepted && driver && (
            <motion.div
              key="accepted"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-[#15151A]/95 backdrop-blur-xl border border-[#25252D] rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#3DDC97]/15 rounded-full flex items-center justify-center border border-[#3DDC97]/25">
                    <CheckCircle2 className="text-[#3DDC97] w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-black text-[#3DDC97]">{status === 'IN_TRIP' ? 'Em viagem' : status === 'ARRIVING' ? 'Piloto chegando' : 'Piloto aceitou'}</h2>
                    <p className="text-xs text-[#B8B8C2]">ETA {eta} min • {formatCurrency(price)}</p>
                  </div>
                </div>
                <button onClick={handleCancel} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5 opacity-40" />
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl overflow-hidden border border-white/5">
                      <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="font-black">{driver.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#FFC107] fill-[#FFC107]" />
                        <span className="text-xs font-black">{driver.rating}</span>
                        <span className="text-[10px] text-[#B8B8C2] ml-1">• {driver.vehicle}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#FFC107]/15 text-[#FFC107] text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                    {driver.plate}
                  </div>
                </div>

                {driver.badges?.length ? (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {driver.badges.slice(0, 2).map((badge) => (
                      <span key={badge.code} className="inline-flex items-center gap-1 rounded-full border border-[#FFC107]/25 bg-[#FFC107]/10 px-2.5 py-1 text-[10px] font-black text-[#FFD86B]">
                        <ShieldCheck className="w-3 h-3" /> {badge.label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#B8B8C2]">Plataforma</span>
                  <span className="font-bold">{formatCurrency(financials.platformFeeCents / 100)}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-[#B8B8C2]">Piloto recebe</span>
                  <span className="font-bold text-[#3DDC97]">{formatCurrency(financials.driverEarningCents / 100)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <button className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors text-xs border border-white/5 flex items-center justify-center gap-1">
                  <MessageCircle className="w-4 h-4" /> Chat
                </button>
                <button className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors text-xs border border-white/5 flex items-center justify-center gap-1">
                  <Phone className="w-4 h-4" /> Ligar
                </button>
                <button className="bg-[#FF4D4D]/10 hover:bg-[#FF4D4D]/15 text-[#FF4D4D] font-bold py-3 rounded-xl transition-colors text-xs border border-[#FF4D4D]/20 flex items-center justify-center gap-1">
                  <Siren className="w-4 h-4" /> SOS
                </button>
              </div>

              {status !== 'IN_TRIP' ? (
                <button onClick={() => interactor.markInTrip()} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black py-3 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2">
                  <Clock3 className="w-4 h-4" /> Simular início da viagem
                </button>
              ) : (
                <button onClick={() => interactor.completeRide()} className="w-full bg-[#3DDC97] text-black font-black py-3 rounded-2xl text-sm transition-colors">
                  Finalizar corrida demo
                </button>
              )}
            </motion.div>
          )}

          {status === 'COMPLETED' && (
            <motion.div key="completed" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-[#15151A]/95 backdrop-blur-xl border border-[#25252D] rounded-3xl p-6 shadow-2xl text-center">
              <CheckCircle2 className="w-14 h-14 text-[#3DDC97] mx-auto mb-4" />
              <h2 className="text-xl font-black mb-2">Corrida finalizada</h2>
              <p className="text-sm text-[#B8B8C2] mb-4">Obrigado por usar o MotoJá.</p>
              <button onClick={handleCancel} className="w-full bg-[#FFC107] text-black font-black py-4 rounded-2xl">Voltar ao início</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
