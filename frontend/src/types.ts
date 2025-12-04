// ESG Report Types - Aligned with VSME Standard

export interface EnergyConsumption {
  id: string;
  period_start: string;
  period_end: string;
  fuel_type: 'renewable' | 'non_renewable';
  consumption_kwh: number;
  source_document?: string;
}

export interface GHGEmissions {
  id: string;
  period_start: string;
  period_end: string;
  scope: 'scope_1' | 'scope_2_location' | 'scope_2_market' | 'scope_3';
  co2e_tonnes: number;
  methodology: string;
}

export interface WaterUsage {
  id: string;
  period_start: string;
  period_end: string;
  volume_m3: number;
  source_document?: string;
}

export interface EmployeeMetrics {
  period_end: string;
  total_headcount: number;
  female_count: number;
  male_count: number;
  other_gender_count?: number;
}

export interface Scope3Category {
  category_name: string;
  spend_amount: number;
  estimated_co2e: number;
}

export interface ESGReport {
  reporting_year: number;
  energy_data: EnergyConsumption[];
  emissions_data: GHGEmissions[];
  water_data: WaterUsage[];
  employee_data: EmployeeMetrics | null;
  scope_3_data: Scope3Category[];
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  nace_code?: string;
  country: string;
  employees_count: number;
  reporting_framework: 'vsme' | 'esrs' | 'gri' | 'issb';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'cfo' | 'analyst' | 'viewer';
  company_id: string;
}

