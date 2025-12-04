import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { Dashboard } from './pages/Dashboard';
import { Energy } from './pages/Energy';
import { Emissions } from './pages/Emissions';
import { Water } from './pages/Water';
import { Workforce } from './pages/Workforce';
import { Scope3 } from './pages/Scope3';
import { Integrations } from './pages/Integrations';
import { DataUpload } from './pages/DataUpload';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import './styles/main.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/energy" element={<Energy />} />
            <Route path="/emissions" element={<Emissions />} />
            <Route path="/water" element={<Water />} />
            <Route path="/workforce" element={<Workforce />} />
            <Route path="/scope3" element={<Scope3 />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/upload" element={<DataUpload />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
