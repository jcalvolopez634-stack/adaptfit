/**
 * AdaptFit - Biblioteca Extensa de Ejercicios Biomecánicos
 * Catálogo completo categorizado por material (BODYWEIGHT, CHAIR_WALL, ELASTIC_BANDS, DUMBBELLS),
 * nivel biomecánico (Terapéutico, Cero Impacto, Medio, Avanzado), patrones de movimiento,
 * variantes adaptadas y fichas pedagógicas con mapeo sensorial consciente.
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EXERCISES_DATABASE } from '../data/exercisesData';
import {
  BiomechanicalLevel,
  MovementPattern,
  AvailableEquipmentId,
} from '../types';
import { CatalogExercise } from '../data/exercisesData';
import {
  ArrowLeft,
  Search,
  Dumbbell,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Armchair,
  Activity,
  Heart,
  Play,
  RotateCcw,
} from 'lucide-react';

type MaterialFilter = 'ALL' | 'BODYWEIGHT' | 'CHAIR_WALL' | 'ELASTIC_BANDS' | 'DUMBBELLS';
type LevelFilter = 'ALL' | BiomechanicalLevel;
type PatternFilter = 'ALL' | MovementPattern;

export const ExerciseLibraryScreen: React.FC = () => {
  const { goBack, navigateTo, startWorkoutSession } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialFilter>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('ALL');
  const [selectedPattern, setSelectedPattern] = useState<PatternFilter>('ALL');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    return EXERCISES_DATABASE.filter((ex) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = (ex.name || ex.title).toLowerCase().includes(query);
        const matchesMuscleGroup = (ex.targetMuscleGroup || '').toLowerCase().includes(query);
        const matchesMusclesList = (ex.targetMuscles || []).some((m) =>
          m.toLowerCase().includes(query)
        );
        const matchesSubtitle = (ex.subtitle || '').toLowerCase().includes(query);
        if (!matchesName && !matchesMuscleGroup && !matchesMusclesList && !matchesSubtitle) {
          return false;
        }
      }

      // Material filter
      if (selectedMaterial !== 'ALL') {
        const eq = ex.requiredEquipment || [];
        if (selectedMaterial === 'BODYWEIGHT') {
          if (!eq.includes('peso_corporal') && !eq.includes('esterilla')) {
            return false;
          }
        } else if (selectedMaterial === 'CHAIR_WALL') {
          if (!eq.includes('silla_firme') && !eq.includes('pared_libre')) {
            return false;
          }
        } else if (selectedMaterial === 'ELASTIC_BANDS') {
          if (!eq.includes('bandas_elasticas')) {
            return false;
          }
        } else if (selectedMaterial === 'DUMBBELLS') {
          if (!eq.includes('mancuernas')) {
            return false;
          }
        }
      }

      // Biomechanical Level filter
      if (selectedLevel !== 'ALL') {
        if (ex.biomechanicalLevel !== selectedLevel) {
          return false;
        }
      }

      // Movement pattern filter
      if (selectedPattern !== 'ALL') {
        if (ex.movementPattern !== selectedPattern) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedMaterial, selectedLevel, selectedPattern]);

  const getLevelBadge = (level: BiomechanicalLevel) => {
    switch (level) {
      case 'terapeutico_silla':
        return {
          label: 'Terapéutico (Silla)',
          bg: 'bg-[#E7F3EC]',
          text: 'text-[#0F5238]',
          border: 'border-[#B1F0CE]',
        };
      case 'cero_impacto_suave':
        return {
          label: 'Cero Impacto',
          bg: 'bg-[#E8F1FA]',
          text: 'text-[#1D4ED8]',
          border: 'border-[#BFDBFE]',
        };
      case 'medio_perdida_peso':
        return {
          label: 'Medio / Pérdida Peso',
          bg: 'bg-[#FEF3C7]',
          text: 'text-[#B45309]',
          border: 'border-[#FDE68A]',
        };
      case 'avanzado_fuerza':
        return {
          label: 'Avanzado / Fuerza',
          bg: 'bg-[#FEE2E2]',
          text: 'text-[#B91C1C]',
          border: 'border-[#FECACA]',
        };
    }
  };

  const getMaterialLabel = (equip: AvailableEquipmentId[]) => {
    if (!equip || equip.length === 0) return 'Peso Corporal';
    if (equip.includes('mancuernas')) return 'Mancuernas';
    if (equip.includes('bandas_elasticas')) return 'Bandas Elásticas';
    if (equip.includes('silla_firme')) return 'Silla';
    if (equip.includes('pared_libre')) return 'Pared';
    if (equip.includes('esterilla')) return 'Esterilla';
    return 'Peso Corporal';
  };

  const toggleExpand = (id: string) => {
    setExpandedExerciseId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-28">
      {/* Top Header */}
      <header className="px-5 pt-6 pb-4 bg-white border-b border-[#EDEEEF] sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#191C1D] flex items-center justify-center transition-all"
            title="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238] text-xs font-bold">
            <Dumbbell className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Biblioteca Biomecánica</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-[#191C1D] leading-tight">
              Catálogo de Ejercicios
            </h1>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238]">
              {filteredExercises.length} disponibles
            </span>
          </div>
          <p className="text-xs text-[#707973] mt-1">
            Progresiones por nivel, material y protección articular adaptativa.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mt-3.5">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707973]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, músculo o articulación..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#E1E3E4] bg-[#F8F9FA] focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition-all placeholder:text-[#8D9390]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#707973] hover:text-[#191C1D]"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="px-5 pt-4 space-y-4 flex-1">
        {/* Filter Bar: Material */}
        <section className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#707973] flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Material / Equipamiento</span>
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'BODYWEIGHT', label: 'Peso Corporal' },
              { id: 'CHAIR_WALL', label: 'Silla / Pared' },
              { id: 'ELASTIC_BANDS', label: 'Bandas' },
              { id: 'DUMBBELLS', label: 'Mancuernas' },
            ].map((mat) => (
              <button
                key={mat.id}
                type="button"
                onClick={() => setSelectedMaterial(mat.id as MaterialFilter)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedMaterial === mat.id
                    ? 'bg-[#2D6A4F] text-white shadow-xs'
                    : 'bg-white border border-[#E1E3E4] text-[#404943] hover:bg-[#F3F4F5]'
                }`}
              >
                {mat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Filter Bar: Nivel Biomecánico */}
        <section className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#707973]">
            Nivel Biomecánico
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'ALL', label: 'Todos los niveles' },
              { id: 'terapeutico_silla', label: 'Terapéutico (Silla)' },
              { id: 'cero_impacto_suave', label: 'Cero Impacto' },
              { id: 'medio_perdida_peso', label: 'Medio' },
              { id: 'avanzado_fuerza', label: 'Avanzado' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setSelectedLevel(lvl.id as LevelFilter)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedLevel === lvl.id
                    ? 'bg-[#191C1D] text-white shadow-xs'
                    : 'bg-white border border-[#E1E3E4] text-[#404943] hover:bg-[#F3F4F5]'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </section>

        {/* Exercise Cards List */}
        <section className="space-y-3 pt-1">
          {filteredExercises.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#EDEEEF] space-y-2">
              <Info className="w-8 h-8 text-[#707973] mx-auto opacity-60" />
              <p className="text-sm font-bold text-[#191C1D]">
                No se encontraron ejercicios
              </p>
              <p className="text-xs text-[#707973]">
                Prueba ajustando los filtros de nivel o material.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMaterial('ALL');
                  setSelectedLevel('ALL');
                  setSelectedPattern('ALL');
                }}
                className="mt-2 text-xs font-bold text-[#2D6A4F] hover:underline"
              >
                Restablecer todos los filtros
              </button>
            </div>
          ) : (
            filteredExercises.map((exercise) => {
              const isExpanded = expandedExerciseId === exercise.id;
              const levelBadge = getLevelBadge(exercise.biomechanicalLevel);
              const targetMuscle = exercise.targetMuscleGroup || (exercise.targetMuscles || [])[0] || 'Musculatura General';

              return (
                <article
                  key={exercise.id}
                  className="rounded-3xl bg-white border border-[#E1E3E4] shadow-xs overflow-hidden transition-all duration-200"
                >
                  {/* Card Header Summary */}
                  <div
                    onClick={() => toggleExpand(exercise.id)}
                    className="p-4 cursor-pointer hover:bg-[#FAFBFC] transition-colors"
                  >
                    <div className="flex gap-3">
                      {/* Mini Single Reference Image Preview */}
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F3F4F5] border border-[#EDEEEF] shrink-0">
                        <img
                          src={
                            exercise.singleReferenceImage ||
                            exercise.mainCoverIllustration ||
                            exercise.steps?.[0]?.previewUrl ||
                            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={exercise.name || exercise.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* INSIGNIA DESTACADA: GRUPO MUSCULAR PRINCIPAL */}
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#E7F3EC] text-[#0F5238] border border-[#B1F0CE] flex items-center gap-1">
                            <Activity className="w-2.5 h-2.5 text-[#2D6A4F]" />
                            <span>{targetMuscle}</span>
                          </span>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${levelBadge.bg} ${levelBadge.text} ${levelBadge.border}`}
                          >
                            {levelBadge.label}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-[#191C1D] leading-snug pt-0.5 truncate">
                          {exercise.name || exercise.title}
                        </h3>
                        <p className="text-xs text-[#525B54] line-clamp-2 leading-relaxed">
                          {exercise.subtitle}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="w-7 h-7 rounded-full bg-[#F3F4F5] flex items-center justify-center text-[#707973] shrink-0 mt-1"
                        title={isExpanded ? 'Colapsar' : 'Ver detalles técnicos'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#EDEEEF] text-xs">
                      <span className="text-[11px] text-[#707973]">
                        {exercise.requiredEquipment || 'Peso corporal'}
                      </span>
                      <span className="text-[11px] text-[#2D6A4F] font-bold">
                        {exercise.durationSeconds}s TUT • Foco {targetMuscle}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Technical Breakdown */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-3 bg-[#F8F9FA] border-t border-[#EDEEEF] space-y-3 text-xs">
                      {/* Full Reference Image */}
                      <div className="relative rounded-2xl overflow-hidden bg-[#F3F4F5] border border-[#E1E3E4] aspect-16/9 shadow-inner">
                        <img
                          src={
                            exercise.singleReferenceImage ||
                            exercise.mainCoverIllustration ||
                            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80'
                          }
                          alt={exercise.name || exercise.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold">
                          Postura General &middot; {targetMuscle}
                        </div>
                      </div>

                      {/* Desglose Pedagógico en Texto */}
                      <div className="p-3 rounded-2xl bg-white border border-[#E1E3E4] space-y-2.5">
                        <strong className="text-[11px] uppercase tracking-wider text-[#2D6A4F] block">
                          Desglose Pedagógico Paso a Paso
                        </strong>

                        {/* Paso 0: Colocación Inicial */}
                        <div className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#EDEEEF] space-y-0.5">
                          <span className="text-[10px] font-extrabold text-[#2D6A4F] uppercase tracking-wide block">
                            Paso 0: Colocación inicial
                          </span>
                          <p className="text-[11px] text-[#404943] leading-relaxed">
                            {exercise.setupStep0 ||
                              exercise.steps?.[0]?.description ||
                              'Alinea la postura antes de empezar sin forzar articulaciones.'}
                          </p>
                        </div>

                        {/* Pasos 1, 2 y 3 */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-extrabold text-[#707973] uppercase tracking-wide block">
                            Pasos 1-2-3 de ejecución
                          </span>
                          {exercise.steps1To3 && exercise.steps1To3.length > 0 ? (
                            exercise.steps1To3.map((stepText, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                                <span className="w-4 h-4 rounded-full bg-[#E7F3EC] text-[#0F5238] font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="text-[#191C1D] leading-snug">{stepText}</span>
                              </div>
                            ))
                          ) : (
                            (exercise.steps || []).slice(1, 4).map((step, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                                <span className="w-4 h-4 rounded-full bg-[#E7F3EC] text-[#0F5238] font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="text-[#191C1D] leading-snug">{step.description}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Dónde Notarlo */}
                      <div className="p-3 rounded-2xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-1">
                        <span className="text-[11px] font-bold text-[#0F5238] block">
                          Dónde notarlo (Sensación diana)
                        </span>
                        <p className="text-[11px] text-[#0F5238] leading-relaxed">
                          {exercise.whereToFeel || exercise.sensoryMapping}
                        </p>
                      </div>

                      {/* Errores Comunes a Evitar */}
                      <div className="p-3 rounded-2xl bg-[#FFF6ED] border border-[#FFDCC4] space-y-1">
                        <span className="text-[11px] font-bold text-[#8E4E14] block">
                          Errores comunes a evitar
                        </span>
                        <ul className="text-[11px] text-[#8E4E14] space-y-0.5 pl-4 list-disc">
                          {exercise.commonMistakes && exercise.commonMistakes.length > 0 ? (
                            exercise.commonMistakes.map((mistake, mIdx) => (
                              <li key={mIdx}>{mistake}</li>
                            ))
                          ) : (
                            <li>{exercise.avoidError?.description || 'Evitar perder la alineación anatómica.'}</li>
                          )}
                        </ul>
                      </div>

                      {/* Action to Start/Practice */}
                      <button
                        type="button"
                        onClick={() => {
                          startWorkoutSession(false);
                          navigateTo('workout_active');
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#2D6A4F] text-white font-bold text-xs hover:bg-[#0F5238] flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Practicar en Sesión de Entrenamiento</span>
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
};
