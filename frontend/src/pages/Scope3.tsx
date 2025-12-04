import { useState } from 'react';
import {
  TrendingUp, Plus, Trash2, Save, Calculator, Info,
  ShoppingCart, Building2, Plane, Truck, Package,
  Users, RefreshCw, DollarSign, ChevronDown, ChevronUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Scope3Entry {
  id: string;
  category: number;
  category_name: string;
  method: 'spend' | 'activity';
  activity_type: string;
  quantity: number;
  unit: string;
  sub_category?: string;
  currency?: string;
  emissions_kg?: number;
  notes: string;
}

const SCOPE_3_CATEGORIES = [
  { 
    number: 1, 
    name: 'Purchased Goods & Services', 
    icon: ShoppingCart,
    description: 'Extraction, production, and transport of goods/services purchased',
    methods: ['spend', 'activity'],
    spend_factors: [
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'electronics', label: 'Electronics' },
      { value: 'food_products', label: 'Food & Beverages' },
      { value: 'office_supplies', label: 'Office Supplies' },
      { value: 'software_services', label: 'Software & IT Services' },
      { value: 'professional_services', label: 'Professional Services' },
    ]
  },
  { 
    number: 2, 
    name: 'Capital Goods', 
    icon: Building2,
    description: 'Extraction, production of capital goods purchased',
    methods: ['spend'],
    spend_factors: [
      { value: 'machinery', label: 'Machinery & Equipment' },
      { value: 'vehicles', label: 'Vehicles' },
      { value: 'it_equipment', label: 'IT Equipment' },
      { value: 'furniture', label: 'Furniture & Fixtures' },
    ]
  },
  { 
    number: 3, 
    name: 'Fuel & Energy Related', 
    icon: TrendingUp,
    description: 'Extraction, production of fuels/energy not in Scope 1/2',
    methods: ['activity'],
    activity_types: [
      { value: 'well_to_tank', label: 'Well-to-Tank (WTT)', unit: 'litres' },
      { value: 'transmission_losses', label: 'T&D Losses', unit: 'kWh' },
    ]
  },
  { 
    number: 4, 
    name: 'Upstream Transport', 
    icon: Truck,
    description: 'Transport of purchased goods from suppliers',
    methods: ['spend', 'activity'],
    spend_factors: [
      { value: 'road_freight', label: 'Road Freight' },
      { value: 'air_freight', label: 'Air Freight' },
      { value: 'sea_freight', label: 'Sea Freight' },
      { value: 'rail_freight', label: 'Rail Freight' },
    ],
    activity_types: [
      { value: 'truck', label: 'Road (tonne-km)', unit: 'tonne-km' },
    ]
  },
  { 
    number: 5, 
    name: 'Waste in Operations', 
    icon: Package,
    description: 'Disposal and treatment of waste',
    methods: ['activity'],
    activity_types: [
      { value: 'waste_landfill', label: 'Landfill', unit: 'tonnes' },
      { value: 'waste_recycled', label: 'Recycling', unit: 'tonnes' },
      { value: 'waste_incineration', label: 'Incineration', unit: 'tonnes' },
    ]
  },
  { 
    number: 6, 
    name: 'Business Travel', 
    icon: Plane,
    description: 'Travel by employees for business purposes',
    methods: ['activity'],
    activity_types: [
      { value: 'flight_short', label: 'Flights (Short Haul <500km)', unit: 'passenger-km' },
      { value: 'flight_medium', label: 'Flights (Medium 500-3700km)', unit: 'passenger-km' },
      { value: 'flight_long', label: 'Flights (Long Haul >3700km)', unit: 'passenger-km' },
      { value: 'rail', label: 'Rail Travel', unit: 'passenger-km' },
      { value: 'car_petrol', label: 'Car (Employee Vehicles)', unit: 'km' },
    ]
  },
  { 
    number: 7, 
    name: 'Employee Commuting', 
    icon: Users,
    description: 'Transportation of employees between home and work',
    methods: ['activity'],
    activity_types: [
      { value: 'car_petrol', label: 'Car (Petrol)', unit: 'km' },
      { value: 'car_diesel', label: 'Car (Diesel)', unit: 'km' },
      { value: 'bus', label: 'Bus', unit: 'km' },
      { value: 'rail', label: 'Train', unit: 'km' },
    ]
  },
  { 
    number: 9, 
    name: 'Downstream Transport', 
    icon: Truck,
    description: 'Transport of sold products to customers',
    methods: ['spend'],
    spend_factors: [
      { value: 'road_freight', label: 'Road Freight' },
      { value: 'courier', label: 'Courier/Parcel' },
    ]
  },
];

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
import { API_BASE } from '../config/api';

export function Scope3() {
  const [entries, setEntries] = useState<Scope3Entry[]>([
    {
      id: '1',
      category: 1,
      category_name: 'Purchased Goods & Services',
      method: 'spend',
      activity_type: 'spend_purchased_goods',
      quantity: 125000,
      unit: 'EUR',
      sub_category: 'office_supplies',
      currency: 'EUR',
      emissions_kg: 35000,
      notes: 'Annual office supplies'
    },
    {
      id: '2',
      category: 6,
      category_name: 'Business Travel',
      method: 'activity',
      activity_type: 'flight_medium',
      quantity: 45000,
      unit: 'passenger-km',
      emissions_kg: 7008,
      notes: 'European flights FY2024'
    },
    {
      id: '3',
      category: 7,
      category_name: 'Employee Commuting',
      method: 'activity',
      activity_type: 'car_petrol',
      quantity: 180000,
      unit: 'km',
      emissions_kg: 30686,
      notes: 'Estimated from survey'
    }
  ]);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([1, 6, 7]);

  const addEntry = (categoryNum: number) => {
    const category = SCOPE_3_CATEGORIES.find(c => c.number === categoryNum)!;
    const isSpend = category.methods.includes('spend');
    
    const newEntry: Scope3Entry = {
      id: Date.now().toString(),
      category: categoryNum,
      category_name: category.name,
      method: isSpend ? 'spend' : 'activity',
      activity_type: isSpend ? 'spend_purchased_goods' : (category.activity_types?.[0]?.value || ''),
      quantity: 0,
      unit: isSpend ? 'EUR' : (category.activity_types?.[0]?.unit || 'unit'),
      sub_category: isSpend ? category.spend_factors?.[0]?.value : undefined,
      currency: isSpend ? 'EUR' : undefined,
      notes: ''
    };
    setEntries([...entries, newEntry]);
    
    if (!expandedCategories.includes(categoryNum)) {
      setExpandedCategories([...expandedCategories, categoryNum]);
    }
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof Scope3Entry, value: any) => {
    setEntries(entries.map(e => {
      if (e.id !== id) return e;
      
      const updated = { ...e, [field]: value };
      
      // Update activity type and unit when method changes
      if (field === 'method') {
        const category = SCOPE_3_CATEGORIES.find(c => c.number === e.category)!;
        if (value === 'spend') {
          updated.activity_type = 'spend_purchased_goods';
          updated.unit = 'EUR';
          updated.sub_category = category.spend_factors?.[0]?.value;
          updated.currency = 'EUR';
        } else {
          const firstActivity = category.activity_types?.[0];
          updated.activity_type = firstActivity?.value || '';
          updated.unit = firstActivity?.unit || 'unit';
          updated.sub_category = undefined;
          updated.currency = undefined;
        }
      }
      
      // Update unit when activity type changes
      if (field === 'activity_type' && updated.method === 'activity') {
        const category = SCOPE_3_CATEGORIES.find(c => c.number === e.category)!;
        const activity = category.activity_types?.find(a => a.value === value);
        if (activity) {
          updated.unit = activity.unit;
        }
      }
      
      // Clear emissions when data changes
      if (['method', 'activity_type', 'quantity', 'sub_category'].includes(field)) {
        updated.emissions_kg = undefined;
      }
      
      return updated;
    }));
  };

  const calculateEmissions = async () => {
    setCalculating(true);
    
    const updatedEntries = await Promise.all(entries.map(async (entry) => {
      try {
        if (entry.method === 'spend') {
          const response = await fetch(`${API_BASE}/calculate/spend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              spend_amount: entry.quantity,
              category: 'purchased_goods',
              sub_category: entry.sub_category || 'default',
              currency: entry.currency || 'EUR'
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            return { ...entry, emissions_kg: result.emissions_kg_co2e };
          }
        } else {
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
    alert('Scope 3 data saved successfully!');
  };

  const toggleCategory = (num: number) => {
    setExpandedCategories(prev => 
      prev.includes(num) 
        ? prev.filter(n => n !== num)
        : [...prev, num]
    );
  };

  const totalEmissions = entries.reduce((sum, e) => sum + (e.emissions_kg || 0), 0);

  const emissionsByCategory = SCOPE_3_CATEGORIES.map(cat => ({
    name: `Cat ${cat.number}`,
    fullName: cat.name,
    value: entries
      .filter(e => e.category === cat.number)
      .reduce((sum, e) => sum + (e.emissions_kg || 0), 0) / 1000
  })).filter(c => c.value > 0);

  return (
    <div className="page-container data-entry-page scope3-page">
      <div className="page-header">
        <div>
          <h1><TrendingUp size={28} /> Scope 3 Analysis (BP1)</h1>
          <p className="page-subtitle">
            Track value chain emissions across 15 GHG Protocol categories
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

      {/* Summary Section */}
      <div className="scope3-summary">
        <div className="summary-stats">
          <div className="summary-card large">
            <div className="summary-icon"><TrendingUp size={32} /></div>
            <div className="summary-content">
              <span className="summary-value">{(totalEmissions / 1000).toFixed(2)}</span>
              <span className="summary-label">Total Scope 3 (tCO₂e)</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-content">
              <span className="summary-value">{entries.length}</span>
              <span className="summary-label">Data Entries</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-content">
              <span className="summary-value">
                {new Set(entries.map(e => e.category)).size}
              </span>
              <span className="summary-label">Categories Covered</span>
            </div>
          </div>
        </div>

        {emissionsByCategory.length > 0 && (
          <div className="category-chart">
            <h3>Emissions by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={emissionsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}t`}
                >
                  {emissionsByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(2)} tCO₂e`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <Info size={18} />
        <div>
          <strong>VSME BP1: Scope 3 GHG Emissions (Phased Approach Topic)</strong>
          <p>Report material Scope 3 categories using either spend-based (EEIO) or activity-based methods. VSME requires reporting of significant categories only.</p>
        </div>
      </div>

      {/* Category Sections */}
      <div className="scope3-categories">
        {SCOPE_3_CATEGORIES.map(category => {
          const CategoryIcon = category.icon;
          const categoryEntries = entries.filter(e => e.category === category.number);
          const categoryEmissions = categoryEntries.reduce((sum, e) => sum + (e.emissions_kg || 0), 0);
          const isExpanded = expandedCategories.includes(category.number);
          
          return (
            <div key={category.number} className={`category-section ${isExpanded ? 'expanded' : ''}`}>
              <div className="category-header" onClick={() => toggleCategory(category.number)}>
                <div className="category-title">
                  <span className="category-number">{category.number}</span>
                  <CategoryIcon size={20} />
                  <div>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                </div>
                <div className="category-stats">
                  <span className="entry-count">{categoryEntries.length} entries</span>
                  <span className="category-emissions">
                    {(categoryEmissions / 1000).toFixed(2)} tCO₂e
                  </span>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {isExpanded && (
                <div className="category-content">
                  {categoryEntries.length > 0 && (
                    <div className="data-entry-table compact">
                      <div className="table-header">
                        <span>Method</span>
                        <span>Activity/Category</span>
                        <span>Quantity</span>
                        <span>Unit</span>
                        <span>Emissions (kgCO₂e)</span>
                        <span>Notes</span>
                        <span></span>
                      </div>

                      {categoryEntries.map(entry => (
                        <div key={entry.id} className="table-row">
                          <div className="cell">
                            <select 
                              value={entry.method}
                              onChange={(e) => updateEntry(entry.id, 'method', e.target.value)}
                              disabled={!category.methods.includes('spend') || !category.methods.includes('activity')}
                            >
                              {category.methods.includes('spend') && (
                                <option value="spend">Spend-based</option>
                              )}
                              {category.methods.includes('activity') && (
                                <option value="activity">Activity-based</option>
                              )}
                            </select>
                          </div>
                          
                          <div className="cell">
                            {entry.method === 'spend' ? (
                              <select 
                                value={entry.sub_category}
                                onChange={(e) => updateEntry(entry.id, 'sub_category', e.target.value)}
                              >
                                {category.spend_factors?.map(f => (
                                  <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                              </select>
                            ) : (
                              <select 
                                value={entry.activity_type}
                                onChange={(e) => updateEntry(entry.id, 'activity_type', e.target.value)}
                              >
                                {category.activity_types?.map(a => (
                                  <option key={a.value} value={a.value}>{a.label}</option>
                                ))}
                              </select>
                            )}
                          </div>
                          
                          <div className="cell">
                            <input 
                              type="number"
                              value={entry.quantity}
                              onChange={(e) => updateEntry(entry.id, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          
                          <div className="cell">
                            {entry.method === 'spend' ? (
                              <select 
                                value={entry.currency}
                                onChange={(e) => updateEntry(entry.id, 'currency', e.target.value)}
                              >
                                <option value="EUR">EUR</option>
                                <option value="USD">USD</option>
                                <option value="GBP">GBP</option>
                              </select>
                            ) : (
                              <span className="unit-display">{entry.unit}</span>
                            )}
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
                              placeholder="Notes..."
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
                    </div>
                  )}

                  <button 
                    className="btn btn-ghost add-row-btn"
                    onClick={() => addEntry(category.number)}
                  >
                    <Plus size={16} /> Add Entry to Category {category.number}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Methodology Note */}
      <div className="methodology-note">
        <h3>Calculation Methods</h3>
        <div className="methods-grid">
          <div className="method-card">
            <DollarSign size={20} />
            <h4>Spend-Based (EEIO)</h4>
            <p>Uses economic input-output factors to estimate emissions from spend data. Less accurate but easier to collect.</p>
          </div>
          <div className="method-card">
            <Calculator size={20} />
            <h4>Activity-Based</h4>
            <p>Uses physical activity data (km, kWh, tonnes) with specific emission factors. More accurate but requires detailed data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

