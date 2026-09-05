import {
  Exercise,
  MovementPattern,
  ImpactLevel,
  BiomechanicalLevel,
  AvailableEquipmentId,
  JointDiscomfortZone,
  ExerciseStepVisual,
} from '../types';

export interface CatalogExercise extends Exercise {
  id: string;
  name: string;
  targetMuscleGroup: string;
  impactLevel: ImpactLevel;
  requiredEquipment: AvailableEquipmentId[];
  contraindications: JointDiscomfortZone[];
  setupStep0: string;
  steps1To3: string[];
  whereToFeel: string;
  commonMistakes: string[];
  singleReferenceImage: string;
  movementPattern: MovementPattern;
  biomechanicalLevel: BiomechanicalLevel;
  adaptedAlternativeId: string;
}

export function generateStepByStepVisuals(exercise: {
  id: string;
  title?: string;
  name?: string;
  movementPattern?: MovementPattern;
  setupStep0?: string;
  steps1To3?: string[];
  steps?: { title?: string; description?: string; stepShortName?: string }[];
  targetMuscles?: string[];
  requiredEquipment?: AvailableEquipmentId[];
}): ExerciseStepVisual[] {
  const pattern = exercise.movementPattern || 'dominante_rodilla';
  const rawSteps = exercise.steps || [];

  return [
    {
      stepNumber: 0,
      title: 'Paso 0: Colocación inicial',
      instructionText: exercise.setupStep0 || rawSteps[0]?.description || 'Colocación y postura inicial.',
      illustrationType: 'svg_diagram',
      visualFocusPoints: ['Espalda neutra', 'Base estable', 'Respiración diafragmática'],
      svgAssetId: `${exercise.id}_step0`,
    },
    {
      stepNumber: 1,
      title: 'Paso 1: Inicio del movimiento',
      instructionText: exercise.steps1To3?.[0] || rawSteps[1]?.description || 'Inicio controlado del movimiento.',
      illustrationType: 'svg_diagram',
      visualFocusPoints: ['Control excéntrico', 'Alineación de articulaciones'],
      vectorArrows: { direction: 'down', label: 'Descenso / Inicio' },
      svgAssetId: `${exercise.id}_step1`,
    },
    {
      stepNumber: 2,
      title: 'Paso 2: Punto de esfuerzo',
      instructionText: exercise.steps1To3?.[1] || rawSteps[2]?.description || 'Punto de máxima contracción muscular.',
      illustrationType: 'svg_diagram',
      visualFocusPoints: ['Máxima tensión útil', 'Cero dolor articular'],
      vectorArrows: { direction: 'up', label: 'Empuje / Tracción' },
      svgAssetId: `${exercise.id}_step2`,
    },
    {
      stepNumber: 3,
      title: 'Paso 3: Recuperación y respiración',
      instructionText: exercise.steps1To3?.[2] || rawSteps[3]?.description || 'Retorno suave a la posición inicial.',
      illustrationType: 'svg_diagram',
      visualFocusPoints: ['Exhalación controlada', 'Freno postural'],
      vectorArrows: { direction: 'forward', label: 'Retorno estable' },
      svgAssetId: `${exercise.id}_step3`,
    },
  ];
}

function buildExercise(params: {
  id: string;
  name: string;
  targetMuscleGroup: string;
  impactLevel: ImpactLevel;
  biomechanicalLevel: BiomechanicalLevel;
  movementPattern: MovementPattern;
  requiredEquipment: AvailableEquipmentId[];
  contraindications: JointDiscomfortZone[];
  setupStep0: string;
  steps1To3: [string, string, string];
  whereToFeel: string;
  commonMistakes: string[];
  singleReferenceImage: string;
  subtitle: string;
  durationSeconds?: number;
  block?: 'calentamiento' | 'principal' | 'vuelta_a_la_calma';
  isKneeSafe?: boolean;
  adaptedAlternativeId?: string;
}): CatalogExercise {
  const steps = [
    {
      stepIndex: 0,
      stepShortName: 'Postura',
      title: 'Paso 0: Colocación inicial',
      description: params.setupStep0,
      previewUrl: params.singleReferenceImage,
      visualAlt: `${params.name} - Colocación inicial`,
    },
    {
      stepIndex: 1,
      stepShortName: 'Inicio',
      title: 'Paso 1: Inicio del movimiento',
      description: params.steps1To3[0],
      previewUrl: params.singleReferenceImage,
      visualAlt: `${params.name} - Fase 1`,
    },
    {
      stepIndex: 2,
      stepShortName: 'Contracción',
      title: 'Paso 2: Punto de esfuerzo',
      description: params.steps1To3[1],
      previewUrl: params.singleReferenceImage,
      visualAlt: `${params.name} - Fase 2`,
    },
    {
      stepIndex: 3,
      stepShortName: 'Retorno',
      title: 'Paso 3: Retorno controlado',
      description: params.steps1To3[2],
      previewUrl: params.singleReferenceImage,
      visualAlt: `${params.name} - Fase 3`,
    },
  ];

  return {
    id: params.id,
    name: params.name,
    title: params.name,
    subtitle: params.subtitle,
    targetMuscleGroup: params.targetMuscleGroup,
    impactLevel: params.impactLevel,
    biomechanicalLevel: params.biomechanicalLevel,
    movementPattern: params.movementPattern,
    requiredEquipment: params.requiredEquipment,
    contraindications: params.contraindications,
    setupStep0: params.setupStep0,
    steps1To3: params.steps1To3,
    whereToFeel: params.whereToFeel,
    commonMistakes: params.commonMistakes,
    singleReferenceImage: params.singleReferenceImage,
    block: params.block || 'principal',
    orderInBlock: 1,
    totalInBlock: 1,
    durationSeconds: params.durationSeconds || 45,
    isKneeSafe: params.isKneeSafe !== undefined ? params.isKneeSafe : true,
    targetMuscles: [params.targetMuscleGroup],
    sensoryMapping: params.whereToFeel,
    avoidError: {
      title: 'Evita esto',
      description: params.commonMistakes[0] || 'Evitar perder la alineación postural.',
    },
    correctAction: {
      title: 'Haz esto',
      description: params.steps1To3[1] || 'Mantén el movimiento fluido y consciente.',
    },
    steps,
    alternatives: [],
    mainCoverIllustration: params.singleReferenceImage,
    adaptedCoverIllustration: params.singleReferenceImage,
    adaptedAlternativeId: params.adaptedAlternativeId || params.id,
    stepByStepVisuals: generateStepByStepVisuals({
      id: params.id,
      title: params.name,
      setupStep0: params.setupStep0,
      steps1To3: params.steps1To3,
      movementPattern: params.movementPattern,
    }),
  };
}

// ============================================================================
// CATÁLOGO COMPLETO DE 50 EJERCICIOS BIOMECÁNICOS ESTRUCTURADOS
// 11 Empuje + 11 Tracción + 12 Tren Inferior + 10 Core + 6 Vuelta a la Calma
// ============================================================================

export const EXERCISES_DATABASE: CatalogExercise[] = [
  // ==========================================================================
  // BLOQUE 1: EMPUJE (11 Ejercicios)
  // ==========================================================================
  buildExercise({
    id: 'push_01_chair_chest_press',
    name: 'Empuje de pecho sentado en silla (Press Isométrico)',
    targetMuscleGroup: 'Pectoral',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'empuje_horizontal',
    requiredEquipment: ['silla_firme'],
    contraindications: ['hombros'],
    setupStep0: 'Siéntate erguido con los pies planos en el suelo, espalda separada del respaldo y manos palma contra palma frente al pecho.',
    steps1To3: [
      'Presiona con firmeza palma contra palma activando el pecho de forma consciente.',
      'Mantén la contracción isométrica durante 3 a 5 segundos con respiración fluida y constante.',
      'Relaja la tensión suavemente sin perder la postura erguida de la columna.',
    ],
    whereToFeel: 'Tensión muscular controlada en el centro del pectoral y tríceps. Cero dolor en hombros.',
    commonMistakes: [
      'Elevar los hombros hacia las orejas',
      'Contener la respiración durante la presión',
      'Hundir el pecho al hacer fuerza',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Activación pectoral sin ningún impacto articular ni sobrecarga espinal.',
  }),

  buildExercise({
    id: 'push_02_wall_isometric',
    name: 'Empuje isométrico contra la pared con apoyo alto',
    targetMuscleGroup: 'Pectoral',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'empuje_horizontal',
    requiredEquipment: ['pared_libre'],
    contraindications: ['munecas'],
    setupStep0: 'Colócate de pie a un paso de la pared con pies al ancho de caderas y palmas apoyadas a la altura de los hombros.',
    steps1To3: [
      'Ejecuta una ligera flexión de codos manteniendo el cuerpo en línea recta sin doblar la cintura.',
      'Sostén la posición de empuje estático 3 a 4 segundos respirando con calma.',
      'Empuja la pared con las palmas para regresar a la vertical con suavidad.',
    ],
    whereToFeel: 'Activación en la cara anterior del pecho y tríceps sin compresión en muñecas ni lumbares.',
    commonMistakes: [
      'Dejar caer la cadera hacia la pared arqueando la espalda',
      'Separar los codos en ángulo de 90 grados respecto al torso',
      'Apoyar solo la punta de los dedos en vez de toda la palma',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Fuerza isométrica para pectoral con descarga articular completa.',
  }),

  buildExercise({
    id: 'push_03_wall_pushups',
    name: 'Flexiones de pie contra la pared (Wall Push-ups)',
    targetMuscleGroup: 'Pectoral',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'cero_impacto_suave',
    movementPattern: 'empuje_horizontal',
    requiredEquipment: ['pared_libre'],
    contraindications: ['munecas', 'hombros'],
    setupStep0: 'Párate a dos pasos de la pared, inclina el cuerpo recto y coloca las manos al ancho de los hombros sobre el muro.',
    steps1To3: [
      'Flexiona los codos a 45 grados acercando el pecho a la pared de manera controlada en 3 segundos.',
      'Pausa 1 segundo a 5 cm de la pared sin arquear la zona lumbar.',
      'Empuja firmemente extendiendo los brazos y exhalando sin bloquear bruscamente los codos.',
    ],
    whereToFeel: 'Pectoral mayor y tríceps. Abdomen firme estabilizando la pelvis.',
    commonMistakes: [
      'Abrir los codos en forma de "T" sobrecargando los hombros',
      'Arquear la espalda lumbar durante el empuje',
      'Despegar los talones bruscamente perdiendo estabilidad',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    subtitle: 'El patrón motor de flexión con el ángulo más seguro para columna y hombros.',
  }),

  buildExercise({
    id: 'push_04_incline_chair_pushups',
    name: 'Flexiones inclinadas con manos en silla firme',
    targetMuscleGroup: 'Pectoral',
    impactLevel: 'LOW',
    biomechanicalLevel: 'medio_perdida_peso',
    movementPattern: 'empuje_horizontal',
    requiredEquipment: ['silla_firme'],
    contraindications: ['munecas', 'hombros', 'espalda_lumbar'],
    setupStep0: 'Apoya la silla contra una pared para que no se deslice. Apoya las manos firmes en los bordes del asiento formando una plancha inclinada.',
    steps1To3: [
      'Baja el pecho hacia el asiento flexionando los codos hacia atrás en diagonal de 45 grados.',
      'Detén el descenso antes de que el pecho toque la silla haciendo una pausa de 1 segundo.',
      'Empuja el asiento con fuerza controlada hasta volver a extender los brazos.',
    ],
    whereToFeel: 'Pectoral inferior y medio, tríceps y contracción abdominal para mantener la plancha.',
    commonMistakes: [
      'Usar una silla con ruedas o que no esté fijada a la pared',
      'Dejar caer el abdomen arqueando la zona lumbar',
      'Meter la cabeza hacia el pecho mirando hacia los pies',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Progresión intermedia de empuje horizontal con sobrecarga moderada.',
  }),

  buildExercise({
    id: 'push_05_seated_band_overhead_press',
    name: 'Press de hombros sentado con banda elástica',
    targetMuscleGroup: 'Hombros',
    impactLevel: 'LOW',
    biomechanicalLevel: 'cero_impacto_suave',
    movementPattern: 'empuje_vertical',
    requiredEquipment: ['silla_firme', 'bandas_elasticas'],
    contraindications: ['hombros', 'cuello'],
    setupStep0: 'Siéntate pisando el centro de la banda elástica con ambos pies, sujetando los extremos con las manos a la altura de las orejas.',
    steps1To3: [
      'Empuja la banda hacia el techo en línea vertical suave exhalando el aire.',
      'Extiende casi por completo los brazos sin encoger los hombros ni arquear la espalda.',
      'Baja controlando la resistencia elástica en 3 segundos hasta volver a la altura de las orejas.',
    ],
    whereToFeel: 'Deltoides (hombros) y tríceps. Cero pinzamiento en el cuello o manguito rotador.',
    commonMistakes: [
      'Arquear la espalda lumbar al empujar hacia el techo',
      'Tirar la cabeza hacia adelante',
      'Bajar los codos de golpe perdiendo la tensión de la banda',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Fuerza vertical de deltoides con tensión elástica adaptativa.',
  }),

  buildExercise({
    id: 'push_06_knee_pushups',
    name: 'Flexiones en suelo sobre rodillas protegidas',
    targetMuscleGroup: 'Pectoral',
    impactLevel: 'LOW',
    biomechanicalLevel: 'medio_perdida_peso',
    movementPattern: 'empuje_horizontal',
    requiredEquipment: ['esterilla'],
    contraindications: ['rodillas', 'munecas', 'hombros'],
    setupStep0: 'Colócate en cuatro apoyos sobre una esterilla acolchada, adelanta las manos al ancho de hombros formando una línea recta rodilla-cadera-hombro.',
    steps1To3: [
      'Desciende el pecho hacia el suelo manteniendo los codos a 45 grados respecto al cuerpo.',
      'Toca suavemente o quédate a 3 cm del suelo sin colapsar las escápulas.',
      'Empuja el suelo con fuerza torácica hasta regresar arriba manteniendo el core activo.',
    ],
    whereToFeel: 'Pectoral mayor, deltoides anterior y tríceps con alivio del 40% del peso corporal.',
    commonMistakes: [
      'Dejar la pelvis arriba en forma de carpa',
      'Apoyar las rodillas sobre suelo duro sin colchoneta',
      'Codos abiertos a 90 grados lesionando el hombro',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Consolidación de la fuerza de empuje horizontal en plano de suelo.',
  }),

  buildExercise({
    id: 'push_07_dumbbell_floor_press',
    name: 'Press de pecho en suelo con mancuernas (Floor Press)',
    targetMuscleGroup: 'Pectoral',
    impactLevel: 'LOW',
    biomechanicalLevel: 'medio_perdida_peso',
    movementPattern: 'empuje_horizontal',
    requiredEquipment: ['esterilla', 'mancuernas'],
    contraindications: ['hombros'],
    setupStep0: 'Túmbate boca arriba en la esterilla con rodillas flexionadas y pies planos. Sujeta las mancuernas con los codos apoyados a 45 grados del torso.',
    steps1To3: [
      'Empuja las mancuernas verticalmente hacia arriba juntándolas suavemente sobre el pecho.',
      'Mantén 1 segundo la contracción superior exhalando el aire.',
      'Desciende despacio hasta que la parte posterior de los brazos roce suavemente el suelo (freno articular natural).',
    ],
    whereToFeel: 'Pectoral medio y tríceps con tope de suelo que protege los hombros de hiperextensión.',
    commonMistakes: [
      'Golpear los codos contra el suelo duro',
      'Despegar la zona lumbar de la colchoneta',
      'Mover las mancuernas sin sincronización bilateral',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    subtitle: 'El press de banca más seguro y efectivo para el manguito rotador.',
  }),

  buildExercise({
    id: 'push_08_chair_tricep_dips',
    name: 'Fondos de tríceps en silla con piernas flexionadas',
    targetMuscleGroup: 'Tríceps',
    impactLevel: 'LOW',
    biomechanicalLevel: 'medio_perdida_peso',
    movementPattern: 'empuje_vertical',
    requiredEquipment: ['silla_firme'],
    contraindications: ['hombros', 'munecas'],
    setupStep0: 'Siéntate en el borde de una silla fija, apoya las manos junto a las caderas con los dedos hacia adelante y adelanta los pies a 90 grados.',
    steps1To3: [
      'Desplaza la pelvis justo fuera del asiento manteniendo la espalda muy pegada a la silla.',
      'Flexiona los codos hacia atrás bajando unos 10-15 cm con control estricto.',
      'Empuja hacia abajo con los talones de las manos para extender los brazos y elevar la pelvis.',
    ],
    whereToFeel: 'Tríceps braquial en la parte posterior de los brazos. Espalda alta activa.',
    commonMistakes: [
      'Alejar la pelvis de la silla (provoca pinzamiento anterior de hombro)',
      'Bajar demasiado profundo sobrepasando los 90 grados de flexión',
      'Encoger los hombros hacia las orejas',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Aislamiento de tríceps con palanca asistida por los talones.',
  }),

  buildExercise({
    id: 'push_09_standard_pushups',
    name: 'Flexiones clásicas en suelo (Standard Push-ups)',
    targetMuscleGroup: 'Pectoral',
    impactLevel: 'HIGH',
    biomechanicalLevel: 'avanzado_fuerza',
    movementPattern: 'empuje_horizontal',
    requiredEquipment: ['esterilla'],
    contraindications: ['munecas', 'hombros', 'espalda_lumbar'],
    setupStep0: 'Colócate en posición de plancha alta con manos ligeramente más anchas que los hombros, pies juntos y glúteos contraídos.',
    steps1To3: [
      'Inhala y flexiona los codos en ángulo de 45 grados descendiendo el cuerpo en un solo bloque rígido.',
      'Detén el descenso cuando el pecho quede a un puño del suelo sin arquear la cintura.',
      'Exhala y empuja el suelo con potencia recuperando la posición inicial.',
    ],
    whereToFeel: 'Pectoral mayor, deltoides anterior, tríceps y pared abdominal completa.',
    commonMistakes: [
      'Dejar caer la cadera o levantar los glúteos en exceso',
      'Abrir codos hacia afuera en ángulo de 90 grados',
      'Hacer repeticiones cortas sin rango útil de movimiento',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Fuerza de empuje completa soportando el 65% del peso corporal.',
  }),

  buildExercise({
    id: 'push_10_dumbbell_overhead_press',
    name: 'Press militar de pie con mancuernas (Overhead Press)',
    targetMuscleGroup: 'Hombros',
    impactLevel: 'HIGH',
    biomechanicalLevel: 'avanzado_fuerza',
    movementPattern: 'empuje_vertical',
    requiredEquipment: ['mancuernas'],
    contraindications: ['hombros', 'espalda_lumbar', 'cuello'],
    setupStep0: 'Ponte de pie con pies al ancho de hombros, abdomen bloqueado y mancuernas a la altura de los hombros con palmas al frente.',
    steps1To3: [
      'Empuja las mancuernas hacia el techo en línea vertical pasando cerca de las orejas.',
      'Bloquea arriba 1 segundo sin arquear la zona lumbar ni empujar la cabeza hacia adelante.',
      'Desciende las mancuernas controlando la bajada en 3 segundos hasta la altura de clavículas.',
    ],
    whereToFeel: 'Deltoides completos, trapecios y tríceps con soporte estabilizador de todo el core.',
    commonMistakes: [
      'Arquear la espalda baja para compensar el peso excesivo',
      'Impulsarse con las rodillas sin control',
      'Mirar al techo en lugar de mantener la vista al frente',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Fuerza vertical estricta de hombros de pie con sobrecarga libre.',
  }),

  buildExercise({
    id: 'push_11_decline_pushups',
    name: 'Flexiones declinadas con pies en silla firme',
    targetMuscleGroup: 'Pectoral',
    impactLevel: 'HIGH',
    biomechanicalLevel: 'avanzado_fuerza',
    movementPattern: 'empuje_horizontal',
    requiredEquipment: ['silla_firme', 'esterilla'],
    contraindications: ['hombros', 'munecas', 'cuello', 'espalda_lumbar'],
    setupStep0: 'Coloca las manos en el suelo sobre la esterilla y sube con precaución los pies sobre el asiento de una silla fija y estable.',
    steps1To3: [
      'Baja la cabeza y el pecho hacia el suelo manteniendo la línea diagonal perfecta de talones a nuca.',
      'Haz una pausa de 1 segundo cerca del suelo con máxima tensión en el pectoral superior.',
      'Empuja el suelo con fuerza hasta extender los brazos y recuperar la estabilidad.',
    ],
    whereToFeel: 'Pectoral clavicular superior, hombros anteriores y core profundo.',
    commonMistakes: [
      'Perder el equilibrio en los pies o usar una superficie deslizante',
      'Dejar caer la cabeza buscando el suelo con la frente',
      'Hiperextender la zona lumbar en la fase de empuje',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Empuje de máxima intensidad con énfasis en haz clavicular.',
  }),

  // ==========================================================================
  // BLOQUE 2: TRACCIÓN (11 Ejercicios)
  // ==========================================================================
  buildExercise({
    id: 'pull_01_seated_scapular_squeeze',
    name: 'Retracción escapular isométrica en silla',
    targetMuscleGroup: 'Espalda',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'estabilidad_escapular',
    requiredEquipment: ['silla_firme'],
    contraindications: ['cuello'],
    setupStep0: 'Siéntate en el tercio delantero de la silla con la espalda erguida, hombros relajados y codos flexionados a 90 grados a los lados.',
    steps1To3: [
      'Lleva los codos hacia atrás mientras intentas pellizcar un lápiz imaginario entre los omóplatos.',
      'Sostén la contracción máxima durante 3 a 5 segundos respirando con calma.',
      'Regresa los codos hacia adelante con suavidad manteniendo el pecho erguido.',
    ],
    whereToFeel: 'Romboides y trapecio medio en la zona media de la espalda. Cero dolor de cuello.',
    commonMistakes: [
      'Elevar los hombros hacia las orejas',
      'Empujar la cabeza hacia adelante',
      'Arquear la zona lumbar para simular mayor rango',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Activación postural suave para corregir hombros adelantados.',
  }),

  buildExercise({
    id: 'pull_02_seated_towel_row',
    name: 'Remo isométrico con toalla sentado en silla',
    targetMuscleGroup: 'Espalda',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'traccion_horizontal',
    requiredEquipment: ['silla_firme'],
    contraindications: ['espalda_lumbar'],
    setupStep0: 'Siéntate en la silla, pasa una toalla resistente por debajo de la planta de un pie y sujeta ambos extremos con las manos.',
    steps1To3: [
      'Tira de la toalla hacia el ombligo con los codos pegados a las costillas mientras empujas con el pie.',
      'Mantén la tensión continua durante 5 segundos sin permitir que la espalda se encorve.',
      'Libera la tensión despacio y cambia de pierna en la siguiente repetición.',
    ],
    whereToFeel: 'Dorsal ancho, bíceps y musculatura postural de la espalda alta.',
    commonMistakes: [
      'Encorvar la espalda como una "C"',
      'Tirar con la fuerza del cuello',
      'Hacer tirones bruscos con la toalla',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Tracción isométrica regulada por el empuje de tu propia pierna.',
  }),

  buildExercise({
    id: 'pull_03_wall_w_slides',
    name: 'Aperturas en "W" contra la pared para romboides',
    targetMuscleGroup: 'Espalda',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'estabilidad_escapular',
    requiredEquipment: ['pared_libre'],
    contraindications: ['hombros'],
    setupStep0: 'Apoya la espalda, cabeza y sacro contra la pared. Coloca los brazos formando una letra "W" con codos pegados al muro.',
    steps1To3: [
      'Desliza los antebrazos hacia arriba por la pared sin despegar los codos ni la zona lumbar.',
      'Llega hasta donde tus hombros no sientan molestia y aprieta los omóplatos 2 segundos.',
      'Baja los codos de nuevo hacia las costillas apretando la espalda media.',
    ],
    whereToFeel: 'Espalda alta, deltoides posterior y apertura torácica anterior.',
    commonMistakes: [
      'Despegar la espalda baja de la pared',
      'Forzar el rango si hay pinzamiento',
      'Tensionar la mandíbula o cuello',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Reeducación escapular y apertura torácica anti-sedentarismo.',
  }),

  buildExercise({
    id: 'pull_04_seated_band_row',
    name: 'Remo sentado con banda elástica anclada en pies',
    targetMuscleGroup: 'Espalda',
    impactLevel: 'LOW',
    biomechanicalLevel: 'cero_impacto_suave',
    movementPattern: 'traccion_horizontal',
    requiredEquipment: ['silla_firme', 'bandas_elasticas'],
    contraindications: ['espalda_lumbar'],
    setupStep0: 'Siéntate en la silla con piernas semi-extendidas, engancha la banda en la suela de los pies y agarra los extremos con brazos estirados.',
    steps1To3: [
      'Inicia el movimiento juntando las escápulas y lleva los codos pegados hacia atrás.',
      'Detén los codos a la altura del torso contrayendo la espalda media durante 2 segundos.',
      'Extiende los brazos lentamente en 3 segundos resistiendo el tirón de la goma.',
    ],
    whereToFeel: 'Dorsal ancho, bíceps y romboides. Gran protección para la zona lumbar.',
    commonMistakes: [
      'Balancear el tronco hacia atrás para ganar inercia',
      'Separar los codos de los costados',
      'Soltar la banda bruscamente',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Remo horizontal seguro con resistencia progresiva elástica.',
  }),

  buildExercise({
    id: 'pull_05_overhead_band_lat_pulldown',
    name: 'Jalón al pecho con banda elástica sobre la cabeza',
    targetMuscleGroup: 'Espalda',
    impactLevel: 'LOW',
    biomechanicalLevel: 'cero_impacto_suave',
    movementPattern: 'traccion_vertical',
    requiredEquipment: ['bandas_elasticas'],
    contraindications: ['hombros', 'cuello'],
    setupStep0: 'De pie o sentado erguido, sujeta la banda con ambas manos sobre la cabeza al ancho de los hombros.',
    steps1To3: [
      'Tira de los extremos hacia afuera y hacia abajo llevando la banda hacia la parte alta del pecho.',
      'Junta con fuerza las escápulas y mantén los codos apuntando hacia el suelo 2 segundos.',
      'Vuelve a subir las manos despacio hasta la posición inicial sobre la cabeza.',
    ],
    whereToFeel: 'Dorsal ancho (laterales de la espalda) y musculatura escapular.',
    commonMistakes: [
      'Bajar la banda por detrás del cuello (peligro para vértebras cervicales)',
      'Encoger los hombros hacia arriba',
      'Perder la tensión en la banda elástica',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Patrón de tracción vertical sin necesidad de máquinas de gimnasio.',
  }),

  buildExercise({
    id: 'pull_06_single_arm_chair_row',
    name: 'Remo a una mano con mancuerna apoyado en silla',
    targetMuscleGroup: 'Espalda',
    impactLevel: 'LOW',
    biomechanicalLevel: 'medio_perdida_peso',
    movementPattern: 'traccion_horizontal',
    requiredEquipment: ['silla_firme', 'mancuernas'],
    contraindications: ['espalda_lumbar', 'hombros'],
    setupStep0: 'Apoya la mano izquierda firme en el respaldo de la silla, torso inclinado con columna recta y mancuerna en mano derecha.',
    steps1To3: [
      'Tracciona la mancuerna hacia la cadera derecha llevando el codo hacia el techo.',
      'Siente la contracción pura en la espalda dorsal sin girar el tronco.',
      'Desciende la mancuerna de forma controlada hasta la extensión completa del brazo.',
    ],
    whereToFeel: 'Dorsal y deltoides posterior sin sobrecarga en la columna gracias al apoyo firme.',
    commonMistakes: [
      'Rotar el pecho y cuello al subir la mancuerna',
      'Curvar la columna lumbar por falta de flexión de cadera',
      'Usar impulso de piernas en vez de fuerza dorsal',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Trabajo unilateral de dorsal con estabilización lumbar asistida.',
  }),

  buildExercise({
    id: 'pull_07_standing_band_face_pull',
    name: 'Face Pull de pie con banda elástica a la altura de los ojos',
    targetMuscleGroup: 'Espalda',
    impactLevel: 'LOW',
    biomechanicalLevel: 'medio_perdida_peso',
    movementPattern: 'estabilidad_escapular',
    requiredEquipment: ['bandas_elasticas', 'pared_libre'],
    contraindications: ['cuello', 'hombros'],
    setupStep0: 'Ancla la banda elástica a la altura de la cabeza o sostenla al frente, pies estables y rodillas ligeramente flexionadas.',
    steps1To3: [
      'Tira de la banda hacia tu frente y orejas abriendo las manos y rotando los hombros externamente.',
      'Mantén los codos altos alineados con las orejas y aprieta la parte posterior de los hombros 2 segundos.',
      'Regresa extendiendo los brazos con suavidad sin adelantar la cabeza.',
    ],
    whereToFeel: 'Manguito rotador, deltoides posterior y romboides. Excelente correctivo postural.',
    commonMistakes: [
      'Dejar caer los codos por debajo de las manos',
      'Adelantar la barbilla hacia la banda',
      'Tirar con la zona lumbar inclinando el torso hacia atrás',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=80',
    subtitle: 'El mejor ejercicio correctivo para salud del manguito rotador.',
  }),

  buildExercise({
    id: 'pull_08_inverted_table_row',
    name: 'Remo horizontal invertido bajo mesa firme',
    targetMuscleGroup: 'Espalda',
    impactLevel: 'LOW',
    biomechanicalLevel: 'medio_perdida_peso',
    movementPattern: 'traccion_horizontal',
    requiredEquipment: ['peso_corporal'],
    contraindications: ['hombros', 'munecas', 'espalda_lumbar'],
    setupStep0: 'Acuéstate boca arriba debajo de una mesa pesada y firme, agarra el borde con ambas manos al ancho de hombros y talones en el suelo.',
    steps1To3: [
      'Tira del cuerpo hacia arriba manteniendo el torso recto como una tabla hasta acercar el pecho a la mesa.',
      'Aprieta las escápulas arriba durante 1 segundo con respiración controlada.',
      'Baja despacio hasta casi tocar el suelo con la espalda sin descolgar los hombros.',
    ],
    whereToFeel: 'Espalda completa, bíceps y musculatura posterior del cuerpo.',
    commonMistakes: [
      'Usar una mesa inestable o liviana',
      'Dejar caer la cadera hacia el suelo',
      'Tirar de cuello en lugar de traccionar con la espalda',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Tracción horizontal pura con autocarga corporal casera.',
  }),

  buildExercise({
    id: 'pull_09_dumbbell_bent_over_row',
    name: 'Remo inclinado bilateral con mancuernas',
    targetMuscleGroup: 'Espalda',
    impactLevel: 'HIGH',
    biomechanicalLevel: 'avanzado_fuerza',
    movementPattern: 'traccion_horizontal',
    requiredEquipment: ['mancuernas'],
    contraindications: ['espalda_lumbar', 'cadera'],
    setupStep0: 'De pie con pies al ancho de caderas, inclina el torso a 45 grados flexionando las caderas con columna neutra y mancuernas colgando.',
    steps1To3: [
      'Tracciona ambas mancuernas hacia los costados de la cintura guiando el movimiento con los codos.',
      'Junta los omóplatos firmemente arriba y sostén 1 a 2 segundos.',
      'Desciende las mancuernas con control sin redondear en ningún momento la zona lumbar.',
    ],
    whereToFeel: 'Dorsal ancho, romboides, bíceps y estabilización isométrica de glúteos y lumbares.',
    commonMistakes: [
      'Encorvar la espalda lumbar al fatigarse',
      'Levantar el torso hacia la vertical con cada tirón',
      'Mirar hacia arriba tensionando el cuello',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Constructor de masa muscular y densidad en la espalda completa.',
  }),

  buildExercise({
    id: 'pull_10_rear_delt_flyes',
    name: 'Pájaros posteriores de pie con mancuernas',
    targetMuscleGroup: 'Hombros',
    impactLevel: 'HIGH',
    biomechanicalLevel: 'avanzado_fuerza',
    movementPattern: 'estabilidad_escapular',
    requiredEquipment: ['mancuernas'],
    contraindications: ['espalda_lumbar', 'hombros', 'cuello'],
    setupStep0: 'Inclina el torso a 45 grados con espalda plana, rodillas semiflexionadas y mancuernas ligeras bajo el pecho.',
    steps1To3: [
      'Eleva los brazos hacia los lados como si abrieras alas, dirigiendo el movimiento desde los codos.',
      'Alcanza la línea paralela al suelo y aprieta la parte posterior de los hombros 1 segundo.',
      'Baja con control frenando la gravedad sin juntar de golpe las pesas.',
    ],
    whereToFeel: 'Deltoides posterior y romboides en la espalda superior.',
    commonMistakes: [
      'Cargar demasiado peso y balancear el cuerpo',
      'Estirar los codos por completo en bloqueo rígido',
      'Subir los hombros a las orejas',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Aislamiento de la cara posterior del hombro y romboides.',
  }),

  buildExercise({
    id: 'pull_11_renegade_row',
    name: 'Remo renegado con mancuernas en plancha',
    targetMuscleGroup: 'Espalda',
    impactLevel: 'HIGH',
    biomechanicalLevel: 'avanzado_fuerza',
    movementPattern: 'traccion_horizontal',
    requiredEquipment: ['esterilla', 'mancuernas'],
    contraindications: ['munecas', 'hombros', 'espalda_lumbar'],
    setupStep0: 'Adopta posición de plancha con las manos apoyadas en mancuernas, pies abiertos al ancho de hombros para mayor base de apoyo.',
    steps1To3: [
      'Fija las caderas para evitar rotaciones y rema una mancuerna hacia tu cadera con codo alto.',
      'Baja la mancuerna suavemente al suelo sin alterar la horizontalidad del cuerpo.',
      'Cambia de brazo manteniendo el abdomen en máxima tensión anti-rotación.',
    ],
    whereToFeel: 'Dorsal, core anti-rotación oblicuo, tríceps y deltoides estabilizador.',
    commonMistakes: [
      'Girar las caderas hacia un lado al remar',
      'Dejar caer la pelvis hacia el suelo',
      'Mover las piernas en lugar de fijar la postura',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Híbrido de fuerza de tracción dorsal y estabilidad central avanzada.',
  }),

  // ==========================================================================
  // BLOQUE 3: TREN INFERIOR (12 Ejercicios)
  // ==========================================================================
  buildExercise({
    id: 'legs_01_seated_knee_extensions',
    name: 'Extensión de rodilla sentado en silla sin impacto',
    targetMuscleGroup: 'Cuádriceps',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'dominante_rodilla',
    requiredEquipment: ['silla_firme'],
    contraindications: ['rodillas'],
    setupStep0: 'Siéntate bien apoyado en la silla con la espalda recta y las manos sujetando los laterales del asiento.',
    steps1To3: [
      'Extiende una pierna hacia el frente hasta que quede paralela al suelo sin bloquear bruscamente.',
      'Contrae el cuádriceps con fuerza durante 2 segundos manteniendo la punta del pie hacia arriba.',
      'Baja el talón suavemente al suelo en 3 segundos y alterna de pierna.',
    ],
    whereToFeel: 'Cara anterior del muslo (cuádriceps) sin impacto ni compresión articular rotuliana.',
    commonMistakes: [
      'Dar una patada rápida o brusca',
      'Inclinarse hacia atrás al estirar la pierna',
      'Contener la respiración durante la contracción',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Fortalecimiento de cuádriceps seguro para artrosis o molestias de rodilla.',
  }),

  buildExercise({
    id: 'legs_02_seated_calf_raises',
    name: 'Elevación de talones sentado en silla (Sóleo / Tobillo)',
    targetMuscleGroup: 'Gemelos',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'pantorrillas_tobillo',
    requiredEquipment: ['silla_firme'],
    contraindications: ['ninguna'],
    setupStep0: 'Siéntate con los pies apoyados planos a 90 grados, espalda erguida y manos descansando sobre los muslos para añadir resistencia leve.',
    steps1To3: [
      'Eleva los talones todo lo posible apoyándote con fuerza sobre el metatarso.',
      'Sostén la contracción máxima del sóleo y gemelos durante 2 segundos arriba.',
      'Desciende despacio hasta apoyar toda la planta del pie en el suelo.',
    ],
    whereToFeel: 'Pantorrillas y tendón de Aquiles, mejorando el retorno venoso y la movilidad del tobillo.',
    commonMistakes: [
      'Desviar los tobillos hacia afuera al subir',
      'Rebotar rápido sin pausa arriba',
      'Perder la postura erguida',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Activación de la bomba muscular de la pantorrilla y salud del tobillo.',
  }),

  buildExercise({
    id: 'legs_03_seated_band_abduction',
    name: 'Abducción de cadera sentado en silla con banda',
    targetMuscleGroup: 'Glúteos',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'bisagra_cadera',
    requiredEquipment: ['silla_firme', 'bandas_elasticas'],
    contraindications: ['cadera'],
    setupStep0: 'Siéntate erguido con una banda elástica colocada justo por encima de las rodillas y pies juntos en el suelo.',
    steps1To3: [
      'Separa las rodillas hacia afuera venciendo la resistencia de la banda elástica.',
      'Mantén la apertura máxima con los pies firmes durante 2 segundos.',
      'Regresa las rodillas lentamente sin dejar que la goma junte las piernas de golpe.',
    ],
    whereToFeel: 'Glúteo medio en la parte lateral de las caderas, clave para la estabilidad pélvica.',
    commonMistakes: [
      'Despegar la planta de los pies del suelo',
      'Arquear la columna al abrir',
      'Usar una banda excesivamente dura',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Estabilidad de cadera y alineación de rodillas con apoyo de silla.',
  }),

  buildExercise({
    id: 'legs_04_chair_squat_stand',
    name: 'Sentarse y levantarse de la silla (Chair Squat asistido)',
    targetMuscleGroup: 'Cuádriceps',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'cero_impacto_suave',
    movementPattern: 'dominante_rodilla',
    requiredEquipment: ['silla_firme'],
    contraindications: ['rodillas', 'espalda_lumbar'],
    setupStep0: 'Siéntate en el borde frontal de la silla con los pies separados al ancho de caderas y brazos cruzados sobre el pecho.',
    steps1To3: [
      'Inclina el torso ligeramente hacia adelante y empuja con ambos talones para ponerte de pie.',
      'Estira las caderas arriba contrayendo los glúteos sin arquear la espalda.',
      'Desciende las caderas con control rozando el asiento suavemente antes de volver a subir.',
    ],
    whereToFeel: 'Cuádriceps y glúteos mayores con la seguridad absoluta de tener la silla detrás.',
    commonMistakes: [
      'Dejarse caer pesadamente sobre la silla',
      'Juntar las rodillas hacia adentro al levantarse',
      'Empujar con las manos en los muslos sin necesidad',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=80',
    subtitle: 'El ejercicio funcional por excelencia para la independencia física.',
  }),

  buildExercise({
    id: 'legs_05_glute_bridge',
    name: 'Puente de glúteos en el suelo (Glute Bridge)',
    targetMuscleGroup: 'Glúteos',
    impactLevel: 'LOW',
    biomechanicalLevel: 'cero_impacto_suave',
    movementPattern: 'bisagra_cadera',
    requiredEquipment: ['esterilla'],
    contraindications: ['espalda_lumbar', 'cuello'],
    setupStep0: 'Túmbate boca arriba en la esterilla con rodillas dobladas, pies apoyados al ancho de caderas y brazos a los lados.',
    steps1To3: [
      'Presiona los talones contra el suelo y eleva la pelvis hacia el techo en línea recta rodilla-cadera-hombro.',
      'Aprieta con fuerza los glúteos durante 2 segundos en el punto más alto.',
      'Baja vértebra a vértebra despacio sin apoyar del todo la pelvis antes de la siguiente repetición.',
    ],
    whereToFeel: 'Glúteos e isquiotibiales. Cero pinzamiento en la zona lumbar.',
    commonMistakes: [
      'Arquear en exceso la espalda baja para subir más alto',
      'Apoyarse sobre los dedos del pie en vez de los talones',
      'Abrir o cerrar las rodillas de forma asimétrica',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Fuerza posterior y extensión de cadera sin carga en las rodillas.',
  }),

  buildExercise({
    id: 'legs_06_standing_wall_calf_raises',
    name: 'Elevación de talones de pie con apoyo en pared',
    targetMuscleGroup: 'Gemelos',
    impactLevel: 'LOW',
    biomechanicalLevel: 'cero_impacto_suave',
    movementPattern: 'pantorrillas_tobillo',
    requiredEquipment: ['pared_libre'],
    contraindications: ['ninguna'],
    setupStep0: 'Ponte de pie frente a una pared con las yemas de los dedos apoyadas para equilibrio y pies separados 10 cm.',
    steps1To3: [
      'Eleva los talones lo más alto posible sobre el metatarso con las rodillas rectas.',
      'Sostén 2 segundos arriba sintiendo la tensión en gemelos.',
      'Baja en 3 segundos hasta que los talones rocen el suelo suavemente.',
    ],
    whereToFeel: 'Gastrocnemio (gemelos) y tendón de Aquiles con gran estabilidad postural.',
    commonMistakes: [
      'Inclinarse hacia adelante sobre la pared',
      'Flexionar las rodillas al subir',
      'Bajar de golpe golpeando los talones',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Fuerza de tobillos y pantorrillas de pie con balance asistido.',
  }),

  buildExercise({
    id: 'legs_07_static_split_squat_assisted',
    name: 'Zancada estática asistida con apoyo en silla o pared',
    targetMuscleGroup: 'Cuádriceps',
    impactLevel: 'LOW',
    biomechanicalLevel: 'medio_perdida_peso',
    movementPattern: 'dominante_rodilla',
    requiredEquipment: ['silla_firme', 'pared_libre'],
    contraindications: ['rodillas', 'cadera'],
    setupStep0: 'Coloca una pierna adelantada y otra retrasada sobre la punta del pie, con una mano apoyada en la silla para equilibrio total.',
    steps1To3: [
      'Baja el cuerpo en línea vertical flexionando ambas rodillas a 90 grados.',
      'Pausa 1 segundo antes de que la rodilla trasera toque el suelo.',
      'Empuja con el talón delantero para volver a la posición erguida.',
    ],
    whereToFeel: 'Cuádriceps de la pierna adelantada y glúteo. Apoyo firme que elimina el miedo a perder el equilibrio.',
    commonMistakes: [
      'Adelantar la rodilla delantera sobrepasando en exceso el pie',
      'Inclinarse de lado perdiendo la verticalidad',
      'Golpear el suelo con la rodilla trasera',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Fuerza unilateral de piernas con soporte de seguridad para balance.',
  }),

  buildExercise({
    id: 'legs_08_band_romanian_deadlift',
    name: 'Peso muerto rumano con banda elástica bajo los pies',
    targetMuscleGroup: 'Isquiotibiales',
    impactLevel: 'LOW',
    biomechanicalLevel: 'medio_perdida_peso',
    movementPattern: 'bisagra_cadera',
    requiredEquipment: ['bandas_elasticas'],
    contraindications: ['espalda_lumbar'],
    setupStep0: 'Pisa el centro de la banda elástica con ambos pies, agarra los extremos con los brazos estirados y rodillas ligeramente dobladas.',
    steps1To3: [
      'Lleva las caderas hacia atrás como si quisieras tocar una pared con los glúteos, bajando el torso recto.',
      'Siente el estiramiento activo en la parte posterior de los muslos a nivel de las rodillas.',
      'Empuja las caderas hacia adelante contrayendo los glúteos para volver arriba.',
    ],
    whereToFeel: 'Isquiotibiales y glúteos con columna vertebral en posición neutra protegida.',
    commonMistakes: [
      'Doblar las rodillas convirtiéndolo en sentadilla',
      'Encorvar la espalda lumbar al bajar',
      'Tirar de la banda con los brazos',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Bisagra de cadera segura para fortalecer isquiotibiales y espalda baja.',
  }),

  buildExercise({
    id: 'legs_09_bodyweight_air_squats',
    name: 'Sentadilla libre profunda con peso corporal (Air Squat)',
    targetMuscleGroup: 'Cuádriceps',
    impactLevel: 'LOW',
    biomechanicalLevel: 'medio_perdida_peso',
    movementPattern: 'dominante_rodilla',
    requiredEquipment: ['peso_corporal'],
    contraindications: ['rodillas', 'espalda_lumbar'],
    setupStep0: 'De pie con pies a la anchura de hombros, puntas ligeramente hacia afuera (15-30 grados) y brazos al frente para balance.',
    steps1To3: [
      'Inicia flexionando caderas y rodillas a la vez descendiendo hasta que los muslos queden paralelos al suelo.',
      'Mantén el pecho alto y las rodillas apuntando en la misma dirección de las puntas de los pies.',
      'Empuja con fuerza los talones y exhala al regresar a la vertical completa.',
    ],
    whereToFeel: 'Cuádriceps, glúteos y aductores trabajando en sinergia funcional.',
    commonMistakes: [
      'Colapsar las rodillas hacia adentro al subir (valgo dinámico)',
      'Despegar los talones del suelo',
      'Doblar la espalda mirando hacia abajo',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Sentadilla completa libre con control postural y rango articular óptimo.',
  }),

  buildExercise({
    id: 'legs_10_dumbbell_romanian_deadlift',
    name: 'Peso muerto rumano con mancuernas (Hamstrings/Glutes)',
    targetMuscleGroup: 'Isquiotibiales',
    impactLevel: 'HIGH',
    biomechanicalLevel: 'avanzado_fuerza',
    movementPattern: 'bisagra_cadera',
    requiredEquipment: ['mancuernas'],
    contraindications: ['espalda_lumbar'],
    setupStep0: 'Ponte de pie con pies al ancho de caderas, sostén una mancuerna en cada mano frente a los muslos con hombros hacia atrás.',
    steps1To3: [
      'Empuja la cadera hacia atrás manteniendo las mancuernas pegadas a las piernas mientras descienden.',
      'Baja hasta justo debajo de las rodillas sintiendo máxima tensión en isquiotibiales sin arquear la espalda.',
      'Exhala y empuja la pelvis hacia el frente apretando glúteos con potencia arriba.',
    ],
    whereToFeel: 'Isquiotibiales, glúteos mayores y erectores espinales.',
    commonMistakes: [
      'Separar las mancuernas del cuerpo aumentando el brazo de palanca lumbar',
      'Redondear la espalda baja en la parte inferior',
      'Mirar al techo forzando cervicales',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Desarrollo de fuerza en la cadena posterior con sobrecarga libre.',
  }),

  buildExercise({
    id: 'legs_11_reverse_lunges',
    name: 'Zancadas alternas hacia atrás (Reverse Lunges)',
    targetMuscleGroup: 'Cuádriceps',
    impactLevel: 'HIGH',
    biomechanicalLevel: 'avanzado_fuerza',
    movementPattern: 'dominante_rodilla',
    requiredEquipment: ['peso_corporal'],
    contraindications: ['rodillas', 'cadera'],
    setupStep0: 'Ponte de pie con los pies juntos, manos en la cintura o brazos al frente para estabilizar el centro.',
    steps1To3: [
      'Da un paso amplio hacia atrás con una pierna y desciende el centro de gravedad en línea recta.',
      'Flexiona ambas rodillas a 90 grados rozando suavemente el suelo con la rodilla trasera.',
      'Empuja con el talón delantero para volver con firmeza a la posición inicial.',
    ],
    whereToFeel: 'Cuádriceps, glúteos y gemelos con menor estrés rotuliano que la zancada frontal.',
    commonMistakes: [
      'Dar un paso demasiado corto cargando la rodilla delantera',
      'Inclinarse hacia los lados por falta de fuerza de glúteo medio',
      'Dejarse caer sin control sobre el suelo',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Fuerza unilateral dinámica con excelente protección biomecánica para rodillas.',
  }),

  buildExercise({
    id: 'legs_12_bulgarian_split_squat',
    name: 'Sentadilla búlgara con pie trasero elevado en silla',
    targetMuscleGroup: 'Glúteos',
    impactLevel: 'HIGH',
    biomechanicalLevel: 'avanzado_fuerza',
    movementPattern: 'dominante_rodilla',
    requiredEquipment: ['silla_firme', 'peso_corporal'],
    contraindications: ['rodillas', 'espalda_lumbar', 'cadera'],
    setupStep0: 'Colócate a dos pasos de la silla de espaldas, apoya el empeine del pie trasero en el asiento y mantén el torso erguido.',
    steps1To3: [
      'Baja la cadera flexionando la rodilla delantera hasta que el muslo quede paralelo al suelo.',
      'Pausa 1 segundo en el punto de máxima flexión sintiendo el trabajo profundo en la pierna delantera.',
      'Empuja con fuerza el talón delantero para regresar a la posición erguida.',
    ],
    whereToFeel: 'Glúteo mayor y cuádriceps de la pierna de apoyo con gran exigencia neuromuscular unilateral.',
    commonMistakes: [
      'Pisar demasiado cerca de la silla sobrecargando la rótula',
      'Elevar el talón delantero del suelo',
      'Perder el equilibrio por mirar hacia los pies',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80',
    subtitle: 'El ejercicio rey unilateral para glúteo e hipertrofia de piernas.',
  }),

  // ==========================================================================
  // BLOQUE 4: CORE (10 Ejercicios)
  // ==========================================================================
  buildExercise({
    id: 'core_01_seated_stomach_vacuum',
    name: 'Activación del transverso abdominal (Vacuum / Respiración)',
    targetMuscleGroup: 'Core',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'core_anti_extension',
    requiredEquipment: ['silla_firme'],
    contraindications: ['ninguna'],
    setupStep0: 'Siéntate erguido con la espalda despegada del respaldo, manos sobre el abdomen y hombros relajados.',
    steps1To3: [
      'Inhala hondo inflando la parte baja de los pulmones sin subir los hombros.',
      'Exhala todo el aire por la boca y mete el ombligo hacia la columna vertebral.',
      'Mantén la contracción profunda isométrica 5 segundos antes de volver a inhalar con calma.',
    ],
    whereToFeel: 'Faja abdominal profunda (músculo transverso) protegiendo la columna.',
    commonMistakes: [
      'Elevar los hombros al respirar',
      'Contener la respiración con el pecho tenso',
      'Encorvar la espalda al meter el abdomen',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Activación de la musculatura profunda del transverso del abdomen.',
  }),

  buildExercise({
    id: 'core_02_seated_knee_tucks',
    name: 'Elevación de rodilla al pecho sentado en silla (Seated Knee Tucks)',
    targetMuscleGroup: 'Core',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'core_anti_extension',
    requiredEquipment: ['silla_firme'],
    contraindications: ['cadera', 'espalda_lumbar'],
    setupStep0: 'Siéntate en el borde de la silla, sujeta los laterales con las manos e inclina ligeramente el torso hacia atrás manteniendo la espalda recta.',
    steps1To3: [
      'Eleva una rodilla hacia el pecho contrayendo la zona baja del abdomen.',
      'Sostén 1 a 2 segundos arriba con exhalación controlada.',
      'Baja el pie rozando el suelo con la punta y alterna con la otra pierna.',
    ],
    whereToFeel: 'Abdomen inferior y flexores de cadera con soporte lumbar seguro en la silla.',
    commonMistakes: [
      'Balancear la espalda bruscamente',
      'Hacer fuerza con los brazos en lugar del abdomen',
      'Dejar caer el pie con fuerza contra el suelo',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Flexión de cadera y activación de abdomen bajo en descarga articular.',
  }),

  buildExercise({
    id: 'core_03_seated_russian_twists',
    name: 'Giros rusos suaves sentado en silla sin carga',
    targetMuscleGroup: 'Core',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'core_anti_rotacion',
    requiredEquipment: ['silla_firme'],
    contraindications: ['espalda_lumbar'],
    setupStep0: 'Siéntate erguido con los pies firmes en el suelo, junta las manos frente al esternón y aprieta el abdomen.',
    steps1To3: [
      'Gira el torso lentamente hacia la derecha unos 30-45 grados guiando con los hombros.',
      'Pausa 1 segundo sintiendo la contracción en los oblicuos.',
      'Regresa al centro y gira de forma simétrica hacia la izquierda de forma suave.',
    ],
    whereToFeel: 'Músculos oblicuos del abdomen y estabilizadores rotacionales del tronco.',
    commonMistakes: [
      'Mover solo los brazos sin girar el tronco',
      'Girar de forma rápida o con tirones lesivos para las vértebras',
      'Mover las rodillas de un lado a otro perdiendo la base',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Rotación torácica controlada y activación oblicua sin impacto.',
  }),

  buildExercise({
    id: 'core_04_dead_bug',
    name: 'Bicho muerto en suelo (Dead Bug suave)',
    targetMuscleGroup: 'Core',
    impactLevel: 'LOW',
    biomechanicalLevel: 'cero_impacto_suave',
    movementPattern: 'core_anti_extension',
    requiredEquipment: ['esterilla'],
    contraindications: ['espalda_lumbar'],
    setupStep0: 'Túmbate boca arriba en la esterilla, eleva los brazos hacia el techo y las rodillas flexionadas a 90 grados.',
    steps1To3: [
      'Pega la espalda lumbar contra el suelo y extiende brazo derecho hacia atrás y pierna izquierda hacia adelante.',
      'Detén las extremidades a 10 cm del suelo sin despegar la espalda lumbar de la esterilla.',
      'Regresa al centro y repite de forma cruzada con brazo izquierdo y pierna derecha.',
    ],
    whereToFeel: 'Abdomen profundo y coordinación neuromuscular cruzada con cero estrés lumbar.',
    commonMistakes: [
      'Arquear la espalda lumbar separándola de la colchoneta',
      'Mover las dos extremidades del mismo lado',
      'Aguantar la respiración',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80',
    subtitle: 'El patrón biomecánico de anti-extensión más seguro y efectivo para la columna.',
  }),

  buildExercise({
    id: 'core_05_isometric_glute_core_bridge',
    name: 'Puente de glúteos con contracción isométrica de abdomen',
    targetMuscleGroup: 'Core',
    impactLevel: 'LOW',
    biomechanicalLevel: 'cero_impacto_suave',
    movementPattern: 'bisagra_cadera',
    requiredEquipment: ['esterilla'],
    contraindications: ['espalda_lumbar', 'cuello'],
    setupStep0: 'Acuéstate boca arriba con rodillas a 90 grados y pies planos. Coloca las manos sobre el abdomen bajo para chequear la firmeza muscular.',
    steps1To3: [
      'Eleva la pelvis contrayendo glúteos y metiendo activamente el ombligo hacia dentro.',
      'Sostén la posición isométrica durante 5 segundos respirando fluidamente.',
      'Desciende 2 cm sin apoyar la cadera y vuelve a apretar arriba.',
    ],
    whereToFeel: 'Conexión integral entre glúteos, suelo pélvico y abdomen bajo.',
    commonMistakes: [
      'Hiperextender la columna lumbar para subir más alto',
      'Separar los pies de la esterilla',
      'Tensionar el cuello y apretar la mandíbula',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Estabilidad lumbopélvica integrando abdomen y glúteos.',
  }),

  buildExercise({
    id: 'core_06_incline_chair_plank',
    name: 'Plancha frontal con manos apoyadas en silla o pared',
    targetMuscleGroup: 'Core',
    impactLevel: 'LOW',
    biomechanicalLevel: 'medio_perdida_peso',
    movementPattern: 'core_anti_extension',
    requiredEquipment: ['silla_firme', 'pared_libre'],
    contraindications: ['munecas', 'espalda_lumbar'],
    setupStep0: 'Apoya las manos en el borde de una silla fija contra la pared, estira las piernas hacia atrás en línea recta talón-cadera-cabeza.',
    steps1To3: [
      'Aprieta los glúteos y empuja el asiento alejando el pecho de la silla.',
      'Mantén la plancha isométrica respirando de manera rítmica durante 20 a 30 segundos.',
      'Da un paso adelante con un pie para desmontar la postura con total suavidad.',
    ],
    whereToFeel: 'Todo el cinturón abdominal y estabilizadores de hombro con bajo impacto en muñecas.',
    commonMistakes: [
      'Hundir la cadera hacia abajo comprometiendo lumbares',
      'Subir los glúteos en triángulo evitando el trabajo de core',
      'Mirar hacia los pies en vez de hacia las manos',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Plancha isométrica inclinada que protege la espalda baja.',
  }),

  buildExercise({
    id: 'core_07_bird_dog',
    name: 'Bird Dog en cuadripedia (Extensión cruzada de brazo y pierna)',
    targetMuscleGroup: 'Core',
    impactLevel: 'LOW',
    biomechanicalLevel: 'medio_perdida_peso',
    movementPattern: 'core_anti_rotacion',
    requiredEquipment: ['esterilla'],
    contraindications: ['munecas', 'rodillas', 'espalda_lumbar'],
    setupStep0: 'Colócate en cuatro apoyos sobre la esterilla con manos bajo los hombros y rodillas bajo las caderas, espalda neutra.',
    steps1To3: [
      'Extiende el brazo derecho hacia adelante y la pierna izquierda hacia atrás en línea recta con el torso.',
      'Mantén 2 segundos sin rotar las caderas imaginando un vaso de agua en tu espalda baja.',
      'Regresa al suelo despacio y cambia al brazo izquierdo y pierna derecha.',
    ],
    whereToFeel: 'Erectores espinales, glúteo mayor y musculatura estabilizadora cruzada.',
    commonMistakes: [
      'Elevar la pierna por encima de la línea de la cadera arqueando la espalda',
      'Girar la pelvis hacia un lado',
      'Dejar caer la cabeza',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Ejercicio de oro del Dr. Stuart McGill para salud y resistencia espinal.',
  }),

  buildExercise({
    id: 'core_08_side_plank_knees',
    name: 'Plancha lateral apoyando rodillas en esterilla',
    targetMuscleGroup: 'Core',
    impactLevel: 'LOW',
    biomechanicalLevel: 'medio_perdida_peso',
    movementPattern: 'core_anti_rotacion',
    requiredEquipment: ['esterilla'],
    contraindications: ['hombros', 'espalda_lumbar'],
    setupStep0: 'Acuéstate de lado con el codo apoyado bajo el hombro, rodillas flexionadas a 90 grados hacia atrás y piernas juntas.',
    steps1To3: [
      'Eleva las caderas del suelo formando una línea recta desde las rodillas hasta el hombro.',
      'Sostén la plancha lateral 15-20 segundos con el brazo libre en la cadera o hacia el techo.',
      'Desciende las caderas suavemente a la esterilla y cambia de lado.',
    ],
    whereToFeel: 'Oblicuos inferiores y glúteo medio sosteniendo la pelvis.',
    commonMistakes: [
      'Colapsar el hombro hacia la oreja',
      'Rotar el pecho hacia el suelo perdiendo la alineación lateral',
      'Dejar caer la cadera hacia la colchoneta',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Estabilidad en el plano frontal y fortalecimiento de oblicuos con palanca corta.',
  }),

  buildExercise({
    id: 'core_09_full_forearm_plank',
    name: 'Plancha frontal completa sobre antebrazos en el suelo',
    targetMuscleGroup: 'Core',
    impactLevel: 'HIGH',
    biomechanicalLevel: 'avanzado_fuerza',
    movementPattern: 'core_anti_extension',
    requiredEquipment: ['esterilla'],
    contraindications: ['hombros', 'espalda_lumbar'],
    setupStep0: 'Túmbate boca abajo y apoya los antebrazos con los codos bajo los hombros, pies apoyados en las puntas de los dedos.',
    steps1To3: [
      'Eleva todo el cuerpo formando una línea rígida desde los talones hasta la coronilla.',
      'Contrae glúteos, cuádriceps y abdomen tirando de los codos hacia las puntas de los pies de forma isométrica.',
      'Respira con calma manteniendo la posición sin permitir que la espalda baja se hunda.',
    ],
    whereToFeel: 'Recto abdominal, transverso, glúteos y hombros.',
    commonMistakes: [
      'Dejar caer la cadera arqueando la columna lumbar',
      'Subir los glúteos demasiado alto para esquivar el esfuerzo',
      'Contener la respiración durante la plancha',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    subtitle: 'La plancha isométrica completa de máxima tensión central.',
  }),

  buildExercise({
    id: 'core_10_shoulder_tap_plank',
    name: 'Plancha dinámica con toque alterno de hombros',
    targetMuscleGroup: 'Core',
    impactLevel: 'HIGH',
    biomechanicalLevel: 'avanzado_fuerza',
    movementPattern: 'core_anti_rotacion',
    requiredEquipment: ['esterilla'],
    contraindications: ['munecas', 'hombros', 'espalda_lumbar'],
    setupStep0: 'Colócate en posición de plancha sobre las palmas de las manos con pies abiertos más anchos que las caderas para mayor estabilidad.',
    steps1To3: [
      'Levanta la mano derecha y toca suavemente el hombro izquierdo sin mover las caderas.',
      'Vuelve a apoyar la mano derecha en el suelo con firmeza.',
      'Repite tocando el hombro derecho con la mano izquierda manteniendo el core inmóvil.',
    ],
    whereToFeel: 'Oblicuos profundos y core anti-rotación trabajando para evitar el balanceo.',
    commonMistakes: [
      'Balancear las caderas de lado a lado como un barco',
      'Juntar los pies demasiado dificultando el balance',
      'Tocar los hombros con prisa y descontrol',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Desafío neuromuscular de anti-rotación con apoyo sobre 3 puntos.',
  }),

  // ==========================================================================
  // BLOQUE 5: VUELTA A LA CALMA / MOVILIDAD SUAVE (6 Ejercicios)
  // ==========================================================================
  buildExercise({
    id: 'cool_01_diaphragmatic_breathing',
    name: 'Respiración diafragmática profunda con expansión costal',
    targetMuscleGroup: 'Movilidad y Calma',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'core_anti_extension',
    requiredEquipment: ['silla_firme', 'esterilla'],
    contraindications: ['ninguna'],
    setupStep0: 'Siéntate cómodamente en la silla o túmbate boca arriba en la esterilla con una mano en el pecho y otra en el abdomen.',
    steps1To3: [
      'Inhala suavemente por la nariz en 4 segundos sintiendo cómo sube la mano de tu abdomen mientras el pecho permanece quieto.',
      'Sostén el aire 2 segundos en una pausa relajante y consciente.',
      'Exhala despacio por la boca en 6 segundos vaciando los pulmones y liberando la tensión de hombros y mandíbula.',
    ],
    whereToFeel: 'Diafragma, activación del sistema parasimpático y reducción del ritmo cardíaco.',
    commonMistakes: [
      'Subir los hombros hacia las orejas al respirar',
      'Respirar con el pecho alto en lugar del abdomen',
      'Forzar la expulsión del aire con tensión',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Activación del sistema nervioso parasimpático para acelerar la recuperación.',
    block: 'vuelta_a_la_calma',
  }),

  buildExercise({
    id: 'cool_02_cat_cow_mobility',
    name: 'Gato-Camello en cuadripedia o apoyado en silla (Movilidad espinal)',
    targetMuscleGroup: 'Movilidad y Calma',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'cero_impacto_suave',
    movementPattern: 'estabilidad_escapular',
    requiredEquipment: ['esterilla', 'silla_firme'],
    contraindications: ['munecas', 'espalda_lumbar'],
    setupStep0: 'En cuatro apoyos sobre la esterilla o de pie con manos apoyadas en el respaldo de una silla, columna neutra.',
    steps1To3: [
      'Inhala llevando la mirada suavemente al frente y arqueando con cuidado la espalda hacia abajo abriendo el pecho (vaca).',
      'Exhala mientras redondeas la espalda hacia el techo metiendo la barbilla al pecho y el ombligo adentro (gato).',
      'Fluye entre ambas posturas al compás de tu respiración durante 5 a 6 ciclos continuos.',
    ],
    whereToFeel: 'Articulación de cada vértebra de la columna vertebral y alivio de rigidez dorsal y lumbar.',
    commonMistakes: [
      'Forzar el rango cervical tirando del cuello hacia atrás',
      'Moverse rápido sin sincronizar la respiración',
      'Bloquear los codos con rigidez excesiva',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Flexibilización y descompresión de toda la columna vertebral.',
    block: 'vuelta_a_la_calma',
  }),

  buildExercise({
    id: 'cool_03_chest_doorframe_stretch',
    name: 'Estiramiento de apertura pectoral en marco de puerta o pared',
    targetMuscleGroup: 'Pectoral',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'empuje_horizontal',
    requiredEquipment: ['pared_libre'],
    contraindications: ['hombros'],
    setupStep0: 'Colócate de pie junto a un marco de puerta o pared, apoya el antebrazo a 90 grados con el codo a la altura del hombro.',
    steps1To3: [
      'Da un paso corto hacia adelante con la pierna del mismo lado y gira suavemente el pecho hacia el lado opuesto.',
      'Detén el giro al sentir un estiramiento suave y placentero en el pectoral sin pinzamiento en el hombro.',
      'Mantén la posición respirando profundamente durante 20-25 segundos y repite con el otro brazo.',
    ],
    whereToFeel: 'Pectoral mayor y menor y cara anterior del hombro, contrarrestando la postura sentada.',
    commonMistakes: [
      'Girar con brusquedad buscando un estiramiento doloroso',
      'Subir el hombro hacia la oreja al estirar',
      'Sentir tirantez articular en vez de muscular',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Apertura de la caja torácica y descompresión del hombro anterior.',
    block: 'vuelta_a_la_calma',
  }),

  buildExercise({
    id: 'cool_04_childs_pose',
    name: 'Descompresión lumbar en postura del niño (Child\'s Pose)',
    targetMuscleGroup: 'Movilidad y Calma',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'cero_impacto_suave',
    movementPattern: 'bisagra_cadera',
    requiredEquipment: ['esterilla'],
    contraindications: ['rodillas'],
    setupStep0: 'De rodillas sobre la esterilla con los dedos gordos de los pies juntos y rodillas separadas al ancho de la colchoneta.',
    steps1To3: [
      'Lleva los glúteos hacia los talones y camina con las manos hacia adelante estirando los brazos sobre el suelo.',
      'Apoya la frente suavemente en la esterilla y relaja el peso del pecho hacia el suelo.',
      'Respira con el abdomen durante 30 a 45 segundos permitiendo que la zona lumbar se descomprima por completo.',
    ],
    whereToFeel: 'Descompresión suave de la columna lumbar, estiramiento de dorsales y caderas.',
    commonMistakes: [
      'Forzar las rodillas si hay molestia (poner un cojín entre glúteos y talones)',
      'Tensionar los hombros en vez de dejarlos caer',
      'Respirar superficialmente con el pecho',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    subtitle: 'El mejor alivio pasivo para la tensión lumbar acumulada.',
    block: 'vuelta_a_la_calma',
  }),

  buildExercise({
    id: 'cool_05_seated_hip_flexor_stretch',
    name: 'Estiramiento de flexores de cadera y cuádriceps asistido en silla',
    targetMuscleGroup: 'Movilidad y Calma',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'bisagra_cadera',
    requiredEquipment: ['silla_firme'],
    contraindications: ['cadera', 'rodillas'],
    setupStep0: 'Siéntate de lado en la silla dejando la pierna exterior libre hacia atrás, con la rodilla flexionada apuntando al suelo y el torso erguido.',
    steps1To3: [
      'Lleva el muslo libre ligeramente hacia atrás contrayendo el glúteo de ese lado.',
      'Siente el estiramiento en la parte delantera de la cadera (psoas) manteniendo el tronco vertical.',
      'Mantén 20 segundos por lado con respiraciones profundas y pausadas.',
    ],
    whereToFeel: 'Flexores de cadera anteriores (psoas-ilíaco) y recto femoral.',
    commonMistakes: [
      'Arquear la espalda baja para compensar falta de extensión de cadera',
      'Inclinarse hacia adelante perdiendo el estiramiento',
      'Aguantar la respiración',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Liberación del psoas acortado por pasar muchas horas sentado.',
    block: 'vuelta_a_la_calma',
  }),

  buildExercise({
    id: 'cool_06_seated_neck_trapezius_release',
    name: 'Movilidad cervical y relajación de trapecios sentado',
    targetMuscleGroup: 'Movilidad y Calma',
    impactLevel: 'ZERO',
    biomechanicalLevel: 'terapeutico_silla',
    movementPattern: 'estabilidad_escapular',
    requiredEquipment: ['silla_firme'],
    contraindications: ['cuello'],
    setupStep0: 'Siéntate muy erguido con los hombros bajos y sueltos, manos apoyadas en los muslos y mandíbula relajada.',
    steps1To3: [
      'Inclina suavemente la oreja derecha hacia el hombro derecho sin subir el hombro opuesto.',
      'Siente el estiramiento relajante en el lateral del cuello y trapecio durante 15 segundos.',
      'Regresa al centro con lentitud y repite hacia el lado izquierdo completando la descarga cervical.',
    ],
    whereToFeel: 'Músculos trapecio superior y esternocleidomastoideo, liberando la tensión acumulada.',
    commonMistakes: [
      'Tirar de la cabeza con la mano con fuerza excesiva',
      'Subir los hombros en vez de dejarlos caer pesados',
      'Hacer giros rápidos o bruscos con el cuello',
    ],
    singleReferenceImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Descarga inmediata de tensión en trapecios y cuello.',
    block: 'vuelta_a_la_calma',
  }),
];

// ============================================================================
// MOTOR DE ADAPTACIÓN INMEDIATA (BOTÓN DE PÁNICO)
// Búsqueda inteligente de alternativas suaves del mismo patrón o grupo muscular
// ============================================================================

export interface SafeAlternativeOption extends CatalogExercise {
  safetyReason: string;
  benefitBadge: string;
  iconType: 'chair' | 'feather' | 'wall' | 'bed';
}

export function findSafeAlternativesForExercise(
  current: Exercise | CatalogExercise,
  limit = 3
): SafeAlternativeOption[] {
  const currentId = current.id || '';
  const currentTitle = (current.name || current.title || '').toLowerCase();
  const currentPattern = current.movementPattern || 'dominante_rodilla';
  const currentMuscle = (current.targetMuscleGroup || current.targetMuscles?.[0] || '').toLowerCase();

  // Patrones motor prioritarios con variantes de menor impacto / cero cizalla
  const specificMap: Record<string, string[]> = {
    dominante_rodilla: [
      'legs_05_glute_bridge',
      'legs_01_seated_knee_extensions',
      'legs_04_chair_squat_stand',
      'legs_03_seated_band_abduction',
    ],
    dominante_cadera: [
      'legs_05_glute_bridge',
      'legs_03_seated_band_abduction',
      'core_05_isometric_glute_core_bridge',
    ],
    empuje_horizontal: [
      'push_02_wall_isometric',
      'push_01_chair_chest_press',
      'pull_01_seated_scapular_squeeze',
    ],
    empuje_vertical: [
      'push_01_chair_chest_press',
      'pull_03_wall_w_slides',
      'pull_01_seated_scapular_squeeze',
    ],
    traccion_horizontal: [
      'pull_01_seated_scapular_squeeze',
      'pull_03_wall_w_slides',
      'pull_02_seated_towel_row',
    ],
    traccion_vertical: [
      'pull_03_wall_w_slides',
      'pull_01_seated_scapular_squeeze',
    ],
    core_anti_extension: [
      'core_01_seated_stomach_vacuum',
      'core_05_isometric_glute_core_bridge',
      'core_07_bird_dog',
    ],
    core_anti_rotacion: [
      'core_01_seated_stomach_vacuum',
      'core_07_bird_dog',
      'core_05_isometric_glute_core_bridge',
    ],
  };

  let priorityIds: string[] = [];
  if (
    currentTitle.includes('sentadilla') ||
    currentTitle.includes('squat') ||
    currentTitle.includes('zancada') ||
    currentTitle.includes('lunge')
  ) {
    priorityIds = [
      'legs_05_glute_bridge',
      'legs_01_seated_knee_extensions',
      'legs_04_chair_squat_stand',
    ];
  } else if (
    currentTitle.includes('flexi') ||
    currentTitle.includes('push') ||
    currentTitle.includes('press')
  ) {
    priorityIds = [
      'push_02_wall_isometric',
      'push_01_chair_chest_press',
      'pull_01_seated_scapular_squeeze',
    ];
  } else if (specificMap[currentPattern]) {
    priorityIds = specificMap[currentPattern];
  }

  if (current.adaptedAlternativeId && current.adaptedAlternativeId !== currentId) {
    priorityIds = [current.adaptedAlternativeId, ...priorityIds];
  }

  const matchedExercises: CatalogExercise[] = [];
  const addedIds = new Set<string>();
  addedIds.add(currentId);

  // 1. Agregar desde prioridades específicas
  for (const pid of priorityIds) {
    if (addedIds.has(pid)) continue;
    const found = EXERCISES_DATABASE.find((e) => e.id === pid);
    if (found) {
      matchedExercises.push(found);
      addedIds.add(pid);
    }
  }

  // 2. Si se requieren más, buscar en catálogo por patrón o músculo con impacto ZERO o terapéutico
  if (matchedExercises.length < limit) {
    const candidates = EXERCISES_DATABASE.filter((e) => {
      if (addedIds.has(e.id)) return false;
      const isZeroOrLow = e.impactLevel === 'ZERO' || e.impactLevel === 'LOW';
      const isTherapeutic =
        e.biomechanicalLevel === 'terapeutico_silla' ||
        e.biomechanicalLevel === 'cero_impacto_suave';
      const patternMatch = e.movementPattern === currentPattern;
      const muscleMatch =
        currentMuscle && e.targetMuscleGroup.toLowerCase().includes(currentMuscle);
      return (patternMatch || muscleMatch) && (isZeroOrLow || isTherapeutic);
    });

    candidates.sort((a, b) => {
      const aScore =
        (a.impactLevel === 'ZERO' ? 3 : 1) +
        (a.biomechanicalLevel === 'terapeutico_silla' ? 2 : 0);
      const bScore =
        (b.impactLevel === 'ZERO' ? 3 : 1) +
        (b.biomechanicalLevel === 'terapeutico_silla' ? 2 : 0);
      return bScore - aScore;
    });

    for (const c of candidates) {
      if (matchedExercises.length >= limit) break;
      matchedExercises.push(c);
      addedIds.add(c.id);
    }
  }

  // 3. Fallbacks universales de máxima seguridad articular
  const generalFallbacks = [
    'legs_05_glute_bridge',
    'push_01_chair_chest_press',
    'pull_01_seated_scapular_squeeze',
    'legs_01_seated_knee_extensions',
    'core_01_seated_stomach_vacuum',
  ];
  for (const fid of generalFallbacks) {
    if (matchedExercises.length >= limit) break;
    if (addedIds.has(fid)) continue;
    const found = EXERCISES_DATABASE.find((e) => e.id === fid);
    if (found) {
      matchedExercises.push(found);
      addedIds.add(fid);
    }
  }

  return matchedExercises.slice(0, limit).map((ex) => {
    let benefitBadge = 'Cero Impacto';
    let iconType: 'chair' | 'feather' | 'wall' | 'bed' = 'feather';
    let safetyReason =
      'Movimiento adaptado que elimina la sobrecarga articular manteniendo la activación.';

    if (
      ex.biomechanicalLevel === 'terapeutico_silla' ||
      ex.requiredEquipment.includes('silla_firme')
    ) {
      benefitBadge = 'Apoyo en Silla';
      iconType = 'chair';
      safetyReason =
        'Soporte total en asiento firme: descarga articulaciones y columna lumbar.';
    } else if (ex.requiredEquipment.includes('pared_libre')) {
      benefitBadge = 'Apoyo en Pared';
      iconType = 'wall';
      safetyReason =
        'Descarga el peso corporal contra la pared, reduciendo drásticamente la fuerza de cizalla.';
    } else if (ex.id.includes('glute_bridge') || ex.id.includes('dead_bug')) {
      benefitBadge = 'En Suelo / Cero Cizalla';
      iconType = 'bed';
      safetyReason =
        'Soporte supino en suelo: elimina compresión axial en rodillas y columna.';
    } else if (ex.impactLevel === 'ZERO') {
      benefitBadge = 'Cero Impacto';
      iconType = 'feather';
      safetyReason =
        'Protección biomecánica estricta para continuar el entreno sin ningún pinchazo.';
    }

    if (ex.id.includes('knee_extensions')) {
      safetyReason =
        'Elimina todo el soporte de peso en rodillas y rótula; trabaja cuádriceps sentado.';
    } else if (ex.id.includes('glute_bridge')) {
      safetyReason =
        'Activa glúteos e isquiotibiales sin ninguna flexión extrema ni carga sobre las rodillas.';
    } else if (ex.id.includes('scapular_squeeze')) {
      safetyReason =
        'Retracción escapular sin carga: activa la espalda alta y libera hombros y cuello de tensión.';
    } else if (ex.id.includes('wall_isometric')) {
      safetyReason =
        'Isometría contra pared: fuerza de empuje sin flexión agresiva de muñecas ni hombros.';
    } else if (ex.id.includes('chair_chest_press')) {
      safetyReason =
        'Empuje isométrico sentado: activa el pectoral sin mover articulaciones comprometidas.';
    }

    return {
      ...ex,
      benefitBadge,
      iconType,
      safetyReason,
    };
  });
}

