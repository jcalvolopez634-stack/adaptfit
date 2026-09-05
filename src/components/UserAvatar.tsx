import React from 'react';
import { AvatarType } from '../types';

export interface PresetAvatarInfo {
  id: string;
  name: string;
  badgeLabel: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const PRESET_AVATARS: PresetAvatarInfo[] = [
  {
    id: 'avatar_sage',
    name: 'Salvia Zen',
    badgeLabel: 'Calma & Salud',
    bgColor: '#E7F3EC',
    borderColor: '#2D6A4F',
    description: 'Enfoque sereno y libre de impacto.',
  },
  {
    id: 'avatar_peach',
    name: 'Melocotón Cálido',
    badgeLabel: 'Alegría & Paz',
    bgColor: '#FFF0E5',
    borderColor: '#F4A261',
    description: 'Vitalidad suave y acogedora.',
  },
  {
    id: 'avatar_lavender',
    name: 'Lavanda Serenidad',
    badgeLabel: 'Cuidado Articular',
    bgColor: '#F3E8FF',
    borderColor: '#8E7DBE',
    description: 'Descanso mental y movimiento consciente.',
  },
  {
    id: 'avatar_teal',
    name: 'Verde Azulado',
    badgeLabel: 'Movilidad Activa',
    bgColor: '#CCFBF1',
    borderColor: '#0D9488',
    description: 'Firmeza y equilibrio diario.',
  },
  {
    id: 'avatar_amber',
    name: 'Ámbar Radiante',
    badgeLabel: 'Energía Solar',
    bgColor: '#FEF3C7',
    borderColor: '#D97706',
    description: 'Optimismo en cada pequeño paso.',
  },
  {
    id: 'avatar_emerald',
    name: 'Esmeralda Vital',
    badgeLabel: 'Sabiduría & Fuerza',
    bgColor: '#D1FAE5',
    borderColor: '#047857',
    description: 'Constancia sin prisas ni dolor.',
  },
];

interface UserAvatarProps {
  avatarType?: AvatarType;
  avatarValue?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarType = 'preset',
  avatarValue = 'avatar_sage',
  name = '',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  // Custom Photo handler
  if (avatarType === 'custom_photo' && avatarValue && avatarValue.startsWith('data:image')) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xs ${sizeClasses[size]} ${className}`}
      >
        <img
          src={avatarValue}
          alt={name ? `Foto de ${name}` : 'Foto de perfil'}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Preset Avatar SVGs
  const renderSvgPreset = () => {
    switch (avatarValue) {
      case 'avatar_peach':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="50" fill="#FFF0E5" />
            <circle cx="50" cy="46" r="24" fill="#F4A261" />
            <circle cx="42" cy="44" r="3" fill="#6B3308" />
            <circle cx="58" cy="44" r="3" fill="#6B3308" />
            <path
              d="M42 53 Q50 61 58 53"
              stroke="#6B3308"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="36" cy="48" r="4" fill="#FFAA80" opacity="0.6" />
            <circle cx="64" cy="48" r="4" fill="#FFAA80" opacity="0.6" />
            <path
              d="M24 92 C24 74 36 68 50 68 C64 68 76 74 76 92"
              fill="#E76F51"
            />
          </svg>
        );

      case 'avatar_lavender':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="50" fill="#F3E8FF" />
            <circle cx="50" cy="46" r="23" fill="#D8B4FE" />
            <circle cx="42" cy="45" r="3" fill="#4A1D96" />
            <circle cx="58" cy="45" r="3" fill="#4A1D96" />
            <path
              d="M44 54 Q50 59 56 54"
              stroke="#4A1D96"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M22 92 C22 74 35 68 50 68 C65 68 78 74 78 92"
              fill="#8E7DBE"
            />
            <circle cx="50" cy="20" r="4" fill="#C084FC" />
          </svg>
        );

      case 'avatar_teal':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="50" fill="#CCFBF1" />
            <circle cx="50" cy="46" r="23" fill="#5EEAD4" />
            <path d="M30 35 Q50 24 70 35 L70 39 Q50 28 30 39 Z" fill="#0F766E" />
            <circle cx="42" cy="47" r="3" fill="#134E4A" />
            <circle cx="58" cy="47" r="3" fill="#134E4A" />
            <path
              d="M43 54 Q50 60 57 54"
              stroke="#134E4A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M22 92 C22 74 35 68 50 68 C65 68 78 74 78 92"
              fill="#0D9488"
            />
          </svg>
        );

      case 'avatar_amber':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="50" fill="#FEF3C7" />
            <circle cx="50" cy="46" r="23" fill="#FCD34D" />
            <circle cx="42" cy="45" r="3" fill="#78350F" />
            <circle cx="58" cy="45" r="3" fill="#78350F" />
            <path
              d="M42 53 Q50 61 58 53"
              stroke="#78350F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="36" cy="49" r="4" fill="#F59E0B" opacity="0.6" />
            <circle cx="64" cy="49" r="4" fill="#F59E0B" opacity="0.6" />
            <path
              d="M22 92 C22 74 35 68 50 68 C65 68 78 74 78 92"
              fill="#D97706"
            />
          </svg>
        );

      case 'avatar_emerald':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="50" fill="#D1FAE5" />
            <circle cx="50" cy="46" r="23" fill="#6EE7B7" />
            <circle cx="42" cy="46" r="3" fill="#064E3B" />
            <circle cx="58" cy="46" r="3" fill="#064E3B" />
            <path
              d="M43 54 Q50 60 57 54"
              stroke="#064E3B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M22 92 C22 74 35 68 50 68 C65 68 78 74 78 92"
              fill="#047857"
            />
          </svg>
        );

      case 'avatar_sage':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="50" fill="#E7F3EC" />
            <circle cx="50" cy="46" r="23" fill="#A3D9C9" />
            <circle cx="42" cy="46" r="3" fill="#0F5238" />
            <circle cx="58" cy="46" r="3" fill="#0F5238" />
            <path
              d="M43 54 Q50 60 57 54"
              stroke="#0F5238"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="36" cy="49" r="3.5" fill="#52B788" opacity="0.6" />
            <circle cx="64" cy="49" r="3.5" fill="#52B788" opacity="0.6" />
            <path
              d="M22 92 C22 74 35 68 50 68 C65 68 78 74 78 92"
              fill="#2D6A4F"
            />
            {/* Small subtle green botanical leaf in hair */}
            <path
              d="M48 22 C48 16 54 14 58 17 C58 23 52 25 48 22 Z"
              fill="#2D6A4F"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 border border-white/60 shadow-xs flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      {renderSvgPreset()}
    </div>
  );
};
