/**
 * AdaptFit - Pantalla 12: Escudo de Descanso (Gestión de Pausas y Vacaciones)
 * Protección de racha anti-culpa, selector de motivo (salud, vacaciones, cansancio),
 * interruptor reactivo conectado a toggleRestShield() y botón de navegación de 56px.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  HeartHandshake,
  Calendar,
  Sparkles,
  Plane,
  Activity,
  BedDouble,
  Check,
  Info,
} from 'lucide-react';

export const RestShieldScreen: React.FC = () => {
  const {
    restShield,
    toggleRestShield,
    streakWeeks,
    navigateTo,
    goBack,
  } = useApp();

  const [selectedReason, setSelectedReason] = useState<string>(
    'Salud / Recuperación médica'
  );

  const reasons = [
    {
      id: 'salud',
      label: 'Salud / Recuperación médica',
      icon: Activity,
      description: 'Permite desinflamar articulaciones o reposo clínico indicado.',
    },
    {
      id: 'vacaciones',
      label: 'Vacaciones / Viaje',
      icon: Plane,
      description: 'Disfruta de tus viajes sin la preocupación de perder tu racha acumulada.',
    },
    {
      id: 'cansancio',
      label: 'Cansancio acumulado',
      icon: BedDouble,
      description: 'Días de recuperación activa y sueño reparador para evitar fatiga.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-28">
      {/* Top Header */}
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

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              restShield.isActive
                ? 'bg-[#E7F3EC] text-[#0F5238]'
                : 'bg-[#FFF6ED] text-[#8E4E14]'
            }`}
          >
            {restShield.isActive ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-[#F4A261]" />
            )}
            <span>
              {restShield.isActive ? 'Escudo ON' : 'Escudo Disponible'}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F]">
            Compromiso sin Culpa
          </span>
          <h1 className="text-xl font-black text-[#191C1D] leading-tight mt-0.5">
            Escudo de Descanso
          </h1>
          <p className="text-xs text-[#707973] mt-0.5">
            Pausa tu calendario sin perder tu racha de {streakWeeks} semanas ni tu progreso anual.
          </p>
        </div>
      </header>

      {/* Main Body */}
      <main className="px-5 pt-5 space-y-6 flex-1">
        {/* Shield Status Hero Card */}
        <section
          className={`p-5 rounded-3xl border transition-all shadow-xs ${
            restShield.isActive
              ? 'bg-gradient-to-br from-[#E7F3EC] to-white border-[#B1F0CE]'
              : 'bg-white border-[#E1E3E4]'
          }`}
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                  restShield.isActive
                    ? 'bg-[#2D6A4F] text-white'
                    : 'bg-[#FFF6ED] text-[#8E4E14]'
                }`}
              >
                {restShield.isActive ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : (
                  <ShieldAlert className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#191C1D] leading-tight">
                  {restShield.isActive
                    ? 'Protección Activa de Racha'
                    : 'Elige cuándo activar tu pausa'}
                </h3>
                <span className="text-xs text-[#707973] block mt-0.5">
                  {restShield.isActive
                    ? `${restShield.daysRemaining} días restantes protegidos`
                    : 'Dispones de 7 días de congelación'}
                </span>
              </div>
            </div>

            {/* Interactive Toggle Switch */}
            <button
              type="button"
              onClick={toggleRestShield}
              className={`w-14 h-8 rounded-full p-1 transition-colors relative duration-200 shrink-0 ${
                restShield.isActive ? 'bg-[#2D6A4F]' : 'bg-[#E1E3E4]'
              }`}
              title="Activar o desactivar escudo"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  restShield.isActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-3 bg-white/80 rounded-2xl border border-[#EDEEEF] text-xs text-[#404943] leading-relaxed">
            {restShield.isActive
              ? 'Tu racha está congelada. Puedes volver a entrenar cuando tu cuerpo esté preparado sin perder ningún hito de consistencia.'
              : 'El escudo asegura que tu racha se mantenga intacta durante imprevistos, descansos prescritos o vacaciones familiares.'}
          </div>
        </section>

        {/* Reason Selector */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#191C1D]">
              Motivo de la Pausa
            </h2>
            <span className="text-xs text-[#707973]">Selecciona el tuyo</span>
          </div>

          <div className="space-y-2.5">
            {reasons.map((item) => {
              const isSelected = selectedReason === item.label;
              const IconComp = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedReason(item.label)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-[#FFF6ED] border-[#F4A261] ring-2 ring-[#F4A261]/20'
                      : 'bg-white border-[#E1E3E4] hover:bg-[#F8F9FA]'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#F4A261] text-white'
                        : 'bg-[#F3F4F5] text-[#707973]'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <strong className="text-xs font-bold text-[#191C1D]">
                        {item.label}
                      </strong>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#404943] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Anti-Guilt Pedagogy Section */}
        <section className="p-4 rounded-2xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-2.5">
          <div className="flex items-center gap-2 text-[#0F5238]">
            <HeartHandshake className="w-4 h-4 text-[#2D6A4F]" />
            <strong className="text-xs uppercase tracking-wider">
              Filosofía AdaptFit: Cero Culpa
            </strong>
          </div>
          <p className="text-xs text-[#2A3E33] leading-relaxed">
            El verdadero éxito a largo plazo es la sostenibilidad. Descansar conscientemente cuando el cuerpo lo necesita previene lesiones articulares y garantiza que tu hábito perdure año tras año.
          </p>
        </section>
      </main>

      {/* Fixed Bottom Action Bar: 56px Primary Button */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#EDEEEF] p-4 z-40 shadow-lg">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="w-full h-14 rounded-2xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md transition-all duration-200"
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>Guardar y volver al inicio</span>
        </button>
      </footer>
    </div>
  );
};
