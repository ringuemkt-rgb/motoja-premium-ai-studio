import { useState, useMemo } from 'react';
import MotoJaMap from './components/MotoJaMap';
import AICentral from './components/AICentral';
import RideFlow from './components/RideFlow';
import VisualStudio from './components/VisualStudio';
import { Menu, Bell, Settings, History, Shield, HelpCircle, LogOut, Bike, CreditCard, X, Rotate3d, MapPinned } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils/cn';
import { RootBuilder } from './ribs/root/builder';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'app' | 'studio'>('app');

  const { rideRouter } = useMemo(() => {
    const builder = new RootBuilder({});
    const root = builder.build();
    const ride = root.attachRide();
    return { rootRouter: root, rideRouter: ride };
  }, []);

  const menuItems = [
    { icon: Bike, label: 'Solicitar corrida', active: true },
    { icon: History, label: 'Histórico' },
    { icon: CreditCard, label: 'Pagamento' },
    { icon: Shield, label: 'Segurança' },
    { icon: Settings, label: 'Configurações' },
    { icon: HelpCircle, label: 'Ajuda' },
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0B0B0E] text-white">
      {viewMode === 'studio' ? (
        <VisualStudio onBackToApp={() => setViewMode('app')} />
      ) : (
        <>
          <header className="fixed top-0 left-0 right-0 z-40 p-4 flex items-center justify-between pointer-events-none">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="w-12 h-12 bg-[#15151A]/90 border border-[#25252D] rounded-2xl flex items-center justify-center shadow-xl pointer-events-auto active:scale-95 transition-transform backdrop-blur"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="bg-[#15151A]/90 border border-[#25252D] px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 pointer-events-auto backdrop-blur">
              <div className="w-2 h-2 bg-[#3DDC97] rounded-full animate-pulse" />
              <span className="text-xs font-black tracking-tight uppercase">MotoJá • Ituberá-BA</span>
            </div>

            <button
              onClick={() => setViewMode('studio')}
              className="px-4 h-12 bg-[#15151A]/90 border border-[#FFC107]/30 text-[#FFC107] rounded-2xl flex items-center gap-2 shadow-xl pointer-events-auto active:scale-95 transition-all hover:bg-[#FFC107]/5 font-black text-xs backdrop-blur"
            >
              <Rotate3d className="w-5 h-5 text-[#FFC107]" />
              <span>Estúdio</span>
            </button>
          </header>

          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                />
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 left-0 bottom-0 w-80 bg-[#15151A] border-r border-[#25252D] z-[70] p-6 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#FFC107]/10 border border-[#FFC107]/25 rounded-2xl flex items-center justify-center shadow-lg shadow-[#FFC107]/10">
                        <Bike className="text-[#FFC107] w-7 h-7" />
                      </div>
                      <div>
                        <h1 className="text-xl font-black tracking-tighter">MOTOJÁ</h1>
                        <p className="text-[10px] text-[#FFC107] font-black uppercase tracking-widest">Premium Local</p>
                      </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                      <X className="w-6 h-6 opacity-40" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 mb-8">
                    <div className="w-12 h-12 bg-[#FFC107]/10 rounded-xl flex items-center justify-center border border-[#FFC107]/20">
                      <MapPinned className="w-6 h-6 text-[#FFC107]" />
                    </div>
                    <div>
                      <p className="font-bold">Olá, passageiro</p>
                      <p className="text-xs text-[#B8B8C2]">Verificado • Ituberá-BA</p>
                    </div>
                  </div>

                  <nav className="flex-1 space-y-1">
                    {menuItems.map((item) => (
                      <button
                        key={item.label}
                        className={cn(
                          'w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group',
                          item.active ? 'bg-[#FFC107] text-black' : 'hover:bg-white/5 text-white/60 hover:text-white'
                        )}
                      >
                        <item.icon className={cn('w-5 h-5', item.active ? 'text-black' : 'text-white/40 group-hover:text-white')} />
                        <span className="text-sm font-semibold">{item.label}</span>
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        setViewMode('studio');
                        setIsSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group border border-[#FFC107]/20 bg-[#FFC107]/5 text-[#FFC107] hover:bg-[#FFC107]/10"
                    >
                      <Rotate3d className="w-5 h-5 text-[#FFC107]" />
                      <span className="text-sm font-bold">Estúdio visual premium</span>
                    </button>
                  </nav>

                  <button className="flex items-center gap-4 px-4 py-4 text-[#FF4D4D]/70 hover:text-[#FF4D4D] transition-colors mt-auto">
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-bold">Sair da conta</span>
                  </button>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          <main className="h-full w-full">
            <MotoJaMap />
            <RideFlow interactor={rideRouter.interactor} />
            <AICentral />
          </main>

          <button className="fixed right-4 top-24 z-40 h-12 w-12 rounded-2xl border border-[#25252D] bg-[#15151A]/90 shadow-xl backdrop-blur flex items-center justify-center">
            <Bell className="h-5 w-5 text-[#FFC107]" />
          </button>

          <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#15151A] z-20 sm:hidden" />
        </>
      )}
    </div>
  );
}
