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
  onClose
}) {
  return (
    <aside className={`sidebar left-sidebar ${isOpen ? 'open' : ''}`} id="sidebar-centers">
      <div className="sidebar-header">
        <h2>Vipassana Centers</h2>
        <span className="count-badge" id="centers-count">
          {loading ? '...' : `${centers.length} Centers`}
        </span>
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
