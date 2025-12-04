# GreenAlgebra: Automated ESG CFO Reporting for SMEs

<p align="center">
  <strong>Balancing Profit & Planet</strong><br>
  Enterprise-grade ESG reporting platform designed for SME CFOs
</p>

## Overview

GreenAlgebra is an automated ESG (Environmental, Social, and Governance) reporting platform designed specifically for SME CFOs. It automates the extraction of sustainability data from financial and operational systems to ensure audit-readiness and regulatory compliance with CSRD, VSME, and ESRS frameworks.

## Features

### VSME Compliance
- **B1 - Energy Consumption:** Auto-calculation from utility invoices (Renewable vs Non-renewable)
- **B2 - GHG Emissions:** Hybrid calculation (Spend-based & Activity-based) for Scope 1 & 2
- **B3 - Water Usage:** AI extraction from utility bills
- **B6 - Employee Metrics:** Headcount & gender breakdown
- **BP1 - Scope 3:** Spend-based analysis of value chain emissions

### Technical Stack
| Component | Technology | Purpose |
|-----------|------------|---------|
| Backend | Python (FastAPI) | High-performance REST API |
| Frontend | React + TypeScript (Vite) | Enterprise dashboard |
| Database | Firebase Firestore | NoSQL cloud database |
| AI/OCR | AWS Textract ready | Invoice data extraction |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Firebase project (optional - runs in demo mode without it)

### 1. Clone & Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd GreenAlgrebra
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn pandas pydantic python-multipart firebase-admin

# Run the server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API:** http://localhost:8000
- **Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The dashboard will be available at: **http://localhost:5173**

---

## Firebase Setup (Optional)

By default, the application runs in **demo mode** with mock data. To persist data to Firebase:

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select an existing one
3. Enable **Firestore Database** in production mode

### Step 2: Generate Service Account Key
1. Go to **Project Settings** → **Service Accounts**
2. Click **"Generate New Private Key"**
3. Save the JSON file as `firebase-credentials.json` in the `backend/` directory

### Step 3: Verify Connection
Restart the backend server. You should see:
```
✓ Firebase Firestore: Connected
```

> ⚠️ **Security:** Never commit `firebase-credentials.json` to version control. Add it to `.gitignore`.

### Alternative: Environment Variable
Instead of a file, set the `FIREBASE_CREDENTIALS` environment variable with the JSON content:

```bash
export FIREBASE_CREDENTIALS='{"type": "service_account", ...}'
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API status & info |
| `/health` | GET | Health check |
| `/report/{year}` | GET | Fetch ESG report for year |
| `/reports` | GET | List available report years |
| `/report/{year}` | POST | Create/update report |
| `/report/{year}/energy` | PUT | Update energy data |
| `/report/{year}/emissions` | PUT | Update emissions data |
| `/upload/invoice` | POST | Upload invoice for AI processing |
| `/export/{year}/xbrl` | GET | Export XBRL (placeholder) |
| `/export/{year}/pdf` | GET | Export PDF (placeholder) |

---

## Project Structure

```
GreenAlgrebra/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic data models (VSME aligned)
│   ├── database.py          # Firestore CRUD operations
│   ├── firebase_config.py   # Firebase initialization
│   └── venv/                # Python virtual environment
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Main dashboard component
│   │   └── App.css          # Green Algebra branded styles
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 🚀 Deployment (Make It Public)

Want to share your app with others? Deploy it for **FREE** in 5 minutes!

### Quick Deploy Guide

See **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** for step-by-step instructions.

**Recommended Stack:**
- **Frontend:** Vercel (free, unlimited projects)
- **Backend:** Railway (free $5 credit/month)
- **Total Cost:** $0/month

### What You Get:
- ✅ Public URL (e.g., `https://greenalgebra.vercel.app`)
- ✅ Auto-deploy on every git push
- ✅ HTTPS/SSL certificates included
- ✅ Custom domain support
- ✅ Production-ready hosting

For detailed deployment options, see **[DEPLOYMENT.md](DEPLOYMENT.md)**.

---

## Roadmap

- [ ] AI-powered invoice processing (AWS Textract + LLM)
- [ ] ERP integrations (Xero, Sage, DATEV)
- [ ] XBRL export using EFRAG taxonomy
- [ ] PDF report generation
- [ ] Multi-tenant authentication
- [ ] Historical trend analysis

---

## License

© 2025 Green Algebra • Dubai, UAE

---

<p align="center">
  <a href="https://greenalgebra.com">greenalgebra.com</a>
</p>
