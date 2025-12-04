import { CropType } from '@/types/agriculture';
import { cn } from '@/lib/utils';

interface CropSelectorProps {
  selected: string;
  onSelect: (crop: string) => void;
}

const crops: { id: CropType; name: string; emoji: string }[] = [
  { id: 'wheat', name: 'Wheat', emoji: '🌾' },
  { id: 'rice', name: 'Rice', emoji: '🍚' },
  { id: 'corn', name: 'Corn', emoji: '🌽' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅' },
  { id: 'cotton', name: 'Cotton', emoji: '☁️' },
  { id: 'soybean', name: 'Soybean', emoji: '🫘' },
];

export const CropSelector = ({ selected, onSelect }: CropSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {crops.map((crop) => (
        <button
          key={crop.id}
          onClick={() => onSelect(crop.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200",
            "font-medium text-sm",
            selected === crop.id
              ? "bg-primary text-primary-foreground border-primary shadow-card"
              : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted"
          )}
        >
          <span className="text-lg">{crop.emoji}</span>
          {crop.name}
        </button>
      ))}
    </div>
  );
};
