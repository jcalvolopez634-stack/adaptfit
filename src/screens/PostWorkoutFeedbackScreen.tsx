/**
 * AdaptFit - Pantalla 8: Feedback Post-Sesión y Revisión Corporal
 * Celebración sosegada, selector RPE de 3 niveles, chequeo corporal de molestias
 * y actualización del plan adaptativo con botón principal de 56px.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RPEFeeling, BodyDiscomfortCheck } from '../types';
import {
  CheckCircle2,
  Heart,
  ShieldCheck,
  Smile,
  Zap,
  Activity,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const PostWorkoutFeedbackScreen: React.FC = () => {
  const {
    userProfile,
    submitPostWorkoutCheckIn,
    completeCurrentSession,
    navigateTo,
    activeWorkout,
  } = useApp();

  const [selectedRpe, setSelectedRpe] = useState<RPEFeeling>('just_right');
  const [selectedDiscomforts, setSelectedDiscomforts] = useState<
    BodyDiscomfortCheck[]
  >(['ninguna']);

  // Extra tracking states for healthy / advanced users & customized metrics
  const [repsOrWeightNote, setRepsOrWeightNote] = useState('');
  const [showUnexpectedDiscomfort, setShowUnexpectedDiscomfort] = useState(false);
  const [unexpectedDiscomfortNote, setUnexpectedDiscomfortNote] = useState('');

  const hasNoDiscomfortProfile =
    !userProfile.discomfortZones ||
    userProfile.discomfortZones.length === 0 ||
    (userProfile.discomfortZones.length === 1 && userProfile.discomfortZones[0] === 'ninguna');

  const isHealthyOrAdvanced =
    userProfile.mobilityLevel === 'saludable_estandar' ||
    userProfile.mobilityLevel === 'avanzado_fuerza';

  // If healthy or advanced with zero previous joint limitations, skip mandatory pain check
  const isHealthyFreeProfile = hasNoDiscomfortProfile && isHealthyOrAdvanced;

  const handleToggleDiscomfort = (zone: BodyDiscomfortCheck) => {
    if (zone === 'ninguna') {
      setSelectedDiscomforts(['ninguna']);
    } else {
      const filtered = selectedDiscomforts.filter((z) => z !== 'ninguna');
      if (filtered.includes(zone)) {
        const next = filtered.filter((z) => z !== zone);
        setSelectedDiscomforts(next.length === 0 ? ['ninguna'] : next);
      } else {
        setSelectedDiscomforts([...filtered, zone]);
      }
    }
  };

  const handleSaveAndAdvance = () => {
    submitPostWorkoutCheckIn(selectedRpe, selectedDiscomforts, {
      repsOrWeightNote: repsOrWeightNote.trim() || undefined,
      unexpectedDiscomfort: showUnexpectedDiscomfort && !selectedDiscomforts.includes('ninguna'),
      discomfortNotes: unexpectedDiscomfortNote.trim() || undefined,
    });
    completeCurrentSession();
    navigateTo('victory_wall');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-28">
      {/* Top Header */}
      <header className="px-5 pt-7 pb-4 bg-white border-b border-[#EDEEEF] text-center sticky top-0 z-30 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F]">
          Sesión Completada con Éxito
        </span>
        <h1 className="text-xl font-black text-[#191C1D] leading-tight mt-0.5">
          ¿Cómo ha respondido tu cuerpo?
        </h1>
        <p className="text-xs text-[#707973] max-w-xs mx-auto mt-1">
          Tu percepción nos ayuda a calibrar la dosis justa para la próxima sesión.
        </p>
      </header>

      {/* Main Form Body */}
      <main className="px-5 pt-5 space-y-6 flex-1">
        {/* RPE Selector: 3 Large Interactive Cards */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D]">
              1. Esfuerzo Percibido (RPE)
            </h2>
            <span className="text-xs text-[#707973]">Elige una opción</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Option 1: Light */}
            <button
              type="button"
              onClick={() => setSelectedRpe('light')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                selectedRpe === 'light'
                  ? 'bg-[#E7F3EC] border-[#2D6A4F] ring-2 ring-[#2D6A4F]/20'
                  : 'bg-white border-[#E1E3E4] hover:bg-[#F8F9FA]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedRpe === 'light'
                    ? 'bg-[#2D6A4F] text-white'
                    : 'bg-[#F3F4F5] text-[#707973]'
                }`}
              >
                <Smile className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <strong className="text-sm font-bold text-[#191C1D]">
                    Ligero y Relajado
                  </strong>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#E1E3E4] text-[#404943]">
                    Nivel 1
                  </span>
                </div>
                <p className="text-xs text-[#404943] leading-relaxed">
                  Pude respirar y hablar cómodamente sin sensación de fatiga muscular.
                </p>
              </div>
            </button>

            {/* Option 2: Just Right */}
            <button
              type="button"
              onClick={() => setSelectedRpe('just_right')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                selectedRpe === 'just_right'
                  ? 'bg-[#FFF6ED] border-[#F4A261] ring-2 ring-[#F4A261]/20'
                  : 'bg-white border-[#E1E3E4] hover:bg-[#F8F9FA]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedRpe === 'just_right'
                    ? 'bg-[#F4A261] text-white'
                    : 'bg-[#F3F4F5] text-[#707973]'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <strong className="text-sm font-bold text-[#191C1D]">
                    Justo a Tiempo (Ideal)
                  </strong>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4A261] text-white">
                    Nivel 2
                  </span>
                </div>
                <p className="text-xs text-[#404943] leading-relaxed">
                  Buen estímulo muscular con total sensación de control y articulaciones cómodas.
                </p>
              </div>
            </button>

            {/* Option 3: Challenging */}
            <button
              type="button"
              onClick={() => setSelectedRpe('challenging')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                selectedRpe === 'challenging'
                  ? 'bg-[#FFF6ED] border-[#E76F51] ring-2 ring-[#E76F51]/20'
                  : 'bg-white border-[#E1E3E4] hover:bg-[#F8F9FA]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedRpe === 'challenging'
                    ? 'bg-[#E76F51] text-white'
                    : 'bg-[#F3F4F5] text-[#707973]'
                }`}
              >
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <strong className="text-sm font-bold text-[#191C1D]">
                    Exigente / Desafiante
                  </strong>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#E1E3E4] text-[#404943]">
                    Nivel 3
                  </span>
                </div>
                <p className="text-xs text-[#404943] leading-relaxed">
                  Requirió esfuerzo alto o descansos adicionales entre repeticiones.
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Section 2: Conditional based on healthy profile vs rehabilitation */}
        {isHealthyFreeProfile ? (
          <div className="space-y-4">
            {/* Cargas o repeticiones alcanzadas */}
            <section className="space-y-2.5 p-4 rounded-2xl bg-white border border-[#E1E3E4]">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#2D6A4F]" />
                  <span>2. Cargas y Repeticiones Alcanzadas</span>
                </h2>
                <span className="text-[10px] text-[#2D6A4F] font-bold bg-[#E7F3EC] px-2 py-0.5 rounded-md">
                  Sobrecarga
                </span>
              </div>
              <p className="text-xs text-[#707973]">
                Selecciona tu logro de hoy o anota tus números para tu historial:
              </p>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Todas las reps completadas',
                  '+2 reps en última serie',
                  'Aumenté resistencia/peso',
                  'Récord de tiempo bajo tensión',
                ].map((chip) => {
                  const isSelected = repsOrWeightNote === chip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setRepsOrWeightNote(isSelected ? '' : chip)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                          : 'bg-[#F8F9FA] text-[#404943] border-[#EDEEEF] hover:bg-[#F0F2F1]'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={repsOrWeightNote}
                onChange={(e) => setRepsOrWeightNote(e.target.value)}
                placeholder="O escribe: ej. 12 reps con mancuernas de 6 kg..."
                className="w-full text-xs p-2.5 rounded-xl border border-[#EDEEEF] bg-[#F8F9FA] focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition-all"
              />
            </section>

            {/* Discreto y opcional: ¿Apareció alguna molestia imprevista hoy? */}
            <section className="p-3.5 rounded-2xl border border-dashed border-[#C4C8C5] bg-[#FDFEFE] space-y-3">
              <button
                type="button"
                onClick={() => setShowUnexpectedDiscomfort(!showUnexpectedDiscomfort)}
                className="w-full flex items-center justify-between text-left text-xs font-semibold text-[#404943] hover:text-[#191C1D] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#F4A261]" />
                  <span>¿Apareció alguna molestia imprevista hoy?</span>
                </div>
                <span className="text-[11px] font-bold text-[#2D6A4F]">
                  {showUnexpectedDiscomfort ? 'Ocultar' : 'Reportar'}
                </span>
              </button>

              {showUnexpectedDiscomfort && (
                <div className="pt-2 border-t border-[#EDEEEF] space-y-3">
                  <p className="text-[11px] text-[#707973] leading-relaxed">
                    Si sentiste algún tirón o pinchazo inusual, selecciónalo para que el algoritmo adapte el volumen del próximo entrenamiento:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'ninguna', label: 'Ninguna (todo perfecto)' },
                      { id: 'espalda_baja', label: 'Espalda Baja' },
                      { id: 'rodillas_piernas', label: 'Rodillas / Piernas' },
                      { id: 'hombros_cuello', label: 'Hombros / Cuello' },
                    ].map((chip) => {
                      const isSelected = selectedDiscomforts.includes(
                        chip.id as BodyDiscomfortCheck
                      );
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() =>
                            handleToggleDiscomfort(chip.id as BodyDiscomfortCheck)
                          }
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? chip.id === 'ninguna'
                                ? 'bg-[#2D6A4F] text-white shadow-xs'
                                : 'bg-[#F4A261] text-white shadow-xs'
                              : 'bg-white border border-[#E1E3E4] text-[#404943] hover:bg-[#F3F4F5]'
                          }`}
                        >
                          {chip.label}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={unexpectedDiscomfortNote}
                    onChange={(e) => setUnexpectedDiscomfortNote(e.target.value)}
                    placeholder="Detalle opcional (ej: molestia en la última serie)..."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#EDEEEF] bg-white focus:outline-none focus:border-[#F4A261]"
                  />
                </div>
              )}
            </section>
          </div>
        ) : (
          /* Standard / Rehabilitation Profile: Mandatory Joint Check-in */
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D]">
                2. Revisión Corporal Articular
              </h2>
              <span className="text-xs text-[#707973]">Selección múltiple</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'ninguna', label: 'Ninguna molestia' },
                { id: 'espalda_baja', label: 'Espalda Baja' },
                { id: 'rodillas_piernas', label: 'Rodillas / Piernas' },
                { id: 'hombros_cuello', label: 'Hombros / Cuello' },
              ].map((chip) => {
                const isSelected = selectedDiscomforts.includes(
                  chip.id as BodyDiscomfortCheck
                );

                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() =>
                      handleToggleDiscomfort(chip.id as BodyDiscomfortCheck)
                    }
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? chip.id === 'ninguna'
                          ? 'bg-[#2D6A4F] text-white shadow-xs'
                          : 'bg-[#F4A261] text-white shadow-xs'
                        : 'bg-white border border-[#E1E3E4] text-[#404943] hover:bg-[#F3F4F5]'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Optional extra notes if user desires */}
            {userProfile.trackingPreferences?.trackRestAndVolume && (
              <div className="pt-2">
                <input
                  type="text"
                  value={repsOrWeightNote}
                  onChange={(e) => setRepsOrWeightNote(e.target.value)}
                  placeholder="Nota de cargas o descansos (opcional)..."
                  className="w-full text-xs p-2.5 rounded-xl border border-[#EDEEEF] bg-white focus:outline-none focus:border-[#2D6A4F]"
                />
              </div>
            )}
          </section>
        )}

        {/* Adaptive Coach Live Feedback Preview */}
        <section className="p-4 rounded-2xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-2">
          <div className="flex items-center gap-2 text-[#0F5238]">
            <Sparkles className="w-4 h-4 text-[#2D6A4F]" />
            <strong className="text-xs uppercase tracking-wider">
              Ajuste Automático de tu Plan
            </strong>
          </div>
          <p className="text-xs text-[#2A3E33] leading-relaxed">
            {selectedDiscomforts.includes('rodillas_piernas')
              ? 'Detectamos molestia en rodillas. El sistema ha cambiado automáticamente las próximas sentadillas a variantes en silla y puentes pélvicos.'
              : selectedDiscomforts.includes('espalda_baja')
              ? 'Priorizando tu espalda lumbar: agregamos 3 minutos extra de báscula pélvica y descompresión con cojín.'
              : selectedRpe === 'challenging'
              ? 'Agradecemos tu esfuerzo. Calibramos la intensidad de la próxima sesión con descansos más generosos.'
              : 'Excelente equilibrio. Mantendremos este volumen progresivo y seguro para consolidar tu racha.'}
          </p>
        </section>
      </main>

      {/* Fixed Bottom Action Bar: 56px Primary Button */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#EDEEEF] p-4 z-40 shadow-lg">
        <button
          type="button"
          onClick={handleSaveAndAdvance}
          className="w-full h-14 rounded-2xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-md transition-all duration-200"
        >
          <span>Guardar y actualizar mi plan</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};
