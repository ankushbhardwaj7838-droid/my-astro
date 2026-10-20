import React from 'react';
import { Sparkles } from 'lucide-react';

interface ZodiacIconProps {
  sign: string;
  className?: string;
}

export const ZodiacSignLogo: React.FC<ZodiacIconProps> = ({ sign, className = "w-10 h-10" }) => {
  const normalized = sign.toLowerCase();

  switch (normalized) {
    case 'aries':
      // Olive/Gold Ram with curved spiral horns (#A3AB18 / #8D9914)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <g fill="#A8B020">
            {/* Left curled horn */}
            <path d="M44 32C41 24 33 16 23 18C13 20 8 30 11 41C13 49 20 54 28 53C34 52 38 46 36 40C34 34 27 33 23 37C20 40 21 44 24 45C22 43 21 40 23 37C26 33 32 35 33 39C34 44 30 49 25 49C19 49 14 44 14 38C14 29 20 22 28 22C36 22 42 27 44 34L44 32Z" />
            <path d="M43 32C38 21 27 15 17 21C8 26 6 38 12 47C16 53 23 55 29 53C35 50 38 43 35 37C32 32 26 33 23 36C21 38 22 42 25 43C22 42 21 39 24 36C27 33 32 34 33 38C34 43 30 48 25 48C18 48 12 43 12 35C12 25 19 18 29 18C38 18 43 25 45 33L43 32Z" />
            {/* Right curled horn */}
            <path d="M57 32C62 21 73 15 83 21C92 26 94 38 88 47C84 53 77 55 71 53C65 50 62 43 65 37C68 32 74 33 77 36C79 38 78 42 75 43C78 42 79 39 76 36C73 33 68 34 67 38C66 43 70 48 75 48C82 48 88 43 88 35C88 25 81 18 71 18C62 18 57 25 55 33L57 32Z" />
            {/* Head and muzzle */}
            <path d="M38 34C42 32 46 31 50 31C54 31 58 32 62 34C60 44 58 53 56 62C55 67 53 72 50 76C47 72 45 67 44 62C42 53 40 44 38 34Z" />
            <path d="M45 74C47 77 50 80 50 80C50 80 53 77 55 74C56 71 50 71 45 74Z" />
            {/* Ears */}
            <path d="M36 43C30 42 24 45 22 49C24 51 29 50 34 47L36 43Z" />
            <path d="M64 43C70 42 76 45 78 49C76 51 71 50 66 47L64 43Z" />
            {/* Horn details and forehead ridges */}
            <circle cx="50" cy="40" r="2.5" fill="#FFFDF7" opacity="0.3" />
            <path d="M45 52C47 50 53 50 55 52" stroke="#FFFDF7" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'taurus':
      // Red Bull head with sharp horns (#E52B38 / #D32F2F)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <g fill="#E52B38">
            {/* Left curved horn */}
            <path d="M35 34C31 23 27 12 30 5C32 14 36 24 43 32L35 34Z" />
            {/* Right curved horn */}
            <path d="M65 34C69 23 73 12 70 5C68 14 64 24 57 32L65 34Z" />
            {/* Bull ears */}
            <path d="M33 38C22 36 12 40 10 44C15 48 26 47 34 43L33 38Z" />
            <path d="M67 38C78 36 88 40 90 44C85 48 74 47 66 43L67 38Z" />
            {/* Main broad forehead & face */}
            <path d="M31 34C43 30 57 30 69 34C73 44 75 55 71 67C68 76 60 84 50 85C40 84 32 76 29 67C25 55 27 44 31 34Z" />
            {/* Horn ring accents */}
            <path d="M28 20C26 23 28 26 31 27" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M72 20C74 23 72 26 69 27" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
            {/* White face accents: Eyes & Muzzle shape */}
            <ellipse cx="39" cy="50" rx="2.5" ry="4" fill="#FFFDF7" />
            <ellipse cx="61" cy="50" rx="2.5" ry="4" fill="#FFFDF7" />
            <path d="M44 71C44 68 47 67 50 67C53 67 56 68 56 71C56 74 53 76 50 76C47 76 44 74 44 71Z" fill="#FFFDF7" />
            <circle cx="47.5" cy="71" r="1.2" fill="#E52B38" />
            <circle cx="52.5" cy="71" r="1.2" fill="#E52B38" />
          </g>
        </svg>
      );

    case 'gemini':
      // Blue Twin side profiles facing left (#0288D1 / #0083B0)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <g fill="#0288D1">
            {/* Back twin (right profile) */}
            <path opacity="0.85" d="M68 22C64 16 57 14 50 14C47 14 44 15 42 16C46 19 50 24 51 30C52 35 51 40 48 45C45 47 43 50 43 53C43 56 46 59 47 62C47 66 45 70 42 73C48 76 55 77 62 76C63 72 63 67 63 63C65 61 67 58 67 54C67 50 64 47 64 43C67 40 70 36 69 31C69 27 69 24 68 22Z" />
            {/* Front twin (left profile) */}
            <path d="M48 20C42 16 34 16 27 19C23 21 21 24 20 28C20 31 22 34 22 37C21 40 18 43 17 46C16 50 19 53 20 56C20 59 18 61 17 64C17 68 20 72 23 74C28 78 35 80 42 79C43 75 43 71 43 67C45 65 47 62 47 58C47 54 44 51 44 47C47 44 50 40 49 35C49 29 49 24 48 20Z" />
            {/* Stylized hair strands on front twin */}
            <path d="M26 21C30 18 36 17 41 19" stroke="#FFFDF7" strokeWidth="2" strokeLinecap="round" />
            <path d="M24 27C28 24 35 24 40 26" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M25 34C29 32 34 33 39 34" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
            {/* Back twin hair strands */}
            <path d="M48 18C52 15 58 15 63 17" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'cancer':
      // Brown/Bronze Crab with circular body, claws, and legs (#8D4925 / #7B3F00)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <g fill="#8D4925">
            {/* Round Central Shell */}
            <ellipse cx="50" cy="52" rx="20" ry="17" />
            <ellipse cx="50" cy="52" rx="16" ry="13" fill="#A0522D" />
            {/* Left Big Claw */}
            <path d="M35 43C31 36 28 25 36 17C43 11 49 18 46 25C44 29 39 33 36 39L35 43Z" />
            <path d="M30 29C25 24 28 17 33 16C37 15 37 20 33 24C31 26 31 28 30 29Z" />
            {/* Right Big Claw */}
            <path d="M65 43C69 36 72 25 64 17C57 11 51 18 54 25C56 29 61 33 64 39L65 43Z" />
            <path d="M70 29C75 24 72 17 67 16C63 15 63 20 67 24C69 26 69 28 70 29Z" />
            {/* Eyestalks */}
            <circle cx="44" cy="33" r="2.5" />
            <circle cx="56" cy="33" r="2.5" />
            {/* Left Side Walking Legs */}
            <path d="M32 49C24 48 16 52 13 60" stroke="#8D4925" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M31 56C23 57 17 63 16 71" stroke="#8D4925" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M33 63C26 67 22 75 23 83" stroke="#8D4925" strokeWidth="3.5" strokeLinecap="round" />
            {/* Right Side Walking Legs */}
            <path d="M68 49C76 48 84 52 87 60" stroke="#8D4925" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M69 56C77 57 83 63 84 71" stroke="#8D4925" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M67 63C74 67 78 75 77 83" stroke="#8D4925" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'leo':
      // Orange Lion head profile with flowing mane (#F57C00 / #FF7043)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <g fill="#F57C00">
            {/* Flowing Mane & Crown */}
            <path d="M52 14C38 14 26 22 21 34C19 39 18 45 20 50C16 50 12 53 11 57C10 61 13 65 17 66C15 70 17 76 21 78C25 80 29 78 32 76C34 81 39 84 44 84C49 84 53 81 55 77C59 81 65 82 70 79C75 76 77 70 76 65C80 64 84 60 84 55C84 50 81 46 77 44C80 39 80 32 76 27C72 21 64 16 56 14L52 14Z" />
            {/* Face silhouette cutout / highlights in lighter orange/cream */}
            <path d="M22 47C26 43 32 41 38 41C43 41 47 43 51 46C51 43 53 40 56 40C60 40 63 43 63 47C66 48 68 51 68 55C68 60 64 64 59 65C56 69 51 71 46 71C40 71 35 68 32 64C28 65 24 64 22 60C20 56 21 50 22 47Z" fill="#FFFDF7" opacity="0.15" />
            {/* Lion Muzzle profile */}
            <path d="M22 49C25 47 28 47 31 49C30 52 27 54 24 54C21 54 20 51 22 49Z" fill="#FFFDF7" />
            {/* Open Roar / Jaw */}
            <path d="M25 57C29 55 33 56 36 59C34 62 30 63 27 62C24 61 24 58 25 57Z" fill="#FFFDF7" />
            {/* Eye */}
            <circle cx="34" cy="45" r="2" fill="#FFFDF7" />
            {/* Stylized hair wisps */}
            <path d="M35 24C43 20 53 20 61 24" stroke="#FFFDF7" strokeWidth="2" strokeLinecap="round" />
            <path d="M42 30C49 27 57 28 64 32" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M48 37C55 35 62 37 68 42" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'virgo':
      // Magenta Maiden silhouette with flowing hair (#C2185B / #D81B60)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <g fill="#C2185B">
            {/* Flowing hair mass on right */}
            <path d="M48 16C38 16 32 24 33 34C30 36 29 40 29 44C27 46 25 49 26 52C28 53 30 53 31 55C31 59 34 63 36 67C33 70 31 74 32 78C33 82 38 84 42 83C47 82 51 79 55 75C60 70 65 63 67 56C71 47 71 36 67 27C63 20 56 16 48 16Z" />
            {/* Delicate Face Profile cut facing left */}
            <path d="M34 36C32 39 30 43 31 46C33 47 36 47 37 49C35 52 32 54 34 57C36 59 39 58 41 61C40 64 38 67 40 70C43 72 47 69 49 66C52 62 53 57 53 52C53 45 50 39 46 35C42 31 38 33 34 36Z" fill="#FFFDF7" opacity="0.25" />
            {/* Crown of hair curves */}
            <path d="M45 18C41 24 39 32 40 40" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M51 21C48 29 47 38 49 47" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M58 27C55 36 55 46 58 55" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M63 36C61 44 62 53 65 61" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'libra':
      // Blue Balance Scale (#1976D2 / #1565C0)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <g fill="#1976D2">
            {/* Center Pivot Top & Beam */}
            <path d="M50 17L53 22H65C73 22 80 23 81 25C80 27 73 28 65 28H53L51 32H49L47 28H35C27 28 20 27 19 25C20 23 27 22 35 22H47L50 17Z" />
            <circle cx="50" cy="18" r="3" />
            {/* Center Vertical Pointer */}
            <path d="M49 22H51V36H49V22Z" />
            {/* Left Pan Strings & Pan */}
            <path d="M26 27L14 56H38L26 27Z" fill="none" stroke="#1976D2" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M11 56C13 67 39 67 41 56H11Z" />
            {/* Right Pan Strings & Pan */}
            <path d="M74 27L62 56H86L74 27Z" fill="none" stroke="#1976D2" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M59 56C61 67 87 67 89 56H59Z" />
            {/* Base Stand & Pillar */}
            <path d="M48 36H52V76H48V36Z" />
            <path d="M38 76H62V82C62 83 60 84 59 84H41C40 84 38 83 38 82V76Z" />
          </g>
        </svg>
      );

    case 'scorpio':
      // Navy Blue Scorpion with segmented claws and stinger (#1A237E / #283593)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <g fill="#1A237E">
            {/* Body Segments */}
            <ellipse cx="50" cy="46" rx="9" ry="14" />
            {/* Left Big Pincer */}
            <path d="M43 38C38 32 30 25 31 16C37 12 43 18 41 24C39 28 36 32 41 36L43 38Z" />
            <path d="M29 22C24 18 27 12 32 12C36 12 35 17 31 20L29 22Z" />
            {/* Right Big Pincer */}
            <path d="M57 38C62 32 70 25 69 16C63 12 57 18 59 24C61 28 64 32 59 36L57 38Z" />
            <path d="M71 22C76 18 73 12 68 12C64 12 65 17 69 20L71 22Z" />
            {/* Walking Legs Left */}
            <path d="M42 45C34 44 26 47 24 54" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M42 51C33 52 27 57 26 64" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M43 57C36 60 31 66 32 73" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
            {/* Walking Legs Right */}
            <path d="M58 45C66 44 74 47 76 54" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M58 51C67 52 73 57 74 64" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M57 57C64 60 69 66 68 73" stroke="#1A237E" strokeWidth="2.5" strokeLinecap="round" />
            {/* Curved Segmented Tail Arching Up & Right */}
            <path d="M50 59C51 65 54 70 59 74C65 78 73 78 78 72C83 66 84 57 82 49C80 41 75 35 73 29C71 24 73 20 76 18C74 19 70 22 70 26C70 31 75 36 77 42C79 49 77 56 73 60C69 64 63 64 58 60L50 59Z" />
            {/* Stinger Tip */}
            <path d="M76 18C74 21 72 23 68 25C70 22 73 19 76 18Z" />
          </g>
        </svg>
      );

    case 'sagittarius':
      // Forest/Hunter Green Bow and Arrow (#1B5E20 / #2E7D32)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <g fill="#1B5E20" stroke="#1B5E20">
            {/* Curved Bow Stave */}
            <path d="M22 84C18 70 22 52 35 39C48 26 66 22 80 18" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Bow String */}
            <path d="M22 84L80 18" strokeWidth="1.5" strokeDasharray="none" />
            {/* Arrow Shaft (drawn through the center aiming up-right) */}
            <path d="M16 90L86 20" strokeWidth="3.5" strokeLinecap="round" />
            {/* Arrowhead */}
            <path d="M88 18L72 20L86 34L88 18Z" fill="#1B5E20" strokeWidth="1" />
            {/* Arrow Fletching */}
            <path d="M22 84L14 80M26 88L18 84M20 92L16 96" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'capricorn':
      // Deep Green Horned Goat head with beard (#146939 / #1B5E20)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <g fill="#146939">
            {/* Left curved ribbed horn */}
            <path d="M42 33C37 24 28 17 17 14C23 20 31 28 35 37L42 33Z" />
            <path d="M20 16C23 18 27 21 30 26" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M25 22C28 25 32 29 34 34" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
            {/* Right curved ribbed horn */}
            <path d="M58 33C63 24 72 17 83 14C77 20 69 28 65 37L58 33Z" />
            <path d="M80 16C77 18 73 21 70 26" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M75 22C72 25 68 29 66 34" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" />
            {/* Left Ear */}
            <path d="M36 41C25 40 16 46 13 52C20 54 30 51 36 46L36 41Z" />
            {/* Right Ear */}
            <path d="M64 41C75 40 84 46 87 52C80 54 70 51 64 46L64 41Z" />
            {/* Goat Head Shape */}
            <path d="M35 35C45 31 55 31 65 35C64 47 62 59 58 70C55 77 52 82 50 85C48 82 45 77 42 70C38 59 36 47 35 35Z" />
            {/* Pointed Beard */}
            <path d="M46 84C48 91 50 95 50 95C50 95 52 91 54 84L46 84Z" />
            {/* Eyes & Nostrils */}
            <ellipse cx="43" cy="53" rx="2.5" ry="4" fill="#FFFDF7" />
            <ellipse cx="57" cy="53" rx="2.5" ry="4" fill="#FFFDF7" />
            <ellipse cx="43" cy="53" rx="1.5" ry="1.5" fill="#146939" />
            <ellipse cx="57" cy="53" rx="1.5" ry="1.5" fill="#146939" />
          </g>
        </svg>
      );

    case 'aquarius':
      // Cobalt Blue Water Jug / Vase pouring water (#1D2E7B / #1A237E)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <g fill="#1D2E7B">
            {/* Amphora / Jug tilted at 45 degrees */}
            <path d="M58 24C62 20 68 22 72 27C76 32 75 39 70 43L63 49C65 53 66 59 63 65C59 71 52 74 46 72C40 70 37 64 38 58L46 50L58 24Z" />
            {/* Jug Rim / Mouth */}
            <ellipse cx="38" cy="58" rx="6" ry="10" transform="rotate(-40 38 58)" />
            {/* Jug Handle */}
            <path d="M68 32C76 36 78 47 72 54" stroke="#1D2E7B" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Flowing Water Streams cascading down-left */}
            <path d="M35 60C30 65 24 74 18 80C14 84 11 86 9 88" stroke="#1D2E7B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M38 64C32 70 27 77 22 84C18 88 15 90 12 92" stroke="#1D2E7B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M41 68C36 74 31 81 27 87C24 90 20 92 18 94" stroke="#1D2E7B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Jug highlight */}
            <path d="M57 32C61 36 62 44 59 50" stroke="#FFFDF7" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      );

    case 'pisces':
      // Deep Teal Two Fish swimming in circle (#16565C / #004D40)
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <g fill="#16565C">
            {/* Left fish swimming upward */}
            <path d="M44 26C35 28 26 36 24 46C22 55 26 65 34 71C38 74 42 75 46 74C41 68 38 60 39 51C40 42 45 34 52 28C49 26 46 26 44 26Z" />
            {/* Left fish tail fin */}
            <path d="M46 74C48 81 52 86 57 88C53 82 51 76 46 74Z" />
            <path d="M43 75C41 81 37 86 32 89C37 84 40 79 43 75Z" />
            {/* Left fish dorsal fin & eye */}
            <path d="M25 43C20 42 16 46 17 50C20 49 23 47 25 43Z" />
            <circle cx="43" cy="33" r="1.8" fill="#FFFDF7" />

            {/* Right fish swimming downward */}
            <path d="M56 74C65 72 74 64 76 54C78 45 74 35 66 29C62 26 58 25 54 26C59 32 62 40 61 49C60 58 55 66 48 72C51 74 54 74 56 74Z" />
            {/* Right fish tail fin */}
            <path d="M54 26C52 19 48 14 43 12C47 18 49 24 54 26Z" />
            <path d="M57 25C59 19 63 14 68 11C63 16 60 21 57 25Z" />
            {/* Right fish dorsal fin & eye */}
            <path d="M75 57C80 58 84 54 83 50C80 51 77 53 75 57Z" />
            <circle cx="57" cy="67" r="1.8" fill="#FFFDF7" />
          </g>
        </svg>
      );

    default:
      return <Sparkles className={className} />;
  }
};
