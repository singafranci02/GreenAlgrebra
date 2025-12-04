"""
Database Service Layer for ESG Data
====================================

Provides CRUD operations for ESG reports using Firestore.
Falls back to mock data when Firebase is not configured.
"""

from datetime import date
from typing import List, Optional
import random
import uuid

from .firebase_config import get_firestore_client, is_firebase_configured
from .models import (
    ESGReport, EnergyConsumption, GHGEmissions, WaterUsage,
    EmployeeMetrics, Scope3Category, FuelType, ScopeType
)


class ESGDatabaseService:
    """Service class for ESG data operations."""
    
    def __init__(self):
        self.db = get_firestore_client()
        self.collection_name = "esg_reports"
    
    async def get_report(self, year: int, company_id: str = "default") -> ESGReport:
        """
        Fetch ESG report for a given year and company.
        Falls back to mock data if Firebase is not configured.
        """
        if not is_firebase_configured():
            return self._generate_mock_report(year)
        
        # Try to fetch from Firestore
        doc_ref = self.db.collection(self.collection_name).document(f"{company_id}_{year}")
        doc = doc_ref.get()
        
        if doc.exists:
            return self._dict_to_report(doc.to_dict())
        else:
            # Generate and save mock data for demo purposes
            report = self._generate_mock_report(year)
            await self.save_report(report, company_id)
            return report
    
    async def save_report(self, report: ESGReport, company_id: str = "default") -> bool:
        """Save an ESG report to Firestore."""
        if not is_firebase_configured():
            print("Firebase not configured - data not persisted")
            return False
        
        doc_ref = self.db.collection(self.collection_name).document(f"{company_id}_{report.reporting_year}")
        doc_ref.set(self._report_to_dict(report))
        return True
    
    async def save_energy_data(self, year: int, energy_data: List[EnergyConsumption], company_id: str = "default") -> bool:
        """Update energy consumption data for a report."""
        if not is_firebase_configured():
            return False
        
        doc_ref = self.db.collection(self.collection_name).document(f"{company_id}_{year}")
        doc_ref.update({
            "energy_data": [self._energy_to_dict(e) for e in energy_data]
        })
        return True
    
    async def save_emissions_data(self, year: int, emissions_data: List[GHGEmissions], company_id: str = "default") -> bool:
        """Update GHG emissions data for a report."""
        if not is_firebase_configured():
            return False
        
        doc_ref = self.db.collection(self.collection_name).document(f"{company_id}_{year}")
        doc_ref.update({
            "emissions_data": [self._emissions_to_dict(e) for e in emissions_data]
        })
        return True
    
    async def list_reports(self, company_id: str = "default") -> List[int]:
        """List all available report years for a company."""
        if not is_firebase_configured():
            return [2024, 2023, 2022]  # Mock years
        
        docs = self.db.collection(self.collection_name).where("company_id", "==", company_id).stream()
        years = []
        for doc in docs:
            data = doc.to_dict()
            if "reporting_year" in data:
                years.append(data["reporting_year"])
        return sorted(years, reverse=True)
    
    # ==================== Conversion Helpers ====================
    
    def _report_to_dict(self, report: ESGReport) -> dict:
        """Convert ESGReport to Firestore-compatible dict."""
        return {
            "reporting_year": report.reporting_year,
            "energy_data": [self._energy_to_dict(e) for e in report.energy_data],
            "emissions_data": [self._emissions_to_dict(e) for e in report.emissions_data],
            "water_data": [self._water_to_dict(w) for w in report.water_data],
            "employee_data": self._employee_to_dict(report.employee_data) if report.employee_data else None,
            "scope_3_data": [self._scope3_to_dict(s) for s in report.scope_3_data],
        }
    
    def _dict_to_report(self, data: dict) -> ESGReport:
        """Convert Firestore dict to ESGReport."""
        return ESGReport(
            reporting_year=data["reporting_year"],
            energy_data=[self._dict_to_energy(e) for e in data.get("energy_data", [])],
            emissions_data=[self._dict_to_emissions(e) for e in data.get("emissions_data", [])],
            water_data=[self._dict_to_water(w) for w in data.get("water_data", [])],
            employee_data=self._dict_to_employee(data["employee_data"]) if data.get("employee_data") else None,
            scope_3_data=[self._dict_to_scope3(s) for s in data.get("scope_3_data", [])],
        )
    
    def _energy_to_dict(self, e: EnergyConsumption) -> dict:
        return {
            "id": e.id,
            "period_start": e.period_start.isoformat(),
            "period_end": e.period_end.isoformat(),
            "fuel_type": e.fuel_type.value,
            "consumption_kwh": e.consumption_kwh,
            "source_document": e.source_document,
        }
    
    def _dict_to_energy(self, d: dict) -> EnergyConsumption:
        return EnergyConsumption(
            id=d.get("id"),
            period_start=date.fromisoformat(d["period_start"]),
            period_end=date.fromisoformat(d["period_end"]),
            fuel_type=FuelType(d["fuel_type"]),
            consumption_kwh=d["consumption_kwh"],
            source_document=d.get("source_document"),
        )
    
    def _emissions_to_dict(self, e: GHGEmissions) -> dict:
        return {
            "id": e.id,
            "period_start": e.period_start.isoformat(),
            "period_end": e.period_end.isoformat(),
            "scope": e.scope.value,
            "co2e_tonnes": e.co2e_tonnes,
            "methodology": e.methodology,
        }
    
    def _dict_to_emissions(self, d: dict) -> GHGEmissions:
        return GHGEmissions(
            id=d.get("id"),
            period_start=date.fromisoformat(d["period_start"]),
            period_end=date.fromisoformat(d["period_end"]),
            scope=ScopeType(d["scope"]),
            co2e_tonnes=d["co2e_tonnes"],
            methodology=d["methodology"],
        )
    
    def _water_to_dict(self, w: WaterUsage) -> dict:
        return {
            "id": w.id,
            "period_start": w.period_start.isoformat(),
            "period_end": w.period_end.isoformat(),
            "volume_m3": w.volume_m3,
            "source_document": w.source_document,
        }
    
    def _dict_to_water(self, d: dict) -> WaterUsage:
        return WaterUsage(
            id=d.get("id"),
            period_start=date.fromisoformat(d["period_start"]),
            period_end=date.fromisoformat(d["period_end"]),
            volume_m3=d["volume_m3"],
            source_document=d.get("source_document"),
        )
    
    def _employee_to_dict(self, e: EmployeeMetrics) -> dict:
        return {
            "period_end": e.period_end.isoformat(),
            "total_headcount": e.total_headcount,
            "female_count": e.female_count,
            "male_count": e.male_count,
            "other_gender_count": e.other_gender_count,
        }
    
    def _dict_to_employee(self, d: dict) -> EmployeeMetrics:
        return EmployeeMetrics(
            period_end=date.fromisoformat(d["period_end"]),
            total_headcount=d["total_headcount"],
            female_count=d["female_count"],
            male_count=d["male_count"],
            other_gender_count=d.get("other_gender_count", 0),
        )
    
    def _scope3_to_dict(self, s: Scope3Category) -> dict:
        return {
            "category_name": s.category_name,
            "spend_amount": s.spend_amount,
            "estimated_co2e": s.estimated_co2e,
        }
    
    def _dict_to_scope3(self, d: dict) -> Scope3Category:
        return Scope3Category(
            category_name=d["category_name"],
            spend_amount=d["spend_amount"],
            estimated_co2e=d["estimated_co2e"],
        )
    
    # ==================== Mock Data Generation ====================
    
    def _generate_mock_report(self, year: int) -> ESGReport:
        """Generate mock ESG report for demo purposes."""
        
        energy_data = [
            EnergyConsumption(
                id=str(uuid.uuid4()),
                period_start=date(year, 1, 1),
                period_end=date(year, 12, 31),
                fuel_type=FuelType.RENEWABLE,
                consumption_kwh=random.uniform(8000, 15000),
                source_document="utility_invoice_renewable.pdf"
            ),
            EnergyConsumption(
                id=str(uuid.uuid4()),
                period_start=date(year, 1, 1),
                period_end=date(year, 12, 31),
                fuel_type=FuelType.NON_RENEWABLE,
                consumption_kwh=random.uniform(12000, 22000),
                source_document="utility_invoice_grid.pdf"
            )
        ]
        
        emissions_data = [
            GHGEmissions(
                id=str(uuid.uuid4()),
                period_start=date(year, 1, 1),
                period_end=date(year, 12, 31),
                scope=ScopeType.SCOPE_1,
                co2e_tonnes=random.uniform(45, 95),
                methodology="Activity-based (GHG Protocol)"
            ),
            GHGEmissions(
                id=str(uuid.uuid4()),
                period_start=date(year, 1, 1),
                period_end=date(year, 12, 31),
                scope=ScopeType.SCOPE_2_MARKET,
                co2e_tonnes=random.uniform(20, 55),
                methodology="Market-based (EF from supplier)"
            )
        ]
        
        water_data = [
            WaterUsage(
                id=str(uuid.uuid4()),
                period_start=date(year, 1, 1),
                period_end=date(year, 12, 31),
                volume_m3=random.uniform(1500, 4500),
                source_document="water_utility_bill.pdf"
            )
        ]
        
        employee_data = EmployeeMetrics(
            period_end=date(year, 12, 31),
            total_headcount=random.randint(80, 150),
            female_count=random.randint(35, 70),
            male_count=random.randint(40, 80),
            other_gender_count=random.randint(0, 5)
        )
        # Ensure totals match
        employee_data.male_count = employee_data.total_headcount - employee_data.female_count - employee_data.other_gender_count
        
        scope_3_data = [
            Scope3Category(
                category_name="Purchased Goods and Services",
                spend_amount=random.uniform(400000, 900000),
                estimated_co2e=random.uniform(150, 350)
            ),
            Scope3Category(
                category_name="Business Travel",
                spend_amount=random.uniform(40000, 120000),
                estimated_co2e=random.uniform(15, 60)
            ),
            Scope3Category(
                category_name="Employee Commuting",
                spend_amount=random.uniform(20000, 50000),
                estimated_co2e=random.uniform(25, 80)
            )
        ]
        
        return ESGReport(
            reporting_year=year,
            energy_data=energy_data,
            emissions_data=emissions_data,
            water_data=water_data,
            employee_data=employee_data,
            scope_3_data=scope_3_data
        )


# Singleton instance
_db_service: Optional[ESGDatabaseService] = None

def get_db_service() -> ESGDatabaseService:
    """Get the database service singleton."""
    global _db_service
    if _db_service is None:
        _db_service = ESGDatabaseService()
    return _db_service

