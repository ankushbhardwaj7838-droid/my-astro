import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Expert } from '../types';
import { AstrologerAvatar } from './AstrologerAvatar';

interface AstrologerCardProps {
  expert: Expert;
  onStartChat: (expert: Expert) => void;
  onViewProfile?: (expert: Expert) => void;
}

export const AstrologerCard: React.FC<AstrologerCardProps> = ({
  expert,
  onStartChat,
  onViewProfile
}) => {
  const isOnline = expert.availability === 'online';

  const formatOrders = (count: number) => {
    return count.toLocaleString();
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-amber-400 hover:shadow-lg transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between h-full group">
      {/* Top Section: Large Photo on Left, Aligned Details on Right */}
      <div className="flex items-start gap-3.5 sm:gap-4.5">
        {/* Left: Big Square Profile Photo with Rating Badge on the Lower Left */}
        <div className="relative shrink-0">
          <div 
            onClick={() => onViewProfile && onViewProfile(expert)}
            className="cursor-pointer group-hover:opacity-95 transition-opacity"
          >
            <AstrologerAvatar expert={expert} size="lg" />
          </div>

          {/* Rating Badge on the Left Side on the Lower Side */}
          <div className="absolute bottom-1.5 left-1.5 bg-[#eaf7ee] text-[#167d47] border border-[#bfe7cb] text-[11px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs z-10">
            <Star className="w-3 h-3 fill-[#167d47] text-[#167d47]" />
            <span>{expert.rating.toFixed(1)}</span>
          </div>

          {/* Online green indicator dot on Top Right */}
          {isOnline && (
            <span
              className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs z-10"
              title="Online"
            />
          )}
        </div>

        {/* Right: Astrologer Information - Perfectly Aligned */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <h3
              onClick={() => onViewProfile && onViewProfile(expert)}
              className="font-bold text-slate-900 text-base sm:text-lg md:text-xl hover:text-amber-700 transition-colors cursor-pointer truncate"
              title={expert.name}
            >
              {expert.name}
            </h3>
            <span title="Verified Astrologer">
              <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
            </span>
          </div>

          {/* Experience & Orders */}
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 flex items-center gap-1.5 flex-wrap">
            <span>{expert.experienceYears} yrs exp</span>
            <span className="text-slate-300">|</span>
            <span>{formatOrders(expert.ordersCount)} orders</span>
          </p>

          {/* Expertise / Speciality */}
          <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1.5 truncate" title={expert.specialisations.join(', ')}>
            {expert.specialisations.join(', ')}
          </p>

          {/* Languages */}
          <p className="text-xs text-slate-500 font-normal mt-1 truncate" title={expert.languages.join(', ')}>
            {expert.languages.join(', ')}
          </p>
        </div>
      </div>

      {/* Bottom Row: Price on Bottom-Left, Large Green-outlined Chat Button on Bottom-Right */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Price at Bottom-Left */}
        <div className="flex items-baseline gap-1.5">
          {expert.discountedPrice && (
            <span className="text-xs sm:text-sm text-slate-400 line-through font-mono">
              ₹{expert.pricePerMin}
            </span>
          )}
          <span className="text-base sm:text-lg font-bold text-[#c45500] font-mono">
            ₹{expert.discountedPrice || expert.pricePerMin}/min
          </span>
        </div>

        {/* Large Green-outlined Chat Button at Bottom-Right */}
        <button
          onClick={() => onStartChat(expert)}
          className="border-2 border-[#167d47] text-[#167d47] hover:bg-[#167d47] hover:text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-2 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
        >
          Chat
        </button>
      </div>
    </div>
  );
};
