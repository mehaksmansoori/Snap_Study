import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';

const CustomLanguageDropdown = ({ languageOptions, selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ 
    top: 0, left: 0, width: 0, maxHeight: 200, isMobile: false 
  });
  
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Get selected language - STABLE
  const selectedLang = useMemo(() => 
    languageOptions.find(lang => lang.code === selectedLanguage) || languageOptions[0],
    [languageOptions, selectedLanguage]
  );

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 200);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // OPTIMIZED filter - ONLY depends on debouncedSearch
  const filteredLanguages = useMemo(() => {
    if (!debouncedSearch.trim()) return languageOptions;
    
    const search = debouncedSearch.toLowerCase().trim();
    return languageOptions.filter(lang => {
      return (
        lang.name.toLowerCase().includes(search) ||
        lang.native.toLowerCase().includes(search) ||
        lang.code.toLowerCase().includes(search)
      );
    });
  }, [languageOptions, debouncedSearch]);

  // Position calculation
  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const spaceBelow = viewportHeight - rect.bottom;
      
      const isMobile = viewportWidth < 768;
      const maxHeightDesktop = Math.min(220, Math.max(spaceBelow - 20, 180));
      const maxHeightMobile = Math.min(280, viewportHeight * 0.6);
      
      const maxHeight = isMobile ? maxHeightMobile : maxHeightDesktop;
      
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: isMobile ? 16 : rect.left + window.scrollX,
        width: isMobile ? viewportWidth - 32 : rect.width,
        maxHeight: maxHeight,
        isMobile: isMobile
      });
    }
  }, []);

  // Handlers
  const handleOpen = useCallback(() => {
    updatePosition();
    setIsOpen(true);
  }, [updatePosition]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setDebouncedSearch('');
  }, []);

  const handleSelect = useCallback((langCode) => {
    onLanguageChange(langCode);
    handleClose();
  }, [onLanguageChange, handleClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Outside click handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
        const dropdownElement = document.getElementById('language-dropdown-portal');
        if (!dropdownElement || !dropdownElement.contains(event.target)) {
          handleClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, handleClose, updatePosition]);

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={isOpen ? handleClose : handleOpen}
        className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{selectedLang.flag}</span>
          <div>
            <div className="text-white font-medium">{selectedLang.name}</div>
            <div className="text-slate-400 text-sm">{selectedLang.native}</div>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* STABLE Portal Dropdown - NO RECREATION */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <StableDropdownContent
          dropdownPosition={dropdownPosition}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          debouncedSearch={debouncedSearch}
          filteredLanguages={filteredLanguages}
          selectedLanguage={selectedLanguage}
          handleSelect={handleSelect}
          searchInputRef={searchInputRef}
          languageOptions={languageOptions}
        />,
        document.body
      )}
    </div>
  );
};

// SEPARATE STABLE COMPONENT - Prevents recreation
const StableDropdownContent = React.memo(({
  dropdownPosition,
  searchQuery,
  setSearchQuery,
  debouncedSearch,
  filteredLanguages,
  selectedLanguage,
  handleSelect,
  searchInputRef,
  languageOptions
}) => {
  return (
    <div
      id="language-dropdown-portal"
      style={{
        position: dropdownPosition.isMobile ? 'fixed' : 'absolute',
        top: dropdownPosition.isMobile ? '50%' : dropdownPosition.top + 8,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        transform: dropdownPosition.isMobile ? 'translateY(-50%)' : 'none',
        zIndex: 9999,
        height: dropdownPosition.maxHeight || 200,
        maxHeight: dropdownPosition.maxHeight || 200,
        backgroundColor: 'rgb(30, 41, 59)',
        border: '1px solid rgb(51, 65, 85)',
        borderRadius: '8px',
        boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Search Section */}
      <div style={{ 
        padding: '8px',
        borderBottom: '1px solid rgb(51, 65, 85)',
        flexShrink: 0,
        backgroundColor: 'rgb(30, 41, 59)'
      }}>
        <div style={{ position: 'relative' }}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder={dropdownPosition.isMobile ? "Search..." : "Search languages..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              backgroundColor: 'rgb(51, 65, 85)',
              border: '1px solid rgb(71, 85, 105)',
              borderRadius: '4px',
              color: 'white',
              fontSize: dropdownPosition.isMobile ? '16px' : '14px',
              outline: 'none'
            }}
            autoComplete="off"
            spellCheck="false"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgb(148, 163, 184)',
                cursor: 'pointer',
                padding: '2px',
                borderRadius: '2px',
                fontSize: '16px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          )}
        </div>
        
        <div style={{
          fontSize: '10px',
          color: 'rgb(148, 163, 184)',
          marginTop: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>
            {debouncedSearch ? 
              `${filteredLanguages.length} results` : 
              `${languageOptions.length} languages`
            }
          </span>
          {debouncedSearch !== searchQuery && (
            <span style={{ color: 'rgb(147, 51, 234)', fontSize: '10px' }}>
              Searching...
            </span>
          )}
        </div>
      </div>

      {/* Languages List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        minHeight: '120px',
        padding: '2px',
        backgroundColor: 'rgb(30, 41, 59)'
      }}>
        {filteredLanguages.length > 0 ? (
          filteredLanguages.map((lang) => (
            <LanguageItem
              key={lang.code}
              lang={lang}
              isSelected={selectedLanguage === lang.code}
              onClick={() => handleSelect(lang.code)}
              isMobile={dropdownPosition.isMobile}
            />
          ))
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '120px',
            textAlign: 'center',
            color: 'rgb(148, 163, 184)'
          }}>
            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                No languages found for "{debouncedSearch}"
              </div>
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  color: 'rgb(147, 51, 234)',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Clear search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// SEPARATE LANGUAGE ITEM COMPONENT - Also prevents recreation
const LanguageItem = React.memo(({ lang, isSelected, onClick, isMobile }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: isMobile ? '10px 8px' : '8px',
        margin: '1px 0',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '8px' : '10px',
        backgroundColor: isSelected ? 'rgba(147, 51, 234, 0.25)' : 'transparent',
        border: isSelected ? '1px solid rgba(147, 51, 234, 0.6)' : 'none',
        borderRadius: '4px',
        color: 'white',
        cursor: 'pointer',
        textAlign: 'left',
        minHeight: isMobile ? '44px' : '36px',
        transition: 'all 0.15s ease'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.7)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.target.style.backgroundColor = 'transparent';
        }
      }}
    >
      <span style={{ fontSize: isMobile ? '20px' : '16px', flexShrink: 0 }}>
        {lang.flag}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: '500', fontSize: isMobile ? '15px' : '13px' }}>
          {lang.name}
        </div>
        <div style={{ fontSize: isMobile ? '12px' : '11px', opacity: 0.7 }}>
          {lang.native}
        </div>
      </div>
      {isSelected && (
        <svg style={{ width: '14px', height: '14px', color: 'rgb(147, 51, 234)', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
});

StableDropdownContent.displayName = 'StableDropdownContent';
LanguageItem.displayName = 'LanguageItem';

export default CustomLanguageDropdown;