from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from enum import Enum

class FuelType(str, Enum):
    RENEWABLE = "renewable"
    NON_RENEWABLE = "non_renewable"
    
class ScopeType(str, Enum):
    SCOPE_1 = "scope_1"
    SCOPE_2_LOCATION = "scope_2_location"
    SCOPE_2_MARKET = "scope_2_market"
    SCOPE_3 = "scope_3"

class EnergyConsumption(BaseModel):
    id: Optional[str] = None
    period_start: date
    period_end: date
    fuel_type: FuelType
    consumption_kwh: float
    source_document: Optional[str] = None  # Link to invoice

class GHGEmissions(BaseModel):
    id: Optional[str] = None
    period_start: date
    period_end: date
    scope: ScopeType
    co2e_tonnes: float
    methodology: str = Field(..., description="e.g., Spend-based, Activity-based")

class WaterUsage(BaseModel):
    id: Optional[str] = None
    period_start: date
    period_end: date
    volume_m3: float
    source_document: Optional[str] = None

class EmployeeMetrics(BaseModel):
    period_end: date
    total_headcount: int
    female_count: int
    male_count: int
    other_gender_count: int = 0

class Scope3Category(BaseModel):
    category_name: str  # e.g. "Purchased Goods", "Business Travel"
    spend_amount: float
    estimated_co2e: float

class ESGReport(BaseModel):
    reporting_year: int
    energy_data: List[EnergyConsumption] = []
    emissions_data: List[GHGEmissions] = []
    water_data: List[WaterUsage] = []
    employee_data: Optional[EmployeeMetrics] = None
    scope_3_data: List[Scope3Category] = []

