// Dedicated authentic Indian Astrologer portraits faithfully crafted from
// the user's uploaded "Our Mystical Astrologers Roster" image.
// Strictly maintains existing app names and matches male/female with Tarot cards for Tarot readers.

export interface AstrologerPortraitStyle {
  id: string;
  gender: 'male' | 'female';
  isTarot: boolean;
  bgType: 'temple' | 'library' | 'zodiac_cosmic' | 'indoor_garden' | 'amethyst_mystic' | 'warm_sanctum';
  primaryColor: string;
  secondaryColor?: string;
  hasTilak: boolean;
  tilakColor?: string;
  tilakStyle?: 'tripundra' | 'sindoor' | 'chandan';
  hasGlasses: boolean;
  hasBeard: boolean;
  hasRudraksha: boolean;
  hasBindi: boolean;
  bindiColor?: string;
  hasJhumka: boolean;
  tarotCards?: string[];
  attireDescription: string;
}

export const ASTROLOGER_PORTRAIT_STYLES: Record<string, AstrologerPortraitStyle> = {
  // exp-kuldeep: Kuldeep (Male, Vedic Astrologer & Tarot Master)
  'exp-kuldeep': {
    id: 'exp-kuldeep',
    gender: 'male',
    isTarot: true,
    bgType: 'zodiac_cosmic',
    primaryColor: '#D97706', // Royal saffron-gold silk kurta
    secondaryColor: '#B45309', // Auspicious borders
    hasTilak: true,
    tilakColor: '#DC2626',
    tilakStyle: 'sindoor',
    hasGlasses: false,
    hasBeard: true,
    hasRudraksha: true,
    hasBindi: false,
    hasJhumka: false,
    tarotCards: ['THE SUN', 'THE LOVERS', 'WHEEL'],
    attireDescription: 'Royal saffron-gold silk kurta with sacred tilak, rudraksha, and mystic tarot cards'
  },

  // exp-1: Acharya Devdutt Shastri (Male, Vedic Senior)
  // Matched to Male Row 2, Col 3 (Deepak Rathi style in reference)
  'exp-1': {
    id: 'exp-1',
    gender: 'male',
    isTarot: false,
    bgType: 'temple',
    primaryColor: '#F5E6CC', // Cream/gold silk kurta
    secondaryColor: '#D97706', // Embroidered festive angavastram
    hasTilak: true,
    tilakColor: '#DC2626',
    tilakStyle: 'sindoor',
    hasGlasses: false,
    hasBeard: true,
    hasRudraksha: true,
    hasBindi: false,
    hasJhumka: false,
    attireDescription: 'Traditional cream silk kurta with gold border and festive embroidered angavastram'
  },

  // exp-2: Tarot Radhika Sen (Female, Tarot Master & Love Healer)
  // Matched to Female Row 3, Col 1 (Priya Desai style in reference)
  // SKILL IS TAROT -> PROMINENT TAROT CARDS HELD IN HAND
  'exp-2': {
    id: 'exp-2',
    gender: 'female',
    isTarot: true,
    bgType: 'amethyst_mystic',
    primaryColor: '#86198F', // Elegant lavender/purple traditional dress
    secondaryColor: '#FFD700', // Gold necklace
    hasTilak: false,
    hasGlasses: false,
    hasBeard: false,
    hasRudraksha: false,
    hasBindi: true,
    bindiColor: '#DC2626',
    hasJhumka: true,
    tarotCards: ['THE SUN', 'THE STAR', 'THE LOVERS'],
    attireDescription: 'Royal lavender dress with gold jewelry holding radiant Tarot cards'
  },

  // exp-3: Dr. Meenakshi Iyer (Female, KP & Corporate Career)
  // Matched to Female Row 3, Col 3 (Neha Kapoor style in reference)
  'exp-3': {
    id: 'exp-3',
    gender: 'female',
    isTarot: false,
    bgType: 'zodiac_cosmic',
    primaryColor: '#0F766E', // Forest teal/green traditional dress
    secondaryColor: '#F59E0B',
    hasTilak: false,
    hasGlasses: false,
    hasBeard: false,
    hasRudraksha: false,
    hasBindi: true,
    bindiColor: '#DC2626',
    hasJhumka: true,
    attireDescription: 'Forest teal silk dress with gold drop earrings and celestial backdrop'
  },

  // exp-4: Pandit Rameshwar Joshi (Male, Vedic Business Strategist)
  // Matched to Male Row 1, Col 2 (Rohit Mehta style in reference)
  'exp-4': {
    id: 'exp-4',
    gender: 'male',
    isTarot: false,
    bgType: 'warm_sanctum',
    primaryColor: '#F8FAFC', // Crisp white kurta
    secondaryColor: '#B45309', // Rudraksha mala
    hasTilak: false,
    hasGlasses: true, // Black-rimmed glasses
    hasBeard: true,
    hasRudraksha: true,
    hasBindi: false,
    hasJhumka: false,
    attireDescription: 'White ethnic kurta with stylish glasses and sacred Rudraksha mala'
  },

  // exp-5: Guru Anand Vats (Male, Relationship & Karmic Astrologer)
  // Matched to Male Row 2, Col 2 (Vikram Singh style in reference)
  'exp-5': {
    id: 'exp-5',
    gender: 'male',
    isTarot: false,
    bgType: 'zodiac_cosmic',
    primaryColor: '#1E1B4B', // Midnight navy blue kurta
    secondaryColor: '#F59E0B',
    hasTilak: true,
    tilakColor: '#DC2626',
    tilakStyle: 'sindoor',
    hasGlasses: false,
    hasBeard: true,
    hasRudraksha: false,
    hasBindi: false,
    hasJhumka: false,
    attireDescription: 'Navy blue kurta with red tilak and cosmic zodiac chart background'
  },

  // exp-6: Aarti Chopra (Female, Numerologist & Executive Career Coach)
  // Matched to Female Row 4, Col 2 (Pooja Sinha style in reference)
  'exp-6': {
    id: 'exp-6',
    gender: 'female',
    isTarot: false,
    bgType: 'indoor_garden',
    primaryColor: '#D97706', // Radiant mustard yellow silk kurti
    secondaryColor: '#FFD700',
    hasTilak: false,
    hasGlasses: false,
    hasBeard: false,
    hasRudraksha: false,
    hasBindi: true,
    bindiColor: '#DC2626',
    hasJhumka: true,
    attireDescription: 'Mustard yellow silk kurti with traditional gold jhumka earrings'
  },

  // exp-7: Sadhvi Priya Chaitanya (Female, Tarot Reader & Empath)
  // Matched to Female Row 4, Col 3 (Kavya Nair style in reference)
  // SKILL IS TAROT -> PROMINENT TAROT CARDS HELD IN HAND
  'exp-7': {
    id: 'exp-7',
    gender: 'female',
    isTarot: true,
    bgType: 'amethyst_mystic',
    primaryColor: '#A855F7', // Soft lilac/lavender traditional attire
    secondaryColor: '#FFD700',
    hasTilak: false,
    hasGlasses: false,
    hasBeard: false,
    hasRudraksha: false,
    hasBindi: true,
    bindiColor: '#DC2626',
    hasJhumka: true,
    tarotCards: ['THE MOON', 'THE STAR', 'THE HIGH PRIESTESS'],
    attireDescription: 'Lilac traditional attire holding glowing Tarot cards with amethyst crystals'
  },

  // exp-8: Acharya Kameshwar Nath (Male, Vedic Wealth Specialist)
  // Matched to Male Row 1, Col 3 (Karan Verma style in reference)
  'exp-8': {
    id: 'exp-8',
    gender: 'male',
    isTarot: false,
    bgType: 'zodiac_cosmic',
    primaryColor: '#0F172A', // Black high-neck kurta
    secondaryColor: '#991B1B', // Ornate printed stole/shawl
    hasTilak: true,
    tilakColor: '#DC2626',
    tilakStyle: 'tripundra',
    hasGlasses: false,
    hasBeard: true,
    hasRudraksha: true,
    hasBindi: false,
    hasJhumka: false,
    attireDescription: 'Black kurta with traditional printed Indian shawl and sacred tilak'
  },

  // exp-9: Astrologer Ananya Deshmukh (Female, Vedic Love Specialist)
  // Matched to Female Row 4, Col 4 (Diya Patel style in reference)
  'exp-9': {
    id: 'exp-9',
    gender: 'female',
    isTarot: false,
    bgType: 'warm_sanctum',
    primaryColor: '#991B1B', // Festive crimson red kurti with gold zari
    secondaryColor: '#FFD700',
    hasTilak: false,
    hasGlasses: false,
    hasBeard: false,
    hasRudraksha: false,
    hasBindi: true,
    bindiColor: '#DC2626',
    hasJhumka: true,
    attireDescription: 'Festive crimson red kurti with intricate gold zari embroidery and bindi'
  },

  // exp-10: Tarot Kabir Anand (Male, Tarot Master & Career Strategist)
  // Matched to Male Row 1, Col 1 (Arjun Sharma style in reference)
  // SKILL IS TAROT -> PROMINENT TAROT CARDS HELD IN HAND
  'exp-10': {
    id: 'exp-10',
    gender: 'male',
    isTarot: true,
    bgType: 'library',
    primaryColor: '#1E3A8A', // Deep navy blue bandhgala with orange pocket square
    secondaryColor: '#EA580C',
    hasTilak: false,
    hasGlasses: false,
    hasBeard: true,
    hasRudraksha: false,
    hasBindi: false,
    hasJhumka: false,
    tarotCards: ['THE MAGICIAN', 'WHEEL OF FORTUNE', 'THE EMPEROR'],
    attireDescription: 'Royal navy bandhgala with pocket square holding fanned Tarot cards'
  },

  // exp-11: Acharya Ramanujam Iyer (Male, KP Destiny Guru)
  // Matched to Male Row 1, Col 5 (Siddharth Kapoor style in reference)
  'exp-11': {
    id: 'exp-11',
    gender: 'male',
    isTarot: false,
    bgType: 'library',
    primaryColor: '#831843', // Deep maroon/wine kurta
    secondaryColor: '#FFD700',
    hasTilak: true,
    tilakColor: '#DC2626',
    tilakStyle: 'sindoor',
    hasGlasses: true, // Wireframe glasses
    hasBeard: true,
    hasRudraksha: false,
    hasBindi: false,
    hasJhumka: false,
    attireDescription: 'Deep maroon kurta with round wireframe glasses in classic study library'
  },

  // exp-12: Sunita Aggarwal (Female, Lal Kitab & Marital Peace)
  // Matched to Female Row 3, Col 4 (Riya Mehta style in reference)
  'exp-12': {
    id: 'exp-12',
    gender: 'female',
    isTarot: false,
    bgType: 'warm_sanctum',
    primaryColor: '#BE185D', // Vibrant magenta/pink kurti
    secondaryColor: '#FFD700',
    hasTilak: false,
    hasGlasses: false,
    hasBeard: false,
    hasRudraksha: false,
    hasBindi: true,
    bindiColor: '#DC2626',
    hasJhumka: true,
    attireDescription: 'Magenta pink kurti with gold zari neckline, bindi and warm maternal smile'
  },

  // exp-13: Pandit Rajeshwar Bhatt (Male, Kundli Milan Pandit)
  // Matched to Male Row 2, Col 5 (Tushar Malhotra style in reference)
  'exp-13': {
    id: 'exp-13',
    gender: 'male',
    isTarot: false,
    bgType: 'warm_sanctum',
    primaryColor: '#1D4ED8', // Royal bright blue kurta
    secondaryColor: '#E2E8F0', // Embroidered beige silk shawl
    hasTilak: true,
    tilakColor: '#DC2626',
    tilakStyle: 'sindoor',
    hasGlasses: false,
    hasBeard: true,
    hasRudraksha: true,
    hasBindi: false,
    hasJhumka: false,
    attireDescription: 'Royal blue kurta with embroidered beige silk shawl and sacred tilak'
  },

  // exp-14: Tarot Divya Singhania (Female, Angel Card & Soul Connection)
  // Matched to Female Row 3, Col 5 (Simran Kaur style in reference)
  // SKILL IS TAROT -> PROMINENT TAROT CARDS HELD IN HAND
  'exp-14': {
    id: 'exp-14',
    gender: 'female',
    isTarot: true,
    bgType: 'zodiac_cosmic',
    primaryColor: '#1E1B4B', // Royal midnight blue dress with gold embroidery
    secondaryColor: '#FFD700',
    hasTilak: false,
    hasGlasses: false,
    hasBeard: false,
    hasRudraksha: false,
    hasBindi: true,
    bindiColor: '#DC2626',
    hasJhumka: true,
    tarotCards: ['THE SUN', 'ANGEL OF LOVE', 'THE STAR'],
    attireDescription: 'Midnight blue traditional dress holding glowing Angel Tarot cards'
  }
};
