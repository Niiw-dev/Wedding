"use client";

interface ProgressBarProps {
  checked: number;
  total: number;
  percentage: number;
}

export default function ProgressBar({ checked, total, percentage }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          {checked} de {total} tareas completadas
        </span>
        <span className="text-sm font-bold text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out bg-gray-900"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
