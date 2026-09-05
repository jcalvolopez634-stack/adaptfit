/**
 * AdaptFit - Pantalla 5: Sesión Activa con Motor de 3 Series y Fase de Preparación Previa
 * 1. Fase de Comprensión Previa (PREPARATION): Cronómetro detenido en 0, desglose de postura y pasos, botón 56px "¡Entendido, empezar Serie 1!".
 * 2. Estructura de 3 Series Obligatorias: Badge "Serie X de 3", botón "Serie completada" durante el ejercicio.
 * 3. Descansos Interactivos (REST): Cuenta regresiva automática (45-60s) con opción "Saltar descanso".
 * 4. Audio-guía por voz, avisos sonoros (Web Audio API), Botón de Pánico y Ficha Pedagógica.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PanicSwapModal } from './PanicSwapModal';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ShieldAlert,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Layers,
  Activity,
  AlertTriangle,
  ShieldCheck,
  FastForward,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Flame,
  Dumbbell,
  TrendingUp,
  Plus,
  Minus,
} from 'lucide-react';

// Web Audio API chimes generator
function playChime(frequency = 587.33, durationMs = 200) {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // Audio policy fallback
  }
}

// Speech synthesis coach
function speakGuidance(text: string) {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  } catch {
    // Speech synthesis fallback
  }
}

export const ActiveWorkoutScreen: React.FC = () => {
  const {
    activeWorkout,
    togglePlayPauseWorkout,
    resetExerciseTimer,
    setWorkoutIntensityMode,
    nextExercise,
    previousExercise,
    toggleAudioGuide,
    openPanicReplacementModal,
    startActiveSet,
    completeCurrentSet,
    skipRest,
    setConfiguredRestDuration,
    setCurrentSetReps,
    setCurrentSetWeightKg,
    getPreviousExercisePerformance,
    userProfile,
    navigateTo,
    goBack,
  } = useApp();

  const [isSensoryAccordionOpen, setIsSensoryAccordionOpen] = useState(false);

  const prevSecondsRef = useRef(activeWorkout.secondsRemaining);
  const prevRestRef = useRef(activeWorkout.restSecondsRemaining);
  const prevPhaseRef = useRef(activeWorkout.executionPhase);

  const currentExercise = activeWorkout.currentExercise;
  const isAdapted = activeWorkout.intensityMode === 'adaptada';
  const totalExercises = activeWorkout.workoutList.length || 1;
  const currentExNumber = (activeWorkout.exerciseIndex || 0) + 1;

  const phase = activeWorkout.executionPhase || 'PREPARATION';
  const currentSet = activeWorkout.currentSet || 1;
  const totalSets = activeWorkout.totalSets || 3;
  const restRemaining = activeWorkout.restSecondsRemaining ?? 45;
  const configuredRest = activeWorkout.configuredRestDuration ?? 45;

  const currentReps = activeWorkout.currentSetRepsInput ?? 10;
  const currentWeightKg = activeWorkout.currentSetWeightKgInput ?? 0;
  const recordedSetsForExercise =
    (currentExercise?.id && activeWorkout.recordedSets?.[currentExercise.id]) || [];
  const exercisePerf = currentExercise?.id
    ? getPreviousExercisePerformance(currentExercise.id)
    : null;

  const availableWeights =
    userProfile.availableWeightsKg && userProfile.availableWeightsKg.length > 0
      ? [...userProfile.availableWeightsKg].sort((a, b) => a - b)
      : [1, 2, 3, 4, 5];

  const handleRepsChange = (delta: number) => {
    setCurrentSetReps(Math.max(1, currentReps + delta));
  };

  const handleWeightChange = (delta: number) => {
    // Si el usuario tiene una lista de pesos disponibles, saltar al peso inmediatamente superior o inferior
    if (delta > 0) {
      const higherWeights = availableWeights.filter((w) => w > currentWeightKg);
      if (higherWeights.length > 0) {
        setCurrentSetWeightKg(higherWeights[0]);
      } else {
        // Incremento normal de 0.5kg
        setCurrentSetWeightKg(Number((currentWeightKg + 0.5).toFixed(1)));
      }
    } else {
      const lowerWeights = availableWeights.filter((w) => w < currentWeightKg);
      if (lowerWeights.length > 0) {
        setCurrentSetWeightKg(lowerWeights[lowerWeights.length - 1]);
      } else {
        setCurrentSetWeightKg(Math.max(0, Number((currentWeightKg - 0.5).toFixed(1))));
      }
    }
  };

  // Sound tone effect when active seconds or rest reach 3, 2, 1 and 0
  useEffect(() => {
    if (activeWorkout.isPlaying) {
      if (phase === 'SET_ACTIVE') {
        const s = activeWorkout.secondsRemaining;
        if (s === 3 || s === 2 || s === 1) {
          playChime(440, 100);
        } else if (s === 0 && prevSecondsRef.current > 0) {
          playChime(659.25, 250);
          setTimeout(() => playChime(880, 350), 200);
        }
      } else if (phase === 'REST') {
        const r = activeWorkout.restSecondsRemaining;
        if (r === 3 || r === 2 || r === 1) {
          playChime(523.25, 100);
        } else if (r === 0 && prevRestRef.current > 0) {
          playChime(587.33, 250);
          setTimeout(() => playChime(880, 350), 200);
        }
      }
    }
    prevSecondsRef.current = activeWorkout.secondsRemaining;
    prevRestRef.current = activeWorkout.restSecondsRemaining;
  }, [activeWorkout.secondsRemaining, activeWorkout.restSecondsRemaining, activeWorkout.isPlaying, phase]);

  // Audio guide speech synthesis cue on phase switch or exercise change
  useEffect(() => {
    if (!activeWorkout.isAudioGuideActive || !currentExercise) return;

    if (phase === 'PREPARATION') {
      const muscleCue = currentExercise.targetMuscleGroup
        ? `Foco principal: ${currentExercise.targetMuscleGroup}.`
        : '';
      const setupCue =
        currentExercise.setupStep0 ||
        currentExercise.steps?.[0]?.description ||
        'Colócate en postura estable y neutra.';
      speakGuidance(
        `Fase de preparación. ${currentExercise.name || currentExercise.title}. ${muscleCue} ${setupCue}. Tómate tu tiempo para colocarte.`
      );
    } else if (phase === 'SET_ACTIVE' && prevPhaseRef.current !== 'SET_ACTIVE') {
      speakGuidance(
        `Serie ${currentSet} iniciada. Mantén el ritmo controlado y la respiración suave.`
      );
    } else if (phase === 'REST' && prevPhaseRef.current !== 'REST') {
      speakGuidance(
        `Serie ${currentSet} completada. Descanso iniciado de ${configuredRest} segundos. Inhala hondo y relaja hombros.`
      );
    }

    prevPhaseRef.current = phase;
  }, [
    phase,
    currentSet,
    currentExercise?.id,
    activeWorkout.isAudioGuideActive,
    configuredRest,
    currentExercise,
  ]);

  const handleNextOrFinish = () => {
    if (currentExNumber >= totalExercises) {
      navigateTo('post_workout_feedback');
    } else {
      nextExercise();
    }
  };

  // Circular timer calculation
  const totalDuration = currentExercise?.durationSeconds || 45;
  const remaining = activeWorkout.secondsRemaining;
  const progressRatio = totalDuration > 0 ? remaining / totalDuration : 0;
  const strokeRadius = 58;
  const circumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  // Rest circular timer calculation
  const restRatio = configuredRest > 0 ? restRemaining / configuredRest : 0;
  const restDashoffset = circumference * (1 - restRatio);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-32 relative">
      {/* Top Header: Phase Progress and Indicators */}
      <header className="px-5 pt-6 pb-4 bg-white border-b border-[#EDEEEF] sticky top-0 z-30 shadow-xs">
        {/* Navigation & Controls bar */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#191C1D] flex items-center justify-center transition-all"
            title="Volver al inicio"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Badge de Serie Actual */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238] text-xs font-black shadow-2xs border border-[#B1F0CE]">
            <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Serie {currentSet} de {totalSets}</span>
          </div>

          {/* Audio Guide Toggle */}
          <button
            type="button"
            onClick={toggleAudioGuide}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              activeWorkout.isAudioGuideActive
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'bg-[#F3F4F5] text-[#707973]'
            }`}
            title={activeWorkout.isAudioGuideActive ? 'Audio-guía activa' : 'Activar voz'}
          >
            {activeWorkout.isAudioGuideActive ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* 3-Phase Track Bar (Calentamiento -> Principal -> Vuelta a la Calma) */}
        <div className="space-y-1.5 mb-2">
          <div className="flex justify-between text-[11px] font-bold text-[#707973]">
            <span
              className={
                activeWorkout.currentBlock === 'calentamiento'
                  ? 'text-[#2D6A4F] font-extrabold'
                  : ''
              }
            >
              1. Calentamiento
            </span>
            <span
              className={
                activeWorkout.currentBlock === 'principal'
                  ? 'text-[#2D6A4F] font-extrabold'
                  : ''
              }
            >
              2. Principal
            </span>
            <span
              className={
                activeWorkout.currentBlock === 'vuelta_a_la_calma'
                  ? 'text-[#2D6A4F] font-extrabold'
                  : ''
              }
            >
              3. Calma
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                activeWorkout.currentBlock === 'calentamiento'
                  ? 'bg-[#2D6A4F]'
                  : activeWorkout.currentBlock === 'principal' ||
                    activeWorkout.currentBlock === 'vuelta_a_la_calma'
                  ? 'bg-[#2D6A4F]'
                  : 'bg-[#EDEEEF]'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all ${
                activeWorkout.currentBlock === 'principal'
                  ? 'bg-[#2D6A4F]'
                  : activeWorkout.currentBlock === 'vuelta_a_la_calma'
                  ? 'bg-[#2D6A4F]'
                  : 'bg-[#EDEEEF]'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all ${
                activeWorkout.currentBlock === 'vuelta_a_la_calma'
                  ? 'bg-[#2D6A4F]'
                  : 'bg-[#EDEEEF]'
              }`}
            />
          </div>
        </div>

        {/* Header Indicators: Exercise Counter & Series Status */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5">
            {currentExNumber > 1 && (
              <button
                type="button"
                onClick={previousExercise}
                className="text-[#707973] hover:text-[#191C1D] flex items-center gap-0.5 text-[11px] font-bold"
                title="Ejercicio anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Ant.</span>
              </button>
            )}
            <span className="font-extrabold text-[#191C1D]">
              Ejercicio {currentExNumber} de {totalExercises}
            </span>
            {currentExNumber < totalExercises && (
              <button
                type="button"
                onClick={nextExercise}
                className="text-[#707973] hover:text-[#191C1D] flex items-center gap-0.5 text-[11px] font-bold ml-1"
                title="Siguiente ejercicio"
              >
                <span>Sig.</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalSets }).map((_, idx) => {
              const setNum = idx + 1;
              const isCompleted = setNum < currentSet;
              const isCurrent = setNum === currentSet;
              return (
                <div
                  key={idx}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                    isCompleted
                      ? 'bg-[#2D6A4F] text-white'
                      : isCurrent
                      ? 'bg-[#B1F0CE] text-[#0F5238] ring-2 ring-[#2D6A4F]'
                      : 'bg-[#EDEEEF] text-[#707973]'
                  }`}
                >
                  {isCompleted ? '✓' : setNum}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="px-5 pt-4 space-y-5 flex-1">
        {/* ========================================================= */}
        {/* CONDITIONAL RENDER: REST PHASE (Descanso Interactivo)     */}
        {/* ========================================================= */}
        {phase === 'REST' ? (
          <div className="space-y-4">
            {/* Banner de Descanso */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-[#E7F3EC] to-[#D4EDE0] border border-[#B1F0CE] text-center space-y-2 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#0F5238] text-xs font-black shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Descanso Activo • Entre Serie {currentSet} y {currentSet + 1}</span>
              </div>

              <h2 className="text-xl font-black text-[#0F5238]">
                ¡Serie {currentSet} completada con éxito!
              </h2>

              <p className="text-xs text-[#2D6A4F] max-w-xs mx-auto leading-relaxed">
                Inhala hondo por la nariz y exhala suavemente. Permite que tus articulaciones y fibras musculares recuperen energía antes de la siguiente serie.
              </p>
            </div>

            {/* Circular Rest Countdown Timer - Gran Legibilidad a Distancia */}
            <div className="p-6 rounded-3xl bg-white border border-[#E1E3E4] flex flex-col items-center justify-center space-y-5 shadow-xs">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r={strokeRadius}
                    className="stroke-[#EDEEEF]"
                    strokeWidth="9"
                    fill="transparent"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r={strokeRadius}
                    className="stroke-[#2D6A4F] transition-all duration-1000 ease-linear"
                    strokeWidth="9"
                    strokeDasharray={circumference}
                    strokeDashoffset={restDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-5xl font-black text-[#0F5238] tracking-tight font-mono">
                    {restRemaining}s
                  </span>
                  <span className="text-xs uppercase tracking-wider font-extrabold text-[#2D6A4F] mt-1">
                    Recuperando
                  </span>
                </div>
              </div>

              {/* Guía de Respiración Rítmica */}
              <div className="w-full max-w-xs p-3 rounded-2xl bg-[#E7F3EC]/70 border border-[#B1F0CE] text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#0F5238]">
                  <Heart className="w-3.5 h-3.5 text-[#2D6A4F] animate-pulse" />
                  <span>Respiración Consciente</span>
                </div>
                <p className="text-[11px] text-[#0F5238] leading-tight">
                  Inhala en 4s expandiendo el abdomen... exhala en 4s relajando hombros.
                </p>
              </div>

              {/* Selector de Duración de Descanso Rápido */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-xs font-bold text-[#707973] mr-1">Duración:</span>
                {[30, 45, 60, 90].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setConfiguredRestDuration(dur)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      configuredRest === dur
                        ? 'bg-[#2D6A4F] text-white shadow-2xs'
                        : 'bg-[#F3F4F5] text-[#525B54] hover:bg-[#EDEEEF]'
                    }`}
                  >
                    {dur}s
                  </button>
                ))}
              </div>

              {/* Botón para saltar descanso inmediatamente */}
              <button
                type="button"
                onClick={skipRest}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#E7F3EC] hover:bg-[#D4EDE0] text-[#0F5238] font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-[#B1F0CE]"
              >
                <FastForward className="w-4 h-4 text-[#2D6A4F]" />
                <span>Saltar descanso si ya estás listo</span>
              </button>
            </div>

            {/* Tarjeta de Próxima Serie */}
            <div className="p-4 rounded-2xl bg-white border border-[#E1E3E4] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#707973]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#2D6A4F]" />
                  <span>Próxima: Serie {currentSet + 1} de {totalSets}</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#0F5238] font-extrabold">
                  {currentReps} reps • {currentWeightKg > 0 ? `${currentWeightKg} kg` : 'Sin peso'}
                </span>
              </div>
              <p className="text-xs text-[#191C1D] font-medium leading-relaxed">
                Ejercicio: <strong>{currentExercise?.name || currentExercise?.title}</strong>
              </p>
              <p className="text-xs text-[#525B54]">
                Foco muscular: {currentExercise?.targetMuscleGroup || 'Musculatura principal'}.
              </p>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* REGULAR VIEW: PREPARATION or SET_ACTIVE                   */
          /* ========================================================= */
          <>
            {/* Banner de Estado para PREPARATION */}
            {phase === 'PREPARATION' && (
              <div className="p-4 rounded-2xl bg-[#FFF6ED] border border-[#FFDCC4] flex items-start gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-[#F4A261] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-0.5">
                  <strong className="text-[#8E4E14] font-black block">
                    Fase de Colocación Previa (Sin prisas)
                  </strong>
                  <p className="text-[#8E4E14]/90 leading-relaxed">
                    El cronómetro está <strong>DETENIDO en 0</strong>. Revisa la postura del Paso 0 y colócate con calma. Cuando estés en posición firme, pulsa el botón inferior para arrancar la <strong>Serie {currentSet}</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* CRONÓMETRO PROTAGONISTA DURANTE SERIE ACTIVA (SET_ACTIVE) - NÚMEROS GRANDES Y LEGIBLES A DISTANCIA */}
            {phase === 'SET_ACTIVE' && (
              <div className="p-6 rounded-3xl bg-white border border-[#E1E3E4] flex flex-col items-center justify-center space-y-4 shadow-sm">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238] text-xs font-black">
                  <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-ping" />
                  <span>Serie {currentSet} de {totalSets} • {activeWorkout.isPlaying ? 'En Ejecución Activa' : 'Pausado'}</span>
                </div>

                {/* Circular SVG Timer de Gran Formato */}
                <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                    <circle
                      cx="70"
                      cy="70"
                      r={strokeRadius}
                      className="stroke-[#EDEEEF]"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r={strokeRadius}
                      className="stroke-[#2D6A4F] transition-all duration-1000 ease-linear"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl sm:text-6xl font-black text-[#191C1D] tracking-tight font-mono">
                      {formatTime(remaining)}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#707973] mt-1">
                      {activeWorkout.isPlaying ? 'Segundos restantes' : 'En pausa'}
                    </span>
                  </div>
                </div>

                {/* Controles Ergonómicos de Serie */}
                <div className="flex items-center justify-center gap-4 w-full max-w-xs">
                  <button
                    type="button"
                    onClick={resetExerciseTimer}
                    className="w-12 h-12 rounded-2xl bg-[#F3F4F5] hover:bg-[#EDEEEF] active:scale-95 text-[#404943] flex items-center justify-center transition-all border border-[#E1E3E4]"
                    title="Reiniciar cronómetro"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={togglePlayPauseWorkout}
                    className={`w-16 h-16 rounded-3xl text-white flex items-center justify-center shadow-md active:scale-95 transition-all ${
                      activeWorkout.isPlaying
                        ? 'bg-[#F4A261] hover:bg-[#E76F51]'
                        : 'bg-[#2D6A4F] hover:bg-[#0F5238]'
                    }`}
                    title={activeWorkout.isPlaying ? 'Pausar' : 'Reanudar'}
                  >
                    {activeWorkout.isPlaying ? (
                      <Pause className="w-7 h-7 fill-white" />
                    ) : (
                      <Play className="w-7 h-7 fill-white ml-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={completeCurrentSet}
                    className="w-12 h-12 rounded-2xl bg-[#E7F3EC] hover:bg-[#B1F0CE] text-[#0F5238] active:scale-95 flex items-center justify-center font-bold transition-all border border-[#B1F0CE]"
                    title="Completar serie ahora"
                  >
                    <CheckCircle2 className="w-6 h-6 text-[#2D6A4F]" />
                  </button>
                </div>
              </div>
            )}

            {/* Switch Funcional: Versión Adaptada vs. Estándar */}
            <div className="p-1 bg-[#EDEEEF] rounded-2xl flex items-center justify-between shadow-2xs">
              <button
                type="button"
                onClick={() => setWorkoutIntensityMode('adaptada')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  isAdapted
                    ? 'bg-[#2D6A4F] text-white shadow-xs'
                    : 'text-[#404943] hover:text-[#191C1D]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Versión Adaptada</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkoutIntensityMode('estandar')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  !isAdapted
                    ? 'bg-white text-[#191C1D] shadow-xs'
                    : 'text-[#404943] hover:text-[#191C1D]'
                }`}
              >
                <span>Versión Estándar</span>
              </button>
            </div>

            {/* Exercise Visual Card: Imagen de Referencia Única + Insignia Destacada Grupo Muscular + Desglose Pedagógico */}
            <div className="p-4 rounded-3xl bg-white border border-[#E1E3E4] space-y-4 shadow-xs">
              {/* Imagen de Referencia Única de la Postura */}
              <div className="relative rounded-2xl overflow-hidden bg-[#F3F4F5] border border-[#E1E3E4] aspect-16/9 shadow-inner">
                <img
                  src={
                    currentExercise?.singleReferenceImage ||
                    currentExercise?.mainCoverIllustration ||
                    currentExercise?.steps?.[0]?.previewUrl ||
                    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={currentExercise?.name || currentExercise?.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Gradiente sutil para contraste */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Protección Articular / Versión Activa */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1.5 shadow-xs">
                  <CheckCircle2 className="w-3 h-3 text-[#B1F0CE]" />
                  <span>{isAdapted ? 'Apoyo Articular Activo' : 'Rango Completo'}</span>
                </div>

                {/* Nivel de Impacto Articular */}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#0F5238] text-[10px] font-extrabold flex items-center gap-1 shadow-xs border border-white/40">
                  <ShieldCheck className="w-3 h-3 text-[#2D6A4F]" />
                  <span>
                    {currentExercise?.impactLevel === 'ZERO'
                      ? 'Cero Impacto'
                      : currentExercise?.impactLevel === 'LOW'
                      ? 'Bajo Impacto'
                      : 'Fuerza Controlada'}
                  </span>
                </div>

                {/* Botón Acceso Ficha Técnica */}
                <button
                  type="button"
                  onClick={() => navigateTo('exercise_pedagogy')}
                  className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-white/95 text-[#2D6A4F] text-xs font-bold shadow-md hover:bg-white flex items-center gap-1.5 transition-all border border-[#EDEEEF]"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ficha Técnica</span>
                </button>
              </div>

              {/* INSIGNIA DESTACADA: GRUPO MUSCULAR PRINCIPAL */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E7F3EC] border border-[#B1F0CE] shadow-2xs">
                  <div className="w-5 h-5 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center shrink-0">
                    <Activity className="w-3 h-3" />
                  </div>
                  <div className="leading-tight">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F5238] block">
                      Grupo Muscular Principal
                    </span>
                    <span className="text-xs font-black text-[#191C1D]">
                      {currentExercise?.targetMuscleGroup || currentExercise?.targetMuscles?.[0] || 'Pectoral'}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#F3F4F5] text-[#525B54] border border-[#EDEEEF]">
                  {currentExercise?.requiredEquipment || 'Sin material (peso corporal)'}
                </span>
              </div>

              {/* Título y Subtítulo del Ejercicio */}
              <div>
                <h2 className="text-lg font-black text-[#191C1D] leading-snug">
                  {currentExercise?.name || currentExercise?.title}
                </h2>
                <p className="text-xs text-[#525B54] leading-relaxed mt-0.5">
                  {isAdapted
                    ? `${currentExercise?.subtitle} Variante con menor palanca y máxima protección articular.`
                    : currentExercise?.subtitle}
                </p>
              </div>

              {/* DESGLOSE PEDAGÓGICO: POSTURA CORRECTA Y PASOS */}
              <div className="space-y-3 pt-2 border-t border-[#EDEEEF]">
                {/* Paso 0: Colocación y Postura Correcta */}
                <div className={`p-3.5 rounded-2xl border space-y-1 transition-all ${
                  phase === 'PREPARATION'
                    ? 'bg-[#E7F3EC]/90 border-[#2D6A4F] ring-2 ring-[#2D6A4F]/20 shadow-xs'
                    : 'bg-[#F8F9FA] border-[#E1E3E4]'
                }`}>
                  <div className="flex items-center gap-1.5 text-[#2D6A4F]">
                    <span className="w-5 h-5 rounded-full bg-[#2D6A4F] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      0
                    </span>
                    <h4 className="text-xs font-black uppercase tracking-wide text-[#191C1D]">
                      Paso 0: Colocación y postura correcta
                    </h4>
                    {phase === 'PREPARATION' && (
                      <span className="ml-auto text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#2D6A4F] text-white">
                        Colócate ahora
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#191C1D] font-medium leading-relaxed pl-6">
                    {currentExercise?.setupStep0 ||
                      currentExercise?.steps?.[0]?.description ||
                      'Adopta una postura erguida con pies estables y columna neutra antes de comenzar.'}
                  </p>
                </div>

                {/* Pasos 1-2-3 de Ejecución */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E1E3E4] space-y-2.5">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-[#707973] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>Pasos 1-2-3 de Ejecución</span>
                  </h4>

                  <div className="space-y-2">
                    {/* Paso 1 */}
                    <div className="flex items-start gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full bg-[#EDEEEF] text-[#404943] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <div className="text-[#191C1D] leading-relaxed">
                        <strong className="font-bold text-[#2D6A4F]">Inicio: </strong>
                        <span>
                          {currentExercise?.steps1To3?.[0] ||
                            currentExercise?.steps?.[1]?.description ||
                            'Inicia el movimiento de manera pausada y sin tirones.'}
                        </span>
                      </div>
                    </div>

                    {/* Paso 2 */}
                    <div className="flex items-start gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full bg-[#EDEEEF] text-[#404943] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <div className="text-[#191C1D] leading-relaxed">
                        <strong className="font-bold text-[#2D6A4F]">Punto de esfuerzo: </strong>
                        <span>
                          {currentExercise?.steps1To3?.[1] ||
                            currentExercise?.steps?.[2]?.description ||
                            'Alcanza la contracción muscular activa manteniendo el equilibrio.'}
                        </span>
                      </div>
                    </div>

                    {/* Paso 3 */}
                    <div className="flex items-start gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full bg-[#EDEEEF] text-[#404943] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <div className="text-[#191C1D] leading-relaxed">
                        <strong className="font-bold text-[#2D6A4F]">Retorno y respiración: </strong>
                        <span>
                          {currentExercise?.steps1To3?.[2] ||
                            currentExercise?.steps?.[3]?.description ||
                            'Vuelve de forma controlada soltando el aire progresivamente.'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACORDEÓN ACCESIBLE: MAPA SENSORIAL Y ERRORES A EVITAR */}
                <div className="border border-[#E1E3E4] rounded-2xl overflow-hidden bg-[#F8F9FA] transition-all">
                  <button
                    type="button"
                    onClick={() => setIsSensoryAccordionOpen(!isSensoryAccordionOpen)}
                    aria-expanded={isSensoryAccordionOpen}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#EDEEEF]/70 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-[#191C1D] block">
                          Mapa Sensorial y Cuidados de Postura
                        </span>
                        <span className="text-[11px] text-[#707973]">
                          {isSensoryAccordionOpen
                            ? 'Toca para contraer'
                            : 'Dónde sentir el trabajo y errores a evitar'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#2D6A4F] text-xs font-extrabold shrink-0">
                      <span>{isSensoryAccordionOpen ? 'Ocultar' : 'Ver'}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isSensoryAccordionOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isSensoryAccordionOpen && (
                    <div className="p-3.5 pt-1 space-y-3 border-t border-[#EDEEEF] bg-white">
                      {/* Dónde Notarlo */}
                      <div className="p-3 rounded-xl bg-[#E7F3EC]/80 border border-[#B1F0CE] space-y-1">
                        <div className="flex items-center gap-1.5 text-[#0F5238]">
                          <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                          <h4 className="text-xs font-black uppercase tracking-wide text-[#0F5238]">
                            Dónde notarlo
                          </h4>
                        </div>
                        <p className="text-xs text-[#0F5238] font-medium leading-relaxed pl-5">
                          {currentExercise?.whereToFeel ||
                            currentExercise?.sensoryMapping ||
                            `Notarás el trabajo activo en ${currentExercise?.targetMuscleGroup || 'el músculo objetivo'}. Ninguna molestia articular.`}
                        </p>
                      </div>

                      {/* Errores Comunes a Evitar */}
                      <div className="p-3 rounded-xl bg-[#FFF6ED] border border-[#FFDCC4] space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[#B45309]">
                          <AlertTriangle className="w-4 h-4 text-[#E76F51] shrink-0" />
                          <h4 className="text-xs font-black uppercase tracking-wide text-[#8E4E14]">
                            Errores comunes a evitar
                          </h4>
                        </div>
                        <ul className="text-xs text-[#8E4E14] space-y-1 pl-5 list-disc list-outside">
                          {currentExercise?.commonMistakes && currentExercise.commonMistakes.length > 0 ? (
                            currentExercise.commonMistakes.map((mistake, i) => (
                              <li key={i} className="leading-relaxed">
                                {mistake}
                              </li>
                            ))
                          ) : (
                            <li className="leading-relaxed">
                              {currentExercise?.avoidError?.description ||
                                'Evitar arquear la espalda lumbar o empujar con inercias bruscas.'}
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* REGISTRO DE CARGAS (PESOS EN KG) Y SOBRECARGA PROGRESIVA */}
        {/* ========================================================= */}
        <div className="p-4 rounded-3xl bg-white border border-[#E1E3E4] space-y-4 shadow-xs">
          {/* Cabecera con Insignia de Sobrecarga Progresiva */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#0F5238] flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-[#2D6A4F]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#191C1D] leading-tight">
                  Registro de Cargas • Serie {currentSet} de {totalSets}
                </h3>
                <span className="text-[11px] text-[#707973]">
                  Ajusta el peso y repeticiones realizadas
                </span>
              </div>
            </div>

            {exercisePerf?.lastWeightKg !== undefined || exercisePerf?.lastReps !== undefined ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238] text-[10px] font-extrabold border border-[#B1F0CE]">
                <TrendingUp className="w-3 h-3 text-[#2D6A4F]" />
                <span>Sobrecarga Progresiva</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F3F4F5] text-[#525B54] text-[10px] font-bold">
                <span>Técnica Base</span>
              </span>
            )}
          </div>

          {/* Sugerencia Pedagógica de Sobrecarga Progresiva */}
          {exercisePerf && (
            <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#EDEEEF] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F]">
                <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Pauta del Entrenador Adaptativo</span>
              </div>
              <p className="text-xs text-[#525B54] leading-relaxed">
                {exercisePerf.progressionMessage}
              </p>
            </div>
          )}

          {/* Selectores Interactivos: Repeticiones y Peso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Selector de Repeticiones */}
            <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E1E3E4] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#707973]">Repeticiones</span>
                <span className="text-[10px] font-extrabold text-[#2D6A4F]">Serie {currentSet}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleRepsChange(-1)}
                  className="w-10 h-10 rounded-xl bg-white border border-[#E1E3E4] hover:bg-[#EDEEEF] active:scale-95 text-[#191C1D] flex items-center justify-center font-bold transition-all"
                  title="Menos repeticiones"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex-1 text-center">
                  <span className="text-2xl font-black text-[#191C1D] font-mono block">
                    {currentReps}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#707973]">reps</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRepsChange(1)}
                  className="w-10 h-10 rounded-xl bg-white border border-[#E1E3E4] hover:bg-[#EDEEEF] active:scale-95 text-[#191C1D] flex items-center justify-center font-bold transition-all"
                  title="Más repeticiones"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Chips Rápidos de Repeticiones */}
              <div className="flex items-center justify-between gap-1 pt-1">
                {[8, 10, 12, 15].map((repsOption) => (
                  <button
                    key={repsOption}
                    type="button"
                    onClick={() => setCurrentSetReps(repsOption)}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      currentReps === repsOption
                        ? 'bg-[#2D6A4F] text-white shadow-2xs'
                        : 'bg-white text-[#525B54] border border-[#E1E3E4] hover:bg-[#EDEEEF]'
                    }`}
                  >
                    {repsOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Carga / Peso en KG */}
            <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E1E3E4] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#707973]">Carga Utilizada</span>
                <span className="text-[10px] font-bold text-[#525B54]">Mancuernas / Disco</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleWeightChange(-0.5)}
                  className="w-10 h-10 rounded-xl bg-white border border-[#E1E3E4] hover:bg-[#EDEEEF] active:scale-95 text-[#191C1D] flex items-center justify-center font-bold transition-all"
                  title="Menos peso"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="150"
                      value={currentWeightKg === 0 ? '' : currentWeightKg}
                      placeholder="0"
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setCurrentSetWeightKg(isNaN(val) ? 0 : Math.max(0, val));
                      }}
                      className="w-16 text-2xl font-black text-[#191C1D] font-mono text-center bg-transparent border-b border-dashed border-[#B1F0CE] focus:outline-none focus:border-[#2D6A4F]"
                    />
                    <span className="text-xs font-bold text-[#707973]">kg</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#2D6A4F]">
                    {currentWeightKg > 0 ? `${currentWeightKg} kg añadidos` : 'Peso corporal (0 kg)'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleWeightChange(0.5)}
                  className="w-10 h-10 rounded-xl bg-white border border-[#E1E3E4] hover:bg-[#EDEEEF] active:scale-95 text-[#191C1D] flex items-center justify-center font-bold transition-all"
                  title="Más peso"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Chips Rápidos de Peso adaptados al inventario real */}
              <div className="flex items-center justify-between gap-1 pt-1">
                {[0, ...Array.from(new Set(availableWeights)).slice(0, 5)].map((kgOption) => (
                  <button
                    key={kgOption}
                    type="button"
                    onClick={() => setCurrentSetWeightKg(kgOption)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      currentWeightKg === kgOption
                        ? 'bg-[#2D6A4F] text-white shadow-2xs'
                        : 'bg-white text-[#525B54] border border-[#E1E3E4] hover:bg-[#EDEEEF]'
                    }`}
                  >
                    {kgOption === 0 ? '0kg' : `${kgOption}k`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen de las 3 Series Registradas en este Ejercicio */}
          <div className="pt-2 border-t border-[#EDEEEF] space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#707973] block">
              Estado de las 3 Series del Ejercicio
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((num) => {
                const recorded = recordedSetsForExercise.find((s) => s.setNumber === num);
                const isCurrent = currentSet === num;

                return (
                  <div
                    key={num}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      recorded
                        ? 'bg-[#E7F3EC] border-[#B1F0CE] text-[#0F5238]'
                        : isCurrent
                        ? 'bg-white border-[#2D6A4F] ring-2 ring-[#2D6A4F]/20'
                        : 'bg-[#F8F9FA] border-[#E1E3E4] text-[#707973]'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-[11px] font-black mb-1">
                      <span>Serie {num}</span>
                      {recorded && <CheckCircle2 className="w-3 h-3 text-[#2D6A4F]" />}
                    </div>

                    {recorded ? (
                      <div className="text-xs font-extrabold text-[#191C1D]">
                        <div>{recorded.repsCompleted} reps</div>
                        <div className="text-[10px] text-[#2D6A4F]">
                          {recorded.weightUsedKg && recorded.weightUsedKg > 0
                            ? `${recorded.weightUsedKg} kg`
                            : 'Sin peso'}
                        </div>
                      </div>
                    ) : isCurrent ? (
                      <div className="text-xs font-bold text-[#2D6A4F]">
                        <div>{currentReps} reps</div>
                        <div className="text-[10px]">
                          {currentWeightKg > 0 ? `${currentWeightKg} kg` : 'Sin peso'}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-[#707973] italic">Pendiente</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Botón de Parada Amigable y Adaptación Inmediata */}
        <button
          type="button"
          id="panic-button-active-workout"
          onClick={openPanicReplacementModal}
          className="w-full p-4 rounded-2xl bg-[#EAF5EF] border border-[#2D6A4F]/25 text-[#0F5238] hover:bg-[#DEF0E5] active:scale-[0.99] transition-all flex items-center justify-between shadow-2xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-[#B1F0CE]" />
            </div>
            <div className="text-left">
              <strong className="text-xs sm:text-sm font-black block text-[#0F5238]">
                ¿Molestia articular? Adaptar
              </strong>
              <span className="text-[11px] text-[#2D6A4F] block leading-tight">
                Toca para cambiar por variante suave, apoyo en pared o respirar sin penalización.
              </span>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-[#2D6A4F] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
        </button>
      </main>

      {/* Fixed Bottom Action Bar: 56px Primary Button Adaptive to Current Phase */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#EDEEEF] p-4 z-40 shadow-lg">
        {phase === 'PREPARATION' ? (
          /* Botón Fase 1: ¡Entendido, empezar Serie X! (56px) */
          <button
            type="button"
            onClick={startActiveSet}
            className="w-full h-14 rounded-2xl bg-[#2D6A4F] text-white font-black text-base hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-md transition-all duration-200"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>¡Entendido, empezar Serie {currentSet}!</span>
          </button>
        ) : phase === 'SET_ACTIVE' ? (
          /* Botón Fase 2: Serie completada (o terminar ejercicio si es la 3ª serie) */
          <button
            type="button"
            onClick={
              currentSet < totalSets
                ? completeCurrentSet
                : handleNextOrFinish
            }
            className="w-full h-14 rounded-2xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-md transition-all duration-200"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>
              {currentSet < totalSets
                ? `Serie ${currentSet} completada • Pasar al descanso`
                : currentExNumber >= totalExercises
                ? 'Serie 3 completada • Finalizar Sesión'
                : 'Serie 3 completada • Siguiente Ejercicio'}
            </span>
          </button>
        ) : (
          /* Botón Fase 3 (REST): Saltar descanso y arrancar siguiente serie */
          <button
            type="button"
            onClick={skipRest}
            className="w-full h-14 rounded-2xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-md transition-all duration-200"
          >
            <FastForward className="w-5 h-5" />
            <span>Comenzar Serie {currentSet + 1} de {totalSets}</span>
          </button>
        )}
      </footer>

      {/* Modal Overlay for Panic Replacement */}
      {activeWorkout.isPanicModalOpen && <PanicSwapModal />}
    </div>
  );
};
