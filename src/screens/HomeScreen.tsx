/**
 * AdaptFit - Pantalla 3: Home / Dashboard Principal ("El Día de Hoy")
 * Dashboard central: saludo empático, racha de consistencia, sesión recomendada del día,
 * switch rápido de Día Bajo de Energía, fila semanal de consistencia y acceso a macrociclo y logros.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/BottomNav';
import { UserAvatar } from '../components/UserAvatar';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import {
  Heart,
  Flame,
  ShieldCheck,
  ShieldAlert,
  Play,
  Moon,
  Sparkles,
  ChevronRight,
  Clock,
  Dumbbell,
  Trophy,
  Calendar,
  Layers,
  Settings,
  Activity,
  ArrowUpRight,
  Zap,
  Gem,
  PlusCircle,
  Scale,
  Ruler,
  BookOpen,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    userProfile,
    annualPlan,
    activeWorkout,
    startWorkoutSession,
    startBonusWorkoutSession,
    anthropometricRecords,
    vitalityGems,
    consistencyPoints,
    bonusWorkoutsCompleted,
    isLowEnergyActive,
    toggleLowEnergyDayMode,
    streakWeeks,
    streakDays,
    weeklyConsistency,
    restShield,
    toggleRestShield,
    achievements,
    completedWorkouts,
    navigateTo,
  } = useApp();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isAdvancedStrength =
    userProfile.mobilityLevel === 'avanzado_fuerza' &&
    (userProfile.discomfortZones.length === 0 ||
      (userProfile.discomfortZones.length === 1 &&
        userProfile.discomfortZones[0] === 'ninguna'));

  const handleStartWorkout = () => {
    startWorkoutSession(isLowEnergyActive);
    navigateTo('workout_active');
  };

  const handleStartBonusWorkout = () => {
    startBonusWorkoutSession();
    navigateTo('workout_active');
  };

  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;
  const recentAchievement = achievements.find((a) => a.unlocked);

  const currentWeekNumber = Math.max(1, streakWeeks || 1);
  const totalCompleted = completedWorkouts?.length || 0;
  const progressPercent = Math.min(100, Math.round((totalCompleted / 52) * 100));

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-24">
      {/* Top Header */}
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
                El Día de Hoy
              </h1>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {/* Quick settings to reconfigure profile and clinical setup */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="w-9 h-9 rounded-xl bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#404943] flex items-center justify-center transition-all"
              title="Ajustes de perfil y reset"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Rest Shield indicator & toggle */}
            <button
              type="button"
              onClick={toggleRestShield}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                restShield.isActive
                  ? 'bg-[#FFF6ED] border border-[#F4A261] text-[#8E4E14]'
                  : 'bg-[#F3F4F5] text-[#707973] border border-transparent'
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
          </div>
        </div>

        {/* Consistency Streak Banner */}
        <div className="mt-3 pt-3 border-t border-[#EDEEEF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFDCC4]/70 flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#E76F51]" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#191C1D]">
                Semana {streakWeeks} • {streakDays} días activos
              </span>
              <p className="text-[11px] text-[#707973]">
                {restShield.isActive
                  ? 'Racha blindada por descanso protegido'
                  : 'Consistencia sin dolor'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E7F3EC] border border-[#B1F0CE] text-[11px] font-extrabold text-[#0F5238]">
              <Gem className="w-3 h-3 text-[#2D6A4F]" />
              <span>{vitalityGems}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#FFF6ED] border border-[#FFDCC4] text-[11px] font-extrabold text-[#8E4E14]">
              <Zap className="w-3 h-3 text-[#E76F51]" />
              <span>{consistencyPoints} pts</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Screen Body */}
      <main className="px-5 pt-5 space-y-6 flex-1">
        {/* Weekly Consistency Row */}
        <section className="p-4 rounded-2xl bg-white border border-[#E1E3E4] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#707973] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2D6A4F]" />
              Consistencia Semanal
            </h2>
            <span className="text-xs font-extrabold text-[#2D6A4F]">
              {annualPlan.daysPerWeek} días programados
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {weeklyConsistency.map((item, idx) => {
              const isCompleted = item.status === 'completed';
              const isRest = item.status === 'rest' || item.status === 'shielded';
              const isToday = item.isToday;

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-[#E7F3EC] border-[#2D6A4F] text-[#0F5238]'
                      : isToday
                      ? 'bg-[#FFF6ED] border-[#F4A261] ring-2 ring-[#F4A261]/30 font-bold'
                      : isRest
                      ? 'bg-[#F8F9FA] border-dashed border-[#E1E3E4] text-[#707973]'
                      : 'bg-[#F3F4F5] border-transparent text-[#707973]'
                  }`}
                >
                  <span className="text-[11px] font-extrabold mb-1">
                    {item.dayLetter}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                      isCompleted
                        ? 'bg-[#2D6A4F] text-white font-bold'
                        : isToday
                        ? 'bg-[#F4A261] text-white font-bold'
                        : isRest
                        ? 'text-[#8E4E14]'
                        : 'bg-transparent text-[#707973]'
                    }`}
                  >
                    {isCompleted ? '✓' : isToday ? '•' : isRest ? 'z' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Low Energy Mode Quick Switch Banner */}
        <section
          className={`p-4 rounded-2xl border transition-all duration-200 ${
            isLowEnergyActive
              ? 'bg-[#FFF6ED] border-[#F4A261] shadow-xs'
              : 'bg-white border-[#E1E3E4]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isLowEnergyActive
                    ? 'bg-[#F4A261] text-white'
                    : 'bg-[#F3F4F5] text-[#404943]'
                }`}
              >
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#191C1D]">
                    Modo &quot;Día Bajo de Energía&quot;
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FFDCC4] text-[#8E4E14]">
                    7 min
                  </span>
                </div>
                <p className="text-xs text-[#707973] mt-0.5">
                  {isLowEnergyActive
                    ? 'Activado: sesión corta sentada para proteger racha sin cansancio.'
                    : '¿Cansancio o poca energía hoy? Haz 7 min suaves sentado.'}
                </p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <button
              type="button"
              onClick={() => toggleLowEnergyDayMode()}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                isLowEnergyActive ? 'bg-[#F4A261]' : 'bg-[#E1E3E4]'
              }`}
              title="Activar/Desactivar Día Bajo de Energía"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                  isLowEnergyActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#EDEEEF] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => navigateTo('low_energy')}
              className="text-[#8E4E14] font-bold hover:underline flex items-center gap-1"
            >
              <span>Ver detalle y ejercicios del modo 7 min</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-[#707973]">Cero impacto</span>
          </div>
        </section>

        {/* Hero Card: Today's Workout Session */}
        <section className="p-5 rounded-3xl bg-white border border-[#E1E3E4] shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E7F3EC]/50 rounded-bl-full pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5" />
              Sesión Recomendada
            </span>
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                isLowEnergyActive
                  ? 'bg-[#FFDCC4] text-[#8E4E14]'
                  : 'bg-[#E7F3EC] text-[#0F5238]'
              }`}
            >
              {isLowEnergyActive ? 'Versión Calma (7 min)' : `${annualPlan.minutesPerSession} minutos`}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#191C1D] leading-tight">
              {isLowEnergyActive
                ? 'Movilidad Articular y Respiración Sedente'
                : isAdvancedStrength
                ? 'Sobrecarga Progresiva e Hipertrofia (Avanzado)'
                : 'Fuerza Suave y Estabilidad Lumbar'}
            </h2>
            <p className="text-xs text-[#404943] mt-1.5 leading-relaxed">
              {isLowEnergyActive
                ? 'Rutina restaurativa diseñada para días de fatiga física o estrés. Mantiene articulaciones lubricadas.'
                : isAdvancedStrength
                ? 'Flexiones de pecho completas, zancadas búlgaras y tempo controlado para hipertrofia y fuerza máxima sin lesiones.'
                : 'Ejercicios guiados paso a paso con protección activa de rodillas y zona lumbar. 100% libre de dolor.'}
            </p>
          </div>

          {/* Key tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#F3F4F5] text-[#404943] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#2D6A4F]" />
              {isLowEnergyActive ? '7 min' : `${annualPlan.minutesPerSession} min`}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#F3F4F5] text-[#404943] flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#2D6A4F]" />
              {isLowEnergyActive
                ? '3 ejercicios sentados'
                : isAdvancedStrength
                ? '6 ejercicios exigentes'
                : '8 ejercicios guiados'}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#E7F3EC] text-[#0F5238] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#2D6A4F]" />
              {isAdvancedStrength ? 'Sobrecarga Progresiva' : 'Cero impacto'}
            </span>
          </div>

          {/* Primary Action Button: 56px height */}
          <button
            type="button"
            onClick={handleStartWorkout}
            className="w-full h-14 rounded-2xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-md transition-all duration-200"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>
              {isLowEnergyActive
                ? 'Iniciar Sesión de 7 Minutos'
                : `Comenzar Sesión (${annualPlan.minutesPerSession} min)`}
            </span>
          </button>

          {/* Quick Access to Exercise Library */}
          <button
            type="button"
            onClick={() => navigateTo('exercise_library')}
            className="w-full p-3 rounded-2xl bg-[#F8F9FA] border border-[#EDEEEF] hover:bg-[#F0F2F1] flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#191C1D]">
                  Biblioteca de Ejercicios Biomecánicos
                </div>
                <div className="text-[10px] text-[#707973]">
                  Catálogo con filtros por material, nivel y fichas sensoriales
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#707973] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </section>

        {/* Bonus Workout Module: Secondary Action */}
        <section className="p-4 rounded-2xl bg-white border border-[#E1E3E4] shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF6ED] border border-[#FFDCC4] text-[#E76F51] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#8E4E14]">
                    Entrenamiento Extra • Opcional
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#0F5238]">
                    +50 pts & 1 Gema
                  </span>
                </div>
                <p className="text-sm font-bold text-[#191C1D] mt-0.5">
                  ¿Tienes energía extra hoy? Haz una sesión bonus
                </p>
                <p className="text-xs text-[#555E58] mt-1 leading-relaxed">
                  Movilidad suave, caminata en el sitio y estiramientos placenteros (12 min). No penaliza si decides descansar.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-[#F0F2F1] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-[#707973]">
              <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Desbloquea logro &quot;Plus de Energía&quot;</span>
            </div>

            <button
              type="button"
              onClick={handleStartBonusWorkout}
              className="px-4 py-2.5 rounded-xl bg-[#FFF6ED] border border-[#F4A261] text-[#8E4E14] hover:bg-[#FFEBD6] font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-2xs"
            >
              <PlusCircle className="w-4 h-4 text-[#E76F51]" />
              <span>Hacer Sesión Bonus</span>
            </button>
          </div>
        </section>

        {/* Macrociclo Overview Card */}
        <section className="p-4 rounded-2xl bg-white border border-[#E1E3E4] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] flex items-center justify-center text-[#2D6A4F]">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-[#191C1D] uppercase tracking-wider">
                  Macrociclo Anual • 12 Meses
                </h3>
                <span className="text-[11px] text-[#707973]">
                  Fase Q1: Creación de Hábito y Técnica
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('year_road')}
              className="text-xs font-bold text-[#2D6A4F] hover:underline flex items-center gap-0.5"
            >
              <span>Mapa 52 Semanas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-[#404943]">Semana {currentWeekNumber} de 52</span>
              <span className="text-[#2D6A4F]">{progressPercent}% Completado</span>
            </div>
            <div className="w-full bg-[#EDEEEF] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2D6A4F] h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(4, progressPercent)}%` }}
              />
            </div>
          </div>
        </section>

        {/* Quick Anthropometric & Clinical Evolution Access Card */}
        <section className="p-4 rounded-2xl bg-white border border-[#E1E3E4] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] flex items-center justify-center text-[#2D6A4F]">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-[#191C1D] uppercase tracking-wider">
                  Evolución y Medidas Corporales
                </h3>
                <span className="text-[11px] text-[#707973]">
                  {userProfile.weightKg ? `${userProfile.weightKg} kg • ${userProfile.heightCm || '--'} cm` : 'Sin registro de peso'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('clinical_report')}
              className="text-xs font-bold text-[#2D6A4F] hover:underline flex items-center gap-1"
            >
              <span>Ver reporte</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-[#2A3E33] bg-[#E7F3EC] p-2.5 rounded-xl italic font-medium">
            “El IMC es solo una referencia inicial, la composición corporal y la fuerza son lo verdaderamente importante.”
          </p>
        </section>

        {/* Victory Wall Highlight */}
        {recentAchievement ? (
          <section className="p-4 rounded-2xl bg-[#FFF6ED] border border-[#FFDCC4] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F4A261] text-white flex items-center justify-center text-lg shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8E4E14]">
                  Muro de Victorias • {unlockedAchievementsCount} Logros
                </span>
                <strong className="text-xs font-bold text-[#191C1D] block">
                  {recentAchievement.title}
                </strong>
                <p className="text-[11px] text-[#707973]">
                  {recentAchievement.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('victory_wall')}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#FFDCC4] text-xs font-bold text-[#8E4E14] hover:bg-[#FFF6ED] active:scale-95 transition-all shrink-0 ml-2"
            >
              Ver Muro
            </button>
          </section>
        ) : (
          <section className="p-4 rounded-2xl bg-white border border-[#E1E3E4] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3F4F5] text-[#707973] flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-[#8E9290]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#707973]">
                  Muro de Victorias • 0 de {achievements.length} Desbloqueados
                </span>
                <strong className="text-xs font-bold text-[#191C1D] block">
                  Comienza tu primer entreno
                </strong>
                <p className="text-[11px] text-[#707973]">
                  Desbloquea medallas reales basadas en tu consistencia sin dolor.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('victory_wall')}
              className="px-3 py-1.5 rounded-xl bg-[#F3F4F5] hover:bg-[#EDEEEF] text-xs font-bold text-[#404943] transition-all shrink-0 ml-2"
            >
              Ver Retos
            </button>
          </section>
        )}
      </main>

      {/* Profile & Reset Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};
