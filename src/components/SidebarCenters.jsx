import React from 'react';

export default function SidebarCenters({
  centers,
  selectedCenter,
  onSelectCenter,
  loading,
  searchQuery,
  setSearchQuery,
  pagodaFilter,
  setPagodaFilter,
  statusFilter,
  setStatusFilter,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse
}) {
  const [mobileState, setMobileState] = React.useState('peek'); // 'peek' or 'expanded'

  React.useEffect(() => {
    if (isOpen) {
      setMobileState('peek');
    }
  }, [isOpen]);

  const handleCollapseClick = () => {
    if (window.innerWidth <= 992) {
      if (onClose) onClose();
    } else {
      if (onToggleCollapse) onToggleCollapse();
    }
  };

  const touchStartRef = React.useRef({ x: 0, y: 0 });

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
        // Swipe UP (diffY is positive, meaning user dragged upwards)
        if (mobileState === 'peek') {
          setMobileState('expanded');
        }
      } else {
        // Swipe DOWN (diffY is negative, meaning user dragged downwards)
        if (mobileState === 'expanded') {
          setMobileState('peek');
        } else if (mobileState === 'peek') {
          if (onClose) onClose();
        }
      }
    }
  };

  return (
    <aside 
      className={`sidebar left-sidebar ${isOpen ? 'open' : ''} ${mobileState === 'expanded' ? 'expanded' : ''}`} 
      id="sidebar-centers"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="bottom-sheet-handle"></div>
      <div className="sidebar-header">
        <h2>Vipassana Centers</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="count-badge" id="centers-count">
            {loading ? '...' : `${centers.length} Centers`}
          </span>
          <button 
            className="sidebar-toggle-btn" 
            onClick={handleCollapseClick}
            title="Collapse panel"
            aria-label="Collapse panel"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      
      {/* Filters Panel */}
      <div className="filters-panel">
        <div className="search-box">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            id="search-input" 
            placeholder="Search by name, city, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              id="search-clear" 
              className="clear-btn" 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>
        
        <div className="filter-options">
          <select 
            id="filter-pagoda" 
            className="filter-select"
            value={pagodaFilter}
            onChange={(e) => setPagodaFilter(e.target.value)}
            aria-label="Filter by Pagoda availability"
          >
            <option value="all">All Pagodas</option>
            <option value="yes">Has Pagoda</option>
            <option value="no">No Pagoda</option>
          </select>
          
          <select 
            id="filter-status" 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Center status"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="construction">Under Construction</option>
          </select>
        </div>
      </div>

      {/* List Scroll Container */}
      <div className="scroller" id="centers-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading Vipassana centers...</p>
          </div>
        ) : centers.length === 0 ? (
          <p className="no-results">No centers match your filters.</p>
        ) : (
          centers.map((center) => {
            const hasPagoda = center.pagoda && center.pagoda.toLowerCase().includes('yes');
            const isUnderConstruction = center.remarks && center.remarks.toLowerCase().includes('under construction');
            const maleRes = parseInt(center.residence_capacity_male) || 0;
            const femaleRes = parseInt(center.residence_capacity_female) || 0;
            const totalRes = maleRes + femaleRes;
            const centerId = center.s_no.replace('.0', '');
            
            return (
              <button
                key={center.s_no}
                id={`card-${centerId}`}
                className={`center-card ${selectedCenter && selectedCenter.s_no === center.s_no ? 'active' : ''}`}
                onClick={() => {
                  onSelectCenter(center);
                  if (onClose) onClose(); // close sidebar on mobile click
                }}
              >
                {isUnderConstruction ? (
                  <span className="status-badge construction">Building</span>
                ) : (
                  <span className="status-badge active">Active</span>
                )}
                
                <h3 className="center-title">{center.center_name}</h3>
                <div className="center-dhamma">{center.center_dhamma_name || 'Dhamma Center'}</div>
                
                <div className="center-meta">
                  <div className="meta-item">
                    <span>📍</span>
                    <span>{center.extracted_city || 'Nepal'}</span>
                  </div>
                  {totalRes > 0 && (
                    <div className="meta-item">
                      <span>👥</span>
                      <span>Capacity: {totalRes}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <span>🛕</span>
                    <span>Pagoda: {hasPagoda ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
