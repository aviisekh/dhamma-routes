import React, { useEffect, useRef } from 'react';

export default function CenterDetailsDrawer({ center, onClose }) {
  const drawerRef = useRef(null);

  // Focus the drawer for accessibility when it opens
  useEffect(() => {
    if (center && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [center]);

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
            <a href={`tel:${phone}`} className="call-link">📞 {phonePart}</a>
          </>
        )}
      </div>
    );
  }

  const maleHall = center ? parseInt(center.dhamma_hall_capacity_male) || 0 : 0;
  const femaleHall = center ? parseInt(center.dhamma_hall_capacity_female) || 0 : 0;
  const maleRes = center ? parseInt(center.residence_capacity_male) || 0 : 0;
  const femaleRes = center ? parseInt(center.residence_capacity_female) || 0 : 0;

  const showCapacity = maleHall > 0 || femaleHall > 0 || maleRes > 0 || femaleRes > 0;

  const getCapacityPercent = (value, max = 150) => {
    const parsed = parseInt(value) || 0;
    return Math.min(100, (parsed / max) * 100);
  };

  const handleCopyContact = () => {
    if (center) {
      navigator.clipboard.writeText(`${center.center_name}\n${center.contact_person || ""}`);
      alert("Contact details copied to clipboard!");
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
        <div className="drawer-content glassmorphic">
          <button className="close-btn" onClick={onClose} aria-label="Close details">&times;</button>
          <div className="drawer-body">
            <div className="drawer-center-header">
              <h2>{center.center_name}</h2>
              <div className="drawer-center-dhamma">☸️ {center.center_dhamma_name || 'Dhamma Center'}</div>
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
                  <div className="info-row-body">
                    <h5>Contact</h5>
                    <p>{contactHtml}</p>
                  </div>
                </div>
                
                <div className="info-row">
                  <div className="info-row-icon">📅</div>
                  <div className="info-row-body">
                    <h5>Established</h5>
                    <p>{center.established_date || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="info-row">
                  <div className="info-row-icon">🛕</div>
                  <div className="info-row-body">
                    <h5>Pagoda Facilities</h5>
                    <p>{hasPagoda ? 'Yes, pagoda facility is available for meditation.' : isUnderConstruction ? 'Pagoda is currently under construction.' : 'No pagoda facility.'}</p>
                  </div>
                </div>
                
                {center.remarks && (
                  <div className="remarks-box">
                    <strong>⚠️ Important Remarks</strong>
                    <span dangerouslySetInnerHTML={{ __html: center.remarks.replace(/\n/g, '<br>') }}></span>
                  </div>
                )}
              </div>
              
              <div className="drawer-capacity-info">
                <h4 className="drawer-section-title">Capacity Stats</h4>
                
                {showCapacity ? (
                  <div className="capacity-card">
                    <div className="capacity-bars-container">
                      {(maleHall > 0 || femaleHall > 0) && (
                        <>
                          <div className="capacity-bar-group">
                            <div className="capacity-bar-header">
                              <span className="capacity-label">🧘‍♂️ Dhamma Hall (Male)</span>
                              <span>{maleHall} Seats</span>
                            </div>
                            <div className="capacity-bar-track">
                              <div className="capacity-bar-fill" style={{ width: `${getCapacityPercent(maleHall)}%` }}></div>
                            </div>
                          </div>
                          <div className="capacity-bar-group">
                            <div className="capacity-bar-header">
                              <span className="capacity-label" style={{ color: 'var(--color-accent-hover)' }}>🧘‍♀️ Dhamma Hall (Female)</span>
                              <span>{femaleHall} Seats</span>
                            </div>
                            <div className="capacity-bar-track">
                              <div className="capacity-bar-fill female" style={{ width: `${getCapacityPercent(femaleHall)}%` }}></div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {(maleRes > 0 || femaleRes > 0) && (
                        <>
                          <div className="capacity-bar-group">
                            <div className="capacity-bar-header">
                              <span className="capacity-label">🏠 Residence (Male)</span>
                              <span>{maleRes} Rooms</span>
                            </div>
                            <div className="capacity-bar-track">
                              <div className="capacity-bar-fill" style={{ width: `${getCapacityPercent(maleRes)}%` }}></div>
                            </div>
                          </div>
                          <div className="capacity-bar-group">
                            <div className="capacity-bar-header">
                              <span className="capacity-label" style={{ color: 'var(--color-accent-hover)' }}>🏠 Residence (Female)</span>
                              <span>{femaleRes} Rooms</span>
                            </div>
                            <div className="capacity-bar-track">
                              <div className="capacity-bar-fill female" style={{ width: `${getCapacityPercent(femaleRes)}%` }}></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Capacity data not registered for this center.</p>
                )}
                
                <div className="drawer-actions">
                  <a 
                    href={`https://www.dhamma.org/en/schedules/sch${center.center_dhamma_name ? center.center_dhamma_name.toLowerCase().replace('dhamma', '') : ''}`} 
                    target="_blank" 
                    className="btn btn-primary" 
                    rel="noopener noreferrer"
                  >
                    ☸️ Apply for Course
                  </a>
                  <button className="btn btn-secondary" onClick={handleCopyContact}>
                    📋 Copy Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
