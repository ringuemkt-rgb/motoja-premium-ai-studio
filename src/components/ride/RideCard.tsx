import { Star, Bike } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

interface RideCardProps {
  driverName: string;
  rating: number;
  vehicle: string;
  plate: string;
  photo: string;
  className?: string;
}

export function RideCard({ driverName, rating, vehicle, plate, photo, className }: RideCardProps) {
  return (
    <div className={cn("bg-surface border border-stroke rounded-2xl p-4 shadow-lg flex items-center justify-between", className)}>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-surface-secondary rounded-xl overflow-hidden border border-stroke">
          <img src={photo} alt={driverName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-text-main">{driverName}</h3>
            <Badge variant="premium">Premium</Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-sec">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-gold fill-gold" />
              <span>{rating}</span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1"><Bike className="w-3 h-3" /> {vehicle}</span>
          </div>
        </div>
      </div>
      <div className="bg-surface-secondary text-gold-metallic text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider border border-gold-metallic/20">
        {plate}
      </div>
    </div>
  );
}
