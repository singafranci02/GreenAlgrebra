import { useState } from 'react';
import {
  Users, Plus, Trash2, Save, Calculator, Info,
  RefreshCw, TrendingUp, AlertCircle, CheckCircle,
  GraduationCap, Shield, DollarSign, Globe
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface WorkforceEntry {
  id: string;
  location: string;
  period: string;
  total_headcount: number;
  full_time: number;
  part_time: number;
  contractors: number;
  male: number;
  female: number;
  other_gender: number;
  management_total: number;
  management_female: number;
  new_hires: number;
  voluntary_turnover: number;
  involuntary_turnover: number;
  training_hours_total: number;
  avg_hourly_wage: number;
  trir: number; // Total Recordable Incident Rate
  ltir: number; // Lost Time Incident Rate
  lost_days: number;
  notes: string;
}

import { API_BASE } from '../config/api';

export function Workforce() {
  const [entries, setEntries] = useState<WorkforceEntry[]>([
    {
      id: '1',
      location: 'Headquarters - London',
      period: '2024',
      total_headcount: 125,
      full_time: 110,
      part_time: 15,
      contractors: 8,
      male: 68,
      female: 57,
      other_gender: 0,
      management_total: 15,
      management_female: 5,
      new_hires: 18,
      voluntary_turnover: 8,
      involuntary_turnover: 2,
      training_hours_total: 3125,
      avg_hourly_wage: 32.50,
      trir: 2.1,
      ltir: 0.8,
      lost_days: 12,
      notes: 'Main office including management team'
    },
    {
      id: '2',
      location: 'Manufacturing - Manchester',
      period: '2024',
      total_headcount: 85,
      full_time: 80,
      part_time: 5,
      contractors: 12,
      male: 52,
      female: 33,
      other_gender: 0,
      management_total: 8,
      management_female: 2,
      new_hires: 12,
      voluntary_turnover: 6,
      involuntary_turnover: 1,
      training_hours_total: 2040,
      avg_hourly_wage: 28.75,
      trir: 3.5,
      ltir: 1.2,
      lost_days: 18,
      notes: 'Production facility'
    }
  ]);
  const [saving, setSaving] = useState(false);

  const addEntry = () => {
    const newEntry: WorkforceEntry = {
      id: Date.now().toString(),
      location: '',
      period: '2024',
      total_headcount: 0,
      full_time: 0,
      part_time: 0,
      contractors: 0,
      male: 0,
      female: 0,
      other_gender: 0,
      management_total: 0,
      management_female: 0,
      new_hires: 0,
      voluntary_turnover: 0,
      involuntary_turnover: 0,
      training_hours_total: 0,
      avg_hourly_wage: 0,
      trir: 0,
      ltir: 0,
      lost_days: 0,
      notes: ''
    };
    setEntries([...entries, newEntry]);
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof WorkforceEntry, value: any) => {
    setEntries(entries.map(e => {
      if (e.id !== id) return e;
      return { ...e, [field]: value };
    }));
  };

  const saveData = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Workforce data saved successfully!');
  };

  // Aggregate Calculations
  const totalHeadcount = entries.reduce((sum, e) => sum + e.total_headcount, 0);
  const totalFullTime = entries.reduce((sum, e) => sum + e.full_time, 0);
  const totalPartTime = entries.reduce((sum, e) => sum + e.part_time, 0);
  const totalContractors = entries.reduce((sum, e) => sum + e.contractors, 0);
  
  const totalMale = entries.reduce((sum, e) => sum + e.male, 0);
  const totalFemale = entries.reduce((sum, e) => sum + e.female, 0);
  const totalOtherGender = entries.reduce((sum, e) => sum + e.other_gender, 0);
  
  const totalManagement = entries.reduce((sum, e) => sum + e.management_total, 0);
  const totalManagementFemale = entries.reduce((sum, e) => sum + e.management_female, 0);
  
  const totalNewHires = entries.reduce((sum, e) => sum + e.new_hires, 0);
  const totalVoluntaryTurnover = entries.reduce((sum, e) => sum + e.voluntary_turnover, 0);
  const totalInvoluntaryTurnover = entries.reduce((sum, e) => sum + e.involuntary_turnover, 0);
  const totalTurnover = totalVoluntaryTurnover + totalInvoluntaryTurnover;
  
  const totalTrainingHours = entries.reduce((sum, e) => sum + e.training_hours_total, 0);
  const avgTrainingHoursPerEmployee = totalHeadcount > 0 ? totalTrainingHours / totalHeadcount : 0;
  
  const weightedAvgWage = totalHeadcount > 0 
    ? entries.reduce((sum, e) => sum + (e.avg_hourly_wage * e.total_headcount), 0) / totalHeadcount 
    : 0;
  
  // Rates
  const femalePercentage = totalHeadcount > 0 ? (totalFemale / totalHeadcount) * 100 : 0;
  const managementFemalePercentage = totalManagement > 0 ? (totalManagementFemale / totalManagement) * 100 : 0;
  const turnoverRate = totalHeadcount > 0 ? (totalTurnover / totalHeadcount) * 100 : 0;
  const newHireRate = totalHeadcount > 0 ? (totalNewHires / totalHeadcount) * 100 : 0;
  
  // Safety Metrics (weighted average)
  const weightedTRIR = totalHeadcount > 0
    ? entries.reduce((sum, e) => sum + (e.trir * e.total_headcount), 0) / totalHeadcount
    : 0;
  const weightedLTIR = totalHeadcount > 0
    ? entries.reduce((sum, e) => sum + (e.ltir * e.total_headcount), 0) / totalHeadcount
    : 0;
  const totalLostDays = entries.reduce((sum, e) => sum + e.lost_days, 0);

  // Chart Data
  const genderChartData = [
    { name: 'Male', value: totalMale, color: '#3b82f6' },
    { name: 'Female', value: totalFemale, color: '#ec4899' },
    { name: 'Other', value: totalOtherGender, color: '#8b5cf6' },
  ].filter(item => item.value > 0);

  const employmentTypeData = [
    { name: 'Full-Time', value: totalFullTime },
    { name: 'Part-Time', value: totalPartTime },
    { name: 'Contractors', value: totalContractors },
  ].filter(item => item.value > 0);

  const locationBreakdown = entries.map(e => ({
    name: e.location.split(' - ')[0] || e.location,
    headcount: e.total_headcount,
    female_pct: e.total_headcount > 0 ? (e.female / e.total_headcount) * 100 : 0,
  }));

  const COLORS = ['#3b82f6', '#ec4899', '#8b5cf6', '#22c55e', '#f59e0b'];

  return (
    <div className="page-container data-entry-page workforce-page">
      <div className="page-header">
        <div>
          <h1><Users size={28} /> Workforce Metrics (B6)</h1>
          <p className="page-subtitle">
            Track employee demographics, diversity, training, turnover, and health & safety for VSME reporting
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
          <div className="summary-icon"><Users size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{totalHeadcount.toLocaleString()}</span>
            <span className="summary-label">Total Headcount</span>
          </div>
        </div>
        <div className="summary-card highlight">
          <div className="summary-icon"><TrendingUp size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{femalePercentage.toFixed(1)}%</span>
            <span className="summary-label">Female Representation</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><GraduationCap size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{avgTrainingHoursPerEmployee.toFixed(1)}</span>
            <span className="summary-label">Avg Training Hours/Employee</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><AlertCircle size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{turnoverRate.toFixed(1)}%</span>
            <span className="summary-label">Turnover Rate</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><Shield size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">{weightedTRIR.toFixed(2)}</span>
            <span className="summary-label">TRIR (Safety)</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><DollarSign size={24} /></div>
          <div className="summary-content">
            <span className="summary-value">€{weightedAvgWage.toFixed(2)}</span>
            <span className="summary-label">Avg Hourly Wage</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <Info size={18} />
        <div>
          <strong>VSME B6: Workforce Metrics</strong>
          <p>Report total headcount, gender diversity, management representation, employee turnover, training hours, and health & safety metrics. Aligns with GRI 401 (Employment), GRI 404 (Training), and GRI 403 (Occupational Health & Safety).</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {genderChartData.length > 0 && (
          <div className="chart-card">
            <h3>Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genderChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {employmentTypeData.length > 0 && (
          <div className="chart-card">
            <h3>Employment Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={employmentTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {locationBreakdown.length > 0 && (
          <div className="chart-card full-width">
            <h3>Headcount & Gender Diversity by Location</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" label={{ value: 'Headcount', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Female %', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="headcount" fill="#3b82f6" name="Headcount" />
                <Bar yAxisId="right" dataKey="female_pct" fill="#ec4899" name="Female %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-summary">
        <h3>Key Workforce Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <span className="metric-label">Total Headcount</span>
            <span className="metric-value">{totalHeadcount.toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Full-Time Employees</span>
            <span className="metric-value">{totalFullTime.toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Part-Time Employees</span>
            <span className="metric-value">{totalPartTime.toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Contractors</span>
            <span className="metric-value">{totalContractors.toLocaleString()}</span>
          </div>
          <div className="metric-item highlight">
            <span className="metric-label">Female Representation</span>
            <span className="metric-value">{femalePercentage.toFixed(1)}%</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Management Female %</span>
            <span className="metric-value">{managementFemalePercentage.toFixed(1)}%</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">New Hires</span>
            <span className="metric-value">{totalNewHires.toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">New Hire Rate</span>
            <span className="metric-value">{newHireRate.toFixed(1)}%</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Total Turnover</span>
            <span className="metric-value">{totalTurnover.toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Turnover Rate</span>
            <span className="metric-value">{turnoverRate.toFixed(1)}%</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Voluntary Turnover</span>
            <span className="metric-value">{totalVoluntaryTurnover.toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Involuntary Turnover</span>
            <span className="metric-value">{totalInvoluntaryTurnover.toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Total Training Hours</span>
            <span className="metric-value">{totalTrainingHours.toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Avg Training Hours/Employee</span>
            <span className="metric-value">{avgTrainingHoursPerEmployee.toFixed(1)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Average Hourly Wage</span>
            <span className="metric-value">€{weightedAvgWage.toFixed(2)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">TRIR (Total Recordable Incident Rate)</span>
            <span className="metric-value">{weightedTRIR.toFixed(2)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">LTIR (Lost Time Incident Rate)</span>
            <span className="metric-value">{weightedLTIR.toFixed(2)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Total Lost Days</span>
            <span className="metric-value">{totalLostDays.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Data Entry Table */}
      <div className="data-entry-table workforce-table">
        <div className="table-header">
          <span>Location</span>
          <span>Period</span>
          <span>Total</span>
          <span>Full-Time</span>
          <span>Part-Time</span>
          <span>Contractors</span>
          <span>Male</span>
          <span>Female</span>
          <span>Other</span>
          <span>Mgmt Total</span>
          <span>Mgmt Female</span>
          <span>New Hires</span>
          <span>Vol Turnover</span>
          <span>Inv Turnover</span>
          <span>Training Hrs</span>
          <span>Avg Wage (€)</span>
          <span>TRIR</span>
          <span>LTIR</span>
          <span>Lost Days</span>
          <span>Notes</span>
          <span></span>
        </div>

        {entries.map(entry => (
          <div key={entry.id} className="table-row">
            <div className="cell">
              <input 
                type="text"
                value={entry.location}
                onChange={(e) => updateEntry(entry.id, 'location', e.target.value)}
                placeholder="Location name"
              />
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
                type="number"
                value={entry.total_headcount}
                onChange={(e) => updateEntry(entry.id, 'total_headcount', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                value={entry.full_time}
                onChange={(e) => updateEntry(entry.id, 'full_time', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                value={entry.part_time}
                onChange={(e) => updateEntry(entry.id, 'part_time', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                value={entry.contractors}
                onChange={(e) => updateEntry(entry.id, 'contractors', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                value={entry.male}
                onChange={(e) => updateEntry(entry.id, 'male', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                value={entry.female}
                onChange={(e) => updateEntry(entry.id, 'female', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                value={entry.other_gender}
                onChange={(e) => updateEntry(entry.id, 'other_gender', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                value={entry.management_total}
                onChange={(e) => updateEntry(entry.id, 'management_total', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                value={entry.management_female}
                onChange={(e) => updateEntry(entry.id, 'management_female', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                value={entry.new_hires}
                onChange={(e) => updateEntry(entry.id, 'new_hires', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                value={entry.voluntary_turnover}
                onChange={(e) => updateEntry(entry.id, 'voluntary_turnover', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                value={entry.involuntary_turnover}
                onChange={(e) => updateEntry(entry.id, 'involuntary_turnover', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                value={entry.training_hours_total}
                onChange={(e) => updateEntry(entry.id, 'training_hours_total', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                step="0.01"
                value={entry.avg_hourly_wage}
                onChange={(e) => updateEntry(entry.id, 'avg_hourly_wage', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                step="0.1"
                value={entry.trir}
                onChange={(e) => updateEntry(entry.id, 'trir', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                step="0.1"
                value={entry.ltir}
                onChange={(e) => updateEntry(entry.id, 'ltir', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="cell">
              <input 
                type="number"
                value={entry.lost_days}
                onChange={(e) => updateEntry(entry.id, 'lost_days', parseInt(e.target.value) || 0)}
              />
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
        ))}

        <button className="btn btn-ghost add-row-btn" onClick={addEntry}>
          <Plus size={16} /> Add Location/Division
        </button>
      </div>

      {/* Definitions */}
      <div className="definitions-section">
        <h3>Metric Definitions</h3>
        <div className="definitions-grid">
          <div className="definition-item">
            <strong>TRIR (Total Recordable Incident Rate)</strong>
            <p>Number of recordable injuries per 200,000 hours worked. Formula: (Number of recordable injuries × 200,000) / Total hours worked.</p>
          </div>
          <div className="definition-item">
            <strong>LTIR (Lost Time Incident Rate)</strong>
            <p>Number of lost time injuries per 200,000 hours worked. Lost time injuries result in days away from work.</p>
          </div>
          <div className="definition-item">
            <strong>Turnover Rate</strong>
            <p>Percentage of employees who left the organization during the reporting period. Formula: (Number of separations / Average headcount) × 100.</p>
          </div>
          <div className="definition-item">
            <strong>Management</strong>
            <p>Employees in supervisory, managerial, or executive roles with decision-making authority.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

