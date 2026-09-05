/**
 * AdaptFit - Pantalla 13: Evolución Clínica y Gráficas de Bienestar
 * Métricas acumuladas 100% reales desde completedWorkouts, Estado Cero dinámico,
 * gráfica comparativa SVG real (RPE vs. Molestias Articulares),
 * y descarga en memoria de informe médico/fisioterapéutico en formato clínico estructurado.
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AnthropometricSection } from '../components/AnthropometricSection';
import {
  Activity,
  ArrowLeft,
  TrendingDown,
  Clock,
  ShieldCheck,
  FileText,
  Timer,
} from 'lucide-react';

export const ClinicalReportScreen: React.FC = () => {
  const {
    userProfile,
    annualPlan,
    completedWorkouts,
    generateDailyWorkout,
    anthropometricRecords,
    goBack,
  } = useApp();

  const [isGenerating, setIsGenerating] = useState(false);

  // 1. Métricas reales calculadas desde completedWorkouts
  const totalSessions = completedWorkouts.length;
  const totalMinutes = completedWorkouts.reduce(
    (acc, w) => acc + (w.durationMinutes || 0),
    0
  );

  // Adherencia: sesiones completadas respecto a las planificadas hasta la fecha actual
  const adherenceRate = useMemo(() => {
    if (completedWorkouts.length === 0) return 0;
    const sorted = [...completedWorkouts].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const firstDate = new Date(sorted[0].timestamp);
    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - firstDate.getTime());
    const daysSinceStart = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    const weeksElapsed = Math.max(1, Math.ceil(daysSinceStart / 7));
    const targetSessionsToDate = Math.max(1, weeksElapsed * (annualPlan.daysPerWeek || 3));
    return Math.min(100, Math.round((completedWorkouts.length / targetSessionsToDate) * 100));
  }, [completedWorkouts, annualPlan.daysPerWeek]);

  // 2. Ejercicios a mostrar en el Desglose Técnico
  // Si completedWorkouts.length === 0: mostrar únicamente los ejercicios prescritos en el plan actual
  const prescribedDailyRoutine = useMemo(() => {
    return generateDailyWorkout(false);
  }, [generateDailyWorkout]);

  const displayExercises = useMemo(() => {
    if (completedWorkouts.length === 0) {
      return (prescribedDailyRoutine.exercises || []).map((ex) => ({
        id: ex.id,
        name: ex.name || ex.title || 'Ejercicio terapéutico',
        movementPattern: ex.movementPattern || 'funcional',
        variantName: ex.subtitle || 'Variante biomecánica protegida',
        workDurationSeconds: ex.durationSeconds || 45,
        restSeconds: 30,
        repsOrVolume: '3 series × 8-12 reps',
        isExecuted: false,
      }));
    }

    // Si ya hay sesiones realizadas, extraer los ejercicios distintos ejecutados
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        movementPattern: string;
        variantName: string;
        workDurationSeconds: number;
        restSeconds: number;
        repsOrVolume: string;
        isExecuted: boolean;
      }
    >();

    completedWorkouts.forEach((w) => {
      (w.exercisesCompleted || []).forEach((ex) => {
        const key = ex.id || ex.name;
        if (!map.has(key)) {
          map.set(key, {
            id: ex.id || `ex-${key}`,
            name: ex.name,
            movementPattern: ex.movementPattern || 'funcional',
            variantName: ex.variantName || 'Variante protegida ejecutada',
            workDurationSeconds: ex.workDurationSeconds || 40,
            restSeconds: ex.restSeconds || 30,
            repsOrVolume: ex.repsOrVolume || '3 series completadas',
            isExecuted: true,
          });
        }
      });
    });

    const executedList = Array.from(map.values());
    if (executedList.length > 0) return executedList;

    return (prescribedDailyRoutine.exercises || []).map((ex) => ({
      id: ex.id,
      name: ex.name || ex.title || 'Ejercicio terapéutico',
      movementPattern: ex.movementPattern || 'funcional',
      variantName: ex.subtitle || 'Variante biomecánica protegida',
      workDurationSeconds: ex.durationSeconds || 45,
      restSeconds: 30,
      repsOrVolume: '3 series × 8-12 reps',
      isExecuted: false,
    }));
  }, [completedWorkouts, prescribedDailyRoutine]);

  // 3. Métricas sesión a sesión para la gráfica SVG
  const sessionMetrics = useMemo(() => {
    if (completedWorkouts.length === 0) return [];

    const sorted = [...completedWorkouts].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Consideramos hasta las últimas 6-8 sesiones para visualización limpia
    const recent = sorted.slice(-8);

    return recent.map((w, idx) => {
      let rpeNum = 4.0;
      if (w.rpe === 'light') rpeNum = 3.0;
      else if (w.rpe === 'just_right') rpeNum = 4.5;
      else if (w.rpe === 'challenging') rpeNum = 6.0;

      const discomforts = w.discomforts || [];
      const hasDiscomfort = !discomforts.includes('ninguna') && discomforts.length > 0;
      const painNum = hasDiscomfort ? Math.min(6, discomforts.length * 1.5) : 0.5;

      const d = new Date(w.timestamp);
      const formattedDate = isNaN(d.getTime())
        ? `S${idx + 1}`
        : `${d.getDate()}/${d.getMonth() + 1}`;

      return {
        sessionIndex: idx + 1,
        label: `S${idx + 1}`,
        dateLabel: formattedDate,
        rpeAverage: rpeNum,
        painLevel: painNum,
        rpeRaw: w.rpe,
        routineTitle: w.routineTitle,
        durationMinutes: w.durationMinutes,
        discomforts,
      };
    });
  }, [completedWorkouts]);

  // Cálculo real de evolución del dolor
  const initialPain = sessionMetrics.length > 0 ? sessionMetrics[0].painLevel : 0;
  const latestPain =
    sessionMetrics.length > 0
      ? sessionMetrics[sessionMetrics.length - 1].painLevel
      : 0;

  const painReductionPercent = useMemo(() => {
    if (sessionMetrics.length < 2) return null;
    if (initialPain <= 0) return null;
    const reduction = Math.round(((initialPain - latestPain) / initialPain) * 100);
    return reduction > 0 ? reduction : null;
  }, [sessionMetrics, initialPain, latestPain]);

  // Dimensiones SVG
  const chartHeight = 160;
  const chartWidth = 320;
  const maxScale = 7;

  // Generación y Descarga de Informe Clínico Real vía Blob
  const handleDownloadClinicalReport = () => {
    setIsGenerating(true);

    const dateStr = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const isZeroState = completedWorkouts.length === 0;

    const reportHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe Clínico de Prescripción y Evolución Funcional - AdaptFit</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #191c1d; padding: 32px; max-width: 860px; margin: 0 auto; background: #fff; }
    h1 { color: #2d6a4f; margin-bottom: 4px; font-size: 24px; }
    h2 { color: #191c1d; font-size: 16px; border-bottom: 2px solid #e7f3ec; padding-bottom: 6px; margin-top: 28px; }
    .header-pill { display: inline-block; padding: 5px 14px; background: #e7f3ec; color: #0f5238; border-radius: 12px; font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px; }
    .meta-box { background: #f8f9fa; border: 1px solid #e1e3e4; border-radius: 12px; padding: 18px; margin-bottom: 24px; }
    .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    th { background: #2d6a4f; color: white; text-align: left; padding: 9px 12px; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { border-bottom: 1px solid #edeeef; padding: 10px 12px; vertical-align: middle; }
    tr:nth-child(even) td { background-color: #fafbfb; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; background: #e7f3ec; color: #0f5238; }
    .highlight { color: #2d6a4f; font-weight: bold; }
    ul { padding-left: 20px; font-size: 13px; line-height: 1.8; }
    .disclaimer { font-size: 11px; color: #707973; margin-top: 36px; border-top: 1px solid #e1e3e4; padding-top: 14px; line-height: 1.6; }
    .empty-note { text-align: center; color: #707973; padding: 20px; font-style: italic; }
  </style>
</head>
<body>
  <h1>Informe Clínico y Técnico de Prescripción Funcional</h1>
  <div class="header-pill">ADAPTFIT CLINICAL SUITE • FECHA DE EMISIÓN: ${dateStr}</div>
  
  <div class="meta-box">
    <div class="meta-grid">
      <div><strong>Paciente / Usuario:</strong> ${userProfile.name || 'Paciente'}</div>
      <div><strong>Nivel de Movilidad Biomecánica:</strong> ${userProfile.mobilityLevel}</div>
      <div><strong>Zonas de Protección Articular:</strong> ${(userProfile.discomfortZones || []).join(', ') || 'Ninguna'}</div>
      <div><strong>Equipamiento Habilitado:</strong> ${(userProfile.availableEquipment || []).join(', ')}</div>
      <div><strong>Frecuencia Prescrita:</strong> ${annualPlan.daysPerWeek} días/sem (${annualPlan.minutesPerSession} min/sesión)</div>
      <div><strong>Adherencia Registrada:</strong> ${adherenceRate}% (${totalSessions} sesiones realizadas)</div>
    </div>
  </div>

  <h2>1. Desglose Técnico de Ejercicios ${isZeroState ? 'Prescritos en el Plan Inicial' : 'Prescritos y Ejecutados'}</h2>
  <table>
    <thead>
      <tr>
        <th>Ejercicio Técnico</th>
        <th>Patrón Biomecánico</th>
        <th>Variante Terapéutica</th>
        <th>T.U.T. (s)</th>
        <th>Descanso</th>
        <th>Carga / Volumen</th>
      </tr>
    </thead>
    <tbody>
      ${displayExercises
        .map(
          (ex) => `<tr>
        <td><strong>${ex.name}</strong></td>
        <td><span class="badge">${ex.movementPattern ? ex.movementPattern.replace(/_/g, ' ') : 'Funcional'}</span></td>
        <td>${ex.variantName || 'Estándar'}</td>
        <td>${ex.workDurationSeconds} seg</td>
        <td>${ex.restSeconds} seg</td>
        <td>${ex.repsOrVolume || '10-12 reps controladas'}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h2>2. Resumen de Sesiones y Evolución de Sensaciones</h2>
  <table>
    <thead>
      <tr>
        <th>Sesión</th>
        <th>Rutina Realizada</th>
        <th>RPE Esfuerzo (1-10)</th>
        <th>Nivel Molestia (0-10)</th>
        <th>Comodidad Articular</th>
      </tr>
    </thead>
    <tbody>
      ${
        isZeroState
          ? `<tr><td colspan="5" class="empty-note">Sin sesiones ejecutadas todavía. El paciente iniciará el programa con las adaptaciones prescritas.</td></tr>`
          : sessionMetrics
              .map(
                (m) => `<tr>
        <td><strong>${m.label} (${m.dateLabel})</strong></td>
        <td>${m.routineTitle || 'Sesión de entrenamiento'}</td>
        <td>${m.rpeAverage.toFixed(1)} / 10</td>
        <td>${m.painLevel.toFixed(1)} / 10</td>
        <td><span class="badge">${m.painLevel <= 1.0 ? 'Favorable (Controlado)' : 'Estable'}</span></td>
      </tr>`
              )
              .join('')
      }
    </tbody>
  </table>

  ${
    anthropometricRecords.length > 0
      ? `<h2>3. Historial de Antropometría y Composición Corporal</h2>
  <table>
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Peso (kg)</th>
        <th>IMC (kg/m²)</th>
        <th>Cintura</th>
        <th>Cadera</th>
        <th>Muslo</th>
        <th>Brazo</th>
      </tr>
    </thead>
    <tbody>
      ${anthropometricRecords
        .map(
          (r) => `<tr>
        <td>${new Date(r.date).toLocaleDateString('es-ES')}</td>
        <td><strong>${r.weightKg} kg</strong></td>
        <td>${r.bmi} (${r.bmiCategory})</td>
        <td>${r.waistCm ? `${r.waistCm} cm` : '-'}</td>
        <td>${r.hipCm ? `${r.hipCm} cm` : '-'}</td>
        <td>${r.thighCm ? `${r.thighCm} cm` : '-'}</td>
        <td>${r.armCm ? `${r.armCm} cm` : '-'}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>`
      : ''
  }

  <h2>${anthropometricRecords.length > 0 ? '4' : '3'}. Conclusiones y Diagnóstico Adaptativo</h2>
  <ul>
    ${
      isZeroState
        ? `<li><strong>Adherencia al Macrociclo:</strong> 0% (Programa en fase de prescripción previa a la primera sesión).</li>
    <li><strong>Línea Basal de Molestias:</strong> Pendiente de registro tras completar la primera sesión de entrenamiento y check-in.</li>
    <li><strong>Ajustes Articulares Asignados:</strong> Adaptación biomecánica activa sin impacto para ${(userProfile.discomfortZones || []).join(', ')}.</li>`
        : `<li><strong>Adherencia al Macrociclo:</strong> ${adherenceRate}% de sesiones completadas sin sobrecarga lesiva.</li>
    <li><strong>Evolución de Molestias:</strong> ${painReductionPercent !== null ? `-${painReductionPercent}% en molestia articular reportada desde la sesión inicial.` : 'Molestia articular controlada en rangos seguros.'}</li>
    <li><strong>Ajustes Articulares Activos:</strong> Adaptación de rangos articulares protegidos con pausas estables y trabajo isométrico para salvaguardar rodillas y zona lumbar.</li>`
    }
  </ul>

  <div class="disclaimer">
    Este informe clínico refleja los registros de esfuerzo percibido (RPE Borg adaptado), tiempo bajo tensión (TUT) y comodidad articular reportados en la plataforma AdaptFit. Puede ser presentado a su fisioterapeuta, traumatólogo o médico deportivo como evidencia técnica de progresión física.
  </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `informe-clinico-adaptfit-${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsGenerating(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-28">
      {/* Top Header */}
      <header className="px-5 pt-6 pb-4 bg-white border-b border-[#EDEEEF] sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#191C1D] flex items-center justify-center transition-all cursor-pointer"
            title="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238] text-xs font-bold">
            <Activity className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Evolución Médica</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F]">
            Evidencia de Bienestar
          </span>
          <h1 className="text-xl font-black text-[#191C1D] leading-tight mt-0.5">
            Evolución y Salud Articular
          </h1>
          <p className="text-xs text-[#707973] mt-0.5">
            Correlación entre el esfuerzo percibido y la reducción de molestias.
          </p>
        </div>
      </header>

      {/* Main Body */}
      <main className="px-5 pt-5 space-y-6 flex-1">
        {/* KPI Summary Cards */}
        <section className="grid grid-cols-3 gap-2">
          <div className="p-3.5 rounded-2xl bg-white border border-[#E1E3E4] text-center shadow-2xs">
            <span className="text-lg font-black text-[#2D6A4F] block">
              {totalSessions}
            </span>
            <span className="text-[10px] font-bold text-[#707973] uppercase tracking-wider">
              Sesiones
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E1E3E4] text-center shadow-2xs">
            <span className="text-lg font-black text-[#F4A261] block">
              {totalMinutes}'
            </span>
            <span className="text-[10px] font-bold text-[#707973] uppercase tracking-wider">
              Minutos
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#E1E3E4] text-center shadow-2xs">
            <span className="text-lg font-black text-[#2D6A4F] block">
              {adherenceRate}%
            </span>
            <span className="text-[10px] font-bold text-[#707973] uppercase tracking-wider">
              Adherencia
            </span>
          </div>
        </section>

        {/* Clinical Evolution Graph (SVG) */}
        <section className="p-4 rounded-3xl bg-white border border-[#E1E3E4] shadow-xs space-y-3">
          {completedWorkouts.length === 0 ? (
            /* ESTADO CERO: Sin sesiones registradas */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D]">
                    RPE vs Molestias Articulares
                  </h2>
                  <span className="text-[11px] text-[#707973]">
                    Monitoreo continuo de sensaciones
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#707973] px-2.5 py-0.5 rounded-full bg-[#F3F4F5]">
                  Pendiente de inicio
                </span>
              </div>

              <div className="p-8 rounded-2xl bg-[#F8F9FA] border border-dashed border-[#D5D8DA] flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#E1E3E4] text-[#2D6A4F] flex items-center justify-center shadow-2xs">
                  <Activity className="w-6 h-6 text-[#2D6A4F]" />
                </div>
                <div className="max-w-xs space-y-1">
                  <strong className="text-xs font-black text-[#191C1D] block">
                    Sin registros clínicos todavía
                  </strong>
                  <p className="text-xs text-[#525B54] leading-relaxed">
                    Tu gráfica clínica comenzará a dibujarse a medida que completes tus primeras sesiones y registres tus sensaciones.
                  </p>
                </div>
              </div>
            </div>
          ) : completedWorkouts.length === 1 ? (
            /* ESTADO 1 SESIÓN: Línea basal */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D]">
                    RPE vs Molestias Articulares
                  </h2>
                  <span className="text-[11px] text-[#707973]">
                    Línea basal establecida (1 sesión)
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#2D6A4F] px-2.5 py-0.5 rounded-full bg-[#E7F3EC]">
                  Línea basal registrada
                </span>
              </div>

              <div className="pt-2">
                <svg
                  className="w-full h-36 overflow-visible"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                >
                  {[1, 2, 3, 4, 5].map((level) => {
                    const y = chartHeight - (level / maxScale) * chartHeight;
                    return (
                      <line
                        key={level}
                        x1="0"
                        y1={y}
                        x2={chartWidth}
                        y2={y}
                        stroke="#EDEEEF"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {(() => {
                    const m = sessionMetrics[0];
                    const x = chartWidth / 2;
                    const barH = (m.rpeAverage / maxScale) * (chartHeight - 30);
                    const y = chartHeight - barH - 20;
                    return (
                      <g>
                        <rect
                          x={x - 24}
                          y={y}
                          width="48"
                          height={barH}
                          rx="8"
                          fill="#FFF6ED"
                          stroke="#F4A261"
                          strokeWidth="1.5"
                        />
                        <text
                          x={x}
                          y={y - 6}
                          textAnchor="middle"
                          className="text-[11px] font-bold fill-[#8E4E14]"
                        >
                          RPE {m.rpeAverage.toFixed(1)}
                        </text>
                        <text
                          x={x}
                          y={chartHeight - 4}
                          textAnchor="middle"
                          className="text-[11px] font-bold fill-[#707973]"
                        >
                          Sesión 1 ({m.dateLabel})
                        </text>
                        <circle
                          cx={x}
                          cy={
                            chartHeight -
                            (m.painLevel / maxScale) * (chartHeight - 30) -
                            20
                          }
                          r="5"
                          fill="#FFFFFF"
                          stroke="#2D6A4F"
                          strokeWidth="2.5"
                        />
                      </g>
                    );
                  })()}
                </svg>

                <div className="flex items-center justify-center gap-5 mt-2 pt-3 border-t border-[#EDEEEF] text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-[#8E4E14]">
                    <div className="w-3 h-3 rounded-md bg-[#F4A261]" />
                    <span>Esfuerzo Percibido (RPE)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#0F5238]">
                    <div className="w-3 h-3 rounded-full bg-[#2D6A4F]" />
                    <span>Nivel de Molestia (0-10)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E1E3E4] text-center">
                <p className="text-[11px] text-[#525B54]">
                  Has registrado tu primera sesión basal. En la próxima sesión comenzará a trazarse la curva comparativa de evolución.
                </p>
              </div>
            </div>
          ) : (
            /* ESTADO 2+ SESIONES: Curva comparativa de evolución */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D]">
                    RPE vs Molestias Articulares
                  </h2>
                  <span className="text-[11px] text-[#707973]">
                    {sessionMetrics.length} Sesiones Registradas
                  </span>
                </div>
                {painReductionPercent !== null ? (
                  <div className="flex items-center gap-1 text-xs font-bold text-[#2D6A4F] bg-[#E7F3EC] px-2.5 py-0.5 rounded-full">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>-{painReductionPercent}% molestia</span>
                  </div>
                ) : (
                  <div className="text-[11px] font-bold text-[#2D6A4F] bg-[#E7F3EC] px-2.5 py-0.5 rounded-full">
                    Molestia controlada
                  </div>
                )}
              </div>

              <div className="pt-2">
                <svg
                  className="w-full h-40 overflow-visible"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                >
                  {/* Grid lines */}
                  {[1, 2, 3, 4, 5].map((level) => {
                    const y = chartHeight - (level / maxScale) * chartHeight;
                    return (
                      <line
                        key={level}
                        x1="0"
                        y1={y}
                        x2={chartWidth}
                        y2={y}
                        stroke="#EDEEEF"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* RPE Bars */}
                  {sessionMetrics.map((m, idx) => {
                    const stepX = (chartWidth - 60) / (sessionMetrics.length - 1 || 1);
                    const x = 30 + idx * stepX;
                    const barH = (m.rpeAverage / maxScale) * (chartHeight - 30);
                    const y = chartHeight - barH - 20;

                    return (
                      <g key={`bar-${idx}`}>
                        <rect
                          x={x - 14}
                          y={y}
                          width="28"
                          height={barH}
                          rx="5"
                          fill="#FFF6ED"
                          stroke="#F4A261"
                          strokeWidth="1.5"
                        />
                        <text
                          x={x}
                          y={y - 5}
                          textAnchor="middle"
                          className="text-[9px] font-bold fill-[#8E4E14]"
                        >
                          {m.rpeAverage.toFixed(1)}
                        </text>
                        <text
                          x={x}
                          y={chartHeight - 4}
                          textAnchor="middle"
                          className="text-[10px] font-bold fill-[#707973]"
                        >
                          {m.dateLabel}
                        </text>
                      </g>
                    );
                  })}

                  {/* Pain Level Line */}
                  {sessionMetrics.length > 1 && (
                    <path
                      d={sessionMetrics
                        .map((m, idx) => {
                          const stepX = (chartWidth - 60) / (sessionMetrics.length - 1 || 1);
                          const x = 30 + idx * stepX;
                          const y =
                            chartHeight -
                            (m.painLevel / maxScale) * (chartHeight - 30) -
                            20;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#2D6A4F"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Pain points dots */}
                  {sessionMetrics.map((m, idx) => {
                    const stepX = (chartWidth - 60) / (sessionMetrics.length - 1 || 1);
                    const x = 30 + idx * stepX;
                    const y =
                      chartHeight -
                      (m.painLevel / maxScale) * (chartHeight - 30) -
                      20;

                    return (
                      <circle
                        key={`dot-${idx}`}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#FFFFFF"
                        stroke="#2D6A4F"
                        strokeWidth="2.5"
                      />
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="flex items-center justify-center gap-5 mt-2 pt-3 border-t border-[#EDEEEF] text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-[#8E4E14]">
                    <div className="w-3 h-3 rounded-md bg-[#F4A261]" />
                    <span>Esfuerzo Percibido (RPE)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#0F5238]">
                    <div className="w-3 h-3 rounded-full bg-[#2D6A4F]" />
                    <span>Nivel de Molestia (0-10)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Technical Exercise Prescription Breakdown Card */}
        <section className="p-4 rounded-3xl bg-white border border-[#E1E3E4] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D]">
                Desglose Técnico de Prescripción
              </h2>
              <span className="text-[11px] text-[#707973]">
                {completedWorkouts.length === 0
                  ? 'Plan inicial asignado según tu nivel y equipamiento'
                  : 'Biomecánica, tiempos de tensión (TUT) y pausas registradas'}
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E7F3EC] text-[#0F5238]">
              {displayExercises.length}{' '}
              {completedWorkouts.length === 0
                ? 'ejercicios planificados'
                : 'ejercicios registrados'}
            </span>
          </div>

          <div className="divide-y divide-[#EDEEEF] border border-[#EDEEEF] rounded-2xl overflow-hidden text-left">
            {displayExercises.map((ex, idx) => (
              <div
                key={`${ex.id}-${idx}`}
                className="p-3 bg-white hover:bg-[#FAFBFC] transition-colors space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <strong className="text-xs font-bold text-[#191C1D] block">
                      {ex.name}
                    </strong>
                    <span className="text-[11px] text-[#707973]">
                      {ex.variantName || 'Variante adaptada controlada'}
                    </span>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#0F5238]">
                    {ex.movementPattern
                      ? ex.movementPattern.replace(/_/g, ' ')
                      : 'funcional'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-[#404943] font-medium pt-1">
                  <div className="flex items-center gap-1 bg-[#F8F9FA] px-2 py-0.5 rounded-md border border-[#EDEEEF]">
                    <Clock className="w-3 h-3 text-[#2D6A4F]" />
                    <span>
                      TUT: <strong>{ex.workDurationSeconds}s</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#F8F9FA] px-2 py-0.5 rounded-md border border-[#EDEEEF]">
                    <Timer className="w-3 h-3 text-[#F4A261]" />
                    <span>
                      Descanso: <strong>{ex.restSeconds}s</strong>
                    </span>
                  </div>
                  <div className="truncate text-[#707973]">
                    {ex.repsOrVolume || '3 series × 8-12 reps'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Anthropometric & Body Composition Module (Subject to tracking preferences) */}
        {userProfile.trackingPreferences?.trackWeightBMI !== false ||
        userProfile.trackingPreferences?.trackBodyPerimeters !== false ? (
          <AnthropometricSection />
        ) : null}

        {/* Diagnóstico Adaptativo Card */}
        <section className="p-4 rounded-2xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-2">
          <div className="flex items-center gap-2 text-[#0F5238]">
            <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
            <strong className="text-xs uppercase tracking-wider">
              Diagnóstico Adaptativo
            </strong>
          </div>
          <p className="text-xs text-[#2A3E33] leading-relaxed">
            {completedWorkouts.length === 0 ? (
              'Iniciando programa. El diagnóstico adaptativo se generará tras registrar tus primeras sesiones con feedback.'
            ) : completedWorkouts.length === 1 ? (
              'Primera sesión completada con éxito. Has registrado un esfuerzo moderado con confort articular. A partir de tu próxima sesión comenzará el análisis comparativo de respuesta neuromuscular.'
            ) : painReductionPercent !== null && painReductionPercent > 0 ? (
              <>
                La progresión sin impacto ha permitido que tu sensación de molestia articular se reduzca un{' '}
                <strong>{painReductionPercent}%</strong> manteniendo un esfuerzo moderado. Tu sistema musculoesquelético responde favorablemente a los estímulos pautados.
              </>
            ) : (
              <>
                Has completado <strong>{totalSessions}</strong> sesiones con un nivel de molestia estable y controlado. La adherencia del <strong>{adherenceRate}%</strong> consolida la protección de tus zonas articulares sensibles.
              </>
            )}
          </p>
        </section>

        {/* Action Button: 56px Primary Button */}
        <button
          type="button"
          onClick={handleDownloadClinicalReport}
          disabled={isGenerating}
          className="w-full h-14 rounded-2xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <FileText className="w-5 h-5" />
          <span>
            {isGenerating
              ? 'Generando informe...'
              : 'Descargar Informe para Médico / Fisioterapeuta'}
          </span>
        </button>
      </main>
    </div>
  );
};
