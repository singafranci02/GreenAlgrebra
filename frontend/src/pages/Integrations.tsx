import { useState, useEffect } from 'react';
import {
  Link2, Unlink, RefreshCw, CheckCircle, AlertCircle, Clock,
  Database, ArrowRight, ChevronRight, Download, Settings2,
  Zap, Building2, FileSpreadsheet, Activity
} from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  capabilities: string[];
  regions: string[];
  lastSync?: string;
  organizationName?: string;
}

interface SyncResult {
  provider: string;
  synced_at: string;
  data: {
    invoices_count: number;
    total_emissions_kg: number;
    total_emissions_tonnes: number;
    esg_summary: Record<string, { count: number; total_amount: number }>;
    employees?: {
      total_headcount: number;
      female_count: number;
      male_count: number;
    };
  };
}

import { API_BASE } from '../config/api';

export function Integrations() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch(`${API_BASE}/integrations?company_id=demo_company`);
      const data = await response.json();
      setProviders(data.providers);
    } catch (err) {
      console.error('Failed to fetch providers:', err);
      // Set mock data for demo
      setProviders([
        {
          id: 'xero',
          name: 'Xero',
          description: 'Cloud accounting for small business',
          logo: 'https://www.xero.com/content/dam/xero/pilot-images/logo/xero-logo-hires-RGB.png',
          status: 'disconnected',
          capabilities: ['invoices', 'expenses', 'payroll', 'bank_transactions'],
          regions: ['UK', 'AU', 'NZ', 'US', 'EU']
        },
        {
          id: 'sage',
          name: 'Sage Intacct',
          description: 'Financial management for growing businesses',
          logo: 'https://www.sage.com/favicon.ico',
          status: 'disconnected',
          capabilities: ['invoices', 'expenses', 'general_ledger', 'assets'],
          regions: ['UK', 'US', 'EU']
        },
        {
          id: 'datev',
          name: 'DATEV',
          description: 'German accounting standard',
          logo: 'https://www.datev.de/favicon.ico',
          status: 'disconnected',
          capabilities: ['invoices', 'bookkeeping', 'payroll'],
          regions: ['DE', 'AT', 'CH']
        },
        {
          id: 'quickbooks',
          name: 'QuickBooks Online',
          description: 'Small business accounting',
          logo: 'https://quickbooks.intuit.com/favicon.ico',
          status: 'disconnected',
          capabilities: ['invoices', 'expenses', 'payroll', 'bank_transactions'],
          regions: ['US', 'UK', 'AU', 'CA']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (providerId: string) => {
    setConnecting(providerId);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/integrations/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerId })
      });
      
      if (response.ok) {
        const result = await response.json();
        setProviders(prev => prev.map(p => 
          p.id === providerId 
            ? { ...p, status: 'connected', organizationName: result.connection.organization_name }
            : p
        ));
      } else {
        throw new Error('Connection failed');
      }
    } catch (err) {
      setError(`Failed to connect to ${providerId}`);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (providerId: string) => {
    try {
      await fetch(`${API_BASE}/integrations/disconnect/${providerId}?company_id=demo_company`, {
        method: 'POST'
      });
      
      setProviders(prev => prev.map(p => 
        p.id === providerId 
          ? { ...p, status: 'disconnected', organizationName: undefined, lastSync: undefined }
          : p
      ));
      
      if (syncResult?.provider === providerId) {
        setSyncResult(null);
      }
    } catch (err) {
      setError(`Failed to disconnect from ${providerId}`);
    }
  };

  const handleSync = async (providerId: string) => {
    setSyncing(providerId);
    setError(null);
    
    // Calculate date range (last 12 months)
    const today = new Date();
    const yearAgo = new Date();
    yearAgo.setFullYear(today.getFullYear() - 1);
    
    try {
      const response = await fetch(`${API_BASE}/integrations/sync?company_id=demo_company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerId,
          data_types: ['invoices', 'expenses', 'employees'],
          date_from: yearAgo.toISOString().split('T')[0],
          date_to: today.toISOString().split('T')[0]
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setSyncResult(result);
        
        setProviders(prev => prev.map(p => 
          p.id === providerId 
            ? { ...p, lastSync: new Date().toISOString() }
            : p
        ));
      } else {
        throw new Error('Sync failed');
      }
    } catch (err) {
      setError(`Failed to sync data from ${providerId}`);
    } finally {
      setSyncing(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={18} className="status-icon success" />;
      case 'error':
        return <AlertCircle size={18} className="status-icon error" />;
      case 'pending':
        return <Clock size={18} className="status-icon warning" />;
      default:
        return <Unlink size={18} className="status-icon muted" />;
    }
  };

  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case 'invoices':
        return <FileSpreadsheet size={14} />;
      case 'expenses':
        return <Activity size={14} />;
      case 'payroll':
        return <Building2 size={14} />;
      case 'bank_transactions':
        return <Database size={14} />;
      default:
        return <Settings2 size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <RefreshCw className="spin" size={24} />
          <p>Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container integrations-page">
      <div className="page-header">
        <div>
          <h1>Integrations</h1>
          <p className="page-subtitle">
            Connect your accounting systems to automatically import ESG data
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Provider Cards */}
      <div className="integrations-grid">
        {providers.map(provider => (
          <div key={provider.id} className={`integration-card ${provider.status}`}>
            <div className="integration-header">
              <div className="integration-logo">
                <Database size={32} />
              </div>
              <div className="integration-status">
                {getStatusIcon(provider.status)}
                <span className={`status-text ${provider.status}`}>
                  {provider.status === 'connected' ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>

            <div className="integration-info">
              <h3>{provider.name}</h3>
              <p>{provider.description}</p>
              
              {provider.organizationName && (
                <div className="connected-org">
                  <Building2 size={14} />
                  <span>{provider.organizationName}</span>
                </div>
              )}

              <div className="integration-capabilities">
                {provider.capabilities.map(cap => (
                  <span key={cap} className="capability-tag">
                    {getCapabilityIcon(cap)}
                    {cap.replace('_', ' ')}
                  </span>
                ))}
              </div>

              <div className="integration-regions">
                <span className="region-label">Available in:</span>
                {provider.regions.map(region => (
                  <span key={region} className="region-tag">{region}</span>
                ))}
              </div>
            </div>

            <div className="integration-actions">
              {provider.status === 'connected' ? (
                <>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleSync(provider.id)}
                    disabled={syncing === provider.id}
                  >
                    {syncing === provider.id ? (
                      <><RefreshCw size={16} className="spin" /> Syncing...</>
                    ) : (
                      <><RefreshCw size={16} /> Sync Data</>
                    )}
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleDisconnect(provider.id)}
                  >
                    <Unlink size={16} /> Disconnect
                  </button>
                </>
              ) : (
                <button 
                  className="btn btn-primary btn-full"
                  onClick={() => handleConnect(provider.id)}
                  disabled={connecting === provider.id}
                >
                  {connecting === provider.id ? (
                    <><RefreshCw size={16} className="spin" /> Connecting...</>
                  ) : (
                    <><Link2 size={16} /> Connect {provider.name}</>
                  )}
                </button>
              )}
            </div>

            {provider.lastSync && (
              <div className="last-sync">
                Last synced: {new Date(provider.lastSync).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sync Results */}
      {syncResult && (
        <div className="sync-results">
          <div className="sync-results-header">
            <h2>
              <Zap size={24} /> Sync Results
            </h2>
            <span className="sync-time">
              Synced at {new Date(syncResult.synced_at).toLocaleString()}
            </span>
          </div>

          <div className="sync-summary-grid">
            <div className="sync-stat-card">
              <div className="sync-stat-icon">
                <FileSpreadsheet size={24} />
              </div>
              <div className="sync-stat-content">
                <span className="sync-stat-value">{syncResult.data.invoices_count}</span>
                <span className="sync-stat-label">Invoices Processed</span>
              </div>
            </div>

            <div className="sync-stat-card highlight">
              <div className="sync-stat-icon">
                <Activity size={24} />
              </div>
              <div className="sync-stat-content">
                <span className="sync-stat-value">
                  {syncResult.data.total_emissions_tonnes.toFixed(2)}
                </span>
                <span className="sync-stat-label">Tonnes CO₂e Calculated</span>
              </div>
            </div>

            {syncResult.data.employees && (
              <div className="sync-stat-card">
                <div className="sync-stat-icon">
                  <Building2 size={24} />
                </div>
                <div className="sync-stat-content">
                  <span className="sync-stat-value">
                    {syncResult.data.employees.total_headcount}
                  </span>
                  <span className="sync-stat-label">Employees</span>
                </div>
              </div>
            )}
          </div>

          <div className="esg-breakdown">
            <h3>ESG Category Breakdown</h3>
            <div className="breakdown-grid">
              {Object.entries(syncResult.data.esg_summary || {}).map(([category, data]) => (
                <div key={category} className="breakdown-item">
                  <div className="breakdown-category">
                    {category.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="breakdown-stats">
                    <span className="breakdown-count">{data.count} items</span>
                    <span className="breakdown-amount">
                      €{data.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sync-actions">
            <button className="btn btn-primary">
              <Download size={16} /> Export to Report
            </button>
            <button className="btn btn-outline">
              <ChevronRight size={16} /> View Details
            </button>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="how-it-works">
        <h2>How Integration Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Connect</h4>
            <p>Securely authenticate with your accounting system using OAuth 2.0</p>
          </div>
          <div className="step-arrow"><ArrowRight size={24} /></div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Sync</h4>
            <p>Pull invoices, expenses, and payroll data automatically</p>
          </div>
          <div className="step-arrow"><ArrowRight size={24} /></div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Categorize</h4>
            <p>AI maps expenses to ESG categories (energy, travel, waste)</p>
          </div>
          <div className="step-arrow"><ArrowRight size={24} /></div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h4>Calculate</h4>
            <p>Convert activity data to CO₂e using DEFRA emission factors</p>
          </div>
        </div>
      </div>
    </div>
  );
}

