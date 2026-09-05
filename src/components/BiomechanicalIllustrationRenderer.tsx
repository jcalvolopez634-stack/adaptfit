/**
 * AdaptFit - Renderizador de Ilustraciones Pedagógicas y Biomecánicas Vectoriales (SVG)
 * Generador anatómico en código que ilustra exactamente la postura y el movimiento de cada ejercicio,
 * eliminando imágenes genéricas o fotos de catálogo que causan confusión.
 * Soporta fases paso a paso (0 a 3), flechas de vectores de fuerza, puntos clave interactivos
 * y variantes adaptadas con apoyo (silla / pared).
 */

import React from 'react';
import { ExerciseStepVisual, MovementPattern } from '../types';

interface BiomechanicalIllustrationRendererProps {
  svgAssetId: string;
  stepNumber: 0 | 1 | 2 | 3;
  movementPattern?: MovementPattern;
  isAdapted?: boolean;
  visualFocusPoints?: string[];
  vectorArrows?: { direction: 'down' | 'up' | 'forward' | 'backward'; label: string };
  highlightedFocusIndex?: number | null;
  onSelectFocusPoint?: (index: number) => void;
  className?: string;
  compact?: boolean;
}

export const BiomechanicalIllustrationRenderer: React.FC<BiomechanicalIllustrationRendererProps> = ({
  svgAssetId,
  stepNumber,
  movementPattern = 'dominante_rodilla',
  isAdapted = false,
  visualFocusPoints = [],
  vectorArrows,
  highlightedFocusIndex = null,
  onSelectFocusPoint,
  className = '',
  compact = false,
}) => {
  // Determine normalized exercise category based on assetId or movementPattern
  const normalizedCategory = (() => {
    const asset = (svgAssetId || '').toLowerCase();
    if (asset.includes('squat') || asset.includes('sentadilla') || asset.includes('pierna') || asset.includes('rodilla')) {
      return 'squat';
    }
    if (asset.includes('bridge') || asset.includes('puente') || asset.includes('pelvic') || asset.includes('bisagra') || asset.includes('glute')) {
      return 'bridge';
    }
    if (asset.includes('push') || asset.includes('pared') || asset.includes('flexion') || asset.includes('empuje')) {
      return 'pushup';
    }
    if (asset.includes('row') || asset.includes('remo') || asset.includes('traccion') || asset.includes('toalla')) {
      return 'row';
    }
    if (asset.includes('talon') || asset.includes('calf') || asset.includes('gemelo') || asset.includes('tobillo')) {
      return 'calf';
    }
    if (asset.includes('deadbug') || asset.includes('core') || asset.includes('plank') || asset.includes('plancha')) {
      return 'core';
    }
    if (asset.includes('respira') || asset.includes('descompresion') || asset.includes('calma')) {
      return 'stretch';
    }

    // Fallback by movementPattern
    switch (movementPattern) {
      case 'dominante_rodilla':
        return 'squat';
      case 'bisagra_cadera':
        return 'bridge';
      case 'empuje_horizontal':
      case 'empuje_vertical':
        return 'pushup';
      case 'traccion_horizontal':
      case 'traccion_vertical':
        return 'row';
      case 'anti_extension_core':
      case 'anti_rotacion_core':
        return 'core';
      default:
        return 'squat';
    }
  })();

  // Render Arrow helper
  const renderVectorArrow = () => {
    if (!vectorArrows) return null;
    const { direction, label } = vectorArrows;

    let arrowCoords = { x1: 200, y1: 140, x2: 200, y2: 190 }; // default down
    if (direction === 'up') {
      arrowCoords = { x1: 200, y1: 180, x2: 200, y2: 130 };
    } else if (direction === 'forward') {
      arrowCoords = { x1: 180, y1: 140, x2: 230, y2: 140 };
    } else if (direction === 'backward') {
      arrowCoords = { x1: 220, y1: 140, x2: 170, y2: 140 };
    }

    return (
      <g className="transition-all duration-300">
        <defs>
          <marker
            id="arrowMarker"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="#2D6A4F" />
          </marker>
        </defs>

        {/* Pulsing indicator line */}
        <line
          x1={arrowCoords.x1}
          y1={arrowCoords.y1}
          x2={arrowCoords.x2}
          y2={arrowCoords.y2}
          stroke="#2D6A4F"
          strokeWidth="3.5"
          strokeDasharray="4 2"
          markerEnd="url(#arrowMarker)"
          className="animate-pulse"
        />

        {/* Vector direction pill label */}
        <rect
          x={Math.min(arrowCoords.x1, arrowCoords.x2) - 45}
          y={arrowCoords.y2 > arrowCoords.y1 ? arrowCoords.y2 + 8 : arrowCoords.y2 - 24}
          width="90"
          height="18"
          rx="9"
          fill="#E7F3EC"
          stroke="#2D6A4F"
          strokeWidth="1"
        />
        <text
          x={Math.min(arrowCoords.x1, arrowCoords.x2)}
          y={arrowCoords.y2 > arrowCoords.y1 ? arrowCoords.y2 + 20 : arrowCoords.y2 - 12}
          textAnchor="middle"
          fontSize="9"
          fontWeight="bold"
          fill="#0F5238"
        >
          {label || (direction === 'down' ? 'Descenso' : 'Elevación')}
        </text>
      </g>
    );
  };

  // Render Focus point pins
  const renderFocusPin = (x: number, y: number, index: number, label: string) => {
    const isSelected = highlightedFocusIndex === index;
    return (
      <g
        key={`focus-pin-${index}`}
        className="cursor-pointer group"
        onClick={() => onSelectFocusPoint && onSelectFocusPoint(index)}
      >
        {/* Pulsing halo */}
        <circle
          cx={x}
          cy={y}
          r={isSelected ? '14' : '10'}
          fill={isSelected ? '#52B788' : '#2D6A4F'}
          fillOpacity={isSelected ? '0.35' : '0.18'}
          className="animate-ping origin-center"
        />
        {/* Pin circle */}
        <circle
          cx={x}
          cy={y}
          r={isSelected ? '9' : '7.5'}
          fill={isSelected ? '#191C1D' : '#2D6A4F'}
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <text
          x={x}
          y={y + 3}
          textAnchor="middle"
          fontSize="8"
          fontWeight="bold"
          fill="#FFFFFF"
        >
          {index + 1}
        </text>

        {/* Pin label tooltips when hovered or selected */}
        {isSelected && (
          <g transform={`translate(${x > 250 ? x - 110 : x + 12}, ${y - 12})`}>
            <rect
              width="105"
              height="24"
              rx="6"
              fill="#191C1D"
              fillOpacity="0.92"
            />
            <text
              x="52"
              y="15"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="600"
              fill="#FFFFFF"
            >
              {label.slice(0, 18)}
              {label.length > 18 ? '...' : ''}
            </text>
          </g>
        )}
      </g>
    );
  };

  // 1. SQUAT / SENTADILLA BIOMECHANICS
  const renderSquatPattern = () => {
    const isSeatedSetup = stepNumber === 0;
    const isDescent = stepNumber === 1;
    const isInflection = stepNumber === 2;
    const isAscent = stepNumber === 3;

    // Head and Torso coordinates
    let head = { cx: 160, cy: 70 };
    let chest = { x: 160, y: 110 };
    let hip = { x: 160, y: 155 };
    let knee = { x: 195, y: 190 };
    let foot = { x: 195, y: 240 };

    if (isSeatedSetup) {
      head = { cx: 160, cy: 75 };
      chest = { x: 160, y: 115 };
      hip = { x: 160, y: 165 };
      knee = { x: 210, y: 168 };
      foot = { x: 210, y: 240 };
    } else if (isDescent) {
      head = { cx: 150, cy: 95 };
      chest = { x: 152, y: 135 };
      hip = { x: 145, y: 175 };
      knee = { x: 195, y: 185 };
      foot = { x: 195, y: 240 };
    } else if (isInflection) {
      // Touchdown / 90 degree inflection
      head = { cx: 145, cy: 110 };
      chest = { x: 150, y: 145 };
      hip = { x: 140, y: 185 };
      knee = { x: 200, y: 188 };
      foot = { x: 200, y: 240 };
    } else if (isAscent) {
      head = { cx: 158, cy: 80 };
      chest = { x: 158, y: 120 };
      hip = { x: 155, y: 160 };
      knee = { x: 195, y: 195 };
      foot = { x: 195, y: 240 };
    }

    return (
      <g>
        {/* Floor Line */}
        <line x1="60" y1="242" x2="340" y2="242" stroke="#E1E3E4" strokeWidth="2.5" />
        <text x="70" y="258" fontSize="8" fill="#707973" fontWeight="bold">
          SUELO ESTABLE
        </text>

        {/* Chair / Support in Adapted mode or squat with chair */}
        {(isAdapted || svgAssetId.includes('silla') || isSeatedSetup) && (
          <g opacity="0.85">
            {/* Chair seat */}
            <rect x="115" y="175" width="55" height="8" rx="3" fill="#A8DADC" stroke="#457B9D" strokeWidth="1.5" />
            {/* Chair back */}
            <rect x="115" y="90" width="8" height="90" rx="3" fill="#A8DADC" stroke="#457B9D" strokeWidth="1.5" />
            {/* Chair legs */}
            <line x1="120" y1="183" x2="120" y2="242" stroke="#457B9D" strokeWidth="2" />
            <line x1="165" y1="183" x2="165" y2="242" stroke="#457B9D" strokeWidth="2" />
            <text x="95" y="140" fontSize="8" fill="#1D4ED8" fontWeight="bold">
              SILLA FIRME
            </text>
          </g>
        )}

        {/* Plumb / Alignment Axis Line */}
        <line
          x1={foot.x}
          y1="50"
          x2={foot.x}
          y2="240"
          stroke="#B1F0CE"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <text x={foot.x + 4} y="60" fontSize="7.5" fill="#2D6A4F" fontWeight="bold">
          EJE VERTICAL
        </text>

        {/* Mannequin Limbs & Spine */}
        {/* Spine Line */}
        <path
          d={`M ${head.cx} ${head.cy + 14} Q ${chest.x} ${chest.y} ${hip.x} ${hip.y}`}
          fill="none"
          stroke="#191C1D"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Thigh (Femur) */}
        <line
          x1={hip.x}
          y1={hip.y}
          x2={knee.x}
          y2={knee.y}
          stroke="#191C1D"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Active muscle highlight on Quad */}
        <line
          x1={hip.x + 2}
          y1={hip.y - 2}
          x2={knee.x - 2}
          y2={knee.y - 4}
          stroke="#52B788"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity={isInflection || isAscent ? '0.9' : '0.4'}
        />

        {/* Shin (Tibia) */}
        <line
          x1={knee.x}
          y1={knee.y}
          x2={foot.x}
          y2={foot.y}
          stroke="#191C1D"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Foot Base */}
        <line
          x1={foot.x - 14}
          y1={foot.y}
          x2={foot.x + 16}
          y2={foot.y}
          stroke="#191C1D"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Arms / Hands (counterbalance or on knees) */}
        <path
          d={`M ${chest.x} ${chest.y - 8} Q ${chest.x + 30} ${chest.y + 10} ${knee.x + (isSeatedSetup ? -5 : 20)} ${knee.y - (isSeatedSetup ? 10 : 20)}`}
          fill="none"
          stroke="#404943"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Joint Pivots */}
        <circle cx={head.cx} cy={head.cy} r="13" fill="#191C1D" />
        <circle cx={hip.x} cy={hip.y} r="5.5" fill="#2D6A4F" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx={knee.x} cy={knee.y} r="6" fill="#2D6A4F" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx={foot.x} cy={foot.y} r="4.5" fill="#191C1D" />

        {/* Angle indicator at Knee */}
        <path
          d={`M ${knee.x - 8} ${knee.y - 12} A 14 14 0 0 1 ${knee.x + 4} ${knee.y + 10}`}
          fill="none"
          stroke="#F4A261"
          strokeWidth="2"
        />
        <text x={knee.x + 10} y={knee.y - 5} fontSize="8" fill="#E76F51" fontWeight="bold">
          {isInflection ? '90° Seguro' : isSeatedSetup ? '90°' : 'Control'}
        </text>

        {/* Render Vector Arrow */}
        {renderVectorArrow()}

        {/* Focus Pins */}
        {visualFocusPoints[0] && renderFocusPin(head.cx + 12, head.cy + 25, 0, visualFocusPoints[0])}
        {visualFocusPoints[1] && renderFocusPin(knee.x, knee.y, 1, visualFocusPoints[1])}
        {visualFocusPoints[2] && renderFocusPin(foot.x, foot.y, 2, visualFocusPoints[2])}
      </g>
    );
  };

  // 2. GLUTE BRIDGE / BISAGRA CADERA
  const renderBridgePattern = () => {
    const isSetup = stepNumber === 0;
    const isDrive = stepNumber === 1;
    const isInflection = stepNumber === 2;
    const isDescent = stepNumber === 3;

    const shoulder = { x: 110, y: 215 };
    let hip = { x: 190, y: isSetup ? 215 : isDrive ? 175 : isInflection ? 155 : 185 };
    const knee = { x: 250, y: 170 };
    const foot = { x: 270, y: 225 };

    return (
      <g>
        {/* Mat / Bed Surface */}
        <rect x="70" y="225" width="260" height="12" rx="4" fill="#E7F3EC" stroke="#B1F0CE" strokeWidth="1.5" />
        <text x="75" y="248" fontSize="8" fill="#2D6A4F" fontWeight="bold">
          ESTERILLA / SUPERFICIE FIRME
        </text>

        {/* Head and Pillow */}
        <ellipse cx="85" cy="215" rx="14" ry="11" fill="#191C1D" />

        {/* Spine line connecting shoulder to hip */}
        <path
          d={`M ${shoulder.x} ${shoulder.y} L ${hip.x} ${hip.y}`}
          fill="none"
          stroke="#191C1D"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Glute & Core Activation Glow */}
        <line
          x1={hip.x - 20}
          y1={hip.y + 2}
          x2={hip.x + 10}
          y2={hip.y - 2}
          stroke="#52B788"
          strokeWidth="6"
          strokeLinecap="round"
          opacity={isInflection ? '0.9' : '0.4'}
        />

        {/* Femur (Hip to Knee) */}
        <line
          x1={hip.x}
          y1={hip.y}
          x2={knee.x}
          y2={knee.y}
          stroke="#191C1D"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Tibia (Knee to Foot) */}
        <line
          x1={knee.x}
          y1={knee.y}
          x2={foot.x}
          y2={foot.y}
          stroke="#191C1D"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Foot Base on Floor */}
        <line
          x1={foot.x - 12}
          y1={foot.y}
          x2={foot.x + 12}
          y2={foot.y}
          stroke="#191C1D"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Arms resting on sides */}
        <line
          x1={shoulder.x}
          y1={shoulder.y + 2}
          x2={shoulder.x + 60}
          y2={shoulder.y + 5}
          stroke="#707973"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Joint circles */}
        <circle cx={shoulder.x} cy={shoulder.y} r="5" fill="#2D6A4F" />
        <circle cx={hip.x} cy={hip.y} r="6" fill="#2D6A4F" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx={knee.x} cy={knee.y} r="5.5" fill="#2D6A4F" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx={foot.x} cy={foot.y} r="4" fill="#191C1D" />

        {/* Alignment straight line at top */}
        {isInflection && (
          <line
            x1={shoulder.x}
            y1={shoulder.y}
            x2={knee.x}
            y2={knee.y}
            stroke="#52B788"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
        )}

        {renderVectorArrow()}

        {/* Focus Pins */}
        {visualFocusPoints[0] && renderFocusPin(hip.x, hip.y, 0, visualFocusPoints[0])}
        {visualFocusPoints[1] && renderFocusPin(knee.x, knee.y, 1, visualFocusPoints[1])}
        {visualFocusPoints[2] && renderFocusPin(foot.x, foot.y, 2, visualFocusPoints[2])}
      </g>
    );
  };

  // 3. PUSHUP / WALL PRESS / FLEXION
  const renderPushupPattern = () => {
    const isSetup = stepNumber === 0;
    const isDescent = stepNumber === 1;
    const isInflection = stepNumber === 2;
    const isPush = stepNumber === 3;

    // Wall position
    const wallX = 290;
    const footX = 130;
    const footY = 240;

    // Head, shoulder, hip alignment
    let shoulderX = isSetup ? 230 : isDescent ? 255 : isInflection ? 270 : 240;
    let shoulderY = isSetup ? 115 : isDescent ? 120 : isInflection ? 122 : 118;
    let hipX = isSetup ? 170 : isDescent ? 185 : isInflection ? 195 : 175;
    let hipY = 165;
    let headX = shoulderX - 15;
    let headY = shoulderY - 25;

    let handX = wallX;
    let handY = 120;
    let elbowX = isInflection ? 245 : 260;
    let elbowY = 135;

    return (
      <g>
        {/* Wall & Floor */}
        <rect x={wallX} y="30" width="16" height="215" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
        <line x1="80" y1={footY} x2={wallX + 16} y2={footY} stroke="#CBD5E1" strokeWidth="2" />
        <text x={wallX - 35} y="45" fontSize="8" fill="#475569" fontWeight="bold">
          PARED
        </text>

        {/* Body Straight Plumb Line */}
        <line
          x1={headX}
          y1={headY}
          x2={footX}
          y2={footY}
          stroke="#B1F0CE"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />

        {/* Spine/Body line */}
        <line
          x1={shoulderX}
          y1={shoulderY}
          x2={hipX}
          y2={hipY}
          stroke="#191C1D"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Legs line */}
        <line
          x1={hipX}
          y1={hipY}
          x2={footX}
          y2={footY}
          stroke="#191C1D"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Arms and Elbow joint */}
        <path
          d={`M ${shoulderX} ${shoulderY} L ${elbowX} ${elbowY} L ${handX} ${handY}`}
          fill="none"
          stroke="#2D6A4F"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Chest Activation Indicator */}
        <circle
          cx={shoulderX + 5}
          cy={shoulderY + 5}
          r="8"
          fill="#52B788"
          opacity={isInflection ? '0.85' : '0.35'}
        />

        {/* Head */}
        <circle cx={headX} cy={headY} r="13" fill="#191C1D" />

        {/* Joints */}
        <circle cx={shoulderX} cy={shoulderY} r="5" fill="#2D6A4F" />
        <circle cx={elbowX} cy={elbowY} r="5.5" fill="#2D6A4F" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx={handX} cy={handY} r="4.5" fill="#191C1D" />
        <circle cx={hipX} cy={hipY} r="5" fill="#2D6A4F" />
        <circle cx={footX} cy={footY} r="4.5" fill="#191C1D" />

        {/* Elbow Angle Label */}
        <text x={elbowX - 22} y={elbowY + 15} fontSize="8" fill="#E76F51" fontWeight="bold">
          {isInflection ? '45° Seguro' : 'Codos neutros'}
        </text>

        {renderVectorArrow()}

        {/* Focus Pins */}
        {visualFocusPoints[0] && renderFocusPin(hipX, hipY - 10, 0, visualFocusPoints[0])}
        {visualFocusPoints[1] && renderFocusPin(elbowX, elbowY, 1, visualFocusPoints[1])}
        {visualFocusPoints[2] && renderFocusPin(footX, footY, 2, visualFocusPoints[2])}
      </g>
    );
  };

  // 4. ROW / TRACCIÓN / REMO
  const renderRowPattern = () => {
    const isInflection = stepNumber === 2;
    const isPull = stepNumber === 1 || stepNumber === 2;

    const elbowX = isPull ? 140 : 185;
    const handX = isPull ? 165 : 220;

    return (
      <g>
        {/* Seated in Chair */}
        <rect x="110" y="150" width="55" height="8" rx="3" fill="#A8DADC" stroke="#457B9D" strokeWidth="1.5" />
        <rect x="110" y="80" width="8" height="75" rx="3" fill="#A8DADC" stroke="#457B9D" strokeWidth="1.5" />
        <line x1="115" y1="158" x2="115" y2="240" stroke="#457B9D" strokeWidth="2" />
        <line x1="160" y1="158" x2="160" y2="240" stroke="#457B9D" strokeWidth="2" />

        {/* Human Seated */}
        <circle cx="145" cy="65" r="13" fill="#191C1D" />
        <line x1="145" y1="78" x2="145" y2="150" stroke="#191C1D" strokeWidth="5" strokeLinecap="round" />
        <line x1="145" y1="150" x2="195" y2="155" stroke="#191C1D" strokeWidth="5" strokeLinecap="round" />
        <line x1="195" y1="155" x2="195" y2="240" stroke="#191C1D" strokeWidth="4.5" strokeLinecap="round" />

        {/* Arms & Towel/Band */}
        <path
          d={`M 145 95 L ${elbowX} 115 L ${handX} 125`}
          fill="none"
          stroke="#2D6A4F"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Towel / Resistance Band Line */}
        <line
          x1={handX}
          y1="125"
          x2="245"
          y2="135"
          stroke="#F4A261"
          strokeWidth="3.5"
          strokeDasharray="2 2"
        />
        <text x="220" y="150" fontSize="7.5" fill="#E76F51" fontWeight="bold">
          BANDA / TOALLA
        </text>

        {/* Scapular Retraction Highlight */}
        <circle cx="138" cy="98" r="8" fill="#52B788" opacity={isInflection ? '0.9' : '0.4'} />
        <text x="85" y="100" fontSize="7.5" fill="#0F5238" fontWeight="bold">
          Retracción Escapular
        </text>

        {renderVectorArrow()}

        {visualFocusPoints[0] && renderFocusPin(145, 110, 0, visualFocusPoints[0])}
        {visualFocusPoints[1] && renderFocusPin(elbowX, 115, 1, visualFocusPoints[1])}
        {visualFocusPoints[2] && renderFocusPin(handX, 125, 2, visualFocusPoints[2])}
      </g>
    );
  };

  // 5. CALF / ELEVACIÓN DE TALÓN
  const renderCalfPattern = () => {
    const isUp = stepNumber === 2 || stepNumber === 1;
    const heelY = isUp ? 222 : 240;

    return (
      <g>
        <line x1="70" y1="242" x2="330" y2="242" stroke="#E1E3E4" strokeWidth="2.5" />

        {/* Chair Back Support */}
        <rect x="225" y="80" width="10" height="120" rx="3" fill="#A8DADC" stroke="#457B9D" strokeWidth="1.5" />
        <line x1="230" y1="200" x2="230" y2="242" stroke="#457B9D" strokeWidth="2" />
        <text x="245" y="100" fontSize="8" fill="#1D4ED8" fontWeight="bold">
          APOYO EN SILLA
        </text>

        {/* Body Standing */}
        <circle cx="170" cy="65" r="13" fill="#191C1D" />
        <line x1="170" y1="78" x2="170" y2="155" stroke="#191C1D" strokeWidth="5" strokeLinecap="round" />
        <line x1="170" y1="155" x2="175" y2="195" stroke="#191C1D" strokeWidth="5" strokeLinecap="round" />

        {/* Hands on chair back */}
        <line x1="170" y1="95" x2="225" y2="105" stroke="#404943" strokeWidth="3.5" strokeLinecap="round" />

        {/* Lower leg and lifted heel */}
        <line x1="175" y1="195" x2="175" y2={heelY} stroke="#191C1D" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="175" y1={heelY} x2="192" y2="240" stroke="#191C1D" strokeWidth="4.5" strokeLinecap="round" />

        {/* Calf Muscle Glow */}
        <circle cx="172" cy="188" r="9" fill="#52B788" opacity={isUp ? '0.9' : '0.35'} />

        {renderVectorArrow()}

        {visualFocusPoints[0] && renderFocusPin(170, 115, 0, visualFocusPoints[0])}
        {visualFocusPoints[1] && renderFocusPin(172, 188, 1, visualFocusPoints[1])}
        {visualFocusPoints[2] && renderFocusPin(175, heelY, 2, visualFocusPoints[2])}
      </g>
    );
  };

  // 6. CORE / DEADBUG / PLANCHA
  const renderCorePattern = () => {
    const isInflection = stepNumber === 2;

    return (
      <g>
        {/* Floor/Mat */}
        <rect x="70" y="225" width="260" height="12" rx="4" fill="#E7F3EC" stroke="#B1F0CE" strokeWidth="1.5" />

        {/* Mannequin Supine */}
        <circle cx="110" cy="200" r="13" fill="#191C1D" />
        <line x1="123" y1="205" x2="195" y2="205" stroke="#191C1D" strokeWidth="5.5" strokeLinecap="round" />

        {/* Arms extending vertical / alternating */}
        <line x1="145" y1="205" x2={isInflection ? 120 : 145} y2={isInflection ? 160 : 130} stroke="#2D6A4F" strokeWidth="4" strokeLinecap="round" />

        {/* Legs at 90 / extending */}
        <line x1="195" y1="205" x2="215" y2="150" stroke="#191C1D" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="215" y1="150" x2={isInflection ? 260 : 255} y2={isInflection ? 180 : 150} stroke="#191C1D" strokeWidth="4" strokeLinecap="round" />

        {/* Core Abdominal Lock Glow */}
        <ellipse cx="160" cy="202" rx="16" ry="7" fill="#52B788" opacity={isInflection ? '0.9' : '0.5'} />
        <text x="140" y="190" fontSize="7.5" fill="#0F5238" fontWeight="bold">
          Core Activo
        </text>

        {renderVectorArrow()}

        {visualFocusPoints[0] && renderFocusPin(160, 202, 0, visualFocusPoints[0])}
        {visualFocusPoints[1] && renderFocusPin(215, 150, 1, visualFocusPoints[1])}
        {visualFocusPoints[2] && renderFocusPin(145, 130, 2, visualFocusPoints[2])}
      </g>
    );
  };

  // 7. STRETCH / RESPIRACIÓN DIAFRAGMÁTICA
  const renderStretchPattern = () => {
    return (
      <g>
        {/* Seated Ergonomic */}
        <rect x="120" y="165" width="60" height="8" rx="3" fill="#A8DADC" stroke="#457B9D" strokeWidth="1.5" />
        <rect x="120" y="90" width="8" height="80" rx="3" fill="#A8DADC" stroke="#457B9D" strokeWidth="1.5" />
        <line x1="125" y1="173" x2="125" y2="242" stroke="#457B9D" strokeWidth="2" />
        <line x1="175" y1="173" x2="175" y2="242" stroke="#457B9D" strokeWidth="2" />

        {/* Seated Figure */}
        <circle cx="155" cy="70" r="13" fill="#191C1D" />
        <line x1="155" y1="83" x2="155" y2="165" stroke="#191C1D" strokeWidth="5" strokeLinecap="round" />
        <line x1="155" y1="165" x2="205" y2="170" stroke="#191C1D" strokeWidth="5" strokeLinecap="round" />
        <line x1="205" y1="170" x2="205" y2="242" stroke="#191C1D" strokeWidth="4.5" strokeLinecap="round" />

        {/* Hands on lower ribs / belly */}
        <path
          d="M 155 105 Q 185 125 170 140"
          fill="none"
          stroke="#52B788"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Expanding Diaphragm Rings */}
        <circle cx="160" cy="135" r="16" fill="none" stroke="#2D6A4F" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="160" cy="135" r="22" fill="none" stroke="#52B788" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
        <text x="188" y="130" fontSize="8" fill="#0F5238" fontWeight="bold">
          Expansión 360°
        </text>

        {renderVectorArrow()}

        {visualFocusPoints[0] && renderFocusPin(155, 95, 0, visualFocusPoints[0])}
        {visualFocusPoints[1] && renderFocusPin(160, 135, 1, visualFocusPoints[1])}
        {visualFocusPoints[2] && renderFocusPin(205, 240, 2, visualFocusPoints[2])}
      </g>
    );
  };

  const renderContent = () => {
    switch (normalizedCategory) {
      case 'squat':
        return renderSquatPattern();
      case 'bridge':
        return renderBridgePattern();
      case 'pushup':
        return renderPushupPattern();
      case 'row':
        return renderRowPattern();
      case 'calf':
        return renderCalfPattern();
      case 'core':
        return renderCorePattern();
      case 'stretch':
      default:
        return renderStretchPattern();
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-[#F8FBF9] border border-[#E1E3E4] select-none ${className}`}
    >
      {/* Visual Header Tag */}
      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-[#EDEEEF] text-[10px] font-extrabold text-[#2D6A4F]">
        <span>Paso {stepNumber}</span>
        <span className="text-[#A4B0A7]">•</span>
        <span className="capitalize">{movementPattern.replace(/_/g, ' ')}</span>
      </div>

      {isAdapted && (
        <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-[#E7F3EC] border border-[#B1F0CE] text-[10px] font-bold text-[#0F5238]">
          Variante en Silla / Apoyo
        </div>
      )}

      {/* SVG Container */}
      <svg
        viewBox="0 0 400 280"
        className="w-full h-auto max-h-[300px] block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle grid pattern background */}
        <defs>
          <pattern id="bioGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F0F4F2" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="280" fill="url(#bioGrid)" />

        {/* Biomechanical Anatomy */}
        {renderContent()}
      </svg>
    </div>
  );
};
