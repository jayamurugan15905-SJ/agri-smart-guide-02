import { useAgricultureData } from '@/hooks/useAgricultureData';
import { SensorCard } from '@/components/SensorCard';
import { CropHealthPanel } from '@/components/CropHealthPanel';
import { IrrigationControl } from '@/components/IrrigationControl';
import { AlertsPanel } from '@/components/AlertsPanel';
import { MoistureChart } from '@/components/MoistureChart';
import { FarmerAssistant } from '@/components/FarmerAssistant';
import { CropSelector } from '@/components/CropSelector';
import { Droplets, Thermometer, CloudRain, Leaf } from 'lucide-react';
import { CROP_IDEAL_CONDITIONS, CropType } from '@/types/agriculture';

const Index = () => {
  const { 
    sensorData, 
    alerts,
    getCropHealth, 
    getIrrigationDecision, 
    getPrediction,
    toggleAutoMode,
    setCropType,
  } = useAgricultureData();

  const health = getCropHealth();
  const irrigation = getIrrigationDecision();
  const prediction = getPrediction();
  const idealConditions = CROP_IDEAL_CONDITIONS[sensorData.cropType as CropType] || CROP_IDEAL_CONDITIONS.wheat;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-earth shadow-card">
                <Leaf className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Smart Agriculture
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-Powered Crop Monitoring System
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">
                Live Monitoring
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Crop Selector */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Select Crop Type
          </h2>
          <CropSelector selected={sensorData.cropType} onSelect={setCropType} />
        </section>

        {/* Sensor Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard
            title="Soil Moisture"
            value={sensorData.soilMoisture}
            unit="%"
            icon={Droplets}
            color="water"
            optimal={idealConditions.moisture}
          />
          <SensorCard
            title="Temperature"
            value={sensorData.temperature}
            unit="°C"
            icon={Thermometer}
            color="sun"
            min={0}
            max={50}
            optimal={idealConditions.temp}
          />
          <SensorCard
            title="Humidity"
            value={sensorData.humidity}
            unit="%"
            icon={CloudRain}
            color="leaf"
            optimal={idealConditions.humidity}
          />
          <SensorCard
            title="Threshold"
            value={sensorData.soilThreshold}
            unit="%"
            icon={Droplets}
            color="soil"
          />
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <CropHealthPanel health={health} cropType={sensorData.cropType} />
            <MoistureChart 
              data={sensorData.moistureHistory} 
              threshold={sensorData.soilThreshold}
              prediction={prediction}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <IrrigationControl 
              decision={irrigation}
              autoMode={sensorData.autoMode}
              threshold={sensorData.soilThreshold}
              onToggleAuto={toggleAutoMode}
            />
            <AlertsPanel alerts={alerts} />
          </div>
        </div>

        {/* AI Assistant */}
        <section>
          <FarmerAssistant />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Smart Agriculture AI System • Real-time IoT Monitoring</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
