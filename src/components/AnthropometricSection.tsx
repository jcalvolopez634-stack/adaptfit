import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateBMI, MEASUREMENT_GUIDES } from '../utils/anthropometry';
import { BodyMeasurementZone } from '../types';
import {
  Scale,
  Ruler,
  Plus,
  BookOpen,
  X,
  Trash2,
  Calendar,
  CheckCircle2,
  Info,
  TrendingDown,
  TrendingUp,
  Activity,
  Heart,
  ChevronRight,
} from 'lucide-react';

export const AnthropometricSection: React.FC = () => {
  const {
    userProfile,
    anthropometricRecords,
    addAnthropometricRecord,
    deleteAnthropometricRecord,
    updateHeightAndWeight,
  } = useApp();

  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedGuideZone, setSelectedGuideZone] =
    useState<BodyMeasurementZone>('cintura');

  // Form State
  const latestRecord = anthropometricRecords[0];
  const initialWeight = userProfile.weightKg || latestRecord?.weightKg || 70;
  const initialHeight = userProfile.heightCm || latestRecord?.heightCm || 168;

  const [formWeight, setFormWeight] = useState(String(initialWeight));
  const [formHeight, setFormHeight] = useState(String(initialHeight));
  const [formWaist, setFormWaist] = useState(
    latestRecord?.waistCm ? String(latestRecord.waistCm) : ''
  );
  const [formHip, setFormHip] = useState(
    latestRecord?.hipCm ? String(latestRecord.hipCm) : ''
  );
  const [formThigh, setFormThigh] = useState(
    latestRecord?.thighCm ? String(latestRecord.thighCm) : ''
  );
  const [formArm, setFormArm] = useState(
    latestRecord?.armCm ? String(latestRecord.armCm) : ''
  );
  const [formNotes, setFormNotes] = useState('');

  // Active current BMI
  const currentWeight = userProfile.weightKg || latestRecord?.weightKg;
  const currentHeight = userProfile.heightCm || latestRecord?.heightCm;
  const currentAssessment =
    currentWeight && currentHeight
      ? calculateBMI(currentWeight, currentHeight)
      : null;

  // Weight difference
  const oldestRecord =
    anthropometricRecords.length > 1
      ? anthropometricRecords[anthropometricRecords.length - 1]
      : null;
  const weightDifference =
    oldestRecord && latestRecord
      ? Math.round((latestRecord.weightKg - oldestRecord.weightKg) * 10) / 10
      : null;

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(formWeight);
    const h = parseFloat(formHeight);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;

    const assessment = calculateBMI(w, h);

    addAnthropometricRecord({
      date: new Date().toISOString(),
      heightCm: Math.round(h),
      weightKg: Math.round(w * 10) / 10,
      bmi: assessment.bmi,
      bmiCategory: assessment.category,
      waistCm: formWaist ? parseFloat(formWaist) : undefined,
      hipCm: formHip ? parseFloat(formHip) : undefined,
      thighCm: formThigh ? parseFloat(formThigh) : undefined,
      armCm: formArm ? parseFloat(formArm) : undefined,
      notes: formNotes.trim() || undefined,
    });

    setIsNewRecordModalOpen(false);
    setFormNotes('');
  };

  const activeGuide = MEASUREMENT_GUIDES[selectedGuideZone];

  return (
    <section className="space-y-4">
      {/* Header of Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#191C1D]">
              Antropometría y Composición
            </h2>
            <span className="text-[11px] text-[#707973]">
              Evolución corporal sin sesgos
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsGuideModalOpen(true)}
            className="p-2 rounded-xl bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#404943] transition-all flex items-center gap-1 text-xs font-bold"
            title="Guía técnica de cómo medirse"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span className="hidden sm:inline">Guía</span>
          </button>
          <button
            type="button"
            onClick={() => setIsNewRecordModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#2D6A4F] text-white hover:bg-[#0F5238] transition-all flex items-center gap-1 text-xs font-bold shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Medición</span>
          </button>
        </div>
      </div>

      {/* Primary Anthropometric Status Card */}
      <div className="p-4.5 rounded-2xl bg-white border border-[#E1E3E4] shadow-xs space-y-4">
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#EDEEEF]">
            <span className="text-[10px] uppercase font-bold text-[#707973] block">
              Peso Actual
            </span>
            <strong className="text-base font-black text-[#191C1D] block mt-0.5">
              {currentWeight ? `${currentWeight} kg` : '--'}
            </strong>
            {weightDifference !== null && (
              <span
                className={`text-[10px] font-bold flex items-center justify-center gap-0.5 mt-0.5 ${
                  weightDifference <= 0 ? 'text-[#0F5238]' : 'text-[#8E4E14]'
                }`}
              >
                {weightDifference <= 0 ? (
                  <TrendingDown className="w-2.5 h-2.5" />
                ) : (
                  <TrendingUp className="w-2.5 h-2.5" />
                )}
                {weightDifference > 0 ? `+${weightDifference}` : weightDifference} kg
              </span>
            )}
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#EDEEEF]">
            <span className="text-[10px] uppercase font-bold text-[#707973] block">
              Altura
            </span>
            <strong className="text-base font-black text-[#191C1D] block mt-0.5">
              {currentHeight ? `${currentHeight} cm` : '--'}
            </strong>
            <span className="text-[10px] text-[#707973] block mt-0.5">
              Talla base
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#EDEEEF]">
            <span className="text-[10px] uppercase font-bold text-[#707973] block">
              IMC
            </span>
            <strong className="text-base font-black text-[#0F5238] block mt-0.5">
              {currentAssessment ? currentAssessment.bmi : '--'}
            </strong>
            <span className="text-[10px] font-bold text-[#2D6A4F] block mt-0.5 truncate">
              {currentAssessment?.label || 'Sin datos'}
            </span>
          </div>
        </div>

        {/* Mandatory Pedagogical Banner */}
        <div className="p-3.5 rounded-xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#0F5238]">
            <Info className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span className="text-xs font-bold">Enfoque Clínico y Salud Funcional</span>
          </div>
          <p className="text-xs font-bold text-[#0F5238] italic">
            “El IMC es solo una referencia inicial, la composición corporal y la fuerza son lo verdaderamente importante.”
          </p>
          {currentAssessment && (
            <p className="text-[11px] text-[#2A3E33] leading-relaxed">
              {currentAssessment.advice}
            </p>
          )}
        </div>

        {/* Latest Body Circumferences (Contornos) */}
        {latestRecord && (latestRecord.waistCm || latestRecord.hipCm || latestRecord.thighCm || latestRecord.armCm) && (
          <div className="pt-2 border-t border-[#EDEEEF]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#191C1D]">
                Últimos Contornos Registrados
              </span>
              <span className="text-[10px] text-[#707973]">
                {new Date(latestRecord.date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg bg-[#F8F9FA] border border-[#EDEEEF]">
                <span className="text-[9px] uppercase font-bold text-[#707973] block">
                  Cintura
                </span>
                <strong className="text-xs font-black text-[#191C1D]">
                  {latestRecord.waistCm ? `${latestRecord.waistCm} cm` : '-'}
                </strong>
              </div>
              <div className="p-2 rounded-lg bg-[#F8F9FA] border border-[#EDEEEF]">
                <span className="text-[9px] uppercase font-bold text-[#707973] block">
                  Cadera
                </span>
                <strong className="text-xs font-black text-[#191C1D]">
                  {latestRecord.hipCm ? `${latestRecord.hipCm} cm` : '-'}
                </strong>
              </div>
              <div className="p-2 rounded-lg bg-[#F8F9FA] border border-[#EDEEEF]">
                <span className="text-[9px] uppercase font-bold text-[#707973] block">
                  Muslo
                </span>
                <strong className="text-xs font-black text-[#191C1D]">
                  {latestRecord.thighCm ? `${latestRecord.thighCm} cm` : '-'}
                </strong>
              </div>
              <div className="p-2 rounded-lg bg-[#F8F9FA] border border-[#EDEEEF]">
                <span className="text-[9px] uppercase font-bold text-[#707973] block">
                  Brazo
                </span>
                <strong className="text-xs font-black text-[#191C1D]">
                  {latestRecord.armCm ? `${latestRecord.armCm} cm` : '-'}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History List */}
      {anthropometricRecords.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#707973]">
              Historial de Mediciones ({anthropometricRecords.length})
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {anthropometricRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-xl bg-white border border-[#E1E3E4] shadow-2xs flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-black text-[#191C1D]">
                      {rec.weightKg} kg
                    </strong>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E7F3EC] text-[#0F5238]">
                      IMC {rec.bmi}
                    </span>
                    <span className="text-[11px] text-[#707973]">
                      {new Date(rec.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#555E58]">
                    {rec.waistCm && <span>Cintura: {rec.waistCm}cm</span>}
                    {rec.hipCm && <span>Cadera: {rec.hipCm}cm</span>}
                    {rec.thighCm && <span>Muslo: {rec.thighCm}cm</span>}
                    {rec.armCm && <span>Brazo: {rec.armCm}cm</span>}
                  </div>
                  {rec.notes && (
                    <p className="text-[10px] text-[#707973] italic mt-0.5">
                      {rec.notes}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => deleteAnthropometricRecord(rec.id)}
                  className="w-7 h-7 rounded-lg text-[#707973] hover:text-[#BA1A1A] hover:bg-[#FFE8E8] flex items-center justify-center transition-colors"
                  title="Eliminar registro"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Nueva Medición */}
      {isNewRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[#E1E3E4] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDEEEF] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#191C1D]">
                    Nueva Medición Corporal
                  </h3>
                  <span className="text-[11px] text-[#707973]">
                    Ingresa tus valores actualizados
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewRecordModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] flex items-center justify-center text-[#707973]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-3.5">
              {/* Peso y Altura */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#404943] block">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="300"
                    required
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#E1E3E4] bg-[#F8F9FA] text-[#191C1D] font-bold text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#404943] block">
                    Altura (cm) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    required
                    value={formHeight}
                    onChange={(e) => setFormHeight(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#E1E3E4] bg-[#F8F9FA] text-[#191C1D] font-bold text-sm"
                  />
                </div>
              </div>

              {/* Contornos Opcionales */}
              <div className="pt-2 border-t border-[#EDEEEF]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#191C1D]">
                    Contornos con Cinta (cm, opcionales)
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsGuideModalOpen(true)}
                    className="text-[11px] font-bold text-[#2D6A4F] hover:underline flex items-center gap-0.5"
                  >
                    <span>¿Cómo medir?</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-[#707973] block mb-0.5">
                      Cintura (ombligo)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="Ej: 84"
                      value={formWaist}
                      onChange={(e) => setFormWaist(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#E1E3E4] bg-[#F8F9FA] text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#707973] block mb-0.5">
                      Cadera (glúteo)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="Ej: 98"
                      value={formHip}
                      onChange={(e) => setFormHip(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#E1E3E4] bg-[#F8F9FA] text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#707973] block mb-0.5">
                      Muslo medio
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="Ej: 54"
                      value={formThigh}
                      onChange={(e) => setFormThigh(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#E1E3E4] bg-[#F8F9FA] text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#707973] block mb-0.5">
                      Brazo relajado
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="Ej: 29"
                      value={formArm}
                      onChange={(e) => setFormArm(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#E1E3E4] bg-[#F8F9FA] text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="text-[11px] font-semibold text-[#707973] block mb-0.5">
                  Notas u Observaciones (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Medición en ayunas / Buenas sensaciones"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  maxLength={60}
                  className="w-full h-10 px-3 rounded-xl border border-[#E1E3E4] bg-[#F8F9FA] text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-[#2D6A4F] text-white font-bold text-sm hover:bg-[#0F5238] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Registro Antropométrico</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Fichas Técnicas Pedagógicas de Medición */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[#E1E3E4] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDEEEF] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#191C1D]">
                    Guía de Medición Pedagógica
                  </h3>
                  <span className="text-[11px] text-[#707973]">
                    Fichas técnicas con cinta métrica
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGuideModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] flex items-center justify-center text-[#707973]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selector de zona */}
            <div className="grid grid-cols-4 p-1 bg-[#F3F4F5] rounded-xl gap-1">
              {(
                [
                  { id: 'cintura', label: 'Cintura' },
                  { id: 'cadera', label: 'Cadera' },
                  { id: 'muslo', label: 'Muslo' },
                  { id: 'brazo', label: 'Brazo' },
                ] as { id: BodyMeasurementZone; label: string }[]
              ).map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setSelectedGuideZone(z.id)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedGuideZone === z.id
                      ? 'bg-white text-[#2D6A4F] shadow-xs'
                      : 'text-[#707973] hover:text-[#191C1D]'
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>

            {/* Active zone guide content */}
            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#EDEEEF] space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeGuide.icon}</span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F]">
                    Técnica de Medición
                  </span>
                  <h4 className="text-base font-black text-[#191C1D]">
                    {activeGuide.title}
                  </h4>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#191C1D] block">
                  📍 Instrucciones de colocación:
                </span>
                <p className="text-xs text-[#555E58] leading-relaxed">
                  {activeGuide.instruction}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#E7F3EC] border border-[#B1F0CE] space-y-1">
                <span className="text-xs font-bold text-[#0F5238] flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  Consejo clínico de precisión:
                </span>
                <p className="text-xs text-[#2A3E33] leading-relaxed">
                  {activeGuide.tip}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsGuideModalOpen(false)}
              className="w-full h-11 rounded-xl bg-[#2D6A4F] text-white font-bold text-xs flex items-center justify-center"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
