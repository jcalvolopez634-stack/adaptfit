/**
 * AdaptFit - Barra de Navegación Inferior (BottomNav)
 * 5 destinos claros y accesibles para las pantallas principales:
 * 1. Inicio (home)
 * 2. Camino 52S (year_road)
 * 3. Victorias (victory_wall)
 * 4. Calendario (calendar_sync)
 * 5. Evolución (clinical_report)
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';
import {
  Home,
  Compass,
  Trophy,
  Calendar,
  Activity,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo } = useApp();

  const navItems: { id: ScreenId; label: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'home',
      label: 'Inicio',
      icon: Home,
    },
    {
      id: 'year_road',
      label: 'Camino',
      icon: Compass,
    },
    {
      id: 'victory_wall',
      label: 'Victorias',
      icon: Trophy,
    },
    {
      id: 'calendar_sync',
      label: 'Calendario',
      icon: Calendar,
    },
    {
      id: 'clinical_report',
      label: 'Evolución',
      icon: Activity,
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#EDEEEF] px-1 py-1.5 z-40 shadow-lg grid grid-cols-5 items-center"
    >
      {navItems.map((item) => {
        const isActive =
          currentScreen === item.id ||
          (item.id === 'clinical_report' && currentScreen === 'evolution') ||
          (item.id === 'calendar_sync' && currentScreen === 'calendar');
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => navigateTo(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-2xl transition-all min-w-0 w-full group cursor-pointer select-none ${
              isActive
                ? 'text-[#2D6A4F] font-extrabold'
                : 'text-[#707973] hover:text-[#191C1D] font-medium'
            }`}
          >
            <div
              className={`w-8 h-7 rounded-xl flex items-center justify-center transition-all ${
                isActive ? 'bg-[#E7F3EC] text-[#2D6A4F]' : 'bg-transparent group-hover:bg-[#F3F4F5]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            </div>
            <span
              className={`text-[10px] tracking-tight mt-0.5 block truncate max-w-full text-center leading-none ${
                isActive ? 'font-black text-[#2D6A4F]' : 'text-[#707973]'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
