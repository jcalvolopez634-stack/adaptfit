/**
 * AdaptFit - Core Application Entry Point & Master Router
 * Enrutador integral y reactivo para las 14 pantallas del sistema:
 * 1. Onboarding Evaluación Clínica
 * 2. Onboarding Macrociclo y Metas
 * 3. Home / Dashboard Principal
 * 4. Día Bajo de Energía (7 min)
 * 5. Sesión Activa de Entrenamiento
 * 6. Ficha Pedagógica y Mapeo Sensorial
 * 7. Modal de Pánico / Reemplazo Articular
 * 8. Feedback Post-Entreno
 * 9. Muro de Victorias Cotidianas
 * 10. Generador de Tarjetas de Logro
 * 11. El Camino del Año (52 semanas)
 * 12. Escudo de Descanso Anti-Culpa
 * 13. Evolución Clínica y Gráficas
 * 14. Calendario y Sincronización Externa (.ics)
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ScreenId } from './types';

// Pantallas Principales y Modales
import { OnboardingWelcomeScreen } from './screens/OnboardingWelcomeScreen';
import { OnboardingClinicalScreen } from './screens/OnboardingClinicalScreen';
import { OnboardingGoalScreen } from './screens/OnboardingGoalScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LowEnergyScreen } from './screens/LowEnergyScreen';
import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen';
import { PedagogicalGuideScreen } from './screens/PedagogicalGuideScreen';
import { PanicSwapModal } from './screens/PanicSwapModal';
import { PostWorkoutFeedbackScreen } from './screens/PostWorkoutFeedbackScreen';
import { VictoriesWallScreen } from './screens/VictoriesWallScreen';
import { ShareCardModal } from './screens/ShareCardModal';
import { YearRoadScreen } from './screens/YearRoadScreen';
import { RestShieldScreen } from './screens/RestShieldScreen';
import { ClinicalReportScreen } from './screens/ClinicalReportScreen';
import { CalendarSyncScreen } from './screens/CalendarSyncScreen';
import { ExerciseLibraryScreen } from './screens/ExerciseLibraryScreen';

// Componente de Navegación Inferior
import { BottomNav } from './components/BottomNav';

const MAIN_NAV_SCREENS: ScreenId[] = [
  'home',
  'year_road',
  'victory_wall',
  'calendar_sync',
  'clinical_report',
];

function AdaptFitShell() {
  const { currentScreen, shareModalAchievement } = useApp();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'onboarding_welcome':
        return <OnboardingWelcomeScreen />;

      case 'onboarding_limitations':
        return <OnboardingClinicalScreen />;

      case 'onboarding_macrocycle':
        return <OnboardingGoalScreen />;

      case 'home':
        return <HomeScreen />;

      case 'low_energy':
        return <LowEnergyScreen />;

      case 'workout_active':
        return <ActiveWorkoutScreen />;

      case 'exercise_pedagogy':
        return <PedagogicalGuideScreen />;

      case 'panic_replacement':
        return <PanicSwapModal />;

      case 'post_workout_feedback':
        return <PostWorkoutFeedbackScreen />;

      case 'victory_wall':
        return <VictoriesWallScreen />;

      case 'share_achievement':
        return <ShareCardModal />;

      case 'year_road':
        return <YearRoadScreen />;

      case 'rest_shield':
        return <RestShieldScreen />;

      case 'clinical_report':
        return <ClinicalReportScreen />;

      case 'calendar_sync':
        return <CalendarSyncScreen />;

      case 'exercise_library':
        return <ExerciseLibraryScreen />;

      default:
        return <HomeScreen />;
    }
  };

  const showBottomNav = MAIN_NAV_SCREENS.includes(currentScreen);

  return (
    <div className="relative min-h-screen bg-[#F8F9FA] text-[#191C1D] font-sans antialiased selection:bg-[#B1F0CE] selection:text-[#0F5238]">
      {/* Contenedor de Pantalla Activa */}
      {renderActiveScreen()}

      {/* Barra de Navegación Inferior en Pantallas Principales */}
      {showBottomNav && <BottomNav />}

      {/* Modal Global de Tarjeta para Compartir si está activo */}
      {shareModalAchievement && currentScreen !== 'share_achievement' && (
        <ShareCardModal achievement={shareModalAchievement} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AdaptFitShell />
    </AppProvider>
  );
}
