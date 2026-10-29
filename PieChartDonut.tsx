import React from 'react';

interface PieChartDonutProps {
  percentage: number;
  targetPercentage?: number;
  size?: number;
  strokeWidth?: number;
  attended: number;
  total: number;
}

export const PieChartDonut: React.FC<PieChartDonutProps> = ({
  percentage,
  targetPercentage = 75,
  size = 190,
  strokeWidth = 16,
  attended,
  total,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const validPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference;

  // Determine color based on KTU rules
  let ringColor = '#0284c7'; // Sky-600
  let ringBg = '#e0f2fe'; // Sky-100
  let statusText = 'Safe Zone';
  let statusColor = 'text-sky-700 bg-sky-50 border-sky-200';

  if (percentage >= 75) {
    ringColor = '#0284c7'; // Sky Blue
    ringBg = '#e0f2fe';
    statusText = 'Exam Eligible (≥ 75%)';
    statusColor = 'text-sky-700 bg-sky-50 border-sky-200';
  } else if (percentage >= 60) {
    ringColor = '#f59e0b'; // Amber
    ringBg = '#fef3c7';
    statusText = 'Condonation Zone (60% - 74%)';
    statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else {
    ringColor = '#ef4444'; // Red
    ringBg = '#fee2e2';
    statusText = 'Shortage / Detained (< 60%)';
    statusColor = 'text-red-700 bg-red-50 border-red-200';
  }

  // Calculate target 75% tick marker on circle
  const targetAngle = (targetPercentage / 100) * 360 - 90;
  const targetRad = (targetAngle * Math.PI) / 180;
  const targetX = size / 2 + radius * Math.cos(targetRad);
  const targetY = size / 2 + radius * Math.sin(targetRad);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center drop-shadow-sm"
        >
          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={ringBg}
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Target 75% marker pin */}
          <circle
            cx={targetX}
            cy={targetY}
            r={5}
            fill="#ffffff"
            stroke="#0369a1"
            strokeWidth={2}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-3xl font-bold tracking-tight text-slate-800 tabular-nums">
            {percentage.toFixed(1)}%
          </span>
          <span className="text-xs font-medium text-slate-500 mt-0.5">
            {attended}/{total} classes
          </span>
          <span className="text-[10px] text-sky-600 font-semibold uppercase tracking-wider mt-1">
            KTU Target: {targetPercentage}%
          </span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 text-xs font-semibold rounded-full border ${statusColor}`}>
        {statusText}
      </div>
    </div>
  );
};
