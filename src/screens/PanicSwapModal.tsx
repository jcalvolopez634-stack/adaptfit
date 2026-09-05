/**
 * AdaptFit - Pantalla 7: Modal / Hoja de Reemplazo Inmediato ("Botón de Pánico")
 * Sustitución instantánea y libre de frustración ante cualquier molestia articular,
 * ofreciendo variantes de apoyo (silla firme, cero impacto, acostado) sin perder el progreso de la sesión.
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Armchair,
  Feather,
  Sparkles,
  ArrowRight,
  X,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

interface PanicSwapModalProps {
  onClose?: () => void;
}

export const PanicSwapModal: React.FC<PanicSwapModalProps> = ({ onClose }) => {
  const {
    activeWorkout,
    replaceCurrentExercise,
    closePanicReplacementModal,
    navigateTo,
    goBack,
  } = useApp();

  const handleSelectAlternative = (altId: string) => {
    replaceCurrentExercise(altId);
    if (onClose) onClose();
    closePanicReplacementModal();
    navigateTo('workout_active');
  };

  const handleDismiss = () => {
    if (onClose) onClose();
    closePanicReplacementModal();
    goBack();
  };

  const alternatives = activeWorkout.currentExercise?.alternatives || [
    {
      id: 'alt-extension-pierna',
      title: 'Extensión de piernas sentado',
      subtitle: 'Cero presión en rodillas • Inmediato',
      benefitBadge: 'Cero impacto',
      iconType: 'chair',
      reason: 'Elimina todo el soporte de peso en rodillas y rótula.',
    },
    {
      id: 'alt-puente-cama',
      title: 'Puente pélvico suave con cojín',
      subtitle: 'Realizable con apoyo total en espalda',
      benefitBadge: 'Soporte total',
      iconType: 'bed',
      reason: 'Trabaja glúteos e isquiotibiales sin flexión articular extrema.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E1E3E4] max-h-[92vh] flex flex-col overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#EDEEEF] flex items-start justify-between bg-[#FFF6ED]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4A261] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8E4E14]">
                  Botón de Pánico Activo
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E76F51]" />
              </div>
              <h2 className="text-base font-extrabold text-[#191C1D] leading-tight">
                ¿Molestia o pinchazo en este ejercicio?
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#707973] flex items-center justify-center transition-all shrink-0 ml-2"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Empathetic Support Message */}
          <div className="p-4 rounded-2xl bg-[#E7F3EC] border border-[#B1F0CE] flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
            <p className="text-xs text-[#0F5238] leading-relaxed">
              <strong>Entrena con calma:</strong> Tu seguridad articular es lo primero. Ningún ejercicio es imprescindible; adaptamos el movimiento al instante sin detener el cómputo de tu sesión ni penalizar tu racha.
            </p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#707973] block mb-2">
              Ejercicio actual a sustituir:
            </span>
            <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#EDEEEF] text-xs">
              <strong className="text-[#191C1D] block font-bold">
                {activeWorkout.currentExercise?.title || 'Ejercicio en curso'}
              </strong>
              <span className="text-[#707973] block mt-0.5">
                {activeWorkout.currentExercise?.subtitle || 'Cambiando por alternativa segura'}
              </span>
            </div>
          </div>

          {/* Alternatives List */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center justify-between">
              <span>Elige una alternativa segura de bajo impacto:</span>
              <span className="text-[10px] text-[#2D6A4F] font-bold">Reemplazo Inmediato</span>
            </span>

            {alternatives.map((alt) => (
              <button
                key={alt.id}
                type="button"
                onClick={() => handleSelectAlternative(alt.id)}
                className="w-full text-left p-4 rounded-2xl border border-[#E1E3E4] bg-white hover:bg-[#FFF6ED] hover:border-[#F4A261] active:scale-[0.99] transition-all duration-150 shadow-2xs group flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFF6ED] group-hover:bg-[#F4A261] group-hover:text-white text-[#8E4E14] flex items-center justify-center shrink-0 transition-colors">
                  {alt.iconType === 'chair' ? (
                    <Armchair className="w-5 h-5" />
                  ) : (
                    <Feather className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <strong className="text-sm font-bold text-[#191C1D] group-hover:text-[#8E4E14] transition-colors">
                      {alt.title}
                    </strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#0F5238] shrink-0">
                      {alt.benefitBadge}
                    </span>
                  </div>

                  <p className="text-xs text-[#404943] leading-relaxed">
                    {alt.reason}
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F]">
                    <span>Sustituir ahora sin perder tiempo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Bottom Actions with 56px Secondary Option */}
        <div className="p-4 bg-[#F8F9FA] border-t border-[#EDEEEF] space-y-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full h-14 rounded-2xl bg-white border border-[#E1E3E4] text-[#404943] font-bold text-sm hover:bg-[#F3F4F5] active:scale-[0.98] flex items-center justify-center transition-all"
          >
            Continuar con el ejercicio actual
          </button>
        </div>
      </div>
    </div>
  );
};
