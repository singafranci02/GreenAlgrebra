import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Shield, 
  BarChart3,
  Upload,
  FileText,
  Globe,
  Users,
  Building2,
  Star,
  ChevronRight,
  Play,
} from 'lucide-react';

export function HomePage() {
  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="home-nav-inner">
          <Link to="/" className="home-logo">
            <svg viewBox="0 0 40 40" fill="none" className="home-logo-icon">
              <path d="M20 4L36 36H4L20 4Z" fill="currentColor" />
            </svg>
            <div className="home-logo-text">
              <span className="home-logo-name">GreenAlgebra</span>
              <span className="home-logo-tagline">Balancing Profit & Planet</span>
            </div>
          </Link>
          
          <div className="home-nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Testimonials</a>
            <a href="https://greenalgebra.com/about" target="_blank" rel="noopener">About</a>
          </div>
          
          <div className="home-nav-actions">
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
            <Link to="/login" className="btn btn-primary">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            VSME & CSRD Compliant
          </div>
          
          <h1 className="hero-title">
            The <span className="text-gradient">Green CFO</span> Platform
            <br />for European SMEs
          </h1>
          
          <p className="hero-subtitle">
            Automate ESG data collection from your ERP, generate audit-ready reports, 
            and comply with EU sustainability regulations — all in one platform designed for CFOs.
          </p>
          
          <div className="hero-cta">
            <Link to="/login" className="btn btn-primary btn-lg">
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <button className="btn btn-outline btn-lg">
              <Play size={18} /> Watch Demo
            </button>
          </div>
          
          <div className="hero-trust">
            <span>Trusted by finance teams at</span>
            <div className="trust-logos">
              <span className="trust-logo">TechCorp</span>
              <span className="trust-logo">EuroMfg</span>
              <span className="trust-logo">GreenLogistics</span>
              <span className="trust-logo">CloudServices</span>
            </div>
          </div>
        </div>
        
        <div className="hero-image">
          <div className="hero-dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="preview-title">ESG Dashboard</span>
            </div>
            <div className="preview-content">
              <div className="preview-sidebar"></div>
              <div className="preview-main">
                <div className="preview-cards">
                  <div className="preview-card"></div>
                  <div className="preview-card"></div>
                  <div className="preview-card"></div>
                </div>
                <div className="preview-chart"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">80%</span>
            <span className="stat-label">Reduction in reporting time</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">European SMEs onboarded</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">VSME compliance rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">€2M+</span>
            <span className="stat-label">Saved in consulting fees</span>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <div className="section-container">
          <div className="problem-content">
            <span className="section-label">The Challenge</span>
            <h2>ESG Reporting Shouldn't Be a Full-Time Job</h2>
            <p>
              SME CFOs face an impossible task: collect sustainability data from spreadsheets, 
              invoices, and ERPs, then map it to complex regulatory frameworks — all while 
              running day-to-day finance operations.
            </p>
            
            <div className="problem-list">
              <div className="problem-item">
                <div className="problem-icon red">✗</div>
                <div>
                  <h4>Manual Data Collection</h4>
                  <p>Hours spent gathering utility bills, travel expenses, and procurement data</p>
                </div>
              </div>
              <div className="problem-item">
                <div className="problem-icon red">✗</div>
                <div>
                  <h4>Framework Confusion</h4>
                  <p>CSRD, VSME, ESRS, GRI, ISSB — which applies to you?</p>
                </div>
              </div>
              <div className="problem-item">
                <div className="problem-icon red">✗</div>
                <div>
                  <h4>Audit Anxiety</h4>
                  <p>No clear trail from source document to reported metric</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="solution-content">
            <span className="section-label green">The Solution</span>
            <h2>GreenAlgebra Does the Heavy Lifting</h2>
            <p>
              We connect to your existing systems, automatically extract ESG data, 
              and generate compliant reports — so you can focus on strategy, not spreadsheets.
            </p>
            
            <div className="solution-list">
              <div className="solution-item">
                <div className="solution-icon green"><CheckCircle size={20} /></div>
                <div>
                  <h4>Automated Data Extraction</h4>
                  <p>AI reads your invoices and pulls data directly from Xero, Sage, DATEV</p>
                </div>
              </div>
              <div className="solution-item">
                <div className="solution-icon green"><CheckCircle size={20} /></div>
                <div>
                  <h4>One-Click Compliance</h4>
                  <p>Pre-built templates for VSME, ESRS, and ISSB frameworks</p>
                </div>
              </div>
              <div className="solution-item">
                <div className="solution-icon green"><CheckCircle size={20} /></div>
                <div>
                  <h4>Audit-Ready Output</h4>
                  <p>Full data lineage and ISAE 3000 compliant documentation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <span className="section-label">Features</span>
          <h2>Everything a Green CFO Needs</h2>
          <p>From data collection to regulatory submission, we've got you covered</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Upload size={28} />
            </div>
            <h3>AI Invoice Processing</h3>
            <p>Upload utility bills, fuel receipts, and expense reports. Our AI extracts the data and maps it to ESG categories automatically.</p>
            <a href="#" className="feature-link">Learn more <ChevronRight size={16} /></a>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={28} />
            </div>
            <h3>Real-Time Dashboard</h3>
            <p>Track Scope 1, 2, and 3 emissions, energy consumption, water usage, and social metrics — all in one unified view.</p>
            <a href="#" className="feature-link">Learn more <ChevronRight size={16} /></a>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Globe size={28} />
            </div>
            <h3>Multi-Framework Support</h3>
            <p>Enter data once, report to VSME, ESRS, GRI, or ISSB. Our canonical model handles the mapping.</p>
            <a href="#" className="feature-link">Learn more <ChevronRight size={16} /></a>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FileText size={28} />
            </div>
            <h3>XBRL Export</h3>
            <p>Generate machine-readable XBRL files using the official EFRAG taxonomy for seamless regulatory submission.</p>
            <a href="#" className="feature-link">Learn more <ChevronRight size={16} /></a>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={28} />
            </div>
            <h3>Audit Trail</h3>
            <p>Every data point links back to its source document. Prepare for limited assurance with confidence.</p>
            <a href="#" className="feature-link">Learn more <ChevronRight size={16} /></a>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={28} />
            </div>
            <h3>ERP Integrations</h3>
            <p>Direct connections to Xero, Sage, NetSuite, and DATEV. No more manual exports.</p>
            <a href="#" className="feature-link">Learn more <ChevronRight size={16} /></a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-header">
          <span className="section-label">Pricing</span>
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your organization's needs</p>
        </div>
        
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Starter</h3>
              <p>For SMEs beginning their ESG journey</p>
              <div className="pricing-price">
                <span className="price">€299</span>
                <span className="period">/month</span>
              </div>
            </div>
            <ul className="pricing-features">
              <li><CheckCircle size={16} /> VSME Basic Module</li>
              <li><CheckCircle size={16} /> Up to 5 users</li>
              <li><CheckCircle size={16} /> AI invoice processing (100/mo)</li>
              <li><CheckCircle size={16} /> Standard support</li>
              <li><CheckCircle size={16} /> PDF export</li>
            </ul>
            <Link to="/login" className="btn btn-outline btn-full">Get Started</Link>
          </div>
          
          <div className="pricing-card featured">
            <div className="pricing-badge">Most Popular</div>
            <div className="pricing-header">
              <h3>Professional</h3>
              <p>For growing companies with complex needs</p>
              <div className="pricing-price">
                <span className="price">€599</span>
                <span className="period">/month</span>
              </div>
            </div>
            <ul className="pricing-features">
              <li><CheckCircle size={16} /> Full VSME Standard</li>
              <li><CheckCircle size={16} /> Up to 15 users</li>
              <li><CheckCircle size={16} /> AI invoice processing (500/mo)</li>
              <li><CheckCircle size={16} /> Priority support</li>
              <li><CheckCircle size={16} /> XBRL export</li>
              <li><CheckCircle size={16} /> ERP integrations (2)</li>
              <li><CheckCircle size={16} /> Audit trail</li>
            </ul>
            <Link to="/login" className="btn btn-primary btn-full">Start Free Trial</Link>
          </div>
          
          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Enterprise</h3>
              <p>For organizations requiring full ESRS</p>
              <div className="pricing-price">
                <span className="price">Custom</span>
              </div>
            </div>
            <ul className="pricing-features">
              <li><CheckCircle size={16} /> Full ESRS / ISSB</li>
              <li><CheckCircle size={16} /> Unlimited users</li>
              <li><CheckCircle size={16} /> Unlimited AI processing</li>
              <li><CheckCircle size={16} /> Dedicated support</li>
              <li><CheckCircle size={16} /> All export formats</li>
              <li><CheckCircle size={16} /> Unlimited integrations</li>
              <li><CheckCircle size={16} /> SSO & advanced security</li>
              <li><CheckCircle size={16} /> Custom training</li>
            </ul>
            <a href="https://greenalgebra.com/contact" className="btn btn-outline btn-full">Contact Sales</a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-header">
          <span className="section-label">Testimonials</span>
          <h2>Trusted by Finance Leaders</h2>
          <p>See what CFOs are saying about GreenAlgebra</p>
        </div>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <blockquote>
              "GreenAlgebra cut our ESG reporting time from 3 weeks to 3 days. 
              The AI invoice processing is a game-changer — it accurately extracts 
              energy data from our utility bills with minimal manual intervention."
            </blockquote>
            <div className="testimonial-author">
              <div className="author-avatar">
                <Users size={20} />
              </div>
              <div>
                <strong>Maria Schmidt</strong>
                <span>CFO, TechStart GmbH</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <blockquote>
              "As a mid-sized manufacturer, we were drowning in supply chain data requests. 
              GreenAlgebra's VSME templates helped us respond to customers quickly and 
              maintain our contracts with major automotive OEMs."
            </blockquote>
            <div className="testimonial-author">
              <div className="author-avatar">
                <Building2 size={20} />
              </div>
              <div>
                <strong>Pierre Dubois</strong>
                <span>Finance Director, EuroComponents SA</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <blockquote>
              "The audit trail feature gave our external auditors exactly what they needed. 
              We achieved limited assurance on our first try — something I didn't think 
              was possible for a company our size."
            </blockquote>
            <div className="testimonial-author">
              <div className="author-avatar">
                <Shield size={20} />
              </div>
              <div>
                <strong>Anna Lindqvist</strong>
                <span>Head of Finance, Nordic Logistics AB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Simplify Your ESG Reporting?</h2>
          <p>Join 50+ European SMEs already using GreenAlgebra to automate sustainability compliance.</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-white btn-lg">
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <a href="https://greenalgebra.com/contact" className="btn btn-ghost-white btn-lg">
              Schedule Demo
            </a>
          </div>
          <p className="cta-note">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <svg viewBox="0 0 40 40" fill="none">
                <path d="M20 4L36 36H4L20 4Z" fill="currentColor" />
              </svg>
              <span>GreenAlgebra</span>
            </Link>
            <p>Balancing Profit & Planet</p>
            <p className="footer-address">
              Convention Tower, 4th Floor<br />
              DWTC, Dubai, UAE
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Integrations</a>
              <a href="#">Changelog</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="https://greenalgebra.com/about">About</a>
              <a href="https://greenalgebra.com/contact">Contact</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">Blog</a>
              <a href="#">VSME Guide</a>
              <a href="#">CSRD Toolkit</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
              <a href="#">GDPR</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Green Algebra. All rights reserved.</p>
          <div className="footer-social">
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="GitHub">GH</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

