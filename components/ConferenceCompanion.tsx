import React, { useState } from 'react';
import { AcademicEvent, ScholarProfile } from '../types';
import {
  Calendar, MapPin, ExternalLink, Users, Search, Filter,
  ChevronRight, Tag, Globe, Clock, Star, CheckCircle2, X
} from 'lucide-react';

interface ConferenceCompanionProps {
  events: AcademicEvent[];
  scholars: ScholarProfile[];
  currentUser: ScholarProfile | null;
  onBack: () => void;
}

export const ConferenceCompanion: React.FC<ConferenceCompanionProps> = ({
  events,
  scholars,
  currentUser,
  onBack,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [attendingEvents, setAttendingEvents] = useState<Set<string>>(new Set());

  const allTopics = Array.from(new Set(events.flatMap(e => e.topics)));

  const filteredEvents = events.filter(e => {
    const matchesSearch = !searchQuery ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = !filterTopic || e.topics.includes(filterTopic);
    return matchesSearch && matchesTopic;
  });

  const toggleAttending = (eventId: string) => {
    setAttendingEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const getEventMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('default', { month: 'short' }).toUpperCase();
  };

  const getEventDay = (dateStr: string) => {
    return new Date(dateStr).getDate();
  };

  const getEventYear = (dateStr: string) => {
    return new Date(dateStr).getFullYear();
  };

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) >= new Date();
  };

  // Attendees for selected event (mock: scholars with matching topics)
  const eventAttendees = selectedEvent
    ? scholars.filter(s =>
        s.researchInterests.some(i => selectedEvent.topics.includes(i))
      ).slice(0, 8)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Academic Events</h1>
        <p className="text-slate-500 mt-1">Discover conferences, workshops, and seminars. See who's attending before you go.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT: Event List */}
        <div className="lg:col-span-5 space-y-4">

          {/* Search & Filter */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search events or locations..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterTopic('')}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  !filterTopic ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-300 hover:border-primary'
                }`}
              >
                All Topics
              </button>
              {allTopics.slice(0, 6).map(topic => (
                <button
                  key={topic}
                  onClick={() => setFilterTopic(filterTopic === topic ? '' : topic)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    filterTopic === topic ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-300 hover:border-primary'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Event Cards */}
          <div className="space-y-3">
            {filteredEvents.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No events found</p>
              </div>
            )}
            {filteredEvents.map(event => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`bg-white rounded-xl border shadow-sm p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/40 ${
                  selectedEvent?.id === event.id ? 'border-primary ring-1 ring-primary/20' : 'border-slate-200'
                }`}
              >
                <div className="flex gap-4">
                  {/* Date Badge */}
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-center ${
                    isUpcoming(event.date) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{getEventMonth(event.date)}</span>
                    <span className="text-xl font-bold leading-none">{getEventDay(event.date)}</span>
                    <span className="text-[10px] opacity-80">{getEventYear(event.date)}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">{event.name}</h3>
                      {attendingEvents.has(event.id) && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.topics.slice(0, 3).map(t => (
                        <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Event Detail */}
        <div className="lg:col-span-7">
          {!selectedEvent ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col items-center justify-center py-20 text-center px-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Select an Event</h3>
              <p className="text-slate-500 text-sm max-w-xs">Click on any event to see details, attendees, and schedule meetings with researchers.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Event Hero */}
              <div className="bg-gradient-to-br from-primary to-blue-700 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white" />
                  <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-white" />
                </div>
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold leading-snug mb-2">{selectedEvent.name}</h2>
                      <div className="flex items-center gap-4 text-blue-100 text-sm">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-blue-100 text-sm mt-1">
                        <MapPin className="w-4 h-4" />
                        {selectedEvent.location}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleAttending(selectedEvent.id)}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        attendingEvents.has(selectedEvent.id)
                          ? 'bg-white text-primary'
                          : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                      }`}
                    >
                      {attendingEvents.has(selectedEvent.id) ? '✓ Attending' : '+ Attend'}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedEvent.topics.map(t => (
                      <span key={t} className="px-2.5 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Description */}
                {selectedEvent.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">About</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedEvent.description}</p>
                  </div>
                )}

                {/* Website */}
                {selectedEvent.websiteUrl && (
                  <a
                    href={selectedEvent.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Conference Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {/* Attendees */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-700">
                      Researchers Attending ({eventAttendees.length})
                    </h4>
                    <span className="text-xs text-slate-400">Based on research alignment</span>
                  </div>

                  {eventAttendees.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No attendees found for this event yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {eventAttendees.map(scholar => (
                        <div key={scholar.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-primary/30 hover:bg-slate-50 transition-colors">
                          <img
                            src={scholar.avatarUrl}
                            alt={scholar.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{scholar.name}</p>
                            <p className="text-xs text-slate-500 truncate">{scholar.university.name}</p>
                          </div>
                          <button className="flex-shrink-0 px-2.5 py-1 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-white transition-colors">
                            Meet
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
