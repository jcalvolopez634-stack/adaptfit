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
    navigateTo,
    goBack,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeShareTarget, setActiveShareTarget] = useState<Achievement | null>(
    null
  );
  const [inspectingAchievement, setInspectingAchievement] = useState<Achievement | null>(
    null
  );

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

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF6ED] text-[#8E4E14] text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-[#F4A261]" />
            <span>Muro de Victorias</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F]">
            Progreso Real y Cotidiano
          </span>
          <h1 className="text-xl font-black text-[#191C1D] leading-tight mt-0.5">
            Tus Victorias Funcionales
          </h1>
          <p className="text-xs text-[#707973] mt-0.5">
            Logros prácticos alcanzados en tu día a día comprobados por datos o autoevaluación.
          </p>
        </div>
      </header>

      {/* Main Body */}
      <main className="px-5 pt-5 space-y-6 flex-1">
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

        {/* Category Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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
