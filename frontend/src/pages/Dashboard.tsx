import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Cloud, 
  Droplets, 
  Users,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { Header } from '../components/Header';
import { api } from '../api';

// Types
interface EnergyConsumption {
  id: string;
  fuel_type: string;
  consumption_kwh: number;
}

interface GHGEmissions {
  id: string;
  scope: string;
  co2e_tonnes: number;
  methodology: string;
}

interface WaterUsage {
  id: string;
  volume_m3: number;
}

interface EmployeeMetrics {
  total_headcount: number;
  female_count: number;
  male_count: number;
}

interface Scope3Category {
  category_name: string;
  spend_amount: number;
  estimated_co2e: number;
}

interface ESGReport {
  reporting_year: number;
  energy_data: EnergyConsumption[];
  emissions_data: GHGEmissions[];
  water_data: WaterUsage[];
  employee_data: EmployeeMetrics | null;
  scope_3_data: Scope3Category[];
}

export function Dashboard() {
  const [report, setReport] = useState<ESGReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await api.getReport(2024);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header title="ESG Dashboard" subtitle="Loading your sustainability data..." />
        <div className="loading-state">
          <RefreshCw className="spin" size={32} />
          <p>Loading ESG data from Firebase...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="page-container">
        <Header title="ESG Dashboard" />
        <div className="error-state">
          <AlertCircle size={48} />
          <h3>Failed to load dashboard</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadReport}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalEmissions = report.emissions_data.reduce((acc, e) => acc + e.co2e_tonnes, 0);
  const scope1 = report.emissions_data.find(e => e.scope === 'scope_1')?.co2e_tonnes || 0;
  const scope2 = report.emissions_data.find(e => e.scope.includes('scope_2'))?.co2e_tonnes || 0;
  const scope3Total = report.scope_3_data.reduce((acc, s) => acc + s.estimated_co2e, 0);
  
  const totalEnergy = report.energy_data.reduce((acc, e) => acc + e.consumption_kwh, 0);
  const renewableEnergy = report.energy_data.find(e => e.fuel_type === 'renewable')?.consumption_kwh || 0;
  const renewablePct = totalEnergy > 0 ? (renewableEnergy / totalEnergy) * 100 : 0;

  const totalWater = report.water_data.reduce((acc, w) => acc + w.volume_m3, 0);
  const headcount = report.employee_data?.total_headcount || 0;
  const femalePct = report.employee_data 
    ? (report.employee_data.female_count / report.employee_data.total_headcount) * 100 
    : 0;

  // Chart data
  const emissionsBreakdown = [
    { name: 'Scope 1', value: scope1, color: '#ef4444' },
    { name: 'Scope 2', value: scope2, color: '#f59e0b' },
    { name: 'Scope 3', value: scope3Total, color: '#3b82f6' },
  ];


  const monthlyTrend = [
    { month: 'Jan', emissions: 12.5, energy: 2200 },
    { month: 'Feb', emissions: 11.8, energy: 2100 },
    { month: 'Mar', emissions: 13.2, energy: 2400 },
    { month: 'Apr', emissions: 10.5, energy: 1900 },
    { month: 'May', emissions: 9.8, energy: 1800 },
    { month: 'Jun', emissions: 11.2, energy: 2000 },
    { month: 'Jul', emissions: 12.1, energy: 2150 },
    { month: 'Aug', emissions: 11.5, energy: 2050 },
    { month: 'Sep', emissions: 10.8, energy: 1950 },
    { month: 'Oct', emissions: 11.9, energy: 2100 },
    { month: 'Nov', emissions: 12.3, energy: 2200 },
    { month: 'Dec', emissions: 10.2, energy: 1850 },
  ];

  return (
    <div className="page-container">
      <Header 
        title="ESG Dashboard" 
        subtitle={`VSME Reporting • Fiscal Year ${report.reporting_year}`} 
      />

      {/* Action Bar */}
      <div className="action-bar">
        <div className="action-bar-left">
          <span className="status-badge success">
            <CheckCircle2 size={14} /> Data synced
          </span>
          <span className="status-badge warning">
            <Clock size={14} /> Last updated: 2 hours ago
          </span>
        </div>
        <div className="action-bar-right">
          <button className="btn btn-secondary">
            <RefreshCw size={16} /> Refresh Data
          </button>
          <button className="btn btn-primary">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          title="Total GHG Emissions"
          value={totalEmissions.toFixed(1)}
          unit="tCO₂e"
          change={-5.2}
          icon={Cloud}
          color="green"
        />
        <KPICard
          title="Energy Consumption"
          value={(totalEnergy / 1000).toFixed(1)}
          unit="MWh"
          change={-3.1}
          icon={Zap}
          color="yellow"
        />
        <KPICard
          title="Water Usage"
          value={totalWater.toFixed(0)}
          unit="m³"
          change={-12.3}
          icon={Droplets}
          color="blue"
        />
        <KPICard
          title="Workforce"
          value={headcount}
          unit="employees"
          change={8.5}
          icon={Users}
          color="purple"
          subtitle={`${femalePct.toFixed(0)}% female`}
        />
      </div>

      {/* Charts Grid */}
      <div className="dashboard-grid">
        {/* Emissions Trend */}
        <div className="dashboard-card span-8">
          <div className="card-header">
            <div>
              <h3>GHG Emissions Trend</h3>
              <p>Monthly emissions in tCO₂e</p>
            </div>
            <select className="chart-filter">
              <option>Last 12 months</option>
              <option>Last 6 months</option>
              <option>Year to date</option>
            </select>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--card-bg)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  fill="url(#emissionsGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emissions Breakdown */}
        <div className="dashboard-card span-4">
          <div className="card-header">
            <div>
              <h3>Emissions by Scope</h3>
              <p>tCO₂e breakdown</p>
            </div>
          </div>
          <div className="chart-container pie-chart">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={emissionsBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {emissionsBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)} tCO₂e`}
                  contentStyle={{ 
                    background: 'var(--card-bg)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {emissionsBreakdown.map(item => (
                <div key={item.name} className="legend-item">
                  <span className="legend-dot" style={{ background: item.color }}></span>
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">{item.value.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Energy Mix */}
        <div className="dashboard-card span-4">
          <div className="card-header">
            <div>
              <h3>Energy Mix</h3>
              <p>Renewable vs Non-Renewable</p>
            </div>
            <span className="badge success">{renewablePct.toFixed(0)}% Green</span>
          </div>
          <div className="energy-visual">
            <div className="energy-ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="12" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#22c55e" 
                  strokeWidth="12"
                  strokeDasharray={`${renewablePct * 2.51} 251`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="energy-ring-label">
                <span className="value">{renewablePct.toFixed(0)}%</span>
                <span className="label">Renewable</span>
              </div>
            </div>
            <div className="energy-stats">
              <div className="energy-stat">
                <Zap size={16} className="icon green" />
                <div>
                  <span className="value">{(renewableEnergy / 1000).toFixed(1)} MWh</span>
                  <span className="label">Renewable</span>
                </div>
              </div>
              <div className="energy-stat">
                <Zap size={16} className="icon gray" />
                <div>
                  <span className="value">{((totalEnergy - renewableEnergy) / 1000).toFixed(1)} MWh</span>
                  <span className="label">Non-Renewable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scope 3 Categories */}
        <div className="dashboard-card span-8">
          <div className="card-header">
            <div>
              <h3>Scope 3 Value Chain Emissions</h3>
              <p>Spend-based calculation methodology</p>
            </div>
            <span className="badge info">VSME BP1</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={report.scope_3_data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="category_name" 
                  width={180}
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)} tCO₂e`}
                  contentStyle={{ 
                    background: 'var(--card-bg)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="estimated_co2e" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card span-4">
          <div className="card-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Common tasks</p>
            </div>
          </div>
          <div className="quick-actions">
            <a href="/upload" className="quick-action-btn">
              <div className="qa-icon upload">📤</div>
              <div className="qa-text">
                <span className="qa-title">Upload Invoice</span>
                <span className="qa-desc">AI-powered data extraction</span>
              </div>
            </a>
            <a href="/reports" className="quick-action-btn">
              <div className="qa-icon report">📊</div>
              <div className="qa-text">
                <span className="qa-title">Generate VSME Report</span>
                <span className="qa-desc">Export to XBRL format</span>
              </div>
            </a>
            <a href="/settings" className="quick-action-btn">
              <div className="qa-icon settings">⚙️</div>
              <div className="qa-text">
                <span className="qa-title">Company Settings</span>
                <span className="qa-desc">NACE codes, boundaries</span>
              </div>
            </a>
          </div>
        </div>

        {/* Audit Status */}
        <div className="dashboard-card span-4">
          <div className="card-header">
            <div>
              <h3>Audit Readiness</h3>
              <p>ISAE 3000 Compliance</p>
            </div>
          </div>
          <div className="audit-status">
            <div className="audit-score">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#22c55e" 
                  strokeWidth="8"
                  strokeDasharray="230 251"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="audit-score-label">
                <span className="value">92%</span>
                <span className="label">Complete</span>
              </div>
            </div>
            <div className="audit-checklist">
              <div className="audit-item complete">
                <CheckCircle2 size={16} /> Energy data verified
              </div>
              <div className="audit-item complete">
                <CheckCircle2 size={16} /> Emissions calculated
              </div>
              <div className="audit-item complete">
                <CheckCircle2 size={16} /> Source documents attached
              </div>
              <div className="audit-item pending">
                <Clock size={16} /> Management sign-off pending
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: 'green' | 'yellow' | 'blue' | 'purple' | 'red';
  subtitle?: string;
}

function KPICard({ title, value, unit, change, icon: Icon, color, subtitle }: KPICardProps) {
  const isPositive = change < 0; // For emissions, negative is good
  
  return (
    <div className={`kpi-card ${color}`}>
      <div className="kpi-icon">
        <Icon size={24} />
      </div>
      <div className="kpi-content">
        <span className="kpi-title">{title}</span>
        <div className="kpi-value">
          <span className="value">{value}</span>
          <span className="unit">{unit}</span>
        </div>
        <div className="kpi-footer">
          <span className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            {Math.abs(change)}% vs last year
          </span>
          {subtitle && <span className="kpi-subtitle">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}

