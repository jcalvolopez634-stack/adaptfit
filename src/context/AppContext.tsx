/**
 * AdaptFit - Global Application Context & State Management
 * Complete production-ready state with real clinical exercises, viability calculator,
 * panic-switch mechanics, adaptive post-workout feedback, low-energy mode, and local persistence.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  UserProfile,
  AnnualMacroCyclePlan,
  Exercise,
  ActiveWorkoutState,
  PostWorkoutCheckIn,
  WeekDayConsistencyItem,
  RestShield,
  RoadStageNode,
  Achievement,
  ClinicalWeeklyMetric,
  ViabilityAssessment,
  WorkoutFrequencyDays,
  SessionDurationMinutes,
  DayOfWeek,
  FunctionalTestQuestion,
  MacroCycleGoalId,
  JointDiscomfortZone,
  MobilityLevelId,
  AvailableEquipmentId,
  RPEFeeling,
  BodyDiscomfortCheck,
  WorkoutIntensityMode,
  ActiveTab,
  ScreenId,
  CompletedWorkout,
  CompletedWorkoutExerciseRecord,
  ExerciseSetRecord,
  AnthropometricRecord,
  TrackingPreferences,
  JointSafetyIncident,
  JointSafetyActionType,
  BiologicalSex,
  FitnessLevel,
  HealthCondition,
  EquipmentAvailableChoice,
  DumbbellType,
  BodyGoals,
  BodyRecompositionGoal,
  BodyFocusZone,
} from '../types';
import {
  calculateBMI,
  calculateBodyCompositionAdvice,
  BodyCompositionAdvice,
  calculateBodyRecompositionAnalysis,
  RecompositionAnalysis,
  PerimeterComparison,
  FocusZoneRecommendation,
  calculateBodyRecompositionMetrics,
  BodyRecompositionMetrics,
  ClinicalPerimeterRow,
} from '../utils/anthropometry';
import { EXERCISES_DATABASE, findSafeAlternativesForExercise, SafeAlternativeOption } from '../data/exercisesData';

export const DEFAULT_TRACKING_PREFERENCES: TrackingPreferences = {
  trackWeightBMI: true,
  trackBodyPerimeters: true,
  trackJointPain: true,
  trackRpeEnergy: true,
  trackRestAndVolume: true,
};

// ==========================================
// SEED DATABASE: 8 EJERCICIOS REALES Y PEDAGÓGICOS
// ==========================================

export const INITIAL_EXERCISE_DATABASE: Exercise[] = [
  {
    id: 'ex-1-sentadilla-silla',
    title: 'Sentadilla Asistida con Silla',
    subtitle: 'Ideal para fortalecer cuádriceps sin sobrecargar rodillas.',
    block: 'principal',
    orderInBlock: 3,
    totalInBlock: 8,
    durationSeconds: 45,
    isKneeSafe: true,
    requiredEquipment: ['silla_firme', 'peso_corporal'],
    targetMuscles: ['Cuádriceps', 'Glúteos', 'Core'],
    sensoryMapping:
      'Debes notarlo en los músculos delanteros de los muslos (cuádriceps) y glúteos. Cero tensión en la zona lumbar.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description:
        'Doblar la espalda hacia adelante o dejar que las rodillas se cierren hacia adentro al bajar.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description:
        'Mantener el pecho erguido, mirar al frente y alinear las rodillas con la punta de los pies.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Postura',
        title: 'Posición Inicial Segura',
        description:
          'Párate frente a una silla firme, pies separados al ancho de tus caderas con los dedos ligeramente hacia afuera.',
        visualAlt:
          'Persona mayor en postura erguida y segura frente a una silla firme en sala iluminada.',
        previewUrl:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Bajar',
        title: 'Iniciando el descenso',
        description:
          'Lleva la cadera hacia atrás lentamente como si fueras a sentarte, manteniendo el peso en los talones.',
        visualAlt:
          'Movimiento controlado bajando hacia la silla con apoyo en talones.',
        previewUrl:
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Subir',
        title: 'Elevación controlada',
        description:
          'Empuja con fuerza desde los talones para volver a subir de pie de forma suave y sin prisa.',
        visualAlt: 'Subiendo con fuerza desde piernas manteniendo espalda recta.',
        previewUrl:
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Respirar',
        title: 'Respiración y pausa',
        description:
          'Inhala al bajar y exhala con fuerza al subir. Mantén tu ritmo cardíaco estable.',
        visualAlt: 'Pausa consciente y respiración tranquila.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [
      {
        id: 'alt-extension-pierna',
        title: 'Extensión de piernas sentado',
        subtitle: 'Cero presión en rodillas • 0 min de espera',
        benefitBadge: 'Cero impacto',
        iconType: 'chair',
        reason: 'Elimina todo el soporte de peso en rodillas y rótula.',
      },
      {
        id: 'alt-puente-cama',
        title: 'Puente pélvico suave en cama',
        subtitle: 'Realizable acostado • Muy seguro',
        benefitBadge: 'Soporte total',
        iconType: 'bed',
        reason: 'Trabaja glúteos e isquiotibiales sin flexión extrema de rodilla.',
      },
    ],
  },
  {
    id: 'ex-2-puente-pelvico',
    title: 'Puente de Glúteos con Apoyo Lumbar',
    subtitle: 'Fortalece la pelvis y cadera reduciendo el dolor de espalda baja.',
    block: 'principal',
    orderInBlock: 4,
    totalInBlock: 8,
    durationSeconds: 45,
    isKneeSafe: true,
    requiredEquipment: ['esterilla', 'peso_corporal'],
    targetMuscles: ['Glúteos mayores', 'Isquiotibiales', 'Erectores espinales'],
    sensoryMapping:
      'Sensación de activación en glúteos al elevar la pelvis. El cuello, hombros y rostro deben sentirse 100% relajados.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description:
        'Arquear la espalda lumbar en exceso o empujar la fuerza desde los hombros y cuello.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description:
        'Clavar talones en el suelo, activar el abdomen y contraer glúteos en el punto más alto.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Postura',
        title: 'Apoyo dorsal cómodo',
        description:
          'Túmbate boca arriba con las rodillas dobladas y las plantas de los pies firmes a la distancia de las caderas.',
        visualAlt: 'Alineación dorsal neutra con brazos a los costados.',
        previewUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Elevar',
        title: 'Subida con glúteos',
        description:
          'Presiona los talones y despega la pelvis creando una suave rampa recta desde rodillas hasta hombros.',
        visualAlt: 'Pelvis elevada contrayendo glúteos de forma controlada.',
        previewUrl:
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Sostener',
        title: 'Pausa isométrica',
        description:
          'Mantén 2 segundos arriba sintiendo la fuerza en la parte trasera de tus muslos y glúteos.',
        visualAlt: 'Sosteniendo postura sin forzar columna.',
        previewUrl:
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Bajar',
        title: 'Descenso suave vértebra a vértebra',
        description:
          'Baja como si apoyaras una perla a la vez en el suelo, exhalando profundamente.',
        visualAlt: 'Descenso relajante hacia la superficie.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [
      {
        id: 'alt-apreton-isom-silla',
        title: 'Contracción isométrica en silla',
        subtitle: 'Para quienes prefieren no acostarse en el suelo',
        benefitBadge: 'Cero suelo',
        iconType: 'chair',
        reason: 'Permite tonificar glúteos desde la comodidad del asiento.',
      },
      {
        id: 'alt-extension-cadera-pared',
        title: 'Extensión de cadera de pie en pared',
        subtitle: 'Soporte vertical estable',
        benefitBadge: 'Postura de pie',
        iconType: 'wall',
        reason: 'Fortalece la cadena posterior sin flexionar las rodillas.',
      },
    ],
  },
  {
    id: 'ex-3-flexiones-pared',
    title: 'Flexiones Asistidas en Pared',
    subtitle: 'Fuerza de empuje superior para brazos y pecho sin presión articular.',
    block: 'principal',
    orderInBlock: 5,
    totalInBlock: 8,
    durationSeconds: 40,
    isKneeSafe: true,
    requiredEquipment: ['pared_libre', 'peso_corporal'],
    targetMuscles: ['Pectorales', 'Tríceps', 'Deltoides anterior', 'Core'],
    sensoryMapping:
      'Trabajo en brazos y pecho. El cuerpo se siente como una tabla firme sin arquear la cintura.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description:
        'Dejar caer la cadera hacia la pared o abrir los codos formando una letra "T" con los hombros.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description:
        'Mantener los codos a unos 45 grados del cuerpo y presionar uniformemente con toda la palma.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Postura',
        title: 'Alineación frente a la pared',
        description:
          'Párate a un brazo de distancia, coloca las palmas a la altura del pecho y separa los pies al ancho de hombros.',
        visualAlt: 'Posición vertical con manos apoyadas en pared.',
        previewUrl:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Bajar',
        title: 'Acercamiento en bloque',
        description:
          'Flexiona los codos suavemente acercando la nariz y el pecho hacia la pared sin despegar talones en exceso.',
        visualAlt: 'Acercando el cuerpo a la pared manteniendo alineación.',
        previewUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Subir',
        title: 'Empuje consciente',
        description:
          'Empuja la pared con las palmas hasta regresar a la postura inicial sin bloquear bruscamente los codos.',
        visualAlt: 'Empuje suave con activación de brazos.',
        previewUrl:
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Respirar',
        title: 'Sincronización respiratoria',
        description:
          'Inhala al doblar codos y exhala de forma constante mientras empujas.',
        visualAlt: 'Respiración pausada en posición erguida.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [
      {
        id: 'alt-empuje-isom-cojin',
        title: 'Empuje pectoral con cojín en silla',
        subtitle: 'Sin necesidad de estar de pie ni peso en muñecas',
        benefitBadge: 'Cero muñeca',
        iconType: 'cushion',
        reason: 'Aprieta un cojín entre las palmas frente al pecho.',
      },
    ],
  },
  {
    id: 'ex-4-marcha-silla',
    title: 'Marcha Segura Sentado',
    subtitle: 'Activación cardiovascular y de cadera 100% libre de impacto.',
    block: 'calentamiento',
    orderInBlock: 1,
    totalInBlock: 8,
    durationSeconds: 50,
    isKneeSafe: true,
    requiredEquipment: ['silla_firme', 'peso_corporal'],
    targetMuscles: ['Flexores de cadera', 'Abdomen bajo', 'Pantorrillas'],
    sensoryMapping:
      'Calor reconfortante en la parte frontal de las caderas y aumento suave del ritmo respiratorio.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description:
        'Encorvar los hombros hacia adelante o golpear con fuerza los pies al apoyarlos.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description:
        'Mantener el torso erguido como si un hilo tirara de tu coronilla y apoyar los pies silenciosamente.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Postura',
        title: 'Asiento firme y activo',
        description:
          'Siéntate erguido sin apoyarte en el respaldo, manos en los muslos o a los lados de la silla.',
        visualAlt: 'Postura sentada erguida y lista para la marcha.',
        previewUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Subir',
        title: 'Elevación de rodilla',
        description:
          'Eleva la rodilla derecha unos centímetros sin perder la postura recta del torso.',
        visualAlt: 'Elevando rodilla de forma controlada sin tirones.',
        previewUrl:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Bajar',
        title: 'Apoyo almohadillado',
        description:
          'Baja el pie con suavidad y eleva la rodilla izquierda alternando de forma rítmica.',
        visualAlt: 'Transición rítmica entre ambas piernas.',
        previewUrl:
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Ritmo',
        title: 'Respiración continua',
        description:
          'Respira de manera regular mientras tus piernas marchan como un péndulo seguro.',
        visualAlt: 'Ritmo constante sin fatiga respiratoria.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [
      {
        id: 'alt-punteo-pies',
        title: 'Punteo alterno de pies',
        subtitle: 'Para días de menor energía o molestia en cadera',
        benefitBadge: 'Mínimo esfuerzo',
        iconType: 'chair',
        reason: 'Solo elevas talones manteniendo las puntas en contacto.',
      },
    ],
  },
  {
    id: 'ex-5-abrazo-al-sol',
    title: 'Aperturas Escapulares ("El Abrazo")',
    subtitle: 'Alivio dorsal y descompresión de hombros y cuello.',
    block: 'calentamiento',
    orderInBlock: 2,
    totalInBlock: 8,
    durationSeconds: 45,
    isKneeSafe: true,
    requiredEquipment: ['peso_corporal'],
    targetMuscles: ['Romboides', 'Trapecio medio', 'Deltoides posterior'],
    sensoryMapping:
      'Apertura reconfortante en el pecho y agradable activación entre los omóplatos sin tensión en la nuca.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description:
        'Encoger los hombros hacia las orejas o arquear la zona lumbar para compensar.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description:
        'Imagina sostener una nuez entre las escápulas y mantén el cuello largo y relajado.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Postura',
        title: 'Brazos al frente',
        description:
          'De pie o sentado, junta los antebrazos frente al rostro con codos a 90 grados.',
        visualAlt: 'Brazos en ángulo de 90 grados frente al pecho.',
        previewUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Abrir',
        title: 'Expansión del pecho',
        description:
          'Abre los codos hacia los lados sintiendo cómo se estiran los pectorales.',
        visualAlt: 'Apertura lateral de codos expandiendo el tórax.',
        previewUrl:
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Juntar',
        title: 'Retracción de omóplatos',
        description:
          'Junta conscientemente los omóplatos detrás durante 1 segundo con suavidad.',
        visualAlt: 'Activación dorsal sin tensión cervical.',
        previewUrl:
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Cerrar',
        title: 'Retorno con exhalación',
        description:
          'Regresa los codos al centro lentamente expulsando todo el aire retenido.',
        visualAlt: 'Vuelta al centro suave y relajada.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [
      {
        id: 'alt-rotacion-hombros',
        title: 'Círculos suaves de hombros',
        subtitle: 'Movilidad aún más relajada',
        benefitBadge: 'Suavidad extra',
        iconType: 'chair',
        reason: 'Círculos lentos hacia atrás para liberar tensión del cuello.',
      },
    ],
  },
  {
    id: 'ex-6-bascula-lumbar',
    title: 'Báscula Pélvica y Core en Silla',
    subtitle: 'Desbloquea rigidez lumbar y activa el abdomen profundo.',
    block: 'principal',
    orderInBlock: 6,
    totalInBlock: 8,
    durationSeconds: 45,
    isKneeSafe: true,
    requiredEquipment: ['silla_firme'],
    targetMuscles: ['Transverso abdominal', 'Suelo pélvico', 'Multífidos'],
    sensoryMapping:
      'Un suave masaje interno en la espalda baja. Sensación de protección en la cintura como una faja natural.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description:
        'Hacer fuerza brusca con las piernas o contener la respiración con el estómago duro.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description:
        'Movimiento milimétrico y fluido, hundiendo suavemente el ombligo al redondear.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Postura',
        title: 'Pelvis neutra',
        description:
          'Sentado con manos en los muslos, nota el apoyo de tus isquiones en la base de la silla.',
        visualAlt: 'Postura neutra sentada sobre isquiones.',
        previewUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Inhalar',
        title: 'Curvatura suave',
        description:
          'Inhala llevando el ombligo hacia adelante creando una ligera curva lumbar confortable.',
        visualAlt: 'Leve anteversión pélvica consciente.',
        previewUrl:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Exhalar',
        title: 'Retroversión protectora',
        description:
          'Exhala llevando el ombligo hacia tu columna y apoyando la parte posterior de la pelvis.',
        visualAlt: 'Retroversión pélvica aliviando presión discal.',
        previewUrl:
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Fluir',
        title: 'Ritmo continuo',
        description:
          'Continúa balanceando la pelvis despacio al ritmo de tu respiración natural.',
        visualAlt: 'Movimiento fluido y curativo.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [
      {
        id: 'alt-gato-camello-pared',
        title: 'Gato-Camello de pie apoyado en pared',
        subtitle: 'Alivio lumbar de pie',
        benefitBadge: 'De pie asistido',
        iconType: 'wall',
        reason: 'Flexión y extensión suave de columna apoyando manos en la pared.',
      },
    ],
  },
  {
    id: 'ex-7-extension-cuadriceps',
    title: 'Extensión de Cuádriceps con Pausa',
    subtitle: 'Nutrición del cartílago rotuliano y fortalecimiento del vasto interno.',
    block: 'principal',
    orderInBlock: 7,
    totalInBlock: 8,
    durationSeconds: 45,
    isKneeSafe: true,
    requiredEquipment: ['silla_firme'],
    targetMuscles: ['Vasto interno', 'Recto femoral'],
    sensoryMapping:
      'Firmeza agradable justo encima de la rodilla. La articulación no debe crujir con dolor.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description:
        'Lanzar la pierna con patada rápida o encorvar el tronco hacia atrás.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description:
        'Extender despacio con la punta del pie hacia ti y sostener 2 segundos la contracción.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Postura',
        title: 'Firmeza en asiento',
        description:
          'Siéntate con la espalda bien erguida y rodillas dobladas a 90 grados.',
        visualAlt: 'Postura sentada recta para extensión de pierna.',
        previewUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Subir',
        title: 'Estirar la pierna',
        description:
          'Extiende la pierna derecha al frente hasta que quede paralela al suelo o donde sea cómodo.',
        visualAlt: 'Extensión controlada de rodilla con punta hacia arriba.',
        previewUrl:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Pausa',
        title: 'Foco muscular',
        description:
          'Aprieta el muslo durante 2 segundos asegurando la estabilidad de la rótula.',
        visualAlt: 'Pausa isométrica en el pico de extensión.',
        previewUrl:
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Bajar',
        title: 'Descenso suave',
        description:
          'Baja en 3 segundos y repite alternando con la otra pierna de forma balanceada.',
        visualAlt: 'Bajada controlada protegiendo ligamentos.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [
      {
        id: 'alt-isom-cojin-rodillas',
        title: 'Apretón isométrico con cojín entre rodillas',
        subtitle: 'Cero movimiento articular de rodilla',
        benefitBadge: 'Cero fricción',
        iconType: 'cushion',
        reason: 'Aprieta un cojín entre rodillas durante 5 segundos y relaja.',
      },
    ],
  },
  {
    id: 'ex-8-respiracion-diafragma',
    title: 'Vuelta a la Calma y Respiración Diafragmática',
    subtitle: 'Baja pulsaciones, reduce cortisol y consolida el bienestar físico.',
    block: 'vuelta_a_la_calma',
    orderInBlock: 8,
    totalInBlock: 8,
    durationSeconds: 60,
    isKneeSafe: true,
    requiredEquipment: ['peso_corporal'],
    targetMuscles: ['Diafragma', 'Sistema nervioso parasimpático'],
    sensoryMapping:
      'Sensación de ligereza, alivio articular y calidez en todo el cuerpo. El corazón late con serenidad.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description:
        'Respirar de forma superficial solo con el pecho alto o forzar la retención de aire.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description:
        'Sentir cómo el abdomen se expande suavemente como un globo al inhalar por la nariz.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Postura',
        title: 'Manos en el abdomen',
        description:
          'Sentado con ojos cerrados o mirada suave, apoya una mano en tu pecho y otra en el vientre.',
        visualAlt: 'Persona relajada con manos sobre vientre y pecho.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Inhalar',
        title: 'Inspiración nasal profunda (4 seg)',
        description:
          'Toma aire por la nariz durante 4 segundos dirigiendo el aire hacia la mano del vientre.',
        visualAlt: 'Inhalación tranquila expandiendo diafragma.',
        previewUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Pausa',
        title: 'Pausa de serenidad (2 seg)',
        description:
          'Sostén el aire 2 segundos notando la tranquilidad de tus músculos.',
        visualAlt: 'Pausa reparadora de calma absoluta.',
        previewUrl:
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Exhalar',
        title: 'Exhalación lenta por la boca (6 seg)',
        description:
          'Suelta el aire lentamente como si soplaras una vela sin apagarla, liberando toda tensión.',
        visualAlt: 'Exhalación reparadora y placentera.',
        previewUrl:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [
      {
        id: 'alt-estiramiento-cuello-suave',
        title: 'Inclinación lateral de cuello',
        subtitle: 'Para tensión acumulada en trapecios',
        benefitBadge: 'Alivio cervical',
        iconType: 'chair',
        reason: 'Inclinación suave de cabeza a hombro respirando lento.',
      },
    ],
  },
];

// ==========================================
// SESIÓN ADAPTADA PARA DÍA DE BAJA ENERGÍA (7 MIN)
// ==========================================

export const LOW_ENERGY_EXERCISES: Exercise[] = [
  {
    id: 'low-1-respiracion-apertura',
    title: 'Respiración Consciente y Calma',
    subtitle: '7 minutos sin impacto para oxigenar articulaciones y descansar la mente.',
    block: 'calentamiento',
    orderInBlock: 1,
    totalInBlock: 3,
    durationSeconds: 120,
    isKneeSafe: true,
    requiredEquipment: ['peso_corporal'],
    targetMuscles: ['Diafragma', 'Espalda alta'],
    sensoryMapping: 'Alivio y relajación muscular instantánea sin exigencia de rendimiento.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description: 'Forzar o juzgar tu nivel de cansancio hoy.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description: 'Disfrutar del movimiento como un regalo para tu salud.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Postura',
        title: 'Sentado confortable',
        description: 'Apóyate cómodo en la silla y suelta el peso de los hombros.',
        visualAlt: 'Sentado cómodo y relajado.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Inhalar',
        title: 'Aire sanador',
        description: 'Inhala suave por la nariz sintiendo expansión en tu pecho.',
        visualAlt: 'Inhalación relajante.',
        previewUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Exhalar',
        title: 'Liberar fatiga',
        description: 'Exhala por la boca sintiendo cómo se disuelven las tensiones.',
        visualAlt: 'Exhalación suave.',
        previewUrl:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Paz',
        title: 'Sonrisa interior',
        description: 'Agradece a tu cuerpo por estar aquí hoy.',
        visualAlt: 'Tranquilidad y gratitud.',
        previewUrl:
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [],
  },
  {
    id: 'low-2-circulos-hombros',
    title: 'Círculos Suaves de Hombros y Apertura',
    subtitle: 'Desbloquea el cuello y la espalda media sentado.',
    block: 'principal',
    orderInBlock: 2,
    totalInBlock: 3,
    durationSeconds: 150,
    isKneeSafe: true,
    requiredEquipment: ['silla_firme'],
    targetMuscles: ['Hombros', 'Trapecios', 'Escápulas'],
    sensoryMapping: 'Sensación de masaje en la parte superior de la espalda.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description: 'Hacer giros rápidos o bruscos.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description: 'Girar en cámara lenta coordinando con la respiración.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Postura',
        title: 'Brazos sueltos',
        description: 'Brazos colgando relajados a los lados de la silla.',
        visualAlt: 'Brazos sueltos relajados.',
        previewUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Subir',
        title: 'Hacia las orejas',
        description: 'Sube los hombros despacio tomando aire.',
        visualAlt: 'Elevación suave de hombros.',
        previewUrl:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Atrás',
        title: 'Círculo hacia atrás',
        description: 'Llévalos hacia atrás juntando suavemente las escápulas.',
        visualAlt: 'Rotación hacia atrás abriendo el pecho.',
        previewUrl:
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Bajar',
        title: 'Descenso agradable',
        description: 'Baja los hombros soltando el aire por la boca.',
        visualAlt: 'Descenso total de hombros.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [],
  },
  {
    id: 'low-3-estiramiento-lumbar-sentado',
    title: 'Estiramiento Lumbar Sentado con Abrazo',
    subtitle: 'Descompresión vertebral suave sin tensión en rodillas.',
    block: 'vuelta_a_la_calma',
    orderInBlock: 3,
    totalInBlock: 3,
    durationSeconds: 150,
    isKneeSafe: true,
    requiredEquipment: ['silla_firme'],
    targetMuscles: ['Erectores espinales', 'Dorsales'],
    sensoryMapping: 'Sensación de espacio entre las vértebras lumbares.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description: 'Tirarse hacia adelante de golpe.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description: 'Redondear la espalda despacio apoyando los codos en las rodillas.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Postura',
        title: 'Pies bien apoyados',
        description: 'Pies firmes en el suelo ligeramente separados.',
        visualAlt: 'Pies separados en postura estable.',
        previewUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Apoyo',
        title: 'Codos a rodillas',
        description: 'Apoya los antebrazos sobre los muslos para descargar la espalda.',
        visualAlt: 'Antebrazos sobre muslos descargando peso dorsal.',
        previewUrl:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Redondear',
        title: 'Soltar la cabeza',
        description: 'Deja caer suavemente la coronilla mirando al suelo entre tus pies.',
        visualAlt: 'Cabeza relajada hacia el suelo.',
        previewUrl:
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Respirar',
        title: 'Respira hacia la espalda baja',
        description: 'Siente cómo el aire llena la zona lumbar 5 veces seguidas.',
        visualAlt: 'Respiración relajante dorsal.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [],
  },
];

// ==========================================
// SESIÓN BONUS VOLUNTARIA (10-12 MIN)
// ==========================================

export const BONUS_WORKOUT_EXERCISES: Exercise[] = [
  {
    id: 'bonus-1-movilidad-espinal',
    title: 'Descompresión Espinal y Báscula Pélvica',
    subtitle: 'Movilidad guiada sin impacto para oxigenar discos vertebrales (4 min).',
    block: 'principal',
    orderInBlock: 1,
    totalInBlock: 3,
    durationSeconds: 120,
    isKneeSafe: true,
    requiredEquipment: ['silla_firme', 'peso_corporal'],
    targetMuscles: ['Columna dorso-lumbar', 'Pelvis', 'Diafragma'],
    sensoryMapping:
      'Sensación de ligereza en la zona lumbar y calor suave y relajante entre omóplatos.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description: 'Hacer movimientos bruscos o forzar el cuello hacia atrás.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description:
        'Mover la pelvis como un cuenco de agua sin derramarla, coordinando con respiración suave.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Alineación',
        title: 'Sentado erguido',
        description: 'Coloca los pies planos en el suelo y manos sobre los muslos.',
        visualAlt: 'Postura inicial sentada erguida.',
        previewUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Inhalar',
        title: 'Apertura de pecho',
        description: 'Inhala llevando suavemente los hombros atrás y abriendo el esternón.',
        visualAlt: 'Apertura dorsal suave.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Exhalar',
        title: 'Redondeo lumbar',
        description: 'Exhala escondiendo el ombligo despacio, creando una C suave con tu espalda.',
        visualAlt: 'Redondeo lumbar suave.',
        previewUrl:
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Fluidez',
        title: 'Ritmo reparador',
        description: 'Repite 6 ciclos lentos sintiendo cómo se libera la tensión acumulada.',
        visualAlt: 'Movimiento fluido y curativo.',
        previewUrl:
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [],
  },
  {
    id: 'bonus-2-activacion-gluteo-suave',
    title: 'Activación Isométrica de Core y Cadera',
    subtitle: 'Estabilidad pélvica en silla sin tensión en rodillas (4 min).',
    block: 'principal',
    orderInBlock: 2,
    totalInBlock: 3,
    durationSeconds: 120,
    isKneeSafe: true,
    requiredEquipment: ['silla_firme'],
    targetMuscles: ['Glúteo medio', 'Transverso abdominal'],
    sensoryMapping:
      'Firmeza en los laterales de la cadera y abdomen profundo, cero dolor lumbar.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description: 'Contener la respiración o tensar la mandíbula.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description: 'Presionar los talones contra el suelo y exhalar contrayendo el abdomen bajo.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Postura',
        title: 'Base activa',
        description: 'Rodillas a 90 grados, torso alineado sin apoyar la espalda en el respaldo.',
        visualAlt: 'Base activa en silla.',
        previewUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Presión',
        title: 'Presión de talones',
        description: 'Empuja el suelo con los talones durante 5 segundos sintiendo los glúteos.',
        visualAlt: 'Contracción isométrica segura.',
        previewUrl:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Pausa',
        title: 'Respiración diafragmática',
        description: 'Inhala relajando 3 segundos y vuelve a repetir.',
        visualAlt: 'Pausa respiratoria controlada.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Control',
        title: 'Estabilidad total',
        description: 'Tu cuerpo se siente más fuerte y sostenido desde el centro.',
        visualAlt: 'Estabilidad central profunda.',
        previewUrl:
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [],
  },
  {
    id: 'bonus-3-estiramiento-isquiotibial',
    title: 'Estiramiento Guiado de Cadena Posterior',
    subtitle: 'Liberación de isquiotibiales y pantorrillas asistida con silla (4 min).',
    block: 'vuelta_a_la_calma',
    orderInBlock: 3,
    totalInBlock: 3,
    durationSeconds: 150,
    isKneeSafe: true,
    requiredEquipment: ['silla_firme'],
    targetMuscles: ['Isquiotibiales', 'Fascia plantar', 'Erectores'],
    sensoryMapping:
      'Alivio elástico placentero por detrás de las piernas sin dolor punzante.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description: 'Rebotar o intentar tocarte los pies a la fuerza.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description:
        'Mantener la pierna estirada al frente con talón apoyado y flexionarte desde la cadera con la espalda recta.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Posición',
        title: 'Extensión al frente',
        description: 'Siéntate en el borde de la silla y apoya el talón derecho al frente con la punta hacia arriba.',
        visualAlt: 'Talón apoyado con pierna estirada.',
        previewUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Inclinación',
        title: 'Flexión desde la cadera',
        description: 'Lleva el pecho hacia adelante con la espalda recta hasta sentir un estiramiento suave.',
        visualAlt: 'Inclinación axial suave.',
        previewUrl:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Sostener',
        title: 'Respiración de 20 segundos',
        description: 'Respira con calma sintiendo cómo cede la rigidez muscular.',
        visualAlt: 'Mantenimiento del estiramiento.',
        previewUrl:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Cambio',
        title: 'Cambio de lado',
        description: 'Regresa despacio y repite con la pierna izquierda.',
        visualAlt: 'Cambio de pierna suave.',
        previewUrl:
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [],
  },
];

// ==========================================
// SESIÓN DE FUERZA AVANZADA E HIPERTROFIA
// ==========================================

export const ADVANCED_STRENGTH_EXERCISES: Exercise[] = [
  {
    id: 'adv-1-flexiones-estandar',
    title: 'Flexiones Estándar con Sobrecarga o Declinadas',
    subtitle: 'Máxima activación de pectoral, deltoides anterior y tríceps con core blindado.',
    block: 'principal',
    orderInBlock: 1,
    totalInBlock: 6,
    durationSeconds: 45,
    isKneeSafe: true,
    requiredEquipment: ['peso_corporal'],
    targetMuscles: ['Pectoral mayor', 'Tríceps', 'Deltoides anterior', 'Core'],
    sensoryMapping: 'Fuerte tensión en el pecho y tríceps al empujar. Mantén el abdomen y glúteos contraídos como una tabla.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description: 'Dejar caer la cadera hacia el suelo o abrir los codos en ángulo de 90° respecto al torso.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description: 'Mantener codos a 45° en flecha, cuerpo alineado en una sola pieza y bajar hasta rozar el pecho con el suelo.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Posición',
        title: 'Plancha alta firme',
        description: 'Coloca manos al ancho de hombros en el suelo, pies juntos y empuja el suelo activando escápulas.',
        visualAlt: 'Posición inicial en plancha alta rígida.',
        previewUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Descenso',
        title: 'Bajada controlada (3 segundos)',
        description: 'Baja en 3 segundos manteniendo los codos a 45 grados sin perder la tensión de core.',
        visualAlt: 'Descenso excéntrico controlado rozando el suelo.',
        previewUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Empuje',
        title: 'Empuje explosivo concéntrico',
        description: 'Empuja el suelo con fuerza desde las palmas hasta extender completamente los brazos sin hiperextender codos.',
        visualAlt: 'Empuje potente y estable hacia arriba.',
        previewUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Progresión',
        title: 'Variante Declinada para Sobrecarga',
        description: 'Si dominas la versión estándar, apoya los pies sobre una silla firme o escalón para aumentar el peso corporal soportado.',
        visualAlt: 'Flexión declinada con pies elevados en silla.',
        previewUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [],
  },
  {
    id: 'adv-2-zancadas-bulgaras',
    title: 'Zancadas Búlgaras Unilaterales Profundas',
    subtitle: 'Sobrecarga de glúteo mayor y cuádriceps con gran demanda de equilibrio y fuerza pura.',
    block: 'principal',
    orderInBlock: 2,
    totalInBlock: 6,
    durationSeconds: 50,
    isKneeSafe: true,
    requiredEquipment: ['silla_firme', 'peso_corporal'],
    targetMuscles: ['Glúteo mayor', 'Cuádriceps', 'Isquiotibiales', 'Estabilizadores'],
    sensoryMapping: 'Fuerte estiramiento y quema muscular en el glúteo y cuádriceps de la pierna delantera.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description: 'Colapsar la rodilla hacia adentro o apoyar todo el peso en el pie trasero.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description: 'El 85% del peso recae sobre el talón delantero. Inclina el torso ligeramente hacia adelante a 70° para enfatizar el glúteo.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Apoyo',
        title: 'Empeine en la silla',
        description: 'Da un paso largo al frente y apoya el empeine trasero sobre una silla firme o banco.',
        visualAlt: 'Posición de zancada búlgara con pie trasero elevado.',
        previewUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Descenso',
        title: 'Flexión profunda de cadera',
        description: 'Baja verticalmente hasta que la rodilla trasera quede a 3 cm del suelo sintiendo la carga en el glúteo.',
        visualAlt: 'Descenso profundo de zancada búlgara.',
        previewUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Fuerza',
        title: 'Impulso desde el talón',
        description: 'Presiona fuerte el talón delantero contra el suelo para subir de forma sólida y estable.',
        visualAlt: 'Subida firme desde pierna delantera.',
        previewUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Tempo',
        title: 'Tempo estricto 3-1-1',
        description: 'Baja en 3 segundos, pausa 1 segundo en el fondo y sube en 1 segundo para máxima hipertrofia.',
        visualAlt: 'Control rítmico y respiración coordinada.',
        previewUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [],
  },
  {
    id: 'adv-3-sentadilla-goblet-tempo',
    title: 'Sentadillas con Tempo Lento y Pausa Isométrica',
    subtitle: 'Fuerza excéntrica, control postural y reclutamiento de fibras de contracción rápida.',
    block: 'principal',
    orderInBlock: 3,
    totalInBlock: 6,
    durationSeconds: 50,
    isKneeSafe: true,
    requiredEquipment: ['peso_corporal'],
    targetMuscles: ['Cuádriceps', 'Glúteo medio', 'Core espinal'],
    sensoryMapping: 'Activación intensa en muslos y cadera con torso erguido y talones clavados al suelo.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description: 'Rebotar bruscamente en el fondo o despegar los talones del suelo.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description: 'Descender en 3 segundos, sostener 2 segundos abajo en contracción y subir con aceleración controlada.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Alineación',
        title: 'Pies separados y core activo',
        description: 'Pies a anchura de hombros, puntas hacia afuera a 30 grados y pecho orgulloso.',
        visualAlt: 'Postura inicial de sentadilla libre.',
        previewUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Descenso',
        title: 'Descenso lento de 3 segundos',
        description: 'Abre las rodillas siguiendo la línea de los pies y baja la cadera por debajo del paralelo.',
        visualAlt: 'Descenso profundo controlado.',
        previewUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Pausa',
        title: 'Pausa isométrica de 2 segundos',
        description: 'Quédate abajo sin relajarte, manteniendo la tensión muscular al máximo antes de subir.',
        visualAlt: 'Pausa isométrica en el punto de máxima flexión.',
        previewUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Potencia',
        title: 'Empuje potente',
        description: 'Sube con fuerza apretando glúteos al completar la extensión.',
        visualAlt: 'Ascenso explosivo y bloqueo de cadera.',
        previewUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [],
  },
  {
    id: 'adv-4-remo-resistencia',
    title: 'Remo Pesado con Goma Fuerte o Mancuerna',
    subtitle: 'Hipertrofia de espalda media, dorsal ancho y estabilización escapular estricta.',
    block: 'principal',
    orderInBlock: 4,
    totalInBlock: 6,
    durationSeconds: 45,
    isKneeSafe: true,
    requiredEquipment: ['bandas_elasticas', 'mancuernas'],
    targetMuscles: ['Dorsal ancho', 'Romboides', 'Trapecio medio', 'Bíceps'],
    sensoryMapping: 'Siente cómo se juntan los omóplatos en la espalda al final de cada tirón sin encoger los hombros hacia las orejas.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description: 'Dar tirones con la espalda baja o encoger los hombros hacia el cuello.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description: 'Conducir el tirón desde los codos, apretando la espalda 1 segundo en el punto de máxima contracción.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Bisagra',
        title: 'Bisagra de cadera sólida',
        description: 'Flexiona ligeramente rodillas, lleva la cadera atrás con espalda plana y fija la banda bajo los pies.',
        visualAlt: 'Postura de bisagra de cadera con espalda neutra.',
        previewUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Tracción',
        title: 'Tracción hacia la cadera',
        description: 'Tira de la banda o mancuerna llevando los codos pegados al cuerpo hacia los bolsillos del pantalón.',
        visualAlt: 'Tirón de remo con codos pegados al torso.',
        previewUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Contracción',
        title: 'Pausa escapular de 1 segundo',
        description: 'Junta las escápulas atrás como si quisieras sostener una moneda entre ellas.',
        visualAlt: 'Pico de contracción de dorsales y romboides.',
        previewUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Retorno',
        title: 'Estiramiento controlado',
        description: 'Regresa en 2 segundos estirando completamente los dorsales sin perder la postura lumbar.',
        visualAlt: 'Extensión controlada de brazos.',
        previewUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [],
  },
  {
    id: 'adv-5-puente-unilateral',
    title: 'Puente de Glúteos a Una Pierna con Sobrecarga',
    subtitle: 'Potencia unilateral en cadena posterior, isquiotibiales y core posterior.',
    block: 'principal',
    orderInBlock: 5,
    totalInBlock: 6,
    durationSeconds: 45,
    isKneeSafe: true,
    requiredEquipment: ['peso_corporal'],
    targetMuscles: ['Glúteo mayor', 'Isquiotibiales', 'Erectores espinales'],
    sensoryMapping: 'Glúteo de la pierna de apoyo completamente en llamas con pelvis nivelada.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description: 'Dejar caer la cadera del lado elevado o arquear la zona lumbar excesivamente.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description: 'Empujar con el talón apoyado mientras mantienes las crestas ilíacas niveladas horizontalmente.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Apoyo',
        title: 'Una pierna elevada',
        description: 'Tumbado boca arriba, flexiona una rodilla con talón apoyado y eleva la otra pierna estirada al techo.',
        visualAlt: 'Posición de puente unilateral con pierna arriba.',
        previewUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Elevación',
        title: 'Extensión pura de cadera',
        description: 'Empuja con el talón contra el suelo elevando la pelvis hasta alinear rodilla, cadera y hombro.',
        visualAlt: 'Elevación de pelvis con máxima contracción de glúteo.',
        previewUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Bloqueo',
        title: 'Bloqueo de 2 segundos arriba',
        description: 'Aprieta el glúteo en el punto más alto durante 2 segundos asegurando la estabilidad.',
        visualAlt: 'Pausa en la cima del puente.',
        previewUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Control',
        title: 'Descenso sin descansar',
        description: 'Baja rozando el suelo y vuelve a subir de inmediato sin descargar el peso.',
        visualAlt: 'Descenso milimétrico y repetición fluida.',
        previewUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [],
  },
  {
    id: 'adv-6-plancha-dinamica',
    title: 'Plancha Abdominal Dinámica con Toque de Hombros',
    subtitle: 'Tensión isométrica y antirrotación de core de alta exigencia.',
    block: 'vuelta_a_la_calma',
    orderInBlock: 6,
    totalInBlock: 6,
    durationSeconds: 45,
    isKneeSafe: true,
    requiredEquipment: ['peso_corporal'],
    targetMuscles: ['Transverso abdominal', 'Oblicuos internos y externos', 'Deltoides'],
    sensoryMapping: 'Firmeza extrema en el abdomen. Tu cadera no debe balancearse de lado a lado.',
    avoidError: {
      title: 'Evita esto (Mal)',
      description: 'Mover la pelvis como un péndulo de un lado a otro al levantar la mano.',
    },
    correctAction: {
      title: 'Haz esto (Bien)',
      description: 'Separar los pies un poco más para tener base de soporte y mantener la cadera completamente quieta.',
    },
    steps: [
      {
        stepIndex: 0,
        stepShortName: 'Plancha',
        title: 'Plancha alta con base ancha',
        description: 'Manos debajo de hombros, pies separados al ancho de esterilla para máxima estabilidad.',
        visualAlt: 'Plancha alta con pies abiertos.',
        previewUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 1,
        stepShortName: 'Toque',
        title: 'Mano derecha a hombro izquierdo',
        description: 'Levanta la mano derecha despacio y toca el hombro izquierdo sin rotar la pelvis ni 1 grado.',
        visualAlt: 'Toque de hombro controlado con core rígido.',
        previewUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 2,
        stepShortName: 'Alternar',
        title: 'Apoyo y cambio al hombro opuesto',
        description: 'Apoya suavemente la mano y repite con la mano izquierda al hombro derecho.',
        visualAlt: 'Cambio de mano con cadera fija.',
        previewUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      },
      {
        stepIndex: 3,
        stepShortName: 'Respiración',
        title: 'Respiración rítmica bajo tensión',
        description: 'No aguantes la respiración. Exhala en cada toque y mantén las costillas cerradas.',
        visualAlt: 'Respiración diafragmática bajo contracción abdominal.',
        previewUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      },
    ],
    alternatives: [],
  },
];

// ==========================================
// HITOS Y LOGROS DE CONSTANCIA Y BIENESTAR REAL (100% DATOS DEL SISTEMA)
// ==========================================

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-primera-sesion',
    title: 'Primera sesión completada',
    category: 'Constancia',
    timeAgo: 'Meta de Inicio',
    description: 'Has dado el paso más importante: completar tu primera sesión de entrenamiento seguro.',
    requirementDescription: 'Completar 1 sesión real de entrenamiento.',
    verifiedByProgress: false,
    badgeIcon: 'Sparkles',
    unlocked: false,
    verificationType: 'automatic_data',
    currentMetricValue: 0,
    targetMetricValue: 1,
    metricUnit: 'sesión',
  },
  {
    id: 'ach-semana-perfecta',
    title: 'Semana perfecta (cumplidos todos los días planificados)',
    category: 'Constancia',
    timeAgo: 'Meta Semanal',
    description: 'Cumpliste el 100% de los días programados en tu calendario durante la semana.',
    requirementDescription: 'Completar todos los días planificados en una misma semana.',
    verifiedByProgress: false,
    badgeIcon: 'Calendar',
    unlocked: false,
    verificationType: 'automatic_data',
    currentMetricValue: 0,
    targetMetricValue: 3,
    metricUnit: 'días',
  },
  {
    id: 'ach-constancia-bronce',
    title: 'Constancia de bronce (10 sesiones reales)',
    category: 'Constancia',
    timeAgo: 'Hábito Consolidado',
    description: 'Has acumulado 10 sesiones reales de entrenamiento completadas en la app.',
    requirementDescription: 'Completar 10 sesiones reales de entrenamiento.',
    verifiedByProgress: false,
    badgeIcon: 'Trophy',
    unlocked: false,
    verificationType: 'automatic_data',
    currentMetricValue: 0,
    targetMetricValue: 10,
    metricUnit: 'sesiones',
  },
  {
    id: 'ach-proteccion-articular',
    title: 'Protección articular (5 sesiones sin reporte de dolor)',
    category: 'Bienestar',
    timeAgo: 'Salud Articular',
    description: '5 sesiones realizadas sin ningún reporte de dolor o molestia articular.',
    requirementDescription: 'Completar 5 sesiones registrando "Sin molestias articulares".',
    verifiedByProgress: false,
    badgeIcon: 'Smile',
    unlocked: false,
    verificationType: 'automatic_data',
    currentMetricValue: 0,
    targetMetricValue: 5,
    metricUnit: 'sesiones',
  },
];

// ==========================================
// ROAD STAGES (EL CAMINO DEL AÑO - 52 SEMANAS)
// ==========================================

export const INITIAL_ROAD_STAGES: RoadStageNode[] = [
  {
    weekNumber: 1,
    worldNumber: 1,
    title: 'Despertar Articular',
    status: 'en_curso',
    isCurrent: true,
  },
  {
    weekNumber: 2,
    worldNumber: 1,
    title: 'Equilibrio y Postura',
    status: 'bloqueado',
    isCurrent: false,
  },
  {
    weekNumber: 3,
    worldNumber: 1,
    title: 'Fuerza Base en Silla',
    status: 'bloqueado',
    isCurrent: false,
  },
  {
    weekNumber: 4,
    worldNumber: 1,
    title: 'Movilidad de Cadera',
    status: 'bloqueado',
    isCurrent: false,
  },
];

// ==========================================
// MÉTRICAS CLÍNICAS INICIALES (ESTADO 100% LIMPIO)
// ==========================================

export const INITIAL_CLINICAL_METRICS: ClinicalWeeklyMetric[] = [];

// ==========================================
// CONTEXT INTERFACE
// ==========================================

export interface AppContextType {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentScreen: ScreenId;
  screenHistory: ScreenId[];
  navigateTo: (screen: ScreenId) => void;
  goBack: () => void;

  // User Profile & Onboarding
  userProfile: UserProfile;
  saveUserProfile: (profile: Partial<UserProfile>) => void;
  setBiologicalSex: (sex: BiologicalSex) => void;
  setFitnessLevel: (level: FitnessLevel) => void;
  toggleHealthCondition: (condition: HealthCondition) => void;
  setEquipmentAvailable: (equipment: EquipmentAvailableChoice) => void;
  setDumbbellConfig: (type: DumbbellType, weights: number[]) => void;
  toggleDiscomfortZone: (zone: JointDiscomfortZone) => void;
  setMobilityLevel: (level: MobilityLevelId) => void;
  toggleEquipment: (eq: AvailableEquipmentId) => void;
  advanceOnboardingStep: () => void;
  resetOnboarding: () => void;

  // Annual MacroCycle Plan & Viability Advisor
  annualPlan: AnnualMacroCyclePlan;
  setMacroCycleGoal: (goalId: MacroCycleGoalId) => void;
  setWorkoutFrequency: (days: WorkoutFrequencyDays) => void;
  setSelectedDays: (days: DayOfWeek[]) => void;
  toggleSelectedDay: (day: DayOfWeek) => void;
  setSessionDuration: (minutes: SessionDurationMinutes) => void;
  currentViability: ViabilityAssessment;
  saveAnnualPlan: () => void;

  // Active Workout Session & Panic Button
  generateDailyWorkout: (isLowEnergy?: boolean) => {
    routineTitle: string;
    exercises: Exercise[];
    defaultIntensity: WorkoutIntensityMode;
  };
  activeWorkout: ActiveWorkoutState;
  startWorkoutSession: (isLowEnergy?: boolean) => void;
  startBonusWorkoutSession: () => void;
  pauseWorkoutSession: () => void;
  resumeWorkoutSession: () => void;
  togglePlayPauseWorkout: () => void;
  resetExerciseTimer: () => void;
  setWorkoutIntensityMode: (mode: WorkoutIntensityMode) => void;
  setActiveExerciseStep: (stepIndex: number) => void;
  openPanicReplacementModal: () => void;
  closePanicReplacementModal: () => void;
  replaceCurrentExercise: (alternativeId: string) => void;
  replaceCurrentExerciseWithAlternative: (altExercise: Exercise, reason?: string) => void;
  discardCurrentExerciseForSafety: (reason?: string) => void;
  startBreathingPause: () => void;
  stopBreathingPause: () => void;
  nextExercise: () => void;
  previousExercise: () => void;
  toggleAudioGuide: () => void;
  completeCurrentSession: () => void;

  // Motor de 3 Series, Descansos Interactivos y Fase de Preparación Previa
  startActiveSet: () => void;
  completeCurrentSet: () => void;
  skipRest: () => void;
  setConfiguredRestDuration: (seconds: number) => void;

  // Registro de Cargas (Pesos en kg) y Sobrecarga Progresiva
  setCurrentSetReps: (reps: number) => void;
  setCurrentSetWeightKg: (weightKg: number) => void;
  getPreviousExercisePerformance: (exerciseId: string) => {
    lastWeightKg?: number;
    lastReps?: number;
    suggestedWeightKg?: number;
    suggestedReps?: number;
    progressionMessage: string;
  };

  // Gamification & Extra Energy Points
  vitalityGems: number;
  consistencyPoints: number;
  bonusWorkoutsCompleted: number;

  // Low Energy Mode (7 min)
  isLowEnergyActive: boolean;
  toggleLowEnergyDayMode: (forceState?: boolean) => void;
  lowEnergySessionsCount: number;
  painFreeSessionsCount: number;

  // Post-Workout Check-in & Clinical Feedback
  postWorkoutCheckIn: PostWorkoutCheckIn | null;
  completedWorkouts: CompletedWorkout[];
  submitPostWorkoutCheckIn: (
    rpe: RPEFeeling,
    discomforts: BodyDiscomfortCheck[],
    extra?: {
      repsOrWeightNote?: string;
      unexpectedDiscomfort?: boolean;
      discomfortNotes?: string;
      volumeTotalKg?: number;
    }
  ) => void;

  // Streaks, Shield & Road
  streakWeeks: number;
  streakDays: number;
  weeklyConsistency: WeekDayConsistencyItem[];
  restShield: RestShield;
  toggleRestShield: () => void;
  roadStages: RoadStageNode[];
  currentWorld: 1 | 2 | 3 | 4;
  setCurrentWorld: (world: 1 | 2 | 3 | 4) => void;

  // Achievements ("Muro de Victorias")
  achievements: Achievement[];
  shareModalAchievement: Achievement | null;
  openShareModal: (achievement: Achievement) => void;
  closeShareModal: () => void;

  // Functional Verification Test Pop-up
  activeFunctionalTestQuestion: FunctionalTestQuestion | null;
  openFunctionalTestQuestion: (question: FunctionalTestQuestion) => void;
  closeFunctionalTestQuestion: () => void;
  submitFunctionalTestAnswer: (achievementId: string, passed: boolean) => void;
  functionalTestNotification: string | null;
  clearFunctionalTestNotification: () => void;

  // Clinical Report & Calendar Sync
  clinicalMetrics: ClinicalWeeklyMetric[];
  exportCalendarICS: () => void;
  downloadClinicalReportPDF: () => void;

  // Anthropometric & Body Composition & Recomposition
  anthropometricRecords: AnthropometricRecord[];
  addAnthropometricRecord: (record: {
    weightKg: number;
    heightCm?: number;
    shouldersCm?: number;
    chestCm?: number;
    waistCm?: number;
    hipCm?: number;
    thighCm?: number;
    armCm?: number;
    notes?: string;
    date?: string;
    bmi?: number;
    bmiCategory?: 'bajo_peso' | 'normopeso' | 'sobrepeso' | 'obesidad';
  }) => AnthropometricRecord;
  deleteAnthropometricRecord: (id: string) => void;
  updateAnthropometricRecord: (id: string, record: Partial<AnthropometricRecord>) => void;
  updateHeightAndWeight: (heightCm: number, weightKg: number) => void;
  updateBodyGoals: (goals: Partial<BodyGoals>) => void;
  calculateBodyCompositionAdvice: (
    weightKg?: number,
    heightCm?: number,
    sex?: BiologicalSex,
    discomfortZones?: JointDiscomfortZone[],
    waistCm?: number,
    hipCm?: number
  ) => BodyCompositionAdvice;
  bodyCompositionAdvice: BodyCompositionAdvice;
  recompositionAnalysis: RecompositionAnalysis;
  getBodyRecompositionAnalysis: () => RecompositionAnalysis;
  calculateBodyRecompositionMetrics: (records?: AnthropometricRecord[]) => BodyRecompositionMetrics;
  bodyRecompositionMetrics: BodyRecompositionMetrics;
}

// ==========================================
// CALCULADOR DEL ASESOR DE VIABILIDAD
// ==========================================

export function calculateViability(
  days: WorkoutFrequencyDays,
  minutes: SessionDurationMinutes
): ViabilityAssessment {
  const totalMonthlyMinutes = days * minutes * 4;
  const monthlyHours = parseFloat((totalMonthlyMinutes / 60).toFixed(1));

  if (days >= 5 || (days >= 4 && minutes >= 45)) {
    return {
      daysPerWeek: days,
      minutesPerSession: minutes,
      monthlyHours,
      adherencePercentage: 78,
      title: 'Ritmo intenso detectado',
      badgeType: 'intenso',
      description: `Con ${days} sesiones de ${minutes} minutos acumulas ${monthlyHours} horas al mes. Asegúrate de respetar los días de descanso activo para evitar fatiga articular o sobrecarga.`,
      recommendationNote:
        'Recomendado para personas con experiencia previa o bajo supervisión médica.',
    };
  } else if (days <= 2 && minutes <= 15) {
    return {
      daysPerWeek: days,
      minutesPerSession: minutes,
      monthlyHours,
      adherencePercentage: 98,
      title: 'Enfoque minimalista sostenible',
      badgeType: 'minimalista',
      description: `Con ${days} sesiones de ${minutes} minutos acumulas ${monthlyHours} horas al mes. Excelente para iniciar sin fricción y garantizar el hábito incluso con agendas muy ocupadas.`,
      recommendationNote:
        'Cero fricción: el punto de partida perfecto para crear el hábito sin esfuerzo.',
    };
  } else {
    return {
      daysPerWeek: days,
      minutesPerSession: minutes,
      monthlyHours,
      adherencePercentage: 94,
      title: 'Asesor de Viabilidad Inteligente',
      badgeType: 'ideal',
      description: `Excelente elección. Con ${days} sesiones de ${minutes} minutos semanales acumulas ${monthlyHours} horas al mes de estimulación funcional. Este volumen genera una adherencia del 94% sin sobrecargar tus articulaciones.`,
      recommendationNote:
        'Equilibrio óptimo entre estímulo regenerativo y recuperación articular.',
    };
  }
}

// ==========================================
// CONTEXT CREATION & PROVIDER IMPLEMENTATION
// ==========================================

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'adaptfit_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completedOnboarding && parsed.name && parsed.name !== 'Amparo') {
          return 'home';
        }
        if (parsed.name && parsed.name !== 'Amparo') {
          if (parsed.onboardingStep === 1) return 'onboarding_limitations';
          if (parsed.onboardingStep === 2) return 'onboarding_macrocycle';
        }
      }
    } catch {
      // ignore
    }
    return 'onboarding_welcome';
  });
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>([currentScreen]);

  const navigateTo = useCallback((screen: ScreenId) => {
    setCurrentScreen(screen);
    setScreenHistory((prev) => [...prev, screen]);
  }, []);

  const goBack = useCallback(() => {
    setScreenHistory((prev) => {
      if (prev.length <= 1) return prev;
      const nextHistory = prev.slice(0, -1);
      setCurrentScreen(nextHistory[nextHistory.length - 1]);
      return nextHistory;
    });
  }, []);

  // User Profile State (Default 100% Clean)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.name !== 'Amparo') {
          return {
            name: parsed.name || '',
            avatarType: parsed.avatarType || 'preset',
            avatarValue: parsed.avatarValue || 'avatar_sage',
            biologicalSex: parsed.biologicalSex || 'Mujer',
            fitnessLevel: parsed.fitnessLevel || 'Iniciación / Recuperación',
            healthConditions: parsed.healthConditions || ['Ninguna'],
            equipmentAvailable: parsed.equipmentAvailable || 'Solo peso corporal y silla',
            dumbbellType: parsed.dumbbellType || 'fijas',
            availableWeightsKg: parsed.availableWeightsKg || [1, 2, 3, 4, 5],
            heightCm: parsed.heightCm,
            weightKg: parsed.weightKg,
            discomfortZones: parsed.discomfortZones || ['ninguna'],
            mobilityLevel: parsed.mobilityLevel || 'cero_impacto',
            availableEquipment: parsed.availableEquipment || ['peso_corporal', 'silla_firme', 'pared_libre'],
            completedOnboarding: Boolean(parsed.completedOnboarding),
            onboardingStep: typeof parsed.onboardingStep === 'number' ? parsed.onboardingStep : 0,
            createdAt: parsed.createdAt || new Date().toISOString(),
            trackingPreferences: parsed.trackingPreferences || DEFAULT_TRACKING_PREFERENCES,
            bodyGoals: parsed.bodyGoals || {
              primaryGoal: 'recomposicion',
              targetWeightKg: undefined,
              targetWaistCm: undefined,
              focusZones: ['cintura', 'hombros', 'gluteos'],
            },
          };
        }
      }
    } catch {
      // ignore
    }
    return {
      name: '',
      avatarType: 'preset',
      avatarValue: 'avatar_sage',
      biologicalSex: 'Mujer',
      fitnessLevel: 'Iniciación / Recuperación',
      healthConditions: ['Ninguna'],
      equipmentAvailable: 'Solo peso corporal y silla',
      dumbbellType: 'fijas',
      availableWeightsKg: [1, 2, 3, 4, 5],
      heightCm: undefined,
      weightKg: undefined,
      discomfortZones: ['ninguna'],
      mobilityLevel: 'cero_impacto',
      availableEquipment: ['peso_corporal', 'silla_firme', 'pared_libre'],
      completedOnboarding: false,
      onboardingStep: 0,
      createdAt: new Date().toISOString(),
      trackingPreferences: DEFAULT_TRACKING_PREFERENCES,
      bodyGoals: {
        primaryGoal: 'recomposicion',
        targetWeightKg: undefined,
        targetWaistCm: undefined,
        focusZones: ['cintura', 'hombros', 'gluteos'],
      },
    };
  });

  // Anthropometric Records State
  const [anthropometricRecords, setAnthropometricRecords] = useState<
    AnthropometricRecord[]
  >(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_anthropometry`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        `${LOCAL_STORAGE_KEY}_anthropometry`,
        JSON.stringify(anthropometricRecords)
      );
    } catch {
      // ignore
    }
  }, [anthropometricRecords]);

  // Annual Plan State
  const [annualPlan, setAnnualPlan] = useState<AnnualMacroCyclePlan>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_plan`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          selectedDays:
            parsed.selectedDays && parsed.selectedDays.length > 0
              ? parsed.selectedDays
              : ['Lunes', 'Miércoles', 'Viernes'],
        };
      }
    } catch {
      // ignore
    }
    return {
      goalId: 'reto_funcional',
      daysPerWeek: 3,
      selectedDays: ['Lunes', 'Miércoles', 'Viernes'],
      minutesPerSession: 20,
      phases: [
        {
          quarter: 'Q1',
          monthsRange: 'Meses 1 - 3',
          subtitle: 'Fase inicial',
          title: 'Creación de Hábito y Técnica',
          accentColor: '#0f5238',
          description:
            'Adaptación neuromuscular y postura segura sin impacto articular.',
        },
        {
          quarter: 'Q2',
          monthsRange: 'Meses 4 - 6',
          subtitle: 'Fase progresiva',
          title: 'Expansión de Capacidad',
          accentColor: '#3A86C8',
          description:
            'Aumento suave de resistencia funcional y fuerza en piernas.',
        },
        {
          quarter: 'Q3',
          monthsRange: 'Meses 7 - 9',
          subtitle: 'Fase de consolidación',
          title: 'Resistencia Adaptada',
          accentColor: '#8e4e14',
          description:
            'Movimientos cotidianos más ágiles: subir escaleras y cargar objetos.',
        },
        {
          quarter: 'Q4',
          monthsRange: 'Meses 10 - 12',
          subtitle: 'Fase avanzada',
          title: 'Autonomía y Consolidación',
          accentColor: '#713638',
          description:
            'Independencia física duradera y mantenimiento del hábito sin dolor.',
        },
      ],
      updatedAt: new Date().toISOString(),
    };
  });

  // Gamification & Extra Energy Points State (Starts at 0)
  const [vitalityGems, setVitalityGems] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_gems`);
      if (saved) return Number(saved);
    } catch {
      // ignore
    }
    return 0;
  });

  const [consistencyPoints, setConsistencyPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_points`);
      if (saved) return Number(saved);
    } catch {
      // ignore
    }
    return 0;
  });

  const [bonusWorkoutsCompleted, setBonusWorkoutsCompleted] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_bonus_count`);
      if (saved) return Number(saved);
    } catch {
      // ignore
    }
    return 0;
  });

  const [lowEnergySessionsCount, setLowEnergySessionsCount] = useState<number>(0);
  const [painFreeSessionsCount, setPainFreeSessionsCount] = useState<number>(0);

  // Completed Workouts List (Strict zero-data initial state, 100% real user sessions)
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_completed_workouts`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (w) =>
              w &&
              w.id &&
              !w.id.toLowerCase().includes('seed') &&
              !w.id.toLowerCase().includes('mock')
          );
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Functional Verification Test Pop-up State
  const [activeFunctionalTestQuestion, setActiveFunctionalTestQuestion] =
    useState<FunctionalTestQuestion | null>(null);

  const [functionalTestNotification, setFunctionalTestNotification] =
    useState<string | null>(null);

  // Current Viability Memo
  const currentViability = useMemo(() => {
    return calculateViability(annualPlan.daysPerWeek, annualPlan.minutesPerSession);
  }, [annualPlan.daysPerWeek, annualPlan.minutesPerSession]);

  // Active Workout Session State
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState>(() => {
    const initialExercise = INITIAL_EXERCISE_DATABASE[0];
    return {
      isSessionActive: false,
      routineTitle: 'Fortalecimiento de Core y Estabilidad Lumbar',
      sessionNumber: 1,
      totalSessionsYear: 52,
      currentBlock: 'principal',
      blockNumber: 1,
      totalBlocks: 3,
      exerciseIndex: 0,
      currentExercise: initialExercise,
      workoutList: INITIAL_EXERCISE_DATABASE,
      intensityMode: 'adaptada',
      secondsRemaining: 0, // Cronómetro DETENIDO en 0 en fase de preparación
      isPlaying: false,
      isAudioGuideActive: true,
      selectedStepIndex: 0,
      isLowEnergySession: false,
      isPanicModalOpen: false,
      totalSessionTimeRemaining: '20:00 restantes',
      executionPhase: 'PREPARATION',
      currentSet: 1,
      totalSets: 3,
      restSecondsRemaining: 45,
      configuredRestDuration: 45,
      currentSetRepsInput: 10,
      currentSetWeightKgInput: 0,
      recordedSets: {},
    };
  });

  // Low Energy Day State
  const [isLowEnergyActive, setIsLowEnergyActive] = useState<boolean>(false);

  // Post Workout Check In
  const [postWorkoutCheckIn, setPostWorkoutCheckIn] =
    useState<PostWorkoutCheckIn | null>(null);

  // Consistency & Streaks (Zero Data Initial State)
  const [streakWeeks, setStreakWeeks] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [weeklyConsistency, setWeeklyConsistency] = useState<
    WeekDayConsistencyItem[]
  >(() => {
    const days: Array<{ letter: string; name: DayOfWeek }> = [
      { letter: 'L', name: 'Lunes' },
      { letter: 'M', name: 'Martes' },
      { letter: 'X', name: 'Miércoles' },
      { letter: 'J', name: 'Jueves' },
      { letter: 'V', name: 'Viernes' },
      { letter: 'S', name: 'Sábado' },
      { letter: 'D', name: 'Domingo' },
    ];
    const jsDay = new Date().getDay();
    const currentDayIdx = jsDay === 0 ? 6 : jsDay - 1;

    return days.map((d, idx) => ({
      dayLetter: d.letter,
      status: idx === currentDayIdx ? 'today' : 'pending',
      isToday: idx === currentDayIdx,
    }));
  });

  // Rest Shield State
  const [restShield, setRestShield] = useState<RestShield>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_shield`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      isActive: false,
      daysRemaining: 7,
      reason: 'Protección de racha por descanso médico o vacaciones',
    };
  });

  // Road Stages State
  const [roadStages] = useState<RoadStageNode[]>(INITIAL_ROAD_STAGES);
  const [currentWorld, setCurrentWorld] = useState<1 | 2 | 3 | 4>(1);

  // Achievements (100% real metrics from completedWorkouts)
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [shareModalAchievement, setShareModalAchievement] =
    useState<Achievement | null>(null);

  // Sync achievements automatically whenever completedWorkouts or annualPlan changes
  useEffect(() => {
    const totalCount = completedWorkouts.length;
    const painFreeCount = completedWorkouts.filter(
      (w) =>
        !w.discomforts ||
        w.discomforts.length === 0 ||
        (w.discomforts.length === 1 && w.discomforts[0] === 'ninguna')
    ).length;

    // Calculate sessions completed this week
    const now = new Date();
    const currentDay = now.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const sessionsThisWeek = completedWorkouts.filter((w) => {
      const d = new Date(w.timestamp);
      return d >= monday && d <= sunday;
    }).length;

    const targetWeekDays = annualPlan.daysPerWeek || 3;

    setAchievements([
      {
        id: 'ach-primera-sesion',
        title: 'Primera sesión completada',
        category: 'Constancia',
        timeAgo: totalCount >= 1 ? '¡Conseguido!' : 'Meta de Inicio',
        description:
          'Has dado el paso más importante: completar tu primera sesión de entrenamiento seguro.',
        requirementDescription: 'Completar 1 sesión real de entrenamiento.',
        verifiedByProgress: totalCount >= 1,
        badgeIcon: 'Sparkles',
        unlocked: totalCount >= 1,
        verificationType: 'automatic_data',
        currentMetricValue: Math.min(1, totalCount),
        targetMetricValue: 1,
        metricUnit: 'sesión',
      },
      {
        id: 'ach-semana-perfecta',
        title: 'Semana perfecta (cumplidos todos los días planificados)',
        category: 'Constancia',
        timeAgo: sessionsThisWeek >= targetWeekDays ? '¡Conseguido!' : 'Meta Semanal',
        description:
          'Cumpliste el 100% de los días programados en tu calendario durante la semana.',
        requirementDescription: `Completar todos los días planificados (${targetWeekDays} días) en una misma semana.`,
        verifiedByProgress: sessionsThisWeek >= targetWeekDays,
        badgeIcon: 'Calendar',
        unlocked: sessionsThisWeek >= targetWeekDays,
        verificationType: 'automatic_data',
        currentMetricValue: Math.min(targetWeekDays, sessionsThisWeek),
        targetMetricValue: targetWeekDays,
        metricUnit: 'días',
      },
      {
        id: 'ach-constancia-bronce',
        title: 'Constancia de bronce (10 sesiones reales)',
        category: 'Constancia',
        timeAgo: totalCount >= 10 ? '¡Conseguido!' : 'Hábito Consolidado',
        description:
          'Has acumulado 10 sesiones reales de entrenamiento completadas en la app.',
        requirementDescription: 'Completar 10 sesiones reales de entrenamiento.',
        verifiedByProgress: totalCount >= 10,
        badgeIcon: 'Trophy',
        unlocked: totalCount >= 10,
        verificationType: 'automatic_data',
        currentMetricValue: Math.min(10, totalCount),
        targetMetricValue: 10,
        metricUnit: 'sesiones',
      },
      {
        id: 'ach-proteccion-articular',
        title: 'Protección articular (5 sesiones sin reporte de dolor)',
        category: 'Bienestar',
        timeAgo: painFreeCount >= 5 ? '¡Conseguido!' : 'Salud Articular',
        description:
          '5 sesiones realizadas sin ningún reporte de dolor o molestia articular.',
        requirementDescription:
          'Completar 5 sesiones registrando "Sin molestias articulares".',
        verifiedByProgress: painFreeCount >= 5,
        badgeIcon: 'Smile',
        unlocked: painFreeCount >= 5,
        verificationType: 'automatic_data',
        currentMetricValue: Math.min(5, painFreeCount),
        targetMetricValue: 5,
        metricUnit: 'sesiones',
      },
    ]);
  }, [completedWorkouts, annualPlan.daysPerWeek]);

  // Clinical Metrics (100% real, populated upon submitting real check-ins)
  const [clinicalMetrics, setClinicalMetrics] = useState<ClinicalWeeklyMetric[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_clinical_metrics`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy mock data if present
          const isLegacyMock =
            parsed.length === 4 &&
            parsed[0]?.weekLabel === 'S1' &&
            parsed[0]?.rpeAverage === 4.8;
          if (!isLegacyMock) return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        `${LOCAL_STORAGE_KEY}_clinical_metrics`,
        JSON.stringify(clinicalMetrics)
      );
    } catch {
      // ignore
    }
  }, [clinicalMetrics]);

  // Local Storage Synchronizer
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_plan`, JSON.stringify(annualPlan));
    } catch {
      // ignore
    }
  }, [annualPlan]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_shield`, JSON.stringify(restShield));
    } catch {
      // ignore
    }
  }, [restShield]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_gems`, String(vitalityGems));
    } catch {
      // ignore
    }
  }, [vitalityGems]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_points`, String(consistencyPoints));
    } catch {
      // ignore
    }
  }, [consistencyPoints]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_bonus_count`, String(bonusWorkoutsCompleted));
    } catch {
      // ignore
    }
  }, [bonusWorkoutsCompleted]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_achievements`, JSON.stringify(achievements));
    } catch {
      // ignore
    }
  }, [achievements]);

  useEffect(() => {
    try {
      localStorage.setItem(
        `${LOCAL_STORAGE_KEY}_completed_workouts`,
        JSON.stringify(completedWorkouts)
      );
    } catch {
      // ignore
    }
  }, [completedWorkouts]);

  // Timer Tick Effect (Manejo de fase SET_ACTIVE y cuenta atrás REST con transición automática)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeWorkout.isSessionActive && activeWorkout.isPlaying) {
      interval = setInterval(() => {
        setActiveWorkout((prev) => {
          // Fase 1: En ejecución activa de la serie
          if (prev.executionPhase === 'SET_ACTIVE') {
            if (prev.secondsRemaining <= 1) {
              const exId = prev.currentExercise.id;
              const setNum = (prev.currentSet || 1) as 1 | 2 | 3;
              const reps = prev.currentSetRepsInput || 10;
              const weight =
                prev.currentSetWeightKgInput && prev.currentSetWeightKgInput > 0
                  ? prev.currentSetWeightKgInput
                  : undefined;
              const newRecord: ExerciseSetRecord = {
                setNumber: setNum,
                repsCompleted: reps,
                weightUsedKg: weight,
              };
              const existing = prev.recordedSets?.[exId] || [];
              const updatedList = [
                ...existing.filter((s) => s.setNumber !== setNum),
                newRecord,
              ].sort((a, b) => a.setNumber - b.setNumber);
              const updatedRecordedSets = {
                ...(prev.recordedSets || {}),
                [exId]: updatedList,
              };

              // Fin del tiempo de trabajo de la serie actual
              if (prev.currentSet < prev.totalSets) {
                // Transición automática a descanso interactivo
                return {
                  ...prev,
                  recordedSets: updatedRecordedSets,
                  executionPhase: 'REST',
                  secondsRemaining: 0,
                  restSecondsRemaining: prev.configuredRestDuration || 45,
                  isPlaying: true, // El cronómetro de descanso corre automáticamente
                };
              } else {
                // Fin de la 3ª serie obligatoria: se detiene a la espera de pasar al siguiente ejercicio
                return {
                  ...prev,
                  recordedSets: updatedRecordedSets,
                  secondsRemaining: 0,
                  isPlaying: false,
                };
              }
            }
            return {
              ...prev,
              secondsRemaining: prev.secondsRemaining - 1,
            };
          }

          // Fase 2: En descanso interactivo entre series
          if (prev.executionPhase === 'REST') {
            if (prev.restSecondsRemaining <= 1) {
              // Fin de la cuenta atrás de descanso: arranca automáticamente la siguiente serie
              const nextSet = prev.currentSet + 1;
              return {
                ...prev,
                currentSet: nextSet,
                executionPhase: 'SET_ACTIVE',
                secondsRemaining: prev.currentExercise.durationSeconds || 45,
                isPlaying: true,
              };
            }
            return {
              ...prev,
              restSecondsRemaining: prev.restSecondsRemaining - 1,
            };
          }

          // Fase 0: En PREPARATION el cronómetro permanece detenido en 0
          return prev;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeWorkout.isSessionActive, activeWorkout.isPlaying]);

  // User Profile Handlers
  const saveUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated: UserProfile = {
        ...prev,
        ...profile,
      };

      // Automatic bi-directional synchronization for health conditions & discomfort zones
      if (profile.healthConditions) {
        const mappedZones: JointDiscomfortZone[] = [];
        if (profile.healthConditions.some((c) => c === 'Molestia en rodillas')) mappedZones.push('rodillas');
        if (
          profile.healthConditions.some(
            (c) => c === 'Molestia lumbar (espalda baja)' || c === 'Molestia lumbar'
          )
        )
          mappedZones.push('espalda_lumbar');
        if (
          profile.healthConditions.some(
            (c) =>
              c === 'Molestia en hombros / cuello' ||
              c === 'Molestia en hombros/cuello'
          )
        ) {
          mappedZones.push('hombros');
          mappedZones.push('cuello');
        }
        if (profile.healthConditions.some((c) => c === 'Molestia o limitación en cadera')) {
          mappedZones.push('cadera');
        }
        if (mappedZones.length === 0) mappedZones.push('ninguna');
        updated.discomfortZones = mappedZones;
      }

      // Automatic synchronization for equipment choice & available equipment list
      if (profile.availableEquipment) {
        const equipList = [...profile.availableEquipment];
        if (!equipList.includes('peso_corporal')) {
          equipList.unshift('peso_corporal');
        }
        updated.availableEquipment = equipList;
      } else if (profile.equipmentAvailable) {
        if (profile.equipmentAvailable === 'Solo peso corporal y silla') {
          updated.availableEquipment = ['peso_corporal', 'silla_firme', 'pared_libre'];
        } else if (profile.equipmentAvailable === 'Bandas elásticas') {
          updated.availableEquipment = ['peso_corporal', 'silla_firme', 'pared_libre', 'bandas_elasticas'];
        } else if (profile.equipmentAvailable === 'Mancuernas / Pesos') {
          updated.availableEquipment = ['peso_corporal', 'silla_firme', 'pared_libre', 'bandas_elasticas', 'mancuernas'];
        }
      }

      // Automatic synchronization for fitness level & mobility level
      if (profile.fitnessLevel && !profile.mobilityLevel) {
        if (profile.fitnessLevel === 'Iniciación / Recuperación') {
          updated.mobilityLevel = 'cero_impacto';
        } else if (profile.fitnessLevel === 'Moderado') {
          updated.mobilityLevel = 'funcional_suave';
        } else if (profile.fitnessLevel === 'Activo habitual') {
          updated.mobilityLevel = 'avanzado_fuerza';
        }
      }

      if (profile.heightCm && profile.weightKg) {
        const assessment = calculateBMI(profile.weightKg, profile.heightCm);
        setAnthropometricRecords((prevRecords) => {
          if (prevRecords.length === 0) {
            return [
              {
                id: `anthro-${Date.now()}`,
                date: new Date().toISOString(),
                heightCm: profile.heightCm!,
                weightKg: profile.weightKg!,
                bmi: assessment.bmi,
                bmiCategory: assessment.category,
                notes: 'Registro inicial durante evaluación',
              },
            ];
          }
          return prevRecords;
        });
      }
      return updated;
    });
  }, []);

  const setBiologicalSex = useCallback((sex: BiologicalSex) => {
    setUserProfile((prev) => ({ ...prev, biologicalSex: sex }));
  }, []);

  const setFitnessLevel = useCallback((level: FitnessLevel) => {
    setUserProfile((prev) => {
      let mobility: MobilityLevelId = prev.mobilityLevel;
      if (level === 'Iniciación / Recuperación') mobility = 'cero_impacto';
      else if (level === 'Moderado') mobility = 'funcional_suave';
      else if (level === 'Activo habitual') mobility = 'avanzado_fuerza';
      return { ...prev, fitnessLevel: level, mobilityLevel: mobility };
    });
  }, []);

  const toggleHealthCondition = useCallback((condition: HealthCondition) => {
    setUserProfile((prev) => {
      let updatedConditions: HealthCondition[];
      const current = prev.healthConditions || ['Ninguna molestia'];

      const isNone = condition === 'Ninguna molestia' || condition === 'Ninguna';

      if (isNone) {
        updatedConditions = ['Ninguna molestia'];
      } else {
        const withoutNone = current.filter((c) => c !== 'Ninguna' && c !== 'Ninguna molestia');
        if (withoutNone.includes(condition)) {
          updatedConditions = withoutNone.filter((c) => c !== condition);
          if (updatedConditions.length === 0) updatedConditions = ['Ninguna molestia'];
        } else {
          updatedConditions = [...withoutNone, condition];
        }
      }

      const mappedZones: JointDiscomfortZone[] = [];
      if (updatedConditions.some((c) => c === 'Molestia en rodillas')) mappedZones.push('rodillas');
      if (
        updatedConditions.some(
          (c) => c === 'Molestia lumbar (espalda baja)' || c === 'Molestia lumbar'
        )
      )
        mappedZones.push('espalda_lumbar');
      if (
        updatedConditions.some(
          (c) =>
            c === 'Molestia en hombros / cuello' ||
            c === 'Molestia en hombros/cuello'
        )
      ) {
        mappedZones.push('hombros');
        mappedZones.push('cuello');
      }
      if (updatedConditions.some((c) => c === 'Molestia o limitación en cadera')) {
        mappedZones.push('cadera');
      }
      if (mappedZones.length === 0) mappedZones.push('ninguna');

      return {
        ...prev,
        healthConditions: updatedConditions,
        discomfortZones: mappedZones,
      };
    });
  }, []);

  const setEquipmentAvailable = useCallback((equipment: EquipmentAvailableChoice) => {
    setUserProfile((prev) => {
      let newEquipmentList: AvailableEquipmentId[] = ['peso_corporal', 'silla_firme', 'pared_libre'];
      if (equipment === 'Bandas elásticas') {
        newEquipmentList = ['peso_corporal', 'silla_firme', 'pared_libre', 'bandas_elasticas'];
      } else if (equipment === 'Mancuernas / Pesos') {
        newEquipmentList = ['peso_corporal', 'silla_firme', 'pared_libre', 'bandas_elasticas', 'mancuernas'];
      }
      return {
        ...prev,
        equipmentAvailable: equipment,
        availableEquipment: newEquipmentList,
      };
    });
  }, []);

  const setDumbbellConfig = useCallback((type: DumbbellType, weights: number[]) => {
    setUserProfile((prev) => ({
      ...prev,
      dumbbellType: type,
      availableWeightsKg: [...weights].sort((a, b) => a - b),
    }));
  }, []);

  const addAnthropometricRecord = useCallback(
    (record: {
      weightKg: number;
      heightCm?: number;
      shouldersCm?: number;
      chestCm?: number;
      waistCm?: number;
      hipCm?: number;
      thighCm?: number;
      armCm?: number;
      notes?: string;
      date?: string;
      bmi?: number;
      bmiCategory?: 'bajo_peso' | 'normopeso' | 'sobrepeso' | 'obesidad';
    }) => {
      const height =
        record.heightCm && record.heightCm > 0
          ? record.heightCm
          : userProfile.heightCm || 165;
      const weight = record.weightKg;

      const assessment = calculateBMI(weight, height);

      const newRecord: AnthropometricRecord = {
        id: `anthro-${Date.now()}`,
        date: record.date || new Date().toISOString(),
        heightCm: height,
        weightKg: weight,
        bmi: record.bmi !== undefined ? record.bmi : assessment.bmi,
        bmiCategory: record.bmiCategory || assessment.category,
        shouldersCm: record.shouldersCm,
        chestCm: record.chestCm,
        waistCm: record.waistCm,
        hipCm: record.hipCm,
        thighCm: record.thighCm,
        armCm: record.armCm,
        notes: record.notes,
      };

      setAnthropometricRecords((prev) => [newRecord, ...prev]);
      setUserProfile((prev) => ({
        ...prev,
        heightCm: height,
        weightKg: weight,
      }));

      return newRecord;
    },
    [userProfile.heightCm]
  );

  const deleteAnthropometricRecord = useCallback((id: string) => {
    setAnthropometricRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateAnthropometricRecord = useCallback(
    (id: string, updatedFields: Partial<AnthropometricRecord>) => {
      setAnthropometricRecords((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            const height = updatedFields.heightCm ?? r.heightCm;
            const weight = updatedFields.weightKg ?? r.weightKg;
            const assessment = calculateBMI(weight, height);
            return {
              ...r,
              ...updatedFields,
              heightCm: height,
              weightKg: weight,
              bmi: updatedFields.bmi !== undefined ? updatedFields.bmi : assessment.bmi,
              bmiCategory: updatedFields.bmiCategory || assessment.category,
            };
          }
          return r;
        })
      );
    },
    []
  );

  const updateHeightAndWeight = useCallback((heightCm: number, weightKg: number) => {
    const assessment = calculateBMI(weightKg, heightCm);
    setUserProfile((prev) => ({
      ...prev,
      heightCm,
      weightKg,
    }));
    const newRecord: AnthropometricRecord = {
      id: `anthro-${Date.now()}`,
      date: new Date().toISOString(),
      heightCm,
      weightKg,
      bmi: assessment.bmi,
      bmiCategory: assessment.category,
      notes: 'Actualización rápida de peso y talla',
    };
    setAnthropometricRecords((prev) => [newRecord, ...prev]);
  }, []);

  const updateBodyGoals = useCallback((goals: Partial<BodyGoals>) => {
    setUserProfile((prev) => {
      const currentGoals: BodyGoals = prev.bodyGoals || {
        primaryGoal: 'recomposicion',
        targetWeightKg: undefined,
        targetWaistCm: undefined,
        focusZones: ['cintura', 'hombros', 'gluteos'],
      };
      return {
        ...prev,
        bodyGoals: {
          ...currentGoals,
          ...goals,
        },
      };
    });
  }, []);

  const getBodyRecompositionAnalysis = useCallback((): RecompositionAnalysis => {
    return calculateBodyRecompositionAnalysis({
      records: anthropometricRecords,
      bodyGoals: userProfile.bodyGoals,
      discomfortZones: userProfile.discomfortZones,
    });
  }, [anthropometricRecords, userProfile.bodyGoals, userProfile.discomfortZones]);

  const recompositionAnalysis = useMemo(() => {
    return getBodyRecompositionAnalysis();
  }, [getBodyRecompositionAnalysis]);

  const calculateBodyRecompositionMetricsCallback = useCallback(
    (records?: AnthropometricRecord[]): BodyRecompositionMetrics => {
      const recordsToUse = records || anthropometricRecords;
      return calculateBodyRecompositionMetrics(
        recordsToUse,
        userProfile.bodyGoals,
        userProfile.biologicalSex || 'Mujer'
      );
    },
    [anthropometricRecords, userProfile.bodyGoals, userProfile.biologicalSex]
  );

  const bodyRecompositionMetrics = useMemo(() => {
    return calculateBodyRecompositionMetricsCallback();
  }, [calculateBodyRecompositionMetricsCallback]);

  const getBodyCompositionAdvice = useCallback(
    (
      weightKg?: number,
      heightCm?: number,
      sex?: BiologicalSex,
      discomfortZones?: JointDiscomfortZone[],
      waistCm?: number,
      hipCm?: number
    ): BodyCompositionAdvice => {
      const latest = anthropometricRecords[0];
      const targetWeight = weightKg || latest?.weightKg || userProfile.weightKg || 70;
      const targetHeight = heightCm || latest?.heightCm || userProfile.heightCm || 165;
      const targetSex = sex || userProfile.biologicalSex || 'Mujer';
      const targetDiscomforts = discomfortZones || userProfile.discomfortZones || [];
      const targetWaist = waistCm !== undefined ? waistCm : latest?.waistCm;
      const targetHip = hipCm !== undefined ? hipCm : latest?.hipCm;

      return calculateBodyCompositionAdvice({
        weightKg: targetWeight,
        heightCm: targetHeight,
        sex: targetSex,
        discomfortZones: targetDiscomforts,
        waistCm: targetWaist,
        hipCm: targetHip,
      });
    },
    [anthropometricRecords, userProfile]
  );

  const bodyCompositionAdvice = useMemo(() => {
    return getBodyCompositionAdvice();
  }, [getBodyCompositionAdvice]);

  const toggleDiscomfortZone = useCallback((zone: JointDiscomfortZone) => {
    setUserProfile((prev) => {
      let updated: JointDiscomfortZone[];
      if (zone === 'ninguna') {
        updated = ['ninguna'];
      } else {
        const withoutNone = prev.discomfortZones.filter((z) => z !== 'ninguna');
        if (withoutNone.includes(zone)) {
          updated = withoutNone.filter((z) => z !== zone);
          if (updated.length === 0) updated = ['ninguna'];
        } else {
          updated = [...withoutNone, zone];
        }
      }
      return { ...prev, discomfortZones: updated };
    });
  }, []);

  const setMobilityLevel = useCallback((level: MobilityLevelId) => {
    setUserProfile((prev) => ({ ...prev, mobilityLevel: level }));
  }, []);

  const toggleEquipment = useCallback((eq: AvailableEquipmentId) => {
    setUserProfile((prev) => {
      if (eq === 'peso_corporal') {
        // El peso corporal siempre debe estar activo
        if (!prev.availableEquipment.includes('peso_corporal')) {
          return { ...prev, availableEquipment: ['peso_corporal', ...prev.availableEquipment] };
        }
        return prev;
      }

      const exists = prev.availableEquipment.includes(eq);
      let updated: AvailableEquipmentId[];
      if (exists) {
        updated = prev.availableEquipment.filter((item) => item !== eq);
      } else {
        updated = [...prev.availableEquipment, eq];
      }

      if (!updated.includes('peso_corporal')) {
        updated.unshift('peso_corporal');
      }

      let dumbbellType = prev.dumbbellType;
      let availableWeightsKg = prev.availableWeightsKg;
      if (eq === 'mancuernas' && !exists) {
        if (!dumbbellType || dumbbellType === 'peso_corporal_solamente') {
          dumbbellType = 'fijas';
        }
        if (!availableWeightsKg || availableWeightsKg.length === 0) {
          availableWeightsKg = [1, 2, 3, 5, 8];
        }
      }

      let equipmentAvailable: EquipmentAvailableChoice = 'Solo peso corporal y silla';
      if (updated.includes('mancuernas')) {
        equipmentAvailable = 'Mancuernas / Pesos';
      } else if (updated.includes('bandas_elasticas')) {
        equipmentAvailable = 'Bandas elásticas';
      }

      return {
        ...prev,
        availableEquipment: updated,
        dumbbellType,
        availableWeightsKg,
        equipmentAvailable,
      };
    });
  }, []);

  const advanceOnboardingStep = useCallback(() => {
    setUserProfile((prev) => {
      const nextStep = prev.onboardingStep + 1;
      const completed = nextStep >= 3;
      return {
        ...prev,
        onboardingStep: completed ? 3 : nextStep,
        completedOnboarding: completed || prev.completedOnboarding,
      };
    });
  }, []);

  const resetOnboarding = useCallback(() => {
    setUserProfile({
      name: '',
      avatarType: 'preset',
      avatarValue: 'avatar_sage',
      biologicalSex: 'Mujer',
      fitnessLevel: 'Iniciación / Recuperación',
      healthConditions: ['Ninguna'],
      equipmentAvailable: 'Solo peso corporal y silla',
      discomfortZones: ['ninguna'],
      mobilityLevel: 'cero_impacto',
      availableEquipment: ['peso_corporal', 'silla_firme', 'pared_libre'],
      completedOnboarding: false,
      onboardingStep: 0,
      createdAt: new Date().toISOString(),
    });
    setCompletedWorkouts([]);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setVitalityGems(0);
    setConsistencyPoints(0);
    setBonusWorkoutsCompleted(0);
    setLowEnergySessionsCount(0);
    setPainFreeSessionsCount(0);
    setClinicalMetrics([]);
    setAnthropometricRecords([]);
    setStreakDays(0);
    setStreakWeeks(0);
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_user`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_plan`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_shield`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_gems`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_points`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_bonus_count`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_achievements`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_completed_workouts`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_anthropometry`);
    } catch {
      // ignore
    }
    navigateTo('onboarding_welcome');
  }, [navigateTo]);

  // Annual Plan Handlers
  const setMacroCycleGoal = useCallback((goalId: MacroCycleGoalId) => {
    setAnnualPlan((prev) => ({
      ...prev,
      goalId,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const setSelectedDays = useCallback((days: DayOfWeek[]) => {
    setAnnualPlan((prev) => ({
      ...prev,
      selectedDays: days,
      daysPerWeek:
        days.length >= 2 && days.length <= 6
          ? (days.length as WorkoutFrequencyDays)
          : prev.daysPerWeek,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const toggleSelectedDay = useCallback((day: DayOfWeek) => {
    setAnnualPlan((prev) => {
      const current = prev.selectedDays || ['Lunes', 'Miércoles', 'Viernes'];
      let nextDays: DayOfWeek[];
      if (current.includes(day)) {
        if (current.length <= 1) return prev; // Mantener al menos 1 día
        nextDays = current.filter((d) => d !== day);
      } else {
        nextDays = [...current, day];
      }
      return {
        ...prev,
        selectedDays: nextDays,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const setWorkoutFrequency = useCallback((days: WorkoutFrequencyDays) => {
    const DEFAULT_DAYS_BY_FREQ: Record<WorkoutFrequencyDays, DayOfWeek[]> = {
      2: ['Martes', 'Jueves'],
      3: ['Lunes', 'Miércoles', 'Viernes'],
      4: ['Lunes', 'Martes', 'Jueves', 'Viernes'],
      5: ['Lunes', 'Martes', 'Miércoles', 'Viernes', 'Sábado'],
      6: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    };

    setAnnualPlan((prev) => {
      let newSelectedDays = prev.selectedDays || [];
      if (newSelectedDays.length > days) {
        newSelectedDays = newSelectedDays.slice(0, days);
      } else if (newSelectedDays.length < days) {
        const fallback = DEFAULT_DAYS_BY_FREQ[days] || ['Lunes', 'Miércoles', 'Viernes'];
        const added = fallback.filter((d) => !newSelectedDays.includes(d));
        newSelectedDays = [...newSelectedDays, ...added].slice(0, days);
      }
      return {
        ...prev,
        daysPerWeek: days,
        selectedDays: newSelectedDays,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const setSessionDuration = useCallback((minutes: SessionDurationMinutes) => {
    setAnnualPlan((prev) => ({
      ...prev,
      minutesPerSession: minutes,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const saveAnnualPlan = useCallback(() => {
    setAnnualPlan((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
    }));
    // Also mark step completed
    advanceOnboardingStep();
  }, [advanceOnboardingStep]);

  // Generator of Daily Workout Sessions (15m: 2 ex, 20-30m: 3-4 ex, 45m: 5 ex, rotating daily)
  const generateDailyWorkout = useCallback(
    (isLowEnergy = false) => {
      const duration = annualPlan.minutesPerSession || 20;
      const targetCount =
        duration <= 15 ? 2 : duration <= 20 ? 3 : duration <= 30 ? 4 : 5;

      const date = new Date();
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const dayOfYear = Math.floor(
        (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (isLowEnergy) {
        const calm = EXERCISES_DATABASE.filter(
          (e) =>
            e.block === 'vuelta_a_la_calma' ||
            e.movementPattern === 'estabilidad_escapular'
        );
        const selected = [
          calm[dayOfYear % calm.length] || EXERCISES_DATABASE[48],
          calm[(dayOfYear + 1) % calm.length] || EXERCISES_DATABASE[49],
        ];
        return {
          routineTitle: 'Sesión de Calma y Recuperación Articular (7 min)',
          exercises: selected,
          defaultIntensity: 'adaptada' as WorkoutIntensityMode,
        };
      }

      const hasNoDiscomfort =
        userProfile.discomfortZones.length === 0 ||
        (userProfile.discomfortZones.length === 1 &&
          userProfile.discomfortZones[0] === 'ninguna');

      const isChair = userProfile.mobilityLevel === 'en_silla';
      const isAdvanced =
        userProfile.mobilityLevel === 'avanzado_fuerza' && hasNoDiscomfort;
      const isStandard =
        userProfile.mobilityLevel === 'saludable_estandar' && hasNoDiscomfort;

      const conditions = userProfile.healthConditions || [];
      const zones = userProfile.discomfortZones || [];

      const hasKneeDiscomfort =
        conditions.includes('Molestia en rodillas') ||
        zones.includes('rodillas') ||
        zones.includes('rodillas_piernas');

      const hasLumbarDiscomfort =
        conditions.includes('Molestia lumbar (espalda baja)') ||
        conditions.includes('Molestia lumbar') ||
        zones.includes('espalda_lumbar');

      const hasShoulderDiscomfort =
        conditions.includes('Molestia en hombros / cuello') ||
        conditions.includes('Molestia en hombros/cuello') ||
        zones.includes('hombros') ||
        zones.includes('cuello');

      const hasHipDiscomfort =
        conditions.includes('Molestia o limitación en cadera') ||
        zones.includes('cadera');

      const hasBalanceIssues =
        conditions.includes('Problemas de equilibrio');

      const userEquip =
        userProfile.availableEquipment && userProfile.availableEquipment.length > 0
          ? userProfile.availableEquipment
          : ['peso_corporal', 'silla_firme', 'pared_libre'];

      const fitness = userProfile.fitnessLevel || 'Iniciación / Recuperación';
      const sex = userProfile.biologicalSex || 'Mujer';

      const safePool = EXERCISES_DATABASE.filter((ex) => {
        if (isChair && ex.biomechanicalLevel !== 'terapeutico_silla') return false;

        // Regla 1: Molestia en rodillas -> Excluir sentadillas libres profundas y ejercicios con carga patelofemoral
        if (hasKneeDiscomfort) {
          if (
            ex.id === 'legs_09_bodyweight_air_squats' ||
            ex.id === 'legs_11_reverse_lunges' ||
            ex.id === 'legs_12_bulgarian_split_squat' ||
            ex.isKneeSafe === false ||
            (ex.contraindications && ex.contraindications.includes('rodillas'))
          ) {
            return false;
          }
        }

        // Regla 2: Molestia lumbar -> Neutralizar flexiones de tronco y cargas axiales agresivas
        if (hasLumbarDiscomfort) {
          if (
            ex.id === 'legs_10_dumbbell_romanian_deadlift' ||
            ex.id === 'core_03_seated_russian_twists' ||
            ex.id === 'pull_11_renegade_row' ||
            (ex.contraindications && ex.contraindications.includes('espalda_lumbar'))
          ) {
            return false;
          }
        }

        // Regla 3: Molestia en hombros/cuello -> Mantener movimientos por debajo de la línea horizontal
        if (hasShoulderDiscomfort) {
          if (
            ex.movementPattern === 'empuje_vertical' ||
            ex.movementPattern === 'traccion_vertical' ||
            ex.id === 'pull_05_overhead_band_lat_pulldown' ||
            ex.id === 'pull_07_standing_band_face_pull' ||
            ex.id === 'pull_10_dumbbell_bent_over_reverse_flyes' ||
            (ex.contraindications &&
              (ex.contraindications.includes('hombros') || ex.contraindications.includes('cuello')))
          ) {
            return false;
          }
        }

        // Regla 4: Molestia o limitación en cadera -> Prohibir abducciones forzadas, rotaciones cerradas y flexiones profundas de cadera (>90°)
        if (hasHipDiscomfort) {
          if (
            ex.id === 'legs_09_bodyweight_air_squats' ||
            ex.id === 'legs_10_dumbbell_romanian_deadlift' ||
            ex.id === 'legs_11_reverse_lunges' ||
            ex.id === 'legs_12_bulgarian_split_squat' ||
            ex.id === 'legs_06_lateral_leg_raises' ||
            (ex.contraindications && ex.contraindications.includes('cadera'))
          ) {
            return false;
          }
        }

        // Regla 5: Equipamiento disponible estricto
        // Si el ejercicio requiere un material que el usuario NO tiene marcado, descartarlo.
        const requiresMissingEquipment = ex.requiredEquipment.some(
          (req) => req !== 'peso_corporal' && !userEquip.includes(req)
        );
        if (requiresMissingEquipment) {
          return false;
        }

        // Regla 6: Problemas de equilibrio -> Excluir zancadas libres y exigir apoyos estables en silla o pared
        if (hasBalanceIssues) {
          const isLunge =
            ex.id.includes('lunge') ||
            ex.id.includes('bulgarian') ||
            ex.id === 'legs_11_reverse_lunges' ||
            ex.id === 'legs_12_bulgarian_split_squat';
          if (isLunge) {
            return false;
          }
          // Si el ejercicio es de piernas de pie sin apoyo firme, exigir apoyo en pared o silla
          const isStandingLegWithoutSupport =
            (ex.movementPattern === 'dominante_rodilla' ||
              ex.movementPattern === 'bisagra_cadera' ||
              ex.movementPattern === 'pantorrillas_tobillo') &&
            !ex.requiredEquipment.includes('silla_firme') &&
            !ex.requiredEquipment.includes('pared_libre') &&
            !ex.id.includes('bridge') &&
            !ex.id.includes('floor') &&
            !ex.id.includes('seated') &&
            ex.biomechanicalLevel !== 'terapeutico_silla';
          if (isStandingLegWithoutSupport) {
            return false;
          }
        }

        // Filtro general de contraindicaciones declaradas
        if (!hasNoDiscomfort && ex.contraindications) {
          if (ex.contraindications.some((c) => zones.includes(c))) {
            return false;
          }
        }

        return true;
      });

      // SEGURIDAD CLÍNICA ESTRICTA:
      // Si el grupo seguro es reducido, NUNCA recurrir a la base de datos completa con contraindicaciones;
      // en su lugar, duplicar variantes de bajo impacto ZERO o nivel terapéutico que pasaron el filtro.
      let sourcePool = [...safePool];
      if (sourcePool.length === 0) {
        // Fallback garantizado de máxima seguridad articular sin impacto
        const ultraSafeIds = [
          'legs_05_glute_bridge',
          'pull_01_seated_scapular_squeeze',
          'core_01_seated_stomach_vacuum',
          'legs_01_seated_knee_extensions',
          'push_02_wall_isometric',
        ];
        sourcePool = EXERCISES_DATABASE.filter((e) => ultraSafeIds.includes(e.id));
      }

      // Duplicar variantes de impacto ZERO o terapéuticas para alcanzar targetCount de forma 100% segura
      if (sourcePool.length < targetCount) {
        const therapeuticOrZero = sourcePool.filter(
          (e) => e.impactLevel === 'ZERO' || e.biomechanicalLevel === 'terapeutico_silla'
        );
        const poolToCycle = therapeuticOrZero.length > 0 ? therapeuticOrZero : sourcePool;
        let cycleIdx = 0;
        while (sourcePool.length < targetCount) {
          const baseItem = poolToCycle[cycleIdx % poolToCycle.length];
          sourcePool.push({
            ...baseItem,
            id: `${baseItem.id}_seguridad_dup_${sourcePool.length + 1}`,
            subtitle: `${baseItem.subtitle || ''} (Variante Protegida)`.trim(),
          });
          cycleIdx++;
        }
      }

      const pushExercises = sourcePool.filter(
        (e) =>
          e.movementPattern === 'empuje_horizontal' ||
          e.movementPattern === 'empuje_vertical'
      );
      const pullExercises = sourcePool.filter(
        (e) =>
          e.movementPattern === 'traccion_horizontal' ||
          e.movementPattern === 'traccion_vertical' ||
          e.movementPattern === 'estabilidad_escapular'
      );
      const legExercises = sourcePool.filter(
        (e) =>
          e.movementPattern === 'dominante_rodilla' ||
          e.movementPattern === 'bisagra_cadera' ||
          e.movementPattern === 'pantorrillas_tobillo'
      );
      const coreExercises = sourcePool.filter(
        (e) =>
          e.movementPattern === 'core_anti_extension' ||
          e.movementPattern === 'core_anti_rotacion'
      );
      const calmExercises = sourcePool.filter(
        (e) => e.block === 'vuelta_a_la_calma'
      );

      // INYECCIÓN CLÍNICA PRIORITARIA SEGÚN REGLAS MÉDICAS (sólo variantes seguras presentes en sourcePool):
      if (hasKneeDiscomfort) {
        // Prescribir sentadilla a silla alta y puente glúteo en suelo
        const chairSquat = sourcePool.find((e) => e.id === 'legs_04_chair_squat_stand');
        const gluteBridge = sourcePool.find((e) => e.id === 'legs_05_glute_bridge');
        if (chairSquat && !legExercises.some((e) => e.id === chairSquat.id)) legExercises.unshift(chairSquat);
        if (gluteBridge && !legExercises.some((e) => e.id === gluteBridge.id)) legExercises.unshift(gluteBridge);
      }

      if (hasLumbarDiscomfort) {
        // Priorizar estabilización de core y pared
        const chairPlank = sourcePool.find((e) => e.id === 'core_06_incline_chair_plank');
        const wallPush = sourcePool.find((e) => e.id === 'push_02_wall_isometric');
        const gluteBridge = sourcePool.find((e) => e.id === 'legs_05_glute_bridge');
        if (chairPlank && !coreExercises.some((e) => e.id === chairPlank.id)) coreExercises.unshift(chairPlank);
        if (wallPush && !pushExercises.some((e) => e.id === wallPush.id)) pushExercises.unshift(wallPush);
        if (gluteBridge && !legExercises.some((e) => e.id === gluteBridge.id)) legExercises.unshift(gluteBridge);
      }

      if (hasShoulderDiscomfort) {
        // Prescribir retracción isométrica baja
        const scapularSqueeze = sourcePool.find((e) => e.id === 'pull_01_seated_scapular_squeeze');
        const towelRow = sourcePool.find((e) => e.id === 'pull_02_seated_towel_row');
        if (scapularSqueeze && !pullExercises.some((e) => e.id === scapularSqueeze.id)) pullExercises.unshift(scapularSqueeze);
        if (towelRow && !pullExercises.some((e) => e.id === towelRow.id)) pullExercises.unshift(towelRow);
      }

      if (hasHipDiscomfort) {
        // Favorecer extensiones seguras y puente de glúteos
        const gluteBridge = sourcePool.find((e) => e.id === 'legs_05_glute_bridge');
        const kneeExt = sourcePool.find((e) => e.id === 'legs_01_seated_knee_extensions');
        if (gluteBridge && !legExercises.some((e) => e.id === gluteBridge.id)) legExercises.unshift(gluteBridge);
        if (kneeExt && !legExercises.some((e) => e.id === kneeExt.id)) legExercises.unshift(kneeExt);
      }

      const pickItem = (list: Exercise[], offset: number): Exercise => {
        const listToUse = list.length > 0 ? list : sourcePool;
        return listToUse[(dayOfYear + offset) % listToUse.length];
      };

      const selectedList: Exercise[] = [];
      const selectedIds = new Set<string>();

      const pushUnique = (ex: Exercise) => {
        if (!selectedIds.has(ex.id)) {
          selectedIds.add(ex.id);
          selectedList.push(ex);
        } else {
          const alt = sourcePool.find((item) => !selectedIds.has(item.id));
          if (alt) {
            selectedIds.add(alt.id);
            selectedList.push(alt);
          } else {
            selectedList.push(ex);
          }
        }
      };

      if (targetCount === 2) {
        if (dayOfYear % 2 === 0) {
          pushUnique(pickItem(pushExercises, 0));
          pushUnique(pickItem(legExercises, 0));
        } else {
          pushUnique(pickItem(pullExercises, 1));
          pushUnique(pickItem(coreExercises, 1));
        }
      } else if (targetCount === 3) {
        if (dayOfYear % 3 === 0) {
          pushUnique(pickItem(pushExercises, 0));
          pushUnique(pickItem(legExercises, 0));
          pushUnique(pickItem(coreExercises, 0));
        } else if (dayOfYear % 3 === 1) {
          pushUnique(pickItem(pullExercises, 1));
          pushUnique(pickItem(legExercises, 2));
          pushUnique(pickItem(coreExercises, 1));
        } else {
          pushUnique(pickItem(pushExercises, 2));
          pushUnique(pickItem(pullExercises, 2));
          pushUnique(pickItem(legExercises, 1));
        }
      } else if (targetCount === 4) {
        pushUnique(pickItem(pushExercises, dayOfYear % 4));
        pushUnique(pickItem(pullExercises, (dayOfYear + 1) % 4));
        pushUnique(pickItem(legExercises, (dayOfYear + 2) % 4));
        pushUnique(pickItem(coreExercises, (dayOfYear + 3) % 4));
      } else {
        pushUnique(pickItem(pushExercises, dayOfYear % 5));
        pushUnique(pickItem(pullExercises, (dayOfYear + 1) % 5));
        pushUnique(pickItem(legExercises, (dayOfYear + 2) % 5));
        pushUnique(pickItem(coreExercises, (dayOfYear + 3) % 5));
        pushUnique(pickItem(calmExercises, (dayOfYear + 4) % 5));
      }

      let title = 'Fuerza Biomecánica y Salud Funcional';
      if (hasKneeDiscomfort) {
        title = 'Protección Articular de Rodilla y Cadera';
      } else if (hasLumbarDiscomfort) {
        title = 'Estabilidad Lumbo-Pélvica y Descompresión';
      } else if (hasShoulderDiscomfort) {
        title = 'Control Escapular Seguro y Retracción Baja';
      } else if (isChair) {
        title = 'Movilidad y Fuerza Terapéutica Asistida en Silla';
      } else if (isAdvanced) {
        title = 'Fuerza Progresiva y Tensión Mecánica';
      } else if (isStandard) {
        title = 'Fuerza Funcional y Acondicionamiento Activo';
      } else {
        title = 'Fortalecimiento Progresivo Cero Impacto';
      }

      if (sex === 'Mujer') {
        title += ' (Estabilidad Pélvica)';
      } else {
        title += ' (Cadena Posterior)';
      }

      const defaultIntensity: WorkoutIntensityMode = isAdvanced
        ? 'avanzada'
        : isStandard
        ? 'estandar'
        : 'adaptada';

      return {
        routineTitle: `${title} (${targetCount} ejercicios • 3 series)`,
        exercises: selectedList,
        defaultIntensity,
      };
    },
    [
      annualPlan.minutesPerSession,
      userProfile.discomfortZones,
      userProfile.mobilityLevel,
      userProfile.healthConditions,
      userProfile.fitnessLevel,
      userProfile.equipmentAvailable,
      userProfile.biologicalSex,
    ]
  );

  // Workout Session Handlers
  const startWorkoutSession = useCallback(
    (isLowEnergy = false) => {
      const generated = generateDailyWorkout(isLowEnergy);
      const firstExercise = generated.exercises[0];

      // Adaptación de descansos y cargas según fitnessLevel y equipamiento
      const fitness = userProfile.fitnessLevel || 'Iniciación / Recuperación';
      const equipment = userProfile.equipmentAvailable || 'Solo peso corporal y silla';

      const restTime = fitness === 'Iniciación / Recuperación' ? 60 : fitness === 'Activo habitual' ? 35 : 45;
      const targetReps = fitness === 'Iniciación / Recuperación' ? 8 : fitness === 'Activo habitual' ? 12 : 10;
      const targetWeight =
        fitness === 'Activo habitual' && equipment === 'Mancuernas / Pesos'
          ? 4
          : fitness === 'Moderado' && equipment === 'Mancuernas / Pesos'
          ? 2
          : 0;

      setActiveWorkout({
        isSessionActive: true,
        routineTitle: generated.routineTitle,
        sessionNumber: (completedWorkouts?.length || 0) + 1,
        totalSessionsYear: 52,
        currentBlock: isLowEnergy ? 'calentamiento' : 'principal',
        blockNumber: isLowEnergy ? 1 : 2,
        totalBlocks: isLowEnergy ? 1 : 3,
        exerciseIndex: 0,
        currentExercise: firstExercise,
        workoutList: generated.exercises,
        intensityMode: generated.defaultIntensity,
        // Fase 1: PREPARATION previa con cronómetro detenido en 0
        executionPhase: 'PREPARATION',
        currentSet: 1,
        totalSets: 3,
        secondsRemaining: 0, // Cronómetro DETENIDO en 0
        isPlaying: false,    // DETENIDO
        restSecondsRemaining: restTime,
        configuredRestDuration: restTime,
        currentSetRepsInput: targetReps,
        currentSetWeightKgInput: targetWeight,
        recordedSets: {},
        isAudioGuideActive: true,
        selectedStepIndex: 0,
        isLowEnergySession: isLowEnergy,
        isBonusSession: false,
        isPanicModalOpen: false,
        totalSessionTimeRemaining: isLowEnergy
          ? '07:00 restantes'
          : `${annualPlan.minutesPerSession || 20}:00 restantes`,
      });
      setActiveTab('workout');
      navigateTo('workout_active');
    },
    [
      generateDailyWorkout,
      completedWorkouts,
      annualPlan.minutesPerSession,
      userProfile.fitnessLevel,
      userProfile.equipmentAvailable,
      setActiveTab,
      navigateTo,
    ]
  );

  const startBonusWorkoutSession = useCallback(() => {
    const list = BONUS_WORKOUT_EXERCISES;
    const firstExercise = list[0];
    setActiveWorkout({
      isSessionActive: true,
      routineTitle: 'Sesión Extra de Vitalidad y Movilidad (12 min)',
      sessionNumber: 15,
      totalSessionsYear: 52,
      currentBlock: 'principal',
      blockNumber: 1,
      totalBlocks: 1,
      exerciseIndex: 0,
      currentExercise: firstExercise,
      workoutList: list,
      intensityMode: 'adaptada',
      executionPhase: 'PREPARATION',
      currentSet: 1,
      totalSets: 3,
      secondsRemaining: 0,
      isPlaying: false,
      restSecondsRemaining: 45,
      configuredRestDuration: 45,
      currentSetRepsInput: 10,
      currentSetWeightKgInput: 0,
      recordedSets: {},
      isAudioGuideActive: true,
      selectedStepIndex: 0,
      isLowEnergySession: false,
      isBonusSession: true,
      isPanicModalOpen: false,
      totalSessionTimeRemaining: '11:45 restantes',
    });
    setActiveTab('workout');
    navigateTo('workout_active');
  }, [navigateTo]);

  // Motor de 3 Series: Iniciar la serie activa desde PREPARATION
  const startActiveSet = useCallback(() => {
    setActiveWorkout((prev) => ({
      ...prev,
      executionPhase: 'SET_ACTIVE',
      secondsRemaining: prev.currentExercise.durationSeconds || 45,
      isPlaying: true,
    }));
  }, []);

  // Motor de 3 Series: Completar la serie actual voluntariamente
  const completeCurrentSet = useCallback(() => {
    setActiveWorkout((prev) => {
      const exId = prev.currentExercise.id;
      const setNum = (prev.currentSet || 1) as 1 | 2 | 3;
      const reps = prev.currentSetRepsInput || 10;
      const weight =
        prev.currentSetWeightKgInput && prev.currentSetWeightKgInput > 0
          ? prev.currentSetWeightKgInput
          : undefined;
      const newRecord: ExerciseSetRecord = {
        setNumber: setNum,
        repsCompleted: reps,
        weightUsedKg: weight,
      };
      const existing = prev.recordedSets?.[exId] || [];
      const updatedList = [
        ...existing.filter((s) => s.setNumber !== setNum),
        newRecord,
      ].sort((a, b) => a.setNumber - b.setNumber);
      const updatedRecordedSets = {
        ...(prev.recordedSets || {}),
        [exId]: updatedList,
      };

      if (prev.currentSet < prev.totalSets) {
        return {
          ...prev,
          recordedSets: updatedRecordedSets,
          executionPhase: 'REST',
          secondsRemaining: 0,
          restSecondsRemaining: prev.configuredRestDuration || 45,
          isPlaying: true,
        };
      } else {
        // 3ª serie completada
        return {
          ...prev,
          recordedSets: updatedRecordedSets,
          secondsRemaining: 0,
          isPlaying: false,
        };
      }
    });
  }, []);

  // Registro de cargas y sobrecarga progresiva
  const setCurrentSetReps = useCallback((reps: number) => {
    setActiveWorkout((prev) => ({
      ...prev,
      currentSetRepsInput: Math.max(1, reps),
    }));
  }, []);

  const setCurrentSetWeightKg = useCallback((weightKg: number) => {
    setActiveWorkout((prev) => ({
      ...prev,
      currentSetWeightKgInput: Math.max(0, weightKg),
    }));
  }, []);

  const getPreviousExercisePerformance = useCallback(
    (exerciseId: string) => {
      const dumbbellType = userProfile.dumbbellType || 'fijas';
      const availableWeights =
        userProfile.availableWeightsKg && userProfile.availableWeightsKg.length > 0
          ? [...userProfile.availableWeightsKg].sort((a, b) => a - b)
          : [1, 2, 3, 4, 5];
      const isBodyweightOnly =
        dumbbellType === 'peso_corporal_solamente' ||
        userProfile.equipmentAvailable === 'Solo peso corporal y silla';

      for (const w of completedWorkouts) {
        if (w.exercisesCompleted) {
          const found = w.exercisesCompleted.find((e) => e.id === exerciseId);
          if (found && found.sets && found.sets.length > 0) {
            const sets = found.sets;
            const maxWeight = sets.reduce(
              (max, s) => Math.max(max, s.weightUsedKg || 0),
              0
            );
            const maxReps = sets.reduce((max, s) => Math.max(max, s.repsCompleted), 0);

            let suggestedWeightKg: number | undefined = undefined;
            let suggestedReps: number = 10;
            let progressionMessage = '';

            if (isBodyweightOnly) {
              // Progresión adaptada a peso corporal: repeticiones y tiempo bajo tensión / isometría
              if (maxReps >= 12) {
                suggestedWeightKg = 0;
                suggestedReps = 12;
                progressionMessage = `Última sesión: peso corporal × ${maxReps} reps. Prioridad sin material: mantén 12 reps e introduce una parada isométrica de 2 segundos en contracción máxima.`;
              } else {
                suggestedWeightKg = 0;
                suggestedReps = maxReps + 1;
                progressionMessage = `Última sesión: peso corporal × ${maxReps} reps. Sobrecarga por volumen: busca ${maxReps + 1} reps manteniendo técnica estricta y respiración diafragmática.`;
              }
            } else {
              // Progresión adaptada al inventario real de mancuernas / discos
              if (maxWeight > 0) {
                const nextWeights = availableWeights.filter((weight) => weight > maxWeight);
                if (maxReps >= 10) {
                  if (nextWeights.length > 0) {
                    const nextWeight = nextWeights[0];
                    suggestedWeightKg = nextWeight;
                    suggestedReps = 8;
                    progressionMessage = `Última sesión: ${maxWeight} kg × ${maxReps} reps. ¡Objetivo superado! Salto real adaptado a tu material: ${nextWeight} kg (prueba 8 reps con control).`;
                  } else {
                    suggestedWeightKg = maxWeight;
                    suggestedReps = maxReps + 1;
                    progressionMessage = `Has alcanzado el peso máximo de tu inventario (${maxWeight} kg). Sobrecarga adaptada: busca ${maxReps + 1} reps o introduce una parada isométrica de 2 segundos.`;
                  }
                } else {
                  suggestedWeightKg = maxWeight;
                  suggestedReps = maxReps + 1;
                  progressionMessage = `Última sesión: ${maxWeight} kg × ${maxReps} reps. Consolidación de carga: mantén ${maxWeight} kg y busca ${maxReps + 1} reps antes de subir de peso.`;
                }
              } else {
                // Previo con peso corporal pero tiene pesas en el inventario
                if (maxReps >= 10) {
                  const firstWeight = availableWeights[0] || 1;
                  suggestedWeightKg = firstWeight;
                  suggestedReps = 8;
                  progressionMessage = `Dominio con peso corporal (${maxReps} reps). Sugerencia: introduce tu primera carga disponible (${firstWeight} kg) para 8 reps controladas.`;
                } else {
                  suggestedWeightKg = 0;
                  suggestedReps = maxReps + 1;
                  progressionMessage = `Última sesión: peso corporal × ${maxReps} reps. Sugerencia: busca ${maxReps + 1} reps antes de añadir carga externa.`;
                }
              }
            }

            return {
              lastWeightKg: maxWeight > 0 ? maxWeight : undefined,
              lastReps: maxReps,
              suggestedWeightKg,
              suggestedReps,
              progressionMessage,
            };
          }
        }
      }

      const defaultFirstWeight = isBodyweightOnly ? 0 : availableWeights[0] || 1;
      return {
        lastWeightKg: undefined,
        lastReps: undefined,
        suggestedWeightKg: isBodyweightOnly ? 0 : defaultFirstWeight,
        suggestedReps: 10,
        progressionMessage: isBodyweightOnly
          ? 'Primera sesión con este ejercicio: realiza las repeticiones con peso corporal priorizando la colocación y el ritmo.'
          : `Primera sesión con este ejercicio: calibra sensaciones con peso corporal o tu carga mínima disponible (${defaultFirstWeight} kg).`,
      };
    },
    [completedWorkouts, userProfile.dumbbellType, userProfile.availableWeightsKg, userProfile.equipmentAvailable]
  );

  // Motor de 3 Series: Saltar descanso interactivo e iniciar siguiente serie
  const skipRest = useCallback(() => {
    setActiveWorkout((prev) => {
      const nextSet = prev.currentSet + 1;
      return {
        ...prev,
        currentSet: nextSet,
        executionPhase: 'SET_ACTIVE',
        secondsRemaining: prev.currentExercise.durationSeconds || 45,
        isPlaying: true,
      };
    });
  }, []);

  // Configuración de descanso (45 o 60 segundos)
  const setConfiguredRestDuration = useCallback((seconds: number) => {
    setActiveWorkout((prev) => ({
      ...prev,
      configuredRestDuration: seconds,
      ...(prev.executionPhase === 'REST' ? { restSecondsRemaining: seconds } : {}),
    }));
  }, []);

  const pauseWorkoutSession = useCallback(() => {
    setActiveWorkout((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const resumeWorkoutSession = useCallback(() => {
    setActiveWorkout((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const togglePlayPauseWorkout = useCallback(() => {
    setActiveWorkout((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const resetExerciseTimer = useCallback(() => {
    setActiveWorkout((prev) => {
      if (prev.executionPhase === 'REST') {
        return {
          ...prev,
          restSecondsRemaining: prev.configuredRestDuration || 45,
        };
      }
      return {
        ...prev,
        secondsRemaining: prev.currentExercise.durationSeconds || 45,
        isPlaying: false,
      };
    });
  }, []);

  const setWorkoutIntensityMode = useCallback((mode: WorkoutIntensityMode) => {
    setActiveWorkout((prev) => ({ ...prev, intensityMode: mode }));
  }, []);

  const setActiveExerciseStep = useCallback((stepIndex: number) => {
    setActiveWorkout((prev) => ({ ...prev, selectedStepIndex: stepIndex }));
  }, []);

  const openPanicReplacementModal = useCallback(() => {
    setActiveWorkout((prev) => ({
      ...prev,
      isPanicModalOpen: true,
      isPlaying: false,
    }));
  }, []);

  const closePanicReplacementModal = useCallback(() => {
    setActiveWorkout((prev) => ({ ...prev, isPanicModalOpen: false }));
  }, []);

  // Panic Button: Change exercise immediately with a low-impact alternative
  const replaceCurrentExerciseWithAlternative = useCallback(
    (altExercise: Exercise, reason?: string) => {
      setActiveWorkout((prev) => {
        const prevEx = prev.currentExercise;
        const currentIdx = prev.exerciseIndex;
        const updatedList = [...prev.workoutList];
        updatedList[currentIdx] = altExercise;

        const incident: JointSafetyIncident = {
          id: `incident-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toISOString(),
          exerciseId: prevEx.id,
          exerciseTitle: prevEx.name || prevEx.title || 'Ejercicio en curso',
          action: 'sustituido_por_alternativa',
          replacementExerciseId: altExercise.id,
          replacementExerciseTitle: altExercise.name || altExercise.title,
          movementPattern: prevEx.movementPattern,
          targetMuscleGroup: prevEx.targetMuscleGroup,
          reason:
            reason ||
            'Sustitución inmediata por molestia o pinchazo articular para preservar la seguridad.',
          clinicalNote: `Sustituido por "${altExercise.name || altExercise.title}". Retirado de forma preventiva sin computar como molestia tolerada.`,
        };

        return {
          ...prev,
          currentExercise: altExercise,
          workoutList: updatedList,
          executionPhase: 'PREPARATION',
          currentSet: 1,
          totalSets: 3,
          secondsRemaining: 0,
          isPlaying: false,
          isPanicModalOpen: false,
          isBreathingPauseActive: false,
          selectedStepIndex: 0,
          currentSetRepsInput: 10,
          currentSetWeightKgInput: 0,
          safetyIncidents: [...(prev.safetyIncidents || []), incident],
        };
      });
    },
    []
  );

  const discardCurrentExerciseForSafety = useCallback((reason?: string) => {
    setActiveWorkout((prev) => {
      const prevEx = prev.currentExercise;
      const currentIdx = prev.exerciseIndex;
      const remainingList = prev.workoutList.filter((_, idx) => idx !== currentIdx);

      const incident: JointSafetyIncident = {
        id: `incident-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        exerciseId: prevEx.id,
        exerciseTitle: prevEx.name || prevEx.title || 'Ejercicio en curso',
        action: 'descartado_seguridad',
        movementPattern: prevEx.movementPattern,
        targetMuscleGroup: prevEx.targetMuscleGroup,
        reason:
          reason ||
          'Ejercicio retirado de la rutina de hoy por seguridad articular tras molestia o pinchazo.',
        clinicalNote:
          'Ejercicio retirado por seguridad articular. No se computa como dolor tolerado y se protege la articulación sin penalizar la sesión ni la racha.',
      };

      const updatedIncidents = [...(prev.safetyIncidents || []), incident];

      if (remainingList.length > 0) {
        const nextIdx = Math.min(currentIdx, remainingList.length - 1);
        const nextEx = remainingList[nextIdx];

        return {
          ...prev,
          workoutList: remainingList,
          exerciseIndex: nextIdx,
          currentExercise: nextEx,
          executionPhase: 'PREPARATION',
          currentSet: 1,
          totalSets: 3,
          secondsRemaining: 0,
          isPlaying: false,
          isPanicModalOpen: false,
          isBreathingPauseActive: false,
          selectedStepIndex: 0,
          safetyIncidents: updatedIncidents,
        };
      } else {
        return {
          ...prev,
          workoutList: [],
          isSessionActive: false,
          isPlaying: false,
          isPanicModalOpen: false,
          isBreathingPauseActive: false,
          safetyIncidents: updatedIncidents,
        };
      }
    });
  }, []);

  const startBreathingPause = useCallback(() => {
    setActiveWorkout((prev) => ({
      ...prev,
      isPlaying: false,
      isBreathingPauseActive: true,
    }));
  }, []);

  const stopBreathingPause = useCallback(() => {
    setActiveWorkout((prev) => ({
      ...prev,
      isBreathingPauseActive: false,
    }));
  }, []);

  const replaceCurrentExercise = useCallback(
    (alternativeId: string) => {
      const catalogFound = EXERCISES_DATABASE.find((e) => e.id === alternativeId);
      if (catalogFound) {
        replaceCurrentExerciseWithAlternative(catalogFound);
        return;
      }

      setActiveWorkout((prev) => {
        const alt = prev.currentExercise.alternatives.find(
          (a) => a.id === alternativeId
        );
        if (!alt) return { ...prev, isPanicModalOpen: false };

        const substituteExercise: Exercise = {
          ...prev.currentExercise,
          id: `replaced-${alt.id}`,
          title: alt.title,
          subtitle: `${alt.subtitle} • Reemplazo activo sin dolor`,
          durationSeconds: 45,
          steps: [
            {
              stepIndex: 0,
              stepShortName: 'Postura',
              title: 'Posición de Apoyo Seguro',
              description: `Acomódate en posición estable: ${alt.reason}`,
              visualAlt: 'Alternativa adaptada con cero dolor.',
              previewUrl:
                'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
            },
            {
              stepIndex: 1,
              stepShortName: 'Ejecutar',
              title: 'Movimiento Suave',
              description:
                'Realiza el movimiento con suavidad asegurando cero tensión articular.',
              visualAlt: 'Movimiento suave y fluido.',
              previewUrl:
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
            },
            {
              stepIndex: 2,
              stepShortName: 'Sostener',
              title: 'Control Isométrico',
              description: 'Mantén la activación sin forzar articulaciones.',
              visualAlt: 'Control isométrico relajado.',
              previewUrl:
                'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
            },
            {
              stepIndex: 3,
              stepShortName: 'Respirar',
              title: 'Pausa y Calma',
              description: 'Inhala hondo y exhala despacio.',
              visualAlt: 'Respiración sosegada.',
              previewUrl:
                'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
            },
          ],
        };

        const incident: JointSafetyIncident = {
          id: `incident-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toISOString(),
          exerciseId: prev.currentExercise.id,
          exerciseTitle: prev.currentExercise.name || prev.currentExercise.title,
          action: 'sustituido_por_alternativa',
          replacementExerciseId: substituteExercise.id,
          replacementExerciseTitle: substituteExercise.title,
          movementPattern: prev.currentExercise.movementPattern,
          targetMuscleGroup: prev.currentExercise.targetMuscleGroup,
          reason: 'Sustitución inmediata por molestia articular para preservar la seguridad.',
          clinicalNote: `Sustituido por "${substituteExercise.title}". Retirado de forma preventiva sin computar como molestia tolerada.`,
        };

        const currentIdx = prev.exerciseIndex;
        const updatedList = [...prev.workoutList];
        updatedList[currentIdx] = substituteExercise;

        return {
          ...prev,
          currentExercise: substituteExercise,
          workoutList: updatedList,
          executionPhase: 'PREPARATION',
          currentSet: 1,
          totalSets: 3,
          secondsRemaining: 0,
          isPlaying: false,
          isPanicModalOpen: false,
          isBreathingPauseActive: false,
          selectedStepIndex: 0,
          safetyIncidents: [...(prev.safetyIncidents || []), incident],
        };
      });
    },
    [replaceCurrentExerciseWithAlternative]
  );

  const nextExercise = useCallback(() => {
    setActiveWorkout((prev) => {
      const nextIdx = prev.exerciseIndex + 1;
      if (nextIdx < prev.workoutList.length) {
        const nextEx = prev.workoutList[nextIdx];
        return {
          ...prev,
          exerciseIndex: nextIdx,
          currentExercise: nextEx,
          executionPhase: 'PREPARATION',
          currentSet: 1,
          totalSets: 3,
          secondsRemaining: 0,
          isPlaying: false,
          restSecondsRemaining: prev.configuredRestDuration || 45,
          selectedStepIndex: 0,
        };
      } else {
        // Complete session
        return {
          ...prev,
          isSessionActive: false,
          isPlaying: false,
        };
      }
    });
  }, []);

  const previousExercise = useCallback(() => {
    setActiveWorkout((prev) => {
      const prevIdx = Math.max(0, prev.exerciseIndex - 1);
      const prevEx = prev.workoutList[prevIdx];
      return {
        ...prev,
        exerciseIndex: prevIdx,
        currentExercise: prevEx,
        executionPhase: 'PREPARATION',
        currentSet: 1,
        totalSets: 3,
        secondsRemaining: 0,
        isPlaying: false,
        restSecondsRemaining: prev.configuredRestDuration || 45,
        selectedStepIndex: 0,
      };
    });
  }, []);

  const toggleAudioGuide = useCallback(() => {
    setActiveWorkout((prev) => ({
      ...prev,
      isAudioGuideActive: !prev.isAudioGuideActive,
    }));
  }, []);

  const completeCurrentSession = useCallback(() => {
    if (activeWorkout.isBonusSession) {
      setConsistencyPoints((prev) => prev + 50);
      setVitalityGems((prev) => prev + 1);
      setBonusWorkoutsCompleted((prev) => prev + 1);
      setAchievements((prev) =>
        prev.map((ach) =>
          ach.id === 'ach-plus-energia'
            ? { ...ach, unlocked: true, currentMetricValue: 1, verifiedByProgress: true }
            : ach
        )
      );
    }

    setActiveWorkout((prev) => ({
      ...prev,
      isSessionActive: false,
      isPlaying: false,
    }));
  }, [activeWorkout.isBonusSession]);

  // Low Energy Mode Toggle
  const toggleLowEnergyDayMode = useCallback((forceState?: boolean) => {
    setIsLowEnergyActive((prev) => {
      const next = typeof forceState === 'boolean' ? forceState : !prev;
      return next;
    });
  }, []);

  // Functional Verification Test Handlers
  const openFunctionalTestQuestion = useCallback((q: FunctionalTestQuestion) => {
    setActiveFunctionalTestQuestion(q);
  }, []);

  const closeFunctionalTestQuestion = useCallback(() => {
    setActiveFunctionalTestQuestion(null);
  }, []);

  const clearFunctionalTestNotification = useCallback(() => {
    setFunctionalTestNotification(null);
  }, []);

  const submitFunctionalTestAnswer = useCallback(
    (achievementId: string, passed: boolean) => {
      if (passed) {
        setAchievements((prev) =>
          prev.map((ach) =>
            ach.id === achievementId
              ? { ...ach, unlocked: true, verifiedByProgress: true }
              : ach
          )
        );
        setVitalityGems((prev) => prev + 1);
        setConsistencyPoints((prev) => prev + 50);
        setFunctionalTestNotification(
          '¡Victoria Verificada! Has demostrado una mejora real en tu día a día. Medalla desbloqueada y lista para compartir.'
        );
      } else {
        setFunctionalTestNotification(
          '¡Paso a paso! Cada semana ganas fuerza y movilidad. La constancia sin forzar te llevará a superarlo en tu próximo hito sin ninguna presión.'
        );
      }
      setActiveFunctionalTestQuestion(null);
    },
    []
  );

  // Post-Workout Feedback Handler
  const submitPostWorkoutCheckIn = useCallback(
    (
      rpe: RPEFeeling,
      discomforts: BodyDiscomfortCheck[],
      extra?: {
        repsOrWeightNote?: string;
        unexpectedDiscomfort?: boolean;
        discomfortNotes?: string;
        volumeTotalKg?: number;
      }
    ) => {
      let coachingMsg =
        'Estamos actualizando discretamente tu sesión del jueves para asegurar que tus articulaciones estén apoyadas y tu ritmo se mantenga cómodo.';

      if (discomforts.includes('rodillas_piernas')) {
        coachingMsg =
          'Detectamos molestia en rodillas. El sistema ha cambiado automáticamente las próximas sentadillas a variantes en silla y puentes pélvicos.';
      } else if (discomforts.includes('espalda_baja')) {
        coachingMsg =
          'Priorizando tu espalda lumbar: agregamos 3 minutos extra de báscula pélvica y descompresión con cojín.';
      } else if (rpe === 'challenging') {
        coachingMsg =
          'Agradecemos tu esfuerzo. Ajustamos la intensidad del siguiente día con pausas de recuperación más generosas.';
      }

      const checkInRecord: PostWorkoutCheckIn = {
        rpe,
        discomforts,
        adaptiveCoachingFeedback: coachingMsg,
        timestamp: new Date().toISOString(),
        completedRoutineId: activeWorkout.routineTitle,
        repsOrWeightNote: extra?.repsOrWeightNote,
        unexpectedDiscomfort: extra?.unexpectedDiscomfort,
        discomfortNotes: extra?.discomfortNotes,
      };

      setPostWorkoutCheckIn(checkInRecord);

      // Record completed workout with technical exercises executed and recorded sets
      const recordedSetsMap = activeWorkout.recordedSets || {};
      let calculatedVolume = 0;

      const executedExercises: CompletedWorkoutExerciseRecord[] = (
        activeWorkout.workoutList || []
      ).map((ex) => {
        const sets = recordedSetsMap[ex.id] || [];
        sets.forEach((s) => {
          if (s.weightUsedKg && s.weightUsedKg > 0) {
            calculatedVolume += s.weightUsedKg * s.repsCompleted;
          }
        });

        const setsSummary =
          sets.length > 0
            ? `${sets.length} series: ${sets
                .map(
                  (s) =>
                    `${s.repsCompleted}r${
                      s.weightUsedKg ? ` @ ${s.weightUsedKg}kg` : ''
                    }`
                )
                .join(', ')}`
            : ex.recommendedRepsOrTime || '3 series de 10-12 reps';

        return {
          id: ex.id,
          name: ex.name || ex.title,
          movementPattern: ex.movementPattern || 'dominante_rodilla',
          variantName: ex.subtitle,
          workDurationSeconds: ex.durationSeconds,
          restSeconds: ex.restSeconds || 45,
          repsOrVolume: setsSummary,
          sets: sets.length > 0 ? sets : undefined,
        };
      });

      const newWorkout: CompletedWorkout = {
        id: `w-${Date.now()}`,
        routineTitle: activeWorkout.routineTitle,
        timestamp: new Date().toISOString(),
        durationMinutes: activeWorkout.isLowEnergySession
          ? 7
          : annualPlan.minutesPerSession || 20,
        rpe,
        discomforts,
        isLowEnergy: activeWorkout.isLowEnergySession,
        isBonus:
          activeWorkout.routineTitle.includes('Bonus') ||
          activeWorkout.routineTitle.includes('Movilidad Articular y Respiración'),
        repsOrWeightNote: extra?.repsOrWeightNote,
        unexpectedDiscomfort: extra?.unexpectedDiscomfort,
        discomfortNotes: extra?.discomfortNotes,
        volumeTotalKg: extra?.volumeTotalKg || (calculatedVolume > 0 ? calculatedVolume : undefined),
        exercisesCompleted: executedExercises,
        safetyIncidents: activeWorkout.safetyIncidents || [],
      };

      setCompletedWorkouts((prev) => [newWorkout, ...prev]);

      // Increment streaks
      setStreakDays((prev) => prev + 1);
      setStreakWeeks((prev) => (prev === 0 ? 1 : prev));

      // Append real clinical weekly metric
      setClinicalMetrics((prev) => {
        const rpeNum = rpe === 'light' ? 3.5 : rpe === 'just_right' ? 5.0 : 7.0;
        const painNum = discomforts.includes('ninguna')
          ? 0.5
          : Math.min(6, discomforts.length * 1.5);
        const count = prev.length;
        const newMetric: ClinicalWeeklyMetric = {
          weekLabel: `S${count + 1}`,
          rpeAverage: rpeNum,
          painLevel: painNum,
          sessionsCount: 1,
        };
        return [...prev, newMetric];
      });

      // Mark today's dot completed
      setWeeklyConsistency((prev) =>
        prev.map((item) => (item.isToday ? { ...item, status: 'completed' } : item))
      );

      // Track low energy sessions for "Sin Rendirse"
      if (activeWorkout.isLowEnergySession) {
        setLowEnergySessionsCount((prev) => {
          const next = prev + 1;
          if (next >= 3) {
            setAchievements((achList) =>
              achList.map((a) =>
                a.id === 'ach-sin-rendirse'
                  ? { ...a, unlocked: true, currentMetricValue: next, verifiedByProgress: true }
                  : a
              )
            );
          }
          return next;
        });
      }

      // Track pain-free sessions for "Articulaciones Cuidadas"
      if (discomforts.length === 1 && discomforts.includes('ninguna')) {
        setPainFreeSessionsCount((prev) => {
          const next = prev + 1;
          if (next >= 10) {
            setAchievements((achList) =>
              achList.map((a) =>
                a.id === 'ach-articulaciones-cuidadas'
                  ? { ...a, unlocked: true, currentMetricValue: next, verifiedByProgress: true }
                  : a
              )
            );
          }
          return next;
        });
      }
    },
    [
      activeWorkout.routineTitle,
      activeWorkout.isLowEnergySession,
      annualPlan.minutesPerSession,
    ]
  );

  // Rest Shield Toggle
  const toggleRestShield = useCallback(() => {
    setRestShield((prev) => ({
      ...prev,
      isActive: !prev.isActive,
      activatedAt: !prev.isActive ? new Date().toISOString() : undefined,
    }));
  }, []);

  // Share Achievement Modal
  const openShareModal = useCallback((achievement: Achievement) => {
    setShareModalAchievement(achievement);
  }, []);

  const closeShareModal = useCallback(() => {
    setShareModalAchievement(null);
  }, []);

  // Export Calendar ICS
  const exportCalendarICS = useCallback(() => {
    const DAY_MAP: Record<DayOfWeek, string> = {
      Lunes: 'MO',
      Martes: 'TU',
      Miércoles: 'WE',
      Jueves: 'TH',
      Viernes: 'FR',
      Sábado: 'SA',
      Domingo: 'SU',
    };

    const byDayCodes = (
      annualPlan.selectedDays && annualPlan.selectedDays.length > 0
        ? annualPlan.selectedDays.map((d) => DAY_MAP[d])
        : ['MO', 'WE', 'FR']
    ).join(',');

    const calendarData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AdaptFit//Fitness y Salud Adaptada//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${new Date(Date.now() + annualPlan.minutesPerSession * 60000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `RRULE:FREQ=WEEKLY;BYDAY=${byDayCodes}`,
      'SUMMARY:Sesión AdaptFit: Fortalecimiento y Cero Impacto',
      'DESCRIPTION:Sesión guiada adaptada para articulaciones y bienestar funcional.',
      'LOCATION:En casa',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([calendarData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'adaptfit_entrenamientos.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [annualPlan.selectedDays, annualPlan.minutesPerSession]);

  // Documento de Registro de Actividad y Evolución Física (Seguimiento del usuario para consulta médica/fisioterapia)
  const downloadClinicalReportPDF = useCallback(() => {
    const totalSessions = completedWorkouts.length;
    const allIncidents = completedWorkouts.flatMap((w) => w.safetyIncidents || []);
    const totalMinutes = completedWorkouts.reduce(
      (acc, w) => acc + (w.durationMinutes || 0),
      0
    );

    // RPE numérico mapeado desde completedWorkouts (Escala de Borg)
    const rpeMap: Record<string, number> = {
      muy_suave: 2,
      suave: 4,
      moderado: 6,
      algo_duro: 7,
      duro: 8,
      maximo: 10,
    };
    const rpeScores = completedWorkouts
      .map((w) => (w.rpeScore ? w.rpeScore : rpeMap[w.rpe] || 5))
      .filter((n) => !isNaN(n));
    const meanRPE =
      rpeScores.length > 0
        ? (rpeScores.reduce((acc, curr) => acc + curr, 0) / rpeScores.length).toFixed(1)
        : '0.0';

    // Sesiones sin molestias reportadas
    const painFreeSessions = completedWorkouts.filter(
      (w) => !w.discomforts || w.discomforts.length === 0 || w.discomforts.includes('ninguna')
    ).length;
    const painFreeRate =
      totalSessions > 0 ? Math.round((painFreeSessions / totalSessions) * 100) : 100;

    // Zonas de molestia declaradas por el usuario
    const rawProtectedZones =
      userProfile.discomfortZones &&
      userProfile.discomfortZones.length > 0 &&
      !userProfile.discomfortZones.includes('ninguna')
        ? userProfile.discomfortZones
        : (userProfile.healthConditions || []).filter(
            (c) => c !== 'Ninguna molestia' && c !== 'Problemas de equilibrio'
          );
    const protectedJointZones =
      rawProtectedZones.length > 0
        ? rawProtectedZones.map((z) => z.replace(/_/g, ' ')).join(', ')
        : 'Ninguna zona con molestia previa indicada';

    // Incidencias de sustitución y adaptación por molestia
    const substitutedIncidents = allIncidents.filter(
      (i) => i.action === 'sustituido_por_alternativa'
    );
    const discardedIncidents = allIncidents.filter(
      (i) => i.action === 'descartado_seguridad'
    );

    // Métricas Antropométricas
    const recompMetrics = calculateBodyRecompositionMetrics(
      anthropometricRecords,
      userProfile.bodyGoals,
      userProfile.biologicalSex || 'Mujer'
    );

    const latestRecord = recompMetrics.latestRecord || anthropometricRecords[0];
    const initialRecord = recompMetrics.firstRecord || anthropometricRecords[anthropometricRecords.length - 1];

    const currentDateStr = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const initialDateStr = initialRecord?.date
      ? new Date(initialRecord.date).toLocaleDateString('es-ES')
      : 'Inicial';
    const latestDateStr = latestRecord?.date
      ? new Date(latestRecord.date).toLocaleDateString('es-ES')
      : 'Actual';

    const goalLabelMap: Record<string, string> = {
      recomposicion: 'Recomposición corporal (reducir grasa y mantener tono muscular)',
      ganancia_muscular: 'Ganancia y tonificación muscular',
      perdida_grasa: 'Reducción de porcentaje graso',
      salud_articular: 'Salud y protección articular (impacto cero)',
    };

    const userGoalLabel = userProfile.bodyGoals?.primaryGoal
      ? goalLabelMap[userProfile.bodyGoals.primaryGoal] || userProfile.bodyGoals.primaryGoal
      : 'Salud general y bienestar físico';

    const reportHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>AdaptFit — Registro de Actividad y Evolución Física (Seguimiento del usuario)</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #191c1d;
      line-height: 1.45;
      font-size: 11px;
      background: #ffffff;
      padding: 24px;
      max-width: 860px;
      margin: 0 auto;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
    .header {
      border-bottom: 2px solid #0f5238;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .header-subtag {
      font-size: 9.5px;
      font-weight: 700;
      color: #0f5238;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .title {
      font-size: 18px;
      font-weight: 800;
      color: #0f5238;
      margin: 0;
      letter-spacing: -0.3px;
    }
    .subtitle {
      font-size: 10px;
      color: #4a5568;
      margin-top: 3px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      color: #0f5238;
      border-bottom: 1.5px solid #d9dedb;
      padding-bottom: 4px;
      margin-top: 18px;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .meta-box {
      background: #f8fbf9;
      border: 1px solid #d9dedb;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 14px;
      font-size: 11px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px 12px;
    }
    .kpi-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #f8fbf9;
      border: 1px solid #d9dedb;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 14px;
      text-align: center;
    }
    .kpi-label {
      font-size: 9.5px;
      color: #555e59;
      text-transform: uppercase;
      font-weight: 600;
    }
    .kpi-value {
      font-size: 17px;
      font-weight: 800;
      color: #0f5238;
      margin-top: 2px;
    }
    .kpi-sub {
      font-size: 9px;
      color: #707973;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 10.5px;
    }
    th {
      background: #f0f5f2;
      color: #0f5238;
      text-align: left;
      padding: 6px 10px;
      font-weight: 700;
      font-size: 9.5px;
      text-transform: uppercase;
      border-top: 1px solid #d9dedb;
      border-bottom: 1.5px solid #0f5238;
    }
    td {
      border-bottom: 1px solid #eef1ef;
      padding: 6px 10px;
      vertical-align: middle;
    }
    tr:nth-child(even) td {
      background-color: #fafcfb;
    }
    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 9.5px;
      font-weight: 700;
    }
    .badge-green { background: #e7f3ec; color: #0f5238; }
    .badge-blue { background: #ebf3fa; color: #1d6fa5; }
    .badge-amber { background: #fff6ed; color: #8e4e14; }
    .note-box {
      background: #f8fbf9;
      border-left: 3.5px solid #0f5238;
      border-top: 1px solid #e1e6e3;
      border-right: 1px solid #e1e6e3;
      border-bottom: 1px solid #e1e6e3;
      padding: 10px 14px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 14px;
      font-size: 10.5px;
    }
    .consultation-notes {
      border: 1px dashed #b5c2ba;
      background: #fafcfb;
      border-radius: 8px;
      padding: 12px 14px;
      margin-top: 18px;
      min-height: 85px;
    }
    .disclaimer {
      font-size: 9.5px;
      color: #555e59;
      margin-top: 20px;
      border-top: 1px solid #d9dedb;
      padding-top: 10px;
      line-height: 1.45;
      text-align: justify;
    }
  </style>
</head>
<body>

  <!-- ENCABEZADO -->
  <div class="header">
    <div>
      <div class="header-subtag">Informe Informativo de Actividad y Estado Físico</div>
      <h1 class="title">AdaptFit — Registro de Actividad y Evolución Física (Seguimiento del usuario)</h1>
      <div class="subtitle">Documento de apoyo para consulta con médico, fisioterapeuta o preparador físico</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:10px;color:#555e59;">Fecha de emisión: <strong>${currentDateStr}</strong></div>
      <div style="font-size:9.5px;color:#707973;margin-top:2px;">Aplicación: <strong>AdaptFit v2.0</strong></div>
    </div>
  </div>

  <!-- DATOS GENERALES DEL USUARIO -->
  <div class="meta-box">
    <div class="meta-grid">
      <div><strong>Usuario/a:</strong> ${userProfile.name || 'No especificado'}</div>
      <div><strong>Sexo biológico:</strong> ${userProfile.biologicalSex || 'No especificado'}</div>
      <div><strong>Altura actual:</strong> ${latestRecord?.heightCm || userProfile.heightCm || 165} cm</div>
      <div><strong>Peso más reciente:</strong> ${latestRecord?.weightKg || userProfile.weightKg || 70} kg</div>
      <div><strong>Nivel de partida:</strong> ${userProfile.fitnessLevel || 'Iniciación / Recuperación'}</div>
      <div><strong>Equipamiento habitual:</strong> ${(userProfile.availableEquipment || []).join(', ') || userProfile.equipmentAvailable || 'Peso corporal'}</div>
      <div style="grid-column: span 2;"><strong>Molestias previas declaradas:</strong> ${protectedJointZones}</div>
      <div><strong>Objetivo seleccionado:</strong> ${userGoalLabel}</div>
    </div>
  </div>

  <!-- SECCIÓN 1: RESUMEN DE ADHERENCIA Y TOLERANCIA AL ESFUERZO -->
  <div class="section-title">1. Resumen de Adherencia y Esfuerzo Percibido</div>
  <div class="kpi-container">
    <div>
      <div class="kpi-label">Sesiones Registradas</div>
      <div class="kpi-value">${totalSessions}</div>
      <div class="kpi-sub">entrenamientos completados</div>
    </div>
    <div>
      <div class="kpi-label">Minutos Activos</div>
      <div class="kpi-value">${totalMinutes} min</div>
      <div class="kpi-sub">volumen total acumulado</div>
    </div>
    <div>
      <div class="kpi-label">RPE Medio (Borg)</div>
      <div class="kpi-value">${totalSessions > 0 ? `${meanRPE} / 10` : 'Sin datos'}</div>
      <div class="kpi-sub">esfuerzo percibido medio</div>
    </div>
    <div>
      <div class="kpi-label">Sesiones sin Molestias</div>
      <div class="kpi-value">${painFreeRate}%</div>
      <div class="kpi-sub">${painFreeSessions} de ${totalSessions} sesiones</div>
    </div>
  </div>

  <div class="note-box">
    <strong>Nota sobre el esfuerzo percibido (Escala de Borg 1-10):</strong> ${
      totalSessions > 0
        ? parseFloat(meanRPE) <= 4.0
          ? `El usuario ha registrado un promedio de esfuerzo suave (${meanRPE} / 10), enfocado en control postural y acondicionamiento inicial sin fatiga neuromuscular excesiva.`
          : parseFloat(meanRPE) <= 6.5
          ? `El usuario ha registrado un promedio de esfuerzo moderado (${meanRPE} / 10), correspondiente a estímulos activos de fuerza y movilidad sostenibles sin reporte de sobreesfuerzo agudo.`
          : `El usuario ha registrado un esfuerzo medio exigente (${meanRPE} / 10). Conviene revisar los tiempos de recuperación o el volumen de repeticiones en consulta.`
        : 'No hay sesiones registradas suficientes para determinar la media de esfuerzo.'
    }
  </div>

  <!-- SECCIÓN 2: TABLA COMPARATIVA DE ANTROPOMETRÍA -->
  <div class="section-title">2. Tabla Comparativa de Antropometría y Medidas Corporales</div>
  <p style="font-size:10px;color:#555e59;margin:2px 0 8px 0;">
    Comparativa entre la medición inicial registrada (${initialDateStr}) y la medición más reciente (${latestDateStr}). Datos introducidos directamente por el usuario.
  </p>

  <table>
    <thead>
      <tr>
        <th style="width:28%;">Medida / Parámetro</th>
        <th style="width:16%;">Registro Inicial</th>
        <th style="width:16%;">Registro Actual</th>
        <th style="width:16%;">Variación (Δ)</th>
        <th style="width:24%;">Referencia Informativa</th>
      </tr>
    </thead>
    <tbody>
      ${recompMetrics.comparisonTable
        .map(
          (row) => `<tr>
        <td><strong>${row.parameter}</strong></td>
        <td>${row.initial}</td>
        <td><strong>${row.current}</strong></td>
        <td><span class="badge ${row.isFavorable ? 'badge-green' : 'badge-amber'}">${row.delta}</span></td>
        <td style="font-size:9.5px;color:#4a5568;">${row.clinicalCriterion}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <!-- SECCIÓN 3: INCIDENCIAS ARTICULARES Y ADAPTACIONES REALIZADAS -->
  <div class="section-title">3. Registro de Incidencias Articulares y Adaptaciones de Ejercicio</div>
  <p style="font-size:10px;color:#555e59;margin:2px 0 8px 0;">
    Registro de las ocasiones en las que el usuario utilizó la opción de adaptación durante el entrenamiento ante una molestia articular, sustituyendo o retirando el ejercicio programado.
  </p>

  <table>
    <thead>
      <tr>
        <th style="width:25%;">Resumen de Adaptaciones</th>
        <th style="width:25%;">Sustituciones por Menor Impacto</th>
        <th style="width:25%;">Ejercicios Omitidos por Molestia</th>
        <th style="width:25%;">Continuidad de la Sesión</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${allIncidents.length}</strong> adaptaciones registradas</td>
        <td>${substitutedIncidents.length} variantes suaves utilizadas</td>
        <td>${discardedIncidents.length} ejercicios omitidos</td>
        <td><span class="badge badge-green">Sesiones continuadas con adaptación</span></td>
      </tr>
    </tbody>
  </table>

  ${
    allIncidents.length > 0
      ? `<table>
    <thead>
      <tr>
        <th style="width:14%;">Fecha</th>
        <th style="width:28%;">Ejercicio Programado</th>
        <th style="width:22%;">Acción Realizada</th>
        <th style="width:36%;">Detalle / Alternativa Ejecutada</th>
      </tr>
    </thead>
    <tbody>
      ${allIncidents
        .slice(0, 10)
        .map(
          (inc) => `<tr>
        <td>${new Date(inc.timestamp).toLocaleDateString('es-ES')}</td>
        <td><strong>${inc.exerciseTitle}</strong></td>
        <td><span class="badge ${inc.action === 'sustituido_por_alternativa' ? 'badge-blue' : 'badge-amber'}">${
            inc.action === 'sustituido_por_alternativa' ? 'Sustituido por variante suave' : 'Omitido por precaución'
          }</span></td>
        <td style="font-size:9.5px;color:#4a5568;">${
          inc.replacementExerciseTitle ? `<strong>Alternativa:</strong> ${inc.replacementExerciseTitle}. ` : ''
        }${inc.reason || inc.clinicalNote || 'Adaptación para evitar sobrecarga o molestia focal.'}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>`
      : '<div class="note-box" style="color:#0f5238;"><strong>Sin incidencias registradas:</strong> No se han registrado molestias articulares agudas ni adaptaciones de urgencia durante los entrenamientos completados en la aplicación.</div>'
  }

  <!-- SECCIÓN 4: HISTORIAL RECIENTE DE SESIONES -->
  ${
    totalSessions > 0
      ? `<div class="section-title">4. Historial Reciente de Entrenamientos</div>
  <table>
    <thead>
      <tr>
        <th style="width:16%;">Fecha</th>
        <th style="width:34%;">Rutina Realizada</th>
        <th style="width:16%;">Duración</th>
        <th style="width:16%;">RPE (Esfuerzo 1-10)</th>
        <th style="width:18%;">Molestias Notificadas</th>
      </tr>
    </thead>
    <tbody>
      ${completedWorkouts
        .slice(0, 8)
        .map(
          (w) => `<tr>
        <td>${new Date(w.timestamp).toLocaleDateString('es-ES')}</td>
        <td><strong>${w.routineTitle}</strong></td>
        <td>${w.durationMinutes} min</td>
        <td>${w.rpeScore || rpeMap[w.rpe] || 5} / 10</td>
        <td>${
          (w.discomforts || []).filter((d) => d !== 'ninguna').length === 0
            ? '<span class="badge badge-green">Sin molestias</span>'
            : `<span class="badge badge-amber">${w.discomforts.filter((d) => d !== 'ninguna').join(', ')}</span>`
        }</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>`
      : ''
  }

  <!-- ESPACIO DE CONSULTA PARA EL PROFESIONAL -->
  <div class="consultation-notes">
    <div style="font-size:10px;font-weight:700;color:#0f5238;text-transform:uppercase;margin-bottom:6px;">
      Espacio para observaciones del profesional (Médico / Fisioterapeuta / Entrenador):
    </div>
    <div style="height:55px;"></div>
  </div>

  <!-- AVISO LEGAL Y DESCARGO DE RESPONSABILIDAD -->
  <div class="disclaimer">
    <strong>Aviso legal e informativo:</strong> Este documento es un resumen de autorregistro generado a partir de los datos introducidos voluntariamente por la persona usuaria en la aplicación AdaptFit. Su finalidad es estrictamente informativa para servir de apoyo y contexto durante la consulta con un profesional médico, fisioterapeuta o educador físico. No constituye un diagnóstico médico, prescripción clínica ni sustituye la valoración, supervisión o tratamiento de un profesional de la salud cualificado.
  </div>

</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedName = userProfile.name
      ? userProfile.name.toLowerCase().replace(/\s+/g, '_')
      : 'usuario';
    link.setAttribute(
      'download',
      `registro_actividad_${sanitizedName}_${new Date().toISOString().slice(0, 10)}.html`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [userProfile, completedWorkouts, anthropometricRecords]);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      currentScreen,
      screenHistory,
      navigateTo,
      goBack,
      userProfile,
      saveUserProfile,
      setBiologicalSex,
      setFitnessLevel,
      toggleHealthCondition,
      setEquipmentAvailable,
      setDumbbellConfig,
      toggleDiscomfortZone,
      setMobilityLevel,
      toggleEquipment,
      advanceOnboardingStep,
      resetOnboarding,
      annualPlan,
      setMacroCycleGoal,
      setWorkoutFrequency,
      setSelectedDays,
      toggleSelectedDay,
      setSessionDuration,
      currentViability,
      saveAnnualPlan,
      generateDailyWorkout,
      activeWorkout,
      startWorkoutSession,
      startBonusWorkoutSession,
      pauseWorkoutSession,
      resumeWorkoutSession,
      togglePlayPauseWorkout,
      resetExerciseTimer,
      setWorkoutIntensityMode,
      setActiveExerciseStep,
      openPanicReplacementModal,
      closePanicReplacementModal,
      replaceCurrentExercise,
      replaceCurrentExerciseWithAlternative,
      discardCurrentExerciseForSafety,
      startBreathingPause,
      stopBreathingPause,
      nextExercise,
      previousExercise,
      toggleAudioGuide,
      completeCurrentSession,
      startActiveSet,
      completeCurrentSet,
      skipRest,
      setConfiguredRestDuration,
      setCurrentSetReps,
      setCurrentSetWeightKg,
      getPreviousExercisePerformance,
      vitalityGems,
      consistencyPoints,
      bonusWorkoutsCompleted,
      isLowEnergyActive,
      toggleLowEnergyDayMode,
      lowEnergySessionsCount,
      painFreeSessionsCount,
      postWorkoutCheckIn,
      completedWorkouts,
      submitPostWorkoutCheckIn,
      streakWeeks,
      streakDays,
      weeklyConsistency,
      restShield,
      toggleRestShield,
      roadStages,
      currentWorld,
      setCurrentWorld,
      achievements,
      shareModalAchievement,
      openShareModal,
      closeShareModal,
      activeFunctionalTestQuestion,
      openFunctionalTestQuestion,
      closeFunctionalTestQuestion,
      submitFunctionalTestAnswer,
      functionalTestNotification,
      clearFunctionalTestNotification,
      clinicalMetrics,
      exportCalendarICS,
      downloadClinicalReportPDF,
      anthropometricRecords,
      addAnthropometricRecord,
      deleteAnthropometricRecord,
      updateAnthropometricRecord,
      updateHeightAndWeight,
      updateBodyGoals,
      calculateBodyCompositionAdvice: getBodyCompositionAdvice,
      bodyCompositionAdvice,
      recompositionAnalysis,
      getBodyRecompositionAnalysis,
      calculateBodyRecompositionMetrics: calculateBodyRecompositionMetricsCallback,
      bodyRecompositionMetrics,
    }),
    [
      activeTab,
      setActiveTab,
      currentScreen,
      screenHistory,
      navigateTo,
      goBack,
      userProfile,
      saveUserProfile,
      setBiologicalSex,
      setFitnessLevel,
      toggleHealthCondition,
      setEquipmentAvailable,
      setDumbbellConfig,
      toggleDiscomfortZone,
      setMobilityLevel,
      toggleEquipment,
      advanceOnboardingStep,
      resetOnboarding,
      annualPlan,
      setMacroCycleGoal,
      setWorkoutFrequency,
      setSelectedDays,
      toggleSelectedDay,
      setSessionDuration,
      currentViability,
      saveAnnualPlan,
      generateDailyWorkout,
      activeWorkout,
      startWorkoutSession,
      startBonusWorkoutSession,
      pauseWorkoutSession,
      resumeWorkoutSession,
      togglePlayPauseWorkout,
      resetExerciseTimer,
      setWorkoutIntensityMode,
      setActiveExerciseStep,
      openPanicReplacementModal,
      closePanicReplacementModal,
      replaceCurrentExercise,
      replaceCurrentExerciseWithAlternative,
      discardCurrentExerciseForSafety,
      startBreathingPause,
      stopBreathingPause,
      nextExercise,
      previousExercise,
      toggleAudioGuide,
      completeCurrentSession,
      startActiveSet,
      completeCurrentSet,
      skipRest,
      setConfiguredRestDuration,
      setCurrentSetReps,
      setCurrentSetWeightKg,
      getPreviousExercisePerformance,
      vitalityGems,
      consistencyPoints,
      bonusWorkoutsCompleted,
      isLowEnergyActive,
      toggleLowEnergyDayMode,
      lowEnergySessionsCount,
      painFreeSessionsCount,
      postWorkoutCheckIn,
      completedWorkouts,
      submitPostWorkoutCheckIn,
      streakWeeks,
      streakDays,
      weeklyConsistency,
      restShield,
      toggleRestShield,
      roadStages,
      currentWorld,
      setCurrentWorld,
      achievements,
      shareModalAchievement,
      openShareModal,
      closeShareModal,
      activeFunctionalTestQuestion,
      openFunctionalTestQuestion,
      closeFunctionalTestQuestion,
      submitFunctionalTestAnswer,
      functionalTestNotification,
      clearFunctionalTestNotification,
      clinicalMetrics,
      exportCalendarICS,
      downloadClinicalReportPDF,
      anthropometricRecords,
      addAnthropometricRecord,
      deleteAnthropometricRecord,
      updateAnthropometricRecord,
      updateHeightAndWeight,
      updateBodyGoals,
      getBodyCompositionAdvice,
      bodyCompositionAdvice,
      getBodyRecompositionAnalysis,
      recompositionAnalysis,
      calculateBodyRecompositionMetricsCallback,
      bodyRecompositionMetrics,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
