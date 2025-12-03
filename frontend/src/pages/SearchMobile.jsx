import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Calendar, MapPin, FileText, Loader, ChevronRight } from 'lucide-react';
import api from '../services/api';

export default function SearchMobile() {
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

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    }
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <SearchIcon className="w-6 h-6 text-[#4A7C59]" />
          <h1 className="text-xl font-bold text-gray-900">Search Results</h1>
        </div>
        {query && (
          <p className="text-sm text-gray-600">
            Results for <span className="font-semibold text-gray-900">"{query}"</span>
            {!loading && ` (${totalResults})`}
          </p>
        )}
      </div>

      <div className="px-4 py-4">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="w-10 h-10 text-[#4A7C59] animate-spin mb-3" />
            <p className="text-gray-600 text-sm">Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* No Query */}
        {!query && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Searching</h3>
            <p className="text-sm text-gray-600">Enter a search term to find amenities, announcements, and bookings.</p>
          </div>
        )}

        {/* No Results */}
        {!loading && query && totalResults === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-sm text-gray-600">No matches for "{query}". Try different keywords.</p>
          </div>
        )}

        {/* Results */}
        {!loading && query && totalResults > 0 && (
          <div className="space-y-6">
            {/* Amenities Section */}
            {counts.amenities > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#4A7C59]" />
                  Amenities ({counts.amenities})
                </h2>
                <div className="space-y-2">
                  {results.amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      onClick={() => navigate('/amenities')}
                      className="bg-white rounded-lg shadow-sm p-4 active:bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-900 mb-1">{amenity.name}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{amenity.description}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>Capacity: {amenity.capacity}</span>
                            <span>₱{amenity.hourly_rate}/hr</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Announcements Section */}
            {counts.announcements > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#4A7C59]" />
                  Announcements ({counts.announcements})
                </h2>
                <div className="space-y-2">
                  {results.announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      onClick={() => navigate('/announcements')}
                      className="bg-white rounded-lg shadow-sm p-4 active:bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base font-semibold text-gray-900 flex-1">{announcement.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getImportanceColor(announcement.importance)}`}>
                          {announcement.importance}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{announcement.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">{announcement.category}</span>
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
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#4A7C59]" />
                  Your Bookings ({counts.bookings})
                </h2>
                <div className="space-y-2">
                  {results.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => navigate('/your-bookings')}
                      className="bg-white rounded-lg shadow-sm p-4 active:bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-900">{booking.amenity_type}</h3>
                          <p className="text-sm text-gray-600">{booking.purpose}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
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
