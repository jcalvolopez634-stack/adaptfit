import {
  AnthropometricRecord,
  BiologicalSex,
  BodyFocusZone,
  BodyGoals,
  JointDiscomfortZone,
} from '../types';

export interface BMIAssessment {
  bmi: number;
  category: 'bajo_peso' | 'normopeso' | 'sobrepeso' | 'obesidad';
  label: string;
  badgeBg: string;
  badgeText: string;
  advice: string;
}

export interface BodyCompositionAdvice {
  currentWeightKg: number;
  heightCm: number;
  currentBmi: number;
  bmiCategory: 'bajo_peso' | 'normopeso' | 'sobrepeso' | 'obesidad';
  bmiCategoryLabel: string;
  minHealthyWeightKg: number;
  maxHealthyWeightKg: number;
  recommendedWeeklyDescentMinKg: number;
  recommendedWeeklyDescentMaxKg: number;
  clinicalMessage: string;
  jointSafetyFocus: boolean;
  waistHipRatio?: number;
  waistHipRisk?: 'bajo' | 'moderado' | 'alto';
}

export function calculateBMI(weightKg: number, heightCm: number): BMIAssessment {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) {
    return {
      bmi: 0,
      category: 'normopeso',
      label: 'Sin datos suficientes',
      badgeBg: 'bg-[#F3F4F5]',
      badgeText: 'text-[#707973]',
      advice: 'Introduce tu altura y peso para calcular tu índice inicial.',
    };
  }

  const heightInMeters = heightCm / 100;
  const rawBmi = weightKg / (heightInMeters * heightInMeters);
  const bmi = Math.round(rawBmi * 10) / 10;

  if (bmi < 18.5) {
    return {
      bmi,
      category: 'bajo_peso',
      label: 'Bajo peso',
      badgeBg: 'bg-[#EBF3FA]',
      badgeText: 'text-[#1D6FA5]',
      advice:
        'Priorizaremos ejercicios de fortalecimiento muscular progresivo y tono postural.',
    };
  }
  if (bmi < 25) {
    return {
      bmi,
      category: 'normopeso',
      label: 'Normopeso / Saludable',
      badgeBg: 'bg-[#E7F3EC]',
      badgeText: 'text-[#0F5238]',
      advice:
        'Rango estándar saludable. Nuestro foco está en desarrollar fuerza, movilidad y vitalidad diaria.',
    };
  }
  if (bmi < 30) {
    return {
      bmi,
      category: 'sobrepeso',
      label: 'Sobrepeso',
      badgeBg: 'bg-[#FFF6ED]',
      badgeText: 'text-[#8E4E14]',
      advice:
        'Foco en gasto metabólico seguro y protección articular de rodillas y zona lumbar.',
    };
  }
  return {
    bmi,
    category: 'obesidad',
    label: 'Obesidad',
    badgeBg: 'bg-[#FDF0EE]',
    badgeText: 'text-[#9C3220]',
    advice:
      'Cero impacto articular obligatorio para proteger cartílagos mientras reactivamos el metabolismo sin sufrimiento.',
  };
}

export function calculateBodyCompositionAdvice(params: {
  weightKg?: number;
  heightCm?: number;
  sex?: BiologicalSex | string;
  discomfortZones?: (string | JointDiscomfortZone)[];
  waistCm?: number;
  hipCm?: number;
}): BodyCompositionAdvice {
  const heightCm = params.heightCm && params.heightCm > 0 ? params.heightCm : 165;
  const weightKg = params.weightKg && params.weightKg > 0 ? params.weightKg : 70;
  const sex = params.sex || 'Mujer';
  const discomforts = params.discomfortZones || [];

  const heightM = heightCm / 100;
  const bmiRaw = weightKg / (heightM * heightM);
  const currentBmi = Math.round(bmiRaw * 10) / 10;

  // OMS Rango Saludable IMC 18.5 - 24.9
  const minHealthyWeightKg = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxHealthyWeightKg = Math.round(24.9 * heightM * heightM * 10) / 10;

  // Ritmo semanal seguro sin comprometer la masa muscular
  const recommendedWeeklyDescentMinKg = 0.3;
  const recommendedWeeklyDescentMaxKg = 0.5;

  let bmiCategory: 'bajo_peso' | 'normopeso' | 'sobrepeso' | 'obesidad' = 'normopeso';
  let bmiCategoryLabel = 'Normopeso (Rango saludable OMS)';

  if (currentBmi < 18.5) {
    bmiCategory = 'bajo_peso';
    bmiCategoryLabel = 'Bajo peso (OMS)';
  } else if (currentBmi < 25) {
    bmiCategory = 'normopeso';
    bmiCategoryLabel = 'Normopeso / Saludable (OMS)';
  } else if (currentBmi < 30) {
    bmiCategory = 'sobrepeso';
    bmiCategoryLabel = 'Sobrepeso (OMS)';
  } else {
    bmiCategory = 'obesidad';
    bmiCategoryLabel = 'Obesidad (OMS)';
  }

  // Detección de molestias articulares
  const activeDiscomforts = discomforts.filter(
    (z) => z && z !== 'ninguna' && z !== 'Ninguna' && z !== 'Ninguna molestia'
  );
  const jointSafetyFocus = activeDiscomforts.length > 0;

  let clinicalMessage = '';
  if (jointSafetyFocus) {
    const formattedZones = activeDiscomforts
      .map((z) => z.replace(/_/g, ' '))
      .join(', ');
    clinicalMessage = `Prioridad de Impacto Cero y Preservación Muscular: Al presentar sensibilidad articular (${formattedZones}), la protección de cartílagos y el fortalecimiento isométrico y funcional prevalecen sobre déficits calóricos agresivos. Se aconseja un ritmo gradual de 0.3 - 0.5 kg/semana para despresurizar articulaciones sin perder tono muscular.`;
  } else if (bmiCategory === 'normopeso') {
    clinicalMessage = `Composición en Rango Saludable: Tu peso se encuentra en la franja ideal OMS (${minHealthyWeightKg} - ${maxHealthyWeightKg} kg). El objetivo primordial es el mantenimiento de la masa muscular, la densidad ósea y la salud postural mediante entrenamiento funcional regular.`;
  } else if (bmiCategory === 'sobrepeso' || bmiCategory === 'obesidad') {
    clinicalMessage = `Pauta de Recomposición Progresiva: Se recomienda un ritmo de descenso seguro de 0.3 a 0.5 kg/semana (rango saludable ideal: ${minHealthyWeightKg} - ${maxHealthyWeightKg} kg). Cada kilogramo de peso corporal reducido alivia de 3 a 4 kg de sobrecarga en rodillas y columna lumbar, preservando íntegra la masa muscular magra.`;
  } else {
    clinicalMessage = `Foco en Densidad y Masa Magra: Tu peso se encuentra por debajo de la franja normativa (${minHealthyWeightKg} - ${maxHealthyWeightKg} kg). Recomendamos ejercicios de fuerza funcional con apoyo y una nutrición de calidad para optimizar tu masa muscular y estabilidad articular sin fatiga.`;
  }

  // Ratio Cintura / Cadera (ICC)
  let waistHipRatio: number | undefined = undefined;
  let waistHipRisk: 'bajo' | 'moderado' | 'alto' | undefined = undefined;
  if (params.waistCm && params.hipCm && params.hipCm > 0) {
    waistHipRatio = Math.round((params.waistCm / params.hipCm) * 100) / 100;
    if (sex === 'Hombre') {
      if (waistHipRatio < 0.9) waistHipRisk = 'bajo';
      else if (waistHipRatio <= 0.95) waistHipRisk = 'moderado';
      else waistHipRisk = 'alto';
    } else {
      if (waistHipRatio < 0.8) waistHipRisk = 'bajo';
      else if (waistHipRatio <= 0.85) waistHipRisk = 'moderado';
      else waistHipRisk = 'alto';
    }
  }

  return {
    currentWeightKg: weightKg,
    heightCm,
    currentBmi,
    bmiCategory,
    bmiCategoryLabel,
    minHealthyWeightKg,
    maxHealthyWeightKg,
    recommendedWeeklyDescentMinKg,
    recommendedWeeklyDescentMaxKg,
    clinicalMessage,
    jointSafetyFocus,
    waistHipRatio,
    waistHipRisk,
  };
}

export interface MeasurementGuideItem {
  key: string;
  title: string;
  landmark: string;
  instruction: string;
  tip: string;
  icon: string;
}

export const MEASUREMENT_GUIDES: Record<string, MeasurementGuideItem> = {
  hombros: {
    key: 'hombros',
    title: 'Contorno de Hombros',
    landmark: 'Vientre medio de los deltoides por debajo de la articulación acromioclavicular.',
    instruction:
      'Ponte de pie relajado con los brazos a los lados. Pasa la cinta alrededor del punto de mayor anchura sobre los deltoides.',
    tip: 'No eleves los trapecios ni contengas la respiración mientras tomas la medida.',
    icon: '🛡️',
  },
  pecho: {
    key: 'pecho',
    title: 'Contorno de Pecho / Torso',
    landmark: 'Línea mesosternal, a la altura de los pezones (4º espacio intercostal).',
    instruction:
      'Coloca la cinta horizontalmente justo por debajo de las axilas y a la altura de los pezones, tras una espiración normal.',
    tip: 'Mantén la cinta horizontal y paralela al suelo por delante y por la espalda.',
    icon: '👕',
  },
  cintura: {
    key: 'cintura',
    title: 'Contorno de Cintura',
    landmark: 'Punto medio entre el borde inferior de la última costilla y la cresta ilíaca (nivel umbilical).',
    instruction:
      'Coloca la cinta métrica horizontalmente a la altura del ombligo, sin meter la tripa y al final de una espiración normal.',
    tip: 'No aprietes la cinta sobre la piel; debe quedar firme pero sin comprimir los tejidos blandos.',
    icon: '📏',
  },
  cadera: {
    key: 'cadera',
    title: 'Contorno de Cadera / Glúteos',
    landmark: 'Nivel del trocánter mayor del fémur, pasando por la máxima prominencia de los glúteos.',
    instruction:
      'Ponte de pie con los pies juntos. Mide pasando la cinta por la parte más prominente de los glúteos.',
    tip: 'Asegúrate de que la cinta esté nivelada paralelamente al suelo en todo el contorno.',
    icon: '🍑',
  },
  muslo: {
    key: 'muslo',
    title: 'Contorno de Muslo',
    landmark: 'Punto medio entre el pliegue inguinal y el borde superior de la rótula.',
    instruction:
      'Ponte de pie con el peso distribuido por igual. Mide en el punto medio entre el pliegue inguinal y la parte superior de la rótula.',
    tip: 'Relaja los cuádriceps sin poner el músculo en tensión isométrica.',
    icon: '🦵',
  },
  brazo: {
    key: 'brazo',
    title: 'Contorno de Brazo (Bíceps)',
    landmark: 'Punto medio entre el acromion y el olécranon (máximo grosor del bíceps).',
    instruction:
      'Con el brazo relajado a lo largo del cuerpo o en ligera flexión de 90°, mide en la zona de mayor grosor del bíceps.',
    tip: 'Mide preferentemente el mismo brazo siempre (generalmente el brazo dominante).',
    icon: '💪',
  },
};

export interface PerimeterComparison {
  key: string;
  label: string;
  initial?: number;
  latest?: number;
  diff?: number;
  unit: string;
  isPositiveChange: boolean; // favorable according to clinical recomposition goals
  changeLabel: string;
}

export interface FocusZoneRecommendation {
  zone: BodyFocusZone;
  label: string;
  targetMuscle: string;
  biomechanicSafetyTip: string;
}

export interface RecompositionAnalysis {
  status: 'optima' | 'deficit_favorable' | 'hipertrofia' | 'mantenimiento' | 'inicial';
  statusTitle: string;
  statusBadge: string;
  badgeBg: string;
  badgeText: string;
  summaryMessage: string;
  crossEvaluationDetail: string;
  perimetersComparison: {
    weight?: PerimeterComparison;
    waist?: PerimeterComparison;
    chest?: PerimeterComparison;
    shoulders?: PerimeterComparison;
    arm?: PerimeterComparison;
    hip?: PerimeterComparison;
    thigh?: PerimeterComparison;
  };
  hasEnoughData: boolean;
  biomechanicAdvice: string[];
  focusZonesAdvice: FocusZoneRecommendation[];
}

export function calculateBodyRecompositionAnalysis(params: {
  records: AnthropometricRecord[];
  bodyGoals?: BodyGoals;
  discomfortZones?: (string | JointDiscomfortZone)[];
}): RecompositionAnalysis {
  const { records, bodyGoals } = params;
  const primaryGoal = bodyGoals?.primaryGoal || 'recomposicion';
  const focusZones = bodyGoals?.focusZones && bodyGoals.focusZones.length > 0
    ? bodyGoals.focusZones
    : (['cintura', 'hombros', 'gluteos'] as BodyFocusZone[]);

  // Ordenar cronológicamente (más antiguo al más reciente)
  const sorted = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const first = sorted[0];
  const latest = sorted[sorted.length - 1];

  const calcDiff = (vLatest?: number, vFirst?: number) => {
    if (vLatest === undefined || vFirst === undefined) return undefined;
    return Math.round((vLatest - vFirst) * 10) / 10;
  };

  const diffWeight = calcDiff(latest?.weightKg, first?.weightKg);
  const diffWaist = calcDiff(latest?.waistCm, first?.waistCm);
  const diffChest = calcDiff(latest?.chestCm, first?.chestCm);
  const diffShoulders = calcDiff(latest?.shouldersCm, first?.shouldersCm);
  const diffArm = calcDiff(latest?.armCm, first?.armCm);
  const diffHip = calcDiff(latest?.hipCm, first?.hipCm);
  const diffThigh = calcDiff(latest?.thighCm, first?.thighCm);

  const makeComparison = (
    key: string,
    label: string,
    initial?: number,
    latestVal?: number,
    diff?: number,
    isWaist = false
  ): PerimeterComparison => {
    let isPositive = false;
    let changeLabel = 'Sin cambios';

    if (diff !== undefined) {
      if (diff > 0) {
        changeLabel = `+${diff} cm`;
        // Para cintura, subir suele ser desfavorable en recomposición
        isPositive = isWaist ? false : true;
      } else if (diff < 0) {
        changeLabel = `${diff} cm`;
        // Para cintura, bajar es favorable
        isPositive = isWaist ? true : primaryGoal === 'perdida_grasa';
      } else {
        changeLabel = '0.0 cm';
        isPositive = true; // Mantener perímetro muscular es favorable
      }
    }

    return {
      key,
      label,
      initial,
      latest: latestVal,
      diff,
      unit: key === 'weight' ? 'kg' : 'cm',
      isPositiveChange: isPositive,
      changeLabel:
        key === 'weight' && diff !== undefined
          ? diff > 0
            ? `+${diff} kg`
            : `${diff} kg`
          : changeLabel,
    };
  };

  const perimetersComparison = {
    weight: makeComparison('weight', 'Peso', first?.weightKg, latest?.weightKg, diffWeight),
    waist: makeComparison('waist', 'Cintura', first?.waistCm, latest?.waistCm, diffWaist, true),
    chest: makeComparison('chest', 'Pecho', first?.chestCm, latest?.chestCm, diffChest),
    shoulders: makeComparison(
      'shoulders',
      'Hombros',
      first?.shouldersCm,
      latest?.shouldersCm,
      diffShoulders
    ),
    arm: makeComparison('arm', 'Brazo', first?.armCm, latest?.armCm, diffArm),
    hip: makeComparison('hip', 'Cadera', first?.hipCm, latest?.hipCm, diffHip),
    thigh: makeComparison('thigh', 'Muslo', first?.thighCm, latest?.thighCm, diffThigh),
  };

  const hasEnoughData = sorted.length >= 2;

  // Evaluación cruzada de recomposición
  let status: 'optima' | 'deficit_favorable' | 'hipertrofia' | 'mantenimiento' | 'inicial' =
    'inicial';
  let statusTitle = 'Línea Base Registrada';
  let statusBadge = 'Referencia Inicial';
  let badgeBg = 'bg-[#E7F3EC]';
  let badgeText = 'text-[#0F5238]';
  let summaryMessage =
    'Se ha registrado tu punto de partida antropométrico. En los próximos controles semanales, el sistema cruzará tus medidas de cintura con las de pecho, hombros y brazos para cuantificar la recomposición funcional.';
  let crossEvaluationDetail =
    'Objetivo actual: ' +
    (primaryGoal === 'recomposicion'
      ? 'Recomposición corporal (ganar músculo y perder grasa a la vez).'
      : primaryGoal === 'ganancia_muscular'
      ? 'Ganancia muscular e hipertrofia funcional.'
      : primaryGoal === 'perdida_grasa'
      ? 'Pérdida de grasa con preservación muscular.'
      : 'Salud y protección articular integral.');

  if (hasEnoughData) {
    const waistDecreased = diffWaist !== undefined && diffWaist <= -0.4;
    const waistStable = diffWaist !== undefined && Math.abs(diffWaist) < 0.4;
    const waistIncreased = diffWaist !== undefined && diffWaist >= 0.5;

    const upperBodyGrewOrPreserved =
      (diffArm !== undefined && diffArm >= -0.1) ||
      (diffChest !== undefined && diffChest >= -0.2) ||
      (diffShoulders !== undefined && diffShoulders >= -0.2);

    const upperBodyDecreased =
      (diffArm !== undefined && diffArm < -0.3) ||
      (diffChest !== undefined && diffChest < -0.5);

    if (waistDecreased && upperBodyGrewOrPreserved) {
      status = 'optima';
      statusTitle = 'Recomposición Corporal Óptima';
      statusBadge = 'Recomposición Activa ⭐';
      badgeBg = 'bg-[#E7F3EC]';
      badgeText = 'text-[#0F5238]';
      summaryMessage =
        '¡Excelente evolución biomecánica! Tu cintura ha descendido mientras que tus contornos de torso y brazos se han mantenido o aumentado. Esto confirma una pérdida selectiva de grasa visceral y subcutánea con ganancia o preservación activa de masa muscular magra.';
      crossEvaluationDetail = `Cintura: ${diffWaist} cm | Brazo: ${
        diffArm !== undefined ? (diffArm > 0 ? `+${diffArm}` : `${diffArm}`) : 'estable'
      } cm | Pecho: ${
        diffChest !== undefined ? (diffChest > 0 ? `+${diffChest}` : `${diffChest}`) : 'estable'
      } cm. La báscula tradicional no refleja este cambio, pero tu estructura anatómica es ahora más densa, fuerte y metabólicamente eficiente.`;
    } else if (waistDecreased && upperBodyDecreased) {
      status = 'deficit_favorable';
      statusTitle = 'Reducción General y Pérdida de Volumen';
      statusBadge = 'Déficit Favorable';
      badgeBg = 'bg-[#EBF3FA]';
      badgeText = 'text-[#1D6FA5]';
      summaryMessage =
        'Estás reduciendo volumen general y grasa abdominal. Para maximizar la preservación muscular, asegúrate de mantener una ingesta de proteína de calidad y aplicar suficiente intensidad en tus ejercicios de fuerza sin impacto.';
      crossEvaluationDetail = `Descenso de cintura de ${diffWaist} cm junto con una ligera reducción global. Todo marcha según lo previsto para una fase de afinamiento progresivo.`;
    } else if ((waistStable || waistDecreased) && (diffArm !== undefined && diffArm >= 0.3 || diffChest !== undefined && diffChest >= 0.4 || diffShoulders !== undefined && diffShoulders >= 0.4)) {
      status = 'hipertrofia';
      statusTitle = 'Hipertrofia Funcional Activa';
      statusBadge = 'Ganancia Magra';
      badgeBg = 'bg-[#F2EFFE]';
      badgeText = 'text-[#5E35B1]';
      summaryMessage =
        'Estás experimentando un claro desarrollo muscular en los segmentos clave sin acumular grasa en la zona media abdominal. Tus fibras musculares están aumentando su densidad e hidratación celular.';
      crossEvaluationDetail = `Aumento de masa en tren superior manteniendo un control óptimo de la cintura. Gran estímulo neuromuscular.`;
    } else if (waistIncreased) {
      status = 'mantenimiento';
      statusTitle = 'Ajuste de Carga y Densidad Nutricional';
      statusBadge = 'En Seguimiento';
      badgeBg = 'bg-[#FFF6ED]';
      badgeText = 'text-[#8E4E14]';
      summaryMessage =
        'Se detecta un ligero incremento en el perímetro de cintura. Recomendamos revisar la calidad de los descansos, la hidratación y el balance calórico para reenfocar la reducción hacia la zona media.';
      crossEvaluationDetail = `Variación de cintura (+${diffWaist} cm). Continuaremos monitorizando en el siguiente microciclo.`;
    } else {
      status = 'mantenimiento';
      statusTitle = 'Estabilidad y Consolidación Neuromuscular';
      statusBadge = 'Consolidación';
      badgeBg = 'bg-[#F3F4F5]';
      badgeText = 'text-[#4A5568]';
      summaryMessage =
        'Tus perímetros se mantienen estables. Esta meseta adaptativa es fundamental para asentar las adaptaciones neurales y de los tejidos conectivos antes de un nuevo salto de progreso.';
      crossEvaluationDetail = 'Perímetros equilibrados. Perfecto para incrementar de forma segura el volumen o la tensión mecánica.';
    }
  }

  // Recomendaciones biomecánicas por zonas de foco
  const focusZoneDict: Record<
    BodyFocusZone,
    { label: string; targetMuscle: string; biomechanicSafetyTip: string }
  > = {
    hombros: {
      label: 'Hombros y Escápulas',
      targetMuscle: 'Deltoides medio y posterior, retractores escapulares',
      biomechanicSafetyTip:
        'Ejecuta elevaciones laterales en el plano escapular (30° adelantado respecto al plano frontal) y rotaciones externas con banda elástica. Evita abducciones completas por encima de 90° para salvaguardar el manguito rotador y el espacio subacromial.',
    },
    pecho: {
      label: 'Pecho y Cintura Escapular',
      targetMuscle: 'Pectoral mayor y estabilizadores torácicos',
      biomechanicSafetyTip:
        'En flexiones o press con mancuernas, mantén los codos en ángulo de 45° a 60° respecto al tronco (forma de flecha, nunca en "T" a 90°). Esto elimina la cizalla en la articulación glenohumeral y maximiza el reclutamiento de fibras pectorales.',
    },
    brazos: {
      label: 'Brazos (Bíceps y Tríceps)',
      targetMuscle: 'Bíceps braquial, braquial anterior y tríceps',
      biomechanicSafetyTip:
        'Mantén la muñeca en posición neutra durante curls y extensiones para no tensionar los tendones epitrocleares y epicondíleos. Fija el codo en el espacio sin balancear el torso para aislar el trabajo muscular sin tirones lumbares.',
    },
    cintura: {
      label: 'Cintura y Corsé Lumbo-Pélvico',
      targetMuscle: 'Transverso del abdomen, oblicuos y cuadrado lumbar',
      biomechanicSafetyTip:
        'Prioriza patrones de anti-rotación y estabilidad isométrica (Bird-Dog, plancha corta asistida, Press Pallof). Crean un efecto faja natural que compacta el perímetro de cintura sin sobrecargar los discos intervertebrales con flexiones repetitivas.',
    },
    gluteos: {
      label: 'Glúteos y Complejo Pélvico',
      targetMuscle: 'Glúteo mayor, glúteo medio y rotadores profundos',
      biomechanicSafetyTip:
        'En puentes de glúteo y empujes de cadera, bloquea la pelvis con una ligera retroversión en el punto de máxima contracción. Empuja con los talones y no hiperextiendas la columna lumbar para dirigir el estímulo al vientre muscular.',
    },
    piernas: {
      label: 'Piernas y Muslos Funcionales',
      targetMuscle: 'Cuádriceps, isquiosurales y aductores',
      biomechanicSafetyTip:
        'En sentadillas a caja o zancadas estáticas, mantén la tibia lo más vertical posible y la rodilla alineada con el segundo dedo del pie. Evita el valgo dinámico (que la rodilla colapse hacia dentro) para proteger el cartílago femororrotuliano.',
    },
  };

  const focusZonesAdvice: FocusZoneRecommendation[] = focusZones.map((z) => ({
    zone: z,
    ...focusZoneDict[z],
  }));

  const biomechanicAdvice: string[] = [
    'En una recomposición, el peso corporal en la báscula puede mantenerse estático mientras tu silueta se estiliza y compacta notablemente.',
    'La reducción de perímetro en cintura (-cm) combinada con el mantenimiento o incremento en hombros/pecho/brazos es el indicador más fiable de pérdida de grasa visceral y aumento de masa activa magra.',
  ];

  return {
    status,
    statusTitle,
    statusBadge,
    badgeBg,
    badgeText,
    summaryMessage,
    crossEvaluationDetail,
    perimetersComparison,
    hasEnoughData,
    biomechanicAdvice,
    focusZonesAdvice,
  };
}

export interface ClinicalPerimeterRow {
  parameter: string;
  initial: string;
  current: string;
  delta: string;
  clinicalCriterion: string;
  isFavorable: boolean;
}

export interface BodyRecompositionMetrics {
  firstRecord?: AnthropometricRecord;
  latestRecord?: AnthropometricRecord;
  hasEnoughData: boolean;
  deltaWeightKg?: number;
  deltaWaistCm?: number;
  deltaChestCm?: number;
  deltaShouldersCm?: number;
  deltaArmCm?: number;
  deltaHipCm?: number;
  deltaThighCm?: number;
  waistHipRatio?: number;
  waistHipRisk?: 'bajo' | 'moderado' | 'alto';
  isFavorableRecomposition: boolean;
  status: 'optima' | 'deficit_favorable' | 'hipertrofia' | 'mantenimiento' | 'inicial';
  diagnosticTitle: string;
  diagnosticSummary: string;
  clinicalExplanation: string;
  comparisonTable: ClinicalPerimeterRow[];
}

/**
 * Función utilitaria clínica para calcular métricas de recomposición corporal
 * Compara el primer registro antropométrico contra el último disponible,
 * calcula las variaciones (Δ) y diagnostica si existe una "Recomposición Corporal Favorable".
 */
export function calculateBodyRecompositionMetrics(
  records: AnthropometricRecord[],
  bodyGoals?: BodyGoals,
  sex: BiologicalSex | string = 'Mujer'
): BodyRecompositionMetrics {
  const sorted = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const first = sorted[0];
  const latest = sorted[sorted.length - 1];
  const hasEnoughData = sorted.length >= 2;

  const round1 = (val?: number) =>
    val !== undefined ? Math.round(val * 10) / 10 : undefined;
  const calcDelta = (cur?: number, init?: number) => {
    if (cur === undefined || init === undefined) return undefined;
    return Math.round((cur - init) * 10) / 10;
  };

  const deltaWeightKg = calcDelta(latest?.weightKg, first?.weightKg);
  const deltaWaistCm = calcDelta(latest?.waistCm, first?.waistCm);
  const deltaChestCm = calcDelta(latest?.chestCm, first?.chestCm);
  const deltaShouldersCm = calcDelta(latest?.shouldersCm, first?.shouldersCm);
  const deltaArmCm = calcDelta(latest?.armCm, first?.armCm);
  const deltaHipCm = calcDelta(latest?.hipCm, first?.hipCm);
  const deltaThighCm = calcDelta(latest?.thighCm, first?.thighCm);

  // Ratio Cintura / Cadera en la última medición
  let waistHipRatio: number | undefined = undefined;
  let waistHipRisk: 'bajo' | 'moderado' | 'alto' | undefined = undefined;
  if (latest?.waistCm && latest?.hipCm && latest.hipCm > 0) {
    waistHipRatio = Math.round((latest.waistCm / latest.hipCm) * 100) / 100;
    if (sex === 'Hombre') {
      if (waistHipRatio < 0.9) waistHipRisk = 'bajo';
      else if (waistHipRatio <= 0.95) waistHipRisk = 'moderado';
      else waistHipRisk = 'alto';
    } else {
      if (waistHipRatio < 0.8) waistHipRisk = 'bajo';
      else if (waistHipRatio <= 0.85) waistHipRisk = 'moderado';
      else waistHipRisk = 'alto';
    }
  }

  // Criterio Clínico de Recomposición Favorable:
  // Reducción de cintura (grasa visceral) junto con preservación o incremento en segmentos periféricos (muslo, brazo, pecho, hombro).
  const isWaistReduced = deltaWaistCm !== undefined && deltaWaistCm < 0;
  const isWaistControlled = deltaWaistCm !== undefined && deltaWaistCm <= 0.3;
  const isMusclePreservedOrGrown =
    (deltaArmCm !== undefined && deltaArmCm >= -0.2) ||
    (deltaThighCm !== undefined && deltaThighCm >= -0.2) ||
    (deltaChestCm !== undefined && deltaChestCm >= -0.3) ||
    (deltaShouldersCm !== undefined && deltaShouldersCm >= -0.3);

  const isFavorableRecomposition =
    hasEnoughData &&
    ((isWaistReduced && isMusclePreservedOrGrown) ||
      (isWaistControlled &&
        ((deltaArmCm !== undefined && deltaArmCm > 0) ||
          (deltaThighCm !== undefined && deltaThighCm > 0) ||
          (deltaChestCm !== undefined && deltaChestCm > 0))));

  // Estado y diagnósticos clínicos
  let status: 'optima' | 'deficit_favorable' | 'hipertrofia' | 'mantenimiento' | 'inicial' = 'inicial';
  let diagnosticTitle = 'Línea Base Antropométrica Registrada';
  let diagnosticSummary =
    'Punto de partida registrado. Conforme se registren nuevos controles, el motor biomédico correlacionará la circunferencia umbilical contra la masa apendicular.';
  let clinicalExplanation =
    'Evaluación inicial completa. El seguimiento continuo permitirá discriminar entre pérdida hídrica/muscular y auténtica recomposición favorable libre de catabolismo.';

  if (hasEnoughData) {
    if (isFavorableRecomposition) {
      status = 'optima';
      diagnosticTitle = 'Recomposición Corporal Favorable Demostrada';
      diagnosticSummary =
        'Reducción de perímetro de cintura y grasa visceral con mantenimiento o incremento en segmentos de muslo, brazo o torso.';
      clinicalExplanation = `Se constata un proceso de recomposición tisular metabólicamente eficiente: el descenso de perímetro umbilical (${
        deltaWaistCm !== undefined ? `${deltaWaistCm} cm` : '--'
      }) confirma menor adiposidad intraabdominal y descompresión lumbar/patelar, mientras que los perímetros periféricos (${
        deltaArmCm !== undefined ? `Brazo: ${deltaArmCm > 0 ? `+${deltaArmCm}` : deltaArmCm} cm` : ''
      }${
        deltaThighCm !== undefined ? ` | Muslo: ${deltaThighCm > 0 ? `+${deltaThighCm}` : deltaThighCm} cm` : ''
      }) ratifican la preservación de la masa contráctil y protección contra la sarcopenia.`;
    } else if (isWaistReduced) {
      status = 'deficit_favorable';
      diagnosticTitle = 'Reducción Ponderal y Visceral con Déficit Moderado';
      diagnosticSummary =
        'Descenso de cintura con leve reducción volumétrica global. Indicado para fases de alivio articular.';
      clinicalExplanation = `Disminución de perímetro de cintura (${deltaWaistCm} cm). Se recomienda priorizar la intensidad de fuerza sin impacto y el aporte proteico para consolidar el tejido magro.`;
    } else if (isWaistControlled && (deltaArmCm || 0) > 0.3) {
      status = 'hipertrofia';
      diagnosticTitle = 'Hipertrofia Funcional sin Acumulación Visceral';
      diagnosticSummary =
        'Incremento en contornos musculares del tren superior conservando el perímetro umbilical estable.';
      clinicalExplanation =
        'Ganancia de densidad miofibrilar y volumen funcional sin elevación del riesgo cardiometabólico.';
    } else {
      status = 'mantenimiento';
      diagnosticTitle = 'Consolidación Tisular y Meseta Adaptativa';
      diagnosticSummary =
        'Medidas estables en el intervalo de control. Los tejidos conectivos y neuromusculares se adaptan antes de una nueva fase.';
      clinicalExplanation =
        'Perímetros estables sin fluctuaciones lesivas. Momento idóneo para ajustar gradualmente la tensión mecánica de los ejercicios sin impacto.';
    }
  }

  // Generación de la tabla comparativa estructurada
  const formatVal = (v?: number, unit = 'cm') => (v !== undefined ? `${round1(v)} ${unit}` : '--');
  const formatDelta = (d?: number, unit = 'cm') => {
    if (d === undefined) return '--';
    if (d > 0) return `+${round1(d)} ${unit}`;
    if (d === 0) return `0.0 ${unit}`;
    return `${round1(d)} ${unit}`;
  };

  const comparisonTable: ClinicalPerimeterRow[] = [
    {
      parameter: 'Peso Corporal (kg)',
      initial: formatVal(first?.weightKg, 'kg'),
      current: formatVal(latest?.weightKg, 'kg'),
      delta: formatDelta(deltaWeightKg, 'kg'),
      clinicalCriterion:
        deltaWeightKg !== undefined && deltaWeightKg < 0
          ? 'Reducción de sobrecarga mecánica articular (3-4 kg de alivio por cada kg perdido)'
          : 'Mantenimiento o incremento controlado en rango funcional',
      isFavorable: deltaWeightKg !== undefined ? deltaWeightKg <= 0 : true,
    },
    {
      parameter: 'Índice de Masa Corporal (IMC)',
      initial: first?.bmi ? `${first.bmi} kg/m²` : '--',
      current: latest?.bmi ? `${latest.bmi} kg/m²` : '--',
      delta:
        first?.bmi && latest?.bmi
          ? formatDelta(Math.round((latest.bmi - first.bmi) * 10) / 10, 'kg/m²')
          : '--',
      clinicalCriterion:
        latest?.bmiCategory === 'normopeso'
          ? 'Rango estándar de salud óptima según criterios de la OMS'
          : latest?.bmiCategory === 'sobrepeso'
          ? 'Sobrepeso: foco en activación metabólica y protección articular estricta'
          : latest?.bmiCategory === 'obesidad'
          ? 'Obesidad: prescripción de impacto ZERO obligatoria'
          : 'Bajo peso: foco en recuperación de masa muscular magra',
      isFavorable: latest?.bmiCategory === 'normopeso' || (first?.bmi && latest?.bmi ? latest.bmi <= first.bmi : true),
    },
    {
      parameter: 'Perímetro de Cintura (cm) [Umbilical]',
      initial: formatVal(first?.waistCm),
      current: formatVal(latest?.waistCm),
      delta: formatDelta(deltaWaistCm),
      clinicalCriterion:
        'Biomarcador directo de grasa visceral y riesgo cardiometabólico. Descomprime discos L4-L5.',
      isFavorable: deltaWaistCm !== undefined ? deltaWaistCm <= 0 : true,
    },
    {
      parameter: 'Perímetro de Cadera (cm) [Trocánter mayor]',
      initial: formatVal(first?.hipCm),
      current: formatVal(latest?.hipCm),
      delta: formatDelta(deltaHipCm),
      clinicalCriterion:
        'Referencia pélvica para el cálculo del Ratio Cintura-Cadera y masa glútea.',
      isFavorable: true,
    },
    {
      parameter: 'Ratio Cintura / Cadera (ICC)',
      initial:
        first?.waistCm && first?.hipCm
          ? (Math.round((first.waistCm / first.hipCm) * 100) / 100).toFixed(2)
          : '--',
      current: waistHipRatio ? waistHipRatio.toFixed(2) : '--',
      delta:
        first?.waistCm && first?.hipCm && waistHipRatio
          ? formatDelta(
              Math.round((waistHipRatio - first.waistCm / first.hipCm) * 100) / 100,
              ''
            )
          : '--',
      clinicalCriterion:
        waistHipRisk === 'bajo'
          ? 'Riesgo cardiometabólico bajo (<0.80 mujeres / <0.90 hombres, OMS)'
          : waistHipRisk === 'moderado'
          ? 'Riesgo moderado: objetivo de reducción gradual del perímetro visceral'
          : 'Riesgo aumentado: prioridad en descompresión abdominal',
      isFavorable: waistHipRisk === 'bajo' || waistHipRisk === 'moderado',
    },
    {
      parameter: 'Perímetro de Pecho / Torso (cm)',
      initial: formatVal(first?.chestCm),
      current: formatVal(latest?.chestCm),
      delta: formatDelta(deltaChestCm),
      clinicalCriterion:
        'Tono de la musculatura respiratoria, pectoral y estabilizadores torácicos.',
      isFavorable: deltaChestCm !== undefined ? deltaChestCm >= -0.3 : true,
    },
    {
      parameter: 'Perímetro de Hombros (cm) [Deltoides medio]',
      initial: formatVal(first?.shouldersCm),
      current: formatVal(latest?.shouldersCm),
      delta: formatDelta(deltaShouldersCm),
      clinicalCriterion:
        'Fuerza del complejo acromioclavicular y salud del manguito rotador.',
      isFavorable: deltaShouldersCm !== undefined ? deltaShouldersCm >= -0.3 : true,
    },
    {
      parameter: 'Perímetro de Brazo (cm) [Bíceps braquial]',
      initial: formatVal(first?.armCm),
      current: formatVal(latest?.armCm),
      delta: formatDelta(deltaArmCm),
      clinicalCriterion:
        'Biomarcador de masa muscular apendicular; preservación activa contra sarcopenia.',
      isFavorable: deltaArmCm !== undefined ? deltaArmCm >= -0.2 : true,
    },
    {
      parameter: 'Perímetro de Muslo (cm) [Cuádriceps medio]',
      initial: formatVal(first?.thighCm),
      current: formatVal(latest?.thighCm),
      delta: formatDelta(deltaThighCm),
      clinicalCriterion:
        'Reserva muscular de tren inferior esencial para deambulación y estabilidad rotuliana.',
      isFavorable: deltaThighCm !== undefined ? deltaThighCm >= -0.2 : true,
    },
  ];

  return {
    firstRecord: first,
    latestRecord: latest,
    hasEnoughData,
    deltaWeightKg,
    deltaWaistCm,
    deltaChestCm,
    deltaShouldersCm,
    deltaArmCm,
    deltaHipCm,
    deltaThighCm,
    waistHipRatio,
    waistHipRisk,
    isFavorableRecomposition,
    status,
    diagnosticTitle,
    diagnosticSummary,
    clinicalExplanation,
    comparisonTable,
  };
}
