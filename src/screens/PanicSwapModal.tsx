/**
 * AdaptFit - Pantalla de Adaptación Inmediata / Botón de Pánico
 * Modal interactivo de 3 opciones:
 * 1. "Sustituir por alternativa suave" (Búsqueda en base de datos por patrón motor/grupo muscular con menor impacto)
 * 2. "Descartar y pasar al siguiente" (Elimina el ejercicio sin penalizar la sesión ni racha)
 * 3. "Pausar y respirar" (60 segundos de descanso guiado con respiración diafragmática interactiva)
 * 
 * Registra formalmente cada intervención en safetyIncidents para que el reporte clínico
 * compute el movimiento como "ejercicio retirado por seguridad articular" y NO como molestia tolerada.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  findSafeAlternativesForExercise,
  SafeAlternativeOption,
  EXERCISES_DATABASE,
} from '../data/exercisesData';
import { Exercise } from '../types';
import {
  ShieldAlert,
  Armchair,
  Feather,
  Sparkles,
  ArrowRight,
  X,
  HeartHandshake,
  CheckCircle2,
  Wind,
  SkipForward,
  RotateCcw,
  Play,
  Pause,
  AlertOctagon,
  ShieldCheck,
  ChevronLeft,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface PanicSwapModalProps {
  onClose?: () => void;
}

type ModalView = 'OPTIONS' | 'ALTERNATIVES' | 'BREATHING';

export const PanicSwapModal: React.FC<PanicSwapModalProps> = ({ onClose }) => {
  const {
    userProfile,
    activeWorkout,
    replaceCurrentExerciseWithAlternative,
    discardCurrentExerciseForSafety,
    startBreathingPause,
    stopBreathingPause,
    closePanicReplacementModal,
    navigateTo,
    goBack,
  } = useApp();

  const [currentView, setCurrentView] = useState<ModalView>('OPTIONS');
  const [selectedAlt, setSelectedAlt] = useState<SafeAlternativeOption | null>(null);

  // Guided breathing 60s timer state
  const [breathingSecondsLeft, setBreathingSecondsLeft] = useState<number>(60);
  const [isBreathingTimerActive, setIsBreathingTimerActive] = useState<boolean>(true);
  const [breathPhase, setBreathPhase] = useState<'INHALE' | 'HOLD' | 'EXHALE'>('INHALE');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const currentExercise = activeWorkout.currentExercise;

  // Find dynamic safe alternatives matching movementPattern or muscleGroup with lower/zero impact, prioritizing available equipment
  const safeAlternatives = useMemo(() => {
    if (!currentExercise) return [];
    return findSafeAlternativesForExercise(
      currentExercise,
      4,
      userProfile.equipmentAvailable || userProfile.availableEquipment
    );
  }, [currentExercise, userProfile.equipmentAvailable, userProfile.availableEquipment]);

  // Gentle audio chime for breathing transitions
  const playBreathChime = (frequency = 440) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      }
    } catch {
      // Audio context might be restricted before interaction; safe fallback
    }
  };

  // 60-second breathing timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (currentView === 'BREATHING' && isBreathingTimerActive && breathingSecondsLeft > 0) {
      interval = setInterval(() => {
        setBreathingSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsBreathingTimerActive(false);
            playBreathChime(523.25); // C5 triumphant chime
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentView, isBreathingTimerActive, breathingSecondsLeft]);

  // Diaphragmatic 4-4-4 breathing cycle calculation
  useEffect(() => {
    if (currentView !== 'BREATHING') return;
    const elapsed = 60 - breathingSecondsLeft;
    const cyclePosition = elapsed % 12; // 12-second total loop

    if (cyclePosition < 4) {
      if (breathPhase !== 'INHALE') {
        setBreathPhase('INHALE');
        playBreathChime(432);
      }
    } else if (cyclePosition < 8) {
      if (breathPhase !== 'HOLD') {
        setBreathPhase('HOLD');
      }
    } else {
      if (breathPhase !== 'EXHALE') {
        setBreathPhase('EXHALE');
        playBreathChime(324);
      }
    }
  }, [breathingSecondsLeft, currentView, breathPhase]);

  // Handlers
  const handleClose = () => {
    stopBreathingPause();
    if (onClose) onClose();
    closePanicReplacementModal();
  };

  const handleStartBreathing = () => {
    startBreathingPause();
    setBreathingSecondsLeft(60);
    setIsBreathingTimerActive(true);
    setBreathPhase('INHALE');
    setCurrentView('BREATHING');
    playBreathChime(432);
  };

  const handleSelectAlternative = (alt: SafeAlternativeOption) => {
    replaceCurrentExerciseWithAlternative(
      alt as unknown as Exercise,
      `Sustituido por "${alt.name || alt.title}" tras activar botón de pánico por molestia articular.`
    );
    handleClose();
  };

  const handleDiscardCurrentExercise = () => {
    discardCurrentExerciseForSafety(
      `Ejercicio "${currentExercise?.name || currentExercise?.title}" retirado de la rutina activa por seguridad articular.`
    );
    handleClose();
  };

  return (
    <div
      id="panic-swap-modal-overlay"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="panic-swap-modal-container"
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E1E3E4] max-h-[92vh] flex flex-col overflow-hidden font-sans"
      >
        {/* ============================================================ */}
        {/* MODAL HEADER */}
        {/* ============================================================ */}
        <div className="px-6 pt-5 pb-4 border-b border-[#EDEEEF] flex items-start justify-between bg-[#FFF6ED] shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E76F51] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8E4E14]">
                  Parada de Emergencia Activa
                </span>
                <span className="w-2 h-2 rounded-full bg-[#E76F51] animate-ping" />
              </div>
              <h2 className="text-base font-extrabold text-[#191C1D] leading-tight">
                {currentView === 'OPTIONS' && '¿Molestia o pinchazo en este ejercicio?'}
                {currentView === 'ALTERNATIVES' && 'Sustituir por alternativa suave'}
                {currentView === 'BREATHING' && 'Pausa y Respiración Diafragmática'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            id="panic-modal-close-btn"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#707973] hover:text-[#191C1D] flex items-center justify-center transition-all shrink-0 ml-2 shadow-2xs"
            title="Cerrar modal y continuar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: 3 PRIMARY OPTIONS */}
        {/* ============================================================ */}
        {currentView === 'OPTIONS' && (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Clinical safety assurance */}
            <div className="p-4 rounded-2xl bg-[#E7F3EC] border border-[#B1F0CE] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
              <div className="text-xs text-[#0F5238] leading-relaxed">
                <p className="font-bold mb-0.5">Seguridad articular garantizada:</p>
                <p>
                  Ningún ejercicio es imprescindible. Si descartas o sustituyes este movimiento,{' '}
                  <strong>se registrará como ejercicio retirado por seguridad articular</strong> en tu
                  informe clínico, protegiendo el cartílago sin penalizar tu sesión ni racha.
                </p>
              </div>
            </div>

            {/* Current exercise info */}
            <div className="bg-[#F8F9FA] p-3.5 rounded-2xl border border-[#EDEEEF]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#707973] block mb-1">
                Ejercicio activo en pausa:
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#191C1D]">
                    {currentExercise?.name || currentExercise?.title || 'Ejercicio en curso'}
                  </h4>
                  <p className="text-xs text-[#707973]">
                    {currentExercise?.targetMuscleGroup || 'Grupo muscular'} •{' '}
                    {currentExercise?.movementPattern?.replace('_', ' ') || 'Patrón motor'}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#FFF0E6] text-[#8E4E14] border border-[#F4A261]/30">
                  En pausa
                </span>
              </div>
            </div>

            {/* 3 Main Action Cards */}
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#191C1D] block">
                Selecciona la acción para adaptarte de inmediato:
              </span>

              {/* OPCTION 1: SUSTITUIR POR ALTERNATIVA SUAVE */}
              <button
                type="button"
                id="panic-option-substitute"
                onClick={() => setCurrentView('ALTERNATIVES')}
                className="w-full text-left p-4 rounded-2xl border-2 border-[#2D6A4F]/20 bg-white hover:bg-[#E7F3EC]/50 hover:border-[#2D6A4F] active:scale-[0.99] transition-all shadow-2xs group flex items-start gap-3.5"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#E7F3EC] text-[#2D6A4F] group-hover:bg-[#2D6A4F] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <strong className="text-sm font-bold text-[#191C1D] group-hover:text-[#2D6A4F] transition-colors">
                      Sustituir por alternativa suave
                    </strong>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#0F5238]">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-xs text-[#404943] leading-relaxed">
                    Busca en la biblioteca un movimiento del mismo patrón motor o grupo muscular con
                    menor demanda articular o impacto.
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F]">
                    <span>Ver {safeAlternatives.length} variantes compatibles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>

              {/* OPCION 2: DESCARTAR Y PASAR AL SIGUIENTE */}
              <button
                type="button"
                id="panic-option-discard"
                onClick={handleDiscardCurrentExercise}
                className="w-full text-left p-4 rounded-2xl border border-[#EDEEEF] bg-white hover:bg-[#FFF6ED] hover:border-[#F4A261] active:scale-[0.99] transition-all shadow-2xs group flex items-start gap-3.5"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#FFF6ED] text-[#E76F51] group-hover:bg-[#E76F51] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                  <SkipForward className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <strong className="text-sm font-bold text-[#191C1D] group-hover:text-[#8E4E14] transition-colors">
                      Descartar y pasar al siguiente
                    </strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0E6] text-[#8E4E14]">
                      0 penalización
                    </span>
                  </div>
                  <p className="text-xs text-[#404943] leading-relaxed">
                    Elimina este ejercicio de la rutina de hoy. Avanza directamente al descanso o al
                    siguiente ejercicio manteniendo el cómputo de tu sesión.
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#8E4E14]">
                    <span>Descartar de forma segura</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>

              {/* OPCION 3: PAUSAR Y RESPIRAR */}
              <button
                type="button"
                id="panic-option-breathe"
                onClick={handleStartBreathing}
                className="w-full text-left p-4 rounded-2xl border border-[#EDEEEF] bg-white hover:bg-[#EBF3FE] hover:border-[#0066CC] active:scale-[0.99] transition-all shadow-2xs group flex items-start gap-3.5"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#EBF3FE] text-[#0066CC] group-hover:bg-[#0066CC] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                  <Wind className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <strong className="text-sm font-bold text-[#191C1D] group-hover:text-[#0066CC] transition-colors">
                      Pausar y respirar (60 seg)
                    </strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF3FE] text-[#0066CC]">
                      Guiado
                    </span>
                  </div>
                  <p className="text-xs text-[#404943] leading-relaxed">
                    Detiene el temporizador y activa una respiración diafragmática pausada para calmar
                    el tono muscular y evaluar si se disipa la molestia.
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#0066CC]">
                    <span>Iniciar 60s de relajación</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: ALTERNATIVE SELECTION LIST */}
        {/* ============================================================ */}
        {currentView === 'ALTERNATIVES' && (
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <button
              type="button"
              onClick={() => setCurrentView('OPTIONS')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] hover:underline mb-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver a las opciones de pánico</span>
            </button>

            <div className="p-3 bg-[#E7F3EC] rounded-xl border border-[#B1F0CE] text-xs text-[#0F5238]">
              <strong>Mapeo Biomecánico Adaptado:</strong> Estas variantes trabajan el mismo grupo{' '}
              ({currentExercise?.targetMuscleGroup || 'muscular'}) o patrón motor ({currentExercise?.movementPattern?.replace('_', ' ') || 'funcional'}) pero con cero impacto o descarga en articulaciones sensibles.
            </div>

            <div className="space-y-3">
              {safeAlternatives.map((alt) => (
                <div
                  key={alt.id}
                  className="p-4 rounded-2xl border border-[#E1E3E4] bg-white hover:border-[#2D6A4F] hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center shrink-0">
                        {alt.iconType === 'chair' ? (
                          <Armchair className="w-4 h-4" />
                        ) : alt.iconType === 'wall' ? (
                          <ShieldCheck className="w-4 h-4" />
                        ) : (
                          <Feather className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#191C1D] leading-tight">
                          {alt.name || alt.title}
                        </h4>
                        <span className="text-[11px] text-[#707973]">{alt.subtitle}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#0F5238] shrink-0">
                      {alt.benefitBadge}
                    </span>
                  </div>

                  <p className="text-xs text-[#404943] bg-[#F8F9FA] p-2.5 rounded-xl border border-[#EDEEEF] mb-3">
                    <strong>Por qué es seguro:</strong> {alt.safetyReason}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleSelectAlternative(alt)}
                    className="w-full h-11 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sustituir por esta variante y continuar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: GUIDED DIAPHRAGMATIC BREATHING (60s) */}
        {/* ============================================================ */}
        {currentView === 'BREATHING' && (
          <div className="p-6 space-y-5 overflow-y-auto flex-1 flex flex-col items-center justify-center text-center">
            {/* Audio Toggle & Back */}
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentView('OPTIONS')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#707973] hover:text-[#191C1D]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Opciones</span>
              </button>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-lg text-[#707973] hover:bg-[#EDEEEF] transition-colors"
                title={soundEnabled ? 'Silenciar avisos' : 'Activar avisos sonoros'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#2D6A4F]" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Breathing Animated Circle */}
            <div className="relative my-3 flex items-center justify-center">
              {/* Pulsing ring depending on phase */}
              <div
                className={`w-44 h-44 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
                  breathPhase === 'INHALE'
                    ? 'scale-110 border-[#2D6A4F] bg-[#E7F3EC]/70 shadow-lg'
                    : breathPhase === 'HOLD'
                    ? 'scale-110 border-[#0066CC] bg-[#EBF3FE]/80 shadow-md'
                    : 'scale-90 border-[#E76F51] bg-[#FFF0E6]/70 shadow-sm'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-3xl font-black text-[#191C1D]">
                    {String(Math.floor(breathingSecondsLeft / 60)).padStart(2, '0')}:
                    {String(breathingSecondsLeft % 60).padStart(2, '0')}
                  </div>
                  <div
                    className={`text-xs font-extrabold uppercase tracking-wider transition-colors ${
                      breathPhase === 'INHALE'
                        ? 'text-[#0F5238]'
                        : breathPhase === 'HOLD'
                        ? 'text-[#0066CC]'
                        : 'text-[#8E4E14]'
                    }`}
                  >
                    {breathPhase === 'INHALE' && 'Inhala (4s)'}
                    {breathPhase === 'HOLD' && 'Sostén (4s)'}
                    {breathPhase === 'EXHALE' && 'Exhala lento (4s)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Pedagogical Breathing Guidance */}
            <div className="p-3.5 bg-[#F8F9FA] rounded-2xl border border-[#EDEEEF] max-w-sm">
              <p className="text-xs text-[#404943] leading-relaxed">
                {breathPhase === 'INHALE' &&
                  'Inhala despacio por la nariz hinchando el abdomen suavemente sin elevar los hombros.'}
                {breathPhase === 'HOLD' &&
                  'Mantén el aire con calma, permitiendo que la musculatura articular suelte tensión.'}
                {breathPhase === 'EXHALE' &&
                  'Vacia el aire por la boca como soplando suavemente una vela, relajando el cuello.'}
              </p>
            </div>

            {/* Decision Buttons after/during breathing */}
            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full h-12 rounded-2xl bg-[#2D6A4F] text-white font-bold text-sm hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Me siento recuperado • Reanudar ejercicio</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentView('ALTERNATIVES')}
                  className="h-11 rounded-xl bg-white border border-[#E1E3E4] text-[#191C1D] font-bold text-xs hover:bg-[#F8F9FA] active:scale-[0.98] transition-all"
                >
                  Sustituir por alternativa
                </button>
                <button
                  type="button"
                  onClick={handleDiscardCurrentExercise}
                  className="h-11 rounded-xl bg-white border border-[#F4A261] text-[#8E4E14] font-bold text-xs hover:bg-[#FFF6ED] active:scale-[0.98] transition-all"
                >
                  Descartar ejercicio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL FOOTER */}
        {/* ============================================================ */}
        <div className="p-4 bg-[#F8F9FA] border-t border-[#EDEEEF] shrink-0">
          <button
            type="button"
            id="panic-modal-dismiss-btn"
            onClick={handleClose}
            className="w-full h-12 rounded-2xl bg-white border border-[#E1E3E4] text-[#404943] font-bold text-xs hover:bg-[#F3F4F5] active:scale-[0.98] flex items-center justify-center transition-all"
          >
            Continuar con el ejercicio actual (sin cambios)
          </button>
        </div>
      </div>
    </div>
  );
};
