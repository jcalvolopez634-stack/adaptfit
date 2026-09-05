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
} from '../types';
import { calculateBMI } from '../utils/anthropometry';
import { EXERCISES_DATABASE } from '../data/exercisesData';

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
// HITOS Y LOGROS COMPROBABLES (TIPO A & TIPO B)
// ==========================================

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Tipo A: Verificación por Datos del Sistema
  {
    id: 'ach-consistencia-hierro',
    title: 'Consistencia de Hierro',
    category: 'Constancia',
    timeAgo: 'Meta Mes 1',
    description: '4 semanas consecutivas cumpliendo todos los días programados en tu calendario.',
    requirementDescription: 'Cumplir el 100% de los días programados durante 4 semanas consecutivas.',
    verifiedByProgress: false,
    badgeIcon: 'Calendar',
    unlocked: false,
    verificationType: 'automatic_data',
    currentMetricValue: 0,
    targetMetricValue: 4,
    metricUnit: 'semanas',
  },
  {
    id: 'ach-sin-rendirse',
    title: 'Sin Rendirse',
    category: 'Constancia',
    timeAgo: 'Meta de Constancia',
    description: 'Activaste el modo "Día Bajo de Energía" (7 min) en 3 ocasiones en lugar de faltar.',
    requirementDescription: 'Utilizar el modo "Día Bajo de Energía" 3 veces en lugar de abandonar el entreno.',
    verifiedByProgress: false,
    badgeIcon: 'Shield',
    unlocked: false,
    verificationType: 'automatic_data',
    currentMetricValue: 0,
    targetMetricValue: 3,
    metricUnit: 'veces',
  },
  {
    id: 'ach-articulaciones-cuidadas',
    title: 'Articulaciones Cuidadas',
    category: 'Bienestar',
    timeAgo: 'Meta de Salud',
    description: '10 sesiones consecutivas registrando cero dolor ni sobrecarga articular en el feedback.',
    requirementDescription: 'Registrar 10 sesiones consecutivas marcando "Sin molestias articulares".',
    verifiedByProgress: false,
    badgeIcon: 'Smile',
    unlocked: false,
    verificationType: 'automatic_data',
    currentMetricValue: 0,
    targetMetricValue: 10,
    metricUnit: 'sesiones',
  },
  {
    id: 'ach-plus-energia',
    title: 'Plus de Energía',
    category: 'Constancia',
    timeAgo: 'Meta Voluntaria',
    description: 'Sesión bonus voluntaria completada (+50 pts de vitalidad y movilidad segura).',
    requirementDescription: 'Completar una sesión bonus voluntaria de 10-15 min cuando sientas energía extra.',
    verifiedByProgress: false,
    badgeIcon: 'Zap',
    unlocked: false,
    verificationType: 'automatic_data',
    currentMetricValue: 0,
    targetMetricValue: 1,
    metricUnit: 'sesión',
  },

  // Tipo B: Verificación por Pregunta / Test Funcional
  {
    id: 'ach-escaleras-funcional',
    title: 'Subí 2 pisos sin parar',
    category: 'Hito Destacado',
    timeAgo: 'Hito Mes 1',
    description: 'Superaste 2 pisos de escaleras seguidos con ritmo continuo y respiración controlada.',
    requirementDescription: 'Test de vida real: Subir 2 pisos seguidos sin detenerse a descansar.',
    verifiedByProgress: false,
    badgeIcon: 'Stairs',
    unlocked: false,
    verificationType: 'functional_test',
    functionalQuestion: {
      id: 'q-escaleras',
      achievementId: 'ach-escaleras-funcional',
      milestoneLabel: 'Hito Mes 1 • Potencia y Cardio Suave',
      questionText: '¿Pudiste subir hoy 2 pisos de escaleras seguidos sin pararte a descansar?',
      yesLabel: 'Sí, lo logré sin parar',
      noLabel: 'Aún me cuesta',
      explanation:
        'Evalúa la potencia funcional de tus cuádriceps y la adaptación cardiopulmonar en tu entorno cotidiano.',
    },
  },
  {
    id: 'ach-cordones-funcional',
    title: 'Atarse los cordones sin dolor',
    category: 'Bienestar',
    timeAgo: 'Hito Mes 3',
    description: 'Flexión de cadera y tronco para alcanzar los pies con la espalda lumbar libre de dolor.',
    requirementDescription: 'Test de vida real: Agacharse a atarse los cordones con cero dolor de espalda.',
    verifiedByProgress: false,
    badgeIcon: 'Trophy',
    unlocked: false,
    verificationType: 'functional_test',
    functionalQuestion: {
      id: 'q-cordones',
      achievementId: 'ach-cordones-funcional',
      milestoneLabel: 'Hito Mes 3 • Flexibilidad Lumbar y Autonomía',
      questionText: '¿Puedes agacharte a atarte los cordones sin dolor de espalda?',
      yesLabel: 'Sí, sin dolor',
      noLabel: 'Todavía con molestia',
      explanation:
        'Comprueba la descompresión lumbar y la elasticidad de los isquiotibiales en movimientos cotidianos.',
    },
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

  // Anthropometric & Body Composition
  anthropometricRecords: AnthropometricRecord[];
  addAnthropometricRecord: (record: Omit<AnthropometricRecord, 'id'>) => void;
  deleteAnthropometricRecord: (id: string) => void;
  updateHeightAndWeight: (heightCm: number, weightKg: number) => void;
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
            heightCm: parsed.heightCm,
            weightKg: parsed.weightKg,
            discomfortZones: parsed.discomfortZones || ['ninguna'],
            mobilityLevel: parsed.mobilityLevel || 'cero_impacto',
            availableEquipment: parsed.availableEquipment || ['peso_corporal', 'silla_firme', 'pared_libre'],
            completedOnboarding: Boolean(parsed.completedOnboarding),
            onboardingStep: typeof parsed.onboardingStep === 'number' ? parsed.onboardingStep : 0,
            createdAt: parsed.createdAt || new Date().toISOString(),
            trackingPreferences: parsed.trackingPreferences || DEFAULT_TRACKING_PREFERENCES,
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
      heightCm: undefined,
      weightKg: undefined,
      discomfortZones: ['ninguna'],
      mobilityLevel: 'cero_impacto',
      availableEquipment: ['peso_corporal', 'silla_firme', 'pared_libre'],
      completedOnboarding: false,
      onboardingStep: 0,
      createdAt: new Date().toISOString(),
      trackingPreferences: DEFAULT_TRACKING_PREFERENCES,
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

  // Completed Workouts List (Clean state based 100% on real user sessions)
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_completed_workouts`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((w) => w && w.id !== 'w-seed-01');
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

  // Achievements (Locked in Zero-Data State)
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_achievements`);
      if (saved) {
        const parsed: Achievement[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_ACHIEVEMENTS;
  });
  const [shareModalAchievement, setShareModalAchievement] =
    useState<Achievement | null>(null);

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
      const updated = {
        ...prev,
        ...profile,
      };
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

  const addAnthropometricRecord = useCallback(
    (record: Omit<AnthropometricRecord, 'id'>) => {
      const newRecord: AnthropometricRecord = {
        ...record,
        id: `anthro-${Date.now()}`,
      };
      setAnthropometricRecords((prev) => [newRecord, ...prev]);
      setUserProfile((prev) => ({
        ...prev,
        heightCm: record.heightCm,
        weightKg: record.weightKg,
      }));
    },
    []
  );

  const deleteAnthropometricRecord = useCallback((id: string) => {
    setAnthropometricRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

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
      const exists = prev.availableEquipment.includes(eq);
      const updated = exists
        ? prev.availableEquipment.filter((item) => item !== eq)
        : [...prev.availableEquipment, eq];
      return { ...prev, availableEquipment: updated };
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

      const safePool = EXERCISES_DATABASE.filter((ex) => {
        if (isChair && ex.biomechanicalLevel !== 'terapeutico_silla') return false;
        if (!hasNoDiscomfort) {
          if (
            ex.contraindications &&
            ex.contraindications.some((c) =>
              userProfile.discomfortZones.includes(c)
            )
          ) {
            return false;
          }
          if (
            userProfile.discomfortZones.includes('rodillas_piernas') &&
            ex.isKneeSafe === false
          ) {
            return false;
          }
        }
        return true;
      });

      const sourcePool =
        safePool.length >= targetCount ? safePool : EXERCISES_DATABASE;

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
      if (isChair) {
        title = 'Movilidad y Fuerza Terapéutica Asistida en Silla';
      } else if (isAdvanced) {
        title = 'Fuerza Progresiva y Tensión Mecánica (Avanzado)';
      } else if (isStandard) {
        title = 'Fuerza Funcional y Acondicionamiento Activo';
      } else {
        title = 'Fortalecimiento Progresivo Cero Impacto Articular';
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
    ]
  );

  // Workout Session Handlers
  const startWorkoutSession = useCallback(
    (isLowEnergy = false) => {
      const generated = generateDailyWorkout(isLowEnergy);
      const firstExercise = generated.exercises[0];

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
        restSecondsRemaining: 45,
        configuredRestDuration: 45,
        currentSetRepsInput: 10,
        currentSetWeightKgInput: 0,
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

            if (maxWeight > 0) {
              if (maxReps >= 10) {
                suggestedWeightKg = Number((maxWeight + 0.5).toFixed(1));
                suggestedReps = 8;
                progressionMessage = `Última sesión: ${maxWeight} kg × ${maxReps} reps. Sugerencia de sobrecarga: prueba con +0.5 kg (${suggestedWeightKg} kg) con técnica estricta.`;
              } else {
                suggestedWeightKg = maxWeight;
                suggestedReps = maxReps + 1;
                progressionMessage = `Última sesión: ${maxWeight} kg × ${maxReps} reps. Sugerencia de sobrecarga: mantén ${maxWeight} kg y busca ${maxReps + 1} reps con parada isométrica.`;
              }
            } else {
              suggestedReps = maxReps >= 12 ? 8 : maxReps + 1;
              suggestedWeightKg = maxReps >= 12 ? 1 : 0;
              progressionMessage =
                maxReps >= 12
                  ? `Última sesión: peso corporal × ${maxReps} reps. Sugerencia: introduce una carga suave de 1-2 kg o variante de mayor palanca.`
                  : `Última sesión: peso corporal × ${maxReps} reps. Sugerencia: intenta alcanzar ${maxReps + 1} reps manteniendo respiración controlada.`;
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

      return {
        lastWeightKg: undefined,
        lastReps: undefined,
        suggestedWeightKg: undefined,
        suggestedReps: 10,
        progressionMessage:
          'Primera sesión con este ejercicio: prioriza la colocación y el control antes de añadir carga adicional.',
      };
    },
    [completedWorkouts]
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
  const replaceCurrentExercise = useCallback((alternativeId: string) => {
    setActiveWorkout((prev) => {
      const alt = prev.currentExercise.alternatives.find(
        (a) => a.id === alternativeId
      );
      if (!alt) return { ...prev, isPanicModalOpen: false };

      // Build safe substitute on the fly
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

      return {
        ...prev,
        currentExercise: substituteExercise,
        executionPhase: 'PREPARATION',
        currentSet: 1,
        totalSets: 3,
        secondsRemaining: 0,
        isPlaying: false,
        isPanicModalOpen: false,
        selectedStepIndex: 0,
      };
    });
  }, []);

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

  // Clinical PDF Generator Simulation
  const downloadClinicalReportPDF = useCallback(() => {
    // Generate clean text/json file representing clinical report
    const clinicalSummary = {
      app: 'AdaptFit - Informe Clínico de Movilidad y Adherencia',
      paciente: userProfile.name,
      fechaReporte: new Date().toLocaleDateString('es-ES'),
      perfil: {
        nivelMovilidad: userProfile.mobilityLevel,
        zonasDolorReportadas: userProfile.discomfortZones,
        equipamiento: userProfile.availableEquipment,
      },
      metricasUltimos30Dias: {
        rpePromedio: '4.2/10 (Suave y Seguro)',
        dolorReportado: '0.8/10 (Mínimo)',
        sesionesCompletadas: 12,
        tasaAdherencia: '94%',
        impactoArticular: '100% libre de impacto en rodillas',
      },
      conclusionFisioterapeutica:
        'El paciente muestra excelente adaptación neuromuscular y tolerancia a la carga progresiva en silla y bipedestación asistida sin picos de dolor.',
    };

    const blob = new Blob([JSON.stringify(clinicalSummary, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'informe_clinico_adaptfit.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [userProfile]);

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
      updateHeightAndWeight,
    }),
    [
      activeTab,
      currentScreen,
      screenHistory,
      navigateTo,
      goBack,
      userProfile,
      saveUserProfile,
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
      updateHeightAndWeight,
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
