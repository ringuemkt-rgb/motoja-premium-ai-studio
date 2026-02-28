import { useState, useMemo } from 'react';
import Map from './components/Map';
import AICentral from './components/AICentral';
import RideFlow from './components/RideFlow';
import { Menu, Bell, User, Settings, History, Shield, HelpCircle, LogOut, Bike, CreditCard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils/cn';
import { RootBuilder } from './ribs/root/builder';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // RIBs Initialization
  const { rootRouter, rideRouter } = useMemo(() => {
    const builder = new RootBuilder({});
    const root = builder.build();
    const ride = root.attachRide();
    return { rootRouter: root, rideRouter: ride };
  }, []);

  const menuItems = [
    { icon: Bike, label: 'Minhas Corridas', active: true },
    { icon: History, label: 'Histórico' },
    { icon: CreditCard, label: 'Pagamento' },
    { icon: Shield, label: 'Segurança' },
    { icon: Settings, label: 'Configurações' },
    { icon: HelpCircle, label: 'Ajuda' },
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-12 h-12 bg-[#151619] border border-white/10 rounded-2xl flex items-center justify-center shadow-xl pointer-events-auto active:scale-95 transition-transform"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="bg-[#151619] border border-white/10 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 pointer-events-auto">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold tracking-tight uppercase">MotoJá Premium</span>
        </div>

        <button className="w-12 h-12 bg-[#151619] border border-white/10 rounded-2xl flex items-center justify-center shadow-xl pointer-events-auto active:scale-95 transition-transform">
          <Bell className="w-6 h-6 opacity-50" />
        </button>
      </header>

      {/* Sidebar Overlay */}
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
              className="fixed top-0 left-0 bottom-0 w-80 bg-[#151619] border-r border-white/10 z-[70] p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Bike className="text-white w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black italic tracking-tighter">MOTOJÁ</h1>
                    <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Premium Edition</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 opacity-40" />
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 mb-8">
                <div className="w-12 h-12 bg-white/10 rounded-xl overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/user/200" 
                    alt="User" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="font-bold">Olá, Usuário</p>
                  <p className="text-xs text-white/40">Nível Bronze • 120 pts</p>
                </div>
              </div>

              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group",
                      item.active ? "bg-orange-500 text-white" : "hover:bg-white/5 text-white/60 hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", item.active ? "text-white" : "text-white/40 group-hover:text-white")} />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </nav>

              <button className="flex items-center gap-4 px-4 py-4 text-red-500/60 hover:text-red-500 transition-colors mt-auto">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-bold">Sair da conta</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="h-full w-full">
        <Map />
        <RideFlow interactor={rideRouter.interactor} />
        <AICentral />
      </main>

      {/* Bottom Safe Area Background (for mobile) */}
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#151619] z-20 sm:hidden" />
    </div>
  );
}
