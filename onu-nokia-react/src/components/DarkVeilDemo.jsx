import { useState } from 'react';
import DarkVeil from './DarkVeil';

/**
 * Componente demo para showcasing do DarkVeil
 * Permite ajustar parâmetros em tempo real
 */
function DarkVeilDemo() {
  const [config, setConfig] = useState({
    hueShift: 0,
    noiseIntensity: 0.1,
    scanlineIntensity: 0.2,
    speed: 0.5,
    scanlineFrequency: 0.02,
    warpAmount: 0.3,
    resolutionScale: 1
  });

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: parseFloat(value)
    }));
  };

  return (
    <div className="darkveil-demo">
      <div className="card">
        <div className="card-header">
          <span className="icon">🌌</span>
          <h3>DarkVeil - Generative Art Demo</h3>
        </div>
        <div className="form">
          <div className="form-group">
            <label htmlFor="hueShift">Hue Shift ({config.hueShift}°)</label>
            <input
              type="range"
              id="hueShift"
              min="-180"
              max="180"
              step="1"
              value={config.hueShift}
              onChange={(e) => handleConfigChange('hueShift', e.target.value)}
              className="input-range"
            />
          </div>

          <div className="form-group">
            <label htmlFor="noiseIntensity">Noise Intensity ({config.noiseIntensity})</label>
            <input
              type="range"
              id="noiseIntensity"
              min="0"
              max="0.5"
              step="0.01"
              value={config.noiseIntensity}
              onChange={(e) => handleConfigChange('noiseIntensity', e.target.value)}
              className="input-range"
            />
          </div>

          <div className="form-group">
            <label htmlFor="scanlineIntensity">Scanline Intensity ({config.scanlineIntensity})</label>
            <input
              type="range"
              id="scanlineIntensity"
              min="0"
              max="1"
              step="0.01"
              value={config.scanlineIntensity}
              onChange={(e) => handleConfigChange('scanlineIntensity', e.target.value)}
              className="input-range"
            />
          </div>

          <div className="form-group">
            <label htmlFor="speed">Animation Speed ({config.speed}x)</label>
            <input
              type="range"
              id="speed"
              min="0"
              max="3"
              step="0.1"
              value={config.speed}
              onChange={(e) => handleConfigChange('speed', e.target.value)}
              className="input-range"
            />
          </div>

          <div className="form-group">
            <label htmlFor="scanlineFrequency">Scanline Frequency ({config.scanlineFrequency})</label>
            <input
              type="range"
              id="scanlineFrequency"
              min="0"
              max="0.1"
              step="0.001"
              value={config.scanlineFrequency}
              onChange={(e) => handleConfigChange('scanlineFrequency', e.target.value)}
              className="input-range"
            />
          </div>

          <div className="form-group">
            <label htmlFor="warpAmount">Warp Amount ({config.warpAmount})</label>
            <input
              type="range"
              id="warpAmount"
              min="0"
              max="2"
              step="0.1"
              value={config.warpAmount}
              onChange={(e) => handleConfigChange('warpAmount', e.target.value)}
              className="input-range"
            />
          </div>

          <div className="form-group">
            <label htmlFor="resolutionScale">Resolution Scale ({config.resolutionScale}x)</label>
            <input
              type="range"
              id="resolutionScale"
              min="0.5"
              max="2"
              step="0.1"
              value={config.resolutionScale}
              onChange={(e) => handleConfigChange('resolutionScale', e.target.value)}
              className="input-range"
            />
          </div>
        </div>
      </div>

      <div className="card darkveil-container">
        <div className="card-header">
          <span className="icon">🎨</span>
          <h3>DarkVeil Canvas</h3>
        </div>
        <div style={{ width: '100%', height: '400px', position: 'relative', padding: '1rem' }}>
          <DarkVeil {...config} />
        </div>
      </div>
    </div>
  );
}

export default DarkVeilDemo;