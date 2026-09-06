/**
 * AdaptFit - Pantalla de Inicio (HomeScreen)
 * Máxima claridad y foco:
 * - Tarjeta principal dominante (Hero Card): "Tu entrenamiento de hoy", 3 datos visuales y botón táctil prominente.
 * - Widget horizontal compacto con la semana en curso (L M X J V S D) y estado de la racha.
 * - Libre de calendarios duplicados, gráficas densas y listas redundantes.
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/UserAvatar';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import {
  Clock,
  Dumbbell,
  Sparkles,
  Play,
  Flame,
  ShieldCheck,
  ShieldAlert,
  Settings,
  Check,
  Moon,
  Sun,
  Layers,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    userProfile,
    annualPlan,
    activeWorkout,
    startWorkoutSession,
    isLowEnergyActive,
    toggleLowEnergyDayMode,
    streakDays,
    restShield,
    toggleRestShield,
    completedWorkouts,
    navigateTo,
  } = useApp();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 1. Datos visuales calculados para la Hero Card
  const sessionDuration = isLowEnergyActive
    ? 7
    : annualPlan.minutesPerSession || 20;

  const exerciseCount = isLowEnergyActive
    ? 2
    : (activeWorkout.workoutList && activeWorkout.workoutList.length > 0
        ? activeWorkout.workoutList.length
        : 3);

  const focusTitle = useMemo(() => {
    if (isLowEnergyActive) {
      return 'Movilidad y Calma';
    }
    const hasDiscomfort =
      userProfile.discomfortZones &&
      userProfile.discomfortZones.length > 0 &&
      !userProfile.discomfortZones.includes('ninguna');

    if (userProfile.mobilityLevel === 'silla_cama') {
      return 'Fuerza Adaptada en Silla';
    }
    if (hasDiscomfort) {
      return 'Fuerza y Protección Articular';
    }
    return 'Fuerza y Estabilidad';
  }, [isLowEnergyActive, userProfile.discomfortZones, userProfile.mobilityLevel]);

  const routineHeadline = useMemo(() => {
    if (isLowEnergyActive) {
      return 'Sesión Suave de Descompresión y Respiración';
    }
    return activeWorkout.routineTitle || 'Fortalecimiento de Core y Estabilidad Lumbar';
  }, [isLowEnergyActive, activeWorkout.routineTitle]);

  // 2. Cálculo de la semana en curso (Lunes a Domingo) para el widget compacto
  const currentWeekDays = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 es Domingo, 1 es Lunes
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const letters = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const selectedDays = annualPlan.selectedDays || ['Lunes', 'Miércoles', 'Viernes'];

    const dayNameMap: Record<number, string> = {
      0: 'Lunes',
      1: 'Martes',
      2: 'Miércoles',
      3: 'Jueves',
      4: 'Viernes',
      5: 'Sábado',
      6: 'Domingo',
    };

    const todayDateStr = now.toISOString().slice(0, 10);

    return letters.map((letter, idx) => {
      const cellDate = new Date(monday);
      cellDate.setDate(monday.getDate() + idx);
      const cellDateStr = cellDate.toISOString().slice(0, 10);
      const isToday = cellDateStr === todayDateStr;

      // Real completed check from completedWorkouts
      const isCompleted = completedWorkouts.some(
        (w) => w.timestamp && w.timestamp.startsWith(cellDateStr)
      );

      const dayName = dayNameMap[idx];
      const isPlannedDay = selectedDays.includes(dayName as any);
      const isFutureOrToday = cellDate.getTime() >= now.setHours(0, 0, 0, 0);

      return {
        letter,
        dayNumber: cellDate.getDate(),
        isToday,
        isCompleted,
        isPlanned: isPlannedDay && !isCompleted && isFutureOrToday,
      };
    });
  }, [annualPlan.selectedDays, completedWorkouts]);

  const handleStartWorkout = () => {
    startWorkoutSession(isLowEnergyActive);
    navigateTo('workout_active');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-28">
      {/* Top App Header */}
      <header className="px-5 pt-6 pb-4 bg-white border-b border-[#EDEEEF] sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2.5 text-left group hover:opacity-90 transition-all"
            title="Ver y editar perfil"
          >
            <UserAvatar
              avatarType={userProfile.avatarType || 'preset'}
              avatarValue={userProfile.avatarValue || 'avatar_sage'}
              name={userProfile.name}
              size="md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
                  Hola, {userProfile.name || 'Compañero/a'}
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
              </div>
              <h1 className="text-base font-extrabold text-[#191C1D] tracking-tight">
                AdaptFit
              </h1>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {/* Rest Shield Toggle */}
            <button
              type="button"
              onClick={toggleRestShield}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                restShield.isActive
                  ? 'bg-[#FFF6ED] border border-[#F4A261] text-[#8E4E14]'
                  : 'bg-[#F3F4F5] text-[#707973] border border-transparent hover:bg-[#EDEEEF]'
              }`}
              title={
                restShield.isActive
                  ? 'Escudo de descanso activo: tu racha está protegida'
                  : 'Activar escudo de descanso'
              }
            >
              {restShield.isActive ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E76F51]" />
                  <span>Escudo ON</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-[#707973]" />
                  <span>Escudo</span>
                </>
              )}
            </button>

            {/* Profile Settings */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="w-9 h-9 rounded-xl bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#404943] flex items-center justify-center transition-all"
              title="Ajustes de perfil"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Focused Content */}
      <main className="px-5 pt-6 space-y-6 flex-1">
        {/* =========================================================
            1. TARJETA PRINCIPAL DOMINANTE (HERO CARD)
            ========================================================= */}
        <section className="bg-white rounded-3xl border border-[#E1E3E4] shadow-sm p-6 space-y-6 relative overflow-hidden">
          {/* Subtle Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2D6A4F]" />

          {/* Card Header & Low Energy Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
                Prescripción del Día
              </span>

              {/* Quick switch for Low Energy Day */}
              <button
                type="button"
                onClick={() => toggleLowEnergyDayMode()}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  isLowEnergyActive
                    ? 'bg-[#E7F3EC] text-[#0F5238] border border-[#2D6A4F]'
                    : 'bg-[#F8F9FA] text-[#707973] border border-[#E1E3E4] hover:bg-[#EDEEEF]'
                }`}
                title="Activar sesión corta de 7 minutos"
              >
                <Moon className="w-3 h-3" />
                <span>{isLowEnergyActive ? 'Modo 7 min ON' : 'Día Bajo de Energía'}</span>
              </button>
            </div>

            <h2 className="text-2xl font-black text-[#191C1D] tracking-tight leading-tight">
              Tu entrenamiento de hoy
            </h2>

            <p className="text-sm font-medium text-[#525E56] leading-snug">
              {routineHeadline}
            </p>
          </div>

          {/* Resumen en 3 Datos Visuales */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {/* Dato 1: Duración */}
            <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#EDEEEF] flex flex-col items-center text-center justify-center">
              <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center mb-1.5">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#707973] uppercase tracking-wider">
                Duración
              </span>
              <strong className="text-sm font-extrabold text-[#191C1D] mt-0.5">
                {sessionDuration} min
              </strong>
            </div>

            {/* Dato 2: Número de Ejercicios */}
            <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#EDEEEF] flex flex-col items-center text-center justify-center">
              <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center mb-1.5">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#707973] uppercase tracking-wider">
                Ejercicios
              </span>
              <strong className="text-sm font-extrabold text-[#191C1D] mt-0.5">
                {exerciseCount} bloques
              </strong>
            </div>

            {/* Dato 3: Enfoque */}
            <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#EDEEEF] flex flex-col items-center text-center justify-center">
              <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center mb-1.5">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#707973] uppercase tracking-wider">
                Enfoque
              </span>
              <strong className="text-xs font-extrabold text-[#191C1D] mt-0.5 leading-tight line-clamp-1">
                {focusTitle}
              </strong>
            </div>
          </div>

          {/* Botón Táctil Prominente: Comenzar Entrenamiento */}
          <button
            type="button"
            onClick={handleStartWorkout}
            className="w-full h-14 rounded-2xl bg-[#2D6A4F] hover:bg-[#0F5238] active:scale-[0.98] text-white font-black text-base shadow-md hover:shadow-lg flex items-center justify-center gap-3 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
            </div>
            <span>Comenzar entrenamiento</span>
          </button>
        </section>

        {/* =========================================================
            2. WIDGET HORIZONTAL COMPACTO: SEMANA EN CURSO Y RACHA
            ========================================================= */}
        <section className="bg-white rounded-2xl border border-[#E1E3E4] p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#707973]">
              Semana en curso
            </span>

            {/* Racha activa */}
            <div className="flex items-center gap-1 text-xs font-extrabold text-[#8E4E14]">
              <Flame className="w-3.5 h-3.5 text-[#E76F51] fill-[#E76F51]" />
              <span>
                {streakDays > 0
                  ? `Racha: ${streakDays} días seguidos`
                  : 'Racha: 0 días'}
              </span>
            </div>
          </div>

          {/* Fila compacta de 7 días (L M X J V S D) */}
          <div className="grid grid-cols-7 gap-1.5">
            {currentWeekDays.map((dayItem, idx) => {
              const { letter, isToday, isCompleted, isPlanned } = dayItem;

              let bgClass = 'bg-[#F8F9FA] text-[#707973] border-transparent';
              if (isCompleted) {
                bgClass = 'bg-[#E7F3EC] text-[#0F5238] border-[#2D6A4F]/40 font-black';
              } else if (isPlanned) {
                bgClass = 'bg-[#FFF6ED] text-[#8E4E14] border-[#F4A261] font-bold';
              }

              return (
                <div
                  key={idx}
                  className={`py-2 rounded-xl flex flex-col items-center justify-center border text-xs transition-all relative ${bgClass} ${
                    isToday ? 'ring-2 ring-[#2D6A4F] ring-offset-1' : ''
                  }`}
                >
                  <span className="text-[11px] font-bold">{letter}</span>

                  <div className="w-4 h-4 mt-1 flex items-center justify-center">
                    {isCompleted ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : isPlanned ? (
                      <div className="w-2 h-2 rounded-full bg-[#F4A261]" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#EDEEEF]" />
                    )}
                  </div>

                  {isToday && (
                    <span className="text-[8px] font-extrabold text-[#2D6A4F] uppercase tracking-tighter mt-0.5">
                      Hoy
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Modal de Configuración y Perfil Clínico */}
      {isProfileModalOpen && (
        <ProfileSettingsModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
};
