import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PRESET_AVATARS, UserAvatar } from '../components/UserAvatar';
import { AvatarType } from '../types';
import {
  User,
  Camera,
  Upload,
  Check,
  ArrowRight,
  Sparkles,
  Heart,
  Smile,
  ShieldCheck,
} from 'lucide-react';

export const OnboardingWelcomeScreen: React.FC = () => {
  const { userProfile, saveUserProfile, navigateTo } = useApp();

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectPreset = (presetId: string) => {
    setAvatarType('preset');
    setAvatarValue(presetId);
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

  const handleContinue = () => {
    const trimmedName = name.trim() || 'Compañero/a';
    saveUserProfile({
      name: trimmedName,
      avatarType,
      avatarValue,
      onboardingStep: 1,
    });
    navigateTo('onboarding_limitations');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#E1E3E4] font-sans pb-8">
      {/* Top Header */}
      <header className="px-5 pt-7 pb-4 bg-white border-b border-[#EDEEEF] sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center font-black text-sm shadow-sm">
              AF
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
              AdaptFit
            </span>
          </div>

          <div className="px-3 py-1 rounded-full bg-[#E7F3EC] text-[#0F5238] text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Paso 1 de 3</span>
          </div>
        </div>

        <h1 className="text-2xl font-black text-[#191C1D] tracking-tight">
          Bienvenido a tu espacio seguro
        </h1>
        <p className="text-xs text-[#707973] mt-1 leading-relaxed">
          Ejercicio adaptado sin impacto, diseñado para cuidar tus cartílagos y devolverte la vitalidad diaria sin dolor.
        </p>
      </header>

      {/* Main Body */}
      <main className="px-5 pt-6 space-y-6 flex-1">
        {/* Name Question Card */}
        <section className="bg-white rounded-3xl p-5 border border-[#E1E3E4] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#2D6A4F]">
            <User className="w-5 h-5 text-[#2D6A4F]" />
            <label
              htmlFor="user-name-input"
              className="text-sm font-extrabold text-[#191C1D]"
            >
              ¿Cómo te llamas?
            </label>
          </div>

          <p className="text-xs text-[#707973] leading-relaxed">
            Usaremos tu nombre para darte la bienvenida en la pantalla principal y personalizar tus mensajes de motivación diaria.
          </p>

          <input
            id="user-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Escribe tu nombre o apodo..."
            maxLength={35}
            className="w-full h-14 px-4 rounded-2xl bg-[#F8F9FA] border-2 border-[#EDEEEF] focus:border-[#2D6A4F] focus:bg-white text-[#191C1D] text-base font-bold placeholder:text-[#A0A8A2] outline-hidden transition-all"
          />
        </section>

        {/* Avatar & Photo Selection Card */}
        <section className="bg-white rounded-3xl p-5 border border-[#E1E3E4] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-[#2D6A4F]" />
              <h2 className="text-sm font-extrabold text-[#191C1D]">
                Tu Imagen o Avatar
              </h2>
            </div>

            {/* Current Selected Avatar Preview */}
            <UserAvatar
              avatarType={avatarType}
              avatarValue={avatarValue}
              name={name}
              size="md"
            />
          </div>

          {/* Toggle between Preset Avatars and Photo Upload */}
          <div className="grid grid-cols-2 p-1 bg-[#F3F4F5] rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setTabMode('preset')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
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
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                tabMode === 'photo'
                  ? 'bg-white text-[#0F5238] shadow-xs'
                  : 'text-[#707973] hover:text-[#191C1D]'
              }`}
            >
              Subir Mi Foto
            </button>
          </div>

          {/* Option A: Preset Avatars Gallery */}
          {tabMode === 'preset' ? (
            <div className="space-y-2">
              <p className="text-[11px] text-[#707973]">
                Selecciona una ilustración amigable y serena que te represente:
              </p>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected =
                    avatarType === 'preset' && avatarValue === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all text-center relative ${
                        isSelected
                          ? 'border-[#2D6A4F] bg-[#E7F3EC]/50 shadow-xs'
                          : 'border-[#EDEEEF] bg-[#F8F9FA] hover:border-[#D0D4D2]'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                      <UserAvatar
                        avatarType="preset"
                        avatarValue={preset.id}
                        size="md"
                      />
                      <span className="text-[11px] font-bold text-[#191C1D] leading-tight">
                        {preset.name}
                      </span>
                      <span className="text-[9px] font-medium text-[#707973] leading-none">
                        {preset.badgeLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Option B: Photo Upload from Phone/Computer */
            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-dashed border-[#C4C8C5] flex flex-col items-center text-center space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="avatar-photo-upload"
              />

              {avatarType === 'custom_photo' && avatarValue ? (
                <div className="space-y-2">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-[#2D6A4F] shadow-sm">
                    <img
                      src={avatarValue}
                      alt="Foto subida"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-xs text-[#0F5238] font-bold flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>Foto cargada correctamente</span>
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
                  <Camera className="w-8 h-8" />
                </div>
              )}

              <div>
                <strong className="text-xs font-bold text-[#191C1D] block">
                  Foto desde tu dispositivo
                </strong>
                <p className="text-[11px] text-[#707973] mt-0.5 max-w-xs">
                  Sube una foto desde la galería de tu teléfono. Se guardará de forma 100% privada en tu navegador.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#2D6A4F] text-[#0F5238] font-bold text-xs hover:bg-[#E7F3EC] transition-all flex items-center gap-2 shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>
                  {avatarType === 'custom_photo' && avatarValue
                    ? 'Elegir otra foto'
                    : 'Seleccionar archivo de imagen'}
                </span>
              </button>
            </div>
          )}
        </section>

        {/* Reassurance Banner */}
        <div className="p-3.5 rounded-2xl bg-[#E7F3EC] border border-[#B1F0CE] flex items-start gap-2.5 text-[#0F5238]">
          <ShieldCheck className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
          <p className="text-xs text-[#2A3E33] leading-relaxed">
            Tu privacidad está protegida. Todos tus datos y tu foto se almacenan exclusivamente en este dispositivo.
          </p>
        </div>
      </main>

      {/* Footer Action Button: 56px */}
      <footer className="px-5 pt-3">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full h-14 rounded-2xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#0F5238] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md transition-all duration-200"
        >
          <span>Continuar a mi Evaluación Clínica</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </footer>
    </div>
  );
};
