import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { CITIES, BORDERS } from '../constants/routing';
import { calculateFullRoute } from '../utils/routing';

// Helper to build custom HTML markers
function createMarkerIcon(type, size = 30) {
  let innerHTML = '';
  let className = 'map-marker-div';
  
  if (type === 'center') {
    className += ' marker-center';
    innerHTML = `
      <div class="marker-center-inner">
        <svg class="marker-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="5" r="2.5"/>
          <path d="M9 10c0-1.5 1.5-2 3-2s3 .5 3 2v4c0 1.5-1.5 2-3 2s-3-.5-3-2v-4z"/>
          <path d="M5 19c0-2.5 3-3.5 7-3.5s7 1 7 3.5"/>
          <path d="M3 21h18"/>
        </svg>
      </div>
    `;
  } else if (type === 'border') {
    className += ' marker-border';
    innerHTML = `
      <div class="marker-border-inner"></div>
    `;
  } else if (type === 'airport') {
    className += ' marker-airport';
    innerHTML = `
      <div class="marker-airport-inner">
        <svg class="marker-icon-svg" viewBox="0 0 24 24" fill="currentColor" style="color: #0275d8;">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5l-2-1.5v-5.5l8 2.5z"/>
        </svg>
      </div>
    `;
  } else if (type === 'city') {
    className += ' marker-city';
    innerHTML = `
      <div class="marker-city-inner">
        <svg class="marker-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21h18"/>
          <path d="M5 21V7l5-4v14"/>
          <path d="M19 21V11l-5-3v13"/>
          <path d="M7 11h1"/>
          <path d="M7 15h1"/>
          <path d="M16 12h1"/>
          <path d="M16 16h1"/>
        </svg>
      </div>
    `;
  }
  
  return L.divIcon({
    html: innerHTML,
    className: className,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

// Calculate the midpoint of a coordinates path array
function getPolylineMidpoint(path) {
  if (!path || path.length === 0) return null;
  if (path.length === 2) {
    return [
      (path[0][0] + path[1][0]) / 2,
      (path[0][1] + path[1][1]) / 2
    ];
  }
  return path[Math.floor(path.length / 2)];
}

// Build a small circular div icon with standard SVG transit symbols
function createTransitBadgeIcon(mode) {
  let bgColor = '#d9534f';
  let svgIcon = '';
  
  if (mode === 'rail') {
    bgColor = '#222222'; // Dark grey for rail
    svgIcon = `
      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
        <path d="M2 17h20v1.5H2zm2-9h16a1.5 1.5 0 0 1 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5H4A1.5 1.5 0 0 1 2.5 11.5v-2A1.5 1.5 0 0 1 4 8zm1 1.5h2v2H5zm4 0h2v2H9zm4 0h2v2h-2z"/>
        <circle cx="6" cy="15.5" r="1.5"/>
        <circle cx="18" cy="15.5" r="1.5"/>
      </svg>
    `;
  } else if (mode === 'air') {
    bgColor = '#0275d8'; // Blue for plane
    svgIcon = `
      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="transform: rotate(45deg);">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5l-2-1.5v-5.5l8 2.5z"/>
      </svg>
    `;
  } else {
    // Road / Bus (Red)
    bgColor = '#d9534f';
    svgIcon = `
      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
        <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM6 6h12v4H6V6z"/>
      </svg>
    `;
  }
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${bgColor};
        border: 2px solid white;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        color: white;
      ">
        ${svgIcon}
      </div>
    `,
    className: 'route-badge-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
}

export default function MapViewport({
  centers,
  allCenters,
  selectedCenter,
  onSelectCenter,
  sourceCity,
  setSourceCity,
  targetCenter,
  theme,
  isLeftCollapsed,
  isRightCollapsed
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  
  // Keep tracks of markers/lines layers to clean up and modify them directly
  const centerMarkersRef = useRef([]);
  const staticMarkersRef = useRef({ cities: [], borders: [] });
  const activePolylinesRef = useRef([]);
  const isInitialRenderRef = useRef(true);

  // Legend Collapse State
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(true);

  // Visibility States for Map Layers
  const [showCenters, setShowCenters] = useState(true);
  const [showBorders, setShowBorders] = useState(true);
  const [showIndianHubs, setShowIndianHubs] = useState(true);

  // Invalidate Map layout size after sidebar transition completes
  useEffect(() => {
    if (mapRef.current) {
      const timer = setTimeout(() => {
        mapRef.current.invalidateSize({ animate: true });
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [isLeftCollapsed, isRightCollapsed]);

  // 1. Initialize Map Container (runs once)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const leafletMap = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true
    }).setView([27.5, 84.2], 7);

    mapRef.current = leafletMap;

    // Plot Static Cities
    const cityMarkers = [];
    Object.values(CITIES).forEach(city => {
      const marker = L.marker([city.lat, city.lng], {
        icon: createMarkerIcon('city', 28)
      }).addTo(leafletMap);
      
      marker.bindPopup(`<h4>${city.label}</h4><p class="popup-details">Indian Departure & Transit Hub</p>`);
      marker.on('click', () => {
        setSourceCity(city.name);
      });
      cityMarkers.push({ name: city.name, marker });
    });
    staticMarkersRef.current.cities = cityMarkers;

    // Plot Static Borders
    const borderMarkers = [];
    Object.values(BORDERS).forEach(border => {
      const isAirport = border.name.includes("Airport");
      const marker = L.marker([border.lat, border.lng], {
        icon: createMarkerIcon(isAirport ? 'airport' : 'border', 28)
      }).addTo(leafletMap);
      
      marker.bindPopup(`<h4>${border.name}</h4><p class="popup-details">${border.desc}</p>`);
      borderMarkers.push({ name: border.name, marker });
    });
    staticMarkersRef.current.borders = borderMarkers;

    return () => {
      leafletMap.remove();
      mapRef.current = null;
    };
  }, [setSourceCity]);

  // 2. Sync Map theme on prop changes
  useEffect(() => {
    if (!mapRef.current) return;

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl = theme === 'dark' 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19
    }).addTo(mapRef.current);
  }, [theme]);

  // 3. Sync Dynamic Centers (plot whenever filters, route selection, or visibility changes)
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear previous center markers
    centerMarkersRef.current.forEach(m => mapRef.current.removeLayer(m.marker));
    centerMarkersRef.current = [];

    const isRouteActive = !!(sourceCity && targetCenter);
    const targetCenterObj = isRouteActive
      ? (allCenters || centers).find(c => c.center_name === targetCenter)
      : null;

    // Determine which centers to show
    let centersToShow = [];
    if (isRouteActive && targetCenterObj) {
      const activeCenters = new Set();
      if (targetCenterObj) activeCenters.add(targetCenterObj);
      
      // If there is a selected center, always show it so the user can inspect it
      if (selectedCenter) {
        const selCenterObj = (allCenters || centers).find(c => c.center_name === selectedCenter.center_name);
        if (selCenterObj) activeCenters.add(selCenterObj);
      }
      centersToShow = Array.from(activeCenters);
    } else {
      if (showCenters) {
        centersToShow = centers;
      } else if (selectedCenter) {
        const selCenterObj = (allCenters || centers).find(c => c.center_name === selectedCenter.center_name);
        centersToShow = selCenterObj ? [selCenterObj] : [];
      }
    }

    // Plot active ones
    const newMarkers = centersToShow.map(center => {
      const marker = L.marker([center.latitude, center.longitude], {
        icon: createMarkerIcon('center', 30)
      }).addTo(mapRef.current);

      marker.bindPopup(`
        <h4>${center.center_name}</h4>
        <div class="popup-dhamma">☸️ ${center.center_dhamma_name || 'Dhamma Center'}</div>
        <div class="popup-details">📍 ${center.extracted_city || 'Nepal'}</div>
      `);

      marker.on('click', () => {
        if (onSelectCenter) onSelectCenter(center);
      });

      return { name: center.center_name, marker };
    });

    centerMarkersRef.current = newMarkers;
  }, [centers, allCenters, onSelectCenter, sourceCity, targetCenter, selectedCenter, showCenters]);

  // 4. Handle Center flying details
  useEffect(() => {
    if (!mapRef.current || !selectedCenter) return;
    
    // Zoom and pan
    mapRef.current.flyTo([selectedCenter.latitude, selectedCenter.longitude], 12);
    
    // Open Popup
    const activeMarker = centerMarkersRef.current.find(m => m.name === selectedCenter.center_name);
    if (activeMarker) {
      activeMarker.marker.openPopup();
    }
  }, [selectedCenter]);

  // 4b. Reset map view when all selections are cleared
  useEffect(() => {
    if (!mapRef.current) return;
    
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }

    if (!selectedCenter && !sourceCity && !targetCenter) {
      mapRef.current.flyTo([27.5, 84.2], 7);
    }
  }, [selectedCenter, sourceCity, targetCenter]);

  // 5. Draw Animated Routes & Sync Marker Visibility
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old lines
    activePolylinesRef.current.forEach(p => mapRef.current.removeLayer(p));
    activePolylinesRef.current = [];

    // Clear old pulse animations and tooltips
    const clearRouteVisuals = () => {
      staticMarkersRef.current.cities.forEach(c => {
        c.marker.getElement()?.classList.remove('marker-selected-pulse');
        c.marker.unbindTooltip();
      });
      staticMarkersRef.current.borders.forEach(b => {
        b.marker.getElement()?.classList.remove('marker-selected-pulse');
        b.marker.unbindTooltip();
      });
      centerMarkersRef.current.forEach(c => {
        c.marker.getElement()?.classList.remove('marker-selected-pulse');
        c.marker.unbindTooltip();
      });
    };
    clearRouteVisuals();

    const isRouteActive = !!(sourceCity && targetCenter);
    let activeBorderKey = null;
    let route = null;
    let centerObj = null;

    if (isRouteActive) {
      centerObj = (allCenters || centers).find(c => c.center_name === targetCenter);
      if (centerObj) {
        route = calculateFullRoute(sourceCity, centerObj, targetCenter);
        if (route) {
          activeBorderKey = route.borderKey;
        }
      }
    }

    // Update cities visibility
    staticMarkersRef.current.cities.forEach(({ name, marker }) => {
      const shouldBeVisible = (name === sourceCity) || (showIndianHubs && !isRouteActive);
      const isCurrentlyOnMap = mapRef.current.hasLayer(marker);

      if (shouldBeVisible && !isCurrentlyOnMap) {
        marker.addTo(mapRef.current);
      } else if (!shouldBeVisible && isCurrentlyOnMap) {
        mapRef.current.removeLayer(marker);
      }
    });

    // Update borders visibility
    staticMarkersRef.current.borders.forEach(({ name, marker }) => {
      const activeBorderName = activeBorderKey ? BORDERS[activeBorderKey]?.name : null;
      const shouldBeVisible = (name === activeBorderName) || (showBorders && !isRouteActive);
      const isCurrentlyOnMap = mapRef.current.hasLayer(marker);

      if (shouldBeVisible && !isCurrentlyOnMap) {
        marker.addTo(mapRef.current);
      } else if (!shouldBeVisible && isCurrentlyOnMap) {
        mapRef.current.removeLayer(marker);
      }
    });

    // Helper to apply pulse effect to active markers (ensuring the element is loaded in DOM)
    const addPulseClass = (marker) => {
      const el = marker.getElement();
      if (el) {
        el.classList.add('marker-selected-pulse');
      } else {
        setTimeout(() => {
          marker.getElement()?.classList.add('marker-selected-pulse');
        }, 50);
      }
    };

    // Pulse the source city if selected
    if (sourceCity) {
      const startCityMatch = staticMarkersRef.current.cities.find(c => c.name === sourceCity);
      if (startCityMatch) {
        addPulseClass(startCityMatch.marker);
      }
    }

    // Pulse the target center if selected
    if (targetCenter) {
      const targetCenterMatch = centerMarkersRef.current.find(c => c.name === targetCenter);
      if (targetCenterMatch) {
        addPulseClass(targetCenterMatch.marker);
      }
    }

    if (!isRouteActive || !route || !centerObj) return;

    // Setup active styles
    const getClassName = mode => {
      if (mode === 'rail') return 'route-rail';
      if (mode === 'air') return 'route-air';
      return 'route-road';
    };
    
    const getColor = mode => {
      if (mode === 'rail') return '#333333';
      if (mode === 'air') return '#0275d8';
      return '#d9534f';
    };

    // Draw paths
    route.segments.forEach((seg, idx) => {
      const line = L.polyline(seg.path, {
        color: getColor(seg.mode),
        weight: 4,
        opacity: 0.85,
        className: `${getClassName(seg.mode)} route-line-animated`
      }).addTo(mapRef.current);
      activePolylinesRef.current.push(line);

      // Add a small transit mode badge at the midpoint of each segment (skip border crossing index 1)
      if (idx !== 1) {
        const midpoint = getPolylineMidpoint(seg.path);
        if (midpoint) {
          const badgeMarker = L.marker(midpoint, {
            icon: createTransitBadgeIcon(seg.mode),
            interactive: false
          }).addTo(mapRef.current);
          activePolylinesRef.current.push(badgeMarker);
        }
      }
    });

    // Zoom to fit bounds
    const bounds = L.latLngBounds([
      [CITIES[sourceCity].lat, CITIES[sourceCity].lng],
      [BORDERS[route.borderKey].lat, BORDERS[route.borderKey].lng],
      [centerObj.latitude, centerObj.longitude]
    ]);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });

    // Pulse the border crossing
    const borderMatch = staticMarkersRef.current.borders.find(b => b.name === BORDERS[route.borderKey].name);
    if (borderMatch) {
      addPulseClass(borderMatch.marker);
    }

  }, [sourceCity, targetCenter, allCenters, centers, showIndianHubs, showBorders]);

  return (
    <section className="map-container" id="map-section">
      <div id="map" ref={mapContainerRef}></div>
      
      {/* Legend Card Overlay */}
      <div className={`map-legend glassmorphic ${isLegendCollapsed ? 'collapsed' : ''}`}>
        <div className="legend-header" onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}>
          <h4 className="legend-title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>
            🗺️ Route Guide
          </h4>
          <button 
            className="legend-toggle-btn" 
            aria-label={isLegendCollapsed ? "Expand Legend" : "Collapse Legend"}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isLegendCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
        
        <div className="legend-content">
          <div className="legend-items">
            <div className="legend-group-title">Transit Modes</div>
            <div className="legend-item">
              <span className="legend-line line-road"></span>
              <span>Roadways</span>
            </div>
            <div className="legend-item">
              <span className="legend-line line-rail"></span>
              <span>Railways</span>
            </div>
            <div className="legend-item">
              <span className="legend-line line-air"></span>
              <span>Airways</span>
            </div>

            <div className="legend-group-title">Map Features</div>
            <div className={`legend-item toggleable ${!showCenters ? 'inactive' : ''}`}>
              <label className="switch" title="Toggle Vipassana Centers">
                <input 
                  type="checkbox" 
                  checked={showCenters} 
                  onChange={(e) => setShowCenters(e.target.checked)} 
                  tabIndex={isLegendCollapsed ? -1 : 0}
                />
                <span className="slider round"></span>
              </label>
              <div className="legend-marker marker-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="2.5"/>
                  <path d="M9 10c0-1.5 1.5-2 3-2s3 .5 3 2v4c0 1.5-1.5 2-3 2s-3-.5-3-2v-4z"/>
                  <path d="M5 19c0-2.5 3-3.5 7-3.5s7 1 7 3.5"/>
                  <path d="M3 21h18"/>
                </svg>
              </div>
              <span>Vipassana Centers</span>
            </div>

            <div className={`legend-item toggleable ${!showBorders ? 'inactive' : ''}`}>
              <label className="switch" title="Toggle Border Crossings">
                <input 
                  type="checkbox" 
                  checked={showBorders} 
                  onChange={(e) => setShowBorders(e.target.checked)} 
                  tabIndex={isLegendCollapsed ? -1 : 0}
                />
                <span className="slider round"></span>
              </label>
              <div className="legend-marker marker-border">
                <div className="marker-border-inner"></div>
              </div>
              <span>Border Crossings</span>
            </div>

            <div className={`legend-item toggleable ${!showIndianHubs ? 'inactive' : ''}`}>
              <label className="switch" title="Toggle Indian Hubs">
                <input 
                  type="checkbox" 
                  checked={showIndianHubs} 
                  onChange={(e) => setShowIndianHubs(e.target.checked)} 
                  tabIndex={isLegendCollapsed ? -1 : 0}
                />
                <span className="slider round"></span>
              </label>
              <div className="legend-marker marker-city">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18"/>
                  <path d="M5 21V7l5-4v14"/>
                  <path d="M19 21V11l-5-3v13"/>
                </svg>
              </div>
              <span>Indian Hubs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
