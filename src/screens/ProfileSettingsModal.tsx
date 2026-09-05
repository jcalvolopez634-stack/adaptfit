import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PRESET_AVATARS, UserAvatar } from '../components/UserAvatar';
import {
  AvatarType,
  DayOfWeek,
  TrackingPreferences,
  BiologicalSex,
  FitnessLevel,
  HealthCondition,
  EquipmentAvailableChoice,
  DumbbellType,
} from '../types';
import { calculateBMI } from '../utils/anthropometry';
import {
  X,
  User,
  Camera,
  Upload,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  ShieldCheck,
  Save,
  CalendarDays,
  Scale,
  Ruler,
  CheckSquare,
  Square,
  Activity,
  HeartHandshake,
  Timer,
} from 'lucide-react';

const ALL_DAYS_OF_WEEK: DayOfWeek[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    userProfile,
    saveUserProfile,
    annualPlan,
    setSelectedDays,
    resetOnboarding,
  } = useApp();

  const [name, setName] = useState(userProfile.name || '');
  const [avatarType, setAvatarType] = useState<AvatarType>(
    userProfile.avatarType || 'preset'
  );
  const [avatarValue, setAvatarValue] = useState<string>(
    userProfile.avatarValue || 'avatar_sage'
  );
  const [tabMode, setTabMode] = useState<'preset' | 'photo'>(
    userProfile.avatarType === 'custom_photo' ? 'photo' : 'preset'
  );

  const [height, setHeight] = useState<string>(
    userProfile.heightCm ? String(userProfile.heightCm) : ''
  );
  const [weight, setWeight] = useState<string>(
    userProfile.weightKg ? String(userProfile.weightKg) : ''
  );

  const [localDays, setLocalDays] = useState<DayOfWeek[]>(
    annualPlan.selectedDays || ['Lunes', 'Miércoles', 'Viernes']
  );

  const [trackingPrefs, setTrackingPrefs] = useState<TrackingPreferences>(
    userProfile.trackingPreferences || {
      trackWeightBMI: true,
      trackBodyPerimeters: true,
      trackJointPain: true,
      trackRpeEnergy: true,
      trackRestAndVolume: true,
    }
  );

  const [biologicalSex, setBiologicalSex] = useState<BiologicalSex>(
    userProfile.biologicalSex || 'Mujer'
  );
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(
    userProfile.fitnessLevel || 'Iniciación / Recuperación'
  );
  const [healthConditions, setHealthConditions] = useState<HealthCondition[]>(
    userProfile.healthConditions && userProfile.healthConditions.length > 0
      ? userProfile.healthConditions
      : ['Ninguna']
  );
  const [equipmentAvailable, setEquipmentAvailable] = useState<EquipmentAvailableChoice>(
    userProfile.equipmentAvailable || 'Solo peso corporal y silla'
  );
  const [dumbbellType, setDumbbellType] = useState<DumbbellType>(
    userProfile.dumbbellType || 'fijas'
  );
  const [availableWeightsKg, setAvailableWeightsKg] = useState<number[]>(
    userProfile.availableWeightsKg && userProfile.availableWeightsKg.length > 0
      ? userProfile.availableWeightsKg
      : [1, 2, 3, 4, 5]
  );
  const [customWeightInput, setCustomWeightInput] = useState<string>('');

  const handleAddWeight = (weight: number) => {
    if (weight > 0 && !availableWeightsKg.includes(weight)) {
      setAvailableWeightsKg([...availableWeightsKg, weight].sort((a, b) => a - b));
    }
  };

  const handleRemoveWeight = (weight: number) => {
    setAvailableWeightsKg(availableWeightsKg.filter((w) => w !== weight));
  };

  const toggleCondition = (item: HealthCondition) => {
    if (item === 'Ninguna') {
      setHealthConditions(['Ninguna']);
    } else {
      let filtered = healthConditions.filter((c) => c !== 'Ninguna');
      if (filtered.includes(item)) {
        filtered = filtered.filter((c) => c !== item);
        if (filtered.length === 0) filtered = ['Ninguna'];
      } else {
        filtered.push(item);
      }
      setHealthConditions(filtered);
    }
  };

  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (presetId: string) => {
    setAvatarType('preset');
    setAvatarValue(presetId);
  };

  const handleToggleDay = (day: DayOfWeek) => {
    if (localDays.includes(day)) {
      setLocalDays(localDays.filter((d) => d !== day));
    } else {
      if (localDays.length < annualPlan.daysPerWeek) {
        setLocalDays([...localDays, day]);
      } else {
        setLocalDays([...localDays.slice(1), day]);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        alert('La imagen seleccionada es algo pesada. Elige una foto inferior a 2.5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setAvatarType('custom_photo');
        setAvatarValue(base64);
        setTabMode('photo');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const parsedH = parseFloat(height);
    const parsedW = parseFloat(weight);

    saveUserProfile({
      name: name.trim() || 'Compañero/a',
      avatarType,
      avatarValue,
      heightCm: !isNaN(parsedH) && parsedH > 0 ? Math.round(parsedH) : userProfile.heightCm,
      weightKg: !isNaN(parsedW) && parsedW > 0 ? Math.round(parsedW * 10) / 10 : userProfile.weightKg,
      trackingPreferences: trackingPrefs,
      biologicalSex,
      fitnessLevel,
      healthConditions,
      equipmentAvailable,
      dumbbellType,
      availableWeightsKg: [...availableWeightsKg].sort((a, b) => a - b),
    });

    if (localDays.length === annualPlan.daysPerWeek) {
      setSelectedDays(localDays);
    }

    onClose();
  };

  const handleExecuteReset = () => {
    resetOnboarding();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[#E1E3E4] max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EDEEEF] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#191C1D]">
                Ajustes de Perfil
              </h2>
              <p className="text-[11px] text-[#707973]">
                Personaliza tu nombre y tu avatar
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] flex items-center justify-center text-[#707973] transition-all"
            title="Cerrar ajustes"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Avatar & Name Input */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <UserAvatar
              avatarType={avatarType}
              avatarValue={avatarValue}
              name={name}
              size="lg"
            />
            <div className="flex-1">
              <label
                htmlFor="profile-name-edit"
                className="text-xs font-bold text-[#191C1D] block mb-1"
              >
                ¿Cómo te llamas?
              </label>
              <input
                id="profile-name-edit"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre..."
                maxLength={35}
                className="w-full h-11 px-3.5 rounded-xl bg-[#F8F9FA] border border-[#EDEEEF] focus:border-[#2D6A4F] focus:bg-white text-[#191C1D] text-sm font-bold outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Toggle between Preset and Photo */}
          <div className="grid grid-cols-2 p-1 bg-[#F3F4F5] rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setTabMode('preset')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                tabMode === 'preset'
                  ? 'bg-white text-[#0F5238] shadow-xs'
                  : 'text-[#707973] hover:text-[#191C1D]'
              }`}
            >
              Avatares Ilustrados
            </button>
            <button
              type="button"
              onClick={() => setTabMode('photo')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                tabMode === 'photo'
                  ? 'bg-white text-[#0F5238] shadow-xs'
                  : 'text-[#707973] hover:text-[#191C1D]'
              }`}
            >
              Subir Foto
            </button>
          </div>

          {/* Option A: Preset Avatars */}
          {tabMode === 'preset' ? (
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AVATARS.map((preset) => {
                const isSelected =
                  avatarType === 'preset' && avatarValue === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all text-center relative ${
                      isSelected
                        ? 'border-[#2D6A4F] bg-[#E7F3EC]/50 shadow-2xs'
                        : 'border-[#EDEEEF] bg-[#F8F9FA] hover:border-[#D0D4D2]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    )}
                    <UserAvatar
                      avatarType="preset"
                      avatarValue={preset.id}
                      size="sm"
                    />
                    <span className="text-[10px] font-bold text-[#191C1D] leading-tight">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Option B: Photo Upload */
            <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-dashed border-[#C4C8C5] flex flex-col items-center text-center space-y-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="modal-avatar-photo-upload"
              />

              {avatarType === 'custom_photo' && avatarValue ? (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#2D6A4F]">
                  <img
                    src={avatarValue}
                    alt="Foto actual"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#2D6A4F] text-[#0F5238] font-bold text-xs hover:bg-[#E7F3EC] transition-all flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {avatarType === 'custom_photo' && avatarValue
                    ? 'Elegir otra foto'
                    : 'Subir foto desde dispositivo'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Anthropometric Quick Inputs */}
        <div className="pt-2 border-t border-[#EDEEEF] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Medidas Base (Altura y Peso)</span>
            </span>
            <span className="text-[10px] text-[#707973]">Opcional</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="settings-height-input" className="text-[11px] font-semibold text-[#707973] block mb-1">
                Altura (cm)
              </label>
              <input
                id="settings-height-input"
                type="number"
                min="100"
                max="250"
                placeholder="170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#F8F9FA] border border-[#EDEEEF] text-[#191C1D] text-xs font-bold outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="settings-weight-input" className="text-[11px] font-semibold text-[#707973] block mb-1">
                Peso actual (kg)
              </label>
              <input
                id="settings-weight-input"
                type="number"
                step="0.1"
                min="30"
                max="300"
                placeholder="72.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#F8F9FA] border border-[#EDEEEF] text-[#191C1D] text-xs font-bold outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Clinical Profile & Adaptation Engine Config */}
        <div className="pt-2 border-t border-[#EDEEEF] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Perfil Clínico y Adaptación</span>
            </span>
            <span className="text-[10px] text-[#2D6A4F] font-bold bg-[#E7F3EC] px-2 py-0.5 rounded-md">
              Reglas Activas
            </span>
          </div>

          {/* Sexo Biológico */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#707973] block">
              Sexo Biológico (Biomecánica)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Mujer', 'Hombre'] as BiologicalSex[]).map((sex) => (
                <button
                  key={sex}
                  type="button"
                  onClick={() => setBiologicalSex(sex)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                    biologicalSex === sex
                      ? 'bg-[#2D6A4F] text-white shadow-2xs'
                      : 'bg-[#F8F9FA] border border-[#EDEEEF] text-[#404943] hover:bg-[#EDEEEF]'
                  }`}
                >
                  {sex}
                </button>
              ))}
            </div>
          </div>

          {/* Nivel de Condición Física */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#707973] block">
              Nivel de Condición Física
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  'Iniciación / Recuperación',
                  'Moderado',
                  'Activo habitual',
                ] as FitnessLevel[]
              ).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFitnessLevel(lvl)}
                  className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all text-center leading-tight ${
                    fitnessLevel === lvl
                      ? 'bg-[#2D6A4F] text-white shadow-2xs'
                      : 'bg-[#F8F9FA] border border-[#EDEEEF] text-[#404943] hover:bg-[#EDEEEF]'
                  }`}
                >
                  {lvl === 'Iniciación / Recuperación' ? 'Iniciación' : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Puntos Sensibles / Condiciones de Salud */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#707973] block">
              Zonas de Protección Articular
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {(
                [
                  'Molestia lumbar',
                  'Molestia en rodillas',
                  'Molestia en hombros/cuello',
                  'Problemas de equilibrio',
                  'Ninguna',
                ] as HealthCondition[]
              ).map((cond) => {
                const isSelected = healthConditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#E7F3EC] border border-[#B1F0CE] text-[#0F5238] font-bold'
                        : 'bg-[#F8F9FA] border border-[#EDEEEF] text-[#404943]'
                    }`}
                  >
                    <span>{cond}</span>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center ${
                        isSelected ? 'bg-[#2D6A4F] text-white' : 'border border-[#C4C8C5] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Equipamiento Disponible */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#707973] block">
              Equipamiento Disponible
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {(
                [
                  'Solo peso corporal y silla',
                  'Bandas elásticas',
                  'Mancuernas / Pesos',
                ] as EquipmentAvailableChoice[]
              ).map((eq) => (
                <button
                  key={eq}
                  type="button"
                  onClick={() => setEquipmentAvailable(eq)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between ${
                    equipmentAvailable === eq
                      ? 'bg-[#2D6A4F] text-white font-bold shadow-2xs'
                      : 'bg-[#F8F9FA] border border-[#EDEEEF] text-[#404943]'
                  }`}
                >
                  <span>{eq}</span>
                  {equipmentAvailable === eq && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Inventario de Pesas y Sobrecarga Real */}
          <div className="space-y-2 pt-1 border-t border-[#EDEEEF]">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#191C1D] block">
                Tipo de Carga y Mancuernas
              </label>
              <span className="text-[10px] text-[#707973] font-medium">
                Sobrecarga adaptada
              </span>
            </div>

            {/* Selector de Tipo de Mancuerna */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'fijas', label: 'Pesas fijas' },
                { id: 'ajustables_discos', label: 'Ajustables / discos' },
                { id: 'peso_corporal_solamente', label: 'Solo peso corporal' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDumbbellType(t.id as DumbbellType)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all ${
                    dumbbellType === t.id
                      ? 'bg-[#2D6A4F] text-white shadow-2xs'
                      : 'bg-[#F3F4F5] text-[#404943] hover:bg-[#EDEEEF]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Si tiene pesas, configurar los saltos reales en kg */}
            {dumbbellType !== 'peso_corporal_solamente' && (
              <div className="p-2.5 bg-[#F8F9FA] border border-[#EDEEEF] rounded-xl space-y-2 mt-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#191C1D]">
                    Pesos disponibles en casa (kg):
                  </span>
                  <span className="text-[10px] text-[#707973]">
                    Para sugerencias seguras
                  </span>
                </div>

                {/* Chips de pesos actuales */}
                <div className="flex flex-wrap gap-1.5">
                  {availableWeightsKg.map((w) => (
                    <span
                      key={w}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#2D6A4F]/30 text-[#0F5238] font-bold text-xs shadow-2xs"
                    >
                      <span>{w} kg</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveWeight(w)}
                        className="hover:text-red-500 transition-colors ml-0.5"
                        title="Eliminar peso"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {availableWeightsKg.length === 0 && (
                    <span className="text-[11px] text-[#707973] italic">
                      Añade tus pesos para calibrar las sugerencias.
                    </span>
                  )}
                </div>

                {/* Accesos rápidos de pesos típicos */}
                <div className="flex items-center gap-1 flex-wrap pt-1">
                  <span className="text-[10px] text-[#707973] font-semibold mr-1">
                    Añadir rápido:
                  </span>
                  {[1, 1.5, 2, 3, 4, 5, 6, 8, 10].map((quickW) => (
                    <button
                      key={quickW}
                      type="button"
                      disabled={availableWeightsKg.includes(quickW)}
                      onClick={() => handleAddWeight(quickW)}
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-all ${
                        availableWeightsKg.includes(quickW)
                          ? 'opacity-40 border-transparent bg-transparent text-[#707973]'
                          : 'bg-white border-[#C4C8C5] text-[#191C1D] hover:border-[#2D6A4F] hover:text-[#0F5238]'
                      }`}
                    >
                      +{quickW}k
                    </button>
                  ))}
                </div>

                {/* Input personalizado */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="100"
                    placeholder="Otro (ej: 7.5)"
                    value={customWeightInput}
                    onChange={(e) => setCustomWeightInput(e.target.value)}
                    className="flex-1 h-8 px-2.5 text-xs rounded-lg border border-[#EDEEEF] bg-white text-[#191C1D] outline-hidden focus:border-[#2D6A4F]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = parseFloat(customWeightInput);
                      if (!isNaN(val) && val > 0) {
                        handleAddWeight(val);
                        setCustomWeightInput('');
                      }
                    }}
                    className="h-8 px-3 rounded-lg bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#245840] transition-colors"
                  >
                    Añadir kg
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Workout Days Selector */}
        <div className="pt-2 border-t border-[#EDEEEF] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Días Programados</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                localDays.length === annualPlan.daysPerWeek
                  ? 'bg-[#E7F3EC] text-[#0F5238]'
                  : 'bg-[#FFE8E8] text-[#D32F2F]'
              }`}
            >
              {localDays.length} / {annualPlan.daysPerWeek} días
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ALL_DAYS_OF_WEEK.map((day) => {
              const isSelected = localDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleToggleDay(day)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#2D6A4F] text-white shadow-2xs'
                      : 'bg-[#F3F4F5] text-[#404943] hover:bg-[#EDEEEF]'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-[#707973] leading-relaxed">
            Se sincronizan directamente con la exportación de calendario (.ics) y los recordatorios semanales.
          </p>
        </div>

        {/* Tracking Preferences: Selector de Parámetros a Medir */}
        <div className="pt-2 border-t border-[#EDEEEF] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#191C1D] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Parámetros a Medir (Personalización)</span>
            </span>
            <span className="text-[10px] text-[#2D6A4F] font-bold bg-[#E7F3EC] px-2 py-0.5 rounded-md">
              A tu ritmo
            </span>
          </div>

          <p className="text-[11px] text-[#707973] leading-relaxed">
            Activa solo las métricas que te interesen. AdaptFit ocultará las demás para evitar abrumación en tus reportes y check-ins:
          </p>

          <div className="space-y-1.5">
            {/* 1. Peso e IMC */}
            <button
              type="button"
              onClick={() =>
                setTrackingPrefs((prev) => ({
                  ...prev,
                  trackWeightBMI: !prev.trackWeightBMI,
                }))
              }
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                trackingPrefs.trackWeightBMI
                  ? 'bg-[#E7F3EC]/50 border-[#2D6A4F]/30 text-[#191C1D]'
                  : 'bg-[#F8F9FA] border-[#EDEEEF] text-[#707973] opacity-75'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Scale className={`w-4 h-4 shrink-0 ${trackingPrefs.trackWeightBMI ? 'text-[#2D6A4F]' : 'text-[#A0A5A2]'}`} />
                <div>
                  <span className="text-xs font-bold block leading-tight">Peso e IMC</span>
                  <span className="text-[10px] text-[#707973]">Cálculo de masa y evolución corporal</span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${trackingPrefs.trackWeightBMI ? 'bg-[#2D6A4F] text-white' : 'border border-[#C4C8C5] bg-white'}`}>
                {trackingPrefs.trackWeightBMI && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>

            {/* 2. Perímetros corporales */}
            <button
              type="button"
              onClick={() =>
                setTrackingPrefs((prev) => ({
                  ...prev,
                  trackBodyPerimeters: !prev.trackBodyPerimeters,
                }))
              }
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                trackingPrefs.trackBodyPerimeters
                  ? 'bg-[#E7F3EC]/50 border-[#2D6A4F]/30 text-[#191C1D]'
                  : 'bg-[#F8F9FA] border-[#EDEEEF] text-[#707973] opacity-75'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Ruler className={`w-4 h-4 shrink-0 ${trackingPrefs.trackBodyPerimeters ? 'text-[#2D6A4F]' : 'text-[#A0A5A2]'}`} />
                <div>
                  <span className="text-xs font-bold block leading-tight">Perímetros corporales</span>
                  <span className="text-[10px] text-[#707973]">Cintura, cadera, muslo y brazo</span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${trackingPrefs.trackBodyPerimeters ? 'bg-[#2D6A4F] text-white' : 'border border-[#C4C8C5] bg-white'}`}>
                {trackingPrefs.trackBodyPerimeters && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>

            {/* 3. Registro de dolores / molestias articulares */}
            <button
              type="button"
              onClick={() =>
                setTrackingPrefs((prev) => ({
                  ...prev,
                  trackJointPain: !prev.trackJointPain,
                }))
              }
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                trackingPrefs.trackJointPain
                  ? 'bg-[#E7F3EC]/50 border-[#2D6A4F]/30 text-[#191C1D]'
                  : 'bg-[#F8F9FA] border-[#EDEEEF] text-[#707973] opacity-75'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <HeartHandshake className={`w-4 h-4 shrink-0 ${trackingPrefs.trackJointPain ? 'text-[#2D6A4F]' : 'text-[#A0A5A2]'}`} />
                <div>
                  <span className="text-xs font-bold block leading-tight">Dolores / molestias articulares</span>
                  <span className="text-[10px] text-[#707973]">Check-in articular y correlación clínica</span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${trackingPrefs.trackJointPain ? 'bg-[#2D6A4F] text-white' : 'border border-[#C4C8C5] bg-white'}`}>
                {trackingPrefs.trackJointPain && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>

            {/* 4. RPE y nivel de energía */}
            <button
              type="button"
              onClick={() =>
                setTrackingPrefs((prev) => ({
                  ...prev,
                  trackRpeEnergy: !prev.trackRpeEnergy,
                }))
              }
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                trackingPrefs.trackRpeEnergy
                  ? 'bg-[#E7F3EC]/50 border-[#2D6A4F]/30 text-[#191C1D]'
                  : 'bg-[#F8F9FA] border-[#EDEEEF] text-[#707973] opacity-75'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles className={`w-4 h-4 shrink-0 ${trackingPrefs.trackRpeEnergy ? 'text-[#2D6A4F]' : 'text-[#A0A5A2]'}`} />
                <div>
                  <span className="text-xs font-bold block leading-tight">RPE y nivel de esfuerzo</span>
                  <span className="text-[10px] text-[#707973]">Escala de esfuerzo percibido y vitalidad</span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${trackingPrefs.trackRpeEnergy ? 'bg-[#2D6A4F] text-white' : 'border border-[#C4C8C5] bg-white'}`}>
                {trackingPrefs.trackRpeEnergy && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>

            {/* 5. Tiempos de descanso y volumen */}
            <button
              type="button"
              onClick={() =>
                setTrackingPrefs((prev) => ({
                  ...prev,
                  trackRestAndVolume: !prev.trackRestAndVolume,
                }))
              }
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                trackingPrefs.trackRestAndVolume
                  ? 'bg-[#E7F3EC]/50 border-[#2D6A4F]/30 text-[#191C1D]'
                  : 'bg-[#F8F9FA] border-[#EDEEEF] text-[#707973] opacity-75'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Timer className={`w-4 h-4 shrink-0 ${trackingPrefs.trackRestAndVolume ? 'text-[#2D6A4F]' : 'text-[#A0A5A2]'}`} />
                <div>
                  <span className="text-xs font-bold block leading-tight">Descanso y volumen levantado</span>
                  <span className="text-[10px] text-[#707973]">Cargas, repeticiones y pausas de recuperación</span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${trackingPrefs.trackRestAndVolume ? 'bg-[#2D6A4F] text-white' : 'border border-[#C4C8C5] bg-white'}`}>
                {trackingPrefs.trackRestAndVolume && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          </div>
        </div>

        {/* Reconfigure Evaluation / Reset Section */}
        <div className="pt-2 border-t border-[#EDEEEF] space-y-2">
          {!showConfirmReset ? (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#EDEEEF] text-[#707973] hover:text-[#BA1A1A] hover:border-[#BA1A1A]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar evaluación y volver al Onboarding</span>
            </button>
          ) : (
            <div className="p-3 bg-[#FFF0F0] border border-[#FFDAD6] rounded-xl text-center space-y-2">
              <p className="text-xs text-[#BA1A1A] font-bold">
                ¿Reiniciar tu plan y volver a comenzar?
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={handleExecuteReset}
                  className="px-3 py-1.5 bg-[#BA1A1A] text-white rounded-lg text-xs font-bold"
                >
                  Sí, reiniciar
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-3 py-1.5 bg-white border border-[#EDEEEF] text-[#404943] rounded-lg text-xs font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary Save Button: 56px */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-12 rounded-2xl bg-[#2D6A4F] text-white font-bold text-sm hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Cambios</span>
        </button>
      </div>
    </div>
  );
};
