/**
 * AdaptFit - Pantalla 9: Muro de Victorias y Logros Cotidianos
 * Contador visual por categorías (Hitos Destacados, Constancia, Bienestar Real),
 * tarjetas de victorias funcionales y apertura del generador de tarjetas para compartir.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Achievement } from '../types';
import { ShareCardModal } from './ShareCardModal';
import {
  Trophy,
  ArrowLeft,
  Share2,
  Calendar,
  Smile,
  Footprints,
  Sparkles,
  CheckCircle2,
  Medal,
  Home,
  Lock,
  HelpCircle,
  Check,
  X,
  AlertCircle,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Activity,
  FileText,
  Plus,
  Heart,
  ChevronRight,
} from 'lucide-react';

export const VictoriesWallScreen: React.FC = () => {
  const {
    achievements,
    openShareModal,
    shareModalAchievement,
    closeShareModal,
    activeFunctionalTestQuestion,
    openFunctionalTestQuestion,
    closeFunctionalTestQuestion,
    submitFunctionalTestAnswer,
    functionalTestNotification,
    clearFunctionalTestNotification,
    userProfile,
    completedWorkouts,
    downloadClinicalReportPDF,
    navigateTo,
    goBack,
  } = useApp();

  const [activeMainTab, setActiveMainTab] = useState<'semaforo' | 'victorias'>('victorias');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeShareTarget, setActiveShareTarget] = useState<Achievement | null>(null);
  const [inspectingAchievement, setInspectingAchievement] = useState<Achievement | null>(null);
  const [isAddVictoryModalOpen, setIsAddVictoryModalOpen] = useState(false);
  const [newVictoryTitle, setNewVictoryTitle] = useState('');
  const [newVictoryDesc, setNewVictoryDesc] = useState('');
  const [customVictories, setCustomVictories] = useState<Array<{ id: string; title: string; desc: string; date: string }>>([
    {
      id: 'cust-1',
      title: 'Subir al 2º piso sin agarrarme del pasamanos',
      desc: 'Subida firme y sin chasquido en rodillas.',
      date: 'Esta semana',
    },
    {
      id: 'cust-2',
      title: 'Levantarme del sillón a la primera',
      desc: 'Sin balanceo brusco ni apoyo de las manos.',
      date: 'Hace 3 días',
    },
  ]);

  const categories = ['todos', 'Hito Destacado', 'Constancia', 'Bienestar'];

  const filteredAchievements =
    selectedCategory === 'todos'
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  const totalUnlocked = achievements.filter((a) => a.unlocked).length;

  const handleOpenShare = (ach: Achievement) => {
    setActiveShareTarget(ach);
    openShareModal(ach);
  };

  const handleCardClick = (ach: Achievement) => {
    if (ach.unlocked) {
      handleOpenShare(ach);
    } else if (ach.verificationType === 'functional_test') {
      const q = ach.functionalQuestion || {
        id: `q-${ach.id}`,
        achievementId: ach.id,
        milestoneLabel: ach.timeAgo || 'Hito de Bienestar Real',
        questionText: `¿Pudiste realizar hoy la actividad "${ach.title}" en tu día a día sin molestias articulares?`,
        yesLabel: 'Sí, lo logré',
        noLabel: 'Todavía me cuesta',
        explanation: ach.description,
      };
      openFunctionalTestQuestion(q);
    } else {
      setInspectingAchievement(ach);
    }
  };

  const handleAddCustomVictory = () => {
    if (!newVictoryTitle.trim()) return;
    setCustomVictories((prev) => [
      {
        id: `cust-${Date.now()}`,
        title: newVictoryTitle.trim(),
        desc: newVictoryDesc.trim() || 'Logro funcional alcanzado en mi día a día.',
        date: 'Hoy',
      },
      ...prev,
    ]);
    setNewVictoryTitle('');
    setNewVictoryDesc('');
    setIsAddVictoryModalOpen(false);
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'Stairs':
        return <Footprints className="w-5 h-5 text-[#8E4E14]" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-[#2D6A4F]" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-[#3A86C8]" />;
      default:
        return <Trophy className="w-5 h-5 text-[#F4A261]" />;
    }
  };

  // Semáforo Articular Data Builder
  const conditions = userProfile.healthConditions || [];
  const discomforts = userProfile.discomfortZones || [];

  const allSafetyIncidents = completedWorkouts.flatMap((w) => w.safetyIncidents || []);
  const safeSessionsCount = completedWorkouts.length;

  const jointsSemaforo = [
    {
      id: 'rodillas',
      name: 'Rodillas (Femoropatelar)',
      isAffected:
        conditions.includes('Molestia en rodillas') ||
        discomforts.includes('rodillas'),
      recentIncident: allSafetyIncidents.some((i) =>
        i.exerciseTitle.toLowerCase().includes('sentadilla') ||
        i.reason.toLowerCase().includes('rodilla')
      ),
      activeProtectionRule: 'Protocolo Cero Impacto • Rango ≤90° con silla de descarga',
      clinicalDetail: 'Variantes con apoyo bipodal, descarga femoropatelar activa y sentadillas asistidas.',
      safeSessions: safeSessionsCount,
    },
    {
      id: 'cadera',
      name: 'Cadera (Coxofemoral y Pélvica)',
      isAffected:
        conditions.includes('Molestia o limitación en cadera') ||
        discomforts.includes('cadera'),
      recentIncident: allSafetyIncidents.some((i) =>
        i.exerciseTitle.toLowerCase().includes('cadera') ||
        i.reason.toLowerCase().includes('cadera')
      ),
      activeProtectionRule: 'Bisagra pélvica protegida • Evitar flexión forzada >90°',
      clinicalDetail: 'Activación del glúteo medio, puentes de glúteo asistidos y rotación fisiológica neutra.',
      safeSessions: safeSessionsCount,
    },
    {
      id: 'espalda_lumbar',
      name: 'Espalda Lumbar (Columna)',
      isAffected:
        conditions.includes('Molestia lumbar (espalda baja)') ||
        discomforts.includes('espalda_lumbar'),
      recentIncident: allSafetyIncidents.some((i) =>
        i.reason.toLowerCase().includes('lumbar') ||
        i.exerciseTitle.toLowerCase().includes('lumbar')
      ),
      activeProtectionRule: 'Eje neutro sin flexión con carga • Apoyo en pared / silla',
      clinicalDetail: 'Co-activación del transverso abdominal y suelo pélvico sin torsiones explosivas.',
      safeSessions: safeSessionsCount,
    },
    {
      id: 'hombros',
      name: 'Hombros y Cuello (Escapulotorácica)',
      isAffected:
        conditions.includes('Molestia en hombros / cuello') ||
        discomforts.includes('hombros') ||
        discomforts.includes('cuello'),
      recentIncident: allSafetyIncidents.some((i) =>
        i.reason.toLowerCase().includes('hombro') ||
        i.reason.toLowerCase().includes('cuello')
      ),
      activeProtectionRule: 'Plano escapular a 30° • Sin press vertical cerrado',
      clinicalDetail: 'Rango subacromial libre, elevaciones en diagonal y retracción escapular asistida.',
      safeSessions: safeSessionsCount,
    },
    {
      id: 'equilibrio',
      name: 'Equilibrio y Estabilidad Bipodal',
      isAffected: conditions.includes('Problemas de equilibrio'),
      recentIncident: false,
      activeProtectionRule: 'Base de sustentación amplia • Apoyo manual preventivo',
      clinicalDetail: 'Ejercicios con referencia táctil continua (pared o respaldo de silla firme).',
      safeSessions: safeSessionsCount,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-28">
      {/* Top Header */}
      <header className="px-5 pt-6 pb-4 bg-white border-b border-[#EDEEEF] sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="w-9 h-9 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#191C1D] flex items-center justify-center transition-all"
            title="Volver a inicio"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238] text-xs font-bold border border-[#B1F0CE]">
            <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Progreso & Salud Articular</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F]">
            Evolución Funcional Adaptada
          </span>
          <h1 className="text-xl font-black text-[#191C1D] leading-tight mt-0.5">
            {activeMainTab === 'semaforo' ? 'Semáforo Articular' : 'Muro de Victorias'}
          </h1>
          <p className="text-xs text-[#707973] mt-0.5">
            {activeMainTab === 'semaforo'
              ? 'Supervisión biomecánica en tiempo real de cada una de tus articulaciones.'
              : 'Logros prácticos y bienestar cotidiano comprobados por autoevaluación.'}
          </p>
        </div>

        {/* Tab Switcher: Victorias Cotidianas vs Semáforo Articular */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F3F4F5] rounded-2xl mt-3">
          <button
            type="button"
            onClick={() => setActiveMainTab('victorias')}
            className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeMainTab === 'victorias'
                ? 'bg-white text-[#0F5238] shadow-xs'
                : 'text-[#707973] hover:text-[#191C1D]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Muro de Victorias</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('semaforo')}
            className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeMainTab === 'semaforo'
                ? 'bg-white text-[#0F5238] shadow-xs'
                : 'text-[#707973] hover:text-[#191C1D]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Semáforo Articular</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="px-5 pt-5 space-y-6 flex-1">
        {activeMainTab === 'semaforo' ? (
          /* ========================================================= */
          /* VISTA: SEMÁFORO ARTICULAR                                 */
          /* ========================================================= */
          <div className="space-y-4">
            {/* Cabecera Informativa del Semáforo */}
            <div className="p-4 rounded-3xl bg-white border border-[#E1E3E4] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-[#191C1D] uppercase tracking-wider">
                      Estado de Protección Articular
                    </h2>
                    <span className="text-[11px] text-[#707973]">
                      Supervisión médica según tus zonas declaradas
                    </span>
                  </div>
                </div>
              </div>

              {/* Leyenda de los 3 Colores */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#EDEEEF] text-center">
                <div className="p-2 rounded-xl bg-[#E7F3EC] border border-[#B1F0CE]">
                  <span className="w-2 h-2 rounded-full bg-[#2D6A4F] inline-block mb-1" />
                  <span className="text-[10px] font-black text-[#0F5238] block">VERDE</span>
                  <span className="text-[9px] text-[#525B54] block">Óptimo y libre</span>
                </div>
                <div className="p-2 rounded-xl bg-[#FFF6ED] border border-[#FFDCC4]">
                  <span className="w-2 h-2 rounded-full bg-[#F4A261] inline-block mb-1" />
                  <span className="text-[10px] font-black text-[#8E4E14] block">ÁMBAR</span>
                  <span className="text-[9px] text-[#8E4E14] block">Protección activa</span>
                </div>
                <div className="p-2 rounded-xl bg-[#FDE8E8] border border-[#F8B4B4]">
                  <span className="w-2 h-2 rounded-full bg-[#E53E3E] inline-block mb-1" />
                  <span className="text-[10px] font-black text-[#9B1C1C] block">ROJO</span>
                  <span className="text-[9px] text-[#9B1C1C] block">Descarga preventiva</span>
                </div>
              </div>
            </div>

            {/* Listado de Articulaciones con su Semáforo */}
            <div className="space-y-3">
              {jointsSemaforo.map((j) => {
                const statusColor = j.recentIncident
                  ? 'rojo'
                  : j.isAffected
                  ? 'ambar'
                  : 'verde';

                return (
                  <div
                    key={j.id}
                    className="p-4 rounded-3xl bg-white border border-[#E1E3E4] space-y-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3 h-3 rounded-full shrink-0 ${
                              statusColor === 'rojo'
                                ? 'bg-[#E53E3E] ring-4 ring-[#FDE8E8]'
                                : statusColor === 'ambar'
                                ? 'bg-[#F4A261] ring-4 ring-[#FFF6ED]'
                                : 'bg-[#2D6A4F] ring-4 ring-[#E7F3EC]'
                            }`}
                          />
                          <h3 className="text-xs sm:text-sm font-black text-[#191C1D]">
                            {j.name}
                          </h3>
                        </div>
                        <span
                          className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1.5 ${
                            statusColor === 'rojo'
                              ? 'bg-[#FDE8E8] text-[#9B1C1C]'
                              : statusColor === 'ambar'
                              ? 'bg-[#FFF6ED] text-[#8E4E14]'
                              : 'bg-[#E7F3EC] text-[#0F5238]'
                          }`}
                        >
                          {statusColor === 'rojo'
                            ? 'Descarga Preventiva Aplicada'
                            : statusColor === 'ambar'
                            ? 'Protección Biomecánica Activa'
                            : 'Rango Óptimo y Libre de Tensión'}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-[#2D6A4F] block">
                          {j.safeSessions} ses.
                        </span>
                        <span className="text-[9px] text-[#707973] block">seguras</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#EDEEEF] text-xs space-y-1">
                      <div className="text-[11px] font-bold text-[#191C1D] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
                        <span>{j.activeProtectionRule}</span>
                      </div>
                      <p className="text-[11px] text-[#525B54] leading-relaxed">
                        {j.clinicalDetail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Acceso Directo al Informe Clínico PDF */}
            <div className="p-4 rounded-3xl bg-[#E7F3EC]/70 border border-[#B1F0CE] flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0F5238]">
                    Informe Clínico Completo
                  </h4>
                  <span className="text-[11px] text-[#2D6A4F] block">
                    Descarga en tiempo real para tu médico o fisio
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={downloadClinicalReportPDF}
                className="px-3.5 py-2 rounded-xl bg-[#2D6A4F] hover:bg-[#0F5238] text-white font-bold text-xs shadow-2xs transition-all active:scale-95 shrink-0"
              >
                Descargar
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* VISTA: MURO DE VICTORIAS COTIDIANAS                      */
          /* ========================================================= */
          <div className="space-y-5">
            {/* Verification Feedback Banner if active */}
            {functionalTestNotification && (
              <div className="p-4 rounded-2xl bg-[#E7F3EC] border border-[#B1F0CE] flex items-start gap-3 shadow-xs">
                <Sparkles className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
                <div className="flex-1 text-xs text-[#0F5238] leading-relaxed">
                  <strong className="block font-bold mb-0.5">Resultado de Autoevaluación</strong>
                  <p>{functionalTestNotification}</p>
                </div>
                <button
                  type="button"
                  onClick={clearFunctionalTestNotification}
                  className="w-6 h-6 rounded-full hover:bg-black/5 flex items-center justify-center text-[#0F5238]"
                  title="Cerrar aviso"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Metric Overview Card */}
            <section className="p-4 rounded-3xl bg-gradient-to-br from-[#E7F3EC] via-white to-[#FFF6ED] border border-[#B1F0CE] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-[#2D6A4F]" />
                  <span className="text-xs font-bold text-[#0F5238] uppercase tracking-wider">
                    Resumen de Logros
                  </span>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#2D6A4F] text-white">
                  {totalUnlocked} de {achievements.length} Desbloqueados
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-white/90 rounded-2xl border border-[#EDEEEF]">
                  <span className="text-base font-black text-[#8E4E14] block">
                    {achievements.filter((a) => a.category === 'Hito Destacado' && a.unlocked).length}
                  </span>
                  <span className="text-[10px] font-bold text-[#707973]">Hitos</span>
                </div>
                <div className="p-2.5 bg-white/90 rounded-2xl border border-[#EDEEEF]">
                  <span className="text-base font-black text-[#2D6A4F] block">
                    {achievements.filter((a) => a.category === 'Constancia' && a.unlocked).length}
                  </span>
                  <span className="text-[10px] font-bold text-[#707973]">Constancia</span>
                </div>
                <div className="p-2.5 bg-white/90 rounded-2xl border border-[#EDEEEF]">
                  <span className="text-base font-black text-[#3A86C8] block">
                    {achievements.filter((a) => a.category === 'Bienestar' && a.unlocked).length}
                  </span>
                  <span className="text-[10px] font-bold text-[#707973]">Bienestar</span>
                </div>
              </div>
            </section>

            {/* Registrar Victoria Cotidiana Botón Rápido */}
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#191C1D]">
                Victorias de tu Vida Diaria
              </h2>
              <button
                type="button"
                onClick={() => setIsAddVictoryModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-[#0F5238] active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar victoria</span>
              </button>
            </div>

            {/* Victorias Cotidianas del Usuario */}
            {customVictories.length > 0 && (
              <div className="space-y-2.5">
                {customVictories.map((v) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#B1F0CE] shadow-2xs flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#0F5238] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#191C1D]">{v.title}</h4>
                        <p className="text-[11px] text-[#525B54] mt-0.5">{v.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#0F5238] shrink-0">
                      {v.date}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Category Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                      isSelected
                        ? 'bg-[#2D6A4F] text-white shadow-xs'
                        : 'bg-white border border-[#E1E3E4] text-[#707973] hover:text-[#191C1D]'
                    }`}
                  >
                    {cat === 'todos' ? 'Todos los logros' : cat}
                  </button>
                );
              })}
            </div>

            {/* Achievement Cards List */}
            <section className="space-y-3">
              {filteredAchievements.map((ach) => {
                const isUnlocked = ach.unlocked;
                const isFunctional = ach.verificationType === 'functional_test';

                return (
                  <div
                    key={ach.id}
                    onClick={() => handleCardClick(ach)}
                    className={`p-4 rounded-3xl border shadow-xs space-y-3 transition-all cursor-pointer ${
                      isUnlocked
                        ? 'bg-white border-[#E1E3E4] hover:border-[#B1F0CE]'
                        : isFunctional
                        ? 'bg-white border-[#FFE3CA] hover:border-[#F4A261] hover:shadow-sm'
                        : 'bg-[#F8F9FA] border-[#EDEEEF] opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                            isUnlocked
                              ? 'bg-[#FFF6ED]'
                              : isFunctional
                              ? 'bg-[#FFF2E2]'
                              : 'bg-[#EDEEEF]'
                          }`}
                        >
                          {renderIcon(ach.badgeIcon)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isUnlocked
                                  ? 'bg-[#E7F3EC] text-[#0F5238]'
                                  : isFunctional
                                  ? 'bg-[#FFE8D6] text-[#8E4E14]'
                                  : 'bg-[#EDEEEF] text-[#707973]'
                              }`}
                            >
                              {ach.category}
                            </span>
                            <span className="text-[10px] text-[#707973]">
                              {isUnlocked ? `• ${ach.timeAgo}` : '• Por desbloquear'}
                            </span>
                          </div>
                          <h3
                            className={`text-sm font-extrabold leading-tight ${
                              isUnlocked ? 'text-[#191C1D]' : 'text-[#404943]'
                            }`}
                          >
                            {ach.title}
                          </h3>
                        </div>
                      </div>

                      {isUnlocked ? (
                        <div className="w-6 h-6 rounded-full bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : isFunctional ? (
                        <div className="px-2 py-1 rounded-full bg-[#FFF6ED] text-[#8E4E14] text-[10px] font-bold flex items-center gap-1 shrink-0">
                          <HelpCircle className="w-3 h-3 text-[#E76F51]" />
                          <span>Test</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#EDEEEF] text-[#707973] flex items-center justify-center shrink-0">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-[#404943] leading-relaxed">
                      {ach.description}
                    </p>

                    {/* Status Footer */}
                    {isUnlocked ? (
                      <div className="pt-2 border-t border-[#EDEEEF] flex items-center justify-between">
                        <span className="text-[10px] text-[#2D6A4F] font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#F4A261]" />
                          <span>Verificado por bienestar real</span>
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenShare(ach);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#FFF6ED] hover:bg-[#F4A261] text-[#8E4E14] hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Compartir</span>
                        </button>
                      </div>
                    ) : isFunctional ? (
                      <div className="pt-2 border-t border-[#FEEAD6] flex items-center justify-between">
                        <span className="text-[10px] text-[#8E4E14] font-medium flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 text-[#E76F51]" />
                          <span>Pulsa para evaluar en tu vida real</span>
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(ach);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#2D6A4F] text-white font-bold text-xs flex items-center gap-1 shadow-2xs hover:bg-[#0F5238] transition-all active:scale-95"
                        >
                          <span>Hacer Test</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-[#EDEEEF] flex items-center justify-between text-[11px] text-[#707973]">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Automático por sesiones completadas</span>
                        </span>
                        {ach.targetMetricValue && (
                          <span className="font-bold text-[#191C1D]">
                            {ach.currentMetricValue || 0} / {ach.targetMetricValue}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          </div>
        )}

        {/* Action Button: 56px Primary Button */}
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="w-full h-14 rounded-2xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md transition-all duration-200"
        >
          <Home className="w-5 h-5" />
          <span>Volver al Dashboard Principal</span>
        </button>
      </main>

      {/* Modal para Registrar Victoria Cotidiana */}
      {isAddVictoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-[#E1E3E4] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] flex items-center justify-center text-[#0F5238]">
                  <Trophy className="w-4 h-4 text-[#2D6A4F]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F5238]">
                  Nueva Victoria Cotidiana
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddVictoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] flex items-center justify-center text-[#707973]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#191C1D] block mb-1">
                  ¿Qué hito funcional has logrado hoy?
                </label>
                <input
                  type="text"
                  placeholder="Ej: Caminar 20 min sin dolor de cadera"
                  value={newVictoryTitle}
                  onChange={(e) => setNewVictoryTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E1E3E4] text-xs text-[#191C1D] focus:outline-none focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#191C1D] block mb-1">
                  Detalle o sensación (opcional)
                </label>
                <textarea
                  placeholder="Ej: Subí con la compra sin tensión lumbar ni necesidad de pararme."
                  value={newVictoryDesc}
                  onChange={(e) => setNewVictoryDesc(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-[#E1E3E4] text-xs text-[#191C1D] focus:outline-none focus:border-[#2D6A4F] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddVictoryModalOpen(false)}
                className="flex-1 h-11 rounded-xl bg-[#F3F4F5] text-[#707973] font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddCustomVictory}
                disabled={!newVictoryTitle.trim()}
                className="flex-1 h-11 rounded-xl bg-[#2D6A4F] hover:bg-[#0F5238] text-white font-bold text-xs disabled:opacity-50"
              >
                Guardar Victoria
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Functional Test Assessment Interactive Modal */}
      {activeFunctionalTestQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-[#E1E3E4] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF6ED] flex items-center justify-center text-[#E76F51]">
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8E4E14]">
                  Test de Bienestar Real
                </span>
              </div>
              <button
                type="button"
                onClick={closeFunctionalTestQuestion}
                className="w-8 h-8 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] flex items-center justify-center text-[#707973]"
                title="Cerrar test"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#0F5238]">
                {activeFunctionalTestQuestion.milestoneLabel}
              </span>
              <p className="text-sm text-[#191C1D] font-bold mt-2 leading-relaxed bg-[#F8F9FA] p-3 rounded-2xl border border-[#E1E3E4]">
                &quot;{activeFunctionalTestQuestion.questionText}&quot;
              </p>
            </div>

            <p className="text-[11px] text-[#707973] leading-relaxed">
              {activeFunctionalTestQuestion.explanation ||
                'La ganancia funcional se evalúa en pequeños gestos cotidianos. Sé sincero: si aún no lo logras, la constancia semanal te llevará ahí sin forzar.'}
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  submitFunctionalTestAnswer(activeFunctionalTestQuestion.achievementId, true)
                }
                className="w-full h-12 rounded-2xl bg-[#2D6A4F] hover:bg-[#0F5238] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{activeFunctionalTestQuestion.yesLabel || 'Sí, lo logré'}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  submitFunctionalTestAnswer(activeFunctionalTestQuestion.achievementId, false)
                }
                className="w-full h-12 rounded-2xl bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#404943] font-bold text-sm flex items-center justify-center transition-all active:scale-[0.98]"
              >
                <span>{activeFunctionalTestQuestion.noLabel || 'Todavía me cuesta'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspecting Non-Test Locked Achievement Modal */}
      {inspectingAchievement && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3 border border-[#E1E3E4]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#707973]">
                Logro en Progreso
              </span>
              <button
                type="button"
                onClick={() => setInspectingAchievement(null)}
                className="w-7 h-7 rounded-full bg-[#F3F4F5] flex items-center justify-center text-[#707973]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <h3 className="text-sm font-extrabold text-[#191C1D]">
              {inspectingAchievement.title}
            </h3>
            <p className="text-xs text-[#555E58] leading-relaxed">
              {inspectingAchievement.description}
            </p>
            <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#EDEEEF] text-xs space-y-1">
              <span className="text-[#707973] block text-[11px]">Validación automática:</span>
              <strong className="text-[#191C1D] block">
                Progreso actual: {inspectingAchievement.currentMetricValue || 0} de{' '}
                {inspectingAchievement.targetMetricValue || 1} sesiones requeridas.
              </strong>
            </div>
            <button
              type="button"
              onClick={() => setInspectingAchievement(null)}
              className="w-full h-11 rounded-xl bg-[#2D6A4F] text-white font-bold text-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Share Card Modal if active */}
      {(activeShareTarget || shareModalAchievement) && (
        <ShareCardModal
          achievement={activeShareTarget || shareModalAchievement}
          onClose={() => {
            setActiveShareTarget(null);
            closeShareModal();
          }}
        />
      )}
    </div>
  );
};

