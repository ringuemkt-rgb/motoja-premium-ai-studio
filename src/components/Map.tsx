import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, ShieldAlert, Check, Loader2, MapPin, X, Radio, MessageSquare, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createMotoIcon = (color: string) => {
  const motoIconSvg = `
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#151619" stroke="${color}" stroke-width="2.5"/>
    <path d="M13 24.5C13 25.3284 13.6716 26 14.5 26C15.3284 26 16 25.3284 16 24.5C16 23.6716 15.3284 23 14.5 23C13.6716 23 13 23.6716 13 24.5Z" fill="${color}"/>
    <path d="M24 24.5C24 25.3284 24.6716 26 25.5 26C26.3284 26 27 25.3284 27 24.5C27 23.6716 26.3284 23 25.5 23C24.6716 23 24 23.6716 24 24.5Z" fill="${color}"/>
    <path d="M14.5 24.5H25.5M25.5 24.5L23.5 18.5H18.5L16.5 24.5M23.5 18.5L21.5 14.5H18.5" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="20" cy="20" r="19" stroke="white" stroke-opacity="0.1" stroke-width="1"/>
  </svg>
  `;

  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(motoIconSvg)}`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const availableIcon = createMotoIcon('#f27d26'); // Orange for available
const deliveryIcon = createMotoIcon('#3b82f6'); // Blue for delivery

interface Driver {
  id: string;
  lat: number;
  lng: number;
  type: string;
  name: string;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function Map() {
  const [position, setPosition] = useState<[number, number]>([-23.5505, -46.6333]);
  const [userLocated, setUserLocated] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // SOS States
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sosActivated, setSosActivated] = useState(false);
  const [sosStep, setSosStep] = useState<number>(0);
  const [chatOpened, setChatOpened] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'support', text: string, time: string }>>([]);
  const [inputMsg, setInputMsg] = useState('');

  const holdTimerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  // Sound feedback
  const playBeep = (freq: number, duration: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio Context not allowed/supported:', e);
    }
  };

  useEffect(() => {
    // Connect to Socket.io server
    const socket = io();

    socket.on('drivers_update', (updatedDrivers: Driver[]) => {
      setDrivers(updatedDrivers);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setUserLocated(true);
        },
        (err) => {
          console.warn("Geolocation error:", err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Handle SOS activation step updates
  useEffect(() => {
    let stepTimer: any = null;
    if (sosActivated) {
      setSosStep(1);
      playBeep(987.77, 0.45); // High alarm beep (B5 note)
      
      stepTimer = setInterval(() => {
        setSosStep((prev) => {
          const next = prev + 1;
          if (next <= 5) {
            playBeep(prev % 2 === 0 ? 880 : 987.77, 0.15); // Staccato emergency chirp
            return next;
          } else {
            clearInterval(stepTimer);
            return prev;
          }
        });
      }, 700);

      // Prepopulate mock support system chat
      setMessages([
        { sender: 'support', text: '⚠️ [SISTEMA] Alerta de emergência de alta prioridade recebido!', time: 'Agora' },
        { sender: 'support', text: `📍 GPS Confirmado nas coordenadas: ${position[0].toFixed(6)}, ${position[1].toFixed(6)}`, time: 'Agora' },
        { sender: 'support', text: 'Estamos tentando contato telefônico e enviando a patrulha de mototáxis de segurança mais próxima de você em Ituberá-BA.', time: 'Agora' },
      ]);
    } else {
      setSosStep(0);
      setChatOpened(false);
      setMessages([]);
    }
    return () => {
      if (stepTimer) clearInterval(stepTimer);
    };
  }, [sosActivated]);

  // Handle real-time holding progress bar loop
  useEffect(() => {
    if (isHolding && !sosActivated) {
      const stepTimeMs = 20;
      const totalHoldMs = 2000;
      const increment = (stepTimeMs / totalHoldMs) * 100;
      
      playBeep(440, 0.05); // Initial sound tick

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + increment;
          if (next >= 100) {
            clearInterval(progressIntervalRef.current);
            setSosActivated(true);
            setIsHolding(false);
            return 100;
          }
          // Tick sound every 400ms while holding
          if (Math.floor(next) % 20 === 0) {
            playBeep(440 + next * 2, 0.04);
          }
          return next;
        });
      }, stepTimeMs);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setProgress(0);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isHolding, sosActivated]);

  const handleStartHold = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (sosActivated) return;
    setIsHolding(true);
  };

  const handleEndHold = () => {
    setIsHolding(false);
  };

  const cancelSos = () => {
    setSosActivated(false);
    setProgress(0);
    setSosStep(0);
    playBeep(330, 0.5); // Cancellation safe tone
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const newMsg = { sender: 'user' as const, text: inputMsg, time: 'Agora' };
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');

    // Simulated reply after 1s
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'support' as const, text: 'Nossa central recebeu sua mensagem. Um atendente de segurança está focado na sua rota.', time: 'Agora' }
      ]);
      playBeep(523.25, 0.15); // Notification sound
    }, 1200);
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {userLocated && (
          <Marker position={position}>
            <Popup>Você está aqui</Popup>
          </Marker>
        )}
        
        {/* Real-time drivers from WebSocket */}
        {drivers.map(driver => (
          <Marker 
            key={driver.id} 
            position={[driver.lat, driver.lng]} 
            icon={driver.type === 'available' ? availableIcon : deliveryIcon}
          >
            <Popup>
              <div className="text-center">
                <p className="font-bold">{driver.name}</p>
                <p className="text-xs opacity-70">
                  {driver.type === 'available' ? 'Disponível para Corrida' : 'Em Entrega'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        <ChangeView center={position} />
      </MapContainer>

      {/* FLOATING QUICK SOS BUTTON ON MAP */}
      <div className="absolute right-4 top-28 z-[450] flex flex-col items-center">
        <div className="relative">
          {/* Animated wave rings behind the button if holding or idle */}
          {!sosActivated && (
            <>
              <div className="absolute inset-0 bg-red-600/30 rounded-full animate-ping scale-110 pointer-events-none" />
              {isHolding && (
                <div className="absolute -inset-2 bg-amber-500/20 rounded-full animate-pulse pointer-events-none" />
              )}
            </>
          )}

          {/* Interactive hold target */}
          <button
            onMouseDown={handleStartHold}
            onTouchStart={handleStartHold}
            onMouseUp={handleEndHold}
            onMouseLeave={handleEndHold}
            onTouchEnd={handleEndHold}
            className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative select-none cursor-pointer ${
              sosActivated 
                ? 'bg-neutral-800 border-2 border-red-600 text-red-500 shadow-2xl shadow-red-600/10' 
                : isHolding 
                  ? 'bg-red-950 scale-110 text-white shadow-2xl shadow-red-600/60' 
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/40'
            }`}
          >
            {/* SVG Circular Progress Track with precise dimensions & responsive viewBox */}
            {!sosActivated && (
              <svg 
                viewBox="0 0 64 64" 
                className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none"
              >
                {/* Background Guide Ring */}
                <circle
                  cx="32"
                  cy="32"
                  r="27"
                  className="stroke-red-950/40"
                  strokeWidth="4"
                  fill="transparent"
                />
                
                {/* Animated Loading Ring with dynamic color shifts and drop-shadow */}
                <circle
                  cx="32"
                  cy="32"
                  r="27"
                  stroke={progress < 35 ? '#fbbf24' : progress < 75 ? '#f97316' : '#ef4444'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray="169.65"
                  strokeDashoffset={169.65 - (169.65 * progress) / 100}
                  className="transition-all duration-75 ease-linear"
                  style={{
                    filter: isHolding ? `drop-shadow(0px 0px 4px ${progress < 35 ? '#fbbf24' : progress < 75 ? '#f97316' : '#ef4444'})` : 'none',
                  }}
                />
              </svg>
            )}

            {/* Inner display */}
            {sosActivated ? (
              <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
            ) : isHolding ? (
              <div className="text-center font-black">
                <p className="text-[10px] uppercase leading-none text-amber-400 font-bold tracking-widest">HOLD</p>
                <p 
                  className="text-base font-black leading-none mt-0.5 transition-colors duration-150"
                  style={{ color: progress < 35 ? '#fbbf24' : progress < 75 ? '#f97316' : '#ef4444' }}
                >
                  {Math.floor(progress)}%
                </p>
              </div>
            ) : (
              <div className="text-center">
                <AlertTriangle className="w-5 h-5 mx-auto -mb-0.5" />
                <span className="text-[10px] font-black tracking-widest block leading-none">SOS</span>
              </div>
            )}
          </button>
        </div>

        {/* Small descriptive label */}
        <span className="mt-1.5 bg-[#151619]/90 border border-white/10 px-2 py-0.5 rounded-full text-[9px] font-bold text-red-400 tracking-wider uppercase backdrop-blur-sm shadow-md pointer-events-none">
          {sosActivated ? 'EMERGÊNCIA ATIVA' : isHolding ? 'Mantenha pressionado' : 'SOS Rápido 2s'}
        </span>
      </div>

      {/* DETAILED DISTRESS CONTROL COCKPIT */}
      <AnimatePresence>
        {sosActivated && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[420px] bg-[#0E0E12] border-2 border-red-600/60 rounded-[30px] p-5 shadow-[0_0_50px_rgba(239,68,68,0.25)] z-[460] overflow-hidden"
          >
            {/* Top Red Alert Header */}
            <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600/10 border border-red-500/30 rounded-xl flex items-center justify-center text-red-500 animate-pulse">
                  <Radio className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight text-white uppercase flex items-center gap-2">
                    MotoJá Socorro Direto
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  </h3>
                  <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold">Protocolo de Distress Ativo</p>
                </div>
              </div>
              <button 
                onClick={cancelSos}
                className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dynamic Status Progress and Map Coordinates */}
            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 animate-bounce" />
                <div>
                  <p className="text-[9px] text-white/50 uppercase tracking-wider font-bold">GPS Coordenadas Atuais</p>
                  <p className="text-xs font-mono font-bold text-white">
                    {position[0].toFixed(6)}, {position[1].toFixed(6)}
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-red-500 text-white font-black px-2 py-0.5 rounded-md uppercase animate-pulse">
                AO VIVO
              </span>
            </div>

            {/* Simulated Live Broadcast Stream */}
            <div className="bg-[#15161B] border border-white/5 rounded-2xl p-4 mb-4">
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-2 border-b border-white/5 pb-1.5">Sinais de Conexão</p>
              <div className="space-y-2 h-[115px] overflow-y-auto font-mono text-[10px] scrollbar-none">
                {sosStep >= 1 && (
                  <div className="flex items-start gap-1.5 text-yellow-500">
                    <span className="text-white/40">📡</span>
                    <p>Iniciando transmissão de socorro...</p>
                  </div>
                )}
                {sosStep >= 2 && (
                  <div className="flex items-start gap-1.5 text-blue-400">
                    <span className="text-white/40">📍</span>
                    <p>Coordenadas enviadas: {position[0].toFixed(5)}, {position[1].toFixed(5)}</p>
                  </div>
                )}
                {sosStep >= 3 && (
                  <div className="flex items-start gap-1.5 text-indigo-400">
                    <span className="text-white/40">💻</span>
                    <p>Conectando ao terminal de apoio central MotoJá...</p>
                  </div>
                )}
                {sosStep >= 4 && (
                  <div className="flex items-start gap-1.5 text-red-400">
                    <span className="text-white/40">🚨</span>
                    <p>Alerta propagado para 14 mototáxis próximos!</p>
                  </div>
                )}
                {sosStep >= 5 && (
                  <div className="flex items-start gap-1.5 text-emerald-400 animate-pulse font-bold">
                    <span className="text-white/40">✅</span>
                    <p>Conexão estabelecida. Suporte focado na rota.</p>
                  </div>
                )}

                {sosStep < 5 && (
                  <div className="flex items-center gap-1.5 text-white/30">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <p>Processando telemetria de segurança...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Chat toggler inside emergency panel */}
            {chatOpened ? (
              <div className="border border-white/10 rounded-2xl p-3 mb-4 bg-black/40">
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-2">
                  <span className="text-[10px] text-red-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Canal com Atendimento
                  </span>
                  <button onClick={() => setChatOpened(false)} className="text-[10px] text-white/40 hover:text-white font-bold">
                    Ocultar
                  </button>
                </div>
                <div className="space-y-2 max-h-[110px] overflow-y-auto mb-2 text-[11px] pr-1 scrollbar-thin">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-2 rounded-xl max-w-[85%] ${
                        m.sender === 'user' 
                          ? 'bg-red-600 text-white rounded-tr-none' 
                          : 'bg-neutral-800 text-white/90 rounded-tl-none border border-white/5'
                      }`}>
                        {m.text}
                      </div>
                      <span className="text-[8px] text-white/30 mt-0.5">{m.time}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-1.5">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="Envie sua mensagem rápida..."
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                  <button type="submit" className="bg-red-600 hover:bg-red-500 text-white px-3 rounded-xl font-bold text-xs">
                    Enviar
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => setChatOpened(true)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-red-400" />
                  Chat com Suporte
                </button>
                <button
                  onClick={() => {
                    playBeep(659.25, 0.2); // Dial sound
                    alert("Simulando chamada direta com Central de Emergência: 190 / Central MotoJá.");
                  }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  Ligar para Central
                </button>
              </div>
            )}

            {/* Direct Cancellation Control */}
            <button
              onClick={cancelSos}
              className="w-full bg-white text-black hover:bg-neutral-200 font-extrabold py-3 rounded-2xl text-xs uppercase tracking-widest transition-transform active:scale-[0.98] shadow-md shadow-black/35"
            >
              Cancelar Protocolo SOS
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
