import React from 'react';
import { OrganKey } from '../../types';
import { ORGANS } from '../../services/medicalRules';
import { Compass, RotateCw } from 'lucide-react';

interface AnatomyMiniMapProps {
  currentOrgan: OrganKey | null;
  cameraAngle: 'front' | 'back' | 'left' | 'right' | 'top';
  onSelectAngle: (angle: 'front' | 'back' | 'left' | 'right' | 'top') => void;
  onSelectOrgan?: (organ: OrganKey) => void;
  lang?: string;
  isCompact?: boolean;
}

// Normalized 2D coordinates on the 100x160 silhouette
const ORGAN_MINIMAP_COORDS: Record<OrganKey, { x: number; y: number }> = {
  brain: { x: 50, y: 18 },
  lungs: { x: 42, y: 44 },
  heart: { x: 56, y: 46 },
  liver: { x: 42, y: 62 },
  stomach: { x: 58, y: 63 },
  pancreas: { x: 50, y: 70 },
  kidneys: { x: 40, y: 76 },
  intestines: { x: 50, y: 88 },
};

export function AnatomyMiniMap({
  currentOrgan,
  cameraAngle,
  onSelectAngle,
  onSelectOrgan,
  lang = 'en',
  isCompact = false,
}: AnatomyMiniMapProps) {
  const selectedMeta = currentOrgan ? ORGANS[currentOrgan] : null;

  return (
    <div
      className={`rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-white/10 p-2.5 shadow-2xl text-white select-none transition-all ${
        isCompact ? 'w-24' : 'w-28 sm:w-32'
      }`}
    >
      {/* Header with Camera Orientation indicator */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10px]">
        <div className="flex items-center gap-1 font-mono text-cyan-400 font-bold">
          <Compass className="w-3 h-3 text-cyan-400" />
          <span className="uppercase">{cameraAngle}</span>
        </div>
        <span className="text-[9px] font-mono text-slate-500">3D HUD</span>
      </div>

      {/* Interactive Silhouette with Organ Beacon */}
      <div className="relative flex justify-center py-1">
        <svg
          viewBox="0 0 100 150"
          className="w-16 h-24 sm:w-20 sm:h-28 drop-shadow-[0_0_8px_rgba(0,229,255,0.2)]"
        >
          {/* Anatomical Human Torso Silhouette */}
          <path
            d="M 50 10 C 44 10, 40 14, 40 22 C 40 28, 43 32, 46 34 C 38 37, 28 42, 24 55 C 21 64, 20 80, 23 95 C 26 108, 32 118, 36 130 C 39 138, 44 138, 50 138 C 56 138, 61 138, 64 130 C 68 118, 74 108, 77 95 C 80 80, 79 64, 76 55 C 72 42, 62 37, 54 34 C 57 32, 60 28, 60 22 C 60 14, 56 10, 50 10 Z"
            fill="#090f1e"
            stroke={cameraAngle === 'front' ? '#00e5ff' : '#1e293b'}
            strokeWidth="1.5"
            strokeDasharray={cameraAngle === 'back' ? '3 3' : 'none'}
          />

          {/* Spine & Centerline Guide */}
          <line
            x1="50"
            y1="34"
            x2="50"
            y2="120"
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          {/* All Organs Subtle Markers */}
          {(Object.keys(ORGAN_MINIMAP_COORDS) as OrganKey[]).map((key) => {
            const pt = ORGAN_MINIMAP_COORDS[key];
            const isSelected = currentOrgan === key;
            const color = ORGANS[key]?.color || '#10b981';

            return (
              <g
                key={key}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectOrgan) onSelectOrgan(key);
                }}
                className="cursor-pointer"
              >
                {/* Organ Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 4.5 : 2}
                  fill={isSelected ? '#00e5ff' : color}
                  opacity={isSelected ? 1 : 0.4}
                />
                {isSelected && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={7.5}
                    fill="none"
                    stroke="#00e5ff"
                    strokeWidth="1"
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Viewing Cone Direction Indicator */}
        <div
          className={`absolute bottom-0 text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300`}
        >
          {cameraAngle === 'front' && 'Anterior'}
          {cameraAngle === 'back' && 'Posterior'}
          {cameraAngle === 'left' && 'Left Lat'}
          {cameraAngle === 'right' && 'Right Lat'}
          {cameraAngle === 'top' && 'Superior'}
        </div>
      </div>

      {/* Quick Perspective Switcher Pills */}
      <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-slate-800 text-[9px] font-bold">
        <button
          onClick={() => onSelectAngle('front')}
          className={`py-0.5 rounded transition-all ${
            cameraAngle === 'front'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/80'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Front
        </button>
        <button
          onClick={() => onSelectAngle('back')}
          className={`py-0.5 rounded transition-all ${
            cameraAngle === 'back'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/80'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Back
        </button>
        <button
          onClick={() => onSelectAngle('left')}
          className={`py-0.5 rounded transition-all ${
            cameraAngle === 'left'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/80'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Left
        </button>
        <button
          onClick={() => onSelectAngle('right')}
          className={`py-0.5 rounded transition-all ${
            cameraAngle === 'right'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/80'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Right
        </button>
      </div>
    </div>
  );
}
