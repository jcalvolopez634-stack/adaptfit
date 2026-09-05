/**
 * AdaptFit - Pantalla 14: Calendario y Sincronización Externa (.ics)
 * Calendario mensual reactivo con marcas de sesiones completadas, planificadas y descansos,
 * y generador en memoria de archivo iCalendar estándar (.ics) para sincronizar con Google / Apple Calendar.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DayOfWeek } from '../types';
import {
  Calendar as CalendarIcon,
  ArrowLeft,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Share2,
  CalendarCheck,
} from 'lucide-react';

const DAY_MAP: Record<DayOfWeek, string> = {
  Lunes: 'MO',
  Martes: 'TU',
  Miércoles: 'WE',
  Jueves: 'TH',
  Viernes: 'FR',
  Sábado: 'SA',
  Domingo: 'SU',
};

const DAY_INDEX_MAP: Record<DayOfWeek, number> = {
  Lunes: 0,
  Martes: 1,
  Miércoles: 2,
  Jueves: 3,
  Viernes: 4,
  Sábado: 5,
  Domingo: 6,
};

export const CalendarSyncScreen: React.FC = () => {
  const {
    annualPlan,
    restShield,
    streakWeeks,
    exportCalendarICS,
    navigateTo,
    goBack,
  } = useApp();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // Septiembre
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const currentYear = 2026;

  const selectedDays = annualPlan.selectedDays && annualPlan.selectedDays.length > 0
    ? annualPlan.selectedDays
    : ['Lunes', 'Miércoles', 'Viernes'];

  const selectedDayIndices = selectedDays.map((d) => DAY_INDEX_MAP[d]);

  // Real RFC 5545 .ics Calendar Generator respecting specific user days
  const handleExportICS = () => {
    setIsExporting(true);
    exportCalendarICS();

    setTimeout(() => {
      setIsExporting(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 400);
  };

  // Calendar Day Model (30 days representation for Septiembre 2026)
  // Septiembre 1, 2026 is a Tuesday (index 1)
  const monthStartOffset = 1; // Tuesday
  const daysInMonth = 30;
  const todayDayNumber = 24;

  let completedCount = 0;
  let plannedCount = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = (monthStartOffset + d - 1) % 7;
    if (selectedDayIndices.includes(dow)) {
      if (d <= todayDayNumber) completedCount++;
      else plannedCount++;
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-28">
      {/* Top Header */}
      <header className="px-5 pt-6 pb-4 bg-white border-b border-[#EDEEEF] sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#191C1D] flex items-center justify-center transition-all"
            title="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238] text-xs font-bold">
            <CalendarCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Calendario Oficial</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F]">
            Organización Sostenible
          </span>
          <h1 className="text-xl font-black text-[#191C1D] leading-tight mt-0.5">
            Sincronización y Calendario
          </h1>
          <p className="text-xs text-[#707973] mt-0.5">
            {selectedDays.join(' • ')} ({annualPlan.minutesPerSession} min/sesión)
          </p>
        </div>
      </header>

      {/* Main Body */}
      <main className="px-5 pt-5 space-y-6 flex-1">
        {/* Month Selector Bar */}
        <div className="p-3 bg-white rounded-2xl border border-[#E1E3E4] flex items-center justify-between shadow-2xs">
          <button
            type="button"
            onClick={() =>
              setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 11))
            }
            className="w-8 h-8 rounded-lg bg-[#F8F9FA] hover:bg-[#EDEEEF] text-[#191C1D] flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <strong className="text-sm font-black text-[#191C1D] block">
              {monthNames[currentMonthIndex]} {currentYear}
            </strong>
            <span className="text-[10px] text-[#2D6A4F] font-bold">
              {completedCount} realizadas • {plannedCount} programadas
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setCurrentMonthIndex((prev) => (prev < 11 ? prev + 1 : 0))
            }
            className="w-8 h-8 rounded-lg bg-[#F8F9FA] hover:bg-[#EDEEEF] text-[#191C1D] flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Reactive Calendar Grid */}
        <section className="p-4 rounded-3xl bg-white border border-[#E1E3E4] shadow-xs space-y-3">
          {/* Day Headers (L M X J V S D) */}
          <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-[11px] text-[#707973] pb-1 border-b border-[#EDEEEF]">
            <span>L</span>
            <span>M</span>
            <span>X</span>
            <span>J</span>
            <span>V</span>
            <span>S</span>
            <span>D</span>
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {/* Empty offset day for Tuesday alignment (1 empty box) */}
            <div className="p-2" />

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dayOfWeek = (monthStartOffset + idx) % 7;
              const isTrainingDay = selectedDayIndices.includes(dayOfWeek);

              const isCompleted = isTrainingDay && day <= todayDayNumber;
              const isPlanned = isTrainingDay && day > todayDayNumber;
              const isRest = !isTrainingDay;

              return (
                <div
                  key={day}
                  className={`py-2 rounded-xl text-xs flex flex-col items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-[#E7F3EC] text-[#0F5238] font-black border border-[#2D6A4F]/30'
                      : isPlanned
                      ? 'bg-[#FFF6ED] text-[#8E4E14] font-bold border border-[#F4A261]'
                      : 'bg-[#F8F9FA] text-[#707973]'
                  }`}
                >
                  <span className="text-[11px]">{day}</span>
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isCompleted
                        ? 'bg-[#2D6A4F]'
                        : isPlanned
                        ? 'bg-[#F4A261]'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-around pt-3 border-t border-[#EDEEEF] text-[11px] font-bold text-[#707973]">
            <div className="flex items-center gap-1.5 text-[#0F5238]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F]" />
              <span>Realizado</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#8E4E14]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F4A261]" />
              <span>Planificado</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#707973]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EDEEEF]" />
              <span>Descanso</span>
            </div>
          </div>
        </section>

        {/* Sync Benefits Card */}
        <section className="p-4 rounded-2xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-2">
          <div className="flex items-center gap-2 text-[#0F5238]">
            <Sparkles className="w-4 h-4 text-[#2D6A4F]" />
            <strong className="text-xs uppercase tracking-wider">
              Sincronización Automática (.ics)
            </strong>
          </div>
          <p className="text-xs text-[#2A3E33] leading-relaxed">
            Al pulsar el botón inferior se descarga un archivo de calendario universal compatible con <strong>Google Calendar, Apple Calendar y Outlook</strong>. No necesitas instalar programas adicionales ni introducir contraseñas.
          </p>
        </section>

        {downloadSuccess && (
          <div className="p-3.5 rounded-2xl bg-[#E7F3EC] border border-[#2D6A4F] text-[#0F5238] text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span>
              ¡Archivo .ics descargado! Ábrelo en tu móvil para añadirlo a tu calendario.
            </span>
          </div>
        )}
        {/* Action Button: 56px Primary Button */}
        <button
          type="button"
          onClick={handleExportICS}
          disabled={isExporting}
          className="w-full h-14 rounded-2xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-md transition-all duration-200"
        >
          <Download className="w-5 h-5" />
          <span>
            {isExporting
              ? 'Generando archivo .ics...'
              : 'Sincronizar con Google / Apple Calendar'}
          </span>
        </button>
      </main>
    </div>
  );
};
