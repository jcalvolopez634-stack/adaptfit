/**
 * AdaptFit - Pantalla 11: El Camino del Año (Macrociclo de 52 Semanas)
 * Visualización interactiva de los 4 Mundos del Macrociclo:
 * 1. Adaptación y Hábito (1-12)
 * 2. Fuerza Base (13-24)
 * 3. Movilidad Funcional (25-36)
 * 4. Autonomía Total (37-52)
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Play,
  Flame,
  Award,
} from 'lucide-react';

export const YearRoadScreen: React.FC = () => {
  const {
    roadStages,
    streakWeeks,
    restShield,
    navigateTo,
    goBack,
  } = useApp();

  const worlds = [
    {
      number: 1,
      title: 'Mundo 1: Despertar Articular y Hábito',
      weeks: 'Semanas 1 - 12',
      badge: 'En progreso',
      description: 'Activación suave, confianza corporal y consolidación de la rutina sin dolor.',
      active: true,
    },
    {
      number: 2,
      title: 'Mundo 2: Fuerza Base y Estabilidad',
      weeks: 'Semanas 13 - 24',
      badge: 'Próximo',
      description: 'Desarrollo de tono muscular protector en piernas, core y espalda.',
      active: false,
    },
    {
      number: 3,
      title: 'Mundo 3: Movilidad y Resistencia Funcional',
      weeks: 'Semanas 25 - 36',
      badge: 'Bloqueado',
      description: 'Amplitud de movimiento, pasos más firmes y menor fatiga cotidiana.',
      active: false,
    },
    {
      number: 4,
      title: 'Mundo 4: Autonomía y Vitalidad Plena',
      weeks: 'Semanas 37 - 52',
      badge: 'Meta Anual',
      description: 'Cuerpo ágil, seguro y libre para disfrutar de tu vida diaria.',
      active: false,
    },
  ];

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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigateTo('rest_shield')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF6ED] text-[#8E4E14] text-xs font-bold hover:bg-[#F4A261] hover:text-white transition-all"
            >
              {restShield.isActive ? (
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-[#F4A261]" />
              )}
              <span>Escudo</span>
            </button>

            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238] text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Semana {streakWeeks} de 52</span>
            </div>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F]">
            El Camino del Año
          </span>
          <h1 className="text-xl font-black text-[#191C1D] leading-tight mt-0.5">
            Macrociclo Adaptativo
          </h1>
          <p className="text-xs text-[#707973] mt-0.5">
            52 semanas divididas en 4 etapas diseñadas para respetar tu ritmo biológico.
          </p>
        </div>
      </header>

      {/* Main Body */}
      <main className="px-5 pt-5 space-y-6 flex-1">
        {/* Current Active Week Stage Nodes */}
        <section className="p-4 rounded-3xl bg-white border border-[#E1E3E4] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D]">
              Etapa Actual: Despertar Articular
            </h2>
            <span className="text-[10px] font-extrabold text-[#2D6A4F] px-2 py-0.5 rounded-full bg-[#E7F3EC]">
              Mundo 1
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {roadStages.map((stage) => {
              const isDone = stage.status === 'completado';
              const isCur = stage.isCurrent;

              return (
                <div
                  key={stage.weekNumber}
                  className={`p-3 rounded-2xl text-center border flex flex-col items-center justify-between min-h-[96px] transition-all ${
                    isCur
                      ? 'bg-[#FFF6ED] border-[#F4A261] ring-2 ring-[#F4A261]/20 shadow-xs'
                      : isDone
                      ? 'bg-[#E7F3EC] border-[#B1F0CE]'
                      : 'bg-[#F8F9FA] border-[#EDEEEF] opacity-60'
                  }`}
                >
                  <span className="text-[10px] font-bold text-[#707973]">
                    Sem {stage.weekNumber}
                  </span>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center my-1 ${
                      isDone
                        ? 'bg-[#2D6A4F] text-white'
                        : isCur
                        ? 'bg-[#F4A261] text-white animate-pulse'
                        : 'bg-[#E1E3E4] text-[#707973]'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCur ? (
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                  </div>

                  <span className="text-[9px] font-extrabold text-[#191C1D] line-clamp-1">
                    {stage.title}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* The 4 Worlds Visual Cards */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D]">
              Los 4 Mundos del Año
            </h2>
            <span className="text-xs text-[#707973]">Visión a largo plazo</span>
          </div>

          <div className="space-y-3">
            {worlds.map((w) => (
              <div
                key={w.number}
                className={`p-4 rounded-3xl border transition-all shadow-xs ${
                  w.active
                    ? 'bg-gradient-to-br from-[#E7F3EC] to-white border-[#2D6A4F]'
                    : 'bg-white border-[#E1E3E4]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-[#2D6A4F] uppercase tracking-wider">
                    {w.weeks}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      w.active
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-[#F3F4F5] text-[#707973]'
                    }`}
                  >
                    {w.badge}
                  </span>
                </div>

                <h3 className="text-sm font-black text-[#191C1D] leading-tight">
                  {w.title}
                </h3>
                <p className="text-xs text-[#404943] leading-relaxed mt-1">
                  {w.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Button: 56px Primary Button */}
        <button
          type="button"
          onClick={() => navigateTo('workout_active')}
          className="w-full h-14 rounded-2xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md transition-all duration-200"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Continuar Sesión de Hoy (Semana {streakWeeks})</span>
        </button>
      </main>
    </div>
  );
};
