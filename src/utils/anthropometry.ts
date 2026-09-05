import { AnthropometricRecord } from '../types';

export interface BMIAssessment {
  bmi: number;
  category: 'bajo_peso' | 'normopeso' | 'sobrepeso' | 'obesidad';
  label: string;
  badgeBg: string;
  badgeText: string;
  advice: string;
}

export function calculateBMI(weightKg: number, heightCm: number): BMIAssessment {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) {
    return {
      bmi: 0,
      category: 'normopeso',
      label: 'Sin datos suficientes',
      badgeBg: 'bg-[#F3F4F5]',
      badgeText: 'text-[#707973]',
      advice: 'Introduce tu altura y peso para calcular tu índice inicial.',
    };
  }

  const heightInMeters = heightCm / 100;
  const rawBmi = weightKg / (heightInMeters * heightInMeters);
  const bmi = Math.round(rawBmi * 10) / 10;

  if (bmi < 18.5) {
    return {
      bmi,
      category: 'bajo_peso',
      label: 'Bajo peso',
      badgeBg: 'bg-[#EBF3FA]',
      badgeText: 'text-[#1D6FA5]',
      advice:
        'Priorizaremos ejercicios de fortalecimiento muscular progresivo y tono postural.',
    };
  }
  if (bmi < 25) {
    return {
      bmi,
      category: 'normopeso',
      label: 'Normopeso / Saludable',
      badgeBg: 'bg-[#E7F3EC]',
      badgeText: 'text-[#0F5238]',
      advice:
        'Rango estándar saludable. Nuestro foco está en desarrollar fuerza, movilidad y vitalidad diaria.',
    };
  }
  if (bmi < 30) {
    return {
      bmi,
      category: 'sobrepeso',
      label: 'Sobrepeso',
      badgeBg: 'bg-[#FFF6ED]',
      badgeText: 'text-[#8E4E14]',
      advice:
        'Foco en gasto metabólico seguro y protección articular de rodillas y zona lumbar.',
    };
  }
  return {
    bmi,
    category: 'obesidad',
    label: 'Obesidad',
    badgeBg: 'bg-[#FDF0EE]',
    badgeText: 'text-[#9C3220]',
    advice:
      'Cero impacto articular obligatorio para proteger cartílagos mientras reactivamos el metabolismo sin sufrimiento.',
  };
}

export interface MeasurementGuideItem {
  key: 'cintura' | 'cadera' | 'muslo' | 'brazo';
  title: string;
  instruction: string;
  tip: string;
  icon: string;
}

export const MEASUREMENT_GUIDES: Record<string, MeasurementGuideItem> = {
  cintura: {
    key: 'cintura',
    title: 'Contorno de Cintura',
    instruction:
      'Coloca la cinta métrica horizontalmente a la altura del ombligo, sin meter la tripa y al final de una espiración normal.',
    tip: 'No aprietes la cinta sobre la piel; debe quedar firme pero sin comprimir los tejidos blandos.',
    icon: '📏',
  },
  cadera: {
    key: 'cadera',
    title: 'Contorno de Cadera',
    instruction:
      'Ponte de pie con los pies juntos. Mide pasando la cinta por la parte más prominente de los glúteos.',
    tip: 'Asegúrate de que la cinta esté nivelada paralelamente al suelo en todo el contorno.',
    icon: '🍑',
  },
  muslo: {
    key: 'muslo',
    title: 'Contorno de Muslo',
    instruction:
      'Ponte de pie con el peso distribuido por igual. Mide en el punto medio entre el pliegue inguinal (cadera) y la parte superior de la rodilla.',
    tip: 'Relaja los cuádriceps sin poner el músculo en tensión isométrica.',
    icon: '🦵',
  },
  brazo: {
    key: 'brazo',
    title: 'Contorno de Brazo',
    instruction:
      'Con el brazo relajado a lo largo del cuerpo o flexionado a 90°, mide en la zona de mayor grosor del bíceps.',
    tip: 'Mide preferentemente el mismo brazo siempre (generalmente el dominante).',
    icon: '💪',
  },
};
