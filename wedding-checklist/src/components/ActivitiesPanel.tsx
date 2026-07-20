"use client";

import { activityItems } from "@/lib/data";

const priorityConfig = {
  green: {
    label: "No requiere que ambos estén presentes",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    dotColor: "bg-green-500",
    textColor: "text-gray-900",
    headerBg: "bg-gray-100",
  },
  yellow: {
    label: "Ideal que ambos estén presentes",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    dotColor: "bg-yellow-500",
    textColor: "text-gray-900",
    headerBg: "bg-gray-100",
  },
  red: {
    label: "Indispensable que ambos estén presentes",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    dotColor: "bg-red-500",
    textColor: "text-gray-900",
    headerBg: "bg-gray-100",
  },
};

export default function ActivitiesPanel() {
  const grouped = {
    green: activityItems.filter((a) => a.priority === "green"),
    yellow: activityItems.filter((a) => a.priority === "yellow"),
    red: activityItems.filter((a) => a.priority === "red"),
  };

  return (
    <div className="space-y-4">
      {(["red", "yellow", "green"] as const).map((priority) => {
        const config = priorityConfig[priority];
        const items = grouped[priority];
        return (
          <div
            key={priority}
            className={`rounded-2xl border ${config.borderColor} ${config.bgColor} overflow-hidden`}
          >
            <div className={`px-5 py-3 ${config.headerBg}`}>
              <h3 className={`font-semibold text-sm ${config.textColor}`}>
                {config.label}
              </h3>
            </div>
            <div className="px-5 py-3">
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${config.dotColor} shrink-0`} />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
