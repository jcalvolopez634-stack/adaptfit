/**
 * AdaptFit - Pantalla de Onboarding: Evaluación Clínica y Motor de Adaptación
 * Registra sexo biológico, nivel de condición física, condiciones articulares y equipamiento.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BiologicalSex,
  FitnessLevel,
  HealthCondition,
  EquipmentAvailableChoice,
  AvailableEquipmentId,
  DumbbellType,
} from '../types';
import { calculateBMI } from '../utils/anthropometry';
import {
  Shield,
  Check,
  ArrowRight,
  Activity,
  Dumbbell,
  Sparkles,
  HeartHandshake,
  Scale,
  Ruler,
  Info,
  CheckSquare,
  Square,
  ShieldCheck,
  User,
} from 'lucide-react';

const BIOLOGICAL_SEX_OPTIONS: {
  id: BiologicalSex;
  label: string;
  badge: string;
  description: string;
}[] = [
  {
    id: 'Mujer',
    label: 'Mujer',
    badge: 'Cuidado Pélvico y Articular',
    description:
      'Ajustamos los ejercicios para reforzar caderas, proteger rodillas y cuidar tu postura con total seguridad.',
  },
  {
    id: 'Hombre',
    label: 'Hombre',
    badge: 'Espalda y Postura',
    description:
      'Ajustamos los ejercicios para liberar tensión en la columna, ganar flexibilidad y cuidar la espalda baja.',
  },
];

const FITNESS_LEVEL_OPTIONS: {
  id: FitnessLevel;
  label: string;
  badge: string;
  repsDesc: string;
  description: string;
}[] = [
  {
    id: 'Iniciación / Recuperación',
    label: 'Iniciación / Recuperación',
    badge: 'Cuidado Máximo',
    repsDesc: '8 reps • 60s descanso',
    description:
      'Ideal si hace tiempo no entrenas, tienes miedo a lesionarte o sales de un periodo de inactividad o dolor.',
  },
  {
    id: 'Moderado',
    label: 'Moderado',
    badge: 'Equilibrio Funcional',
    repsDesc: '10 reps • 45s descanso',
    description:
      'Capacidad para realizar movimientos cotidianos sin fatiga extrema; buscas tono muscular y articulaciones firmes.',
  },
  {
    id: 'Activo habitual',
    label: 'Activo habitual',
    badge: 'Fuerza Progresiva',
    repsDesc: '12 reps • 35s descanso',
    description:
      'Acostumbrado a moverte a diario; buscas estímulo de fuerza funcional con tensión mecánica y mayor dinamismo.',
  },
];

const HEALTH_CONDITIONS_OPTIONS: {
  id: HealthCondition;
  label: string;
  clinicalRule: string;
}[] = [
  {
    id: 'Molestia en rodillas',
    label: 'Molestia en rodillas',
    clinicalRule:
      'Adaptamos las flexiones a tu rango cómodo y evitamos cualquier impacto en rodillas.',
  },
  {
    id: 'Molestia lumbar (espalda baja)',
    label: 'Molestia lumbar (espalda baja)',
    clinicalRule:
      'Protegemos tu zona lumbar evitando flexiones bruscas y reforzando el abdomen de forma segura.',
  },
  {
    id: 'Molestia en hombros / cuello',
    label: 'Molestia en hombros / cuello',
    clinicalRule:
      'Cuidamos el cuello y evitamos elevar cargas por encima de la línea de los hombros.',
  },
  {
    id: 'Molestia o limitación en cadera',
    label: 'Molestia o limitación en cadera',
    clinicalRule:
      'Ejercicios suaves y estables sin aperturas forzadas ni flexiones profundas.',
  },
  {
    id: 'Problemas de equilibrio',
    label: 'Problemas de equilibrio',
    clinicalRule:
      'Siempre con apoyo seguro en silla firme o pared para entrenar con total tranquilidad.',
  },
  {
    id: 'Ninguna',
    label: 'Ninguna molestia (Articulaciones libres)',
    clinicalRule:
      'Movimiento libre y progresión equilibrada de fuerza y vitalidad.',
  },
];

const EQUIPMENT_OPTIONS: {
  id: AvailableEquipmentId;
  label: string;
  icon: string;
  description: string;
  isMandatory?: boolean;
}[] = [
  {
    id: 'peso_corporal',
    label: 'Peso corporal',
    icon: '🧘',
    description: 'La base segura de todos los ejercicios. Siempre activo por defecto.',
    isMandatory: true,
  },
  {
    id: 'silla_firme',
    label: 'Silla firme / Banco',
    icon: '🪑',
    description: 'Silla resistente sin ruedas para ejercicios sentados y apoyo asistido.',
  },
  {
    id: 'pared_libre',
    label: 'Pared despejada',
    icon: '🧱',
    description: 'Espacio vertical despejado para apoyos isométricos y descargas posturales.',
  },
  {
    id: 'bandas_elasticas',
    label: 'Bandas elásticas',
    icon: '🎗️',
    description: 'Resistencia elástica progresiva suave sin aceleraciones bruscas ni inercia.',
  },
  {
    id: 'mancuernas',
    label: 'Mancuernas / Pesos',
    icon: '🏋️',
    description: 'Sobrecarga con mancuernas ligeras (1 a 5+ kg) o botellas de agua.',
  },
  {
    id: 'esterilla',
    label: 'Esterilla / Colchoneta',
    icon: '🧘‍♂️',
    description: 'Comodidad para ejercicios en el suelo (puente glúteo y movilidad lumbopélvica).',
  },
];

export const OnboardingClinicalScreen: React.FC = () => {
  const {
    userProfile,
    saveUserProfile,
    setBiologicalSex,
    setFitnessLevel,
    toggleHealthCondition,
    toggleEquipment,
    setDumbbellConfig,
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
    // Navegar al siguiente paso del onboarding
    navigateTo('onboarding_macrocycle');
  };

  const isFormValid =
    Boolean(userProfile.biologicalSex) &&
    Boolean(userProfile.fitnessLevel) &&
    (userProfile.healthConditions || []).length > 0 &&
    (userProfile.availableEquipment || []).length > 0;

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
              Evaluación Clínica
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#E7F3EC] px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-[#0F5238]">Paso 2</span>
            <span className="text-xs text-[#707973]">de 3</span>
          </div>
        </div>

        {/* Progress bar track */}
        <div className="w-full bg-[#EDEEEF] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#2D6A4F] h-full w-2/3 rounded-full transition-all duration-500" />
        </div>
      </header>

      {/* Main Form Body */}
      <main className="px-5 pt-6 space-y-7 flex-1">
        {/* Title Header */}
        <section className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238] text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Plan adaptado y 100% seguro</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#191C1D] leading-tight">
            Ajustemos tu entrenamiento a tu medida
          </h1>
          <p className="text-xs text-[#525B54] leading-relaxed">
            Diseñamos tus ejercicios para cuidar tu postura, proteger tus articulaciones y asegurar que entrenes con total confianza desde el primer día.
          </p>
        </section>

        {/* 1. Sexo Biológico */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-2">
              <User className="w-4 h-4 text-[#2D6A4F]" />
              <span>1. Sexo Biológico</span>
            </h2>
            <span className="text-[11px] text-[#707973]">Anatomía y cuidado postural</span>
          </div>
          <p className="text-xs text-[#707973]">
            Ajustamos los ejercicios para cuidar tu espalda, pelvis y articulaciones:
          </p>

          <div className="grid grid-cols-2 gap-3">
            {BIOLOGICAL_SEX_OPTIONS.map((opt) => {
              const isSelected = userProfile.biologicalSex === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBiologicalSex(opt.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[120px] ${
                    isSelected
                      ? 'border-[#2D6A4F] bg-[#E7F3EC]/70 shadow-xs'
                      : 'border-[#EDEEEF] bg-white hover:border-[#CFD3D1]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span
                      className={`text-sm font-black ${
                        isSelected ? 'text-[#0F5238]' : 'text-[#191C1D]'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                          : 'border-[#D0D4D2] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#2D6A4F]/10 text-[#0F5238] self-start mb-1.5">
                    {opt.badge}
                  </span>

                  <p className="text-[10px] text-[#525B54] leading-snug">
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Nivel de Condición Física */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2D6A4F]" />
              <span>2. Nivel de Condición Física</span>
            </h2>
            <span className="text-[11px] text-[#707973]">Descansos y volumen</span>
          </div>
          <p className="text-xs text-[#707973]">
            Calibra los tiempos de pausa y repeticiones prescritas por serie:
          </p>

          <div className="space-y-2.5">
            {FITNESS_LEVEL_OPTIONS.map((lvl) => {
              const isSelected = userProfile.fitnessLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setFitnessLevel(lvl.id)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-[#2D6A4F] bg-[#E7F3EC]/70 shadow-xs'
                      : 'border-[#EDEEEF] bg-white hover:border-[#CFD3D1]'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-black ${
                          isSelected ? 'text-[#0F5238]' : 'text-[#191C1D]'
                        }`}
                      >
                        {lvl.label}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2D6A4F]/10 text-[#0F5238]">
                        {lvl.badge}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#2D6A4F] block mb-1">
                      {lvl.repsDesc}
                    </span>
                    <p className="text-xs text-[#525B54] leading-relaxed">
                      {lvl.description}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${
                      isSelected
                        ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                        : 'border-[#D0D4D2] bg-[#F8F9FA]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Condiciones de Salud Articular (Checkboxes) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#2D6A4F]" />
              <span>3. Puntos de Salud y Molestias Articulares</span>
            </h2>
            <span className="text-[11px] text-[#707973]">Checkboxes</span>
          </div>
          <p className="text-xs text-[#707973]">
            Marca las zonas donde suelas sentir molestias (adaptaremos o sustituiremos los ejercicios automáticamente para evitar dolor):
          </p>

          <div className="space-y-2">
            {HEALTH_CONDITIONS_OPTIONS.map((cond) => {
              const isSelected = (userProfile.healthConditions || []).includes(cond.id);
              const isNone = cond.id === 'Ninguna';

              return (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => toggleHealthCondition(cond.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? isNone
                        ? 'border-[#2D6A4F] bg-[#E7F3EC]'
                        : 'border-[#F4A261] bg-[#FFF6ED]'
                      : 'border-[#EDEEEF] bg-white hover:border-[#CFD3D1]'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 text-[#2D6A4F]">
                      {isSelected ? (
                        <CheckSquare
                          className={`w-5 h-5 ${
                            isNone ? 'text-[#2D6A4F]' : 'text-[#F4A261]'
                          }`}
                        />
                      ) : (
                        <Square className="w-5 h-5 text-[#BCC1BE]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span
                        className={`text-xs font-black block ${
                          isSelected
                            ? isNone
                              ? 'text-[#0F5238]'
                              : 'text-[#8E4E14]'
                            : 'text-[#191C1D]'
                        }`}
                      >
                        {cond.label}
                      </span>
                      <span className="text-[11px] text-[#525B54] block mt-0.5 leading-snug">
                        <strong>Adaptación segura:</strong> {cond.clinicalRule}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Equipamiento Disponible (Selección Múltiple) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#2D6A4F]" />
              <span>4. Equipamiento Disponible en Casa</span>
            </h2>
            <span className="text-[11px] text-[#707973]">Selección múltiple</span>
          </div>
          <p className="text-xs text-[#707973]">
            Marca todo el material del que dispones. El motor adaptará los ejercicios únicamente a tu inventario real:
          </p>

          <div className="space-y-2">
            {EQUIPMENT_OPTIONS.map((eq) => {
              const isSelected = (userProfile.availableEquipment || []).includes(eq.id);
              const isMandatory = eq.id === 'peso_corporal';

              return (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => toggleEquipment(eq.id)}
                  disabled={isMandatory}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#2D6A4F] bg-[#E7F3EC]/70 shadow-xs'
                      : 'border-[#EDEEEF] bg-white hover:border-[#CFD3D1]'
                  } ${isMandatory ? 'cursor-default opacity-95' : ''}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl shrink-0">{eq.icon}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-black block ${
                            isSelected ? 'text-[#0F5238]' : 'text-[#191C1D]'
                          }`}
                        >
                          {eq.label}
                        </span>
                        {isMandatory && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#2D6A4F] text-white">
                            Base obligatoria
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#525B54] block mt-0.5">
                        {eq.description}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                        : 'border-[#D0D4D2] bg-[#F8F9FA]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Si tiene mancuernas seleccionadas, permitir afinar tipo y pesos */}
          {(userProfile.availableEquipment || []).includes('mancuernas') && (
            <div className="p-4 bg-white border border-[#2D6A4F]/30 rounded-2xl space-y-3 mt-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#191C1D] flex items-center gap-1.5">
                  <span>🏋️</span> Configuración de Pesas / Mancuernas
                </span>
                <span className="text-[10px] text-[#2D6A4F] font-bold">Sobrecarga adaptada</span>
              </div>

              {/* Selector de Tipo de Mancuerna */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'fijas' as DumbbellType, label: 'Pesas fijas (pares)', desc: '1kg, 2kg, 3kg...' },
                  { id: 'ajustables_discos' as DumbbellType, label: 'Ajustables / Discos', desc: 'Barra con rosca' },
                ].map((t) => {
                  const isCur = (userProfile.dumbbellType || 'fijas') === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setDumbbellConfig(t.id, userProfile.availableWeightsKg || [1, 2, 3, 4, 5])}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isCur
                          ? 'border-[#2D6A4F] bg-[#E7F3EC] text-[#0F5238] font-bold'
                          : 'border-[#EDEEEF] bg-[#F8F9FA] text-[#404943]'
                      }`}
                    >
                      <span className="text-xs font-bold block">{t.label}</span>
                      <span className="text-[10px] text-[#707973] block mt-0.5">{t.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Pesos sugeridos / disponibles */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#707973] block">
                  Pesos disponibles que tienes en casa (kg):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map((w) => {
                    const hasWeight = (userProfile.availableWeightsKg || [1, 2, 3, 4, 5]).includes(w);
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => {
                          const current = userProfile.availableWeightsKg || [1, 2, 3, 4, 5];
                          let next: number[];
                          if (hasWeight) {
                            next = current.filter((item) => item !== w);
                            if (next.length === 0) next = [w]; // Al menos un peso
                          } else {
                            next = [...current, w].sort((a, b) => a - b);
                          }
                          setDumbbellConfig(userProfile.dumbbellType || 'fijas', next);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          hasWeight
                            ? 'bg-[#2D6A4F] text-white shadow-2xs'
                            : 'bg-[#F3F4F5] text-[#707973] hover:bg-[#EDEEEF]'
                        }`}
                      >
                        {w} kg
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 5. Antropometría Opcional */}
        <section className="space-y-3 bg-white p-4.5 rounded-2xl border border-[#E1E3E4] shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#2D6A4F]" />
              <span>5. Antropometría Opcional</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#0F5238]">
              No vinculante
            </span>
          </div>
          <p className="text-xs text-[#707973] leading-relaxed">
            Permite estimar el gasto metabólico y registrar tu evolución corporal de forma respetuosa.
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

          {bmiAssessment && (
            <div className="mt-3 p-3.5 rounded-xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F5238]">
                  IMC: {bmiAssessment.bmi} kg/m²
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2D6A4F] text-white">
                  {bmiAssessment.label}
                </span>
              </div>
              <p className="text-[11px] text-[#404943] leading-relaxed">
                {bmiAssessment.advice}
              </p>
            </div>
          )}
        </section>

        {/* Safety Guarantee */}
        <div className="p-4 rounded-2xl bg-[#E7F3EC] border border-[#B1F0CE] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
          <p className="text-xs text-[#0F5238] leading-relaxed">
            <strong>Protección Activa en Vivo:</strong> En cualquier momento de tu entrenamiento podrás pulsar el botón de pánico para sustituir un ejercicio por una alternativa suave sin impacto o descartarlo de inmediato.
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
          <span>Guardar Perfil y Diseñar mi Plan</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};

