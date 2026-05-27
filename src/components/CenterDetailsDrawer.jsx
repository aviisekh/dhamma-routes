import React, { useEffect, useRef, useState } from 'react';
import { INDIAN_CITIES } from '../constants/routing';

export default function CenterDetailsDrawer({ 
  center, 
  onClose,
  sourceCity,
  setSourceCity,
  setTargetCenter,
  setIsMobileRoutingOpen,
  setIsRightCollapsed
}) {
  const drawerRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [mobileState, setMobileState] = useState('peek'); // 'peek' or 'expanded'

  useEffect(() => {
    if (center) {
      setMobileState('peek');
    }
  }, [center]);

  // Focus the drawer for accessibility and handle ESC key to close
  useEffect(() => {
    if (center && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [center]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (center) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [center, onClose]);

  const touchStartRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    const diffX = touchStartRef.current.x - touch.clientX;
    const diffY = touchStartRef.current.y - touch.clientY;

    // Check if vertical swipe is dominant
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
      if (diffY > 0) {
        // Swipe UP
        if (mobileState === 'peek') {
          setMobileState('expanded');
        }
      } else {
        // Swipe DOWN
        if (mobileState === 'expanded') {
          setMobileState('peek');
        } else if (mobileState === 'peek') {
          onClose();
        }
      }
    }
  };

  const hasPagoda = center && center.pagoda && center.pagoda.toLowerCase().includes('yes');
  const isUnderConstruction = center && center.remarks && center.remarks.toLowerCase().includes('under construction');

  let contactHtml = 'Unavailable';
  let phone = '';
  let namePart = '';
  let phonePart = '';

  if (center && center.contact_person) {
    phone = center.contact_person.replace(/[^0-9+]/g, '');
    namePart = center.contact_person.split(/[0-9]/)[0].trim();
    phonePart = center.contact_person.replace(namePart, '').trim();
    
    contactHtml = (
      <div>
        <strong>{namePart || 'Contact Person'}</strong>
        {phonePart && (
          <>
            <br />
            <a href={`tel:${phone}`} className="call-link">{phonePart}</a>
          </>
        )}
      </div>
    );
  }

  const maleHall = center ? parseInt(center.dhamma_hall_capacity_male) || 0 : 0;
  const femaleHall = center ? parseInt(center.dhamma_hall_capacity_female) || 0 : 0;
  const maleRes = center ? parseInt(center.residence_capacity_male) || 0 : 0;
  const femaleRes = center ? parseInt(center.residence_capacity_female) || 0 : 0;

  const totalHall = maleHall + femaleHall;
  const totalRes = maleRes + femaleRes;

  const showCapacity = totalHall > 0 || totalRes > 0;

  const getCapacityPercent = (value, total) => {
    if (total <= 0) return 0;
    const parsed = parseInt(value) || 0;
    return (parsed / total) * 100;
  };

  const handleCopyContact = () => {
    if (center) {
      navigator.clipboard.writeText(`${center.center_name}\n${center.contact_person || ""}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      id="center-details-drawer" 
      className="details-drawer" 
      aria-hidden={!center}
      tabIndex={-1}
      ref={drawerRef}
    >
      <div className="drawer-backdrop" onClick={onClose}></div>
      {center && (
        <div 
          className={`drawer-content glassmorphic ${mobileState === 'expanded' ? 'expanded' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="bottom-sheet-handle"></div>
          <button className="close-btn" onClick={onClose} aria-label="Close details">&times;</button>
          <div className="drawer-body">
            <div className="drawer-center-header">
              <div className="drawer-header-left">
                <h2>{center.center_name}</h2>
                <span className="drawer-center-dhamma">☸️ {center.center_dhamma_name || 'Dhamma Center'}</span>
              </div>
              <a 
                href={center.center_url || center.center} 
                target="_blank" 
                className="btn-apply-course" 
                rel="noopener noreferrer"
              >
                Apply for Course
              </a>
            </div>
            
            <div className="drawer-grid">
              <div className="drawer-main-info">
                <h4 className="drawer-section-title">General Information</h4>
                
                <div className="info-row">
                  <div className="info-row-icon">📍</div>
                  <div className="info-row-body">
                    <h5>Address</h5>
                    <p dangerouslySetInnerHTML={{ __html: center.address.replace(/\n/g, '<br>') }}></p>
                  </div>
                </div>
                
                <div className="info-row">
                  <div className="info-row-icon">📞</div>
                  <div className="info-row-body" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <h5>Contact</h5>
                      <button 
                        className="copy-btn-inline" 
                        onClick={handleCopyContact} 
                        title="Copy Contact Details"
                        aria-label="Copy Contact Details"
                      >
                        {copied ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="copy-icon">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        )}
                      </button>
                    </div>
                    <p>{contactHtml}</p>
                  </div>
                </div>
                
                {center.remarks && (
                  <div className="remarks-box">
                    <strong>⚠️ Important Remarks</strong>
                    <span dangerouslySetInnerHTML={{ __html: center.remarks.replace(/\n/g, '<br>') }}></span>
                  </div>
                )}
              </div>
              
              <div className="drawer-sidebar-info">
                {/* Quick Info Grid */}
                <div className="quick-stats-grid">
                  <div className="quick-stat-card">
                    <span className="stat-icon">📅</span>
                    <div className="stat-body">
                      <span className="stat-label">Established</span>
                      <span className="stat-value">{center.established_date || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="quick-stat-card">
                    <span className="stat-icon">🛕</span>
                    <div className="stat-body">
                      <span className="stat-label">Pagoda</span>
                      <span className="stat-value" title={hasPagoda ? 'Available' : isUnderConstruction ? 'Under Construction' : 'None'}>
                        {hasPagoda ? 'Available' : isUnderConstruction ? 'Under Construction' : 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="capacity-section">
                  <h4 className="drawer-section-title">Capacity Stats</h4>
                  
                  {showCapacity ? (
                    <div className="capacity-card-compact">
                      {(maleHall > 0 || femaleHall > 0) && (
                        <div className="capacity-group-compact">
                          <h6 className="capacity-group-title">🧘 Dhamma Hall</h6>
                          <div className="capacity-bars-row">
                            <div className="capacity-bar-compact">
                              <div className="capacity-bar-info">
                                <span>Male</span>
                                <strong>{maleHall}</strong>
                              </div>
                              <div className="capacity-bar-track-compact">
                                <div className="capacity-bar-fill-compact" style={{ width: `${getCapacityPercent(maleHall, totalHall)}%` }}></div>
                              </div>
                            </div>
                            <div className="capacity-bar-compact">
                              <div className="capacity-bar-info">
                                <span>Female</span>
                                <strong>{femaleHall}</strong>
                              </div>
                              <div className="capacity-bar-track-compact">
                                <div className="capacity-bar-fill-compact female" style={{ width: `${getCapacityPercent(femaleHall, totalHall)}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {(maleRes > 0 || femaleRes > 0) && (
                        <div className="capacity-group-compact">
                          <h6 className="capacity-group-title">🏠 Residence</h6>
                          <div className="capacity-bars-row">
                            <div className="capacity-bar-compact">
                              <div className="capacity-bar-info">
                                <span>Male</span>
                                <strong>{maleRes}</strong>
                              </div>
                              <div className="capacity-bar-track-compact">
                                <div className="capacity-bar-fill-compact" style={{ width: `${getCapacityPercent(maleRes, totalRes)}%` }}></div>
                              </div>
                            </div>
                            <div className="capacity-bar-compact">
                              <div className="capacity-bar-info">
                                <span>Female</span>
                                <strong>{femaleRes}</strong>
                              </div>
                              <div className="capacity-bar-track-compact">
                                <div className="capacity-bar-fill-compact female" style={{ width: `${getCapacityPercent(femaleRes, totalRes)}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="no-capacity-text">Capacity data not registered.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Transit Route Finder Section */}
            <div className="drawer-route-finder-compact">
              <div className="route-finder-info">
                <strong>🗺️ Route Planner</strong>
                <span>Find routes from Indian departure hubs</span>
              </div>
              <div className="route-finder-select-wrapper">
                <select 
                  id="drawer-select-source" 
                  className="planner-select-compact"
                  value=""
                  onChange={(e) => {
                    const selectedHub = e.target.value;
                    if (selectedHub) {
                      setSourceCity(selectedHub);
                      setTargetCenter(center.center_name);
                      // Open the routing panel
                      if (window.innerWidth <= 992) {
                        if (setIsMobileRoutingOpen) setIsMobileRoutingOpen(true);
                      } else {
                        if (setIsRightCollapsed) setIsRightCollapsed(false);
                      }
                      // Close the drawer
                      onClose();
                    }
                  }}
                >
                  <option value="">Choose Starting City...</option>
                  {Object.values(INDIAN_CITIES).map(city => (
                    <option key={city.name} value={city.name}>{city.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
