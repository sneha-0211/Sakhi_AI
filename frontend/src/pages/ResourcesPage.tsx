import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SafetyResource } from '../types';
import {
  Search,
  BookOpen,
  Tag,
  CheckCircle2,
  ArrowRight,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<SafetyResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedResource, setSelectedResource] = useState<SafetyResource | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Bullying & Teasing',
    'Online Safety',
    'Personal Boundaries',
    'Communication',
    'Well-Being',
    'Friends & Relationships'
  ];

  useEffect(() => {
    let isMounted = true;
    api.getResources(searchQuery, selectedCategory === 'All' ? undefined : selectedCategory)
      .then((data) => {
        if (isMounted) {
          setResources(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('API resource fetch failed, fallback active:', err);
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [searchQuery, selectedCategory]);

  const getCategoryCover = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('online') || c.includes('cyber')) return '/images/cyber_security.jpg';
    if (c.includes('being') || c.includes('stress') || c.includes('emotion')) return '/images/mindfulness_calm.jpg';
    if (c.includes('friend') || c.includes('adult') || c.includes('comm') || c.includes('bound')) return '/images/trusted_adult.jpg';
    return '/images/safety_guides.jpg';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header with Featured Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sakhi-teal-50 text-sakhi-teal-800 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Knowledge & Self-Advocacy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900">
            Safety Resources & Guides
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Age-appropriate, non-judgmental guides on personal boundaries, online safety, exam stress, and speaking up.
          </p>
        </div>
        <div className="lg:col-span-4 hidden lg:block">
          <div className="relative rounded-2xl overflow-hidden shadow-card border border-sakhi-teal-100 h-36">
            <img
              src="/images/safety_guides.jpg"
              alt="Knowledge and Student Empowerment"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-3 text-xs text-white font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Evidence-based guidance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="space-y-4">
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides by keyword (e.g. rumors, Instagram, boundaries, panic)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-soft focus:outline-none focus:ring-2 focus:ring-sakhi-teal-400 text-sm text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'highlight-teal shadow-md scale-105'
                  : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-sakhi-teal-50 hover:border-sakhi-teal-200 hover:text-sakhi-teal-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res) => (
          <div
            key={res.id}
            className="group overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between hover:shadow-card transition-shadow"
          >
            <div>
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                  src={getCategoryCover(res.category)}
                  alt={res.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-sakhi-teal-800/90 backdrop-blur-xs px-2.5 py-1 rounded-md">
                    {res.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">
                  {res.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-3">
                  {res.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={() => setSelectedResource(res)}
                className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sakhi-teal-700 hover:text-sakhi-teal-800"
              >
                <span>Read Full Guide & Tips</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-sakhi-teal-700 bg-sakhi-teal-50 px-2.5 py-0.5 rounded-md">
                  {selectedResource.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 leading-snug">
                  {selectedResource.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed space-y-3">
              <p>{selectedResource.content}</p>
            </div>

            {/* Actionable Tips */}
            <div className="p-5 rounded-2xl bg-sakhi-teal-50/60 border border-sakhi-teal-100 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sakhi-teal-600" />
                <span>Actionable Steps & Tips:</span>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-slate-800">
                {selectedResource.actionable_tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sakhi-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800"
              >
                Done Reading
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
