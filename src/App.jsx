import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SidebarCenters from './components/SidebarCenters';
import MapViewport from './components/MapViewport';
import SidebarRouting from './components/SidebarRouting';
import CenterDetailsDrawer from './components/CenterDetailsDrawer';
import { VIPASSANA_CENTERS } from './constants/centers';
import { COORDINATES_OVERRIDES, INDIAN_CITIES, NEPAL_CITIES } from './constants/routing';

// Clean coordinates and apply geocoding overrides
const INITIAL_CENTERS = VIPASSANA_CENTERS.map(c => {
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

export default function App() {
  // 1. Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // 2. Data & Loading States
  const [centers, setCenters] = useState(INITIAL_CENTERS);
  const [loading, setLoading] = useState(false);

  // 3. User selections
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [sourceCity, setSourceCity] = useState('');
  const [targetCenter, setTargetCenter] = useState('');

  // Geolocation States
  const [userLocation, setUserLocation] = useState(null);
  const [nearestHubs, setNearestHubs] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Distance helper (Haversine formula in km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleLocationSuccess = (lat, lng) => {
    setUserLocation({ lat, lng });
    setLocationError(null);

    // Nepal geographical bounding box coordinates
    const isUserInNepal = lat >= 26.0 && lat <= 30.8 && lng >= 80.0 && lng <= 88.5;

    const sortedIndia = Object.values(INDIAN_CITIES).map(city => {
      const distance = calculateDistance(lat, lng, city.lat, city.lng);
      return { ...city, distance, isNepal: false };
    }).sort((a, b) => a.distance - b.distance);

    const sortedNepal = Object.values(NEPAL_CITIES).map(city => {
      const distance = calculateDistance(lat, lng, city.lat, city.lng);
      return { ...city, distance, isNepal: true };
    }).sort((a, b) => a.distance - b.distance);

    // Combine all to get the overall sorted nearest hubs for display (top 3)
    const sortedAll = [...sortedIndia, ...sortedNepal].sort((a, b) => a.distance - b.distance);
    setNearestHubs(sortedAll.slice(0, 3));

    // Choose default source city
    if (isUserInNepal && sortedNepal.length > 0) {
      setSourceCity(sortedNepal[0].name);
    } else if (sortedIndia.length > 0) {
      setSourceCity(sortedIndia[0].name);
    } else if (sortedAll.length > 0) {
      setSourceCity(sortedAll[0].name);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        handleLocationSuccess(lat, lng);
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMsg = "Unable to retrieve location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "Location request timed out.";
        }
        setLocationError(errorMsg);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Check if location permission is already granted on mount
  useEffect(() => {
    if (navigator.geolocation && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          if (result.state === 'granted') {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                handleLocationSuccess(position.coords.latitude, position.coords.longitude);
              },
              null,
              { enableHighAccuracy: true, timeout: 5000 }
            );
          }
        })
        .catch((err) => {
          console.log("Permission query error on load:", err);
        });
    }
  }, []);

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

  // Global Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedCenter) {
          setSelectedCenter(null);
        } else if (sourceCity || targetCenter) {
          setSourceCity('');
          setTargetCenter('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCenter, sourceCity, targetCenter]);


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
          userLocation={userLocation}
          nearestHubs={nearestHubs}
          detectLocation={detectLocation}
          isLocating={isLocating}
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
          userLocation={userLocation}
          nearestHubs={nearestHubs}
          isLocating={isLocating}
          locationError={locationError}
          detectLocation={detectLocation}
        />

        {/* Unified Border Toggle Buttons */}
        <button 
          className={`sidebar-border-toggle toggle-left ${isLeftCollapsed ? 'collapsed' : ''}`}
          onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
          title={isLeftCollapsed ? "Expand Centers List" : "Collapse Centers List"}
          aria-label={isLeftCollapsed ? "Expand Centers List" : "Collapse Centers List"}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
            {isLeftCollapsed ? (
              <polyline points="9 18 15 12 9 6"></polyline>
            ) : (
              <polyline points="15 18 9 12 15 6"></polyline>
            )}
          </svg>
        </button>

        <button 
          className={`sidebar-border-toggle toggle-right ${isRightCollapsed ? 'collapsed' : ''}`}
          onClick={() => setIsRightCollapsed(!isRightCollapsed)}
          title={isRightCollapsed ? "Expand Route Planner" : "Collapse Route Planner"}
          aria-label={isRightCollapsed ? "Expand Route Planner" : "Collapse Route Planner"}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
            {isRightCollapsed ? (
              <polyline points="15 18 9 12 15 6"></polyline>
            ) : (
              <polyline points="9 18 15 12 9 6"></polyline>
            )}
          </svg>
        </button>


        {/* Floating Mobile Action Buttons */}
        <div className="mobile-controls">
          {(sourceCity || targetCenter) && (
            <button 
              className="mobile-btn mobile-clear-btn"
              onClick={() => {
                setSourceCity('');
                setTargetCenter('');
                setSelectedCenter(null);
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Clear Route
            </button>
          )}

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
        sourceCity={sourceCity}
        setSourceCity={setSourceCity}
        setTargetCenter={setTargetCenter}
        setIsMobileRoutingOpen={setIsMobileRoutingOpen}
        setIsRightCollapsed={setIsRightCollapsed}
      />
    </div>
  );
}
