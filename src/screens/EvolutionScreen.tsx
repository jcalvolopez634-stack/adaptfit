/**
 * AdaptFit - Pantalla de Evolución Visual (EvolutionScreen)
 * Panel 100% visual y analítico sin textos densos ni justificaciones repetitivas:
 * - 3 Tarjetas numéricas grandes: Sesiones totales, Minutos activos y Días de racha.
 * - Gráfico de barras: Frecuencia y sesiones completadas por semana.
 * - Gráfico de línea/tendencia: Evolución del Esfuerzo Percibido (RPE medio).
 * - Botón para descargar el Informe Clínico Completo (PDF/HTML) con detalles biomecánicos.
 */

import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  ArrowLeft,
  Clock,
  Flame,
  FileDown,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  Scale,
  Ruler,
  Plus,
  Minus,
  X,
  ShieldAlert,
  Heart,
  Target,
  HelpCircle,
  Dumbbell,
  Check,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { calculateBMI, MEASUREMENT_GUIDES } from '../utils/anthropometry';
import { BodyFocusZone, BodyRecompositionGoal } from '../types';

export const EvolutionScreen: React.FC = () => {
  const {
    completedWorkouts,
    annualPlan,
    streakDays,
    downloadClinicalReportPDF,
    goBack,
    userProfile,
    anthropometricRecords,
    addAnthropometricRecord,
    bodyCompositionAdvice,
    recompositionAnalysis,
    bodyRecompositionMetrics,
    updateBodyGoals,
  } = useApp();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showClinicalTable, setShowClinicalTable] = useState(false);

  // Tab State for Body Perimeters
  const [perimeterTab, setPerimeterTab] = useState<'tronco_brazos' | 'cintura_piernas'>('tronco_brazos');

  // Modal State for Measurement Guide
  const [activeGuideKey, setActiveGuideKey] = useState<string | null>(null);

  // Modal State for Anthropometric Registration
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState<'esenciales' | 'perimetros'>('esenciales');
  const [weightInput, setWeightInput] = useState<string>('');
  const [heightInput, setHeightInput] = useState<string>('');
  const [shouldersInput, setShouldersInput] = useState<string>('');
  const [chestInput, setChestInput] = useState<string>('');
  const [waistInput, setWaistInput] = useState<string>('');
  const [armInput, setArmInput] = useState<string>('');
  const [hipInput, setHipInput] = useState<string>('');
  const [thighInput, setThighInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  const [saveToast, setSaveToast] = useState(false);

  const adjustInput = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    current: string,
    delta: number,
    min = 0,
    max = 250
  ) => {
    const currentVal = parseFloat(current) || 0;
    const next = Math.max(min, Math.min(max, Math.round((currentVal + delta) * 10) / 10));
    setter(next > 0 ? String(next) : '');
  };

  const openRegisterModal = () => {
    const latest = anthropometricRecords[0];
    setWeightInput(
      latest?.weightKg
        ? String(latest.weightKg)
        : userProfile.weightKg
        ? String(userProfile.weightKg)
        : ''
    );
    setHeightInput(
      latest?.heightCm
        ? String(latest.heightCm)
        : userProfile.heightCm
        ? String(userProfile.heightCm)
        : '165'
    );
    setShouldersInput(latest?.shouldersCm ? String(latest.shouldersCm) : '');
    setChestInput(latest?.chestCm ? String(latest.chestCm) : '');
    setWaistInput(latest?.waistCm ? String(latest.waistCm) : '');
    setArmInput(latest?.armCm ? String(latest.armCm) : '');
    setHipInput(latest?.hipCm ? String(latest.hipCm) : '');
    setThighInput(latest?.thighCm ? String(latest.thighCm) : '');
    setNotesInput('');
    setModalSection('esenciales');
    setIsModalOpen(true);
  };

  // Real-time live BMI inside modal
  const liveWeightNum = parseFloat(weightInput);
  const liveHeightNum = parseFloat(heightInput);
  const liveBmiAssessment = useMemo(() => {
    if (liveWeightNum > 0 && liveHeightNum > 0) {
      return calculateBMI(liveWeightNum, liveHeightNum);
    }
    return null;
  }, [liveWeightNum, liveHeightNum]);

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveWeightNum || liveWeightNum <= 0 || !liveHeightNum || liveHeightNum <= 0) {
      return;
    }

    addAnthropometricRecord({
      weightKg: liveWeightNum,
      heightCm: liveHeightNum,
      shouldersCm: shouldersInput && parseFloat(shouldersInput) > 0 ? parseFloat(shouldersInput) : undefined,
      chestCm: chestInput && parseFloat(chestInput) > 0 ? parseFloat(chestInput) : undefined,
      waistCm: waistInput && parseFloat(waistInput) > 0 ? parseFloat(waistInput) : undefined,
      armCm: armInput && parseFloat(armInput) > 0 ? parseFloat(armInput) : undefined,
      hipCm: hipInput && parseFloat(hipInput) > 0 ? parseFloat(hipInput) : undefined,
      thighCm: thighInput && parseFloat(thighInput) > 0 ? parseFloat(thighInput) : undefined,
      notes: notesInput.trim() || 'Control de recomposición y composición corporal',
    });

    setIsModalOpen(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  // Objetivos de Recomposición
  const currentBodyGoals = userProfile.bodyGoals || {
    primaryGoal: 'recomposicion',
    targetWeightKg: undefined,
    targetWaistCm: undefined,
    focusZones: ['cintura', 'hombros', 'gluteos'],
  };

  const handleGoalSelect = (goal: BodyRecompositionGoal) => {
    updateBodyGoals({ primaryGoal: goal });
  };

  const handleToggleFocusZone = (zone: BodyFocusZone) => {
    const currentZones = currentBodyGoals.focusZones || [];
    const exists = currentZones.includes(zone);
    let updatedZones: BodyFocusZone[];
    if (exists) {
      updatedZones = currentZones.filter((z) => z !== zone);
      if (updatedZones.length === 0) updatedZones = ['cintura'];
    } else {
      updatedZones = [...currentZones, zone];
    }
    updateBodyGoals({ focusZones: updatedZones });
  };

  // 1. Métricas de las 3 tarjetas numéricas grandes
  const totalSessions = completedWorkouts.length;
  const totalMinutes = completedWorkouts.reduce(
    (acc, w) => acc + (w.durationMinutes || 0),
    0
  );

  // 2. Agrupación por semanas para el Gráfico de Barras
  const weeklyFrequencyData = useMemo(() => {
    const targetPerWeek = annualPlan.daysPerWeek || 3;
    const now = new Date();

    const weeks: Array<{
      weekLabel: string;
      sessionsCount: number;
      targetCount: number;
      startDate: Date;
      endDate: Date;
    }> = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now);
      start.setDate(now.getDate() - (i * 7 + now.getDay() - 1));
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      const count = completedWorkouts.filter((w) => {
        const d = new Date(w.timestamp);
        return d >= start && d <= end;
      }).length;

      weeks.push({
        weekLabel: i === 0 ? 'Esta sem.' : `Sem -${i}`,
        sessionsCount: count,
        targetCount: targetPerWeek,
        startDate: start,
        endDate: end,
      });
    }

    return weeks;
  }, [completedWorkouts, annualPlan.daysPerWeek]);

  // 3. Datos para el Gráfico de Línea / Tendencia de RPE (Esfuerzo Percibido)
  const rpeTrendData = useMemo(() => {
    const sorted = [...completedWorkouts].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    if (sorted.length === 0) {
      return [
        { label: 'Sem 1', rpe: 5.0, isReal: false },
        { label: 'Sem 2', labelSub: 'Esperado', rpe: 5.0, isReal: false },
        { label: 'Sem 3', labelSub: 'Esperado', rpe: 5.0, isReal: false },
        { label: 'Sem 4', labelSub: 'Esperado', rpe: 5.0, isReal: false },
      ];
    }

    const recent = sorted.slice(-8);
    return recent.map((w, idx) => {
      let rpeNum = 5.0;
      if (w.rpe === 'light') rpeNum = 3.5;
      if (w.rpe === 'challenging') rpeNum = 7.5;

      const d = new Date(w.timestamp);
      const dayStr = `${d.getDate()}/${d.getMonth() + 1}`;

      return {
        label: `S${idx + 1}`,
        dateStr: dayStr,
        rpe: rpeNum,
        isReal: true,
      };
    });
  }, [completedWorkouts]);

  // 4. Datos Antropométricos y Gráfico de Evolución de Peso
  const latestAnthro = anthropometricRecords[0];
  const currentWeightKg = latestAnthro?.weightKg || userProfile.weightKg;
  const currentHeightCm = latestAnthro?.heightCm || userProfile.heightCm || 165;
  const currentBmiValue = latestAnthro?.bmi || (currentWeightKg ? calculateBMI(currentWeightKg, currentHeightCm).bmi : undefined);
  const currentBmiCategory = latestAnthro?.bmiCategory || (currentWeightKg ? calculateBMI(currentWeightKg, currentHeightCm).category : undefined);

  // Registro ordenado cronológicamente para la gráfica de peso
  const chronologicalWeightRecords = useMemo(() => {
    return [...anthropometricRecords].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [anthropometricRecords]);

  // Comparativa de peso con el registro previo
  const weightChangeDiff = useMemo(() => {
    if (chronologicalWeightRecords.length < 2) return null;
    const current = chronologicalWeightRecords[chronologicalWeightRecords.length - 1].weightKg;
    const previous = chronologicalWeightRecords[chronologicalWeightRecords.length - 2].weightKg;
    const diff = Math.round((current - previous) * 10) / 10;
    return diff;
  }, [chronologicalWeightRecords]);

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    try {
      downloadClinicalReportPDF();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch {
      // silent
    } finally {
      setIsDownloading(false);
    }
  };

  // Coordenadas para el SVG del Gráfico de Línea RPE
  const svgWidth = 320;
  const svgHeight = 140;
  const paddingX = 35;
  const paddingY = 25;

  const rpePoints = useMemo(() => {
    const minRPE = 2;
    const maxRPE = 9;
    const stepX = (svgWidth - paddingX * 2) / Math.max(1, rpeTrendData.length - 1);

    return rpeTrendData.map((pt, idx) => {
      const x = paddingX + idx * stepX;
      const ratio = (pt.rpe - minRPE) / (maxRPE - minRPE);
      const y = svgHeight - paddingY - ratio * (svgHeight - paddingY * 2);
      return { ...pt, x, y };
    });
  }, [rpeTrendData]);

  const rpePathD = useMemo(() => {
    if (rpePoints.length === 0) return '';
    return rpePoints.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  }, [rpePoints]);

  const rpeAreaD = useMemo(() => {
    if (rpePoints.length === 0) return '';
    const first = rpePoints[0];
    const last = rpePoints[rpePoints.length - 1];
    const bottomY = svgHeight - paddingY;
    return `${rpePathD} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [rpePoints, rpePathD]);

  // Coordenadas para el Gráfico SVG de Evolución de Peso
  const weightSvgWidth = 320;
  const weightSvgHeight = 150;
  const weightPadX = 35;
  const weightPadY = 25;

  const weightPointsData = useMemo(() => {
    if (chronologicalWeightRecords.length === 0) return [];

    if (chronologicalWeightRecords.length === 1) {
      const rec = chronologicalWeightRecords[0];
      const d = new Date(rec.date);
      return [
        {
          x: weightSvgWidth / 2,
          y: weightSvgHeight / 2,
          weightKg: rec.weightKg,
          dateStr: `${d.getDate()}/${d.getMonth() + 1}`,
          isSingle: true,
        },
      ];
    }

    const weights = chronologicalWeightRecords.map((r) => r.weightKg);
    const minW = Math.min(...weights);
    const maxW = Math.max(...weights);
    const range = Math.max(2, maxW - minW);
    const yMin = Math.max(0, minW - range * 0.2);
    const yMax = maxW + range * 0.2;
    const stepX =
      (weightSvgWidth - weightPadX * 2) /
      Math.max(1, chronologicalWeightRecords.length - 1);

    return chronologicalWeightRecords.map((rec, idx) => {
      const x = weightPadX + idx * stepX;
      const ratio = (rec.weightKg - yMin) / (yMax - yMin);
      const y = weightSvgHeight - weightPadY - ratio * (weightSvgHeight - weightPadY * 2);
      const d = new Date(rec.date);
      return {
        x,
        y,
        weightKg: rec.weightKg,
        dateStr: `${d.getDate()}/${d.getMonth() + 1}`,
        isSingle: false,
      };
    });
  }, [chronologicalWeightRecords]);

  const weightPathD = useMemo(() => {
    if (weightPointsData.length < 2) return '';
    return weightPointsData.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  }, [weightPointsData]);

  const weightAreaD = useMemo(() => {
    if (weightPointsData.length < 2) return '';
    const first = weightPointsData[0];
    const last = weightPointsData[weightPointsData.length - 1];
    const bottomY = weightSvgHeight - weightPadY;
    return `${weightPathD} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [weightPointsData, weightPathD]);

  // Maximo valor de sesiones para escalar el gráfico de barras
  const maxWeeklySessions = useMemo(() => {
    const maxData = Math.max(...weeklyFrequencyData.map((w) => w.sessionsCount), 0);
    return Math.max(maxData, annualPlan.daysPerWeek || 3, 4);
  }, [weeklyFrequencyData, annualPlan.daysPerWeek]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-28">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 bg-white border-b border-[#EDEEEF] sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#191C1D] flex items-center justify-center transition-all"
            title="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238] text-xs font-bold">
            <Activity className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Métricas Clínicas Reales</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F]">
            Panel de Salud y Adherencia
          </span>
          <h1 className="text-xl font-black text-[#191C1D] leading-tight mt-0.5">
            Evolución y Composición Corporal
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 pt-5 space-y-6 flex-1">
        {/* Toast Notificación de Guardado */}
        {saveToast && (
          <div className="p-3 rounded-2xl bg-[#E7F3EC] border border-[#2D6A4F] text-[#0F5238] text-xs font-bold flex items-center gap-2 shadow-xs transition-all">
            <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span>¡Registro antropométrico guardado y métricas actualizadas!</span>
          </div>
        )}

        {/* =========================================================
            1. TRES TARJETAS NUMÉRICAS GRANDES
            ========================================================= */}
        <section className="grid grid-cols-3 gap-2.5">
          {/* Tarjeta 1: Sesiones totales */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E1E3E4] flex flex-col items-center text-center shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center mb-1.5">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-[#707973] uppercase tracking-wider">
              Sesiones
            </span>
            <strong className="text-2xl font-black text-[#191C1D] mt-0.5">
              {totalSessions}
            </strong>
            <span className="text-[10px] text-[#2D6A4F] font-semibold mt-0.5">
              completadas
            </span>
          </div>

          {/* Tarjeta 2: Minutos activos */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E1E3E4] flex flex-col items-center text-center shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-[#707973] uppercase tracking-wider">
              Minutos
            </span>
            <strong className="text-2xl font-black text-[#191C1D] mt-0.5">
              {totalMinutes}
            </strong>
            <span className="text-[10px] text-[#2D6A4F] font-semibold mt-0.5">
              acumulados
            </span>
          </div>

          {/* Tarjeta 3: Días de racha */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E1E3E4] flex flex-col items-center text-center shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#FFF6ED] text-[#E76F51] flex items-center justify-center mb-1.5">
              <Flame className="w-4 h-4 fill-[#E76F51]" />
            </div>
            <span className="text-[10px] font-bold text-[#707973] uppercase tracking-wider">
              Racha
            </span>
            <strong className="text-2xl font-black text-[#8E4E14] mt-0.5">
              {streakDays}
            </strong>
            <span className="text-[10px] text-[#8E4E14] font-semibold mt-0.5">
              días seguidos
            </span>
          </div>
        </section>

        {/* =========================================================
            2. MÓDULO COMPLETO: COMPOSICIÓN CORPORAL Y PESO
            ========================================================= */}
        <section className="p-5 rounded-3xl bg-white border border-[#E1E3E4] shadow-xs space-y-4">
          {/* Encabezado del Módulo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-[#191C1D]">
                  Composición Corporal y Peso
                </h2>
                <p className="text-[11px] text-[#707973]">
                  Seguimiento de peso, IMC y perímetros
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openRegisterModal}
              className="px-3 py-1.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1b4332] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar</span>
            </button>
          </div>

          {/* Tarjeta Resumen: Peso, IMC y Clasificación OMS */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E1E3E4] space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Peso actual */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#707973] block">
                  Peso Actual
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <strong className="text-2xl font-black text-[#191C1D]">
                    {currentWeightKg ? `${currentWeightKg}` : '--'}
                  </strong>
                  <span className="text-xs font-bold text-[#707973]">kg</span>
                </div>

                {weightChangeDiff !== null && (
                  <div
                    className={`flex items-center gap-1 text-[11px] font-bold mt-1 ${
                      weightChangeDiff <= 0 ? 'text-[#2D6A4F]' : 'text-[#8E4E14]'
                    }`}
                  >
                    {weightChangeDiff <= 0 ? (
                      <TrendingDown className="w-3 h-3 text-[#2D6A4F]" />
                    ) : (
                      <TrendingUp className="w-3 h-3 text-[#8E4E14]" />
                    )}
                    <span>
                      {weightChangeDiff > 0 ? `+${weightChangeDiff}` : `${weightChangeDiff}`} kg vs anterior
                    </span>
                  </div>
                )}
              </div>

              {/* IMC y Badge OMS */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#707973] block">
                  Índice de Masa Corporal (IMC)
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <strong className="text-2xl font-black text-[#191C1D]">
                    {currentBmiValue ? `${currentBmiValue}` : '--'}
                  </strong>
                  <span className="text-xs font-bold text-[#707973]">kg/m²</span>
                </div>

                {/* Badge OMS */}
                <div className="mt-1">
                  {currentBmiCategory === 'normopeso' ? (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E7F3EC] text-[#0F5238]">
                      Normopeso (Saludable OMS)
                    </span>
                  ) : currentBmiCategory === 'sobrepeso' ? (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFF6ED] text-[#8E4E14]">
                      Sobrepeso (OMS)
                    </span>
                  ) : currentBmiCategory === 'obesidad' ? (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FDF0EE] text-[#9C3220]">
                      Obesidad (OMS)
                    </span>
                  ) : currentBmiCategory === 'bajo_peso' ? (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EBF3FA] text-[#1D6FA5]">
                      Bajo peso (OMS)
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EDEEEF] text-[#707973]">
                      Pendiente de registro
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Fecha del último registro */}
            {latestAnthro && (
              <div className="pt-2 border-t border-[#EDEEEF] flex items-center justify-between text-[11px] text-[#707973]">
                <span>Último control: {new Date(latestAnthro.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>Estatura: {currentHeightCm} cm</span>
              </div>
            )}
          </div>

          {/* =========================================================
              2.A DIAGNÓSTICO DEL ASESOR DE RECOMPOSICIÓN CORPORAL
              ========================================================= */}
          <div
            className={`p-4 rounded-2xl border space-y-3 transition-all ${
              recompositionAnalysis.status === 'optima'
                ? 'bg-[#E7F3EC] border-[#B1F0CE]'
                : recompositionAnalysis.status === 'hipertrofia'
                ? 'bg-[#EBF3FA] border-[#BDE0FE]'
                : recompositionAnalysis.status === 'deficit_favorable'
                ? 'bg-[#E7F3EC] border-[#B1F0CE]'
                : recompositionAnalysis.status === 'mantenimiento'
                ? 'bg-[#FFF6ED] border-[#F4A261]'
                : 'bg-[#F8F9FA] border-[#E1E3E4]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {recompositionAnalysis.status === 'optima' ? (
                  <Sparkles className="w-4 h-4 text-[#2D6A4F]" />
                ) : recompositionAnalysis.status === 'hipertrofia' ? (
                  <Dumbbell className="w-4 h-4 text-[#1D6FA5]" />
                ) : recompositionAnalysis.status === 'deficit_favorable' ? (
                  <TrendingDown className="w-4 h-4 text-[#2D6A4F]" />
                ) : recompositionAnalysis.status === 'mantenimiento' ? (
                  <ShieldAlert className="w-4 h-4 text-[#8E4E14]" />
                ) : (
                  <Heart className="w-4 h-4 text-[#2D6A4F]" />
                )}
                <strong className="text-xs font-black uppercase tracking-wider text-[#191C1D]">
                  Diagnóstico del Asesor
                </strong>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs ${recompositionAnalysis.badgeBg} ${recompositionAnalysis.badgeText}`}
              >
                {recompositionAnalysis.statusBadge || recompositionAnalysis.statusTitle}
              </span>
            </div>

            {/* Titular y Explicación Clínica de la Composición */}
            <div className="space-y-1">
              <h3 className="text-xs font-black text-[#191C1D] leading-snug">
                {recompositionAnalysis.summaryMessage}
              </h3>
              <p className="text-xs text-[#42474E] leading-relaxed">
                {recompositionAnalysis.crossEvaluationDetail}
              </p>
            </div>

            {/* Pautas numéricas de referencia OMS */}
            <div className="grid grid-cols-2 gap-2 bg-white/80 p-2.5 rounded-xl text-xs border border-[#EDEEEF]">
              <div>
                <span className="text-[10px] font-bold text-[#707973] block">
                  Rango Saludable OMS ({currentHeightCm} cm):
                </span>
                <strong className="text-[#0F5238] font-black text-xs">
                  {bodyCompositionAdvice.minHealthyWeightKg} – {bodyCompositionAdvice.maxHealthyWeightKg} kg
                </strong>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#707973] block">
                  Ritmo Seguro Sostenible:
                </span>
                <strong className="text-[#0F5238] font-black text-xs">
                  0.3 – 0.5 kg / semana
                </strong>
              </div>
            </div>

            {/* Biomarcadores Clínicos de Grasa Visceral y Masa Apendicular */}
            <div className="p-2.5 rounded-xl bg-white/90 border border-[#EDEEEF] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-[#707973] tracking-wider">
                  Biomarcadores Clínicos Clave
                </span>
                {bodyRecompositionMetrics.isFavorableRecomposition && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#E7F3EC] text-[#0F5238]">
                    Recomposición Favorable
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-[#F8F9FA] border border-[#E1E3E4]">
                  <span className="text-[10px] font-bold text-[#707973] block">
                    Grasa Visceral / ICC (OMS)
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <strong className="text-sm font-black text-[#191C1D]">
                      {bodyRecompositionMetrics.waistHipRatio
                        ? bodyRecompositionMetrics.waistHipRatio.toFixed(2)
                        : '--'}
                    </strong>
                    <span className="text-[10px] text-[#707973]">
                      ({bodyRecompositionMetrics.waistHipRisk || 'Bajo riesgo'})
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[#F8F9FA] border border-[#E1E3E4]">
                  <span className="text-[10px] font-bold text-[#707973] block">
                    Masa Magra Periférica
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <strong className="text-xs font-black text-[#0F5238]">
                      {bodyRecompositionMetrics.deltaArmCm !== undefined || bodyRecompositionMetrics.deltaThighCm !== undefined
                        ? `Brazo: ${bodyRecompositionMetrics.deltaArmCm !== undefined ? (bodyRecompositionMetrics.deltaArmCm > 0 ? `+${bodyRecompositionMetrics.deltaArmCm}` : bodyRecompositionMetrics.deltaArmCm) : 0} | Muslo: ${bodyRecompositionMetrics.deltaThighCm !== undefined ? (bodyRecompositionMetrics.deltaThighCm > 0 ? `+${bodyRecompositionMetrics.deltaThighCm}` : bodyRecompositionMetrics.deltaThighCm) : 0} cm`
                        : 'Estable'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Botón para desplegar Tabla Comparativa Clínica */}
              <button
                type="button"
                onClick={() => setShowClinicalTable(!showClinicalTable)}
                className="w-full py-1.5 px-2 rounded-lg bg-[#E7F3EC] hover:bg-[#d8ece1] text-[#0F5238] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>
                  {showClinicalTable
                    ? 'Ocultar Auditoría Antropométrica'
                    : 'Ver Auditoría Clínica (Línea Base vs Actual)'}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    showClinicalTable ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {/* Desglose de la Tabla Comparativa Clínica */}
              {showClinicalTable && (
                <div className="pt-2 border-t border-[#EDEEEF] space-y-2">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b border-[#CCD0D2] text-[10px] font-extrabold uppercase text-[#707973]">
                          <th className="py-1 pr-2">Medida</th>
                          <th className="py-1 px-1">Base</th>
                          <th className="py-1 px-1">Actual</th>
                          <th className="py-1 px-1">Δ</th>
                          <th className="py-1 pl-2">Criterio Clínico</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EDEEEF]">
                        {bodyRecompositionMetrics.comparisonTable.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[#F3F4F5]/60 transition-colors">
                            <td className="py-1.5 pr-2 font-bold text-[#191C1D]">{row.parameter}</td>
                            <td className="py-1.5 px-1 text-[#707973]">{row.initial}</td>
                            <td className="py-1.5 px-1 font-bold text-[#191C1D]">{row.current}</td>
                            <td className="py-1.5 px-1">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                                  row.isFavorable
                                    ? 'bg-[#E7F3EC] text-[#0F5238]'
                                    : 'bg-[#FFF6ED] text-[#8E4E14]'
                                }`}
                              >
                                {row.delta}
                              </span>
                            </td>
                            <td className="py-1.5 pl-2 text-[10px] text-[#42474E] leading-tight">
                              {row.clinicalCriterion}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-2 rounded-lg bg-[#F8F9FA] text-[10px] text-[#42474E] leading-relaxed">
                    <strong>Dictamen Clínico:</strong> {bodyRecompositionMetrics.diagnosticSummary}
                  </div>
                </div>
              )}
            </div>

            {/* Recomendaciones Biomecánicas de Recomposición */}
            {recompositionAnalysis.biomechanicAdvice.length > 0 && (
              <div className="pt-2 border-t border-black/5 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase text-[#707973] block tracking-wider">
                  Directrices Clínicas AdaptFit
                </span>
                <ul className="space-y-1 text-[11px] text-[#2A3E33]">
                  {recompositionAnalysis.biomechanicAdvice.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pautas para Zonas de Enfoque Seleccionadas */}
            {recompositionAnalysis.focusZonesAdvice.length > 0 && (
              <div className="pt-2 border-t border-black/5 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase text-[#707973] block tracking-wider">
                  Enfoque Biomecánico Personalizado
                </span>
                <div className="space-y-1.5">
                  {recompositionAnalysis.focusZonesAdvice.map((fItem) => (
                    <div
                      key={fItem.zone}
                      className="p-2.5 rounded-xl bg-white/90 border border-[#EDEEEF] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#191C1D] flex items-center gap-1">
                          <Target className="w-3 h-3 text-[#2D6A4F]" />
                          {fItem.label}
                        </span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#E7F3EC] text-[#0F5238]">
                          {fItem.targetMuscle}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#42474E] leading-relaxed">
                        {fItem.biomechanicSafetyTip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================
              2.B OBJETIVOS Y ZONAS CLAVE DE RECOMPOSICIÓN
              ========================================================= */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E1E3E4] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#2D6A4F]" />
                <h3 className="text-xs font-black text-[#191C1D] uppercase tracking-wider">
                  Objetivo de Recomposición
                </h3>
              </div>
              <span className="text-[10px] text-[#707973]">Personalizable</span>
            </div>

            {/* Selector de Objetivo Primario */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'recomposicion', label: 'Recomposición Óptima' },
                { id: 'perdida_grasa', label: 'Reducción de Grasa' },
                { id: 'ganancia_muscular', label: 'Ganancia Muscular' },
                { id: 'salud_articular', label: 'Salud Articular Cero-Impacto' },
              ].map((opt) => {
                const isSelected = currentBodyGoals.primaryGoal === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleGoalSelect(opt.id as BodyRecompositionGoal)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-2xs'
                        : 'bg-white text-[#42474E] border-[#E1E3E4] hover:bg-[#F3F4F5]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Selector de Zonas de Enfoque */}
            <div className="pt-2 border-t border-[#EDEEEF] space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#707973] block">
                Zonas prioritarias de estímulo funcional:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'hombros', label: 'Hombros' },
                  { id: 'pecho', label: 'Pecho / Torso' },
                  { id: 'espalda', label: 'Espalda' },
                  { id: 'brazos', label: 'Brazos' },
                  { id: 'cintura', label: 'Cintura' },
                  { id: 'gluteos', label: 'Glúteos' },
                  { id: 'piernas', label: 'Piernas' },
                ].map((z) => {
                  const isChecked = currentBodyGoals.focusZones?.includes(z.id as BodyFocusZone);
                  return (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => handleToggleFocusZone(z.id as BodyFocusZone)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                        isChecked
                          ? 'bg-[#E7F3EC] text-[#0F5238] border-[#2D6A4F]'
                          : 'bg-white text-[#707973] border-[#CCD0D2] hover:bg-[#F3F4F5]'
                      }`}
                    >
                      {isChecked && '✓ '}
                      {z.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =========================================================
              2.C GRÁFICO SVG DE EVOLUCIÓN DE PESO
              ========================================================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#191C1D]">
                Tendencia Temporal de Peso
              </span>
              <span className="text-[10px] text-[#707973]">
                {chronologicalWeightRecords.length} control{chronologicalWeightRecords.length === 1 ? '' : 'es'}
              </span>
            </div>

            {chronologicalWeightRecords.length === 0 ? (
              /* Estado vacío clínico */
              <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-dashed border-[#CCD0D2] flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <strong className="text-xs font-bold text-[#191C1D]">
                  Sin registros de peso todavía
                </strong>
                <p className="text-[11px] text-[#707973] max-w-xs">
                  Registra tu peso inicial para activar el gráfico de tendencia temporal y el análisis de recomposición funcional.
                </p>
                <button
                  type="button"
                  onClick={openRegisterModal}
                  className="px-3 py-1.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1b4332] transition-all cursor-pointer"
                >
                  Registrar primer peso
                </button>
              </div>
            ) : chronologicalWeightRecords.length === 1 ? (
              /* Punto base de referencia */
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E1E3E4] space-y-3">
                <div className="w-full flex flex-col items-center">
                  <svg
                    viewBox={`0 0 ${weightSvgWidth} 80`}
                    className="w-full h-20 overflow-visible"
                  >
                    {/* Línea horizontal base */}
                    <line
                      x1={weightPadX}
                      y1="40"
                      x2={weightSvgWidth - weightPadX}
                      y2="40"
                      stroke="#2D6A4F"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    {/* Punto */}
                    <circle
                      cx={weightSvgWidth / 2}
                      cy="40"
                      r="6"
                      fill="#2D6A4F"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                    {/* Texto del peso */}
                    <text
                      x={weightSvgWidth / 2}
                      y="26"
                      textAnchor="middle"
                      fill="#191C1D"
                      fontSize="11"
                      fontWeight="800"
                    >
                      {weightPointsData[0]?.weightKg} kg
                    </text>
                    {/* Fecha */}
                    <text
                      x={weightSvgWidth / 2}
                      y="58"
                      textAnchor="middle"
                      fill="#707973"
                      fontSize="10"
                      fontWeight="600"
                    >
                      Base ({weightPointsData[0]?.dateStr})
                    </text>
                  </svg>
                </div>
                <p className="text-[11px] text-[#707973] text-center bg-white p-2 rounded-xl border border-[#EDEEEF]">
                  Punto de partida registrado. Añade una nueva medición en tu próximo control semanal para trazar la curva de progreso.
                </p>
              </div>
            ) : (
              /* Gráfico de línea cronológico con 2+ registros */
              <div className="w-full overflow-hidden flex flex-col items-center">
                <svg
                  viewBox={`0 0 ${weightSvgWidth} ${weightSvgHeight}`}
                  className="w-full h-38 overflow-visible"
                >
                  <defs>
                    <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line
                    x1={weightPadX}
                    y1={weightPadY}
                    x2={weightSvgWidth - weightPadX}
                    y2={weightPadY}
                    stroke="#EDEEEF"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={weightPadX}
                    y1={weightSvgHeight / 2}
                    x2={weightSvgWidth - weightPadX}
                    y2={weightSvgHeight / 2}
                    stroke="#EDEEEF"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={weightPadX}
                    y1={weightSvgHeight - weightPadY}
                    x2={weightSvgWidth - weightPadX}
                    y2={weightSvgHeight - weightPadY}
                    stroke="#EDEEEF"
                    strokeWidth="1"
                  />

                  {/* Relleno de área */}
                  {weightAreaD && <path d={weightAreaD} fill="url(#weightAreaGrad)" />}

                  {/* Trazo de línea */}
                  {weightPathD && (
                    <path
                      d={weightPathD}
                      fill="none"
                      stroke="#2D6A4F"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Puntos y etiquetas */}
                  {weightPointsData.map((pt, idx) => (
                    <g key={idx}>
                      {/* Valor del peso encima */}
                      <text
                        x={pt.x}
                        y={pt.y - 8}
                        textAnchor="middle"
                        fill="#191C1D"
                        fontSize="10"
                        fontWeight="800"
                      >
                        {pt.weightKg}
                      </text>

                      {/* Círculo del punto */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill="#FFFFFF"
                        stroke="#2D6A4F"
                        strokeWidth="2.5"
                      />

                      {/* Fecha debajo */}
                      <text
                        x={pt.x}
                        y={weightSvgHeight - 8}
                        textAnchor="middle"
                        fill="#707973"
                        fontSize="9"
                        fontWeight="700"
                      >
                        {pt.dateStr}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            )}
          </div>

          {/* =========================================================
              2.D CONTORNOS Y PERÍMETROS CORPORALES (CON PESTAÑAS Y COMPARADOR)
              ========================================================= */}
          <div className="pt-3 border-t border-[#EDEEEF] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-[#2D6A4F]" />
                <h3 className="text-xs font-black text-[#191C1D] uppercase tracking-wider">
                  Perímetros y Redistribución
                </h3>
              </div>

              <span className="text-[10px] text-[#707973]">
                {anthropometricRecords.length} registro{anthropometricRecords.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Pestañas para alternar entre "Tronco y Brazos" y "Cintura y Piernas" */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-[#F3F4F5] border border-[#E1E3E4]">
              <button
                type="button"
                onClick={() => setPerimeterTab('tronco_brazos')}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  perimeterTab === 'tronco_brazos'
                    ? 'bg-white text-[#191C1D] shadow-2xs'
                    : 'text-[#707973] hover:text-[#191C1D]'
                }`}
              >
                Tronco y Brazos
              </button>

              <button
                type="button"
                onClick={() => setPerimeterTab('cintura_piernas')}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  perimeterTab === 'cintura_piernas'
                    ? 'bg-white text-[#191C1D] shadow-2xs'
                    : 'text-[#707973] hover:text-[#191C1D]'
                }`}
              >
                Cintura y Piernas
              </button>
            </div>

            {/* Lista y Comparador Visual según la Pestaña Activa */}
            <div className="space-y-2">
              {(perimeterTab === 'tronco_brazos'
                ? [
                    {
                      key: 'shoulders',
                      guideKey: 'hombros',
                      label: 'Hombros',
                      comp: recompositionAnalysis.perimetersComparison?.shoulders,
                    },
                    {
                      key: 'chest',
                      guideKey: 'pecho',
                      label: 'Pecho / Torso',
                      comp: recompositionAnalysis.perimetersComparison?.chest,
                    },
                    {
                      key: 'arm',
                      guideKey: 'brazo',
                      label: 'Brazo / Bíceps',
                      comp: recompositionAnalysis.perimetersComparison?.arm,
                    },
                  ]
                : [
                    {
                      key: 'waist',
                      guideKey: 'cintura',
                      label: 'Cintura',
                      comp: recompositionAnalysis.perimetersComparison?.waist,
                    },
                    {
                      key: 'hip',
                      guideKey: 'cadera',
                      label: 'Cadera',
                      comp: recompositionAnalysis.perimetersComparison?.hip,
                    },
                    {
                      key: 'thigh',
                      guideKey: 'muslo',
                      label: 'Muslo',
                      comp: recompositionAnalysis.perimetersComparison?.thigh,
                    },
                  ]
              ).map((item) => {
                const comp = item.comp;
                const hasMeasurements = comp?.latest !== undefined;
                const hasDiff = comp?.diff !== undefined;

                return (
                  <div
                    key={item.key}
                    className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#E1E3E4] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-[#191C1D]">
                          {item.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveGuideKey(item.guideKey)}
                          className="w-5 h-5 rounded-full bg-[#E7F3EC] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title={`Ver guía anatómica de medición de ${item.label}`}
                        >
                          <HelpCircle className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Diferencia con código de colores */}
                      {hasDiff ? (
                        <div
                          className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black shadow-2xs ${
                            comp?.isPositiveChange
                              ? 'bg-[#E7F3EC] text-[#0F5238] border border-[#B1F0CE]'
                              : 'bg-[#FFF6ED] text-[#8E4E14] border border-[#F4A261]'
                          }`}
                        >
                          {comp?.diff && comp.diff < 0 ? (
                            <TrendingDown className="w-3.5 h-3.5" />
                          ) : comp?.diff && comp.diff > 0 ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          <span>{comp?.changeLabel}</span>
                        </div>
                      ) : hasMeasurements ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EDEEEF] text-[#707973]">
                          1ª Medición (Base)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#EDEEEF] text-[#707973]">
                          No registrado
                        </span>
                      )}
                    </div>

                    {/* Comparativa: Inicial vs Actual */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#EDEEEF]/70 text-xs">
                      <div className="bg-white p-2 rounded-xl border border-[#EDEEEF]">
                        <span className="text-[10px] font-bold uppercase text-[#707973] block">
                          Primera medición
                        </span>
                        <strong className="text-sm font-black text-[#191C1D]">
                          {comp?.initial !== undefined ? `${comp.initial} cm` : '--'}
                        </strong>
                      </div>

                      <div className="bg-white p-2 rounded-xl border border-[#EDEEEF]">
                        <span className="text-[10px] font-bold uppercase text-[#707973] block">
                          Última medición
                        </span>
                        <strong className="text-sm font-black text-[#191C1D]">
                          {comp?.latest !== undefined ? `${comp.latest} cm` : '--'}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ratio Cintura / Cadera si ambos están disponibles */}
            {bodyCompositionAdvice.waistHipRatio && (
              <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E1E3E4] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#707973] block uppercase tracking-wider">
                    Índice Cintura / Cadera (ICC)
                  </span>
                  <strong className="text-base font-black text-[#191C1D]">
                    {bodyCompositionAdvice.waistHipRatio}
                  </strong>
                </div>

                <div>
                  {bodyCompositionAdvice.waistHipRisk === 'bajo' ? (
                    <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#E7F3EC] text-[#0F5238]">
                      Riesgo metabólico bajo (OMS)
                    </span>
                  ) : bodyCompositionAdvice.waistHipRisk === 'moderado' ? (
                    <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#FFF6ED] text-[#8E4E14]">
                      Riesgo moderado (OMS)
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#FDF0EE] text-[#9C3220]">
                      Riesgo aumentado (OMS)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================
            3. GRÁFICO DE BARRAS: FRECUENCIA SEMANAL
            ========================================================= */}
        <section className="p-5 rounded-3xl bg-white border border-[#E1E3E4] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#2D6A4F]" />
                <h2 className="text-sm font-black text-[#191C1D]">
                  Frecuencia de Entrenamientos
                </h2>
              </div>
              <p className="text-xs text-[#707973] mt-0.5">
                Sesiones completadas por semana vs. objetivo ({annualPlan.daysPerWeek || 3} días)
              </p>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F] bg-[#E7F3EC] px-2.5 py-1 rounded-full">
              <span>Obj: {annualPlan.daysPerWeek || 3}/sem</span>
            </div>
          </div>

          {/* Visual Bars Container */}
          <div className="pt-2">
            <div className="h-40 flex items-end justify-between gap-3 border-b border-[#EDEEEF] pb-2 relative">
              {/* Target Line Across */}
              <div
                className="absolute left-0 right-0 border-b border-dashed border-[#F4A261] z-10 pointer-events-none"
                style={{
                  bottom: `${((annualPlan.daysPerWeek || 3) / maxWeeklySessions) * 100}%`,
                }}
              >
                <span className="absolute -top-4 right-0 text-[9px] font-extrabold text-[#8E4E14] bg-[#FFF6ED] px-1.5 py-0.5 rounded">
                  Objetivo
                </span>
              </div>

              {weeklyFrequencyData.map((item, idx) => {
                const heightPercent = Math.max(
                  item.sessionsCount > 0
                    ? (item.sessionsCount / maxWeeklySessions) * 100
                    : 6,
                  6
                );
                const isMet = item.sessionsCount >= item.targetCount;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center justify-end h-full group"
                  >
                    <span className="text-[11px] font-black text-[#191C1D] mb-1.5">
                      {item.sessionsCount}
                    </span>

                    <div className="w-full bg-[#F3F4F5] rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          item.sessionsCount === 0
                            ? 'bg-[#E1E3E4]'
                            : isMet
                            ? 'bg-[#2D6A4F]'
                            : 'bg-[#52B788]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span className="text-[10px] font-bold text-[#707973] mt-2 whitespace-nowrap">
                      {item.weekLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            4. GRÁFICO DE LÍNEA: EVOLUCIÓN DEL ESFUERZO PERCIBIDO (RPE)
            ========================================================= */}
        <section className="p-5 rounded-3xl bg-white border border-[#E1E3E4] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#2D6A4F]" />
                <h2 className="text-sm font-black text-[#191C1D]">
                  Evolución del Esfuerzo (RPE)
                </h2>
              </div>
              <p className="text-xs text-[#707973] mt-0.5">
                Tendencia de intensidad percibida a lo largo de las sesiones
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#707973]">
              <span className="w-2 h-2 rounded-full bg-[#2D6A4F]" />
              <span>Zona Ideal (4-6)</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full overflow-hidden flex flex-col items-center">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-36 overflow-visible"
            >
              <defs>
                <linearGradient id="rpeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Background Horizontal Lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={svgWidth - paddingX}
                y2={paddingY}
                stroke="#EDEEEF"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1={paddingX}
                y1={svgHeight / 2}
                x2={svgWidth - paddingX}
                y2={svgHeight / 2}
                stroke="#EDEEEF"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1={paddingX}
                y1={svgHeight - paddingY}
                x2={svgWidth - paddingX}
                y2={svgHeight - paddingY}
                stroke="#EDEEEF"
                strokeWidth="1"
              />

              {/* Y-Axis Labels */}
              <text
                x="8"
                y={paddingY + 4}
                fill="#707973"
                fontSize="9"
                fontWeight="700"
              >
                Intenso
              </text>
              <text
                x="8"
                y={svgHeight / 2 + 3}
                fill="#2D6A4F"
                fontSize="9"
                fontWeight="800"
              >
                Ideal
              </text>
              <text
                x="8"
                y={svgHeight - paddingY + 3}
                fill="#707973"
                fontSize="9"
                fontWeight="700"
              >
                Suave
              </text>

              {/* Area fill */}
              {rpeAreaD && <path d={rpeAreaD} fill="url(#rpeAreaGradient)" />}

              {/* Polyline */}
              {rpePathD && (
                <path
                  d={rpePathD}
                  fill="none"
                  stroke="#2D6A4F"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Points */}
              {rpePoints.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#FFFFFF"
                    stroke="#2D6A4F"
                    strokeWidth="2.5"
                  />
                  <text
                    x={pt.x}
                    y={svgHeight - 8}
                    textAnchor="middle"
                    fill="#707973"
                    fontSize="9"
                    fontWeight="700"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {totalSessions === 0 && (
            <p className="text-[11px] text-[#707973] text-center bg-[#F8F9FA] p-2 rounded-xl">
              Al registrar tu primer entrenamiento se trazará tu curva real de esfuerzo percibido.
            </p>
          )}
        </section>

        {/* =========================================================
            5. DESCARGA DEL REGISTRO DE ACTIVIDAD Y EVOLUCIÓN
            ========================================================= */}
        <section className="p-4 rounded-3xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 mt-0.5">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-black text-[#0F5238] block uppercase tracking-wider">
                Registro de Actividad y Evolución Física
              </strong>
              <p className="text-xs text-[#2A3E33] leading-relaxed mt-0.5">
                Documento de seguimiento del usuario con tus tablas de adherencia, esfuerzo percibido (Borg), comparativa de perímetros e incidencias adaptadas para compartir con tu médico o fisioterapeuta.
              </p>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-2.5 rounded-xl bg-white text-[#0F5238] text-xs font-bold flex items-center gap-2 border border-[#2D6A4F]">
              <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
              <span>¡Documento de seguimiento descargado con éxito!</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full h-12 rounded-2xl bg-[#2D6A4F] hover:bg-[#0F5238] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>
              {isDownloading
                ? 'Generando documento de seguimiento...'
                : 'Descargar Registro de Seguimiento (HTML/Imprimible)'}
            </span>
          </button>
        </section>
      </main>

      {/* =========================================================
          MODAL DE REGISTRO DE PESO Y MEDIDAS ANTROPOMÉTRICAS
          ========================================================= */}
      {isModalOpen && (
        <div
          id="modal-backdrop-anthropometry"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E1E3E4] space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-[#EDEEEF] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-[#191C1D]">
                    Registrar Medidas Corporales
                  </h2>
                  <p className="text-[11px] text-[#707973]">
                    Control de recomposición y perímetros
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#707973] hover:text-[#191C1D] flex items-center justify-center transition-all cursor-pointer"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pestañas del Modal: Datos Esenciales vs Contornos */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#F3F4F5] text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalSection('esenciales')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  modalSection === 'esenciales'
                    ? 'bg-white text-[#191C1D] shadow-2xs'
                    : 'text-[#707973] hover:text-[#191C1D]'
                }`}
              >
                Peso y Talla *
              </button>
              <button
                type="button"
                onClick={() => setModalSection('perimetros')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  modalSection === 'perimetros'
                    ? 'bg-white text-[#191C1D] shadow-2xs'
                    : 'text-[#707973] hover:text-[#191C1D]'
                }`}
              >
                Contornos (cm)
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSaveRecord} className="space-y-4">
              {modalSection === 'esenciales' ? (
                <div className="space-y-3.5">
                  {/* Peso (kg) - Obligatorio con botones -/+ */}
                  <div>
                    <label className="block text-xs font-bold text-[#191C1D] mb-1">
                      Peso corporal (kg) <span className="text-[#9C3220]">*</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => adjustInput(setWeightInput, weightInput, -0.2, 30, 250)}
                        className="w-10 h-11 rounded-xl bg-[#F3F4F5] hover:bg-[#E1E3E4] text-[#191C1D] font-bold text-xs flex items-center justify-center cursor-pointer transition-all shrink-0"
                        title="Restar 0.2 kg"
                      >
                        -0.2
                      </button>

                      <div className="relative flex-1">
                        <input
                          type="number"
                          step="0.1"
                          min="30"
                          max="250"
                          required
                          placeholder="Ej. 72.5"
                          value={weightInput}
                          onChange={(e) => setWeightInput(e.target.value)}
                          className="w-full h-11 px-3.5 pr-10 text-center rounded-xl bg-[#F8F9FA] border border-[#CCD0D2] focus:border-[#2D6A4F] focus:bg-white text-base font-black text-[#191C1D] outline-none transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#707973]">
                          kg
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => adjustInput(setWeightInput, weightInput, 0.2, 30, 250)}
                        className="w-10 h-11 rounded-xl bg-[#F3F4F5] hover:bg-[#E1E3E4] text-[#191C1D] font-bold text-xs flex items-center justify-center cursor-pointer transition-all shrink-0"
                        title="Sumar 0.2 kg"
                      >
                        +0.2
                      </button>
                    </div>
                  </div>

                  {/* Altura (cm) con botones -/+ */}
                  <div>
                    <label className="block text-xs font-bold text-[#191C1D] mb-1">
                      Altura (cm) <span className="text-[#9C3220]">*</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => adjustInput(setHeightInput, heightInput, -1, 100, 230)}
                        className="w-10 h-11 rounded-xl bg-[#F3F4F5] hover:bg-[#E1E3E4] text-[#191C1D] font-bold text-xs flex items-center justify-center cursor-pointer transition-all shrink-0"
                        title="Restar 1 cm"
                      >
                        -1
                      </button>

                      <div className="relative flex-1">
                        <input
                          type="number"
                          step="1"
                          min="100"
                          max="230"
                          required
                          placeholder="Ej. 165"
                          value={heightInput}
                          onChange={(e) => setHeightInput(e.target.value)}
                          className="w-full h-11 px-3.5 pr-10 text-center rounded-xl bg-[#F8F9FA] border border-[#CCD0D2] focus:border-[#2D6A4F] focus:bg-white text-base font-black text-[#191C1D] outline-none transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#707973]">
                          cm
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => adjustInput(setHeightInput, heightInput, 1, 100, 230)}
                        className="w-10 h-11 rounded-xl bg-[#F3F4F5] hover:bg-[#E1E3E4] text-[#191C1D] font-bold text-xs flex items-center justify-center cursor-pointer transition-all shrink-0"
                        title="Sumar 1 cm"
                      >
                        +1
                      </button>
                    </div>
                  </div>

                  {/* Cálculo en tiempo real del IMC */}
                  <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E1E3E4] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#707973]">
                        IMC Estimado:
                      </span>
                      <strong className="text-sm font-black text-[#191C1D]">
                        {liveBmiAssessment ? `${liveBmiAssessment.bmi} kg/m²` : '--'}
                      </strong>
                    </div>

                    {liveBmiAssessment && (
                      <div className="flex items-center justify-between pt-1 border-t border-[#EDEEEF]">
                        <span className="text-[11px] text-[#707973]">Clasificación OMS:</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${liveBmiAssessment.badgeBg} ${liveBmiAssessment.badgeText}`}
                        >
                          {liveBmiAssessment.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalSection('perimetros')}
                    className="w-full py-2.5 rounded-xl bg-[#E7F3EC] text-[#0F5238] hover:bg-[#d6ecdf] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Añadir o editar perímetros corporales</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-[11px] text-[#707973] bg-[#F8F9FA] p-2.5 rounded-xl border border-[#EDEEEF]">
                    Los perímetros permiten evaluar la recomposición (pérdida de grasa en cintura conservando masa magra). Introduce los que dispongas:
                  </div>

                  {/* Grupo Tronco y Brazos */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F] block">
                      Tronco y Brazos
                    </span>

                    <div className="grid grid-cols-3 gap-2">
                      {/* Hombros */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold text-[#191C1D]">
                            Hombros
                          </label>
                          <button
                            type="button"
                            onClick={() => setActiveGuideKey('hombros')}
                            className="text-[#2D6A4F] hover:underline"
                            title="Guía"
                          >
                            <HelpCircle className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <input
                          type="number"
                          step="0.5"
                          min="50"
                          max="200"
                          placeholder="cm"
                          value={shouldersInput}
                          onChange={(e) => setShouldersInput(e.target.value)}
                          className="w-full h-9 px-2 text-center rounded-lg bg-[#F8F9FA] border border-[#CCD0D2] focus:border-[#2D6A4F] focus:bg-white text-xs font-bold text-[#191C1D] outline-none"
                        />
                      </div>

                      {/* Pecho */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold text-[#191C1D]">
                            Pecho
                          </label>
                          <button
                            type="button"
                            onClick={() => setActiveGuideKey('pecho')}
                            className="text-[#2D6A4F] hover:underline"
                            title="Guía"
                          >
                            <HelpCircle className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <input
                          type="number"
                          step="0.5"
                          min="50"
                          max="200"
                          placeholder="cm"
                          value={chestInput}
                          onChange={(e) => setChestInput(e.target.value)}
                          className="w-full h-9 px-2 text-center rounded-lg bg-[#F8F9FA] border border-[#CCD0D2] focus:border-[#2D6A4F] focus:bg-white text-xs font-bold text-[#191C1D] outline-none"
                        />
                      </div>

                      {/* Brazo */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold text-[#191C1D]">
                            Brazo
                          </label>
                          <button
                            type="button"
                            onClick={() => setActiveGuideKey('brazo')}
                            className="text-[#2D6A4F] hover:underline"
                            title="Guía"
                          >
                            <HelpCircle className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <input
                          type="number"
                          step="0.5"
                          min="15"
                          max="80"
                          placeholder="cm"
                          value={armInput}
                          onChange={(e) => setArmInput(e.target.value)}
                          className="w-full h-9 px-2 text-center rounded-lg bg-[#F8F9FA] border border-[#CCD0D2] focus:border-[#2D6A4F] focus:bg-white text-xs font-bold text-[#191C1D] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grupo Cintura y Piernas */}
                  <div className="space-y-2 pt-1 border-t border-[#EDEEEF]">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F] block">
                      Cintura y Piernas
                    </span>

                    <div className="grid grid-cols-3 gap-2">
                      {/* Cintura */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold text-[#191C1D]">
                            Cintura
                          </label>
                          <button
                            type="button"
                            onClick={() => setActiveGuideKey('cintura')}
                            className="text-[#2D6A4F] hover:underline"
                            title="Guía"
                          >
                            <HelpCircle className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <input
                          type="number"
                          step="0.5"
                          min="40"
                          max="180"
                          placeholder="cm"
                          value={waistInput}
                          onChange={(e) => setWaistInput(e.target.value)}
                          className="w-full h-9 px-2 text-center rounded-lg bg-[#F8F9FA] border border-[#CCD0D2] focus:border-[#2D6A4F] focus:bg-white text-xs font-bold text-[#191C1D] outline-none"
                        />
                      </div>

                      {/* Cadera */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold text-[#191C1D]">
                            Cadera
                          </label>
                          <button
                            type="button"
                            onClick={() => setActiveGuideKey('cadera')}
                            className="text-[#2D6A4F] hover:underline"
                            title="Guía"
                          >
                            <HelpCircle className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <input
                          type="number"
                          step="0.5"
                          min="40"
                          max="180"
                          placeholder="cm"
                          value={hipInput}
                          onChange={(e) => setHipInput(e.target.value)}
                          className="w-full h-9 px-2 text-center rounded-lg bg-[#F8F9FA] border border-[#CCD0D2] focus:border-[#2D6A4F] focus:bg-white text-xs font-bold text-[#191C1D] outline-none"
                        />
                      </div>

                      {/* Muslo */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold text-[#191C1D]">
                            Muslo
                          </label>
                          <button
                            type="button"
                            onClick={() => setActiveGuideKey('muslo')}
                            className="text-[#2D6A4F] hover:underline"
                            title="Guía"
                          >
                            <HelpCircle className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <input
                          type="number"
                          step="0.5"
                          min="25"
                          max="120"
                          placeholder="cm"
                          value={thighInput}
                          onChange={(e) => setThighInput(e.target.value)}
                          className="w-full h-9 px-2 text-center rounded-lg bg-[#F8F9FA] border border-[#CCD0D2] focus:border-[#2D6A4F] focus:bg-white text-xs font-bold text-[#191C1D] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notas Clínicas Opcionales */}
              <div>
                <label className="block text-[11px] font-bold text-[#707973] mb-1">
                  Notas u Observaciones (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Medición en ayunas tras semana 2"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#F8F9FA] border border-[#CCD0D2] focus:border-[#2D6A4F] focus:bg-white text-xs text-[#191C1D] outline-none"
                />
              </div>

              {/* Botones de acción */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#191C1D] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={!liveWeightNum || liveWeightNum <= 0}
                  className="flex-1 h-11 rounded-xl bg-[#2D6A4F] hover:bg-[#1b4332] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Guardar registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL DE GUÍA ANATÓMICA DE MEDICIÓN
          ========================================================= */}
      {activeGuideKey && MEASUREMENT_GUIDES[activeGuideKey] && (
        <div
          id="modal-backdrop-guide"
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#E1E3E4] space-y-3.5 animate-in fade-in zoom-in duration-150">
            {/* Cabecera */}
            <div className="flex items-center justify-between border-b border-[#EDEEEF] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#191C1D]">
                    {MEASUREMENT_GUIDES[activeGuideKey].title}
                  </h3>
                  <span className="text-[10px] text-[#707973]">
                    Guía de Referencia Anatómica
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveGuideKey(null)}
                className="w-7 h-7 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#707973] hover:text-[#191C1D] flex items-center justify-center transition-all cursor-pointer"
                title="Cerrar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Punto anatómico de referencia */}
            <div className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E1E3E4] text-xs">
              <span className="text-[10px] font-bold text-[#707973] block uppercase tracking-wider">
                Punto anatómico de referencia:
              </span>
              <strong className="text-xs font-extrabold text-[#191C1D] mt-0.5 block">
                {MEASUREMENT_GUIDES[activeGuideKey].landmark}
              </strong>
            </div>

            {/* Pasos de medición */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#707973] uppercase tracking-wider block">
                Procedimiento recomendado:
              </span>
              <p className="text-xs text-[#42474E] leading-relaxed bg-[#F8F9FA] p-2.5 rounded-xl border border-[#E1E3E4]">
                {MEASUREMENT_GUIDES[activeGuideKey].instruction}
              </p>
            </div>

            {/* Consejos clínicos / postura */}
            <div className="p-2.5 rounded-xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-1 text-xs">
              <span className="text-[10px] font-black uppercase text-[#0F5238] block tracking-wider">
                Consejo de fiabilidad:
              </span>
              <div className="flex items-start gap-1.5 text-[11px] text-[#2A3E33]">
                <Check className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
                <span>{MEASUREMENT_GUIDES[activeGuideKey].tip}</span>
              </div>
            </div>

            {/* Botón de cierre */}
            <button
              type="button"
              onClick={() => setActiveGuideKey(null)}
              className="w-full h-10 rounded-xl bg-[#2D6A4F] hover:bg-[#1b4332] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
