import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

interface DriverPosition {
  id: string;
  lat: number;
  lng: number;
  type: 'available' | 'delivery' | 'busy';
  name: string;
  rating?: number;
  vehicle?: string;
  plate?: string;
}

const ITUBERA_CENTER: [number, number] = [-13.7288, -39.1494];
const DEMO_DESTINATION: [number, number] = [-13.731, -39.145];

const createMotoIcon = (color: string) => {
  const svg = `
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="19" fill="#15151A" stroke="${color}" stroke-width="2.6"/>
    <circle cx="16" cy="27" r="3" fill="${color}"/>
    <circle cx="29" cy="27" r="3" fill="${color}"/>
    <path d="M16 27H29L26.5 20H21L18.5 27M26.5 20L24.5 15H21" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="22" cy="22" r="21" stroke="white" stroke-opacity="0.08"/>
  </svg>`;

  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -20],
  });
};

const availableIcon = createMotoIcon('#FFC107');
const deliveryIcon = createMotoIcon('#4A90E2');
const userIcon = createMotoIcon('#3DDC97');

export default function MotoJaMap() {
  const [drivers, setDrivers] = useState<DriverPosition[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number]>(ITUBERA_CENTER);

  useEffect(() => {
    const socket = io();
    socket.on('drivers_update', (updatedDrivers: DriverPosition[]) => setDrivers(updatedDrivers));
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setUserPosition(ITUBERA_CENTER),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  return (
    <div className="relative h-full w-full bg-[#0B0B0E]">
      <MapContainer center={userPosition} zoom={15} scrollWheelZoom className="h-full w-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <Marker position={userPosition} icon={userIcon}>
          <Popup>Você está aqui</Popup>
        </Marker>

        <Polyline positions={[userPosition, DEMO_DESTINATION]} pathOptions={{ color: '#FFC107', weight: 5, opacity: 0.75 }} />

        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            position={[driver.lat, driver.lng]}
            icon={driver.type === 'delivery' ? deliveryIcon : availableIcon}
          >
            <Popup>
              <div className="text-center">
                <p className="font-bold">{driver.name}</p>
                <p className="text-xs opacity-70">{driver.vehicle ?? 'MotoJá'} • {driver.plate ?? 'verificado'}</p>
                <p className="text-xs opacity-70">{driver.type === 'delivery' ? 'Em entrega' : 'Disponível'}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute left-4 top-24 z-[450] rounded-2xl border border-[#FFC107]/20 bg-[#15151A]/90 px-3 py-2 shadow-xl backdrop-blur">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#FFC107]">MotoJá Operação</p>
        <p className="text-xs text-[#B8B8C2]">Ituberá-BA • pilotos online: {drivers.length}</p>
      </div>
    </div>
  );
}
