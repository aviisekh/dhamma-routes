import React, { useState, useEffect } from 'react';
import { CITIES } from '../constants/routing';
import { calculateFullRoute } from '../utils/routing';


export default function SidebarRouting({
  centers,
  selectedCenter,
  sourceCity,
  setSourceCity,
  targetCenter,
  setTargetCenter,
  onSelectCenter,
  isOpen,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('routing');
  const [routeInfo, setRouteInfo] = useState(null);
  const [mobileState, setMobileState] = useState('peek'); // 'peek' or 'expanded'

  useEffect(() => {
    if (isOpen) {
      setMobileState('peek');
    }
  }, [isOpen]);


  // Re-calculate route whenever city or center selection changes
  useEffect(() => {
    if (sourceCity && targetCenter) {
      const centerObj = centers.find(c => c.center_name === targetCenter);
      if (centerObj) {
        const route = calculateFullRoute(sourceCity, centerObj, targetCenter);
        setRouteInfo(route);
      } else {
        setRouteInfo(null);
      }
    } else {
      setRouteInfo(null);
    }
  }, [sourceCity, targetCenter, centers]);

  // Sync target center selection if user clicks on a center card or marker
  useEffect(() => {
    if (selectedCenter && sourceCity) {
      setTargetCenter(selectedCenter.center_name);
    }
  }, [selectedCenter, sourceCity, setTargetCenter]);

  const handleSourceChange = (e) => {
    const val = e.target.value;
    setSourceCity(val);
    if (!val) {
      setTargetCenter('');
      setRouteInfo(null);
    }
  };

  const handleTargetChange = (e) => {
    const val = e.target.value;
    setTargetCenter(val);
    if (onSelectCenter) {
      onSelectCenter(null);
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
    } else if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      // Horizontal swipe is dominant
      if (diffX > 0) {
        // Swipe LEFT (drag to the left to show the next tab)
        if (activeTab === 'routing') {
          setActiveTab('guide');
        } else if (activeTab === 'guide') {
          setActiveTab('info');
        }
      } else {
        // Swipe RIGHT (drag to the right to show the previous tab)
        if (activeTab === 'info') {
          setActiveTab('guide');
        } else if (activeTab === 'guide') {
          setActiveTab('routing');
        }
      }
    }
  };

  return (
    <aside 
      className={`sidebar right-sidebar ${isOpen ? 'open' : ''} ${mobileState === 'expanded' ? 'expanded' : ''}`} 
      id="sidebar-routing"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="bottom-sheet-handle"></div>
      <div className="tabs-container">
        <div className="tab-buttons" role="tablist">
          <button 
            className={`tab-btn ${activeTab === 'routing' ? 'active' : ''}`}
            onClick={() => setActiveTab('routing')}
            role="tab" 
            aria-selected={activeTab === 'routing'}
          >
            Transit Route
          </button>
          <button 
            className={`tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('guide')}
            role="tab" 
            aria-selected={activeTab === 'guide'}
          >
            Border Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
            role="tab" 
            aria-selected={activeTab === 'info'}
          >
            Useful Info
          </button>
        </div>

        <div className="scroller tab-content-wrapper">
          {/* Tab Panel 1: Route Planner */}
          {activeTab === 'routing' && (
            <div className="tab-panel active" role="tabpanel">
              <div className="planner-card">
                <h3>Find Your Route</h3>
                <p className="planner-desc">Select an Indian departure hub and a Vipassana center in Nepal to generate transit directions.</p>
                
                <div className="form-group">
                  <label htmlFor="select-source">Depart from India:</label>
                  <select 
                    id="select-source" 
                    className="planner-select"
                    value={sourceCity}
                    onChange={handleSourceChange}
                  >
                    <option value="">-- Choose Starting City --</option>
                    {Object.values(CITIES).map(city => (
                      <option key={city.name} value={city.name}>{city.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="select-target">Vipassana Center in Nepal:</label>
                  <select 
                    id="select-target" 
                    className="planner-select"
                    disabled={!sourceCity}
                    value={targetCenter}
                    onChange={handleTargetChange}
                  >
                    {!sourceCity ? (
                      <option value="">-- First Select Start City --</option>
                    ) : (
                      <>
                        <option value="">-- Choose Target Center --</option>
                        {[...centers].sort((a,b) => a.center_name.localeCompare(b.center_name)).map(c => (
                          <option key={c.s_no} value={c.center_name}>
                            {c.center_name} ({c.center_dhamma_name || 'Dhamma'})
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                {(sourceCity || targetCenter) && (
                  <button 
                    className="planner-clear-btn" 
                    onClick={() => {
                      setSourceCity('');
                      setTargetCenter('');
                      if (onSelectCenter) {
                        onSelectCenter(null);
                      }
                    }}
                    title="Clear route planning selections"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Clear Route
                  </button>
                )}
              </div>

              {/* Routing Results Container */}
              <div className="routing-results-container">
                {!routeInfo ? (
                  <div className="default-routes-info">
                    <div className="info-graphic">
                      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 4L9 7"></path>
                      </svg>
                    </div>
                    <p>Select your starting city and destination center to view transit routes and border crossings.</p>
                  </div>
                ) : (
                  <div className="route-details-panel">
                    <div className="route-header">
                      <h4>{sourceCity} &rarr; {routeInfo.borderName.replace(' Border', '')} &rarr; {targetCenter.replace(' Vipassana Center', '')}</h4>
                      <div className="route-modes">
                        {Array.from(new Set(routeInfo.segments.map(s => s.mode))).map(m => (
                          <span key={m} className={`mode-badge badge-${m}`}>
                            {m === 'rail' ? '🚆 Rail' : m === 'air' ? '✈️ Air' : '🚌 Road'}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="timeline">
                      <div className="timeline-item origin">
                        <div className="timeline-icon">📍</div>
                        <div className="timeline-content">
                          <h5>DEPART: {sourceCity} (India)</h5>
                          <p className="timeline-desc">Starting point for your journey.</p>
                        </div>
                      </div>
                      
                      <div className="timeline-item">
                        <div className="timeline-icon">{routeInfo.segments[0].mode === 'rail' ? '🚆' : '🚌'}</div>
                        <div className="timeline-content">
                          <h5>{routeInfo.segments[0].label}</h5>
                          <div className="timeline-meta">India Segment</div>
                          <p className="timeline-desc" dangerouslySetInnerHTML={{ __html: routeInfo.segments[0].desc }}></p>
                        </div>
                      </div>

                      <div className="timeline-item">
                        <div className="timeline-icon">🛂</div>
                        <div className="timeline-content">
                          <h5>{routeInfo.segments[1].label}</h5>
                          <div className="timeline-meta">{routeInfo.borderName} Crossing</div>
                          <p className="timeline-desc" dangerouslySetInnerHTML={{ __html: routeInfo.segments[1].desc }}></p>
                        </div>
                      </div>

                      <div className="timeline-item">
                        <div className="timeline-icon">{routeInfo.segments[2].mode === 'air' ? '✈️' : routeInfo.segments[2].mode === 'rail' ? '🚆' : '🚌'}</div>
                        <div className="timeline-content">
                          <h5>{routeInfo.segments[2].label}</h5>
                          <div className="timeline-meta">Nepal Segment</div>
                          <p className="timeline-desc" dangerouslySetInnerHTML={{ __html: routeInfo.segments[2].desc }}></p>
                        </div>
                      </div>

                      <div className="timeline-item destination">
                        <div className="timeline-icon">☸️</div>
                        <div className="timeline-content">
                          <h5>ARRIVE: {centers.find(c => c.center_name === targetCenter)?.center_dhamma_name || targetCenter}</h5>
                          <div className="timeline-meta">{centers.find(c => c.center_name === targetCenter)?.extracted_city || 'Nepal'}</div>
                          <p className="timeline-desc">Arrive at the meditation center. Check-in is generally required before 4:00 PM on Day 0.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab Panel 2: Border Crossing Info */}
          {activeTab === 'guide' && (
            <div className="tab-panel active" role="tabpanel">
              <div className="guide-card">
                <h3>India-Nepal Border Crossings</h3>
                <p>India and Nepal share an open border. Indian citizens enjoy visa-free movement, while foreign nationals can obtain visas-on-arrival at land entry ports.</p>
                
                <div className="crossing-list">
                  <div className="crossing-info-item">
                    <h4>1. Banbasa / Mahendranagar Border</h4>
                    <p><strong>Nearest Center(s):</strong> Sudur Paschim Vipassana Center (Dhamma Yana, Mahendranagar) - 5 km away (15-min rickshaw ride).</p>
                    <p><strong>Primary Transit for:</strong> Sudur Paschim (Mahendranagar - 15 mins).</p>
                    <p><strong>Nearest Indian Rail:</strong> Banbasa (Uttarakhand) - 2.5 km away. Regular rickshaws run from the station to the Sharda River Barrage. Direct trains like Purnagiri Jan Shatabdi connect Delhi Rohilla to Banbasa.</p>
                  </div>
                  <div className="crossing-info-item">
                    <h4>2. Gauriphanta / Dhangadhi Border</h4>
                    <p><strong>Nearest Center(s):</strong> Sudur Paschim Vipassana Center (Dhamma Yana, Mahendranagar) - 50 km away (1-hour drive).</p>
                    <p><strong>Primary Transit for:</strong> Sudur Paschim (Mahendranagar - 45 km), Surkhet.</p>
                    <p><strong>Nearest Indian Rail:</strong> Mailani Jn or Palia Kalan, though travelers generally take direct state transport buses or private taxis from Lucknow (5.5 hours, 240 km).</p>
                  </div>
                  <div className="crossing-info-item">
                    <h4>3. Rupaidiha / Nepalgunj Border</h4>
                    <p><strong>Nearest Center(s):</strong> Surkhetta Vipassana Center (Dhamma Surkhetta) - 110 km (3h drive), Dang Vipassana Center (Dhamma Parag) - 140 km (3.5h drive).</p>
                    <p><strong>Primary Transit for:</strong> Dang, Surkhet, Nepalgunj.</p>
                    <p><strong>Nearest Indian Rail:</strong> Gonda Jn or Bahraich. Most travelers take direct buses or private cabs from Kaiserbagh bus park in Lucknow directly to the border (4 hours, 180 km).</p>
                  </div>
                  <div className="crossing-info-item">
                    <h4>4. Barhni / Krishnanagar Border</h4>
                    <p><strong>Nearest Center(s):</strong> Kapilvastu Vipassana Center (Dhamma Nanadana, Banganga) - 25 km away (45-min drive).</p>
                    <p><strong>Primary Transit for:</strong> Kapilvastu (Taulihawa - 45 mins / 25 km).</p>
                    <p><strong>Nearest Indian Rail:</strong> Barhni (UP) - sits directly on the border. Walk 200m from Barhni station platform to Krishnanagar Customs. Direct train connections from Delhi and Lucknow are available.</p>
                  </div>
                  <div className="crossing-info-item">
                    <h4>5. Sunauli / Belahiya Border</h4>
                    <p><strong>Nearest Center(s):</strong> Lumbini Vipassana Center (Dhamma Janani) - 22 km (30 mins), Debdaha Vipassana Center - 30 km (45 mins), Palpa Vipassana Center (Dhamma Sisa) - 70 km (2h), Kapilvastu Vipassana Center - 60 km (1.5h).</p>
                    <p><strong>Primary Transit for:</strong> Lumbini (30 mins), Pokhara (6-8 hours), Palpa, Kapilvastu, Kathmandu.</p>
                    <p><strong>Nearest Indian Rail:</strong> Gorakhpur Jn (GKP) - 80 km away. Frequent local buses and taxis run from Gorakhpur station to Sunauli checkpost (approx. 2.5 hours).</p>
                  </div>
                  <div className="crossing-info-item">
                    <h4>6. Raxaul / Birgunj Border</h4>
                    <p><strong>Nearest Center(s):</strong> Dhamma Tarai Vipassan Center (Birgunj) - 9 km (15 mins), Chitwan Vipassana Center (Dhamma Chitwan) - 110 km (3h).</p>
                    <p><strong>Primary Transit for:</strong> Dhamma Tarai (Birgunj), Chitwan, Kathmandu, Lalitpur.</p>
                    <p><strong>Nearest Indian Rail:</strong> Raxaul Jn (RXL) - right at the border. Walk or take a cycle rickshaw across the Miteri Bridge to Birgunj customs. Excellent direct express train connectivity from Patna, Kolkata, and Delhi.</p>
                  </div>
                  <div className="crossing-info-item">
                    <h4>7. Jaynagar / Janakpur Border</h4>
                    <p><strong>Nearest Center(s):</strong> Janakpur area and local centers (serves as a gateway for Dhanusha / Central-Eastern Nepal regional courses).</p>
                    <p><strong>Primary Transit for:</strong> Janakpur, Dhanusha, and Central-Eastern Nepal.</p>
                    <p><strong>Nearest Indian Rail:</strong> Jaynagar (Bihar) - sits on the border. Home to the cross-border passenger railway linking Jaynagar to Janakpur (Kurtha), Nepal.</p>
                  </div>
                  <div className="crossing-info-item">
                    <h4>8. Jogbani / Biratnagar Border</h4>
                    <p><strong>Nearest Center(s):</strong> Purbanchal Vipassana Center (Dhamma Birat, Itahari) - 22 km away (45-min drive).</p>
                    <p><strong>Primary Transit for:</strong> Purbanchal (Itahari - 45 mins / 22 km), Biratnagar.</p>
                    <p><strong>Nearest Indian Rail:</strong> Jogbani (Bihar) - situated under 300 meters from the border customs gate. Features direct express trains from Kolkata, Patna, and Delhi (Seemanchal Express).</p>
                  </div>
                  <div className="crossing-info-item">
                    <h4>9. Panitanki / Kakarbhitta Border</h4>
                    <p><strong>Nearest Center(s):</strong> Ilam Vipassana Center (Dhamma Suriyo) - 65 km (2h drive), Purbanchal Vipassana Center (Dhamma Birat) - 65 km (1.5h drive).</p>
                    <p><strong>Primary Transit for:</strong> Ilam (2 hours), Purbanchal (Itahari), Lukla, Kathmandu.</p>
                    <p><strong>Nearest Indian Rail:</strong> New Jalpaiguri (NJP) or Siliguri Jn - 35 km away. Frequent shared jeeps, taxis, and state buses connect NJP/Siliguri directly to the Panitanki gate.</p>
                  </div>
                  <div className="crossing-info-item">
                    <h4>10. Tribhuvan International Airport (KTM) - Kathmandu</h4>
                    <p><strong>Nearest Center(s):</strong> Nepal Vipassana Center (Dharmashringa, Budhanilkantha - 12 km), Kotdada Vipassana Center (Lalitpur - 18 km), Kirtipur Vipassana Center (15 km), Kakani Vipassana Center (25 km), Nakkhu Prison Vipassana Center (10 km).</p>
                    <p><strong>Primary Transit for:</strong> Kathmandu Valley (Budhanilkantha, Lalitpur, Kirtipur, Kakani), Pokhara, Lukla, Chitwan.</p>
                    <p><strong>Travel Details:</strong> Main aviation entry hub for travelers arriving from distant cities (Mumbai, Bengaluru, Chennai, Hyderabad, etc.). Offers domestic flights to regional airports like Pokhara, Bhairahawa, Simara, and Biratnagar.</p>
                  </div>
                </div>

                <div className="documentation-box">
                  <h5>Required Documents</h5>
                  <ul>
                    <li><strong>Indian Citizens:</strong> Valid Passport OR original Voter ID card. (Adhaar card is sometimes accepted at land borders but Passport/Voter ID are officially mandated).</li>
                    <li><strong>Foreign Nationals:</strong> Valid Passport, Passport-sized photographs, and cash USD for Visa-on-arrival (15 days: $30, 30 days: $50, 90 days: $125).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab Panel 3: Useful Info */}
          {activeTab === 'info' && (
            <div className="tab-panel active" role="tabpanel">
              <div className="info-card">
                <h3>General Travel Guidelines</h3>
                <div className="info-grid">
                  <div className="info-tile">
                    <div className="tile-icon">🗓️</div>
                    <div className="tile-body">
                      <h4>Best Time to Visit</h4>
                      <p>September to May offers pleasant weather. High mountains get extremely cold in winter (Dec-Jan); carry heavy woolens for centers like Lukla, Kakani, and Palpa.</p>
                    </div>
                  </div>
                  <div className="info-tile">
                    <div className="tile-icon">👕</div>
                    <div className="tile-body">
                      <h4>Dress Code</h4>
                      <p>Modest, loose-fitting, comfortable clothing. Shoulders and knees must be fully covered. Avoid tight-fitting clothes, jeans, or revealing outfits.</p>
                    </div>
                  </div>
                  <div className="info-tile">
                    <div className="tile-icon">🧳</div>
                    <div className="tile-body">
                      <h4>What to Bring</h4>
                      <p>Reusable water bottle, flashlight/torch, toiletries, alarm clock, personal medicines, and appropriate seasonal bedding/blankets if requested by the center.</p>
                    </div>
                  </div>
                  <div className="info-tile">
                    <div className="tile-icon">🌐</div>
                    <div className="tile-body">
                      <h4>Registration</h4>
                      <p>All Vipassana courses are offered on a voluntary donation basis. You must register online beforehand via <a href="https://www.dhamma.org" target="_blank" rel="noopener noreferrer">dhamma.org</a> and receive a confirmed admission letter before arriving.</p>
                    </div>
                  </div>
                </div>

                <div className="quote-container">
                  <p className="quote">"Purify the mind and everything will fall into place."</p>
                  <span class="quote-author">&mdash; S.N. Goenka</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
