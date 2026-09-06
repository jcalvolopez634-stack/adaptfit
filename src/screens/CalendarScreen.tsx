/**
 * AdaptFit - Calendario y Sincronización Real (CalendarScreen)
 * 100% libre de datos simulados:
 * - Un día SOLO se marca en verde si existe un entrenamiento en completedWorkouts en esa fecha.
 * - Los días planificados futuros corresponden estrictamente a los días seleccionados en onboarding.
 * - Sincronización oficial con Google / Apple Calendar mediante archivo .ics estándar.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DayOfWeek } from '../types';
import {
  Calendar as CalendarIcon,
  ArrowLeft,
  Download,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';

const DAY_INDEX_MAP: Record<DayOfWeek, number> = {
  Lunes: 0,
  Martes: 1,
  Miércoles: 2,
  Jueves: 3,
  Viernes: 4,
  Sábado: 5,
  Domingo: 6,
};

const MONTH_NAMES = [
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

export const CalendarScreen: React.FC = () => {
  const {
    annualPlan,
    completedWorkouts,
    exportCalendarICS,
    goBack,
  } = useApp();

  const [viewDate, setViewDate] = useState(() => new Date());
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentYear = viewDate.getFullYear();
  const currentMonthIndex = viewDate.getMonth();

  const selectedDays =
    annualPlan.selectedDays && annualPlan.selectedDays.length > 0
      ? annualPlan.selectedDays
      : (['Lunes', 'Miércoles', 'Viernes'] as DayOfWeek[]);

  const selectedDayIndices = selectedDays.map((d) => DAY_INDEX_MAP[d]);

  // Today normalized
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Month calculations
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();
  // Convert JS Sunday (0) to European Monday (0) -> Sunday (6)
  const monthStartOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Real counters for this month
  let completedCount = 0;
  let plannedCount = 0;

  const monthDaysData = Array.from({ length: daysInMonth }).map((_, idx) => {
    const day = idx + 1;
    const cellDate = new Date(currentYear, currentMonthIndex, day);
    cellDate.setHours(0, 0, 0, 0);

    const yearStr = currentYear.toString();
    const monthStr = String(currentMonthIndex + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateISOString = `${yearStr}-${monthStr}-${dayStr}`;

    // STRICT CHECK: ONLY completed if present in completedWorkouts with matching date
    const isCompleted = completedWorkouts.some((w) => {
      if (!w.timestamp) return false;
      return w.timestamp.startsWith(dateISOString);
    });

    const dayOfWeek = cellDate.getDay();
    const dowIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const isTrainingDay = selectedDayIndices.includes(dowIndex);

    const isFutureOrToday = cellDate.getTime() >= today.getTime();
    const isToday = cellDate.getTime() === today.getTime();
    const isPlanned = isTrainingDay && !isCompleted && isFutureOrToday;

    if (isCompleted) {
      completedCount++;
    } else if (isPlanned) {
      plannedCount++;
    }

    return {
      day,
      dateISOString,
      isCompleted,
      isPlanned,
      isTrainingDay,
      isToday,
    };
  });

  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleExportICS = () => {
    setIsExporting(true);
    exportCalendarICS();

    setTimeout(() => {
      setIsExporting(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 400);
  };

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

      {/* Main Content */}
      <main className="px-5 pt-5 space-y-6 flex-1">
        {/* Month Selector Bar */}
        <div className="p-3 bg-white rounded-2xl border border-[#E1E3E4] flex items-center justify-between shadow-2xs">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-lg bg-[#F8F9FA] hover:bg-[#EDEEEF] text-[#191C1D] flex items-center justify-center transition-all"
            title="Mes anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <strong className="text-sm font-black text-[#191C1D] block">
              {MONTH_NAMES[currentMonthIndex]} {currentYear}
            </strong>
            <span className="text-[10px] text-[#2D6A4F] font-bold">
              {completedCount} realizadas • {plannedCount} programadas
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-lg bg-[#F8F9FA] hover:bg-[#EDEEEF] text-[#191C1D] flex items-center justify-center transition-all"
            title="Mes siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Real Dynamic Calendar Grid */}
        <section className="p-4 rounded-3xl bg-white border border-[#E1E3E4] shadow-xs space-y-3">
          {/* Headers (L M X J V S D) */}
          <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-[11px] text-[#707973] pb-1 border-b border-[#EDEEEF]">
            <span>L</span>
            <span>M</span>
            <span>X</span>
            <span>J</span>
            <span>V</span>
            <span>S</span>
            <span>D</span>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {/* Empty Offset Boxes */}
            {Array.from({ length: monthStartOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="p-2" />
            ))}

            {monthDaysData.map((item) => {
              const { day, isCompleted, isPlanned, isToday } = item;

              let cellClasses = 'bg-[#F8F9FA] text-[#707973] border border-transparent';
              let dotClass = 'bg-transparent';

              if (isCompleted) {
                cellClasses = 'bg-[#E7F3EC] text-[#0F5238] font-black border border-[#2D6A4F]/30';
                dotClass = 'bg-[#2D6A4F]';
              } else if (isPlanned) {
                cellClasses = 'bg-[#FFF6ED] text-[#8E4E14] font-bold border border-[#F4A261]';
                dotClass = 'bg-[#F4A261]';
              }

              return (
                <div
                  key={day}
                  className={`py-2 rounded-xl text-xs flex flex-col items-center justify-center transition-all relative ${cellClasses} ${
                    isToday ? 'ring-2 ring-[#2D6A4F] ring-offset-1' : ''
                  }`}
                >
                  <span className="text-[11px] leading-none">{day}</span>
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${dotClass}`} />
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

        {/* Action Button */}
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
