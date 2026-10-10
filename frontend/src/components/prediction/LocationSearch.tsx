import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, AlertCircle, Loader2 } from 'lucide-react';
import { predictionApi } from '../../services/predictionApi';

interface LocationSearchProps {
  onLocationSelect: (location: { name: string; latitude: number; longitude: number } | null) => void;
  error?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect, error }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; latitude: number; longitude: number } | null>(null);
  const [internalError, setInternalError] = useState<string | undefined>(error);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setInternalError(error);
  }, [error]);

  const searchLocations = async (searchTerm: string) => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    
    setLoading(true);
    try {
      const results = await predictionApi.searchLocations(searchTerm);
      setSuggestions(results);
      setShowDropdown(true);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setInternalError(undefined);
    
    if (selectedLocation) {
      setSelectedLocation(null);
      onLocationSelect(null);
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (value.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        searchLocations(value);
      }, 500);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (location: any) => {
    const newSelection = {
      name: location.formatted || location.name,
      latitude: location.latitude,
      longitude: location.longitude
    };
    setSelectedLocation(newSelection);
    setQuery(newSelection.name);
    setShowDropdown(false);
    onLocationSelect(newSelection);
  };

  const clearSelection = () => {
    setQuery('');
    setSelectedLocation(null);
    setSuggestions([]);
    onLocationSelect(null);
  };

  const baseInputClass = `w-full pl-10 pr-10 py-2.5 border rounded-lg outline-none transition-colors ${
    internalError ? 'border-red-500 focus:border-red-500 bg-red-50/30 ring-1 ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
  }`;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Assessment Location</label>
      <p className="text-xs text-gray-500 mb-2">Search a forest, park, region or location...</p>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 ${internalError ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
          placeholder="🔍 Search for a location..."
          className={baseInputClass}
          autoComplete="off"
        />

        {query && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {internalError && (
        <p className="text-red-500 text-xs mt-1 font-medium">{internalError}</p>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center p-4 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-sm">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  className="px-4 py-3 hover:bg-orange-50 cursor-pointer flex items-start gap-3 border-b border-gray-50 last:border-0 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{suggestion.name}</span>
                    <span className="text-xs text-gray-500">
                      {[suggestion.state, suggestion.country].filter(Boolean).join(', ') || `${suggestion.latitude.toFixed(4)}, ${suggestion.longitude.toFixed(4)}`}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-sm text-gray-500 text-center flex flex-col items-center">
              <AlertCircle className="w-5 h-5 text-gray-400 mb-1" />
              No locations found. Try a different search term.
            </div>
          ) : null}
        </div>
      )}

      {selectedLocation && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100 flex items-start gap-3 animate-fade-in-up">
          <div className="bg-green-100 p-1 rounded-full flex-shrink-0">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-green-800 uppercase tracking-wide">Selected Location</span>
            <span className="text-sm font-medium text-gray-900 mt-0.5">{selectedLocation.name}</span>
            <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Coordinates: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
