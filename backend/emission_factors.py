"""
Emission Factors Database
=========================

Based on DEFRA UK 2024, EPA, and EEIO emission factors.
Provides conversion factors from activities to CO2e emissions.

Sources:
- UK DEFRA Conversion Factors 2024
- EPA Emission Factors Hub
- EXIOBASE EEIO Database for spend-based calculations
"""

from typing import Dict, Optional
from enum import Enum

class EmissionScope(str, Enum):
    SCOPE_1 = "scope_1"  # Direct emissions
    SCOPE_2_LOCATION = "scope_2_location"  # Indirect (location-based)
    SCOPE_2_MARKET = "scope_2_market"  # Indirect (market-based)
    SCOPE_3 = "scope_3"  # Value chain

class ActivityType(str, Enum):
    # Energy
    ELECTRICITY = "electricity"
    NATURAL_GAS = "natural_gas"
    DIESEL = "diesel"
    PETROL = "petrol"
    LPG = "lpg"
    
    # Transport
    CAR_PETROL = "car_petrol"
    CAR_DIESEL = "car_diesel"
    CAR_ELECTRIC = "car_electric"
    FLIGHT_SHORT = "flight_short"  # <500km
    FLIGHT_MEDIUM = "flight_medium"  # 500-3700km
    FLIGHT_LONG = "flight_long"  # >3700km
    RAIL = "rail"
    BUS = "bus"
    
    # Water & Waste
    WATER_SUPPLY = "water_supply"
    WATER_TREATMENT = "water_treatment"
    WASTE_LANDFILL = "waste_landfill"
    WASTE_RECYCLED = "waste_recycled"
    
    # Spend Categories (EEIO-based)
    SPEND_PURCHASED_GOODS = "spend_purchased_goods"
    SPEND_CAPITAL_GOODS = "spend_capital_goods"
    SPEND_SERVICES = "spend_services"
    SPEND_TRANSPORT = "spend_transport"


# ============================================
# EMISSION FACTORS DATABASE
# Units: kgCO2e per unit specified
# ============================================

EMISSION_FACTORS: Dict[str, Dict] = {
    # ============================================
    # ELECTRICITY (kgCO2e per kWh)
    # ============================================
    "electricity": {
        "unit": "kWh",
        "scope": EmissionScope.SCOPE_2_LOCATION,
        "factors": {
            # Location-based (grid average)
            "UK": 0.20707,  # DEFRA 2024
            "DE": 0.364,    # Germany 2024
            "FR": 0.052,    # France (nuclear heavy)
            "IT": 0.316,    # Italy
            "ES": 0.190,    # Spain
            "NL": 0.328,    # Netherlands
            "BE": 0.163,    # Belgium
            "AT": 0.088,    # Austria
            "PL": 0.658,    # Poland (coal heavy)
            "AE": 0.405,    # UAE
            "US": 0.390,    # US average
            "default": 0.300
        },
        # Market-based (renewable certificates)
        "renewable_factor": 0.0,  # Zero for certified renewable
    },
    
    # ============================================
    # NATURAL GAS (kgCO2e per kWh)
    # ============================================
    "natural_gas": {
        "unit": "kWh",
        "scope": EmissionScope.SCOPE_1,
        "factor": 0.18293,  # DEFRA 2024 gross CV
    },
    
    # ============================================
    # FUELS (kgCO2e per litre)
    # ============================================
    "diesel": {
        "unit": "litre",
        "scope": EmissionScope.SCOPE_1,
        "factor": 2.70564,  # DEFRA 2024
    },
    
    "petrol": {
        "unit": "litre",
        "scope": EmissionScope.SCOPE_1,
        "factor": 2.31486,  # DEFRA 2024
    },
    
    "lpg": {
        "unit": "litre",
        "scope": EmissionScope.SCOPE_1,
        "factor": 1.55364,  # DEFRA 2024
    },
    
    # ============================================
    # ROAD TRANSPORT (kgCO2e per km)
    # ============================================
    "car_petrol": {
        "unit": "km",
        "scope": EmissionScope.SCOPE_1,  # If company-owned
        "factor": 0.17048,  # Average car
        "variants": {
            "small": 0.14289,
            "medium": 0.16982,
            "large": 0.22223,
        }
    },
    
    "car_diesel": {
        "unit": "km",
        "scope": EmissionScope.SCOPE_1,
        "factor": 0.16844,
        "variants": {
            "small": 0.13826,
            "medium": 0.16437,
            "large": 0.20914,
        }
    },
    
    "car_electric": {
        "unit": "km",
        "scope": EmissionScope.SCOPE_2_LOCATION,  # Depends on grid
        "factor": 0.04645,  # Average EV UK
    },
    
    # ============================================
    # AIR TRAVEL (kgCO2e per passenger-km)
    # Including radiative forcing uplift
    # ============================================
    "flight_short": {
        "unit": "passenger-km",
        "scope": EmissionScope.SCOPE_3,
        "factor": 0.25493,  # <500km domestic/short haul
    },
    
    "flight_medium": {
        "unit": "passenger-km", 
        "scope": EmissionScope.SCOPE_3,
        "factor": 0.15573,  # 500-3700km
    },
    
    "flight_long": {
        "unit": "passenger-km",
        "scope": EmissionScope.SCOPE_3,
        "factor": 0.19309,  # >3700km long haul
        "variants": {
            "economy": 0.14615,
            "premium_economy": 0.23384,
            "business": 0.42385,
            "first": 0.58462,
        }
    },
    
    "rail": {
        "unit": "passenger-km",
        "scope": EmissionScope.SCOPE_3,
        "factor": 0.03549,  # National rail average
    },
    
    "bus": {
        "unit": "passenger-km",
        "scope": EmissionScope.SCOPE_3,
        "factor": 0.10231,
    },
    
    # ============================================
    # WATER (kgCO2e per cubic metre)
    # ============================================
    "water_supply": {
        "unit": "m3",
        "scope": EmissionScope.SCOPE_3,
        "factor": 0.149,  # DEFRA 2024
    },
    
    "water_treatment": {
        "unit": "m3",
        "scope": EmissionScope.SCOPE_3,
        "factor": 0.272,  # DEFRA 2024
    },
    
    # ============================================
    # WASTE (kgCO2e per tonne)
    # ============================================
    "waste_landfill": {
        "unit": "tonne",
        "scope": EmissionScope.SCOPE_3,
        "factor": 446.242,  # Mixed waste to landfill
    },
    
    "waste_recycled": {
        "unit": "tonne",
        "scope": EmissionScope.SCOPE_3,
        "factor": 21.317,  # Mixed recycling
    },
    
    # ============================================
    # SPEND-BASED FACTORS (kgCO2e per USD/EUR)
    # Based on EEIO models - Scope 3 Categories
    # ============================================
    "spend_purchased_goods": {
        "unit": "USD",
        "scope": EmissionScope.SCOPE_3,
        "category": "Category 1: Purchased Goods & Services",
        "factors": {
            # Industry-specific factors (kgCO2e per USD spent)
            "manufacturing": 0.42,
            "electronics": 0.35,
            "chemicals": 0.68,
            "textiles": 0.45,
            "food_products": 0.55,
            "paper_products": 0.38,
            "metals": 0.72,
            "plastics": 0.58,
            "office_supplies": 0.28,
            "software_services": 0.08,
            "professional_services": 0.12,
            "default": 0.35,
        }
    },
    
    "spend_capital_goods": {
        "unit": "USD",
        "scope": EmissionScope.SCOPE_3,
        "category": "Category 2: Capital Goods",
        "factors": {
            "machinery": 0.55,
            "vehicles": 0.48,
            "buildings": 0.65,
            "it_equipment": 0.32,
            "furniture": 0.38,
            "default": 0.45,
        }
    },
    
    "spend_services": {
        "unit": "USD",
        "scope": EmissionScope.SCOPE_3,
        "category": "Category 1: Purchased Services",
        "factors": {
            "legal_accounting": 0.10,
            "consulting": 0.12,
            "marketing": 0.15,
            "it_services": 0.08,
            "cleaning": 0.18,
            "security": 0.14,
            "default": 0.12,
        }
    },
    
    "spend_transport": {
        "unit": "USD",
        "scope": EmissionScope.SCOPE_3,
        "category": "Category 4/9: Transport & Distribution",
        "factors": {
            "air_freight": 0.85,
            "road_freight": 0.45,
            "sea_freight": 0.12,
            "rail_freight": 0.08,
            "courier": 0.35,
            "default": 0.35,
        }
    },
}


def get_emission_factor(
    activity_type: str,
    country: str = "default",
    variant: str = None,
    sub_category: str = None
) -> float:
    """
    Get the emission factor for a given activity type.
    
    Args:
        activity_type: Type of activity (e.g., 'electricity', 'diesel', 'flight_short')
        country: ISO country code for location-based factors
        variant: Sub-variant (e.g., 'small', 'business' class)
        sub_category: For spend-based, the industry sub-category
        
    Returns:
        Emission factor in kgCO2e per unit
    """
    if activity_type not in EMISSION_FACTORS:
        raise ValueError(f"Unknown activity type: {activity_type}")
    
    factor_data = EMISSION_FACTORS[activity_type]
    
    # Check for country-specific factors (electricity)
    if "factors" in factor_data and isinstance(factor_data["factors"], dict):
        if country in factor_data["factors"]:
            return factor_data["factors"][country]
        elif "default" in factor_data["factors"]:
            return factor_data["factors"]["default"]
        elif sub_category and sub_category in factor_data["factors"]:
            return factor_data["factors"][sub_category]
        elif "default" in factor_data.get("factors", {}):
            return factor_data["factors"]["default"]
    
    # Check for variants (car size, flight class)
    if variant and "variants" in factor_data:
        if variant in factor_data["variants"]:
            return factor_data["variants"][variant]
    
    # Return base factor
    if "factor" in factor_data:
        return factor_data["factor"]
    
    raise ValueError(f"Could not find emission factor for {activity_type}")


def calculate_emissions(
    activity_type: str,
    quantity: float,
    country: str = "default",
    variant: str = None,
    sub_category: str = None
) -> Dict:
    """
    Calculate CO2e emissions for a given activity.
    
    Args:
        activity_type: Type of activity
        quantity: Amount of activity (in native units)
        country: ISO country code
        variant: Sub-variant if applicable
        sub_category: Industry category for spend-based
        
    Returns:
        Dict with emissions in kgCO2e and tonnes, plus metadata
    """
    factor = get_emission_factor(activity_type, country, variant, sub_category)
    factor_data = EMISSION_FACTORS[activity_type]
    
    emissions_kg = quantity * factor
    emissions_tonnes = emissions_kg / 1000
    
    return {
        "activity_type": activity_type,
        "quantity": quantity,
        "unit": factor_data.get("unit", "unknown"),
        "emission_factor": factor,
        "emission_factor_unit": f"kgCO2e/{factor_data.get('unit', 'unit')}",
        "scope": factor_data.get("scope", EmissionScope.SCOPE_3).value,
        "emissions_kg_co2e": round(emissions_kg, 2),
        "emissions_tonnes_co2e": round(emissions_tonnes, 4),
        "country": country,
        "variant": variant,
        "sub_category": sub_category,
    }


# ============================================
# COMMON CALCULATION HELPERS
# ============================================

def calculate_electricity_emissions(
    kwh: float,
    country: str = "default",
    renewable_percentage: float = 0
) -> Dict:
    """Calculate emissions from electricity consumption."""
    # Non-renewable portion uses grid factor
    non_renewable_kwh = kwh * (1 - renewable_percentage / 100)
    
    result = calculate_emissions("electricity", non_renewable_kwh, country)
    result["total_kwh"] = kwh
    result["renewable_percentage"] = renewable_percentage
    result["renewable_kwh"] = kwh - non_renewable_kwh
    
    return result


def calculate_travel_emissions(
    distance_km: float,
    travel_type: str,
    travel_class: str = None
) -> Dict:
    """Calculate emissions from business travel."""
    type_mapping = {
        "car_petrol": "car_petrol",
        "car_diesel": "car_diesel",
        "car_electric": "car_electric",
        "flight_domestic": "flight_short",
        "flight_short_haul": "flight_medium",
        "flight_long_haul": "flight_long",
        "train": "rail",
        "bus": "bus",
    }
    
    activity = type_mapping.get(travel_type, travel_type)
    return calculate_emissions(activity, distance_km, variant=travel_class)


def calculate_spend_based_emissions(
    spend_amount: float,
    category: str,
    sub_category: str = "default",
    currency: str = "USD"
) -> Dict:
    """Calculate Scope 3 emissions using spend-based method."""
    # Simple currency conversion (in production, use real rates)
    currency_to_usd = {
        "USD": 1.0,
        "EUR": 1.08,
        "GBP": 1.27,
        "AED": 0.27,
    }
    
    usd_amount = spend_amount * currency_to_usd.get(currency, 1.0)
    
    category_mapping = {
        "purchased_goods": "spend_purchased_goods",
        "capital_goods": "spend_capital_goods",
        "services": "spend_services",
        "transport": "spend_transport",
    }
    
    activity = category_mapping.get(category, "spend_purchased_goods")
    result = calculate_emissions(activity, usd_amount, sub_category=sub_category)
    result["original_amount"] = spend_amount
    result["original_currency"] = currency
    result["usd_amount"] = round(usd_amount, 2)
    
    return result

