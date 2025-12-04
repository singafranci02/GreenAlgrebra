import { useState } from 'react';
import {
  Droplets, Plus, Trash2, Save, Info,
  RefreshCw, TrendingUp, AlertCircle,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WaterEntry {
  id: string;
  source: string;
  source_type: 'municipal' | 'surface' | 'groundwater' | 'seawater' | 'rainwater' | 'recycled';
  withdrawal: number;
  discharge: number;
  recycled: number;
  unit: 'm3' | 'liters' | 'gallons';
  location: string;
  period: string;
  water_stressed: boolean;
  notes: string;
}

const WATER_SOURCES = [
  { value: 'municipal', label: 'Municipal/Public Supply', icon: '🏛️' },
  { value: 'surface', label: 'Surface Water (Rivers, Lakes)', icon: '🌊' },
  { value: 'groundwater', label: 'Groundwater (Wells)', icon: '💧' },
  { value: 'seawater', label: 'Seawater (Desalinated)', icon: '🌊' },
  { value: 'rainwater', label: 'Rainwater Harvesting', icon: '🌧️' },
  { value: 'recycled', label: 'Recycled/Reused Water', icon: '♻️' },
];

const WATER_STRESSED_REGIONS = [
  'Middle East & North Africa',
  'South Asia',
  'Central Asia',
  'Southern Europe',
  'Southwestern United States',
  'Northern China',
  'Australia',
];

export function Water() {
  const [entries, setEntries] = useState<WaterEntry[]>([
    {
      id: '1',
      source: 'Office Building A',
      source_type: 'municipal',
      withdrawal: 1250,
      discharge: 0,
      recycled: 0,
      unit: 'm3',
      location: 'London, UK',
      period: '2024',
      water_stressed: false,
      notes: 'Main office facility'
    },
    {
      id: '2',
      source: 'Manufacturing Plant',
      source_type: 'municipal',
      withdrawal: 8500,
      discharge: 3200,
      recycled: 1200,
      unit: 'm3',
      location: 'Manchester, UK',
      period: '2024',
      water_stressed: false,
      notes: 'Production facility with recycling system'
    }
  ]);
  const [saving, setSaving] = useState(false);
  const [productionOutput, setProductionOutput] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);

  const addEntry = () => {
    const newEntry: WaterEntry = {
      id: Date.now().toString(),
      source: '',
      source_type: 'municipal',
      withdrawal: 0,
      discharge: 0,
      recycled: 0,
      unit: 'm3',
      location: '',
      period: '2024',
      water_stressed: false,
      notes: ''
    };
    setEntries([...entries, newEntry]);
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof WaterEntry, value: any) => {
    setEntries(entries.map(e => {
      if (e.id !== id) return e;
      return { ...e, [field]: value };
    }));
  };

  const saveData = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Water data saved successfully!');
  };

  // Calculations
  const totalWithdrawal = entries.reduce((sum, e) => {
    let m3 = e.withdrawal;
    if (e.unit === 'liters') m3 /= 1000;
    if (e.unit === 'gallons') m3 *= 0.00378541;
    return sum + m3;
  }, 0);

  const totalDischarge = entries.reduce((sum, e) => {
    let m3 = e.discharge;
    if (e.unit === 'liters') m3 /= 1000;
    if (e.unit === 'gallons') m3 *= 0.00378541;
    return sum + m3;
  }, 0);

  const totalRecycled = entries.reduce((sum, e) => {
    let m3 = e.recycled;
    if (e.unit === 'liters') m3 /= 1000;
    if (e.unit === 'gallons') m3 *= 0.00378541;
    return sum + m3;
  }, 0);

  const totalConsumption = totalWithdrawal - totalDischarge;
  const recyclingRate = totalWithdrawal > 0 ? (totalRecycled / totalWithdrawal) * 100 : 0;
  const waterStressedConsumption = entries
    .filter(e => e.water_stressed)
    .reduce((sum, e) => {
      let m3 = e.withdrawal - e.discharge;
      if (e.unit === 'liters') m3 /= 1000;
      if (e.unit === 'gallons') m3 *= 0.00378541;
      return sum + m3;
    }, 0);

  const waterIntensityProduction = productionOutput > 0 ? totalConsumption / productionOutput : 0;
  const waterIntensityRevenue = revenue > 0 ? totalConsumption / revenue : 0;

  // Chart data
  const sourceBreakdown = entries.reduce((acc, e) => {
    let m3 = e.withdrawal;
    if (e.unit === 'liters') m3 /= 1000;
    if (e.unit === 'gallons') m3 *= 0.00378541;
    
    const sourceLabel = WATER_SOURCES.find(s => s.value === e.source_type)?.label || e.source_type;
    acc[sourceLabel] = (acc[sourceLabel] || 0) + m3;
    return acc;
  }, {} as Record<string, number>);

  const sourceChartData = Object.entries(sourceBreakdown).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }));

  return (
    <div className="page-container data-entry-page water-page">
      <div className="page-header">
        <div>
          <h1><Droplets size={28} /> Water Usage (B3)</h1>
          <p className="page-subtitle">
            Track water withdrawal, consumption, discharge, and recycling for VSME reporting
          </p>
        </div>
        <div className="page-actions">
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
          <div className="summary-icon"><Droplets size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{Math.round(totalWithdrawal).toLocaleString()}</span>
            <span className="summary-label">Total Withdrawal (m³)</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><Activity size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{Math.round(totalConsumption).toLocaleString()}</span>
            <span className="summary-label">Total Consumption (m³)</span>
          </div>
        </div>
        <div className="summary-card highlight">
          <div className="summary-icon"><TrendingUp size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{recyclingRate.toFixed(1)}%</span>
            <span className="summary-label">Recycling Rate</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><AlertCircle size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{Math.round(waterStressedConsumption).toLocaleString()}</span>
            <span className="summary-label">Water-Stressed Areas (m³)</span>
          </div>
        </div>
      </div>

      {/* Intensity Metrics */}
      {(productionOutput > 0 || revenue > 0) && (
        <div className="intensity-metrics">
          <h3>Water Intensity Metrics</h3>
          <div className="intensity-grid">
            {productionOutput > 0 && (
              <div className="intensity-card">
                <span className="intensity-value">{waterIntensityProduction.toFixed(4)}</span>
                <span className="intensity-label">m³ per unit of production</span>
              </div>
            )}
            {revenue > 0 && (
              <div className="intensity-card">
                <span className="intensity-value">{(waterIntensityRevenue * 1000).toFixed(2)}</span>
                <span className="intensity-label">Liters per €1,000 revenue</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="info-banner">
        <Info size={18} />
        <div>
          <strong>VSME B3: Water Usage</strong>
          <p>Report total water withdrawal by source, consumption (withdrawal minus discharge), recycling/reuse rates, and consumption in water-stressed areas. Aligns with GRI 303: Water and Effluents.</p>
        </div>
      </div>

      {/* Water Source Breakdown Chart */}
      {sourceChartData.length > 0 && (
        <div className="chart-section">
          <h3>Water Withdrawal by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis label={{ value: 'm³', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString()} m³`} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Data Entry Table */}
      <div className="data-entry-table">
        <div className="table-header">
          <span>Source/Location</span>
          <span>Source Type</span>
          <span>Withdrawal</span>
          <span>Discharge</span>
          <span>Recycled</span>
          <span>Unit</span>
          <span>Location</span>
          <span>Water-Stressed</span>
          <span>Period</span>
          <span>Notes</span>
          <span></span>
        </div>

        {entries.map(entry => {
          return (
            <div key={entry.id} className="table-row">
              <div className="cell">
                <input 
                  type="text"
                  value={entry.source}
                  onChange={(e) => updateEntry(entry.id, 'source', e.target.value)}
                  placeholder="e.g., Office Building A"
                />
              </div>
              
              <div className="cell">
                <select 
                  value={entry.source_type}
                  onChange={(e) => updateEntry(entry.id, 'source_type', e.target.value)}
                >
                  {WATER_SOURCES.map(source => (
                    <option key={source.value} value={source.value}>
                      {source.icon} {source.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="cell">
                <input 
                  type="number"
                  value={entry.withdrawal}
                  onChange={(e) => updateEntry(entry.id, 'withdrawal', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              
              <div className="cell">
                <input 
                  type="number"
                  value={entry.discharge}
                  onChange={(e) => updateEntry(entry.id, 'discharge', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              
              <div className="cell">
                <input 
                  type="number"
                  value={entry.recycled}
                  onChange={(e) => updateEntry(entry.id, 'recycled', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              
              <div className="cell">
                <select
                  value={entry.unit}
                  onChange={(e) => updateEntry(entry.id, 'unit', e.target.value)}
                >
                  <option value="m3">m³</option>
                  <option value="liters">Liters</option>
                  <option value="gallons">Gallons</option>
                </select>
              </div>
              
              <div className="cell">
                <input 
                  type="text"
                  value={entry.location}
                  onChange={(e) => updateEntry(entry.id, 'location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              
              <div className="cell">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={entry.water_stressed}
                    onChange={(e) => updateEntry(entry.id, 'water_stressed', e.target.checked)}
                  />
                  <span>Yes</span>
                </label>
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
              
              <div className="cell">
                <input 
                  type="text"
                  value={entry.notes}
                  onChange={(e) => updateEntry(entry.id, 'notes', e.target.value)}
                  placeholder="Notes..."
                  className="notes-input"
                />
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
          <Plus size={16} /> Add Water Source
        </button>
      </div>

      {/* Intensity Calculation Inputs */}
      <div className="intensity-inputs">
        <h3>Calculate Water Intensity</h3>
        <p>Optional: Calculate water intensity per unit of production or revenue for benchmarking</p>
        <div className="intensity-form">
          <div className="form-group">
            <label>Production Output (units)</label>
            <input 
              type="number"
              value={productionOutput}
              onChange={(e) => setProductionOutput(parseFloat(e.target.value) || 0)}
              placeholder="e.g., 10000"
            />
          </div>
          <div className="form-group">
            <label>Revenue (€)</label>
            <input 
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
              placeholder="e.g., 5000000"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="metrics-summary">
        <h3>Key Metrics Summary</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <span className="metric-label">Total Withdrawal</span>
            <span className="metric-value">{Math.round(totalWithdrawal).toLocaleString()} m³</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Total Discharge</span>
            <span className="metric-value">{Math.round(totalDischarge).toLocaleString()} m³</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Net Consumption</span>
            <span className="metric-value">{Math.round(totalConsumption).toLocaleString()} m³</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Recycled/Reused</span>
            <span className="metric-value">{Math.round(totalRecycled).toLocaleString()} m³</span>
          </div>
          <div className="metric-item highlight">
            <span className="metric-label">Recycling Rate</span>
            <span className="metric-value">{recyclingRate.toFixed(1)}%</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Water-Stressed Consumption</span>
            <span className="metric-value">{Math.round(waterStressedConsumption).toLocaleString()} m³</span>
          </div>
        </div>
      </div>

      {/* Water-Stressed Regions Info */}
      <div className="water-stress-info">
        <h3>Water-Stressed Areas</h3>
        <p>Mark locations as water-stressed if they are in regions with high baseline water stress. Common water-stressed regions include:</p>
        <ul>
          {WATER_STRESSED_REGIONS.map(region => (
            <li key={region}>{region}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

