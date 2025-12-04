import { useState, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  FileImage,
  File,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Header } from '../components/Header';
import { api } from '../api';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  extractedData?: {
    type: string;
    value: string;
    confidence: number;
  }[];
  error?: string;
}

export function DataUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    for (const file of newFiles) {
      const fileId = crypto.randomUUID();
      
      // Add file to list
      setFiles(prev => [...prev, {
        id: fileId,
        name: file.name,
        size: file.size,
        status: 'uploading',
        progress: 0,
      }]);

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(r => setTimeout(r, 100));
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: i } : f
        ));
      }

      // Update status to processing
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'processing', progress: 100 } : f
      ));

      try {
        // Call API
        const result = await api.uploadInvoice(file);
        
        // Simulate AI extraction results
        await new Promise(r => setTimeout(r, 1500));
        
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: 'complete',
            extractedData: [
              { type: 'Vendor', value: 'Utility Company Inc.', confidence: 0.95 },
              { type: 'Period', value: '2024-Q3', confidence: 0.92 },
              { type: 'Energy (kWh)', value: '12,450', confidence: 0.88 },
              { type: 'Cost ($)', value: '2,156.00', confidence: 0.97 },
            ]
          } : f
        ));
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: 'error',
            error: 'Failed to process file'
          } : f
        ));
      }
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return FileImage;
    if (['pdf'].includes(ext || '')) return FileText;
    return File;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="page-container">
      <Header 
        title="Data Upload" 
        subtitle="AI-powered invoice and document processing" 
      />

      {/* Upload Zone */}
      <div 
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-zone-content">
          <div className="upload-icon">
            <Upload size={48} />
            <Sparkles className="sparkle" size={20} />
          </div>
          <h3>Drop files here or click to upload</h3>
          <p>Support for PDF invoices, utility bills, and images</p>
          <div className="upload-formats">
            <span>PDF</span>
            <span>PNG</span>
            <span>JPG</span>
            <span>CSV</span>
          </div>
          <input 
            type="file" 
            multiple 
            accept=".pdf,.png,.jpg,.jpeg,.csv"
            onChange={handleFileSelect}
            className="upload-input"
          />
          <button className="btn btn-primary">
            Select Files
          </button>
        </div>
      </div>

      {/* AI Features */}
      <div className="ai-features">
        <div className="ai-feature">
          <div className="ai-feature-icon">🔍</div>
          <div>
            <h4>OCR Extraction</h4>
            <p>Automatically reads text from scanned documents</p>
          </div>
        </div>
        <div className="ai-feature">
          <div className="ai-feature-icon">🧠</div>
          <div>
            <h4>Smart Classification</h4>
            <p>AI categorizes expenses to correct ESG modules</p>
          </div>
        </div>
        <div className="ai-feature">
          <div className="ai-feature-icon">⚡</div>
          <div>
            <h4>Emission Factors</h4>
            <p>Automatically applies correct CO₂e conversion factors</p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="uploaded-files">
          <h3>Uploaded Files</h3>
          <div className="file-list">
            {files.map(file => {
              const FileIcon = getFileIcon(file.name);
              return (
                <div key={file.id} className={`file-item ${file.status}`}>
                  <div className="file-icon">
                    <FileIcon size={24} />
                  </div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-meta">
                      {formatSize(file.size)}
                      {file.status === 'uploading' && (
                        <span className="file-progress">{file.progress}%</span>
                      )}
                      {file.status === 'processing' && (
                        <span className="file-status processing">
                          <Sparkles size={14} className="spin" /> AI Processing...
                        </span>
                      )}
                      {file.status === 'complete' && (
                        <span className="file-status complete">
                          <CheckCircle size={14} /> Extracted
                        </span>
                      )}
                      {file.status === 'error' && (
                        <span className="file-status error">
                          <AlertCircle size={14} /> {file.error}
                        </span>
                      )}
                    </div>
                    {file.status === 'uploading' && (
                      <div className="progress-bar">
                        <div className="progress" style={{ width: `${file.progress}%` }}></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Extracted Data */}
                  {file.extractedData && (
                    <div className="extracted-data">
                      <h4>Extracted Data</h4>
                      <div className="extracted-grid">
                        {file.extractedData.map((item, i) => (
                          <div key={i} className="extracted-item">
                            <span className="extracted-type">{item.type}</span>
                            <span className="extracted-value">{item.value}</span>
                            <span className="extracted-confidence">
                              {Math.round(item.confidence * 100)}% confident
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="extracted-actions">
                        <button className="btn btn-secondary">Edit Values</button>
                        <button className="btn btn-primary">
                          Apply to Report <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    className="file-remove" 
                    onClick={() => removeFile(file.id)}
                    aria-label="Remove file"
                  >
                    <X size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Uploads */}
      <div className="recent-uploads">
        <h3>Recent Processing History</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Type</th>
              <th>Extracted Value</th>
              <th>Applied To</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="table-file">
                  <FileText size={16} />
                  electricity_bill_nov.pdf
                </div>
              </td>
              <td>Utility Bill</td>
              <td>15,230 kWh</td>
              <td>Energy (B1)</td>
              <td>Nov 28, 2024</td>
              <td><span className="badge success">Applied</span></td>
            </tr>
            <tr>
              <td>
                <div className="table-file">
                  <FileText size={16} />
                  water_invoice_q3.pdf
                </div>
              </td>
              <td>Water Bill</td>
              <td>856 m³</td>
              <td>Water (B3)</td>
              <td>Nov 25, 2024</td>
              <td><span className="badge success">Applied</span></td>
            </tr>
            <tr>
              <td>
                <div className="table-file">
                  <FileText size={16} />
                  travel_expenses.csv
                </div>
              </td>
              <td>Expense Report</td>
              <td>$12,450</td>
              <td>Scope 3 (BP1)</td>
              <td>Nov 22, 2024</td>
              <td><span className="badge warning">Review</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

