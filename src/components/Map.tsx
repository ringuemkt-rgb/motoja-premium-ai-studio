import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

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
    </div>
  );
}
