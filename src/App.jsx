import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SidebarCenters from './components/SidebarCenters';
import MapViewport from './components/MapViewport';
import SidebarRouting from './components/SidebarRouting';
import CenterDetailsDrawer from './components/CenterDetailsDrawer';
import { parseCSV } from './utils/csv';
import { COORDINATES_OVERRIDES } from './utils/routing';

export default function App() {
  // 1. Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // 2. Data & Loading States
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. User selections
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [sourceCity, setSourceCity] = useState('');
  const [targetCenter, setTargetCenter] = useState('');

  // 4. Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [pagodaFilter, setPagodaFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // 5. Mobile drawers state
  const [isMobileCentersOpen, setIsMobileCentersOpen] = useState(false);
  const [isMobileRoutingOpen, setIsMobileRoutingOpen] = useState(false);

  // 6. Desktop sidebars collapsed state
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);


  // Sync theme to HTML attribute and watch system changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = theme;
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // Fetch and parse CSV centers on mount
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/vipassana_centers_final.csv');
        if (!response.ok) throw new Error("Failed to load CSV file.");
        
        const csvText = await response.text();
        const parsed = parseCSV(csvText);
        
        // Clean coordinates and apply geocoding overrides
        const formatted = parsed.map(c => {
          const name = c.center_name;
          let lat = parseFloat(c.latitude);
          let lng = parseFloat(c.longitude);

          if (COORDINATES_OVERRIDES[name]) {
            lat = COORDINATES_OVERRIDES[name].lat;
            lng = COORDINATES_OVERRIDES[name].lng;
          }

          return {
            ...c,
            latitude: lat || 27.7,
            longitude: lng || 85.3
          };
        });

        setCenters(formatted);
      } catch (err) {
        console.error("Error reading CSV:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleThemeToggle = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Filter centers list dynamically
  const filteredCenters = centers.filter(center => {
    // 1. Text search
    const query = searchQuery.toLowerCase().trim();
    const matchesText = !query || 
                        center.center_name.toLowerCase().includes(query) ||
                        center.center_dhamma_name.toLowerCase().includes(query) ||
                        center.address.toLowerCase().includes(query) ||
                        center.extracted_city.toLowerCase().includes(query);

    // 2. Pagoda filter
    const hasPagoda = center.pagoda && center.pagoda.toLowerCase().includes('yes');
    const matchesPagoda = pagodaFilter === 'all' || 
                         (pagodaFilter === 'yes' && hasPagoda) ||
                         (pagodaFilter === 'no' && !hasPagoda);

    // 3. Status filter
    const isUnderConstruction = center.remarks && center.remarks.toLowerCase().includes('under construction');
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && !isUnderConstruction) ||
                         (statusFilter === 'construction' && isUnderConstruction);

    return matchesText && matchesPagoda && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header theme={theme} onThemeToggle={handleThemeToggle} />
      
      <main className={`app-layout ${isLeftCollapsed ? 'left-collapsed' : ''} ${isRightCollapsed ? 'right-collapsed' : ''}`}>
        {/* Left Sidebar: Centers Directory */}
        <SidebarCenters 
          centers={filteredCenters}
          selectedCenter={selectedCenter}
          onSelectCenter={setSelectedCenter}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pagodaFilter={pagodaFilter}
          setPagodaFilter={setPagodaFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          isOpen={isMobileCentersOpen}
          onClose={() => setIsMobileCentersOpen(false)}
          isCollapsed={isLeftCollapsed}
          onToggleCollapse={() => setIsLeftCollapsed(!isLeftCollapsed)}
        />
        
        {/* Center Panel: Map */}
        <MapViewport 
          centers={filteredCenters}
          allCenters={centers}
          selectedCenter={selectedCenter}
          onSelectCenter={setSelectedCenter}
          sourceCity={sourceCity}
          setSourceCity={setSourceCity}
          targetCenter={targetCenter}
          theme={theme}
          isLeftCollapsed={isLeftCollapsed}
          isRightCollapsed={isRightCollapsed}
        />
        
        {/* Right Sidebar: Route Planner & Guides */}
        <SidebarRouting 
          centers={centers}
          selectedCenter={selectedCenter}
          sourceCity={sourceCity}
          setSourceCity={setSourceCity}
          targetCenter={targetCenter}
          setTargetCenter={setTargetCenter}
          onSelectCenter={setSelectedCenter}
          isOpen={isMobileRoutingOpen}
          onClose={() => setIsMobileRoutingOpen(false)}
          isCollapsed={isRightCollapsed}
          onToggleCollapse={() => setIsRightCollapsed(!isRightCollapsed)}
        />

        {/* Floating Expand Buttons (visible on desktop when sidebars are collapsed) */}
        {isLeftCollapsed && (
          <button 
            className="floating-expand-btn expand-left"
            onClick={() => setIsLeftCollapsed(false)}
            title="Expand Centers List"
            aria-label="Expand Centers List"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}

        {isRightCollapsed && (
          <button 
            className="floating-expand-btn expand-right"
            onClick={() => setIsRightCollapsed(false)}
            title="Expand Route Planner"
            aria-label="Expand Route Planner"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}


        {/* Floating Mobile Action Buttons */}
        <div className="mobile-controls">
          <button 
            className="mobile-btn"
            onClick={() => {
              setIsMobileCentersOpen(prev => !prev);
              setIsMobileRoutingOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            Centers List
          </button>
          
          <button 
            className="mobile-btn"
            onClick={() => {
              setIsMobileRoutingOpen(prev => !prev);
              setIsMobileCentersOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Route Planner
          </button>
        </div>
      </main>

      {/* Details Slide-out Drawer Overlay */}
      <CenterDetailsDrawer 
        center={selectedCenter} 
        onClose={() => setSelectedCenter(null)} 
      />
    </div>
  );
}
