/**
 * AdaptFit - Ficha Pedagógica y Desglose Biomecánico
 * 1. Una sola imagen de referencia o icono representativo de la postura general.
 * 2. Insignia destacada indicando el "Grupo Muscular Principal".
 * 3. Desglose pedagógico en texto: Paso 0 (Colocación), Pasos 1-2-3 (Ejecución),
 *    Dónde notarlo (Mapeo Sensorial Consciente) y Errores comunes a evitar.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Check,
  Activity,
  HeartHandshake,
  ShieldCheck,
  Layers,
  Dumbbell,
} from 'lucide-react';

export const PedagogicalGuideScreen: React.FC = () => {
  const {
    activeWorkout,
    setWorkoutIntensityMode,
    navigateTo,
    goBack,
  } = useApp();

  const currentExercise = activeWorkout.currentExercise;
  const isAdaptedMode = activeWorkout.intensityMode === 'adaptada';

  const handleToggleMode = (mode: 'adaptada' | 'estandar') => {
    setWorkoutIntensityMode(mode);
  };

  const handleReturnToWorkout = () => {
    navigateTo('workout_active');
  };

  const targetMuscle = currentExercise?.targetMuscleGroup || currentExercise?.targetMuscles?.[0] || 'Musculatura Principal';

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-32">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 bg-white border-b border-[#EDEEEF] sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] active:scale-95 flex items-center justify-center text-[#191C1D] transition-all"
            title="Volver a la sesión"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238] text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Ficha Técnica Pedagógica</span>
          </div>
        </div>

        <div className="mt-3">
          <h1 className="text-lg font-black text-[#191C1D] leading-tight">
            {currentExercise?.name || currentExercise?.title || 'Guía del Ejercicio'}
          </h1>
          <p className="text-xs text-[#707973] mt-0.5">
            {currentExercise?.subtitle || 'Pautas biomecánicas claras y sin confusión para entrenar seguro.'}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 pt-4 space-y-4 flex-1">
        {/* Toggle: Versión Adaptada vs Estándar */}
        <div className="p-1 bg-[#EDEEEF] rounded-2xl flex items-center justify-between shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggleMode('adaptada')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              isAdaptedMode
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#404943] hover:text-[#191C1D]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Versión Asistida / Silla</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleMode('estandar')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              !isAdaptedMode
                ? 'bg-white text-[#191C1D] shadow-xs'
                : 'text-[#404943] hover:text-[#191C1D]'
            }`}
          >
            <span>Versión Estándar</span>
          </button>
        </div>

        {/* 1. UNA SOLA IMAGEN DE REFERENCIA DE LA POSTURA GENERAL */}
        <section className="rounded-3xl bg-white border border-[#E1E3E4] p-4 space-y-3.5 shadow-xs">
          <div className="relative rounded-2xl overflow-hidden bg-[#F3F4F5] border border-[#E1E3E4] aspect-16/9 shadow-inner">
            <img
              src={
                currentExercise?.singleReferenceImage ||
                currentExercise?.mainCoverIllustration ||
                currentExercise?.steps?.[0]?.previewUrl ||
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'
              }
              alt={currentExercise?.name || currentExercise?.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Gradiente sutil para legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Insignia de modo activo */}
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-3 h-3 text-[#B1F0CE]" />
              <span>{isAdaptedMode ? 'Variante con Apoyo' : 'Postura Estándar'}</span>
            </div>

            {/* Equipamiento */}
            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#191C1D] text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
              <Dumbbell className="w-3 h-3 text-[#2D6A4F]" />
              <span>{currentExercise?.requiredEquipment || 'Peso Corporal'}</span>
            </div>
          </div>

          {/* 2. INSIGNIA DESTACADA: GRUPO MUSCULAR PRINCIPAL */}
          <div className="p-3 rounded-2xl bg-[#E7F3EC] border border-[#B1F0CE] flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F5238] block">
                  Grupo Muscular Principal
                </span>
                <span className="text-sm font-black text-[#191C1D]">
                  {targetMuscle}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/80 text-[#0F5238] border border-[#B1F0CE]">
              {currentExercise?.impactLevel === 'ZERO'
                ? 'Cero Impacto'
                : currentExercise?.impactLevel === 'LOW'
                ? 'Bajo Impacto'
                : 'Fuerza Controlada'}
            </span>
          </div>
        </section>

        {/* 3. DESGLOSE PEDAGÓGICO EN TEXTO */}
        <section className="space-y-3">
          {/* Paso 0: Colocación Inicial */}
          <div className="p-4 rounded-3xl bg-white border border-[#E1E3E4] space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#2D6A4F]">
              <span className="w-6 h-6 rounded-full bg-[#2D6A4F] text-white text-xs font-black flex items-center justify-center shrink-0">
                0
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#191C1D]">
                Paso 0: Colocación inicial
              </h3>
            </div>
            <p className="text-xs text-[#404943] leading-relaxed pl-8">
              {currentExercise?.setupStep0 ||
                currentExercise?.steps?.[0]?.description ||
                'Adopta una postura estable y cómoda. Si necesitas apoyo, coloca una silla firme a mano.'}
            </p>
          </div>

          {/* Pasos 1, 2 y 3 de Ejecución */}
          <div className="p-4 rounded-3xl bg-white border border-[#E1E3E4] space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-[#707973]">
              <Layers className="w-4 h-4 text-[#2D6A4F]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#191C1D]">
                Pasos 1-2-3 de Ejecución
              </h3>
            </div>

            <div className="space-y-2.5 pl-1">
              {/* Paso 1 */}
              <div className="flex items-start gap-2.5 text-xs">
                <span className="w-5 h-5 rounded-full bg-[#EDEEEF] text-[#191C1D] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="text-[#191C1D] leading-relaxed">
                  <strong className="font-bold text-[#2D6A4F]">Inicio de movimiento: </strong>
                  <span>
                    {currentExercise?.steps1To3?.[0] ||
                      currentExercise?.steps?.[1]?.description ||
                      'Comienza despacio sin tirones, manteniendo la mirada al frente.'}
                  </span>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="flex items-start gap-2.5 text-xs">
                <span className="w-5 h-5 rounded-full bg-[#EDEEEF] text-[#191C1D] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="text-[#191C1D] leading-relaxed">
                  <strong className="font-bold text-[#2D6A4F]">Punto de esfuerzo: </strong>
                  <span>
                    {currentExercise?.steps1To3?.[1] ||
                      currentExercise?.steps?.[2]?.description ||
                      'Mantén la tensión muscular controlada 1-2 segundos en el punto de mayor activación.'}
                  </span>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="flex items-start gap-2.5 text-xs">
                <span className="w-5 h-5 rounded-full bg-[#EDEEEF] text-[#191C1D] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="text-[#191C1D] leading-relaxed">
                  <strong className="font-bold text-[#2D6A4F]">Retorno y respiración: </strong>
                  <span>
                    {currentExercise?.steps1To3?.[2] ||
                      currentExercise?.steps?.[3]?.description ||
                      'Regresa de forma suave a la posición inicial soltando el aire.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dónde Notarlo (Mapeo Sensorial Consciente) */}
          <div className="p-4 rounded-3xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#0F5238]">
              <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0F5238]">
                Dónde debes notarlo
              </h3>
            </div>
            <p className="text-xs text-[#0F5238] font-medium leading-relaxed pl-6">
              {currentExercise?.whereToFeel ||
                currentExercise?.sensoryMapping ||
                `El trabajo principal debe sentirse en ${targetMuscle}. Si sientes tensión o molestia articular, reduce el rango.`}
            </p>
          </div>

          {/* Errores Comunes a Evitar */}
          <div className="p-4 rounded-3xl bg-[#FFF6ED] border border-[#FFDCC4] space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#B45309]">
              <AlertTriangle className="w-4 h-4 text-[#E76F51] shrink-0" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#8E4E14]">
                Errores comunes a evitar
              </h3>
            </div>
            <ul className="text-xs text-[#8E4E14] space-y-1 pl-6 list-disc list-outside">
              {currentExercise?.commonMistakes && currentExercise.commonMistakes.length > 0 ? (
                currentExercise.commonMistakes.map((mistake, i) => (
                  <li key={i} className="leading-relaxed">
                    {mistake}
                  </li>
                ))
              ) : (
                <li className="leading-relaxed">
                  {currentExercise?.avoidError?.description ||
                    'Evitar perder la alineación postural o realizar rebotes articulares.'}
                </li>
              )}
            </ul>
          </div>
        </section>

        {/* Consejo Técnico Reasegurador */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#EDEEEF] flex items-center gap-2.5 shadow-2xs">
          <HeartHandshake className="w-4 h-4 text-[#2D6A4F] shrink-0" />
          <span className="text-xs text-[#525B54]">
            Calidad sobre repeticiones: si te fatigas, tómate una pausa y continúa con técnica perfecta.
          </span>
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#EDEEEF] p-4 z-40 shadow-lg">
        <button
          type="button"
          onClick={handleReturnToWorkout}
          className="w-full h-14 rounded-2xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md transition-all duration-200"
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>Entendido, volver al ejercicio</span>
        </button>
      </footer>
    </div>
  );
};
