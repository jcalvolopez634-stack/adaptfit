/**
 * AdaptFit - Pantalla 1: Onboarding Clínico y Limitaciones Articulares
 * Módulo de evaluación inicial: zonas de molestia articular, nivel de movilidad y equipamiento en casa.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  JointDiscomfortZone,
  MobilityLevelId,
  AvailableEquipmentId,
} from '../types';
import { calculateBMI } from '../utils/anthropometry';
import {
  Shield,
  Armchair,
  Feather,
  Accessibility,
  Activity,
  Dumbbell,
  Check,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  HeartHandshake,
  Scale,
  Ruler,
} from 'lucide-react';

const DISCOMFORT_OPTIONS: { id: JointDiscomfortZone; label: string; description: string }[] = [
  { id: 'rodillas', label: 'Rodillas', description: 'Molestia al flexionar o subir escaleras' },
  { id: 'espalda_lumbar', label: 'Espalda lumbar', description: 'Rigidez o dolor en zona baja' },
  { id: 'hombros', label: 'Hombros', description: 'Limitación al elevar los brazos' },
  { id: 'cuello', label: 'Cuello y cervicales', description: 'Tensión acumulada en trapecios' },
  { id: 'cadera', label: 'Cadera', description: 'Molestia al caminar o levantarse' },
  { id: 'munecas', label: 'Muñecas', description: 'Sensibilidad al apoyar peso' },
  { id: 'ninguna', label: 'Ninguna molestia (Sin dolor)', description: 'Articulaciones libres para exigencia física' },
];

const MOBILITY_LEVELS: {
  id: MobilityLevelId;
  order: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
}[] = [
  {
    id: 'silla_cama',
    order: 'Nivel 1',
    title: 'En silla o cama',
    subtitle: 'Movilidad muy reducida con apoyo total. Cero peso soportado por articulaciones.',
    badge: 'Máximo Cuidado',
    icon: Armchair,
  },
  {
    id: 'cero_impacto',
    order: 'Nivel 2',
    title: 'Cero impacto articular',
    subtitle: 'Movimientos suaves de pie o sentado sin saltos ni giros bruscos. Máxima protección.',
    badge: 'Protección Total',
    icon: Feather,
  },
  {
    id: 'funcional_suave',
    order: 'Nivel 3',
    title: 'Funcional suave / Principiante',
    subtitle: 'Soporte asistido para equilibrio, fortalecimiento suave y confianza postural.',
    badge: 'Principiante',
    icon: Accessibility,
  },
  {
    id: 'saludable_estandar',
    order: 'Nivel 4',
    title: 'Saludable estándar',
    subtitle: 'Fuerza media, resistencia cardiovascular y acondicionamiento físico activo.',
    badge: 'Fuerza Media',
    icon: Activity,
  },
  {
    id: 'avanzado_fuerza',
    order: 'Nivel 5',
    title: 'Avanzado / Ponerse fuerte',
    subtitle: 'Sobrecarga progresiva, hipertrofia muscular, flexiones y zancadas búlgaras.',
    badge: 'Alta Intensidad',
    icon: Dumbbell,
  },
];

const EQUIPMENT_OPTIONS: { id: AvailableEquipmentId; label: string; icon: string }[] = [
  { id: 'peso_corporal', label: 'Solo peso corporal', icon: '✨' },
  { id: 'silla_firme', label: 'Silla firme', icon: '🪑' },
  { id: 'pared_libre', label: 'Pared libre', icon: '🧱' },
  { id: 'esterilla', label: 'Esterilla o alfombra', icon: '🧘' },
  { id: 'bandas_elasticas', label: 'Bandas elásticas', icon: '🎗️' },
  { id: 'mancuernas', label: 'Mancuernas / Peso', icon: '🏋️' },
];

export const OnboardingClinicalScreen: React.FC = () => {
  const {
    userProfile,
    saveUserProfile,
    toggleDiscomfortZone,
    setMobilityLevel,
    toggleEquipment,
    navigateTo,
  } = useApp();

  const [heightInput, setHeightInput] = useState<string>(
    userProfile.heightCm ? String(userProfile.heightCm) : ''
  );
  const [weightInput, setWeightInput] = useState<string>(
    userProfile.weightKg ? String(userProfile.weightKg) : ''
  );

  const parsedHeight = parseFloat(heightInput);
  const parsedWeight = parseFloat(weightInput);
  const hasValidMetrics =
    !isNaN(parsedHeight) &&
    parsedHeight >= 100 &&
    parsedHeight <= 250 &&
    !isNaN(parsedWeight) &&
    parsedWeight >= 30 &&
    parsedWeight <= 300;

  const bmiAssessment = hasValidMetrics
    ? calculateBMI(parsedWeight, parsedHeight)
    : null;

  const handleContinue = () => {
    if (hasValidMetrics) {
      saveUserProfile({
        heightCm: Math.round(parsedHeight),
        weightKg: Math.round(parsedWeight * 10) / 10,
      });
    }
    // Navigate to step 2 (macrocycle)
    navigateTo('onboarding_macrocycle');
  };

  const isFormValid =
    userProfile.discomfortZones.length > 0 &&
    Boolean(userProfile.mobilityLevel) &&
    userProfile.availableEquipment.length > 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-28">
      {/* Top Bar with Progress */}
      <header className="px-6 pt-7 pb-4 bg-white border-b border-[#EDEEEF] sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              AF
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
              Evaluación Adaptada
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#EDEEEF] px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-[#2D6A4F]">Paso 1</span>
            <span className="text-xs text-[#707973]">de 2</span>
          </div>
        </div>

        {/* Progress bar track */}
        <div className="w-full bg-[#EDEEEF] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#2D6A4F] h-full w-1/2 rounded-full transition-all duration-500" />
        </div>
      </header>

      {/* Main Form Body */}
      <main className="px-5 pt-6 space-y-8 flex-1">
        {/* Title Header */}
        <section className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B1F0CE]/50 text-[#0F5238] text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5 text-[#0F5238]" />
            <span>Entrenamiento 100% Respetuoso con tu Cuerpo</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#191C1D] leading-tight font-headline">
            Cuéntanos tus necesidades articulares
          </h1>
          <p className="text-sm text-[#404943] leading-relaxed">
            Adaptamos cada ejercicio a tus puntos sensibles para que entrenes con absoluta confianza, sin impacto ni miedo al dolor.
          </p>
        </section>

        {/* Section 1: Zonas de molestia articular */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#2D6A4F]" />
              <span>1. Zonas de molestia o rigidez</span>
            </h2>
            <span className="text-xs text-[#707973]">Multiselección</span>
          </div>
          <p className="text-xs text-[#707973]">
            Marca las articulaciones que necesitan máxima protección en tus sesiones:
          </p>

          <div className="grid grid-cols-1 gap-2">
            {DISCOMFORT_OPTIONS.map((opt) => {
              const isSelected = userProfile.discomfortZones.includes(opt.id);
              const isNone = opt.id === 'ninguna';

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleDiscomfortZone(opt.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? isNone
                        ? 'bg-[#E7F3EC] border-[#2D6A4F] shadow-xs'
                        : 'bg-[#FFF6ED] border-[#F4A261] shadow-xs'
                      : 'bg-white border-[#E1E3E4] hover:border-[#BFC9C1]'
                  }`}
                >
                  <div className="pr-3">
                    <span
                      className={`text-sm font-bold block ${
                        isSelected
                          ? isNone
                            ? 'text-[#0F5238]'
                            : 'text-[#8E4E14]'
                          : 'text-[#191C1D]'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-xs text-[#707973] block mt-0.5">
                      {opt.description}
                    </span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? isNone
                          ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                          : 'bg-[#F4A261] border-[#F4A261] text-white'
                        : 'border-[#BFC9C1] bg-[#F8F9FA]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Nivel de Movilidad */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2D6A4F]" />
              <span>2. Tu nivel de movilidad actual</span>
            </h2>
            <span className="text-xs text-[#707973]">Selecciona uno</span>
          </div>
          <p className="text-xs text-[#707973]">
            Determina la posición base y la exigencia postural de tu programa:
          </p>

          <div className="space-y-2.5">
            {MOBILITY_LEVELS.map((level) => {
              const isSelected = userProfile.mobilityLevel === level.id;
              const IconComp = level.icon;

              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setMobilityLevel(level.id)}
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
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2D6A4F]">
                        {level.order} • {level.badge}
                      </span>
                      {isSelected && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#2D6A4F] text-white">
                          Activo
                        </span>
                      )}
                    </div>
                    <strong className="text-sm font-bold text-[#191C1D] block">
                      {level.title}
                    </strong>
                    <p className="text-xs text-[#404943] mt-1 leading-relaxed">
                      {level.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 3: Antropometría y Composición Corporal */}
        <section className="space-y-3.5 bg-white p-4.5 rounded-2xl border border-[#E1E3E4] shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#2D6A4F]" />
              <span>3. Antropometría y Perfil Físico</span>
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#0F5238]">
              Dinámico
            </span>
          </div>
          <p className="text-xs text-[#707973] leading-relaxed">
            Permite personalizar tu gasto calórico estimado y medir tus progresos de salud a lo largo del año.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label htmlFor="input-height" className="text-xs font-bold text-[#404943] flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Altura (cm)</span>
              </label>
              <div className="relative">
                <input
                  id="input-height"
                  type="number"
                  min="100"
                  max="250"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  placeholder="Ej: 168"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E1E3E4] bg-[#F8F9FA] text-[#191C1D] font-bold text-sm focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition-all pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#707973] font-medium pointer-events-none">
                  cm
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="input-weight" className="text-xs font-bold text-[#404943] flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Peso actual (kg)</span>
              </label>
              <div className="relative">
                <input
                  id="input-weight"
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="Ej: 72.5"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E1E3E4] bg-[#F8F9FA] text-[#191C1D] font-bold text-sm focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition-all pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#707973] font-medium pointer-events-none">
                  kg
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Non-stigmatizing BMI display */}
          {bmiAssessment && (
            <div className="mt-3 p-3.5 rounded-xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0F5238]">IMC Calculado:</span>
                  <span className="text-sm font-extrabold text-[#0F5238]">
                    {bmiAssessment.bmi} kg/m²
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#2D6A4F] text-white">
                  {bmiAssessment.label}
                </span>
              </div>
              <p className="text-xs font-bold text-[#0F5238] italic">
                “El IMC es solo una referencia inicial, la composición corporal y la fuerza son lo verdaderamente importante.”
              </p>
              <p className="text-[11px] text-[#404943] leading-relaxed">
                {bmiAssessment.advice}
              </p>
            </div>
          )}
        </section>

        {/* Section 4: Material en Casa */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2D6A4F]" />
              <span>4. Material disponible en casa</span>
            </h2>
            <span className="text-xs text-[#707973]">Multiselección</span>
          </div>
          <p className="text-xs text-[#707973]">
            No necesitas comprar nada. Ajustamos todo a los elementos que tengas a mano:
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {EQUIPMENT_OPTIONS.map((item) => {
              const isSelected = userProfile.availableEquipment.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleEquipment(item.id)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-150 flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-[#E7F3EC] border-[#2D6A4F] shadow-2xs'
                      : 'bg-white border-[#E1E3E4] hover:border-[#BFC9C1]'
                  }`}
                >
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs font-bold block truncate ${
                        isSelected ? 'text-[#0F5238]' : 'text-[#191C1D]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Informative Safety Guarantee Card */}
        <div className="p-4 rounded-2xl bg-[#FFF6ED] border border-[#FFDCC4] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#8E4E14] shrink-0 mt-0.5" />
          <p className="text-xs text-[#8E4E14] leading-relaxed">
            <strong>Garantía de Seguridad AdaptFit:</strong> Cualquier ejercicio que te genere molestia podrá ser reemplazado al instante mediante nuestro botón de pánico durante la sesión.
          </p>
        </div>
      </main>

      {/* Fixed Bottom Bar with 56px Action Button */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#EDEEEF] p-4 z-40 shadow-lg">
        <button
          type="button"
          disabled={!isFormValid}
          onClick={handleContinue}
          className={`w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-md transition-all duration-200 ${
            isFormValid
              ? 'bg-[#2D6A4F] text-white hover:bg-[#0F5238] active:scale-[0.98]'
              : 'bg-[#EDEEEF] text-[#707973] cursor-not-allowed'
          }`}
        >
          <span>Continuar a mi Plan Anual</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};
