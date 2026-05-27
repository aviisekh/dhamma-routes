import React from 'react';

export default function Header({ theme, onThemeToggle }) {
  return (
    <header class="app-header">
      <div class="header-logo">
        <svg class="dharma-wheel" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="4"/>
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" stroke-width="3"/>
          <circle cx="50" cy="50" r="3" fill="currentColor"/>
          <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" stroke-width="3"/>
          <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" stroke-width="3"/>
          <line x1="18.2" y1="18.2" x2="81.8" y2="81.8" stroke="currentColor" stroke-width="3"/>
          <line x1="81.8" y1="18.2" x2="18.2" y2="81.8" stroke="currentColor" stroke-width="3"/>
        </svg>
        <div class="header-titles">
          <h1>VIPASSANA CENTERS IN NEPAL</h1>
          <p class="subtitle">A Path to Inner Peace • Interactive Transit & Route Guide</p>
        </div>
      </div>
      <div class="header-controls">
        <button 
          id="theme-toggle" 
          class="icon-btn" 
          onClick={onThemeToggle}
          aria-label="Toggle light and dark mode"
        >
          <svg class="sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
          </svg>
          <svg class="moon-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}
