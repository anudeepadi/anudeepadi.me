"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Slide } from "../../animation/Slide";

interface SimulationParams {
  temperature: number; // °C
  flowRate: number; // kg/s
  depth: number; // meters
}

interface TooltipProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const InfoTooltip: React.FC<TooltipProps> = ({ title, description, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 w-64 p-3 mt-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg -translate-x-1/2 left-1/2">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h4>
          <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
        </div>
      )}
    </div>
  );
};

export default function SimulationDemo() {
  const [params, setParams] = useState<SimulationParams>({
    temperature: 150,
    flowRate: 50,
    depth: 2000,
  });

  // Geothermal calculations
  const calculations = useMemo(() => {
    const { temperature, flowRate, depth } = params;
    
    // Simplified geothermal power calculation
    const thermalEfficiency = Math.min(0.35, (temperature - 25) / 300);
    const powerOutput = flowRate * 4.18 * (temperature - 25) * thermalEfficiency; // kW
    
    // Resource estimate based on depth and temperature
    const resourceFactor = Math.log(depth / 1000 + 1) * (temperature / 100);
    const estimatedReserve = resourceFactor * flowRate * 365 * 24; // MWh/year
    
    // Efficiency metrics
    const heatExtraction = flowRate * 4.18 * (temperature - 25) / 1000; // MW thermal
    const conversionEfficiency = (powerOutput / 1000) / heatExtraction * 100;
    
    return {
      powerOutput: Math.max(0, powerOutput),
      estimatedReserve,
      heatExtraction,
      conversionEfficiency: Math.max(0, conversionEfficiency),
      thermalEfficiency: thermalEfficiency * 100,
    };
  }, [params]);

  // Generate performance data over time
  const performanceData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const tempVariation = params.temperature + Math.sin(i * Math.PI / 12) * 5;
      const flowVariation = params.flowRate * (0.9 + Math.sin(i * Math.PI / 8) * 0.1);
      const efficiency = Math.min(0.35, (tempVariation - 25) / 300);
      const power = flowVariation * 4.18 * (tempVariation - 25) * efficiency;
      
      return {
        hour: `${hour}:00`,
        power: Math.max(0, power),
        temperature: tempVariation,
        flow: flowVariation,
      };
    });
  }, [params]);

  const handleParamChange = (param: keyof SimulationParams, value: number) => {
    setParams(prev => ({ ...prev, [param]: value }));
  };

  return (
    <section className="mt-32 max-w-6xl">
      <Slide delay={0.17}>
        <div className="mb-8">
          <h2 className="text-4xl mb-4 font-bold tracking-tight">
            Geothermal Resource Calculator
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 max-w-3xl">
            Interactive simulation demonstrating geothermal energy potential calculations based on 
            reservoir temperature, fluid flow rate, and drilling depth. Adjust parameters to see 
            real-time impact on power generation and resource estimates.
          </p>
        </div>
      </Slide>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls Panel */}
        <Slide delay={0.25}>
          <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100">
              Simulation Parameters
            </h3>
            
            {/* Temperature Slider */}
            <div className="mb-6">
              <InfoTooltip
                title="Reservoir Temperature"
                description="Temperature of the geothermal fluid at the reservoir. Higher temperatures indicate better resource quality and power generation potential."
              >
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Temperature: {params.temperature}°C
                </label>
              </InfoTooltip>
              <input
                type="range"
                min="80"
                max="300"
                value={params.temperature}
                onChange={(e) => handleParamChange('temperature', Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                <span>80°C</span>
                <span>300°C</span>
              </div>
            </div>

            {/* Flow Rate Slider */}
            <div className="mb-6">
              <InfoTooltip
                title="Mass Flow Rate"
                description="Rate of geothermal fluid extraction from the reservoir. Higher flow rates can increase power output but may affect reservoir sustainability."
              >
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Flow Rate: {params.flowRate} kg/s
                </label>
              </InfoTooltip>
              <input
                type="range"
                min="10"
                max="200"
                value={params.flowRate}
                onChange={(e) => handleParamChange('flowRate', Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                <span>10 kg/s</span>
                <span>200 kg/s</span>
              </div>
            </div>

            {/* Depth Slider */}
            <div className="mb-6">
              <InfoTooltip
                title="Drilling Depth"
                description="Depth of the geothermal well. Deeper wells access higher temperatures but require greater investment and technical expertise."
              >
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Depth: {params.depth} m
                </label>
              </InfoTooltip>
              <input
                type="range"
                min="500"
                max="5000"
                value={params.depth}
                onChange={(e) => handleParamChange('depth', Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                <span>500m</span>
                <span>5000m</span>
              </div>
            </div>

            {/* Results */}
            <div className="border-t dark:border-zinc-700 border-zinc-300 pt-6">
              <h4 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                Calculated Results
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Power Output</p>
                  <p className="text-xl font-semibold text-primary-color">
                    {calculations.powerOutput.toFixed(1)} kW
                  </p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Efficiency</p>
                  <p className="text-xl font-semibold text-secondary-color">
                    {calculations.conversionEfficiency.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Heat Extraction</p>
                  <p className="text-xl font-semibold text-tertiary-color">
                    {calculations.heatExtraction.toFixed(1)} MW
                  </p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Annual Estimate</p>
                  <p className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
                    {(calculations.estimatedReserve / 1000).toFixed(0)} GWh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Visualization Panel */}
        <Slide delay={0.35}>
          <div className="space-y-6">
            {/* Power Output Chart */}
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                24-Hour Power Generation Profile
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="power"
                      stroke="#33E092"
                      fill="#33E092"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Temperature and Flow Chart */}
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                Resource Parameters Over Time
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#0CCE6B"
                      strokeWidth={2}
                      dot={{ fill: '#0CCE6B', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="flow"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={{ fill: '#16a34a', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Slide>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #33E092;
          cursor: pointer;
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #33E092;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </section>
  );
}