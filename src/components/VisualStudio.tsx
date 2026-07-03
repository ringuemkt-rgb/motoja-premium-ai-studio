import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, Shield, MapPin, Search, Navigation, 
  Layers, Palette, Sparkles, Award, Image, Grid, 
  Rotate3d, Maximize2, Moon, Sun, Star, CheckCircle, 
  HelpCircle, MessageSquare, ChevronRight, User, Bike, 
  Briefcase, Compass, Gift, Calendar, AlertTriangle, X, CreditCard
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Badge } from './ui/Badge';

interface VisualStudioProps {
  onBackToApp: () => void;
}

export default function VisualStudio({ onBackToApp }: VisualStudioProps) {
  const [activeTab, setActiveTab] = useState<'screens' | 'designSystem' | 'badges' | 'media'>('screens');
  const [activeScreen, setActiveScreen] = useState<number>(0);
  const [rotationY, setRotationY] = useState<number>(12);
  const [rotationX, setRotationX] = useState<number>(8);
  const [glowIntensity, setGlowIntensity] = useState<number>(50);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [badgeFocus, setBadgeFocus] = useState<string>('premium');

  // Specific 16 Screens requested
  const screens = [
    {
      id: 'splash',
      title: '1. Splash Screen',
      subtitle: 'Premium Landing Entry',
      icon: Sparkles,
      content: (
        <div className="h-full flex flex-col items-center justify-between p-8 bg-gradient-to-b from-[#0B0B0E] via-[#15151A] to-[#0B0B0E] relative overflow-hidden">
          {/* Animated Gold Flare */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div />
          
          <div className="text-center relative z-10">
            <motion.div 
              animate={{ rotateY: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="w-24 h-24 bg-gradient-to-br from-gold to-gold-dark rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-gold/20 border border-gold-light/30"
            >
              <Bike className="w-12 h-12 text-black" />
            </motion.div>
            <h1 className="text-4xl font-extrabold tracking-tighter italic text-white">
              MOTO<span className="text-gold">JÁ</span>
            </h1>
            <p className="text-xs tracking-widest text-gold-metallic font-bold uppercase mt-1">
              Premium Edition
            </p>
          </div>

          <div className="w-full text-center pb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-gold to-gold-metallic rounded-full mx-auto mb-4 animate-pulse" />
            <p className="text-[10px] text-text-sec uppercase tracking-widest">
              Conectando Destinos
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'onboarding1',
      title: '2. Onboarding I',
      subtitle: 'Fast and Professional Transport',
      icon: Compass,
      content: (
        <div className="h-full flex flex-col justify-between p-8 bg-[#0B0B0E] relative overflow-hidden">
          <div className="absolute top-10 right-6 text-xs text-gold font-bold uppercase tracking-wider">
            Pular
          </div>

          {/* 3D Visual Asset representation */}
          <div className="relative flex-1 flex items-center justify-center">
            <div className="absolute w-56 h-56 bg-gold/5 rounded-full blur-3xl" />
            <div className="w-48 h-48 bg-surface rounded-3xl border border-stroke flex items-center justify-center shadow-2xl relative rotate-6">
              <Bike className="w-24 h-24 text-gold animate-bounce" />
              <div className="absolute -bottom-2 -right-2 bg-gold text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Fast
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white leading-none">
                AGILIDADE DE VERDADE
              </h2>
              <p className="text-xs text-text-sec leading-relaxed">
                Chegue ao seu destino sem o estresse do trânsito. O melhor serviço de mototáxi da região.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-6 h-1.5 rounded-full bg-gold" />
                <span className="w-2 h-1.5 rounded-full bg-stroke" />
                <span className="w-2 h-1.5 rounded-full bg-stroke" />
              </div>
              <button className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-black shadow-lg shadow-gold/20">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'onboarding2',
      title: '3. Onboarding II',
      subtitle: 'Safety First',
      icon: Shield,
      content: (
        <div className="h-full flex flex-col justify-between p-8 bg-[#0B0B0E] relative overflow-hidden">
          <div className="absolute top-10 right-6 text-xs text-gold font-bold uppercase tracking-wider">
            Pular
          </div>

          <div className="relative flex-1 flex items-center justify-center">
            <div className="absolute w-56 h-56 bg-gold/5 rounded-full blur-3xl" />
            <div className="w-48 h-48 bg-surface rounded-3xl border border-stroke flex items-center justify-center shadow-2xl relative -rotate-6">
              <Shield className="w-24 h-24 text-gold-metallic" />
              <div className="absolute -top-2 -left-2 bg-success text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Seguro
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white leading-none">
                SEGURANÇA PREMIUM
              </h2>
              <p className="text-xs text-text-sec leading-relaxed">
                Todos os nossos pilotos são rigorosamente selecionados e equipados com equipamentos de segurança certificados.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-2 h-1.5 rounded-full bg-stroke" />
                <span className="w-6 h-1.5 rounded-full bg-gold" />
                <span className="w-2 h-1.5 rounded-full bg-stroke" />
              </div>
              <button className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-black shadow-lg shadow-gold/20">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'onboarding3',
      title: '4. Onboarding III',
      subtitle: 'Deliveries & More',
      icon: Briefcase,
      content: (
        <div className="h-full flex flex-col justify-between p-8 bg-[#0B0B0E] relative overflow-hidden">
          <div className="absolute top-10 right-6 text-xs text-gold font-bold uppercase tracking-wider">
            Pular
          </div>

          <div className="relative flex-1 flex items-center justify-center">
            <div className="absolute w-56 h-56 bg-gold/5 rounded-full blur-3xl" />
            <div className="w-48 h-48 bg-surface rounded-3xl border border-stroke flex items-center justify-center shadow-2xl relative rotate-3">
              <Gift className="w-24 h-24 text-gold" />
              <div className="absolute -bottom-2 -left-2 bg-gold-dark text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Entregas
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white leading-none">
                ENVIOS E ENCOMENDAS
              </h2>
              <p className="text-xs text-text-sec leading-relaxed">
                Envie documentos, mercadorias ou compre na farmácia local. Rápido, seguro e sob demanda.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-2 h-1.5 rounded-full bg-stroke" />
                <span className="w-2 h-1.5 rounded-full bg-stroke" />
                <span className="w-6 h-1.5 rounded-full bg-gold" />
              </div>
              <button className="bg-gold px-6 py-2.5 rounded-full text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-gold/20">
                Começar
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'login',
      title: '5. Login Flow',
      subtitle: 'Secure Fast Pass',
      icon: User,
      content: (
        <div className="h-full flex flex-col justify-between p-8 bg-[#0B0B0E]">
          <div className="mt-8">
            <h2 className="text-3xl font-black text-white leading-none mb-2">
              MOTO<span className="text-gold">JÁ</span>
            </h2>
            <p className="text-xs text-text-sec">Digite seu número para entrar ou criar conta.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Celular / Telefone</label>
              <div className="bg-surface border border-stroke rounded-2xl p-4 flex items-center gap-3">
                <span className="text-white font-bold border-r border-stroke pr-3">+55</span>
                <input 
                  type="text" 
                  placeholder="(73) 99999-9999" 
                  disabled
                  className="bg-transparent border-none text-white focus:outline-none text-sm w-full" 
                />
              </div>
            </div>

            <div className="bg-surface-secondary/50 border border-stroke rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Login por Biometria</p>
                  <p className="text-[10px] text-text-sec">Mais rápido e seguro</p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center text-black">
                <Star className="w-3.5 h-3.5 fill-black" />
              </div>
            </div>

            <button className="w-full bg-gold text-black font-extrabold py-4 rounded-2xl shadow-lg shadow-gold/20 text-xs uppercase tracking-widest">
              Enviar Código SMS
            </button>
          </div>

          <p className="text-[10px] text-text-sec text-center leading-relaxed">
            Ao continuar você concorda com nossos <span className="text-gold underline">Termos de Serviço</span>.
          </p>
        </div>
      )
    },
    {
      id: 'home',
      title: '6. Home Dashboard',
      subtitle: 'Ituberá-BA Live Navigation',
      icon: Navigation,
      content: (
        <div className="h-full flex flex-col justify-between bg-[#0B0B0E] relative overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-stroke flex items-center justify-between bg-surface/50 backdrop-blur-md">
            <span className="text-sm font-black text-white italic">MOTOJÁ</span>
            <div className="bg-surface border border-stroke px-3 py-1 rounded-full text-[10px] font-bold text-gold-metallic">
              Ituberá - BA
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-4 space-y-4 flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface border border-stroke p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 rounded-full blur-xl" />
                <Bike className="w-8 h-8 text-gold" />
                <div>
                  <p className="font-bold text-sm text-white">Pedir Moto</p>
                  <p className="text-[10px] text-text-sec">Sua viagem rápida</p>
                </div>
              </div>

              <div className="bg-surface border border-stroke p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl" />
                <Briefcase className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-bold text-sm text-white">Entregas</p>
                  <p className="text-[10px] text-text-sec">Envio expresso</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#1E1E26] to-[#15151A] border border-stroke rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Voucher Premium Ativo</p>
                  <p className="text-[10px] text-gold-metallic">20% de Desconto na próxima</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gold" />
            </div>
          </div>

          {/* Bottom input */}
          <div className="p-4 bg-surface border-t border-stroke">
            <div className="bg-surface-secondary border border-stroke rounded-2xl p-4 flex items-center gap-3">
              <Search className="w-5 h-5 text-gold" />
              <span className="text-xs text-text-sec">Para onde vamos hoje?</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'search',
      title: '7. Buscar Destino',
      subtitle: 'Premium Smart Search',
      icon: Search,
      content: (
        <div className="h-full flex flex-col bg-[#0B0B0E] p-6 justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button className="p-2 bg-surface border border-stroke rounded-xl text-white">
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-bold text-white">Definir Trajeto</h2>
            </div>

            <div className="space-y-3 relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-dashed bg-stroke" />
              
              <div className="bg-surface border border-stroke rounded-2xl p-4 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-[10px] text-text-sec uppercase tracking-wider font-bold">Origem</p>
                  <p className="text-xs font-semibold text-white">Minha Localização</p>
                </div>
              </div>

              <div className="bg-surface border border-stroke rounded-2xl p-4 flex items-center gap-3 border-gold/40">
                <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                <div className="flex-1">
                  <p className="text-[10px] text-gold uppercase tracking-wider font-bold">Destino</p>
                  <p className="text-xs font-semibold text-white/50">Praça da Matriz, Ituberá-BA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] text-text-sec uppercase tracking-widest font-bold">Histórico Recente</p>
            <div className="space-y-2">
              {[
                { name: 'Centro Comercial', address: 'Av. Principal, 120' },
                { name: 'Terminal Rodoviário', address: 'Praça das Nações' }
              ].map((item, idx) => (
                <div key={idx} className="bg-surface/50 border border-stroke rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-text-sec" />
                    <div>
                      <p className="text-xs font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-text-sec">{item.address}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-sec" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'confirm',
      title: '8. Confirmar Corrida',
      subtitle: 'Ride Category & Payment',
      icon: CreditCard,
      content: (
        <div className="h-full flex flex-col justify-between bg-[#0B0B0E] p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Selecione o Serviço</h2>
            
            <div className="bg-gradient-to-r from-gold/10 to-transparent border border-gold rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">MotoJá Premium</p>
                    <Badge variant="premium">Mais Rápido</Badge>
                  </div>
                  <p className="text-[10px] text-text-sec">Aproximadamente 4 minutos de espera</p>
                </div>
              </div>
              <p className="text-base font-black text-gold">R$ 8,50</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-surface border border-stroke rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-xs font-bold text-white">Pagamento em Dinheiro</p>
                  <p className="text-[10px] text-text-sec">Toque para alterar</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-sec" />
            </div>

            <button className="w-full bg-gold text-black font-extrabold py-4 rounded-2xl shadow-lg shadow-gold/20 text-xs uppercase tracking-widest">
              Confirmar Categoria
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'searching',
      title: '9. Buscando Motorista',
      subtitle: 'Connecting to Closest Rider',
      icon: Rotate3d,
      content: (
        <div className="h-full flex flex-col justify-between bg-[#0B0B0E] p-6 text-center">
          <div />

          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 border-4 border-gold/20 rounded-full animate-ping" />
            <div className="absolute inset-0 border-4 border-gold rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center bg-surface border border-stroke rounded-full">
              <Bike className="w-12 h-12 text-gold" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Buscando Piloto Próximo</h3>
            <p className="text-xs text-text-sec">Estamos encontrando a moto ideal para sua viagem em Ituberá-BA.</p>
          </div>

          <button className="text-xs text-red-500 font-bold uppercase tracking-wider">
            Cancelar Solicitação
          </button>
        </div>
      )
    },
    {
      id: 'accepted',
      title: '10. Corrida Aceita',
      subtitle: 'Fidelity Driver Card Info',
      icon: CheckCircle,
      content: (
        <div className="h-full flex flex-col justify-between bg-[#0B0B0E] p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-sec">Piloto Confirmado</p>
                <h3 className="text-lg font-bold text-white">Chegada em 3 min</h3>
              </div>
              <Badge variant="verified">Verificado</Badge>
            </div>

            <div className="bg-surface border border-stroke rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-surface-secondary rounded-xl overflow-hidden border border-stroke">
                  <img src="https://picsum.photos/seed/moto/200" alt="Piloto" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="font-bold text-sm text-white">Marcos Oliveira</p>
                    <Badge variant="premium">Alta Pontualidade</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-sec">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                    <span>4.95</span>
                    <span>•</span>
                    <span>Honda CB 300F</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface-secondary border border-stroke px-2.5 py-1 rounded text-[10px] font-black text-gold">
                PLACA-3D
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-surface border border-stroke text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider">
              Chat
            </button>
            <button className="bg-gold text-black font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-gold/10">
              Ligar
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'intrip',
      title: '11. Em Viagem',
      subtitle: 'Real-Time Track Display',
      icon: Navigation,
      content: (
        <div className="h-full flex flex-col justify-between bg-[#0B0B0E] p-6">
          <div className="space-y-4">
            <div className="bg-surface border border-stroke rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-white">Viagem em Andamento</p>
                  <p className="text-[10px] text-text-sec">Destino: Praça da Matriz</p>
                </div>
              </div>
              <p className="text-xs font-bold text-gold">ETA 5 min</p>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <div className="w-full h-24 bg-surface-secondary border border-stroke rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gold/5 blur-xl" />
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest relative z-10">
                Acelerando com segurança
              </p>
            </div>

            <button className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-widest">
              Botão de Pânico / SOS
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'ended',
      title: '12. Corrida Finalizada',
      subtitle: 'Detailed Summary Card',
      icon: Award,
      content: (
        <div className="h-full flex flex-col justify-between bg-[#0B0B0E] p-6 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success border border-success/20">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Obrigado por Viajar!</h2>
            <p className="text-xs text-text-sec">Sua corrida foi concluída com sucesso em Ituberá-BA.</p>
          </div>

          <div className="bg-surface border border-stroke rounded-2xl p-4 text-left space-y-3">
            <div className="flex justify-between items-center border-b border-stroke pb-3">
              <span className="text-xs text-text-sec">Preço Final</span>
              <span className="text-sm font-bold text-gold">R$ 8,50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-sec">Forma de Pagamento</span>
              <span className="text-xs text-white">Dinheiro</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] text-text-sec uppercase tracking-wider font-bold">Avalie sua experiência</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 text-gold fill-gold" />
              ))}
            </div>

            <button className="w-full bg-gold text-black font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-gold/20">
              Pronto
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'history',
      title: '13. Histórico',
      subtitle: 'List of Premium Rides',
      icon: History,
      content: (
        <div className="h-full flex flex-col bg-[#0B0B0E] p-6 justify-between">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Minhas Corridas</h2>

            <div className="space-y-3">
              {[
                { date: 'Hoje, 14:20', dest: 'Matriz', price: 'R$ 8,50', status: 'Concluído' },
                { date: 'Ontem, 09:15', dest: 'Praia', price: 'R$ 12,00', status: 'Concluído' },
                { date: '12 Jan, 18:30', dest: 'Centro', price: 'R$ 6,50', status: 'Cancelado' }
              ].map((item, idx) => (
                <div key={idx} className="bg-surface border border-stroke rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1E1E26] border border-stroke rounded-xl flex items-center justify-center text-gold">
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{item.dest}</p>
                      <p className="text-[10px] text-text-sec">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">{item.price}</p>
                    <p className={cn(
                      "text-[9px] font-bold uppercase",
                      item.status === 'Concluído' ? "text-success" : "text-red-500"
                    )}>{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      title: '14. Perfil Passageiro',
      subtitle: 'Premium Loyalty Tier Level',
      icon: User,
      content: (
        <div className="h-full flex flex-col bg-[#0B0B0E] p-6 justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-surface-secondary border border-stroke rounded-2xl overflow-hidden">
                <img src="https://picsum.photos/seed/user/200" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Olá, Thiago Nishi</h3>
                <p className="text-xs text-text-sec">Membro desde 2024</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gold-dark/20 to-transparent border border-gold-metallic/30 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl" />
              <p className="text-[10px] text-gold uppercase tracking-widest font-black mb-1">Nível de Passageiro</p>
              <h4 className="text-lg font-black text-white italic">MEMBRO OURO</h4>
              <p className="text-xs text-text-sec mt-2">Você possui prioridade em corridas em Ituberá-BA e suporte VIP.</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-surface border border-stroke rounded-xl p-3.5 flex items-center justify-between text-xs font-bold">
              <span>Dados Pessoais</span>
              <ChevronRight className="w-4 h-4 text-text-sec" />
            </div>
            <div className="bg-surface border border-stroke rounded-xl p-3.5 flex items-center justify-between text-xs font-bold">
              <span>Segurança da Conta</span>
              <ChevronRight className="w-4 h-4 text-text-sec" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'support',
      title: '15. Suporte Técnico',
      subtitle: 'Direct AI Support Panel',
      icon: HelpCircle,
      content: (
        <div className="h-full flex flex-col bg-[#0B0B0E] p-6 justify-between">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Central de Suporte</h2>
            <p className="text-xs text-text-sec">Fale com nossa inteligência artificial para tirar suas dúvidas.</p>
          </div>

          <div className="bg-surface border border-stroke rounded-2xl p-4 space-y-3">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <Star className="w-4 h-4" />
              </div>
              <div className="bg-surface-secondary border border-stroke p-3 rounded-2xl rounded-tl-none text-xs text-white">
                Como posso te ajudar hoje na MotoJá?
              </div>
            </div>
          </div>

          <button className="w-full bg-gold text-black font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-gold/20">
            Falar com a IA
          </button>
        </div>
      )
    },
    {
      id: 'notifications',
      title: '16. Notificações',
      subtitle: 'Offers, Vouchers & Alerts',
      icon: Gift,
      content: (
        <div className="h-full flex flex-col bg-[#0B0B0E] p-6 justify-between">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Notificações</h2>

            <div className="space-y-3">
              <div className="bg-surface border border-stroke rounded-2xl p-4 space-y-2">
                <div className="flex justify-between">
                  <Badge variant="premium">Desconto</Badge>
                  <span className="text-[10px] text-text-sec">10 min atrás</span>
                </div>
                <h4 className="text-xs font-bold text-white">Cupom Especial</h4>
                <p className="text-[11px] text-text-sec">Utilize o cupom MOTO3D para ganhar 15% em qualquer corrida.</p>
              </div>

              <div className="bg-surface border border-stroke rounded-2xl p-4 space-y-2">
                <div className="flex justify-between">
                  <Badge variant="verified">Novidade</Badge>
                  <span className="text-[10px] text-text-sec">1 dia atrás</span>
                </div>
                <h4 className="text-xs font-bold text-white">Novas Motos na Frota</h4>
                <p className="text-[11px] text-text-sec">Mais modelos premium para suas viagens rápidas diárias.</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-white p-4 sm:p-8 flex flex-col">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stroke pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-black shadow-lg shadow-gold/20">
              <Rotate3d className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">
                MOTOJÁ <span className="text-gold">3D STUDIO</span>
              </h1>
              <p className="text-xs text-text-sec">Estúdio Visual, Design System, Badges e Mockups Premium</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onBackToApp}
          className="bg-surface border border-stroke hover:bg-surface-secondary text-white font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <Compass className="w-4 h-4 text-gold" />
          Voltar para o App
        </button>
      </div>

      {/* Main Studio Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Side: Mockup Controller / Studio Navigation */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface border border-stroke rounded-2xl p-4 flex flex-col gap-2">
            <p className="text-[10px] text-gold uppercase tracking-wider font-extrabold mb-2">Seções do Estúdio</p>
            
            <button 
              onClick={() => setActiveTab('screens')}
              className={cn(
                "w-full flex items-center gap-3 p-3.5 rounded-xl text-left text-sm font-bold transition-all border",
                activeTab === 'screens' 
                  ? "bg-gold text-black border-gold shadow-lg shadow-gold/10" 
                  : "bg-surface-secondary/50 border-stroke text-text-sec hover:text-white"
              )}
            >
              <Smartphone className="w-4 h-4" />
              16 Telas do Aplicativo
            </button>

            <button 
              onClick={() => setActiveTab('designSystem')}
              className={cn(
                "w-full flex items-center gap-3 p-3.5 rounded-xl text-left text-sm font-bold transition-all border",
                activeTab === 'designSystem' 
                  ? "bg-gold text-black border-gold shadow-lg shadow-gold/10" 
                  : "bg-surface-secondary/50 border-stroke text-text-sec hover:text-white"
              )}
            >
              <Palette className="w-4 h-4" />
              Design System Tokens
            </button>

            <button 
              onClick={() => setActiveTab('badges')}
              className={cn(
                "w-full flex items-center gap-3 p-3.5 rounded-xl text-left text-sm font-bold transition-all border",
                activeTab === 'badges' 
                  ? "bg-gold text-black border-gold shadow-lg shadow-gold/10" 
                  : "bg-surface-secondary/50 border-stroke text-text-sec hover:text-white"
              )}
            >
              <Award className="w-4 h-4" />
              Selo / Badges Concept
            </button>

            <button 
              onClick={() => setActiveTab('media')}
              className={cn(
                "w-full flex items-center gap-3 p-3.5 rounded-xl text-left text-sm font-bold transition-all border",
                activeTab === 'media' 
                  ? "bg-gold text-black border-gold shadow-lg shadow-gold/10" 
                  : "bg-surface-secondary/50 border-stroke text-text-sec hover:text-white"
              )}
            >
              <Image className="w-4 h-4" />
              Mídia Extra e Lojas
            </button>
          </div>

          {/* Tab Specific Navigation */}
          <AnimatePresence mode="wait">
            {activeTab === 'screens' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-surface border border-stroke rounded-2xl p-4 flex-1 flex flex-col overflow-hidden max-h-[500px]"
              >
                <p className="text-[10px] text-gold uppercase tracking-wider font-extrabold mb-3">Navegar Telas</p>
                <div className="flex-1 overflow-y-auto pr-2 space-y-1 scrollbar-thin">
                  {screens.map((screen, idx) => (
                    <button
                      key={screen.id}
                      onClick={() => setActiveScreen(idx)}
                      className={cn(
                        "w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors",
                        activeScreen === idx 
                          ? "bg-gold/10 text-gold font-bold" 
                          : "hover:bg-white/5 text-text-sec"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <screen.icon className="w-4 h-4" />
                        <span>{screen.title}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'designSystem' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-surface border border-stroke rounded-2xl p-4 space-y-4"
              >
                <p className="text-[10px] text-gold uppercase tracking-wider font-extrabold">Parâmetros 3D</p>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-text-sec">
                    <span>Rotação Y</span>
                    <span>{rotationY}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="-45" 
                    max="45" 
                    value={rotationY} 
                    onChange={(e) => setRotationY(Number(e.target.value))}
                    className="w-full accent-gold bg-stroke rounded-lg h-1.5" 
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-text-sec">
                    <span>Rotação X</span>
                    <span>{rotationX}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="-45" 
                    max="45" 
                    value={rotationX} 
                    onChange={(e) => setRotationX(Number(e.target.value))}
                    className="w-full accent-gold bg-stroke rounded-lg h-1.5" 
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-text-sec">
                    <span>Brilho Metálico</span>
                    <span>{glowIntensity}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={glowIntensity} 
                    onChange={(e) => setGlowIntensity(Number(e.target.value))}
                    className="w-full accent-gold bg-stroke rounded-lg h-1.5" 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Middle and Right: Interactive 3D Phone Previewer or Custom Spec Views */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {activeTab === 'screens' && (
              <motion.div 
                key="screens-studio"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
                {/* 3D Smartphone Isometric Viewport */}
                <div className="md:col-span-6 flex justify-center">
                  <div className="perspective-[1200px]">
                    <motion.div 
                      style={{ 
                        transform: `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`,
                        transformStyle: 'preserve-3d',
                        boxShadow: `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px rgba(212, 175, 55, ${glowIntensity / 400})`
                      }}
                      className="w-72 h-[580px] bg-[#1E1E26] border-4 border-stroke rounded-[40px] p-2 flex flex-col relative overflow-hidden transition-all duration-300"
                    >
                      {/* Inner Glass Frame */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-[36px]" />
                      
                      {/* Dynamic Notch */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-between px-3">
                        <div className="w-1.5 h-1.5 bg-neutral-800 rounded-full" />
                        <div className="w-12 h-1 bg-neutral-800 rounded-full" />
                      </div>

                      {/* Phone Screen Viewport */}
                      <div className="flex-1 rounded-[32px] overflow-hidden bg-black border border-stroke relative">
                        {screens[activeScreen].content}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Details card explaining the screen's design strategy */}
                <div className="md:col-span-6 space-y-6">
                  <div className="bg-surface border border-stroke rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 bg-gold/10 rounded-xl text-gold">
                        {React.createElement(screens[activeScreen].icon, { className: 'w-6 h-6' })}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-lg">{screens[activeScreen].title}</h3>
                        <p className="text-xs text-gold-metallic font-semibold">{screens[activeScreen].subtitle}</p>
                      </div>
                    </div>
                    <p className="text-xs text-text-sec leading-relaxed">
                      Esta interface foi desenhada seguindo as especificações mais exigentes de UX para aplicativos de transporte de alta performance. O fundo escuro (#0B0B0E) reduz a fadiga ocular, enquanto o dourado (#FFC107) guia o olhar do passageiro para as interações críticas de tomada de decisão.
                    </p>
                  </div>

                  <div className="bg-surface border border-stroke rounded-2xl p-6 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Pontos de Otimização Visual</h4>
                    <div className="space-y-3">
                      <div className="flex gap-3 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5" />
                        <p className="text-text-sec"><span className="text-white font-bold">Contrast Ratio:</span> Atende às recomendações de acessibilidade em telas AMOLED de alto brilho.</p>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5" />
                        <p className="text-text-sec"><span className="text-white font-bold">Glow & Reflection:</span> Simulação de iluminação física para um acabamento fotorrealista premium.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'designSystem' && (
              <motion.div 
                key="design-system"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Visual Tokens Matrix */}
                <div className="bg-surface border border-stroke rounded-2xl p-6">
                  <h3 className="text-lg font-extrabold text-white mb-6">Paleta Cromática de Alta Fidelidade</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'Fundo Primário', hex: '#0B0B0E', text: 'text-white' },
                      { name: 'Superfície', hex: '#15151A', text: 'text-white' },
                      { name: 'Dourado Principal', hex: '#FFC107', text: 'text-black' },
                      { name: 'Dourado Metálico', hex: '#D4AF37', text: 'text-black' },
                      { name: 'Verde Sucesso', hex: '#3DDC97', text: 'text-black' },
                      { name: 'Vermelho Erro', hex: '#FF4D4D', text: 'text-white' }
                    ].map((color, idx) => (
                      <div 
                        key={idx} 
                        style={{ backgroundColor: color.hex }}
                        className={cn(
                          "h-24 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group border border-white/5",
                          color.text
                        )}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{color.name}</span>
                        <span className="text-xs font-mono font-bold">{color.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3D Button Concept Showcase */}
                <div className="bg-surface border border-stroke rounded-2xl p-6 space-y-6">
                  <h3 className="text-lg font-extrabold text-white">Botões Dinâmicos Premium</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Primary Shiny Button */}
                    <div className="bg-surface-secondary border border-stroke p-4 rounded-xl flex flex-col justify-between h-36">
                      <p className="text-[10px] text-text-sec uppercase tracking-wider font-bold">Botão Primário</p>
                      <button className="w-full bg-gold hover:bg-gold-light text-black font-extrabold py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-gold/20 transition-transform active:scale-95">
                        Pedir MotoJá
                      </button>
                    </div>

                    {/* Glossy Translucent Glassmorphic Button */}
                    <div className="bg-surface-secondary border border-stroke p-4 rounded-xl flex flex-col justify-between h-36">
                      <p className="text-[10px] text-text-sec uppercase tracking-wider font-bold">Botão Secundário</p>
                      <button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-widest transition-transform active:scale-95">
                        Cancelar Viagem
                      </button>
                    </div>

                    {/* Golden Ring Glow Button */}
                    <div className="bg-surface-secondary border border-stroke p-4 rounded-xl flex flex-col justify-between h-36">
                      <p className="text-[10px] text-text-sec uppercase tracking-wider font-bold">Botão com Brilho</p>
                      <button className="w-full bg-black border border-gold hover:bg-gold/10 text-gold font-extrabold py-3 rounded-xl text-xs uppercase tracking-widest transition-transform active:scale-95 shadow-lg shadow-gold/10">
                        Área VIP
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'badges' && (
              <motion.div 
                key="badges-showcase"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Passenger Badges */}
                <div className="bg-surface border border-stroke rounded-2xl p-6 space-y-6">
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <User className="text-gold" /> Selos do Passageiro
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Verificado', desc: 'Identidade e número validados', icon: CheckCircle },
                      { name: 'Bom Passageiro', desc: 'Pontuação alta nas avaliações', icon: Star },
                      { name: 'Pagamento Confiável', desc: 'Formas de pagamento integradas', icon: CreditCard }
                    ].map((badge, idx) => (
                      <div key={idx} className="bg-surface-secondary border border-stroke p-4 rounded-xl flex items-center gap-4 hover:border-gold-metallic/30 transition-all">
                        <div className="w-10 h-10 bg-gold/10 border border-gold-metallic/20 rounded-xl flex items-center justify-center text-gold">
                          <badge.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white uppercase tracking-wider">{badge.name}</p>
                          <p className="text-[10px] text-text-sec">{badge.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Driver Badges */}
                <div className="bg-surface border border-stroke rounded-2xl p-6 space-y-6">
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Bike className="text-gold" /> Selos do Piloto
                  </h3>

                  <div className="space-y-4">
                    {[
                      { name: 'Piloto Verificado', desc: 'Habilitação e certidões ativas', icon: CheckCircle },
                      { name: 'Excelente Atendimento', desc: 'Classificação 4.9+ estrelas', icon: Star },
                      { name: 'Alta Pontualidade', desc: 'Tempo de espera preciso', icon: Compass },
                      { name: 'Premium', desc: 'Membro exclusivo elite', icon: Award }
                    ].map((badge, idx) => (
                      <div key={idx} className="bg-surface-secondary border border-stroke p-4 rounded-xl flex items-center gap-4 hover:border-gold-metallic/30 transition-all">
                        <div className="w-10 h-10 bg-gold/10 border border-gold-metallic/20 rounded-xl flex items-center justify-center text-gold">
                          <badge.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white uppercase tracking-wider">{badge.name}</p>
                          <p className="text-[10px] text-text-sec">{badge.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'media' && (
              <motion.div 
                key="media-assets"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Visual Store Assets */}
                <div className="bg-surface border border-stroke rounded-2xl p-6 space-y-6">
                  <h3 className="text-lg font-extrabold text-white">Assets Promocionais</h3>
                  
                  <div className="space-y-4">
                    {/* App Icon Representation */}
                    <div className="bg-[#1E1E26] border border-stroke p-6 rounded-2xl flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center shadow-2xl border border-gold-light/30">
                        <Bike className="w-12 h-12 text-black" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">App Icon Premium</h4>
                        <p className="text-[10px] text-text-sec">Apresentação com relevo 3D metálico e bordas arredondadas.</p>
                      </div>
                    </div>

                    {/* Feature Graphic Representation */}
                    <div className="bg-[#1E1E26] border border-stroke p-6 rounded-2xl space-y-3">
                      <h4 className="font-extrabold text-sm text-white">Play Store Banner</h4>
                      <p className="text-[10px] text-text-sec">Imersão paisagística da cidade de Ituberá-BA com piloto premium em alta velocidade.</p>
                    </div>
                  </div>
                </div>

                {/* Simulated Store Page */}
                <div className="bg-surface border border-stroke rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-extrabold text-white">Google Play Layout</h3>
                  
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center">
                        <Bike className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">MotoJá Premium</h4>
                        <p className="text-[10px] text-text-sec">Mobilidade Tecnológica • 5.0 ★</p>
                      </div>
                    </div>

                    <div className="bg-surface-secondary border border-stroke p-3 rounded-xl">
                      <p className="text-[10px] text-text-sec font-bold">O aplicativo definitivo de transporte e mototáxi em Ituberá-BA. Layout otimizado, segurança certificada e agilidade inteligente.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
