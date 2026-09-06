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
  BarChart3,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

export const EvolutionScreen: React.FC = () => {
  const {
    completedWorkouts,
    annualPlan,
    streakDays,
    downloadClinicalReportPDF,
    goBack,
  } = useApp();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // 1. Métricas de las 3 tarjetas numéricas grandes
  const totalSessions = completedWorkouts.length;
  const totalMinutes = completedWorkouts.reduce(
    (acc, w) => acc + (w.durationMinutes || 0),
    0
  );

  // 2. Agrupación por semanas para el Gráfico de Barras
  // Calculamos las últimas 6 semanas para tener una perspectiva cronológica clara
  const weeklyFrequencyData = useMemo(() => {
    const targetPerWeek = annualPlan.daysPerWeek || 3;
    const now = new Date();

    // Creamos 6 semanas hacia atrás
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
  // Escala RPE: 1 (muy suave) a 10 (máximo). 'light' = 3.5, 'just_right' = 5.0, 'challenging' = 7.5
  const rpeTrendData = useMemo(() => {
    const sorted = [...completedWorkouts].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    if (sorted.length === 0) {
      // Si no hay datos aún, devolvemos puntos de referencia neutros (línea base ideal en 5.0)
      return [
        { label: 'Sem 1', rpe: 5.0, isReal: false },
        { label: 'Sem 2', labelSub: 'Esperado', rpe: 5.0, isReal: false },
        { label: 'Sem 3', labelSub: 'Esperado', rpe: 5.0, isReal: false },
        { label: 'Sem 4', labelSub: 'Esperado', rpe: 5.0, isReal: false },
      ];
    }

    // Tomamos hasta las últimas 8 sesiones realizadas
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

  // Coordenadas para el SVG del Gráfico de Línea
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
      // Invertir Y (RPE 9 arriba, RPE 2 abajo)
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
            Evolución del Entrenamiento
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 pt-5 space-y-6 flex-1">
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
            2. GRÁFICO DE BARRAS: FRECUENCIA SEMANAL
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
            3. GRÁFICO DE LÍNEA: EVOLUCIÓN DEL ESFUERZO PERCIBIDO (RPE)
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
            4. DESCARGA DEL INFORME CLÍNICO COMPLETO
            ========================================================= */}
        <section className="p-4 rounded-3xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 mt-0.5">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-black text-[#0F5238] block uppercase tracking-wider">
                Informe Biomecánico y Médico
              </strong>
              <p className="text-xs text-[#2A3E33] leading-relaxed mt-0.5">
                Las justificaciones técnicas, desgloses articulares y registros detallados están organizados en el informe clínico descargable para tu médico o fisioterapeuta.
              </p>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-2.5 rounded-xl bg-white text-[#0F5238] text-xs font-bold flex items-center gap-2 border border-[#2D6A4F]">
              <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
              <span>¡Informe clínico estructurado descargado con éxito!</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full h-12 rounded-2xl bg-[#2D6A4F] hover:bg-[#0F5238] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <FileDown className="w-4 h-4" />
            <span>
              {isDownloading
                ? 'Generando informe clínico...'
                : 'Descargar Informe Clínico Completo (PDF/HTML)'}
            </span>
          </button>
        </section>
      </main>
    </div>
  );
};
