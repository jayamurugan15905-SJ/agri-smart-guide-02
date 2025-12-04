export interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  cropType: string;
  soilThreshold: number;
  autoMode: boolean;
  moistureHistory: number[];
}

export interface CropHealthStatus {
  condition: 'Good' | 'Moderate' | 'Poor';
  description: string;
  actionRequired: boolean;
  suggestions: string[];
}

export interface IrrigationDecision {
  pumpStatus: 'ON' | 'OFF' | 'MANUAL';
  reason: string;
}

export interface Alert {
  id: string;
  level: 'None' | 'Low' | 'Medium' | 'High';
  type: string;
  message: string;
  action: string;
  timestamp: Date;
}

export interface PredictionResult {
  predictedMoisture: number;
  needsIrrigation: boolean;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export type CropType = 'wheat' | 'rice' | 'corn' | 'tomato' | 'cotton' | 'soybean';

export const CROP_IDEAL_CONDITIONS: Record<CropType, { temp: [number, number]; humidity: [number, number]; moisture: [number, number] }> = {
  wheat: { temp: [15, 25], humidity: [40, 60], moisture: [45, 65] },
  rice: { temp: [20, 35], humidity: [70, 90], moisture: [70, 90] },
  corn: { temp: [18, 32], humidity: [50, 75], moisture: [50, 70] },
  tomato: { temp: [18, 27], humidity: [60, 80], moisture: [60, 80] },
  cotton: { temp: [21, 30], humidity: [40, 60], moisture: [50, 65] },
  soybean: { temp: [20, 30], humidity: [60, 80], moisture: [50, 70] },
};
