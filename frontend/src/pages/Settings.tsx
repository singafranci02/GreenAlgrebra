import { useState } from 'react';
import { 
  Building2, 
  User, 
  Bell, 
  Shield, 
  Database,
  Globe,
  Save,
  CheckCircle,
} from 'lucide-react';
import { Header } from '../components/Header';

export function Settings() {
  const [activeTab, setActiveTab] = useState('company');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-container">
      <Header 
        title="Settings" 
        subtitle="Configure your organization and preferences" 
      />

      <div className="settings-layout">
        {/* Settings Navigation */}
        <nav className="settings-nav">
          <button 
            className={`settings-nav-item ${activeTab === 'company' ? 'active' : ''}`}
            onClick={() => setActiveTab('company')}
          >
            <Building2 size={18} />
            Company Profile
          </button>
          <button 
            className={`settings-nav-item ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            <User size={18} />
            User Settings
          </button>
          <button 
            className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            Notifications
          </button>
          <button 
            className={`settings-nav-item ${activeTab === 'reporting' ? 'active' : ''}`}
            onClick={() => setActiveTab('reporting')}
          >
            <Globe size={18} />
            Reporting Framework
          </button>
          <button 
            className={`settings-nav-item ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            <Database size={18} />
            Data Sources
          </button>
          <button 
            className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} />
            Security
          </button>
        </nav>

        {/* Settings Content */}
        <div className="settings-content">
          {activeTab === 'company' && (
            <div className="settings-section">
              <h2>Company Profile</h2>
              <p className="section-desc">Basic information about your organization for ESG reporting.</p>
              
              <form className="settings-form">
                <div className="form-group">
                  <label>Company Name</label>
                  <input type="text" defaultValue="Green Tech Solutions Ltd" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Industry Sector</label>
                    <select defaultValue="tech">
                      <option value="tech">Technology</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                      <option value="services">Professional Services</option>
                      <option value="finance">Financial Services</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>NACE Code</label>
                    <input type="text" placeholder="e.g., 62.01" defaultValue="62.01" />
                    <span className="form-hint">European industry classification</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Country</label>
                    <select defaultValue="AE">
                      <option value="AE">United Arab Emirates</option>
                      <option value="DE">Germany</option>
                      <option value="GB">United Kingdom</option>
                      <option value="US">United States</option>
                      <option value="SG">Singapore</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Fiscal Year End</label>
                    <select defaultValue="dec">
                      <option value="dec">December 31</option>
                      <option value="mar">March 31</option>
                      <option value="jun">June 30</option>
                      <option value="sep">September 30</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Reporting Boundary</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" name="boundary" value="operational" defaultChecked />
                      <span>Operational Control</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="boundary" value="financial" />
                      <span>Financial Control</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="boundary" value="equity" />
                      <span>Equity Share</span>
                    </label>
                  </div>
                  <span className="form-hint">Determines which emissions are included in your inventory</span>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'reporting' && (
            <div className="settings-section">
              <h2>Reporting Framework</h2>
              <p className="section-desc">Select the sustainability reporting standard for your organization.</p>
              
              <div className="framework-cards">
                <label className="framework-card selected">
                  <input type="radio" name="framework" value="vsme" defaultChecked />
                  <div className="framework-header">
                    <span className="framework-badge">Recommended</span>
                    <h3>VSME Standard</h3>
                  </div>
                  <p>Voluntary Standard for SMEs - Simplified ESRS for non-listed companies</p>
                  <ul>
                    <li>✓ Basic Module (B1-B10)</li>
                    <li>✓ Narrative-Policies-Actions</li>
                    <li>✓ Business Partners Module</li>
                  </ul>
                </label>

                <label className="framework-card">
                  <input type="radio" name="framework" value="esrs" />
                  <div className="framework-header">
                    <span className="framework-badge pro">Enterprise</span>
                    <h3>Full ESRS</h3>
                  </div>
                  <p>European Sustainability Reporting Standards - Complete CSRD compliance</p>
                  <ul>
                    <li>✓ All ESRS topical standards</li>
                    <li>✓ Double materiality assessment</li>
                    <li>✓ Full value chain coverage</li>
                  </ul>
                </label>

                <label className="framework-card">
                  <input type="radio" name="framework" value="issb" />
                  <div className="framework-header">
                    <span className="framework-badge">Global</span>
                    <h3>ISSB/IFRS S1-S2</h3>
                  </div>
                  <p>International standards focused on investor-grade climate disclosure</p>
                  <ul>
                    <li>✓ Climate-related disclosures</li>
                    <li>✓ Transition plans</li>
                    <li>✓ Scenario analysis</li>
                  </ul>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-section">
              <h2>Data Source Integrations</h2>
              <p className="section-desc">Connect your ERP and financial systems for automated data collection.</p>
              
              <div className="integrations-grid">
                <div className="integration-card">
                  <div className="integration-logo">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/9f/Xero_software_logo.svg" alt="Xero" />
                  </div>
                  <div className="integration-info">
                    <h4>Xero</h4>
                    <p>Cloud accounting for SMEs</p>
                  </div>
                  <button className="btn btn-secondary">Connect</button>
                </div>

                <div className="integration-card">
                  <div className="integration-logo">
                    <span className="logo-text">Sage</span>
                  </div>
                  <div className="integration-info">
                    <h4>Sage Intacct</h4>
                    <p>Financial management</p>
                  </div>
                  <button className="btn btn-secondary">Connect</button>
                </div>

                <div className="integration-card connected">
                  <div className="integration-logo">
                    <span className="logo-text">🔥</span>
                  </div>
                  <div className="integration-info">
                    <h4>Firebase</h4>
                    <p>Connected</p>
                    <span className="connected-badge">
                      <CheckCircle size={14} /> Active
                    </span>
                  </div>
                  <button className="btn btn-outline">Manage</button>
                </div>

                <div className="integration-card">
                  <div className="integration-logo">
                    <span className="logo-text">DATEV</span>
                  </div>
                  <div className="integration-info">
                    <h4>DATEV</h4>
                    <p>German accounting standard</p>
                  </div>
                  <button className="btn btn-secondary">Connect</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'user' && (
            <div className="settings-section">
              <h2>User Settings</h2>
              <p className="section-desc">Manage your personal profile and preferences.</p>
              
              <form className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" defaultValue="CFO Admin" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" defaultValue="cfo@company.com" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select defaultValue="cfo">
                    <option value="admin">Administrator</option>
                    <option value="cfo">CFO / Finance Lead</option>
                    <option value="analyst">ESG Analyst</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Language</label>
                  <select defaultValue="en">
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <p className="section-desc">Choose how you want to be notified about ESG updates.</p>
              
              <div className="toggle-list">
                <label className="toggle-item">
                  <div>
                    <h4>Data Sync Alerts</h4>
                    <p>Get notified when new data is automatically imported</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
                <label className="toggle-item">
                  <div>
                    <h4>Reporting Deadlines</h4>
                    <p>Reminders for upcoming regulatory submission dates</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
                <label className="toggle-item">
                  <div>
                    <h4>Audit Trail Updates</h4>
                    <p>Notifications when data is modified or verified</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </label>
                <label className="toggle-item">
                  <div>
                    <h4>Weekly Summary</h4>
                    <p>Email digest of your ESG performance metrics</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              <p className="section-desc">Manage authentication and access controls.</p>
              
              <div className="security-section">
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account</p>
                <button className="btn btn-secondary">Enable 2FA</button>
              </div>

              <div className="security-section">
                <h3>API Access</h3>
                <p>Manage API keys for programmatic access</p>
                <div className="api-key-box">
                  <code>ga_live_**********************</code>
                  <button className="btn btn-outline btn-sm">Regenerate</button>
                </div>
              </div>

              <div className="security-section">
                <h3>Session Management</h3>
                <p>View and manage active sessions</p>
                <div className="session-list">
                  <div className="session-item current">
                    <div>
                      <strong>Current Session</strong>
                      <span>Dubai, UAE • Chrome on Mac</span>
                    </div>
                    <span className="badge success">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="settings-actions">
            {saved && (
              <span className="save-success">
                <CheckCircle size={16} /> Settings saved successfully
              </span>
            )}
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

