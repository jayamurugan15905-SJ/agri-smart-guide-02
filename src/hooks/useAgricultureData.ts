import { useState, useEffect, useCallback } from 'react';
import { 
  SensorData, 
  CropHealthStatus, 
  IrrigationDecision, 
  Alert, 
  PredictionResult,
  CropType,
  CROP_IDEAL_CONDITIONS 
} from '@/types/agriculture';

const generateMockHistory = (): number[] => {
  const base = 45;
  return Array.from({ length: 7 }, (_, i) => 
    Math.max(20, Math.min(90, base + (Math.random() - 0.5) * 30 + i * 2))
  );
};

export const useAgricultureData = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    soilMoisture: 42,
    temperature: 28,
    humidity: 65,
    cropType: 'wheat',
    soilThreshold: 50,
    autoMode: true,
    moistureHistory: generateMockHistory(),
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Simulate sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ...prev,
        soilMoisture: Math.max(15, Math.min(95, prev.soilMoisture + (Math.random() - 0.5) * 3)),
        temperature: Math.max(10, Math.min(45, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(20, Math.min(95, prev.humidity + (Math.random() - 0.5) * 4)),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getCropHealth = useCallback((): CropHealthStatus => {
    const { soilMoisture, temperature, humidity, cropType, soilThreshold } = sensorData;
    const ideal = CROP_IDEAL_CONDITIONS[cropType as CropType] || CROP_IDEAL_CONDITIONS.wheat;
    
    const suggestions: string[] = [];
    let score = 100;

    // Check temperature
    if (temperature < ideal.temp[0]) {
      score -= 20;
      suggestions.push('Temperature is too low. Consider greenhouse protection.');
    } else if (temperature > ideal.temp[1]) {
      score -= 25;
      suggestions.push('High temperature stress. Increase irrigation frequency.');
    }

    // Check humidity
    if (humidity < ideal.humidity[0]) {
      score -= 15;
      suggestions.push('Low humidity. Consider misting or mulching.');
    } else if (humidity > ideal.humidity[1]) {
      score -= 10;
      suggestions.push('High humidity may cause fungal issues. Ensure ventilation.');
    }

    // Check soil moisture
    if (soilMoisture < soilThreshold) {
      score -= 30;
      suggestions.push('Soil is dry. Immediate irrigation recommended.');
    } else if (soilMoisture > ideal.moisture[1]) {
      score -= 15;
      suggestions.push('Soil may be waterlogged. Reduce irrigation.');
    }

    let condition: 'Good' | 'Moderate' | 'Poor';
    if (score >= 70) condition = 'Good';
    else if (score >= 40) condition = 'Moderate';
    else condition = 'Poor';

    return {
      condition,
      description: `${cropType.charAt(0).toUpperCase() + cropType.slice(1)} health is ${condition.toLowerCase()} based on current conditions.`,
      actionRequired: score < 50,
      suggestions: suggestions.length > 0 ? suggestions : ['All conditions optimal. Continue monitoring.'],
    };
  }, [sensorData]);

  const getIrrigationDecision = useCallback((): IrrigationDecision => {
    const { soilMoisture, soilThreshold, autoMode } = sensorData;

    if (!autoMode) {
      return { pumpStatus: 'MANUAL', reason: 'System is in manual control mode.' };
    }

    if (soilMoisture < soilThreshold) {
      return { pumpStatus: 'ON', reason: `Soil moisture (${soilMoisture.toFixed(1)}%) is below threshold (${soilThreshold}%).` };
    }

    return { pumpStatus: 'OFF', reason: `Soil moisture (${soilMoisture.toFixed(1)}%) is adequate.` };
  }, [sensorData]);

  const getPrediction = useCallback((): PredictionResult => {
    const { moistureHistory } = sensorData;
    const recent = moistureHistory.slice(-3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const first = recent[0];
    const last = recent[recent.length - 1];
    
    let trend: 'increasing' | 'decreasing' | 'stable';
    if (last - first > 5) trend = 'increasing';
    else if (first - last > 5) trend = 'decreasing';
    else trend = 'stable';

    const predicted = trend === 'increasing' ? avg + 5 : trend === 'decreasing' ? avg - 8 : avg;

    return {
      predictedMoisture: Math.max(10, Math.min(95, predicted)),
      needsIrrigation: predicted < sensorData.soilThreshold,
      trend,
    };
  }, [sensorData]);

  const generateAlerts = useCallback((): Alert[] => {
    const { soilMoisture, temperature, humidity, soilThreshold } = sensorData;
    const newAlerts: Alert[] = [];

    if (temperature > 38) {
      newAlerts.push({
        id: 'heat-stress',
        level: 'High',
        type: 'Heat Stress',
        message: `Critical temperature: ${temperature.toFixed(1)}°C`,
        action: 'Increase irrigation and provide shade if possible.',
        timestamp: new Date(),
      });
    } else if (temperature > 32) {
      newAlerts.push({
        id: 'heat-warning',
        level: 'Medium',
        type: 'High Temperature',
        message: `Temperature elevated: ${temperature.toFixed(1)}°C`,
        action: 'Monitor crops closely. Consider extra watering.',
        timestamp: new Date(),
      });
    }

    if (soilMoisture < soilThreshold - 15) {
      newAlerts.push({
        id: 'low-moisture',
        level: 'High',
        type: 'Low Soil Moisture',
        message: `Critical moisture: ${soilMoisture.toFixed(1)}%`,
        action: 'Immediate irrigation required.',
        timestamp: new Date(),
      });
    } else if (soilMoisture < soilThreshold) {
      newAlerts.push({
        id: 'moisture-warning',
        level: 'Medium',
        type: 'Below Threshold',
        message: `Moisture at ${soilMoisture.toFixed(1)}%`,
        action: 'Schedule irrigation soon.',
        timestamp: new Date(),
      });
    }

    if (humidity < 30) {
      newAlerts.push({
        id: 'low-humidity',
        level: 'Low',
        type: 'Low Humidity',
        message: `Humidity at ${humidity.toFixed(1)}%`,
        action: 'Consider misting or mulching.',
        timestamp: new Date(),
      });
    }

    return newAlerts;
  }, [sensorData]);

  useEffect(() => {
    setAlerts(generateAlerts());
  }, [generateAlerts]);

  const toggleAutoMode = () => {
    setSensorData(prev => ({ ...prev, autoMode: !prev.autoMode }));
  };

  const setCropType = (cropType: string) => {
    setSensorData(prev => ({ ...prev, cropType }));
  };

  const setThreshold = (threshold: number) => {
    setSensorData(prev => ({ ...prev, soilThreshold: threshold }));
  };

  return {
    sensorData,
    alerts,
    getCropHealth,
    getIrrigationDecision,
    getPrediction,
    toggleAutoMode,
    setCropType,
    setThreshold,
  };
};
