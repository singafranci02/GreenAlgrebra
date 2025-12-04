import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle,
  Clock,
  Eye,
  Send,
  FileCode,
} from 'lucide-react';
import { Header } from '../components/Header';

interface Report {
  id: string;
  name: string;
  year: number;
  framework: string;
  status: 'draft' | 'review' | 'approved' | 'submitted';
  lastUpdated: string;
  completeness: number;
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Annual ESG Report 2024',
    year: 2024,
    framework: 'VSME',
    status: 'draft',
    lastUpdated: '2024-12-03',
    completeness: 75,
  },
  {
    id: '2',
    name: 'Annual ESG Report 2023',
    year: 2023,
    framework: 'VSME',
    status: 'submitted',
    lastUpdated: '2024-03-15',
    completeness: 100,
  },
  {
    id: '3',
    name: 'Q3 Sustainability Update',
    year: 2024,
    framework: 'Custom',
    status: 'approved',
    lastUpdated: '2024-10-01',
    completeness: 100,
  },
];

export function Reports() {
  const [reports] = useState<Report[]>(mockReports);

  const getStatusBadge = (status: Report['status']) => {
    const config = {
      draft: { icon: Clock, className: 'warning', label: 'Draft' },
      review: { icon: Eye, className: 'info', label: 'In Review' },
      approved: { icon: CheckCircle, className: 'success', label: 'Approved' },
      submitted: { icon: Send, className: 'success', label: 'Submitted' },
    };
    const { icon: Icon, className, label } = config[status];
    return (
      <span className={`badge ${className}`}>
        <Icon size={12} /> {label}
      </span>
    );
  };

  return (
    <div className="page-container">
      <Header 
        title="Reports" 
        subtitle="Generate, review, and export ESG reports" 
      />

      {/* Report Actions */}
      <div className="report-actions">
        <button className="btn btn-primary">
          <FileText size={16} /> New Report
        </button>
        <div className="report-filters">
          <select defaultValue="all">
            <option value="all">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <select defaultValue="all">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="approved">Approved</option>
            <option value="submitted">Submitted</option>
          </select>
        </div>
      </div>

      {/* Report Cards */}
      <div className="reports-grid">
        {reports.map(report => (
          <div key={report.id} className="report-card">
            <div className="report-card-header">
              <div className="report-icon">
                <FileText size={24} />
              </div>
              <div>
                <h3>{report.name}</h3>
                <div className="report-meta">
                  <span><Calendar size={14} /> {report.year}</span>
                  <span className="framework-badge">{report.framework}</span>
                </div>
              </div>
            </div>

            <div className="report-card-body">
              <div className="completeness">
                <div className="completeness-header">
                  <span>Completeness</span>
                  <span>{report.completeness}%</span>
                </div>
                <div className="completeness-bar">
                  <div 
                    className="completeness-progress" 
                    style={{ width: `${report.completeness}%` }}
                  ></div>
                </div>
              </div>

              <div className="report-info">
                <div className="info-row">
                  <span>Status</span>
                  {getStatusBadge(report.status)}
                </div>
                <div className="info-row">
                  <span>Last Updated</span>
                  <span>{new Date(report.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="report-card-actions">
              <button className="btn btn-secondary btn-sm">
                <Eye size={14} /> Preview
              </button>
              <button className="btn btn-secondary btn-sm">
                <Download size={14} /> PDF
              </button>
              <button className="btn btn-outline btn-sm">
                <FileCode size={14} /> XBRL
              </button>
            </div>
          </div>
        ))}

        {/* New Report Card */}
        <div className="report-card new-report">
          <div className="new-report-content">
            <div className="new-report-icon">+</div>
            <h3>Create New Report</h3>
            <p>Start a new ESG report for any fiscal year</p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>

      {/* Export Templates */}
      <div className="export-section">
        <h2>Export Templates</h2>
        <p className="section-desc">Download regulatory-compliant report templates</p>
        
        <div className="template-grid">
          <div className="template-card">
            <div className="template-icon vsme">📋</div>
            <div className="template-info">
              <h4>VSME Basic Module</h4>
              <p>10 mandatory disclosures for SMEs</p>
            </div>
            <button className="btn btn-outline btn-sm">
              <Download size={14} /> XBRL
            </button>
          </div>

          <div className="template-card">
            <div className="template-icon esrs">📊</div>
            <div className="template-info">
              <h4>ESRS Full Set</h4>
              <p>Complete CSRD compliance package</p>
            </div>
            <button className="btn btn-outline btn-sm">
              <Download size={14} /> XBRL
            </button>
          </div>

          <div className="template-card">
            <div className="template-icon pdf">📄</div>
            <div className="template-info">
              <h4>Stakeholder Report</h4>
              <p>Formatted PDF for external sharing</p>
            </div>
            <button className="btn btn-outline btn-sm">
              <Download size={14} /> PDF
            </button>
          </div>

          <div className="template-card">
            <div className="template-icon csv">📈</div>
            <div className="template-info">
              <h4>Data Export</h4>
              <p>Raw data in CSV format</p>
            </div>
            <button className="btn btn-outline btn-sm">
              <Download size={14} /> CSV
            </button>
          </div>
        </div>
      </div>

      {/* Submission History */}
      <div className="submission-history">
        <h2>Submission History</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Report</th>
              <th>Framework</th>
              <th>Submitted To</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Annual ESG Report 2023</td>
              <td>VSME</td>
              <td>EFRAG Digital Platform</td>
              <td>Mar 15, 2024</td>
              <td><span className="badge success">Accepted</span></td>
              <td>
                <button className="btn btn-link">View Receipt</button>
              </td>
            </tr>
            <tr>
              <td>Annual ESG Report 2022</td>
              <td>VSME</td>
              <td>EFRAG Digital Platform</td>
              <td>Mar 20, 2023</td>
              <td><span className="badge success">Accepted</span></td>
              <td>
                <button className="btn btn-link">View Receipt</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

