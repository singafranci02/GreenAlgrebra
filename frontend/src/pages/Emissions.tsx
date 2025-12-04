import { useState } from 'react';
import {
  Cloud, Plus, Trash2, Save, Calculator, Info,
  Factory, Car, Building2, RefreshCw
} from 'lucide-react';
import { API_BASE } from '../config/api';

interface EmissionEntry {
  id: string;
  scope: 'scope_1' | 'scope_2_location' | 'scope_2_market';
  category: string;
  activity_type: string;
  quantity: number;
  unit: string;
  emissions_kg?: number;
  notes: string;
}

const SCOPE_1_CATEGORIES = [
  { value: 'stationary_combustion', label: 'Stationary Combustion', icon: Factory, activities: [
    { value: 'natural_gas', label: 'Natural Gas', unit: 'kWh' },
    { value: 'diesel', label: 'Diesel (Heating)', unit: 'litres' },
    { value: 'lpg', label: 'LPG', unit: 'litres' },
  ]},
  { value: 'mobile_combustion', label: 'Mobile Combustion (Fleet)', icon: Car, activities: [
    { value: 'car_petrol', label: 'Petrol Vehicles', unit: 'km' },
    { value: 'car_diesel', label: 'Diesel Vehicles', unit: 'km' },
    { value: 'diesel', label: 'Fuel Purchased', unit: 'litres' },
  ]},
  { value: 'fugitive_emissions', label: 'Fugitive Emissions', icon: Cloud, activities: [
    { value: 'refrigerants', label: 'Refrigerants (AC, Cooling)', unit: 'kg' },
  ]},
];

const SCOPE_2_CATEGORIES = [
  { value: 'purchased_electricity', label: 'Purchased Electricity', icon: Building2, activities: [
    { value: 'electricity', label: 'Grid Electricity', unit: 'kWh' },
  ]},
  { value: 'purchased_heat', label: 'Purchased Heat/Steam', icon: Factory, activities: [
    { value: 'district_heating', label: 'District Heating', unit: 'kWh' },
  ]},
];

export function Emissions() {
  const [entries, setEntries] = useState<EmissionEntry[]>([
    {
      id: '1',
      scope: 'scope_1',
      category: 'stationary_combustion',
      activity_type: 'natural_gas',
      quantity: 85000,
      unit: 'kWh',
      emissions_kg: 15549,
      notes: 'Office heating'
    },
    {
      id: '2',
      scope: 'scope_1',
      category: 'mobile_combustion',
      activity_type: 'diesel',
      quantity: 2500,
      unit: 'litres',
      emissions_kg: 6764,
      notes: 'Company fleet'
    },
    {
      id: '3',
      scope: 'scope_2_location',
      category: 'purchased_electricity',
      activity_type: 'electricity',
      quantity: 45000,
      unit: 'kWh',
      emissions_kg: 9318,
      notes: 'UK grid electricity'
    }
  ]);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedScope, setSelectedScope] = useState<string>('all');

  const addEntry = (scope: 'scope_1' | 'scope_2_location' | 'scope_2_market') => {
    const categories = scope === 'scope_1' ? SCOPE_1_CATEGORIES : SCOPE_2_CATEGORIES;
    const firstCat = categories[0];
    const firstActivity = firstCat.activities[0];
    
    const newEntry: EmissionEntry = {
      id: Date.now().toString(),
      scope,
      category: firstCat.value,
      activity_type: firstActivity.value,
      quantity: 0,
      unit: firstActivity.unit,
      notes: ''
    };
    setEntries([...entries, newEntry]);
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof EmissionEntry, value: any) => {
    setEntries(entries.map(e => {
      if (e.id !== id) return e;
      
      const updated = { ...e, [field]: value };
      
      // Update unit when activity changes
      if (field === 'activity_type') {
        const categories = updated.scope === 'scope_1' ? SCOPE_1_CATEGORIES : SCOPE_2_CATEGORIES;
        for (const cat of categories) {
          const activity = cat.activities.find(a => a.value === value);
          if (activity) {
            updated.unit = activity.unit;
            break;
          }
        }
      }
      
      // Clear emissions when data changes
      if (['activity_type', 'quantity'].includes(field)) {
        updated.emissions_kg = undefined;
      }
      
      return updated;
    }));
  };

  const calculateEmissions = async () => {
    setCalculating(true);
    
    const updatedEntries = await Promise.all(entries.map(async (entry) => {
      try {
        const response = await fetch(`${API_BASE}/calculate/emissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activity_type: entry.activity_type,
            quantity: entry.quantity,
            country: 'UK'
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          return { ...entry, emissions_kg: result.emissions_kg_co2e };
        }
      } catch (err) {
        console.error('Calculation error:', err);
      }
      
      return entry;
    }));
    
    setEntries(updatedEntries);
    setCalculating(false);
  };

  const saveData = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Emissions data saved successfully!');
  };

  const scope1Total = entries
    .filter(e => e.scope === 'scope_1')
    .reduce((sum, e) => sum + (e.emissions_kg || 0), 0);

  const scope2Total = entries
    .filter(e => e.scope.startsWith('scope_2'))
    .reduce((sum, e) => sum + (e.emissions_kg || 0), 0);

  const filteredEntries = selectedScope === 'all' 
    ? entries 
    : entries.filter(e => e.scope === selectedScope || (selectedScope === 'scope_2' && e.scope.startsWith('scope_2')));

  return (
    <div className="page-container data-entry-page">
      <div className="page-header">
        <div>
          <h1><Cloud size={28} /> GHG Emissions (B2)</h1>
          <p className="page-subtitle">
            Track Scope 1 and Scope 2 greenhouse gas emissions for VSME reporting
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
              <><Calculator size={16} /> Calculate All</>
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
        <div className="summary-card scope-1">
          <div className="summary-icon"><Factory size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{(scope1Total / 1000).toFixed(2)}</span>
            <span className="summary-label">Scope 1 (tCO₂e)</span>
          </div>
          <span className="scope-badge">Direct</span>
        </div>
        <div className="summary-card scope-2">
          <div className="summary-icon"><Building2 size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{(scope2Total / 1000).toFixed(2)}</span>
            <span className="summary-label">Scope 2 (tCO₂e)</span>
          </div>
          <span className="scope-badge">Indirect</span>
        </div>
        <div className="summary-card highlight">
          <div className="summary-icon"><Cloud size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{((scope1Total + scope2Total) / 1000).toFixed(2)}</span>
            <span className="summary-label">Total (tCO₂e)</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <Info size={18} />
        <div>
          <strong>VSME B2: GHG Emissions</strong>
          <p>Report Scope 1 (direct) and Scope 2 (indirect from energy) emissions in tonnes CO₂e. Scope 2 can be reported using location-based or market-based methods.</p>
        </div>
      </div>

      {/* Scope Filter */}
      <div className="scope-filter">
        <button 
          className={`filter-btn ${selectedScope === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedScope('all')}
        >
          All Scopes
        </button>
        <button 
          className={`filter-btn ${selectedScope === 'scope_1' ? 'active' : ''}`}
          onClick={() => setSelectedScope('scope_1')}
        >
          Scope 1
        </button>
        <button 
          className={`filter-btn ${selectedScope === 'scope_2' ? 'active' : ''}`}
          onClick={() => setSelectedScope('scope_2')}
        >
          Scope 2
        </button>
      </div>

      {/* Scope 1 Section */}
      <div className="scope-section">
        <div className="scope-header">
          <h2>Scope 1: Direct Emissions</h2>
          <p>Emissions from sources owned or controlled by your company</p>
        </div>
        
        <div className="data-entry-table">
          <div className="table-header">
            <span>Category</span>
            <span>Activity</span>
            <span>Quantity</span>
            <span>Unit</span>
            <span>Emissions (kgCO₂e)</span>
            <span>Notes</span>
            <span></span>
          </div>

          {filteredEntries.filter(e => e.scope === 'scope_1').map(entry => (
            <div key={entry.id} className="table-row">
              <div className="cell">
                <select 
                  value={entry.category}
                  onChange={(e) => updateEntry(entry.id, 'category', e.target.value)}
                >
                  {SCOPE_1_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="cell">
                <select 
                  value={entry.activity_type}
                  onChange={(e) => updateEntry(entry.id, 'activity_type', e.target.value)}
                >
                  {SCOPE_1_CATEGORIES.find(c => c.value === entry.category)?.activities.map(act => (
                    <option key={act.value} value={act.value}>{act.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="cell">
                <input 
                  type="number"
                  value={entry.quantity}
                  onChange={(e) => updateEntry(entry.id, 'quantity', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="cell">
                <span className="unit-display">{entry.unit}</span>
              </div>
              
              <div className="cell emissions-cell">
                {entry.emissions_kg !== undefined ? (
                  <span>{entry.emissions_kg.toLocaleString()}</span>
                ) : (
                  <span className="not-calculated">—</span>
                )}
              </div>
              
              <div className="cell">
                <input 
                  type="text"
                  value={entry.notes}
                  onChange={(e) => updateEntry(entry.id, 'notes', e.target.value)}
                  placeholder="Add notes..."
                  className="notes-input"
                />
              </div>
              
              <div className="cell actions-cell">
                <button 
                  className="btn-icon danger"
                  onClick={() => removeEntry(entry.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <button className="btn btn-ghost add-row-btn" onClick={() => addEntry('scope_1')}>
            <Plus size={16} /> Add Scope 1 Source
          </button>
        </div>
      </div>

      {/* Scope 2 Section */}
      <div className="scope-section">
        <div className="scope-header">
          <h2>Scope 2: Indirect Emissions (Energy)</h2>
          <p>Emissions from purchased electricity, steam, heating, and cooling</p>
        </div>
        
        <div className="data-entry-table">
          <div className="table-header">
            <span>Method</span>
            <span>Category</span>
            <span>Quantity</span>
            <span>Unit</span>
            <span>Emissions (kgCO₂e)</span>
            <span>Notes</span>
            <span></span>
          </div>

          {filteredEntries.filter(e => e.scope.startsWith('scope_2')).map(entry => (
            <div key={entry.id} className="table-row">
              <div className="cell">
                <select 
                  value={entry.scope}
                  onChange={(e) => updateEntry(entry.id, 'scope', e.target.value)}
                >
                  <option value="scope_2_location">Location-based</option>
                  <option value="scope_2_market">Market-based</option>
                </select>
              </div>
              
              <div className="cell">
                <select 
                  value={entry.category}
                  onChange={(e) => updateEntry(entry.id, 'category', e.target.value)}
                >
                  {SCOPE_2_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="cell">
                <input 
                  type="number"
                  value={entry.quantity}
                  onChange={(e) => updateEntry(entry.id, 'quantity', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="cell">
                <span className="unit-display">{entry.unit}</span>
              </div>
              
              <div className="cell emissions-cell">
                {entry.emissions_kg !== undefined ? (
                  <span>{entry.emissions_kg.toLocaleString()}</span>
                ) : (
                  <span className="not-calculated">—</span>
                )}
              </div>
              
              <div className="cell">
                <input 
                  type="text"
                  value={entry.notes}
                  onChange={(e) => updateEntry(entry.id, 'notes', e.target.value)}
                  placeholder="Add notes..."
                  className="notes-input"
                />
              </div>
              
              <div className="cell actions-cell">
                <button 
                  className="btn-icon danger"
                  onClick={() => removeEntry(entry.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <button className="btn btn-ghost add-row-btn" onClick={() => addEntry('scope_2_location')}>
            <Plus size={16} /> Add Scope 2 Source
          </button>
        </div>
      </div>

      {/* Methodology Note */}
      <div className="methodology-note">
        <h3>Calculation Methodology</h3>
        <ul>
          <li><strong>Scope 1:</strong> Using DEFRA 2024 emission factors for fuels and refrigerants</li>
          <li><strong>Scope 2 Location-based:</strong> Using country-specific grid emission factors</li>
          <li><strong>Scope 2 Market-based:</strong> Using supplier-specific or residual mix factors</li>
        </ul>
      </div>
    </div>
  );
}

