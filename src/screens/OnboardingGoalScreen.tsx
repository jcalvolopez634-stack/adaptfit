/**
 * AdaptFit - Pantalla 2: Onboarding de Meta Anual y Macrociclo (12 Meses)
 * Selección del objetivo principal, selector de días y minutos, cálculo en tiempo real
 * del Asesor de Viabilidad y visualización de las 4 fases trimestrales (Q1-Q4).
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MacroCycleGoalId,
  WorkoutFrequencyDays,
  SessionDurationMinutes,
  DayOfWeek,
} from '../types';
import {
  Heart,
  Dumbbell,
  Award,
  Smile,
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Flame,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  CalendarDays,
  ChevronDown,
} from 'lucide-react';

const GOAL_OPTIONS: {
  id: MacroCycleGoalId;
  title: string;
  badge: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: 'salud_metabolica',
    title: 'Salud Metabólica y Peso',
    badge: 'Cardio Suave',
    description:
      'Regulación glucémica, gasto calórico suave y reducción de grasa visceral sin sobrecarga articular.',
    icon: Heart,
  },
  {
    id: 'composicion_corporal',
    title: 'Composición Corporal',
    badge: 'Fuerza Suave',
    description:
      'Tonificación de masa muscular magra, soporte óseo y aceleración metabólica saludable.',
    icon: Dumbbell,
  },
  {
    id: 'reto_funcional',
    title: 'Reto Funcional: Vida Real',
    badge: 'Más Popular',
    description:
      'Subir escaleras sin asfixia, cargar compras con facilidad y levantarse del suelo con agilidad.',
    icon: Award,
  },
  {
    id: 'habito_sin_dolor',
    title: 'Hábito Diario y Sin Dolor',
    badge: 'Máxima Calma',
    description:
      'Consistencia garantizada, descompresión articular diaria y bienestar físico sin estrés.',
    icon: Smile,
  },
];

const FREQUENCY_DAYS: WorkoutFrequencyDays[] = [2, 3, 4, 5, 6];
const SESSION_MINUTES: SessionDurationMinutes[] = [15, 20, 30, 45];
const ALL_DAYS_OF_WEEK: DayOfWeek[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

export const OnboardingGoalScreen: React.FC = () => {
  const {
    annualPlan,
    setMacroCycleGoal,
    setWorkoutFrequency,
    setSelectedDays,
    toggleSelectedDay,
    setSessionDuration,
    currentViability,
    saveAnnualPlan,
    navigateTo,
    goBack,
  } = useApp();

  const [showPhasesDetails, setShowPhasesDetails] = React.useState(false);
  const selectedDaysList = annualPlan.selectedDays || ['Lunes', 'Miércoles', 'Viernes'];
  const isValidDaysCount = selectedDaysList.length === annualPlan.daysPerWeek;

  const handleDayChipClick = (day: DayOfWeek) => {
    if (selectedDaysList.includes(day)) {
      // Trying to unselect
      toggleSelectedDay(day);
    } else {
      // Trying to select
      if (selectedDaysList.length < annualPlan.daysPerWeek) {
        toggleSelectedDay(day);
      } else {
        // If already reached limit, replace the first selected day with this one
        const updated = [...selectedDaysList.slice(1), day];
        setSelectedDays(updated);
      }
    }
  };

  const handleConfirmPlan = () => {
    if (!isValidDaysCount) {
      return;
    }
    saveAnnualPlan();
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-28">
      {/* Top Navigation Bar with Back Button */}
      <header className="px-6 pt-7 pb-4 bg-white border-b border-[#EDEEEF] sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] active:scale-95 flex items-center justify-center text-[#191C1D] transition-all"
            title="Volver atrás"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 bg-[#EDEEEF] px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-[#2D6A4F]">Paso 2</span>
            <span className="text-xs text-[#707973]">de 2</span>
          </div>
        </div>

        {/* Progress Track: 100% complete at Step 2 */}
        <div className="w-full bg-[#EDEEEF] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#2D6A4F] h-full w-full rounded-full transition-all duration-500" />
        </div>
      </header>

      {/* Main Body */}
      <main className="px-5 pt-6 space-y-8 flex-1">
        {/* Title Header */}
        <section className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDCC4]/50 text-[#8E4E14] text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-[#8E4E14]" />
            <span>Macrociclo de 12 Meses Adaptado</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#191C1D] leading-tight font-headline">
            Diseña tu ritmo y objetivo anual
          </h1>
          <p className="text-sm text-[#404943] leading-relaxed">
            La consistencia nace de un plan realista. Elige tu meta y calibra la dosis semanal que encaje sin fricción en tu vida.
          </p>
        </section>

        {/* Section 1: Selección de Objetivo */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2D6A4F]" />
              <span>1. Tu objetivo prioritario</span>
            </h2>
            <span className="text-xs text-[#707973]">Selecciona uno</span>
          </div>

          <div className="space-y-2.5">
            {GOAL_OPTIONS.map((goal) => {
              const isSelected = annualPlan.goalId === goal.id;
              const IconComp = goal.icon;

              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setMacroCycleGoal(goal.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-[#E7F3EC] border-[#2D6A4F] shadow-sm ring-1 ring-[#2D6A4F]'
                      : 'bg-white border-[#E1E3E4] hover:border-[#BFC9C1]'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-[#F3F4F5] text-[#404943]'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <strong className="text-sm font-bold text-[#191C1D]">
                        {goal.title}
                      </strong>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-[#2D6A4F] text-white'
                            : 'bg-[#EDEEEF] text-[#404943]'
                        }`}
                      >
                        {goal.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#404943] mt-1 leading-relaxed">
                      {goal.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Frecuencia, Días Específicos y Duración */}
        <section className="space-y-5 p-5 rounded-2xl bg-white border border-[#E1E3E4] shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2D6A4F]" />
                Días de entrenamiento por semana
              </span>
              <strong className="text-sm font-extrabold text-[#2D6A4F]">
                {annualPlan.daysPerWeek} días
              </strong>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {FREQUENCY_DAYS.map((days) => {
                const isSelected = annualPlan.daysPerWeek === days;
                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setWorkoutFrequency(days)}
                    className={`h-12 rounded-xl font-bold text-sm transition-all duration-150 flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-[#2D6A4F] text-white shadow-xs'
                        : 'bg-[#F3F4F5] text-[#191C1D] hover:bg-[#EDEEEF]'
                    }`}
                  >
                    <span>{days}</span>
                    <span className="text-[10px] font-normal opacity-80">días</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector de Días Específicos de la Semana con Validación */}
          <div className="pt-2 border-t border-[#F0F2F1]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-[#2D6A4F]" />
                ¿Qué días específicos entrenarás?
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isValidDaysCount
                    ? 'bg-[#E7F3EC] text-[#0F5238]'
                    : 'bg-[#FFE8E8] text-[#D32F2F]'
                }`}
              >
                {selectedDaysList.length} / {annualPlan.daysPerWeek} días
              </span>
            </div>

            <p className="text-[11px] text-[#555E58] mb-3 leading-relaxed">
              Solo estos días específicos se programarán en tu calendario y en la exportación para Google/Apple Calendar.
            </p>

            <div className="flex flex-wrap gap-2">
              {ALL_DAYS_OF_WEEK.map((day) => {
                const isChosen = selectedDaysList.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayChipClick(day)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                      isChosen
                        ? 'bg-[#2D6A4F] text-white shadow-xs ring-1 ring-[#2D6A4F]'
                        : 'bg-[#F3F4F5] text-[#404943] hover:bg-[#EDEEEF] border border-[#E1E3E4]'
                    }`}
                  >
                    {isChosen ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#BFC9C1]" />
                    )}
                    <span>{day}</span>
                  </button>
                );
              })}
            </div>

            {/* Validation Feedback Warning if count mismatch */}
            {!isValidDaysCount && (
              <div className="mt-3 p-2.5 rounded-xl bg-[#FFF4E5] border border-[#FFD8A8] flex items-center gap-2 text-xs text-[#8E4E14]">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#E76F51]" />
                <span>
                  {selectedDaysList.length < annualPlan.daysPerWeek
                    ? `Selecciona ${annualPlan.daysPerWeek - selectedDaysList.length} día(s) más para completar tu frecuencia.`
                    : `Has marcado más días de los programados (${annualPlan.daysPerWeek}). Desmarca los que no correspondan.`}
                </span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#F0F2F1]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2D6A4F]" />
                Minutos por sesión
              </span>
              <strong className="text-sm font-extrabold text-[#2D6A4F]">
                {annualPlan.minutesPerSession} minutos
              </strong>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SESSION_MINUTES.map((mins) => {
                const isSelected = annualPlan.minutesPerSession === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSessionDuration(mins)}
                    className={`h-12 rounded-xl font-bold text-sm transition-all duration-150 flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-[#2D6A4F] text-white shadow-xs'
                        : 'bg-[#F3F4F5] text-[#191C1D] hover:bg-[#EDEEEF]'
                    }`}
                  >
                    <span>{mins}</span>
                    <span className="text-[10px] font-normal opacity-80">min</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Asesor de Viabilidad Inteligente (Live Reactive) */}
        <section className="p-5 rounded-2xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-[#0F5238] uppercase tracking-wider">
                  {currentViability.title}
                </h3>
                <span className="text-xs text-[#404943]">
                  Cálculo adaptativo en tiempo real
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#2D6A4F] text-white shadow-2xs">
                {currentViability.adherencePercentage}% Adherencia
              </span>
            </div>
          </div>

          <p className="text-xs text-[#2A3E33] leading-relaxed">
            {currentViability.description}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="p-3 bg-white/90 rounded-xl border border-[#B1F0CE]/50">
              <span className="text-[#707973] block text-[11px]">Volumen Mensual</span>
              <strong className="text-base font-extrabold text-[#0F5238]">
                {currentViability.monthlyHours} horas / mes
              </strong>
            </div>
            <div className="p-3 bg-white/90 rounded-xl border border-[#B1F0CE]/50">
              <span className="text-[#707973] block text-[11px]">Carga Articular</span>
              <strong className="text-base font-extrabold text-[#0F5238]">
                Segura y Progresiva
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#2D6A4F] font-medium pt-1">
            <Flame className="w-3.5 h-3.5 shrink-0 text-[#E76F51]" />
            <span>{currentViability.recommendationNote}</span>
          </div>
        </section>

        {/* Section 4: Las 4 Fases Trimestrales del Año (Colapsado por defecto) */}
        <section className="pt-1">
          <button
            type="button"
            onClick={() => setShowPhasesDetails((prev) => !prev)}
            className="w-full p-3.5 rounded-2xl bg-white border border-[#E1E3E4] hover:border-[#2D6A4F] text-left flex items-center justify-between transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
                <CalendarDays className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#191C1D] group-hover:text-[#2D6A4F] transition-colors block">
                  Estructura de las 52 semanas del año
                </span>
                <span className="text-[11px] text-[#707973]">
                  {showPhasesDetails ? 'Toca para ocultar fases' : 'Opcional • Toca para ver las 4 fases del año'}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#707973] transition-transform duration-200 ${
                showPhasesDetails ? 'rotate-180 text-[#2D6A4F]' : ''
              }`}
            />
          </button>

          {showPhasesDetails && (
            <div className="space-y-3 mt-3 pt-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#191C1D]">
                  Distribución Trimestral (Q1 a Q4)
                </span>
                <span className="text-xs text-[#2D6A4F] font-bold">52 Semanas</span>
              </div>

              {annualPlan.phases.map((phase, idx) => (
                <div
                  key={phase.quarter}
                  className="p-4 rounded-2xl bg-white border border-[#E1E3E4] flex items-start gap-3.5 relative overflow-hidden"
                >
                  {/* Accent indicator line */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ backgroundColor: phase.accentColor }}
                  />

                  <div className="w-10 h-10 rounded-xl bg-[#F3F4F5] flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-extrabold text-[#191C1D]">
                      {phase.quarter}
                    </span>
                    <span className="text-[9px] text-[#707973]">Fase {idx + 1}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-bold text-[#191C1D]">
                        {phase.title}
                      </strong>
                      <span className="text-[10px] text-[#707973] font-medium">
                        {phase.monthsRange}
                      </span>
                    </div>
                    <p className="text-xs text-[#404943] mt-1 leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Fixed Bottom Bar with 56px Action Button */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#EDEEEF] p-4 z-40 shadow-lg">
        <button
          type="button"
          onClick={handleConfirmPlan}
          disabled={!isValidDaysCount}
          className={`w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-md transition-all duration-200 ${
            isValidDaysCount
              ? 'bg-[#2D6A4F] text-white hover:bg-[#0F5238] active:scale-[0.98]'
              : 'bg-[#E1E3E4] text-[#707973] cursor-not-allowed'
          }`}
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>
            {isValidDaysCount
              ? 'Confirmar mi Plan y Comenzar'
              : `Marca ${annualPlan.daysPerWeek} días para continuar`}
          </span>
          {isValidDaysCount && <ArrowRight className="w-5 h-5 ml-1" />}
        </button>
      </footer>
    </div>
  );
};
