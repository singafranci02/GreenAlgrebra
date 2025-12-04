"""
GreenAlgebra API - Automated ESG CFO Reporting Service
======================================================

FastAPI backend providing ESG data endpoints for the VSME reporting framework.
Includes:
- ERP Integrations (Xero, Sage, DATEV)
- Emission Factor Calculations (DEFRA, EPA)
- Automated Carbon Accounting
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel

from .models import (
    ESGReport, EnergyConsumption, GHGEmissions, WaterUsage,
    EmployeeMetrics, Scope3Category
)
from .database import get_db_service
from .firebase_config import is_firebase_configured
from .emission_factors import (
    calculate_emissions,
    calculate_electricity_emissions,
    calculate_travel_emissions,
    calculate_spend_based_emissions,
    EMISSION_FACTORS,
    get_emission_factor
)
from .integrations import (
    get_integration_service,
    IntegrationProvider,
    PROVIDER_CONFIG
)

# Initialize FastAPI app
app = FastAPI(
    title="GreenAlgebra API",
    description="Automated ESG CFO Reporting Service for SMEs - VSME Compliant",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
import os

origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",
    "https://greenalgebra.com",
    "https://www.greenalgebra.com",
    # Add production URLs from environment
    os.getenv("FRONTEND_URL", ""),
    os.getenv("VERCEL_URL", ""),
]

# Filter out empty strings
origins = [origin for origin in origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Request/Response Models ====================

class EmissionCalculationRequest(BaseModel):
    activity_type: str
    quantity: float
    country: str = "default"
    variant: Optional[str] = None
    sub_category: Optional[str] = None

class ElectricityCalculationRequest(BaseModel):
    kwh: float
    country: str = "UK"
    renewable_percentage: float = 0

class TravelCalculationRequest(BaseModel):
    distance_km: float
    travel_type: str
    travel_class: Optional[str] = None

class SpendCalculationRequest(BaseModel):
    spend_amount: float
    category: str
    sub_category: str = "default"
    currency: str = "EUR"

class IntegrationConnectRequest(BaseModel):
    provider: str
    
class IntegrationSyncRequest(BaseModel):
    provider: str
    data_types: List[str] = ["invoices", "expenses"]
    date_from: date
    date_to: date


# ==================== Health & Status ====================

@app.get("/", tags=["Status"])
async def root():
    """API root endpoint with status information."""
    return {
        "service": "GreenAlgebra API",
        "version": "2.0.0",
        "status": "operational",
        "firebase_connected": is_firebase_configured(),
        "features": {
            "emission_calculations": True,
            "erp_integrations": True,
            "ai_invoice_processing": "coming_soon"
        },
        "docs": "/docs"
    }


@app.get("/health", tags=["Status"])
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "database": "connected" if is_firebase_configured() else "demo_mode",
        "services": {
            "emission_engine": "operational",
            "integration_service": "operational"
        }
    }


# ==================== Emission Calculations ====================

@app.post("/calculate/emissions", tags=["Carbon Calculator"])
async def calculate_carbon_emissions(request: EmissionCalculationRequest):
    """
    Calculate CO2e emissions for any activity type.
    
    Supports:
    - Energy (electricity, natural_gas)
    - Fuels (diesel, petrol, lpg)
    - Transport (car_petrol, car_diesel, flights, rail, bus)
    - Water & Waste
    - Spend-based calculations (EEIO method)
    
    Returns emissions in both kgCO2e and tonnes CO2e.
    """
    try:
        result = calculate_emissions(
            activity_type=request.activity_type,
            quantity=request.quantity,
            country=request.country,
            variant=request.variant,
            sub_category=request.sub_category
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/calculate/electricity", tags=["Carbon Calculator"])
async def calculate_electricity_carbon(request: ElectricityCalculationRequest):
    """
    Calculate emissions from electricity consumption.
    
    Supports location-based factors for different countries and
    accounts for renewable energy percentage.
    """
    result = calculate_electricity_emissions(
        kwh=request.kwh,
        country=request.country,
        renewable_percentage=request.renewable_percentage
    )
    return result


@app.post("/calculate/travel", tags=["Carbon Calculator"])
async def calculate_travel_carbon(request: TravelCalculationRequest):
    """
    Calculate emissions from business travel.
    
    Travel types: car_petrol, car_diesel, car_electric, 
    flight_domestic, flight_short_haul, flight_long_haul, train, bus
    """
    try:
        result = calculate_travel_emissions(
            distance_km=request.distance_km,
            travel_type=request.travel_type,
            travel_class=request.travel_class
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/calculate/spend", tags=["Carbon Calculator"])
async def calculate_spend_carbon(request: SpendCalculationRequest):
    """
    Calculate Scope 3 emissions using spend-based EEIO method.
    
    Categories: purchased_goods, capital_goods, services, transport
    Sub-categories vary by category (e.g., manufacturing, electronics for goods)
    """
    try:
        result = calculate_spend_based_emissions(
            spend_amount=request.spend_amount,
            category=request.category,
            sub_category=request.sub_category,
            currency=request.currency
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/emission-factors", tags=["Carbon Calculator"])
async def list_emission_factors():
    """
    Get list of all available emission factors.
    
    Returns factor values, units, and applicable scopes.
    """
    factors = []
    for activity_type, data in EMISSION_FACTORS.items():
        factor_info = {
            "activity_type": activity_type,
            "unit": data.get("unit", "unknown"),
            "scope": data.get("scope", "").value if hasattr(data.get("scope", ""), "value") else str(data.get("scope", "")),
        }
        
        if "factor" in data:
            factor_info["factor_kgCO2e"] = data["factor"]
        elif "factors" in data and isinstance(data["factors"], dict):
            factor_info["factors_by_region"] = data["factors"]
        
        if "variants" in data:
            factor_info["variants"] = data["variants"]
            
        factors.append(factor_info)
    
    return {"emission_factors": factors, "source": "DEFRA 2024, EPA, EEIO"}


@app.get("/emission-factors/{activity_type}", tags=["Carbon Calculator"])
async def get_emission_factor_detail(
    activity_type: str,
    country: str = Query(default="default", description="Country code (e.g., UK, DE, FR)")
):
    """Get emission factor for a specific activity type."""
    try:
        factor = get_emission_factor(activity_type, country)
        return {
            "activity_type": activity_type,
            "country": country,
            "factor_kgCO2e_per_unit": factor,
            "unit": EMISSION_FACTORS[activity_type].get("unit", "unknown")
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ==================== ERP Integrations ====================

@app.get("/integrations", tags=["Integrations"])
async def list_integrations(company_id: str = "demo_company"):
    """
    List available ERP/accounting integrations.
    
    Returns connection status for each provider.
    """
    service = get_integration_service(company_id)
    providers = service.get_available_providers()
    return {
        "company_id": company_id,
        "providers": providers
    }


@app.post("/integrations/connect", tags=["Integrations"])
async def connect_integration(
    request: IntegrationConnectRequest,
    company_id: str = "demo_company"
):
    """
    Connect to an ERP/accounting provider.
    
    In production, this would initiate OAuth2 flow.
    For demo, simulates successful connection.
    """
    try:
        service = get_integration_service(company_id)
        connection = service.connect(request.provider)
        return {
            "status": "connected",
            "connection": connection
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/integrations/disconnect/{provider}", tags=["Integrations"])
async def disconnect_integration(provider: str, company_id: str = "demo_company"):
    """Disconnect from an ERP provider."""
    service = get_integration_service(company_id)
    success = service.disconnect(provider)
    return {"status": "disconnected" if success else "not_connected", "provider": provider}


@app.get("/integrations/{provider}/status", tags=["Integrations"])
async def get_integration_status(provider: str, company_id: str = "demo_company"):
    """Get connection status for a specific provider."""
    service = get_integration_service(company_id)
    return service.get_connection_status(provider)


@app.post("/integrations/sync", tags=["Integrations"])
async def sync_integration_data(
    request: IntegrationSyncRequest,
    company_id: str = "demo_company"
):
    """
    Sync data from connected ERP provider.
    
    Pulls invoices, expenses, and employee data,
    then extracts ESG-relevant information.
    """
    try:
        service = get_integration_service(company_id)
        result = service.sync_data(
            provider=request.provider,
            data_types=request.data_types,
            date_from=request.date_from,
            date_to=request.date_to
        )
        
        # Calculate emissions for synced invoices if present
        if "invoices" in result.get("data", {}):
            invoices = result["data"]["invoices"]
            total_emissions = 0
            for invoice in invoices:
                esg_data = invoice.get("esg_data", {})
                if esg_data and esg_data.get("activity_type"):
                    try:
                        emission_result = calculate_emissions(
                            activity_type=esg_data["activity_type"],
                            quantity=esg_data["quantity"]
                        )
                        invoice["calculated_emissions"] = emission_result
                        total_emissions += emission_result["emissions_kg_co2e"]
                    except:
                        invoice["calculated_emissions"] = None
            
            result["data"]["total_emissions_kg"] = round(total_emissions, 2)
            result["data"]["total_emissions_tonnes"] = round(total_emissions / 1000, 4)
        
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/integrations/{provider}/categories", tags=["Integrations"])
async def get_expense_categories(provider: str, company_id: str = "demo_company"):
    """Get expense categories with ESG mappings for a provider."""
    service = get_integration_service(company_id)
    categories = service.get_expense_categories(provider)
    return {"provider": provider, "categories": categories}


# ==================== ESG Reports ====================

@app.get("/report/{year}", response_model=ESGReport, tags=["Reports"])
async def get_report(year: int):
    """
    Fetch the ESG report for a specific fiscal year.
    
    Returns data aligned with VSME (Voluntary Standard for SMEs) framework:
    - B1: Energy Consumption
    - B2: GHG Emissions (Scope 1 & 2)
    - B3: Water Usage
    - B6: Employee Metrics
    - BP1: Scope 3 Analysis
    """
    if year < 2020 or year > 2030:
        raise HTTPException(status_code=400, detail="Year must be between 2020 and 2030")
    
    db_service = get_db_service()
    report = await db_service.get_report(year)
    return report


@app.get("/reports", response_model=List[int], tags=["Reports"])
async def list_available_reports():
    """List all available report years."""
    db_service = get_db_service()
    years = await db_service.list_reports()
    return years


@app.post("/report/{year}", response_model=ESGReport, tags=["Reports"])
async def create_or_update_report(year: int, report: ESGReport):
    """
    Create or update an ESG report for a specific year.
    
    This endpoint allows manual data entry or updates to existing reports.
    """
    if year != report.reporting_year:
        raise HTTPException(status_code=400, detail="Year in URL must match reporting_year in body")
    
    db_service = get_db_service()
    success = await db_service.save_report(report)
    
    if not success and not is_firebase_configured():
        # Return the report anyway in demo mode
        return report
    
    return report


# ==================== Energy Data ====================

@app.put("/report/{year}/energy", tags=["Energy (B1)"])
async def update_energy_data(year: int, energy_data: List[EnergyConsumption]):
    """
    Update energy consumption data for a report (VSME B1).
    
    Supports both renewable and non-renewable energy sources.
    """
    db_service = get_db_service()
    await db_service.save_energy_data(year, energy_data)
    return {"status": "updated", "count": len(energy_data)}


# ==================== Emissions Data ====================

@app.put("/report/{year}/emissions", tags=["Emissions (B2)"])
async def update_emissions_data(year: int, emissions_data: List[GHGEmissions]):
    """
    Update GHG emissions data for a report (VSME B2).
    
    Supports Scope 1, Scope 2 (location and market-based).
    """
    db_service = get_db_service()
    await db_service.save_emissions_data(year, emissions_data)
    return {"status": "updated", "count": len(emissions_data)}


# ==================== File Upload (Future: AI Processing) ====================

@app.post("/upload/invoice", tags=["Data Ingestion"])
async def upload_invoice(file: UploadFile = File(...)):
    """
    Upload an invoice for AI-powered data extraction.
    
    Supported formats: PDF, PNG, JPG
    
    This endpoint will:
    1. Extract data using OCR (AWS Textract)
    2. Parse values using LLM semantic analysis
    3. Map to appropriate ESG categories
    4. Calculate associated emissions
    
    Note: Full AI processing to be implemented.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    allowed_extensions = {'.pdf', '.png', '.jpg', '.jpeg'}
    file_ext = '.' + file.filename.split('.')[-1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type not supported. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Read file content
    content = await file.read()
    file_size = len(content)
    
    # TODO: Implement actual AI processing with AWS Textract or OpenAI Vision
    # For now, return a placeholder response
    return {
        "status": "received",
        "filename": file.filename,
        "size_bytes": file_size,
        "message": "File received. AI processing will be implemented in future release.",
        "extracted_data": None
    }


# ==================== Export Endpoints ====================

@app.get("/export/{year}/xbrl", tags=["Export"])
async def export_xbrl(year: int):
    """
    Export ESG report in XBRL format for regulatory submission.
    
    Generates VSME-compliant XBRL taxonomy output.
    
    Note: Full XBRL generation to be implemented.
    """
    return {
        "status": "placeholder",
        "year": year,
        "format": "XBRL",
        "message": "XBRL export will be implemented using EFRAG Open Source Converter"
    }


@app.get("/export/{year}/pdf", tags=["Export"])
async def export_pdf(year: int):
    """
    Export ESG report as a formatted PDF document.
    
    Generates a professional report suitable for stakeholders and auditors.
    """
    return {
        "status": "placeholder",
        "year": year,
        "format": "PDF",
        "message": "PDF export to be implemented"
    }


@app.get("/export/{year}/csv", tags=["Export"])
async def export_csv(year: int):
    """
    Export ESG data as CSV for analysis.
    """
    db_service = get_db_service()
    report = await db_service.get_report(year)
    
    return {
        "year": year,
        "format": "CSV",
        "summary": {
            "total_energy_kwh": sum(e.total_kwh for e in report.energy_consumption),
            "total_emissions_tonnes": (
                report.ghg_emissions[0].scope1_total + 
                report.ghg_emissions[0].scope2_location_based 
                if report.ghg_emissions else 0
            ),
            "total_water_m3": sum(w.total_withdrawal for w in report.water_usage),
            "employee_count": report.employee_metrics.total_headcount if report.employee_metrics else 0
        }
    }


# ==================== VSME Compliance ====================

@app.get("/compliance/vsme/{year}", tags=["Compliance"])
async def check_vsme_compliance(year: int):
    """
    Check VSME compliance status for a report year.
    
    Returns completion status for each required disclosure.
    """
    db_service = get_db_service()
    report = await db_service.get_report(year)
    
    # VSME Basic Modules Check
    compliance = {
        "year": year,
        "framework": "VSME",
        "modules": {
            "B1_energy": {
                "name": "Energy Consumption",
                "required": True,
                "complete": len(report.energy_consumption) > 0,
                "data_points": len(report.energy_consumption)
            },
            "B2_emissions": {
                "name": "GHG Emissions",
                "required": True,
                "complete": len(report.ghg_emissions) > 0,
                "data_points": len(report.ghg_emissions)
            },
            "B3_water": {
                "name": "Water Usage",
                "required": True,
                "complete": len(report.water_usage) > 0,
                "data_points": len(report.water_usage)
            },
            "B6_workforce": {
                "name": "Workforce Metrics",
                "required": True,
                "complete": report.employee_metrics is not None,
                "data_points": 1 if report.employee_metrics else 0
            },
            "BP1_scope3": {
                "name": "Scope 3 Emissions (PAT)",
                "required": False,
                "complete": len(report.scope3_analysis) > 0,
                "data_points": len(report.scope3_analysis)
            }
        }
    }
    
    required_modules = [m for m in compliance["modules"].values() if m["required"]]
    complete_modules = [m for m in required_modules if m["complete"]]
    
    compliance["overall_status"] = {
        "required_modules": len(required_modules),
        "complete_modules": len(complete_modules),
        "compliance_percentage": round(len(complete_modules) / len(required_modules) * 100, 1),
        "is_compliant": len(complete_modules) == len(required_modules)
    }
    
    return compliance


# ==================== Application Startup ====================

@app.on_event("startup")
async def startup_event():
    """Initialize services on application startup."""
    print("\n" + "="*60)
    print("🌿 GreenAlgebra API v2.0.0 Starting...")
    print("="*60)
    
    if is_firebase_configured():
        print("✓ Firebase Firestore: Connected")
    else:
        print("⚠ Firebase: Not configured (running in DEMO MODE)")
        print("  → To connect Firebase, add firebase-credentials.json")
    
    print("✓ Emission Calculator: Loaded (DEFRA 2024, EPA, EEIO)")
    print("✓ Integration Service: Ready (Xero, Sage, DATEV)")
    print("="*60 + "\n")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
