import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Calendar, MapPin, FileText, Loader, Clock, X } from 'lucide-react';
import api from '../services/api';

// Utility: Save search to recent searches
const saveRecentSearch = (query) => {
  if (!query || query.trim().length === 0) return;
  
  try {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const filtered = recent.filter(q => q.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save recent search:', error);
  }
};

// Utility: Get recent searches
const getRecentSearches = () => {
  try {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
  } catch (error) {
    return [];
  }
};

// Utility: Clear recent searches
const clearRecentSearches = () => {
  try {
    localStorage.removeItem('recentSearches');
  } catch (error) {
    console.error('Failed to clear recent searches:', error);
  }
};

// Utility: Highlight matching text
const highlightText = (text, query) => {
  if (!query || !text) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 font-semibold">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState({
    amenities: [],
    announcements: [],
    bookings: []
  });
  const [counts, setCounts] = useState({
    amenities: 0,
    announcements: 0,
    bookings: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const debounceTimerRef = useRef(null);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (query.trim()) {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Set new timer for 300ms
      debounceTimerRef.current = setTimeout(() => {
        performSearch(query);
        saveRecentSearch(query);
        setRecentSearches(getRecentSearches());
      }, 300);
    }
    
    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(response.data.results);
      setCounts(response.data.counts);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearchClick = (search) => {
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  const handleClearRecentSearches = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const totalResults = counts.amenities + counts.announcements + counts.bookings;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Pending Approval': 'bg-yellow-100 text-yellow-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Rejected': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getImportanceColor = (importance) => {
    const colors = {
      'Urgent': 'bg-red-100 text-red-800',
      'High': 'bg-orange-100 text-orange-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-gray-100 text-gray-800'
    };
    return colors[importance] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SearchIcon className="w-8 h-8 text-[#4A7C59]" />
            <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
          </div>
          {query && (
            <p className="text-gray-600">
              Showing results for <span className="font-semibold text-gray-900">"{query}"</span>
              {!loading && ` - ${totalResults} result${totalResults !== 1 ? 's' : ''} found`}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-12 h-12 text-[#4A7C59] animate-spin mb-4" />
            <p className="text-gray-600">Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* No Query - Show Recent Searches */}
        {!query && !loading && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Searching</h3>
              <p className="text-gray-600">Enter a search term in the search bar above to find amenities, announcements, and bookings.</p>
            </div>
            
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#4A7C59]" />
                    Recent Searches
                  </h3>
                  <button
                    onClick={handleClearRecentSearches}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(search)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {!loading && query && totalResults === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">We couldn't find anything matching "{query}". Try different keywords.</p>
          </div>
        )}

        {!loading && query && totalResults > 0 && (
          <div className="space-y-8">
            {/* Amenities Section */}
            {counts.amenities > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#4A7C59]" />
                  Amenities ({counts.amenities})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      onClick={() => navigate('/amenities')}
                      className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{highlightText(amenity.name, query)}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{highlightText(amenity.description, query)}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Capacity: {amenity.capacity}</span>
                        <span>₱{amenity.hourly_rate}/hour</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Announcements Section */}
            {counts.announcements > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#4A7C59]" />
                  Announcements ({counts.announcements})
                </h2>
                <div className="space-y-3">
                  {results.announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      onClick={() => navigate('/announcements')}
                      className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{highlightText(announcement.title, query)}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(announcement.importance)}`}>
                          {announcement.importance}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{highlightText(announcement.description, query)}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">{highlightText(announcement.category, query)}</span>
                        <span>{formatDate(announcement.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bookings Section */}
            {counts.bookings > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#4A7C59]" />
                  Your Bookings ({counts.bookings})
                </h2>
                <div className="space-y-3">
                  {results.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => navigate('/your-bookings')}
                      className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{highlightText(booking.amenity_type, query)}</h3>
                          <p className="text-sm text-gray-600">{highlightText(booking.purpose, query)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(booking.booking_date)}
                        </span>
                        <span>{booking.start_time} - {booking.end_time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
