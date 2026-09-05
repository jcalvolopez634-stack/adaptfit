/**
 * AdaptFit - Pantalla 4: Modo "Día Bajo de Energía" (Detalle y Activación)
 * Rutina ultracorta reparadora de 7 minutos sentada con cero impacto articular,
 * descompresión del sistema nervioso y protección total de la racha sin exigencia de rendimiento.
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Moon,
  ShieldCheck,
  Armchair,
  Sparkles,
  Heart,
  Clock,
  CheckCircle2,
  Play,
  Wind,
  Smile,
} from 'lucide-react';

export const LowEnergyScreen: React.FC = () => {
  const {
    isLowEnergyActive,
    toggleLowEnergyDayMode,
    startWorkoutSession,
    navigateTo,
    goBack,
  } = useApp();

  const handleStart7MinSession = () => {
    // Ensure low energy mode is active
    if (!isLowEnergyActive) {
      toggleLowEnergyDayMode(true);
    }
    startWorkoutSession(true);
    navigateTo('workout_active');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-28">
      {/* Top Header with Back Navigation */}
      <header className="px-5 pt-6 pb-4 bg-white border-b border-[#EDEEEF] sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] active:scale-95 flex items-center justify-center text-[#191C1D] transition-all"
            title="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDCC4] text-[#8E4E14] text-xs font-bold">
            <Moon className="w-3.5 h-3.5" />
            <span>Modo 7 Minutos</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="px-5 pt-6 space-y-6 flex-1">
        {/* Hero Section */}
        <section className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Tu Racha Está 100% Protegida</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#191C1D] leading-tight font-headline">
            Entrenar sin forzarte también es constancia
          </h1>
          <p className="text-sm text-[#404943] leading-relaxed">
            Hay días donde el cuerpo pide calma. Este modo sustituye la rutina exigente por 7 minutos de movilidad sedente y respiración profunda. Protege tu hábito sin desgastarte.
          </p>
        </section>

        {/* 3 Pillars of Low Energy Mode */}
        <section className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-white rounded-2xl border border-[#E1E3E4] shadow-2xs flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center mb-1.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <strong className="text-xs font-bold text-[#191C1D]">Racha intacta</strong>
            <span className="text-[10px] text-[#707973] mt-0.5">Suma al macrociclo</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#E1E3E4] shadow-2xs flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-[#FFF6ED] text-[#F4A261] flex items-center justify-center mb-1.5">
              <Armchair className="w-4 h-4 text-[#8E4E14]" />
            </div>
            <strong className="text-xs font-bold text-[#191C1D]">100% sentado</strong>
            <span className="text-[10px] text-[#707973] mt-0.5">Cero peso articular</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#E1E3E4] shadow-2xs flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center mb-1.5">
              <Wind className="w-4 h-4" />
            </div>
            <strong className="text-xs font-bold text-[#191C1D]">Descompresión</strong>
            <span className="text-[10px] text-[#707973] mt-0.5">Baja el estrés</span>
          </div>
        </section>

        {/* Exercises Sequence (3 restorative movements) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2D6A4F]" />
              Secuencia de los 7 Minutos
            </h2>
            <span className="text-xs text-[#707973]">3 ejercicios suaves</span>
          </div>

          <div className="space-y-2.5">
            {/* Exercise 1 */}
            <div className="p-4 rounded-2xl bg-white border border-[#E1E3E4] flex items-start gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#E7F3EC] text-[#0F5238] font-bold text-sm flex items-center justify-center shrink-0">
                1
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-[#191C1D]">
                    Movilidad Cervical y Hombros
                  </strong>
                  <span className="text-xs font-extrabold text-[#2D6A4F]">
                    2 min
                  </span>
                </div>
                <p className="text-xs text-[#404943] mt-1 leading-relaxed">
                  Rotaciones y aperturas de pecho sentada para disolver la tensión en cuello y trapecios.
                </p>
              </div>
            </div>

            {/* Exercise 2 */}
            <div className="p-4 rounded-2xl bg-white border border-[#E1E3E4] flex items-start gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#E7F3EC] text-[#0F5238] font-bold text-sm flex items-center justify-center shrink-0">
                2
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-[#191C1D]">
                    Extensión Suave de Rodilla
                  </strong>
                  <span className="text-xs font-extrabold text-[#2D6A4F]">
                    2.5 min
                  </span>
                </div>
                <p className="text-xs text-[#404943] mt-1 leading-relaxed">
                  Sin cargar peso corporal. Lubrica cartílagos rotulianos y activa la circulación en piernas.
                </p>
              </div>
            </div>

            {/* Exercise 3 */}
            <div className="p-4 rounded-2xl bg-white border border-[#E1E3E4] flex items-start gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#E7F3EC] text-[#0F5238] font-bold text-sm flex items-center justify-center shrink-0">
                3
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-[#191C1D]">
                    Respiración Diafragmática
                  </strong>
                  <span className="text-xs font-extrabold text-[#2D6A4F]">
                    2.5 min
                  </span>
                </div>
                <p className="text-xs text-[#404943] mt-1 leading-relaxed">
                  Descompresión de la columna lumbar apoyando la espalda por completo en el respaldo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Psychological safety note */}
        <div className="p-4 rounded-2xl bg-[#FFF6ED] border border-[#FFDCC4] flex items-start gap-3">
          <Smile className="w-5 h-5 text-[#8E4E14] shrink-0 mt-0.5" />
          <p className="text-xs text-[#8E4E14] leading-relaxed">
            <strong>Sin culpa:</strong> Escuchar a tu cuerpo y optar por una versión suave es la clave para no abandonar a las 3 semanas. La victoria es aparecer.
          </p>
        </div>
      </main>

      {/* Fixed Bottom Action Bar with 56px Button */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#EDEEEF] p-4 z-40 shadow-lg">
        <button
          type="button"
          onClick={handleStart7MinSession}
          className="w-full h-14 rounded-2xl bg-[#F4A261] text-[#191C1D] font-extrabold text-base hover:bg-[#E76F51] hover:text-white active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-md transition-all duration-200"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Comenzar Sesión de 7 Minutos</span>
        </button>
      </footer>
    </div>
  );
};
