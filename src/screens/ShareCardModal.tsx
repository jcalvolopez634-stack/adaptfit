/**
 * AdaptFit - Pantalla 10: Modal Generador de Tarjeta para Compartir Victoria
 * Previsualización reactiva en vivo, selector de aspecto (Historia 9:16 vs Chat 1:1),
 * compartir en WhatsApp con enlace oficial y exportación directa a PNG mediante HTML5 Canvas API.
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Achievement } from '../types';
import {
  X,
  Share2,
  Download,
  CheckCircle2,
  Sparkles,
  Trophy,
  MessageCircle,
  Smartphone,
  Square,
  ShieldCheck,
} from 'lucide-react';

interface ShareCardModalProps {
  achievement?: Achievement | null;
  onClose?: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  achievement,
  onClose,
}) => {
  const {
    shareModalAchievement,
    closeShareModal,
    achievements,
    goBack,
  } = useApp();

  const activeAchievement =
    achievement ||
    shareModalAchievement ||
    achievements[0] || {
      id: 'ach-default',
      title: 'Hito de Constancia Desbloqueado',
      category: 'Hito Destacado',
      timeAgo: 'Hoy',
      description: 'Progreso firme y sin dolor con el plan adaptativo AdaptFit.',
      verifiedByProgress: true,
      badgeIcon: 'Trophy',
      unlocked: true,
    };

  const [aspectRatio, setAspectRatio] = useState<'story' | 'square'>('story');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleDismiss = () => {
    if (onClose) {
      onClose();
    } else {
      closeShareModal();
    }
  };

  // WhatsApp Share Function
  const handleShareWhatsApp = async () => {
    const shareText = `🎉 ¡He alcanzado una nueva victoria funcional en AdaptFit!\n\n🏆 "${activeAchievement.title}"\n✨ ${activeAchievement.description}\n🌱 Cuidando mis articulaciones día a día.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: activeAchievement.title,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // Fallback to WhatsApp URL if user cancelled or unsupported
      }
    }

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      shareText
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  // Native HTML5 Canvas Image Generator and Downloader
  const handleDownloadCard = () => {
    setIsGenerating(true);

    const isStory = aspectRatio === 'story';
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // 1. Background Gradient (Deep Sage #2D6A4F to Dark Forest #143D2B)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#2D6A4F');
    bgGrad.addColorStop(1, '#113524');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Decorative Soft Accent Ring (Peach #F4A261)
    ctx.strokeStyle = 'rgba(244, 162, 97, 0.25)';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.arc(width / 2, isStory ? 550 : 380, isStory ? 180 : 140, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Center Icon Circle (#F4A261)
    ctx.fillStyle = '#F4A261';
    ctx.beginPath();
    ctx.arc(width / 2, isStory ? 550 : 380, isStory ? 140 : 110, 0, Math.PI * 2);
    ctx.fill();

    // 4. Center Trophy / Check symbol in white
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${isStory ? '90px' : '70px'} sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏆', width / 2, isStory ? 550 : 380);

    // 5. App Logo / Category Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    const pillY = isStory ? 800 : 570;
    ctx.beginPath();
    ctx.roundRect(width / 2 - 240, pillY, 480, 60, 30);
    ctx.fill();

    ctx.fillStyle = '#B1F0CE';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(
      `ADAPTFIT • ${activeAchievement.category.toUpperCase()}`,
      width / 2,
      pillY + 32
    );

    // 6. Achievement Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${isStory ? '64px' : '52px'} sans-serif`;
    ctx.fillText(activeAchievement.title, width / 2, isStory ? 950 : 690);

    // 7. Description / Subtitle
    ctx.fillStyle = '#EDEEEF';
    ctx.font = 'normal 34px sans-serif';
    ctx.fillText(activeAchievement.description, width / 2, isStory ? 1040 : 760);

    // 8. Verified Progress Badge
    ctx.fillStyle = '#F4A261';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('✓ Hito verificado por consistencia', width / 2, isStory ? 1120 : 830);

    // 9. Footer Brand Message
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'normal 30px sans-serif';
    ctx.fillText(
      'Constancia sin dolor • Entrenamiento adaptado',
      width / 2,
      isStory ? 1750 : 980
    );

    // Disparar descarga directa
    const imageUri = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.download = `adaptfit-${activeAchievement.id}-${aspectRatio}.png`;
    downloadLink.href = imageUri;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E1E3E4] max-h-[92vh] flex flex-col overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="px-5 pt-5 pb-3.5 border-b border-[#EDEEEF] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-extrabold text-[#191C1D]">
              Compartir Victoria Funcional
            </h2>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-[#F3F4F5] hover:bg-[#EDEEEF] text-[#707973] flex items-center justify-center transition-all"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Aspect Ratio Switcher */}
          <div className="p-1 bg-[#EDEEEF] rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setAspectRatio('story')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                aspectRatio === 'story'
                  ? 'bg-white text-[#2D6A4F] shadow-xs'
                  : 'text-[#707973] hover:text-[#191C1D]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Historia (9:16)</span>
            </button>

            <button
              type="button"
              onClick={() => setAspectRatio('square')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                aspectRatio === 'square'
                  ? 'bg-white text-[#2D6A4F] shadow-xs'
                  : 'text-[#707973] hover:text-[#191C1D]'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Chat / Cuadrado (1:1)</span>
            </button>
          </div>

          {/* Live Preview of the Card */}
          <div className="flex justify-center">
            <div
              className={`w-full max-w-[280px] bg-gradient-to-b from-[#2D6A4F] to-[#123825] rounded-3xl p-5 text-white shadow-xl flex flex-col justify-between items-center text-center transition-all relative overflow-hidden border border-white/20 ${
                aspectRatio === 'story' ? 'aspect-[9/16]' : 'aspect-square'
              }`}
            >
              {/* Background ambient accents */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#F4A261]/20 blur-xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-[#B1F0CE]/20 blur-xl pointer-events-none" />

              {/* Card Header Pill */}
              <div className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-[10px] font-bold tracking-wider uppercase text-[#B1F0CE] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F4A261]" />
                <span>AdaptFit • {activeAchievement.category}</span>
              </div>

              {/* Trophy and Details */}
              <div className="my-auto space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#F4A261] text-white flex items-center justify-center mx-auto shadow-md border-2 border-white/40">
                  <Trophy className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white leading-tight">
                    {activeAchievement.title}
                  </h3>
                  <p className="text-xs text-[#EDEEEF] mt-1 line-clamp-3">
                    {activeAchievement.description}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#F4A261]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verificado por constancia</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 text-[9px] text-white/70 border-t border-white/15 w-full">
                Constancia sin dolor • AdaptFit
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions with 56px Buttons */}
        <div className="p-4 bg-[#F8F9FA] border-t border-[#EDEEEF] space-y-2.5">
          {/* Button 1: WhatsApp */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full h-14 rounded-2xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1EBE5D] active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Compartir por WhatsApp</span>
          </button>

          {/* Button 2: Download Card */}
          <button
            type="button"
            onClick={handleDownloadCard}
            disabled={isGenerating}
            className="w-full h-14 rounded-2xl bg-white border border-[#E1E3E4] text-[#191C1D] font-bold text-sm hover:bg-[#F3F4F5] active:scale-[0.98] flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-[#2D6A4F]" />
            <span>
              {isGenerating ? 'Generando imagen PNG...' : 'Descargar Tarjeta (PNG)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
