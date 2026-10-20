import React, { useState, useMemo } from 'react';
import { 
  Star, 
  ArrowRight, 
  X, 
  Search 
} from 'lucide-react';
import { ALL_55_CLIENT_REVIEWS } from '../data/reviewsData';

export const CustomerReviewsSection: React.FC = () => {
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Initial 5 reviews shown on screen (Curated blend of Hinglish, Hindi, and English)
  const initialFiveReviews = useMemo(() => {
    return ALL_55_CLIENT_REVIEWS.slice(0, 5);
  }, []);

  // Filtered reviews for the "View All" modal
  const filteredModalReviews = useMemo(() => {
    return ALL_55_CLIENT_REVIEWS.filter((rev) => {
      const matchesSearch = 
        rev.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.userLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.expertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.consultationType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rev.language && rev.language.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedFilter === 'All') return true;
      if (selectedFilter === 'Hinglish') return rev.language === 'Hinglish';
      if (selectedFilter === 'Hindi') return rev.language === 'Hindi';
      if (selectedFilter === 'English') return rev.language === 'English';
      if (selectedFilter === 'Love') {
        return rev.consultationType.toLowerCase().includes('love') || 
               rev.consultationType.toLowerCase().includes('marriage') ||
               rev.consultationType.toLowerCase().includes('healing');
      }
      if (selectedFilter === 'Career') {
        return rev.consultationType.toLowerCase().includes('career') || 
               rev.consultationType.toLowerCase().includes('business') ||
               rev.consultationType.toLowerCase().includes('job') ||
               rev.consultationType.toLowerCase().includes('wealth');
      }
      return true;
    });
  }, [searchQuery, selectedFilter]);

  // Helper for language badge styling
  const getLanguageBadge = (lang?: string) => {
    if (lang === 'Hindi') {
      return (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
          हिंदी
        </span>
      );
    }
    if (lang === 'Hinglish') {
      return (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
          Hinglish
        </span>
      );
    }
    return (
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
        English
      </span>
    );
  };

  return (
    <section id="reviews" className="py-6 sm:py-8 bg-[#FFFDF7] border-b border-amber-200/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Compact Header with View All Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 rounded-full mb-1.5 shadow-2xs">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>4.95★ Rated</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif-cinzel tracking-tight">
              Trusted by 10,000+ Seekers
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Verified astrological feedback in Hinglish, हिंदी, and English.
            </p>
          </div>

          {/* View All Button on screen without numbers */}
          <button
            onClick={() => setIsAllReviewsModalOpen(true)}
            className="self-start sm:self-auto px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold text-xs rounded-lg shadow-2xs hover:shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>View All Reviews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Reviews on Screen - Compact 5-column grid on desktop, each with 2 lines of comment in Hinglish, Hindi, and English */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {initialFiveReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl border border-amber-200/90 hover:border-amber-400 p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all duration-150"
            >
              <div>
                {/* Top: Stars + Language Badge + Consultation tag */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {getLanguageBadge(rev.language)}
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 truncate max-w-[90px]">
                      {rev.consultationType}
                    </span>
                  </div>
                </div>

                {/* 2 Lines only comment */}
                <p 
                  className="text-xs text-slate-700 leading-snug italic line-clamp-2 min-h-[2.5rem]" 
                  title={rev.comment}
                >
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Bottom: User Info & Astrologer */}
              <div className="pt-2 mt-2 border-t border-amber-100 flex items-center justify-between text-[11px]">
                <div className="min-w-0 pr-1">
                  <h4 className="font-bold text-slate-900 truncate leading-tight">{rev.userName}</h4>
                  <span className="text-[10px] text-slate-500 block truncate">{rev.userLocation} • {rev.timeAgo}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] text-slate-400 block leading-none">Consulted</span>
                  <span className="font-semibold text-amber-800 text-[10px] block truncate max-w-[95px]">{rev.expertName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ALL 55 REVIEWS MODAL */}
      {isAllReviewsModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsAllReviewsModalOpen(false)}
        >
          <div 
            className="bg-[#FFFDF7] w-full max-w-5xl max-h-[90vh] rounded-2xl border border-amber-300 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 via-white to-orange-50 border-b border-amber-200/90 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider">
                    All Reviews
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif-cinzel">
                    Verified Client Experiences
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Browse real reviews in Hinglish, हिंदी, and English.
                </p>
              </div>

              <button
                onClick={() => setIsAllReviewsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-amber-200 hover:bg-amber-100 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-3 sm:p-4 border-b border-amber-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, city, or question..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {/* Language & Category Filters */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {[
                  { label: 'All', val: 'All' },
                  { label: 'Hinglish', val: 'Hinglish' },
                  { label: 'हिंदी (Hindi)', val: 'Hindi' },
                  { label: 'English', val: 'English' },
                  { label: 'Love & Relationship', val: 'Love' },
                  { label: 'Career & Wealth', val: 'Career' }
                ].map((f) => (
                  <button
                    key={f.val}
                    onClick={() => setSelectedFilter(f.val)}
                    className={`px-2.5 py-1 text-xs rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedFilter === f.val
                        ? 'bg-amber-600 text-white font-bold shadow-2xs'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/80'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Reviews Grid (All 55 Reviews) */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 max-h-[60vh]">
              {filteredModalReviews.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No reviews match your search. Try another language or keyword.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredModalReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white rounded-xl border border-amber-200 p-3.5 flex flex-col justify-between shadow-2xs hover:border-amber-400 transition-all"
                    >
                      <div>
                        {/* Rating + Language + Consultation Type */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            {getLanguageBadge(rev.language)}
                            <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 truncate max-w-[120px]">
                              {rev.consultationType}
                            </span>
                          </div>
                        </div>

                        {/* 2-line comment */}
                        <p className="text-xs text-slate-700 leading-snug italic line-clamp-2 min-h-[2.5rem]">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>

                      {/* User Info */}
                      <div className="pt-2 mt-2 border-t border-amber-100 flex items-center justify-between text-[11px]">
                        <div>
                          <h4 className="font-bold text-slate-900 truncate leading-tight">{rev.userName}</h4>
                          <span className="text-[10px] text-slate-500 block">{rev.userLocation} • {rev.timeAgo}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 block leading-none">Consulted</span>
                          <span className="font-semibold text-amber-800 text-[10px] block truncate max-w-[100px]">{rev.expertName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 px-5 bg-amber-50/70 border-t border-amber-200/80 flex items-center justify-between text-xs text-slate-600">
              <span className="text-amber-900 font-medium">
                Showing {filteredModalReviews.length} verified reviews
              </span>
              <button
                onClick={() => setIsAllReviewsModalOpen(false)}
                className="px-4 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-md border border-amber-300 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
