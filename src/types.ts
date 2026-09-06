/**
 * AdaptFit - Core Domain Types & Models
 * Comprehensive TypeScript models for adaptive, safe, and progressive physical rehabilitation.
 */

// ==========================================
// 1. PERFIL DE USUARIO Y EVALUACIÓN CLÍNICA
// ==========================================

export type JointDiscomfortZone =
  | 'rodillas'
  | 'espalda_lumbar'
  | 'hombros'
  | 'cuello'
  | 'cadera'
  | 'munecas'
  | 'ninguna';

export interface DiscomfortZoneOption {
  id: JointDiscomfortZone;
  label: string;
}

export type MobilityLevelId =
  | 'silla_cama' // Movilidad muy reducida / Silla / Cama
  | 'cero_impacto' // Cero impacto articular
  | 'pie_asistido' // De pie asistido (legacy)
  | 'funcional_suave' // Funcional suave / Principiante
  | 'general_suave' // General suave (legacy)
  | 'saludable_estandar' // Saludable estándar (Fuerza media / Pérdida de peso activa)
  | 'avanzado_fuerza'; // Avanzado / Ponerse fuerte (Hipertrofia, sobrecarga progresiva, alta intensidad)

export interface MobilityLevelOption {
  id: MobilityLevelId;
  orderNumber: number;
  title: string;
  subtitle: string;
  iconName: 'Armchair' | 'Sprout' | 'UserCheck' | 'Zap' | 'Dumbbell' | 'Flame';
}

export type AvailableEquipmentId =
  | 'peso_corporal'
  | 'silla_firme'
  | 'pared_libre'
  | 'esterilla'
  | 'bandas_elasticas'
  | 'mancuernas';

export interface EquipmentOption {
  id: AvailableEquipmentId;
  label: string;
}

export type AvatarType = 'preset' | 'custom_photo';

export type BodyMeasurementZone = 'cintura' | 'cadera' | 'muslo' | 'brazo';

export interface TrackingPreferences {
  trackWeightBMI: boolean; // Peso e IMC
  trackBodyPerimeters: boolean; // Perímetros corporales (cintura, cadera, muslo, brazo)
  trackJointPain: boolean; // Registro de dolores/molestias articulares
  trackRpeEnergy: boolean; // RPE y nivel de energía
  trackRestAndVolume: boolean; // Tiempos de descanso / Volumen total levantado
}

export interface AnthropometricRecord {
  id: string;
  date: string; // Fecha ISO
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiCategory: 'bajo_peso' | 'normopeso' | 'sobrepeso' | 'obesidad';
  waistCm?: number; // Contorno de Cintura
  hipCm?: number; // Contorno de Cadera
  thighCm?: number; // Contorno de Muslo
  armCm?: number; // Contorno de Brazo
  notes?: string;
}

export type BiologicalSex = 'Mujer' | 'Hombre';

export type FitnessLevel = 'Iniciación / Recuperación' | 'Moderado' | 'Activo habitual';

export type HealthCondition =
  | 'Molestia en rodillas'
  | 'Molestia lumbar (espalda baja)'
  | 'Molestia lumbar'
  | 'Molestia en hombros / cuello'
  | 'Molestia en hombros/cuello'
  | 'Molestia o limitación en cadera'
  | 'Problemas de equilibrio'
  | 'Ninguna molestia'
  | 'Ninguna';

export type EquipmentAvailableChoice =
  | 'Solo peso corporal y silla'
  | 'Bandas elásticas'
  | 'Mancuernas / Pesos';

export type DumbbellType = 'fijas' | 'ajustables_discos' | 'peso_corporal_solamente';

export interface UserProfile {
  name: string;
  avatarType: AvatarType;
  avatarValue: string; // URL en Base64 de foto subida o identificador de avatar predeterminado
  biologicalSex?: BiologicalSex; // "Mujer" | "Hombre" (ajusta consideraciones biomecánicas y estabilidad pélvica/rodilla)
  fitnessLevel?: FitnessLevel; // "Iniciación / Recuperación" | "Moderado" | "Activo habitual"
  healthConditions?: HealthCondition[]; // "Molestia lumbar" | "Molestia en rodillas" | "Molestia en hombros/cuello" | "Problemas de equilibrio" | "Ninguna"
  equipmentAvailable?: EquipmentAvailableChoice; // "Solo peso corporal y silla" | "Bandas elásticas" | "Mancuernas / Pesos"
  dumbbellType?: DumbbellType; // 'fijas' | 'ajustables_discos' | 'peso_corporal_solamente'
  availableWeightsKg?: number[]; // ej. [1, 1.5, 2, 3, 4, 5]
  heightCm?: number; // Altura en cm
  weightKg?: number; // Peso inicial o actual en kg
  discomfortZones: JointDiscomfortZone[];
  mobilityLevel: MobilityLevelId;
  availableEquipment: AvailableEquipmentId[];
  completedOnboarding: boolean;
  onboardingStep: number; // 0: Bienvenida y Perfil, 1: Limitaciones Clínicas, 2: Macrociclo 12 Meses
  createdAt: string;
  trackingPreferences?: TrackingPreferences;
}

// ==========================================
// 2. MACROCICLO DE 12 MESES & META ANUAL
// ==========================================

export type MacroCycleGoalId =
  | 'salud_metabolica'
  | 'composicion_corporal'
  | 'reto_funcional'
  | 'habito_sin_dolor';

export interface MacroCycleGoalOption {
  id: MacroCycleGoalId;
  title: string;
  description: string;
  iconType: 'Heart' | 'Dumbbell' | 'Stairs' | 'Activity';
  badgeColorClass: string;
}

export type WorkoutFrequencyDays = 2 | 3 | 4 | 5 | 6;
export type SessionDurationMinutes = 15 | 20 | 30 | 45;

export type DayOfWeek =
  | 'Lunes'
  | 'Martes'
  | 'Miércoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sábado'
  | 'Domingo';

export interface ViabilityAssessment {
  daysPerWeek: WorkoutFrequencyDays;
  minutesPerSession: SessionDurationMinutes;
  monthlyHours: number;
  adherencePercentage: number;
  title: string;
  badgeType: 'ideal' | 'intenso' | 'minimalista';
  description: string;
  recommendationNote: string;
}

export interface QuarterlyPhase {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  title: string;
  subtitle: string;
  monthsRange: string;
  accentColor: string; // Tailored color badge
  description: string;
}

export interface AnnualMacroCyclePlan {
  goalId: MacroCycleGoalId;
  daysPerWeek: WorkoutFrequencyDays;
  selectedDays: DayOfWeek[];
  minutesPerSession: SessionDurationMinutes;
  phases: QuarterlyPhase[];
  updatedAt: string;
}

// ==========================================
// 3. BASE DE DATOS DE EJERCICIOS Y PEDAGOGÍA
// ==========================================

export type MovementPattern =
  | 'empuje_horizontal'
  | 'empuje_vertical'
  | 'traccion_horizontal'
  | 'traccion_vertical'
  | 'dominante_rodilla'
  | 'bisagra_cadera'
  | 'core_anti_extension'
  | 'core_anti_rotacion'
  | 'estabilidad_escapular'
  | 'pantorrillas_tobillo';

export type ImpactLevel = 'ZERO' | 'LOW' | 'HIGH';

export type BiomechanicalLevel =
  | 'terapeutico_silla'
  | 'cero_impacto_suave'
  | 'medio_perdida_peso'
  | 'avanzado_fuerza';

export interface ExerciseStep {
  stepIndex: number; // 0, 1, 2, 3
  stepShortName: string; // "Postura", "Bajar", "Subir", "Respirar"
  title: string;
  description: string;
  visualAlt: string;
  previewUrl: string;
}

export interface ExerciseStepVisual {
  stepNumber: 0 | 1 | 2 | 3;
  title: string; // ej. "Paso 0: Colocación", "Paso 1: Descenso controlado"
  instructionText: string;
  // SVG anatómico vectorial / Ilustración renderizada limpia en código:
  illustrationType: 'svg_diagram' | 'vector_art';
  // Puntos clave visuales que deben destacarse en la imagen:
  visualFocusPoints: string[]; // ej. ["Espalda recta", "Rodillas alineadas con la punta del pie", "Talones pegados al suelo"]
  // Flechas o indicadores de vector en la ilustración:
  vectorArrows?: { direction: 'down' | 'up' | 'forward' | 'backward'; label: string };
  // Ilustración en SVG interactivo o URL de ilustración específica:
  svgAssetId: string;
}

export interface ExerciseAlternative {
  id: string;
  title: string;
  subtitle: string;
  benefitBadge: string;
  iconType: 'chair' | 'bed' | 'wall' | 'cushion';
  reason: string;
}

export interface Exercise {
  id: string;
  title: string;
  subtitle: string;
  block: 'calentamiento' | 'principal' | 'vuelta_a_la_calma';
  orderInBlock: number;
  totalInBlock: number;
  durationSeconds: number;
  isKneeSafe: boolean;
  requiredEquipment: AvailableEquipmentId[];
  targetMuscles: string[];
  sensoryMapping: string; // Ex: "Debes notarlo en cuádriceps y glúteos. Cero tensión en la zona lumbar."
  avoidError: {
    title: string; // "Evita esto (Mal)"
    description: string;
  };
  correctAction: {
    title: string; // "Haz esto (Bien)"
    description: string;
  };
  steps: ExerciseStep[];
  alternatives: ExerciseAlternative[];
  // Coherencia visual e ilustraciones pedagógicas paso a paso
  mainCoverIllustration?: string; // Ilustración general del ejercicio completo
  adaptedCoverIllustration?: string; // Ilustración de la versión en silla / adaptada
  stepByStepVisuals?: ExerciseStepVisual[]; // Mínimo 4 pasos sincronizados (0, 1, 2, 3)
  name?: string;
  targetMuscleGroup?: string; // e.g. "Pectoral", "Cuádriceps", "Espalda", "Core", "Hombros", "Glúteos"
  singleReferenceImage?: string; // Una sola imagen de referencia o icono de la postura general
  setupStep0?: string; // Paso 0: Colocación inicial
  steps1To3?: string[]; // Pasos 1, 2 y 3 de ejecución
  // Extended fields for structural exercise catalog
  movementPattern?: MovementPattern;
  impactLevel?: ImpactLevel;
  biomechanicalLevel?: BiomechanicalLevel;
  contraindications?: JointDiscomfortZone[];
  adaptedAlternativeId?: string;
  whereToFeel?: string;
  commonMistakes?: string[];
  recommendedRepsOrTime?: string;
  restSeconds?: number;
}

// ==========================================
// 4. SESIÓN DE ENTRENAMIENTO ACTIVA
// ==========================================

export type WorkoutIntensityMode = 'adaptada' | 'estandar' | 'avanzada';

export type ExerciseExecutionPhase = 'PREPARATION' | 'SET_ACTIVE' | 'REST';

export interface ActiveWorkoutState {
  isSessionActive: boolean;
  routineTitle: string;
  sessionNumber: number; // e.g. 14
  totalSessionsYear: number; // e.g. 52
  currentBlock: 'calentamiento' | 'principal' | 'vuelta_a_la_calma';
  blockNumber: number; // e.g. 2
  totalBlocks: number; // e.g. 3
  exerciseIndex: number; // 0-based
  currentExercise: Exercise;
  workoutList: Exercise[];
  intensityMode: WorkoutIntensityMode;
  secondsRemaining: number;
  isPlaying: boolean;
  isAudioGuideActive: boolean;
  selectedStepIndex: number;
  isLowEnergySession: boolean;
  isBonusSession?: boolean;
  isPanicModalOpen: boolean;
  totalSessionTimeRemaining: string; // e.g. "12:45 restantes"
  // Motor de 3 series, descansos interactivos y fase de preparación previa:
  executionPhase: ExerciseExecutionPhase; // 'PREPARATION' | 'SET_ACTIVE' | 'REST'
  currentSet: number; // 1, 2, 3
  totalSets: number; // 3
  restSecondsRemaining: number; // e.g. 45 o 60
  configuredRestDuration: number; // 45 o 60 segundos
  // Registro de cargas (pesos en kg) y sobrecarga progresiva:
  currentSetRepsInput?: number;
  currentSetWeightKgInput?: number;
  recordedSets?: Record<string, ExerciseSetRecord[]>;
  // Protocolo de seguridad articular y botón de pánico
  safetyIncidents?: JointSafetyIncident[];
  isBreathingPauseActive?: boolean;
}

export type JointSafetyActionType =
  | 'sustituido_por_alternativa'
  | 'descartado_seguridad'
  | 'pausa_respiratoria';

export interface JointSafetyIncident {
  id: string;
  timestamp: string; // ISO string
  exerciseId: string;
  exerciseTitle: string;
  action: JointSafetyActionType;
  replacementExerciseId?: string;
  replacementExerciseTitle?: string;
  movementPattern?: MovementPattern | string;
  targetMuscleGroup?: string;
  reason: string;
  clinicalNote: string;
}

export interface ExerciseSetRecord {
  setNumber: 1 | 2 | 3;
  repsCompleted: number;
  weightUsedKg?: number; // Opcional, solo si el ejercicio usa peso
}

// ==========================================
// 5. REGISTRO POST-ENTRENO Y REVISIÓN CORPORAL
// ==========================================

export type RPEFeeling = 'light' | 'just_right' | 'challenging';

export type BodyDiscomfortCheck =
  | 'ninguna'
  | 'espalda_baja'
  | 'rodillas_piernas'
  | 'hombros_cuello';

export interface PostWorkoutCheckIn {
  rpe: RPEFeeling;
  discomforts: BodyDiscomfortCheck[];
  adaptiveCoachingFeedback: string;
  timestamp: string;
  completedRoutineId: string;
  repsOrWeightNote?: string;
  unexpectedDiscomfort?: boolean;
  discomfortNotes?: string;
}

export interface CompletedWorkoutExerciseRecord {
  id: string;
  name: string;
  movementPattern: MovementPattern | string;
  variantName?: string;
  workDurationSeconds: number;
  restSeconds?: number;
  repsOrVolume?: string;
  sets?: ExerciseSetRecord[];
}

export interface CompletedWorkout {
  id: string;
  routineTitle: string;
  timestamp: string; // ISO string
  durationMinutes: number;
  rpe: RPEFeeling;
  discomforts: BodyDiscomfortCheck[];
  isLowEnergy: boolean;
  isBonus: boolean;
  repsOrWeightNote?: string;
  volumeTotalKg?: number;
  unexpectedDiscomfort?: boolean;
  discomfortNotes?: string;
  exercisesCompleted?: CompletedWorkoutExerciseRecord[];
  safetyIncidents?: JointSafetyIncident[];
}

// ==========================================
// 6. RACHAS, ESCUDO DE DESCANSO Y CAMINO ANUAL
// ==========================================

export interface WeekDayConsistencyItem {
  dayLetter: 'L' | 'M' | 'X' | 'J' | 'V' | 'S' | 'D';
  status: 'completed' | 'rest' | 'today' | 'pending' | 'shielded';
  isToday: boolean;
}

export interface RestShield {
  isActive: boolean;
  daysRemaining: number;
  activatedAt?: string;
  reason: string;
}

export interface RoadStageNode {
  weekNumber: number;
  worldNumber: 1 | 2 | 3 | 4;
  title: string;
  status: 'completado' | 'en_curso' | 'bloqueado';
  isCurrent: boolean;
}

// ==========================================
// 7. LOGROS ("MURO DE VICTORIAS")
// ==========================================

export type AchievementCategory = 'Hito Destacado' | 'Constancia' | 'Bienestar';

export type AchievementVerificationType = 'automatic_data' | 'functional_test';

export interface FunctionalTestQuestion {
  id: string;
  achievementId: string;
  milestoneLabel: string; // e.g. "Hito Mes 1", "Hito Mes 3"
  questionText: string;
  yesLabel: string;
  noLabel: string;
  explanation: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: AchievementCategory;
  timeAgo: string; // e.g. "Ayer", "Hace 3 días", "Esta semana"
  description: string;
  verifiedByProgress: boolean;
  badgeIcon: 'Stairs' | 'Calendar' | 'Smile' | 'Trophy' | 'Zap' | 'Shield' | 'Sparkles';
  unlocked: boolean;
  verificationType: AchievementVerificationType;
  requirementDescription: string;
  currentMetricValue?: number;
  targetMetricValue?: number;
  metricUnit?: string;
  functionalQuestion?: FunctionalTestQuestion;
}

export interface ShareCardConfig {
  achievementTitle: string;
  achievementDescription: string;
  format: 'story' | 'chat'; // 'story' (9:16) o 'chat' (1:1)
}

// ==========================================
// 8. PROGRESO CLÍNICO Y CALENDARIO
// ==========================================

export interface ClinicalWeeklyMetric {
  weekLabel: string; // 'S1', 'S2', 'S3', 'S4'
  rpeAverage: number; // 1 to 10
  painLevel: number; // 0 to 10
  sessionsCount: number;
}

export interface CalendarDayRecord {
  dayOfMonth: number;
  status: 'completed' | 'planned' | 'rest' | 'inactive';
  hasSession: boolean;
}

export type ActiveTab = 'home' | 'workout' | 'progress' | 'settings';

export type ScreenId =
  | 'onboarding_welcome'
  | 'onboarding_limitations'
  | 'onboarding_macrocycle'
  | 'home'
  | 'low_energy'
  | 'workout_active'
  | 'exercise_pedagogy'
  | 'panic_replacement'
  | 'post_workout_feedback'
  | 'victory_wall'
  | 'share_achievement'
  | 'year_road'
  | 'rest_shield'
  | 'clinical_report'
  | 'calendar_sync'
  | 'exercise_library';
