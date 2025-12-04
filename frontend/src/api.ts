// API Service Layer

// Types
interface EnergyConsumption {
  id: string;
  period_start: string;
  period_end: string;
  fuel_type: 'renewable' | 'non_renewable';
  consumption_kwh: number;
  source_document?: string;
}

interface GHGEmissions {
  id: string;
  period_start: string;
  period_end: string;
  scope: string;
  co2e_tonnes: number;
  methodology: string;
}

interface EmployeeMetrics {
  period_end: string;
  total_headcount: number;
  female_count: number;
  male_count: number;
  other_gender_count?: number;
}

interface Scope3Category {
  category_name: string;
  spend_amount: number;
  estimated_co2e: number;
}

interface WaterUsage {
  id: string;
  period_start: string;
  period_end: string;
  volume_m3: number;
  source_document?: string;
}

export interface ESGReport {
  reporting_year: number;
  energy_data: EnergyConsumption[];
  emissions_data: GHGEmissions[];
  water_data: WaterUsage[];
  employee_data: EmployeeMetrics | null;
  scope_3_data: Scope3Category[];
}

import { API_BASE } from './config/api';

export const api = {
  // Health check
  async getStatus() {
    const res = await fetch(`${API_BASE}/`);
    return res.json();
  },

  // Reports
  async getReport(year: number): Promise<ESGReport> {
    const res = await fetch(`${API_BASE}/report/${year}`);
    if (!res.ok) throw new Error('Failed to fetch report');
    return res.json();
  },

  async getAvailableYears(): Promise<number[]> {
    const res = await fetch(`${API_BASE}/reports`);
    if (!res.ok) throw new Error('Failed to fetch years');
    return res.json();
  },

  async saveReport(year: number, report: ESGReport): Promise<ESGReport> {
    const res = await fetch(`${API_BASE}/report/${year}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    if (!res.ok) throw new Error('Failed to save report');
    return res.json();
  },

  // Energy Data
  async updateEnergy(year: number, data: EnergyConsumption[]) {
    const res = await fetch(`${API_BASE}/report/${year}/energy`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Emissions Data
  async updateEmissions(year: number, data: GHGEmissions[]) {
    const res = await fetch(`${API_BASE}/report/${year}/emissions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // File Upload
  async uploadInvoice(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload/invoice`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  // Export
  async exportXBRL(year: number) {
    const res = await fetch(`${API_BASE}/export/${year}/xbrl`);
    return res.json();
  },
};

