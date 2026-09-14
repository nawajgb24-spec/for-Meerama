import React, { useState } from 'react';
import { WeightLogEntry } from '../types';
import { TrendingUp, Calendar, Info } from 'lucide-react';

interface WeightChartProps {
  logs: WeightLogEntry[];
  targetWeight: number;
}

export const WeightChart: React.FC<WeightChartProps> = ({ logs, targetWeight }) => {
  const [hoveredPoint, setHoveredPoint] = useState<WeightLogEntry | null>(null);

  // Sort logs chronologically ascending for the chart
  const sortedLogs = [...logs].sort((a, b) => a.timestamp - b.timestamp);

  if (sortedLogs.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-stone-200 text-center text-stone-500">
        <p className="text-sm">No weight logs recorded yet.</p>
      </div>
    );
  }

  // Calculate chart boundaries
  const weights = sortedLogs.map((l) => l.weight).concat(targetWeight);
  const minWeight = Math.floor(Math.min(...weights) - 2);
  const maxWeight = Math.ceil(Math.max(...weights) + 2);
  const range = maxWeight - minWeight || 1;

  // Chart coordinates
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 25;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  // Point projection
  const getX = (index: number) => {
    if (sortedLogs.length === 1) return width / 2;
    return paddingX + (index / (sortedLogs.length - 1)) * graphWidth;
  };

  const getY = (val: number) => {
    const norm = (val - minWeight) / range;
    return height - paddingY - norm * graphHeight;
  };

  // Build SVG path
  const points = sortedLogs.map((log, idx) => ({
    x: getX(idx),
    y: getY(log.weight),
    log,
  }));

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Area path for gradient under curve
  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
      : '';

  const targetY = getY(targetWeight);

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-2 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Dated Weight Trend</h3>
            <p className="text-[11px] text-stone-600">Visual progress over time against target</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span>Logged Weight</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 border-b-2 border-dashed border-stone-400 inline-block" />
            <span>Target ({targetWeight} kg)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[minWeight, Math.round((minWeight + maxWeight) / 2), maxWeight].map((lvl) => {
            const y = getY(lvl);
            return (
              <g key={lvl}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#e7e5e4"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-stone-400 font-mono"
                >
                  {lvl}kg
                </text>
              </g>
            );
          })}

          {/* Target Reference Line */}
          <line
            x1={paddingX}
            y1={targetY}
            x2={width - paddingX}
            y2={targetY}
            stroke="#78716c"
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />
          <text
            x={width - paddingX + 6}
            y={targetY + 3}
            className="text-[10px] fill-stone-500 font-semibold"
          >
            Target {targetWeight}kg
          </text>

          {/* Area fill */}
          {areaD && <path d={areaD} fill="url(#weightAreaGrad)" />}

          {/* Connecting Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Data Dots */}
          {points.map((pt, idx) => {
            const isHovered = hoveredPoint?.id === pt.log.id;
            return (
              <g
                key={pt.log.id || idx}
                onMouseEnter={() => setHoveredPoint(pt.log)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
              >
                {/* Hit target area */}
                <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? '6' : '4'}
                  fill="#ffffff"
                  stroke="#059669"
                  strokeWidth={isHovered ? '3' : '2'}
                  className="transition-all duration-150"
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip details if point hovered */}
        {hoveredPoint && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-stone-900/90 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-2">
            <span>{hoveredPoint.date}</span>
            <span className="text-stone-400">•</span>
            <span className="font-bold text-emerald-400">{hoveredPoint.weight} kg</span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-300">BMI {hoveredPoint.bmi}</span>
            {hoveredPoint.note && (
              <>
                <span className="text-stone-400">•</span>
                <span className="italic text-stone-300">"{hoveredPoint.note}"</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Date labels under chart */}
      <div className="flex justify-between text-[11px] text-stone-600 px-2 mt-1">
        <span>Earliest: {sortedLogs[0]?.date}</span>
        {sortedLogs.length > 1 && (
          <span>Latest: {sortedLogs[sortedLogs.length - 1]?.date}</span>
        )}
      </div>
    </div>
  );
};
