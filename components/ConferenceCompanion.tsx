import React, { useState } from 'react';
import { Calendar, MapPin, Users, MessageSquare, Clock, Search, Filter, ArrowLeft, Check, X, Globe, Building, ExternalLink } from 'lucide-react';
import { AcademicEvent, ScholarProfile } from '../types';
import { Badge } from './Badge';

// Map of event locations to coordinates for OpenStreetMap
const EVENT_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  'Vancouver, Canada': { lat: 49.2827, lng: -123.1207 },
  'Leeds, UK': { lat: 53.4808, lng: -1.2426 },
  'Boston, USA': { lat: 42.3601, lng: -71.0589 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Paris, France': { lat: 48.8566, lng: 2.3522 },
  'London, UK': { lat: 51.5074, lng: -0.1278 },
};

interface ConferenceCompanionProps {
  events: AcademicEvent[];
  scholars: ScholarProfile[];
  currentUser?: ScholarProfile;
  onBack: () => void;
}

export const ConferenceCompanion: React.FC<ConferenceCompanionProps> = ({
  events,
  scholars,
  currentUser,
  onBack
}) => {
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'event'>('list');
  const [attendingEventIds, setAttendingEventIds] = useState<string[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledWith, setScheduledWith] = useState<ScholarProfile | null>(null);

  // Get scholars attending the selected event
  const getAttendingScholars = (eventId: string) => {
    return scholars.filter(s => 
      s.attendingEvents?.some(e => e.id === eventId)
    );
  };

  // Find matching scholars based on research interests overlap
  const findMatches = (targetScholar: ScholarProfile) => {
    if (!selectedEvent) return [];
    const targetInterests = new Set(targetScholar.researchInterests.map(i => i.toLowerCase()));
    
    return scholars.filter(s => {
      if (s.id === targetScholar.id) return false;
      if (!s.attendingEvents?.some(e => e.id === selectedEvent.id)) return false;
      
      const overlap = s.researchInterests.filter(i => 
        targetInterests.has(i.toLowerCase())
      );
      return overlap.length > 0;
    });
  };

  const handleToggleAttendance = (eventId: string) => {
    setAttendingEventIds(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleScheduleMeeting = (scholar: ScholarProfile) => {
    setScheduledWith(scholar);
    setShowScheduleModal(true);
  };

  // Render event card
  const renderEventCard = (event: AcademicEvent) => {
    const isAttending = attendingEventIds.includes(event.id);
    const attendeeCount = scholars.filter(s => 
      s.attendingEvents?.some(e => e.id === event.id)
    ).length;

    return (
      <div 
        key={event.id}
        onClick={() => {
          setSelectedEvent(event);
          setViewMode('event');
        }}
        className="bg-white rounded-xl border border-slate-200 p-5 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">
              {event.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
            </div>
          </div>
          {isAttending && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
              <Check className="w-3 h-3" /> Attending
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {event.topics.slice(0, 3).map(topic => (
            <span key={topic} className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-600">
              {topic}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="w-4 h-4" />
            <span>{attendeeCount} attendees</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleToggleAttendance(event.id);
            }}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              isAttending 
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            {isAttending ? 'Cancel' : 'Attend'}
          </button>
        </div>
      </div>
    );
  };

  // Render attendee card
  const renderAttendeeCard = (scholar: ScholarProfile) => {
    const matches = findMatches(scholar);
    
    return (
      <div 
        key={scholar.id}
        className="bg-white rounded-xl border border-slate-200 p-4 hover:border-primary/30 hover:shadow-md transition-all"
      >
        <div className="flex gap-4 mb-3">
          <img 
            src={scholar.avatarUrl} 
            alt={scholar.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 truncate">{scholar.name}</h4>
            <p className="text-sm text-slate-500 truncate">{scholar.university.name}</p>
            <div className="flex items-center gap-2 mt-1">
              {scholar.verified && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-medium">
                  ✓ Verified
                </span>
              )}
              <span className="text-xs text-slate-400">h-index: {scholar.hIndex}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {scholar.researchInterests.slice(0, 2).map(interest => (
            <span key={interest} className="px-2 py-0.5 text-[10px] rounded bg-primary/5 text-primary border border-primary/20">
              {interest}
            </span>
          ))}
        </div>

        {matches.length > 0 && (
          <div className="mb-3 p-2 rounded-lg bg-green-50 border border-green-100">
            <p className="text-xs font-medium text-green-700 mb-1">Research Alignment</p>
            <div className="flex flex-wrap gap-1">
              {matches.slice(0, 2).map(m => (
                <span key={m.id} className="text-[10px] text-green-600">
                  {m.name.split(' ')[1]} •
                </span>
              ))}
              <span className="text-[10px] text-green-600">
                +{matches.length - 2} more
              </span>
            </div>
          </div>
        )}

        <button 
          onClick={() => handleScheduleMeeting(scholar)}
          className="w-full py-2 rounded-lg bg-white border border-primary text-primary font-medium text-sm hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Schedule Meeting
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {viewMode === 'event' && (
                <button 
                  onClick={() => {
                    setViewMode('list');
                    setSelectedEvent(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-slate-900">Conference Companion</h1>
                <p className="text-sm text-slate-500">
                  {viewMode === 'list' 
                    ? 'Discover events and connect with attendees'
                    : selectedEvent?.name
                  }
                </p>
              </div>
            </div>
            
            {selectedEvent && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">
                  {getAttendingScholars(selectedEvent.id).length} attending
                </span>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Filter className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {viewMode === 'list' ? (
          // Event List View
          <div className="space-y-6">
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <h2 className="font-semibold text-slate-900 mb-2">Why use Conference Companion?</h2>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• See who's attending before you arrive</li>
                <li>• Filter by research interests to find collaborators</li>
                <li>• Schedule 1:1 meetings during the event</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Upcoming Conferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(renderEventCard)}
              </div>
            </div>
          </div>
        ) : (
          // Event Detail / Attendees View
          <div className="space-y-6">
            {/* Event Info - Enhanced with more details */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900">{selectedEvent?.name}</h2>
                  
                  {/* Event Details */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-medium">{selectedEvent?.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-medium">{selectedEvent?.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Globe className="w-5 h-5 text-primary" />
                      <a 
                        href={selectedEvent?.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        Official Website <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building className="w-5 h-5 text-primary" />
                      <span className="font-medium">Hosted by: {selectedEvent?.location.split(',')[0]} Conference Series</span>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                    {selectedEvent?.topics.map(topic => (
                      <span key={topic} className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => selectedEvent && handleToggleAttendance(selectedEvent.id)}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                      attendingEventIds.includes(selectedEvent?.id || '')
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-primary text-white hover:bg-primary-hover'
                    }`}
                  >
                    {attendingEventIds.includes(selectedEvent?.id || '') ? '✓ Attending' : 'Mark as Attending'}
                  </button>
                  <a 
                    href={selectedEvent?.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-lg font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                </div>
              </div>
            </div>

            {/* OpenStreetMap Integration */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Event Location
              </h3>
              <div className="relative h-64 rounded-lg overflow-hidden bg-slate-100">
                {/* OpenStreetMap Embed */}
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${(EVENT_LOCATIONS[selectedEvent?.location || '']?.lng || -0.1) - 0.05}%2C${(EVENT_LOCATIONS[selectedEvent?.location || '']?.lat || 51.5) - 0.05}%2C${(EVENT_LOCATIONS[selectedEvent?.location || '']?.lng || -0.1) + 0.05}%2C${(EVENT_LOCATIONS[selectedEvent?.location || '']?.lat || 51.5) + 0.05}&layer=mapnik&marker=${EVENT_LOCATIONS[selectedEvent?.location || '']?.lat || 51.5}%2C${EVENT_LOCATIONS[selectedEvent?.location || '']?.lng || -0.1}`}
                  style={{ border: 0 }}
                  title="Event Location Map"
                ></iframe>
                <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs text-slate-500">
                  © OpenStreetMap
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                📍 {selectedEvent?.location}
              </p>
            </div>

            {/* Attendees */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Attendees</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    placeholder="Filter by name or topic..."
                    className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getAttendingScholars(selectedEvent?.id || '').map(renderAttendeeCard)}
              </div>

              {getAttendingScholars(selectedEvent?.id || '').length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No attendees yet. Be the first to mark attendance!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && scheduledWith && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-900">Schedule Meeting</h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
              <img 
                src={scheduledWith.avatarUrl} 
                alt={scheduledWith.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-slate-900">{scheduledWith.name}</p>
                <p className="text-sm text-slate-500">{scheduledWith.university.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time</label>
                <input 
                  type="time" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Topic</label>
                <input 
                  placeholder="e.g., Discuss collaboration on X project"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
