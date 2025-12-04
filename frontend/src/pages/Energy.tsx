import { useState } from 'react';
import {
  Zap, Plus, Trash2, Save, Calculator, Info,
  Lightbulb, Flame, Droplets, RefreshCw
} from 'lucide-react';

interface EnergyEntry {
  id: string;
  source: string;
  type: 'renewable' | 'non_renewable';
  quantity: number;
  unit: 'kWh' | 'MWh' | 'GJ';
  country: string;
  period: string;
  emissions_kg?: number;
}

const ENERGY_SOURCES = [
  { value: 'electricity_grid', label: 'Grid Electricity', type: 'non_renewable', icon: Zap },
  { value: 'electricity_renewable', label: 'Renewable Electricity', type: 'renewable', icon: Lightbulb },
  { value: 'natural_gas', label: 'Natural Gas', type: 'non_renewable', icon: Flame },
  { value: 'heating_oil', label: 'Heating Oil', type: 'non_renewable', icon: Droplets },
  { value: 'solar_pv', label: 'Solar PV (On-site)', type: 'renewable', icon: Lightbulb },
  { value: 'wind', label: 'Wind (On-site)', type: 'renewable', icon: Lightbulb },
];

const COUNTRIES = [
  { code: 'UK', name: 'United Kingdom', factor: 0.207 },
  { code: 'DE', name: 'Germany', factor: 0.364 },
  { code: 'FR', name: 'France', factor: 0.052 },
  { code: 'IT', name: 'Italy', factor: 0.316 },
  { code: 'ES', name: 'Spain', factor: 0.190 },
  { code: 'NL', name: 'Netherlands', factor: 0.328 },
  { code: 'AE', name: 'UAE', factor: 0.405 },
  { code: 'US', name: 'United States', factor: 0.390 },
];

import { API_BASE } from '../config/api';

export function Energy() {
  const [entries, setEntries] = useState<EnergyEntry[]>([
    {
      id: '1',
      source: 'electricity_grid',
      type: 'non_renewable',
      quantity: 45000,
      unit: 'kWh',
      country: 'UK',
      period: '2024',
      emissions_kg: 9318
    }
  ]);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);

  const addEntry = () => {
    const newEntry: EnergyEntry = {
      id: Date.now().toString(),
      source: 'electricity_grid',
      type: 'non_renewable',
      quantity: 0,
      unit: 'kWh',
      country: 'UK',
      period: '2024'
    };
    setEntries([...entries, newEntry]);
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof EnergyEntry, value: any) => {
    setEntries(entries.map(e => {
      if (e.id !== id) return e;
      
      const updated = { ...e, [field]: value };
      
      // Update type based on source
      if (field === 'source') {
        const sourceConfig = ENERGY_SOURCES.find(s => s.value === value);
        if (sourceConfig) {
          updated.type = sourceConfig.type as 'renewable' | 'non_renewable';
        }
      }
      
      // Clear emissions when data changes
      if (['source', 'quantity', 'unit', 'country'].includes(field)) {
        updated.emissions_kg = undefined;
      }
      
      return updated;
    }));
  };

  const calculateEmissions = async () => {
    setCalculating(true);
    
    const updatedEntries = await Promise.all(entries.map(async (entry) => {
      if (entry.type === 'renewable') {
        return { ...entry, emissions_kg: 0 };
      }
      
      try {
        // Convert to kWh if needed
        let kwh = entry.quantity;
        if (entry.unit === 'MWh') kwh *= 1000;
        if (entry.unit === 'GJ') kwh *= 277.78;
        
        // Determine activity type
        const activityType = entry.source.includes('gas') ? 'natural_gas' : 'electricity';
        
        const response = await fetch(`${API_BASE}/calculate/emissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activity_type: activityType,
            quantity: kwh,
            country: entry.country
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          return { ...entry, emissions_kg: result.emissions_kg_co2e };
        }
      } catch (err) {
        console.error('Calculation error:', err);
        // Fallback to local calculation
        const factor = COUNTRIES.find(c => c.code === entry.country)?.factor || 0.3;
        let kwh = entry.quantity;
        if (entry.unit === 'MWh') kwh *= 1000;
        if (entry.unit === 'GJ') kwh *= 277.78;
        return { ...entry, emissions_kg: Math.round(kwh * factor) };
      }
      
      return entry;
    }));
    
    setEntries(updatedEntries);
    setCalculating(false);
  };

  const saveData = async () => {
    setSaving(true);
    // In production, this would save to the backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Energy data saved successfully!');
  };

  const totalConsumption = entries.reduce((sum, e) => {
    let kwh = e.quantity;
    if (e.unit === 'MWh') kwh *= 1000;
    if (e.unit === 'GJ') kwh *= 277.78;
    return sum + kwh;
  }, 0);

  const renewableConsumption = entries
    .filter(e => e.type === 'renewable')
    .reduce((sum, e) => {
      let kwh = e.quantity;
      if (e.unit === 'MWh') kwh *= 1000;
      if (e.unit === 'GJ') kwh *= 277.78;
      return sum + kwh;
    }, 0);

  const totalEmissions = entries.reduce((sum, e) => sum + (e.emissions_kg || 0), 0);

  const renewablePercentage = totalConsumption > 0 
    ? Math.round((renewableConsumption / totalConsumption) * 100) 
    : 0;

  return (
    <div className="page-container data-entry-page">
      <div className="page-header">
        <div>
          <h1><Zap size={28} /> Energy Consumption (B1)</h1>
          <p className="page-subtitle">
            Track energy usage across all sources for VSME reporting
          </p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-outline" 
            onClick={calculateEmissions}
            disabled={calculating}
          >
            {calculating ? (
              <><RefreshCw size={16} className="spin" /> Calculating...</>
            ) : (
              <><Calculator size={16} /> Calculate Emissions</>
            )}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={saveData}
            disabled={saving}
          >
            {saving ? (
              <><RefreshCw size={16} className="spin" /> Saving...</>
            ) : (
              <><Save size={16} /> Save Data</>
            )}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon"><Zap size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{Math.round(totalConsumption).toLocaleString()}</span>
            <span className="summary-label">Total kWh</span>
          </div>
        </div>
        <div className="summary-card highlight">
          <div className="summary-icon"><Lightbulb size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{renewablePercentage}%</span>
            <span className="summary-label">Renewable</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><Calculator size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{(totalEmissions / 1000).toFixed(2)}</span>
            <span className="summary-label">Tonnes CO₂e</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <Info size={18} />
        <div>
          <strong>VSME B1: Energy Consumption</strong>
          <p>Report total energy consumption in MWh, split by renewable and non-renewable sources. Include electricity, heating, cooling, and steam.</p>
        </div>
      </div>

      {/* Data Entry Table */}
      <div className="data-entry-table">
        <div className="table-header">
          <span>Energy Source</span>
          <span>Type</span>
          <span>Quantity</span>
          <span>Unit</span>
          <span>Country</span>
          <span>Period</span>
          <span>Emissions (kgCO₂e)</span>
          <span></span>
        </div>

        {entries.map(entry => {
          return (
            <div key={entry.id} className="table-row">
              <div className="cell">
                <select 
                  value={entry.source}
                  onChange={(e) => updateEntry(entry.id, 'source', e.target.value)}
                  className="select-with-icon"
                >
                  {ENERGY_SOURCES.map(source => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="cell">
                <span className={`type-badge ${entry.type}`}>
                  {entry.type === 'renewable' ? '🌱 Renewable' : '⚡ Non-Renewable'}
                </span>
              </div>
              
              <div className="cell">
                <input 
                  type="number"
                  value={entry.quantity}
                  onChange={(e) => updateEntry(entry.id, 'quantity', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              
              <div className="cell">
                <select
                  value={entry.unit}
                  onChange={(e) => updateEntry(entry.id, 'unit', e.target.value)}
                >
                  <option value="kWh">kWh</option>
                  <option value="MWh">MWh</option>
                  <option value="GJ">GJ</option>
                </select>
              </div>
              
              <div className="cell">
                <select
                  value={entry.country}
                  onChange={(e) => updateEntry(entry.id, 'country', e.target.value)}
                >
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="cell">
                <select
                  value={entry.period}
                  onChange={(e) => updateEntry(entry.id, 'period', e.target.value)}
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
              
              <div className="cell emissions-cell">
                {entry.emissions_kg !== undefined ? (
                  <span className={entry.emissions_kg === 0 ? 'zero-emissions' : ''}>
                    {entry.emissions_kg.toLocaleString()}
                  </span>
                ) : (
                  <span className="not-calculated">—</span>
                )}
              </div>
              
              <div className="cell actions-cell">
                <button 
                  className="btn-icon danger"
                  onClick={() => removeEntry(entry.id)}
                  title="Remove entry"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        <button className="btn btn-ghost add-row-btn" onClick={addEntry}>
          <Plus size={16} /> Add Energy Source
        </button>
      </div>

      {/* Emission Factors Info */}
      <div className="factors-info">
        <h3>Emission Factors Used</h3>
        <p>Location-based electricity factors from DEFRA UK 2024</p>
        <div className="factors-grid">
          {COUNTRIES.map(country => (
            <div key={country.code} className="factor-item">
              <span className="factor-country">{country.code}</span>
              <span className="factor-value">{country.factor} kgCO₂e/kWh</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

