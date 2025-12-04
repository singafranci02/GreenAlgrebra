"""
ERP Integration Service
=======================

Provides integration with accounting/ERP systems for automated ESG data collection.
Currently implements mock integrations for:
- Xero (Cloud accounting)
- Sage (SME accounting)
- DATEV (German accounting standard)

In production, these would use real OAuth2 flows and API calls.
"""

from typing import Dict, List, Optional
from datetime import date, datetime, timedelta
from enum import Enum
import random
import uuid

class IntegrationProvider(str, Enum):
    XERO = "xero"
    SAGE = "sage"
    DATEV = "datev"
    QUICKBOOKS = "quickbooks"
    NETSUITE = "netsuite"

class ConnectionStatus(str, Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    PENDING = "pending"
    ERROR = "error"


# ============================================
# INTEGRATION CONFIGURATION
# ============================================

PROVIDER_CONFIG = {
    IntegrationProvider.XERO: {
        "name": "Xero",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Xero_software_logo.svg",
        "description": "Cloud accounting for small business",
        "oauth_url": "https://login.xero.com/identity/connect/authorize",
        "capabilities": ["invoices", "expenses", "payroll", "bank_transactions"],
        "regions": ["UK", "AU", "NZ", "US", "EU"],
    },
    IntegrationProvider.SAGE: {
        "name": "Sage Intacct",
        "logo": "https://www.sage.com/favicon.ico",
        "description": "Financial management for growing businesses",
        "oauth_url": "https://www.intacct.com/ia/acct/login.phtml",
        "capabilities": ["invoices", "expenses", "general_ledger", "assets"],
        "regions": ["UK", "US", "EU"],
    },
    IntegrationProvider.DATEV: {
        "name": "DATEV",
        "logo": "https://www.datev.de/favicon.ico",
        "description": "German accounting standard",
        "oauth_url": "https://apps.datev.de/oauth/authorize",
        "capabilities": ["invoices", "bookkeeping", "payroll"],
        "regions": ["DE", "AT", "CH"],
    },
    IntegrationProvider.QUICKBOOKS: {
        "name": "QuickBooks Online",
        "logo": "https://quickbooks.intuit.com/favicon.ico",
        "description": "Small business accounting",
        "oauth_url": "https://appcenter.intuit.com/connect/oauth2",
        "capabilities": ["invoices", "expenses", "payroll", "bank_transactions"],
        "regions": ["US", "UK", "AU", "CA"],
    },
}


# ============================================
# MOCK DATA GENERATORS
# ============================================

def generate_mock_invoices(provider: str, start_date: date, end_date: date) -> List[Dict]:
    """Generate mock invoice/expense data as would be returned from ERP API."""
    
    # ESG-relevant expense categories with typical vendors
    expense_categories = [
        {"category": "utilities_electricity", "vendor_prefix": "Energy Provider", "avg_amount": 850, "esg_type": "energy"},
        {"category": "utilities_gas", "vendor_prefix": "Gas Company", "avg_amount": 420, "esg_type": "energy"},
        {"category": "utilities_water", "vendor_prefix": "Water Services", "avg_amount": 180, "esg_type": "water"},
        {"category": "fuel_diesel", "vendor_prefix": "Fuel Station", "avg_amount": 650, "esg_type": "fuel"},
        {"category": "fuel_petrol", "vendor_prefix": "Petrol Co", "avg_amount": 380, "esg_type": "fuel"},
        {"category": "travel_flights", "vendor_prefix": "Airline", "avg_amount": 1200, "esg_type": "travel"},
        {"category": "travel_rail", "vendor_prefix": "Rail Services", "avg_amount": 280, "esg_type": "travel"},
        {"category": "travel_taxi", "vendor_prefix": "Taxi/Rideshare", "avg_amount": 150, "esg_type": "travel"},
        {"category": "office_supplies", "vendor_prefix": "Office Depot", "avg_amount": 320, "esg_type": "purchased_goods"},
        {"category": "it_equipment", "vendor_prefix": "Tech Supplier", "avg_amount": 2500, "esg_type": "capital_goods"},
        {"category": "professional_services", "vendor_prefix": "Consulting Co", "avg_amount": 3500, "esg_type": "services"},
        {"category": "cleaning_services", "vendor_prefix": "Facilities Mgmt", "avg_amount": 450, "esg_type": "services"},
        {"category": "waste_disposal", "vendor_prefix": "Waste Services", "avg_amount": 220, "esg_type": "waste"},
        {"category": "courier_shipping", "vendor_prefix": "Courier Express", "avg_amount": 380, "esg_type": "transport"},
    ]
    
    invoices = []
    current_date = start_date
    
    while current_date <= end_date:
        # Generate 3-8 invoices per week
        num_invoices = random.randint(3, 8)
        
        for _ in range(num_invoices):
            category = random.choice(expense_categories)
            variance = random.uniform(0.7, 1.4)
            amount = round(category["avg_amount"] * variance, 2)
            
            # Add quantity/unit data for ESG calculations
            quantity_data = generate_quantity_data(category["esg_type"], amount)
            
            invoice = {
                "id": str(uuid.uuid4()),
                "provider": provider,
                "invoice_number": f"INV-{random.randint(10000, 99999)}",
                "date": current_date.isoformat(),
                "due_date": (current_date + timedelta(days=30)).isoformat(),
                "vendor_name": f"{category['vendor_prefix']} {random.choice(['Ltd', 'Inc', 'GmbH', 'SA'])}",
                "category": category["category"],
                "esg_type": category["esg_type"],
                "amount": amount,
                "currency": "EUR",
                "tax_amount": round(amount * 0.20, 2),
                "total_amount": round(amount * 1.20, 2),
                "status": "paid",
                "line_items": [
                    {
                        "description": f"{category['category'].replace('_', ' ').title()} - {current_date.strftime('%B %Y')}",
                        "quantity": quantity_data["quantity"],
                        "unit": quantity_data["unit"],
                        "unit_price": round(amount / quantity_data["quantity"], 2) if quantity_data["quantity"] > 0 else amount,
                        "amount": amount,
                    }
                ],
                # ESG-specific extracted data
                "esg_data": quantity_data,
            }
            
            invoices.append(invoice)
        
        current_date += timedelta(days=7)
    
    return invoices


def generate_quantity_data(esg_type: str, amount: float) -> Dict:
    """Generate realistic quantity data for ESG calculations based on spend."""
    
    quantity_mappings = {
        "energy": {
            "electricity": {"unit": "kWh", "price_per_unit": 0.15, "activity_type": "electricity"},
            "gas": {"unit": "kWh", "price_per_unit": 0.08, "activity_type": "natural_gas"},
        },
        "water": {
            "default": {"unit": "m3", "price_per_unit": 2.50, "activity_type": "water_supply"},
        },
        "fuel": {
            "diesel": {"unit": "litres", "price_per_unit": 1.50, "activity_type": "diesel"},
            "petrol": {"unit": "litres", "price_per_unit": 1.45, "activity_type": "petrol"},
        },
        "travel": {
            "flights": {"unit": "km", "price_per_unit": 0.35, "activity_type": "flight_medium"},
            "rail": {"unit": "km", "price_per_unit": 0.15, "activity_type": "rail"},
            "taxi": {"unit": "km", "price_per_unit": 2.00, "activity_type": "car_petrol"},
        },
        "waste": {
            "default": {"unit": "tonnes", "price_per_unit": 150, "activity_type": "waste_landfill"},
        },
        "purchased_goods": {
            "default": {"unit": "EUR", "price_per_unit": 1, "activity_type": "spend_purchased_goods"},
        },
        "capital_goods": {
            "default": {"unit": "EUR", "price_per_unit": 1, "activity_type": "spend_capital_goods"},
        },
        "services": {
            "default": {"unit": "EUR", "price_per_unit": 1, "activity_type": "spend_services"},
        },
        "transport": {
            "default": {"unit": "EUR", "price_per_unit": 1, "activity_type": "spend_transport"},
        },
    }
    
    type_data = quantity_mappings.get(esg_type, quantity_mappings["purchased_goods"])
    subtype = random.choice(list(type_data.keys()))
    config = type_data[subtype]
    
    quantity = amount / config["price_per_unit"]
    
    return {
        "quantity": round(quantity, 2),
        "unit": config["unit"],
        "activity_type": config["activity_type"],
        "estimated": config["unit"] in ["EUR", "USD"],  # Mark spend-based as estimated
    }


def generate_mock_employees(company_size: str = "medium") -> Dict:
    """Generate mock employee data for social metrics."""
    
    size_ranges = {
        "small": (10, 50),
        "medium": (50, 250),
        "large": (250, 1000),
    }
    
    min_emp, max_emp = size_ranges.get(company_size, (50, 250))
    total = random.randint(min_emp, max_emp)
    
    # Generate realistic diversity breakdown
    female_pct = random.uniform(0.35, 0.55)
    female = int(total * female_pct)
    male = total - female
    
    # Management diversity (typically lower female %)
    mgmt_total = int(total * 0.12)
    mgmt_female = int(mgmt_total * (female_pct - 0.10))
    
    return {
        "total_headcount": total,
        "female_count": female,
        "male_count": male,
        "other_gender_count": 0,
        "management_total": mgmt_total,
        "management_female": mgmt_female,
        "full_time": int(total * 0.85),
        "part_time": int(total * 0.15),
        "new_hires_ytd": int(total * random.uniform(0.08, 0.15)),
        "turnover_ytd": int(total * random.uniform(0.05, 0.12)),
        "training_hours_per_employee": random.randint(20, 40),
        "avg_hourly_wage": round(random.uniform(25, 45), 2),
    }


# ============================================
# INTEGRATION SERVICE CLASS
# ============================================

class IntegrationService:
    """Service for managing ERP integrations."""
    
    def __init__(self, company_id: str):
        self.company_id = company_id
        self._connections: Dict[str, Dict] = {}
    
    def get_available_providers(self) -> List[Dict]:
        """Get list of available integration providers."""
        return [
            {
                "id": provider.value,
                **config,
                "status": self._connections.get(provider.value, {}).get("status", ConnectionStatus.DISCONNECTED.value)
            }
            for provider, config in PROVIDER_CONFIG.items()
        ]
    
    def connect(self, provider: str, credentials: Dict = None) -> Dict:
        """Initiate connection to a provider (mock OAuth flow)."""
        if provider not in [p.value for p in IntegrationProvider]:
            raise ValueError(f"Unknown provider: {provider}")
        
        # In production, this would redirect to OAuth URL
        # For demo, we simulate a successful connection
        connection = {
            "provider": provider,
            "status": ConnectionStatus.CONNECTED.value,
            "connected_at": datetime.utcnow().isoformat(),
            "access_token": f"mock_token_{uuid.uuid4().hex[:16]}",
            "refresh_token": f"mock_refresh_{uuid.uuid4().hex[:16]}",
            "expires_at": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
            "organization_name": f"Demo Company ({provider.title()})",
            "organization_id": str(uuid.uuid4()),
        }
        
        self._connections[provider] = connection
        return connection
    
    def disconnect(self, provider: str) -> bool:
        """Disconnect from a provider."""
        if provider in self._connections:
            del self._connections[provider]
            return True
        return False
    
    def get_connection_status(self, provider: str) -> Dict:
        """Get current connection status for a provider."""
        if provider in self._connections:
            return self._connections[provider]
        return {"provider": provider, "status": ConnectionStatus.DISCONNECTED.value}
    
    def sync_data(self, provider: str, data_types: List[str], date_from: date, date_to: date) -> Dict:
        """Sync data from connected provider."""
        if provider not in self._connections:
            raise ValueError(f"Provider {provider} not connected")
        
        if self._connections[provider]["status"] != ConnectionStatus.CONNECTED.value:
            raise ValueError(f"Provider {provider} is not in connected state")
        
        result = {
            "provider": provider,
            "synced_at": datetime.utcnow().isoformat(),
            "date_range": {"from": date_from.isoformat(), "to": date_to.isoformat()},
            "data": {}
        }
        
        if "invoices" in data_types or "expenses" in data_types:
            invoices = generate_mock_invoices(provider, date_from, date_to)
            result["data"]["invoices"] = invoices
            result["data"]["invoices_count"] = len(invoices)
            
            # Calculate totals by ESG category
            esg_totals = {}
            for inv in invoices:
                esg_type = inv["esg_type"]
                if esg_type not in esg_totals:
                    esg_totals[esg_type] = {"count": 0, "total_amount": 0}
                esg_totals[esg_type]["count"] += 1
                esg_totals[esg_type]["total_amount"] += inv["amount"]
            result["data"]["esg_summary"] = esg_totals
        
        if "employees" in data_types or "payroll" in data_types:
            result["data"]["employees"] = generate_mock_employees()
        
        return result
    
    def get_expense_categories(self, provider: str) -> List[Dict]:
        """Get expense categories/chart of accounts from provider."""
        # Return standardized ESG-relevant categories
        return [
            {"code": "UTIL-ELEC", "name": "Utilities - Electricity", "esg_mapping": "energy"},
            {"code": "UTIL-GAS", "name": "Utilities - Gas", "esg_mapping": "energy"},
            {"code": "UTIL-WATER", "name": "Utilities - Water", "esg_mapping": "water"},
            {"code": "FUEL-DIESEL", "name": "Fuel - Diesel", "esg_mapping": "fuel"},
            {"code": "FUEL-PETROL", "name": "Fuel - Petrol", "esg_mapping": "fuel"},
            {"code": "TRVL-AIR", "name": "Travel - Air", "esg_mapping": "travel"},
            {"code": "TRVL-RAIL", "name": "Travel - Rail", "esg_mapping": "travel"},
            {"code": "TRVL-TAXI", "name": "Travel - Taxi/Rideshare", "esg_mapping": "travel"},
            {"code": "OFF-SUPP", "name": "Office Supplies", "esg_mapping": "purchased_goods"},
            {"code": "IT-EQUIP", "name": "IT Equipment", "esg_mapping": "capital_goods"},
            {"code": "PROF-SVC", "name": "Professional Services", "esg_mapping": "services"},
            {"code": "WASTE", "name": "Waste Disposal", "esg_mapping": "waste"},
            {"code": "SHIPPING", "name": "Courier & Shipping", "esg_mapping": "transport"},
        ]


# Singleton instance getter
_integration_services: Dict[str, IntegrationService] = {}

def get_integration_service(company_id: str) -> IntegrationService:
    """Get or create integration service for a company."""
    if company_id not in _integration_services:
        _integration_services[company_id] = IntegrationService(company_id)
    return _integration_services[company_id]

