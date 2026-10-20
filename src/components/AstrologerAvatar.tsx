import React, { useState, useEffect } from 'react';
import { Expert } from '../types';
import { ASTROLOGER_PORTRAIT_STYLES, AstrologerPortraitStyle } from '../data/astrologerPortraits';

interface AstrologerAvatarProps {
  expert: Expert;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AstrologerAvatar: React.FC<AstrologerAvatarProps> = ({
  expert,
  size = 'md',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [expert.avatarUrl]);

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-base',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 text-lg'
  };

  // Get matching style from our authentic Indian astrologer roster (based on uploaded reference poster)
  const style: AstrologerPortraitStyle =
    ASTROLOGER_PORTRAIT_STYLES[expert.id] || {
      id: expert.id,
      gender: expert.gender || 'male',
      isTarot:
        expert.primaryCategory === 'tarot' ||
        expert.specialisations.some((s) => s.toLowerCase().includes('tarot')) ||
        expert.name.toLowerCase().includes('tarot'),
      bgType: 'temple',
      primaryColor: '#F5E6CC',
      secondaryColor: '#D97706',
      hasTilak: expert.gender !== 'female',
      hasGlasses: false,
      hasBeard: expert.gender !== 'female',
      hasRudraksha: true,
      hasBindi: expert.gender === 'female',
      hasJhumka: expert.gender === 'female',
      attireDescription: 'Traditional Indian Astrologer attire'
    };

  // Render Background accurately based on uploaded reference poster
  const renderBackground = () => {
    switch (style.bgType) {
      case 'zodiac_cosmic':
        // Deep royal midnight blue background with golden zodiac wheel and candle glow
        return (
          <g>
            <rect width="140" height="140" fill="#0C1427" />
            <circle cx="70" cy="52" r="44" stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" fill="none" opacity="0.35" />
            <circle cx="70" cy="52" r="32" stroke="#D97706" strokeWidth="0.8" fill="none" opacity="0.25" />
            {/* Zodiac constellation ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="70"
                y1="8"
                x2="70"
                y2="14"
                stroke="#FBBF24"
                strokeWidth="1"
                opacity="0.4"
                transform={`rotate(${deg} 70 52)`}
              />
            ))}
            {/* Stars */}
            <circle cx="20" cy="22" r="1.5" fill="#FFF" opacity="0.9" />
            <circle cx="120" cy="28" r="1.2" fill="#FFF" opacity="0.8" />
            <circle cx="128" cy="65" r="1" fill="#FBBF24" opacity="0.7" />
            <circle cx="14" cy="60" r="1" fill="#FBBF24" opacity="0.7" />
            {/* Candle on table */}
            <rect x="12" y="92" width="6" height="18" rx="1" fill="#FFFDE7" opacity="0.75" />
            <ellipse cx="15" cy="88" rx="2" ry="3.5" fill="#F59E0B" />
            <ellipse cx="15" cy="88" rx="1" ry="2" fill="#FEF08A" />
          </g>
        );

      case 'library':
        // Rich warm mahogany library with classic bookshelves & warm lamp
        return (
          <g>
            <rect width="140" height="140" fill="#24140D" />
            {/* Bookshelf wooden panels */}
            <rect x="0" y="15" width="40" height="70" fill="#3D2012" opacity="0.85" />
            <rect x="100" y="15" width="40" height="70" fill="#3D2012" opacity="0.85" />
            {/* Classic books vertical spines */}
            <rect x="6" y="24" width="6" height="38" fill="#881337" rx="0.5" />
            <rect x="13" y="20" width="7" height="42" fill="#78350F" rx="0.5" />
            <rect x="21" y="26" width="5" height="36" fill="#1E3A8A" rx="0.5" />
            <rect x="27" y="22" width="8" height="40" fill="#B45309" rx="0.5" />
            <rect x="106" y="24" width="7" height="38" fill="#14532D" rx="0.5" />
            <rect x="114" y="20" width="6" height="42" fill="#831843" rx="0.5" />
            <rect x="121" y="26" width="7" height="36" fill="#713F12" rx="0.5" />
            {/* Warm study lamp glow */}
            <circle cx="70" cy="45" r="45" fill="#FEF3C7" opacity="0.12" />
          </g>
        );

      case 'indoor_garden':
        // Lush green indoor foliage with warm natural lighting
        return (
          <g>
            <rect width="140" height="140" fill="#FEF9C3" />
            <rect width="140" height="140" fill="#FDE68A" opacity="0.4" />
            {/* Tropical plant leaves left */}
            <path d="M-5 70 C 15 50, 20 30, 10 15 C 2 30, -5 50, -5 70 Z" fill="#166534" opacity="0.85" />
            <path d="M5 80 C 25 60, 30 40, 25 25 C 15 40, 5 60, 5 80 Z" fill="#15803D" opacity="0.75" />
            {/* Tropical plant leaves right */}
            <path d="M145 70 C 125 50, 120 30, 130 15 C 138 30, 145 50, 145 70 Z" fill="#166534" opacity="0.85" />
            <path d="M135 80 C 115 60, 110 40, 115 25 C 125 40, 135 60, 135 80 Z" fill="#15803D" opacity="0.75" />
            {/* Soft sunlight aura */}
            <circle cx="70" cy="50" r="45" fill="#FFF" opacity="0.25" />
          </g>
        );

      case 'amethyst_mystic':
        // Mystical cosmic purple with glowing amethyst crystals & candlelight
        return (
          <g>
            <rect width="140" height="140" fill="#2E0854" />
            <circle cx="70" cy="48" r="45" fill="#A855F7" opacity="0.15" />
            {/* Glowing purple amethyst crystals on left */}
            <polygon points="12,105 16,80 20,105" fill="#C084FC" opacity="0.9" />
            <polygon points="8,105 12,88 16,105" fill="#9333EA" opacity="0.9" />
            <polygon points="18,105 22,86 26,105" fill="#E9D5FF" opacity="0.8" />
            {/* Candle right */}
            <rect x="122" y="90" width="7" height="20" rx="1" fill="#FFFDE7" opacity="0.8" />
            <ellipse cx="125.5" cy="86" rx="2.5" ry="4" fill="#F59E0B" />
            <ellipse cx="125.5" cy="86" rx="1.2" ry="2" fill="#FEF08A" />
            {/* Floating starlight */}
            <circle cx="28" cy="25" r="1.5" fill="#FFF" opacity="0.9" />
            <circle cx="115" cy="22" r="1.5" fill="#FFF" opacity="0.9" />
            <circle cx="125" cy="45" r="1" fill="#FFD700" opacity="0.8" />
          </g>
        );

      case 'warm_sanctum':
      default:
        // Warm consultation study with ambient lamp
        return (
          <g>
            <rect width="140" height="140" fill="#2A1B14" />
            <circle cx="70" cy="50" r="46" fill="#FDE68A" opacity="0.16" />
            {/* Table lamp warm shade on left */}
            <polygon points="10,48 24,48 27,62 7,62" fill="#FEF3C7" opacity="0.8" />
            <rect x="16" y="62" width="2" height="20" fill="#B45309" />
            <circle cx="17" cy="55" r="8" fill="#F59E0B" opacity="0.3" />
            {/* Subtle sacred mandala behind head */}
            <circle cx="70" cy="52" r="38" stroke="#F59E0B" strokeWidth="0.8" fill="none" opacity="0.2" strokeDasharray="2,2" />
          </g>
        );
    }
  };

  // Render Person (accurately representing the photo from the user's uploaded poster)
  const renderPerson = () => {
    if (style.gender === 'female') {
      // -------------------------------------------------------------
      // INDIAN FEMALE ASTROLOGER (Rows 3 & 4 of uploaded poster)
      // -------------------------------------------------------------
      return (
        <g>
          {/* Saree / Kurti Attire matching the uploaded image */}
          <path d="M20 140 C 20 96, 36 82, 70 82 C 104 82, 120 96, 120 140 Z" fill={style.primaryColor} />
          {/* Golden Zari embroidery / neckline */}
          <path d="M42 88 Q 70 106 98 88" stroke={style.secondaryColor || '#FFD700'} strokeWidth="3" fill="none" />
          <path d="M48 96 L74 140" stroke={style.secondaryColor || '#FFD700'} strokeWidth="2.5" opacity="0.8" />

          {/* Delicate Gold Necklace */}
          <path d="M58 84 Q 70 94 82 84" stroke="#FFD700" strokeWidth="1.2" fill="none" />
          <circle cx="70" cy="94" r="2" fill="#FFD700" />

          {/* Neck & Face - Warm Indian Skin Tone */}
          <path d="M60 74 L60 86 L80 86 L80 74 Z" fill="#BF7C3E" />
          <ellipse cx="70" cy="54" rx="19" ry="23" fill="#D2995C" />

          {/* Long dark wavy Indian hair cascading over shoulders (as seen in poster) */}
          <path d="M47 52 C 47 28, 93 28, 93 52 C 93 38, 82 32, 70 32 C 58 32, 47 38, 47 52 Z" fill="#1C1917" />
          <path d="M47 52 C 44 70, 42 88, 46 102 C 49 88, 51 70, 52 56 Z" fill="#1C1917" />
          <path d="M93 52 C 96 70, 98 88, 94 102 C 91 88, 89 70, 88 56 Z" fill="#1C1917" />

          {/* Auspicious Red Kumkum Bindi on forehead */}
          <circle cx="70" cy="46" r="2.2" fill={style.bindiColor || '#DC2626'} />
          <circle cx="70" cy="46" r="2.8" stroke="#FFD700" strokeWidth="0.6" fill="none" opacity="0.8" />

          {/* Expressive Indian Eyes & Warm Smile */}
          <path d="M57 52 Q 63 50 66 52" stroke="#292524" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M74 52 Q 77 50 83 52" stroke="#292524" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <ellipse cx="61.5" cy="55" rx="3.5" ry="2" fill="#FFF" />
          <circle cx="62" cy="55" r="1.5" fill="#2E1C0C" />
          <ellipse cx="78.5" cy="55" rx="3.5" ry="2" fill="#FFF" />
          <circle cx="78" cy="55" r="1.5" fill="#2E1C0C" />
          {/* Radiant warm smile */}
          <path d="M65 65 Q 70 69 75 65" stroke="#B71C1C" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Traditional Gold Jhumka Earrings */}
          {style.hasJhumka && (
            <g fill="#FFD700">
              <circle cx="47" cy="58" r="2.2" />
              <polygon points="45,60 49,60 47,64" />
              <circle cx="93" cy="58" r="2.2" />
              <polygon points="91,60 95,60 93,64" />
            </g>
          )}

          {/* FOR TAROT SPECIALISTS: FANNED OUT GLOWING TAROT CARDS HELD IN HAND */}
          {style.isTarot && (
            <g>
              {/* Hand holding cards */}
              <path d="M76 110 C 82 102, 92 102, 96 112 Z" fill="#D2995C" />
              <circle cx="86" cy="112" r="1.8" fill="#FFD700" /> {/* Gold ring */}

              {/* Tarot Card 1 (Left Tilted - Moon / Star) */}
              <g transform="translate(48, 86) rotate(-14)">
                <rect x="0" y="0" width="28" height="44" rx="3" fill="#FFFDE7" stroke="#FFD700" strokeWidth="1.4" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))" />
                <rect x="2.5" y="2.5" width="23" height="39" rx="2" fill="#2E0854" />
                <text x="14" y="9" fill="#FFE082" fontSize="4" fontWeight="bold" textAnchor="middle" fontFamily="serif">XVIII</text>
                {/* Crescent Moon Symbol */}
                <circle cx="14" cy="20" r="5.5" fill="#FFD54F" />
                <circle cx="16.5" cy="18.5" r="4.5" fill="#2E0854" />
                <text x="14" y="36" fill="#FFF9C4" fontSize="3.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">MOON</text>
              </g>

              {/* Tarot Card 2 (Center Upright - The Sun Card) */}
              <g transform="translate(64, 80) rotate(4)">
                <rect x="0" y="0" width="30" height="46" rx="3" fill="#FFFDE7" stroke="#FFD700" strokeWidth="1.6" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
                <rect x="2.5" y="2.5" width="25" height="41" rx="2" fill="#4A148C" />
                <text x="15" y="10" fill="#FFD700" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="serif">XIX</text>
                {/* Radiant Sun Symbol with Rays */}
                <circle cx="15" cy="22" r="6" fill="#FFD54F" />
                <path d="M15 12 L15 32 M5 22 L25 22 M8 15 L22 29 M8 29 L22 15" stroke="#FFA000" strokeWidth="1" />
                <polygon points="15,16 17,21 21,22 17,23 15,28 13,23 9,22 13,21" fill="#FFF9C4" />
                <text x="15" y="38" fill="#FFD700" fontSize="4" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">THE SUN</text>
              </g>

              {/* Tarot Card 3 (Right Tilted - The Star Card) */}
              <g transform="translate(84, 85) rotate(22)">
                <rect x="0" y="0" width="27" height="42" rx="3" fill="#FFFDE7" stroke="#FFD700" strokeWidth="1.4" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))" />
                <rect x="2.5" y="2.5" width="22" height="37" rx="2" fill="#1A0933" />
                <text x="13.5" y="9" fill="#FFE082" fontSize="4" fontWeight="bold" textAnchor="middle" fontFamily="serif">XVII</text>
                <polygon points="13.5,14 15,18 19,19.5 15,21 13.5,25 12,21 8,19.5 12,18" fill="#FFD54F" />
                <text x="13.5" y="34" fill="#FFF9C4" fontSize="3.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">STAR</text>
              </g>

              {/* Golden sparkles */}
              <polygon points="80,75 81.5,79 85,80 81.5,81 80,85 78.5,81 75,80 78.5,79" fill="#FFD700" />
            </g>
          )}
        </g>
      );
    }

    // -------------------------------------------------------------
    // INDIAN MALE ASTROLOGER (Rows 1 & 2 of uploaded poster)
    // -------------------------------------------------------------
    return (
      <g>
        {/* Kurta / Bandhgala Attire matching the uploaded image */}
        <path d="M20 140 C 20 94, 36 82, 70 82 C 104 82, 120 94, 120 140 Z" fill={style.primaryColor} />

        {/* Bandhgala Orange Pocket Square (as in Row 1, Col 1) */}
        {style.secondaryColor === '#EA580C' && (
          <polygon points="90,92 98,84 102,94" fill="#EA580C" />
        )}

        {/* Stole / Shawl / Angavastram (as in Row 1 Col 3 or Row 2 Col 3 or Row 2 Col 5) */}
        {style.secondaryColor && style.secondaryColor !== '#EA580C' && (
          <g>
            <path d="M30 96 Q 70 118 110 96" stroke={style.secondaryColor} strokeWidth="5.5" fill="none" strokeLinecap="round" />
            <path d="M30 96 Q 70 118 110 96" stroke="#FFD700" strokeWidth="0.8" fill="none" strokeDasharray="2,3" />
          </g>
        )}

        {/* Sacred Rudraksha Bead Mala (as in Row 1 Col 2 and Col 4) */}
        {style.hasRudraksha && (
          <g>
            <path d="M50 90 Q 70 116 90 90" stroke="#5D4037" strokeWidth="2.8" strokeDasharray="2,3" fill="none" />
            <circle cx="70" cy="110" r="3" fill="#4E342E" stroke="#FFD700" strokeWidth="0.6" />
          </g>
        )}

        {/* Neck & Face - Warm Indian Skin Tone */}
        <path d="M60 74 L60 86 L80 86 L80 74 Z" fill="#BA7A3A" />
        <ellipse cx="70" cy="55" rx="20" ry="24" fill="#C68642" />

        {/* Styled Dark Wavy Hair (as in poster) */}
        <path d="M48 49 C 48 27, 92 27, 92 49 C 92 37, 80 32, 70 32 C 60 32, 48 37, 48 49 Z" fill="#1C1B1B" />

        {/* Groomed Beard / Stubble (as in poster) */}
        {style.hasBeard && (
          <path d="M53 61 C 53 78, 87 78, 87 61 C 87 74, 80 77, 70 77 C 60 77, 53 74, 53 61 Z" fill="#1C1B1B" opacity="0.82" />
        )}

        {/* Stylish Glasses (as in Row 1 Col 2 Rohit Mehta & Col 5 Siddharth Kapoor) */}
        {style.hasGlasses && (
          <g stroke="#D4AF37" strokeWidth="1.3" fill="none">
            <rect x="55" y="52" width="12" height="8" rx="2" />
            <rect x="73" y="52" width="12" height="8" rx="2" />
            <line x1="67" y1="55" x2="73" y2="55" />
          </g>
        )}

        {/* Sacred Tilak on Forehead (as in Row 1 Col 3, Row 2 Col 2, Row 2 Col 3, Row 2 Col 4) */}
        {style.hasTilak && (
          <g>
            {style.tilakStyle === 'tripundra' ? (
              <g>
                <line x1="63" y1="41" x2="77" y2="41" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
                <line x1="62" y1="43.5" x2="78" y2="43.5" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
                <line x1="64" y1="46" x2="76" y2="46" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
                <circle cx="70" cy="43.5" r="2" fill={style.tilakColor || '#DC2626'} />
              </g>
            ) : (
              <g>
                <line x1="70" y1="38" x2="70" y2="47" stroke={style.tilakColor || '#DC2626'} strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="70" cy="43" r="1.8" fill="#FBBF24" />
              </g>
            )}
          </g>
        )}

        {/* Eyes & Kind Expressions */}
        <path d="M57 53 Q 63 51 66 53" stroke="#262626" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M74 53 Q 77 51 83 53" stroke="#262626" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <ellipse cx="61.5" cy="56" rx="3.5" ry="2" fill="#FFF" />
        <circle cx="62" cy="56" r="1.5" fill="#2E1C0C" />
        <ellipse cx="78.5" cy="56" rx="3.5" ry="2" fill="#FFF" />
        <circle cx="78" cy="56" r="1.5" fill="#2E1C0C" />
        <path d="M64 67 Q 70 70 76 67" stroke="#8D6E63" strokeWidth="1.6" fill="none" strokeLinecap="round" />

        {/* FOR TAROT SPECIALISTS: FANNED OUT GLOWING TAROT CARDS HELD IN HAND */}
        {style.isTarot && (
          <g>
            <path d="M75 110 C 82 102, 92 102, 96 112 Z" fill="#C68642" />
            <circle cx="86" cy="112" r="1.8" fill="#FFD700" /> {/* Gemstone ring */}

            {/* Tarot Card 1 (Left - The Magician) */}
            <g transform="translate(48, 86) rotate(-12)">
              <rect x="0" y="0" width="28" height="44" rx="3" fill="#FFFDE7" stroke="#FFD700" strokeWidth="1.4" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))" />
              <rect x="2.5" y="2.5" width="23" height="39" rx="2" fill="#1E1B4B" />
              <text x="14" y="9" fill="#FFE082" fontSize="4" fontWeight="bold" textAnchor="middle" fontFamily="serif">I</text>
              <path d="M9 19 Q11.5 16 14 19 Q16.5 22 19 19 Q16.5 16 14 19 Q11.5 22 9 19 Z" stroke="#FFD700" strokeWidth="1.2" fill="none" />
              <text x="14" y="36" fill="#FFF9C4" fontSize="3.2" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">MAGICIAN</text>
            </g>

            {/* Tarot Card 2 (Center - Wheel of Fortune) */}
            <g transform="translate(65, 80) rotate(5)">
              <rect x="0" y="0" width="30" height="46" rx="3" fill="#FFFDE7" stroke="#FFD700" strokeWidth="1.6" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
              <rect x="2.5" y="2.5" width="25" height="41" rx="2" fill="#311B92" />
              <text x="15" y="10" fill="#FFD700" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="serif">X</text>
              <circle cx="15" cy="22" r="6.5" stroke="#FFD700" strokeWidth="1.2" fill="none" />
              <circle cx="15" cy="22" r="2.8" fill="#FFD700" />
              <text x="15" y="38" fill="#FFD700" fontSize="3.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">WHEEL</text>
            </g>

            {/* Tarot Card 3 (Right - The Emperor) */}
            <g transform="translate(85, 85) rotate(22)">
              <rect x="0" y="0" width="27" height="42" rx="3" fill="#FFFDE7" stroke="#FFD700" strokeWidth="1.4" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))" />
              <rect x="2.5" y="2.5" width="22" height="37" rx="2" fill="#1E3A8A" />
              <text x="13.5" y="9" fill="#FFE082" fontSize="4" fontWeight="bold" textAnchor="middle" fontFamily="serif">IV</text>
              <polygon points="9,22 10.5,16 13.5,19 16.5,16 18,22" fill="#FFD54F" />
              <text x="13.5" y="34" fill="#FFF9C4" fontSize="3.2" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">EMPEROR</text>
            </g>
          </g>
        )}
      </g>
    );
  };

  return (
    <div
      className={`relative shrink-0 rounded-2xl overflow-hidden bg-slate-900 border border-amber-200/90 shadow-2xs group ${sizeClasses[size]} ${className}`}
    >
      {expert.avatarUrl && !imageError ? (
        <img
          src={expert.avatarUrl}
          alt={`${expert.name} - Indian Astrologer`}
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      ) : (
        <svg viewBox="0 0 140 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {renderBackground()}
          {renderPerson()}
        </svg>
      )}
    </div>
  );
};
