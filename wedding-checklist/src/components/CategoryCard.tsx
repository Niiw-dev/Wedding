"use client";

import { ChecklistCategory, ChecklistItem } from "@/types/checklist";

interface CategoryCardProps {
  category: ChecklistCategory;
  onToggle: (categoryId: string, itemId: string) => void;
  onOpenDetails: (category: ChecklistCategory, item: ChecklistItem) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export default function CategoryCard({
  category,
  onToggle,
  onOpenDetails,
  isOpen,
  onToggleOpen,
}: CategoryCardProps) {
  const checkedCount = category.items.filter((i) => i.checked).length;
  const total = category.items.length;
  const percentage = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

  const hasDetailData = (item: ChecklistItem) => {
    if (!item.details) return false;
    const d = item.details;
    return (
      d.notes ||
      d.images.length > 0 ||
      d.links.length > 0 ||
      d.customFields.some((f) => f.value)
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
      <button
        onClick={onToggleOpen}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.emoji}</span>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">{category.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {checkedCount}/{total} completadas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-4 border-t border-gray-100">
          <ul className="divide-y divide-gray-100">
            {category.items.map((item) => (
              <li key={item.id} className="py-2.5 flex items-center gap-2 group">
                <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => onToggle(category.id, item.id)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:border-gray-900 peer-checked:bg-gray-900 transition-all flex items-center justify-center group-hover:border-gray-400">
                      {item.checked && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-sm transition-all truncate ${
                      item.checked
                        ? "line-through text-gray-400"
                        : "text-gray-700 group-hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
                <button
                  onClick={() => onOpenDetails(category, item)}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Ver detalles"
                >
                  <svg
                    className={`w-4 h-4 ${hasDetailData(item) ? "text-gray-700" : "text-gray-300"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
