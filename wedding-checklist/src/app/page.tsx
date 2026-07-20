"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useChecklist } from "@/lib/store";
import { ChecklistCategory, ChecklistItem, ItemDetail } from "@/types/checklist";
import ProgressBar from "@/components/ProgressBar";
import CategoryCard from "@/components/CategoryCard";
import ActivitiesPanel from "@/components/ActivitiesPanel";
import ItemDetailModal from "@/components/ItemDetailModal";

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data, loading, toggleItem, updateItemDetails, getProgress } = useChecklist();
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"checklist" | "activities">("checklist");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailModal, setDetailModal] = useState<{
    category: ChecklistCategory;
    item: ChecklistItem;
  } | null>(null);
  const router = useRouter();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏮</div>
          <p className="text-gray-400 animate-pulse">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    if (!data) return;
    setOpenCategories(new Set(data.categories.map((c) => c.id)));
  };

  const collapseAll = () => {
    setOpenCategories(new Set());
  };

  const handleOpenDetails = (category: ChecklistCategory, item: ChecklistItem) => {
    setDetailModal({ category, item });
  };

  const handleSaveDetails = async (details: ItemDetail) => {
    if (!detailModal) return;
    await updateItemDetails(detailModal.category.id, detailModal.item.id, details);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏮</div>
          <p className="text-gray-400 animate-pulse">Cargando checklist...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const progress = getProgress();

  const filteredCategories = data.categories
    .map((cat) => ({
      ...cat,
      items: searchQuery
        ? cat.items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : cat.items,
    }))
    .filter((cat) => (searchQuery ? cat.items.length > 0 : true));

  return (
    <div className="min-h-screen">
      <div className="w-[85%] mx-auto py-6 sm:py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div />
          <div className="text-center">
            <div className="text-5xl mb-3">🏮</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              Wedding Checklist
            </h1>
            <p className="text-gray-500 text-sm">
              Todo lo que necesitas para el día perfecto
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Salir
          </button>
        </header>

        {/* Progress */}
        <div className="mb-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <ProgressBar {...progress} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === "checklist"
                ? "bg-gray-900 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            📋 Checklist
          </button>
          <button
            onClick={() => setActiveTab("activities")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === "activities"
                ? "bg-gray-900 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            🎯 Actividades
          </button>
        </div>

        {activeTab === "checklist" ? (
          <>
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar tarea..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Expand/Collapse */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={expandAll}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Expandir todo
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Colapsar todo
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onToggle={toggleItem}
                  onOpenDetails={handleOpenDetails}
                  isOpen={openCategories.has(category.id)}
                  onToggleOpen={() => toggleCategory(category.id)}
                />
              ))}
              {filteredCategories.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  No se encontraron tareas
                </div>
              )}
            </div>
          </>
        ) : (
          <ActivitiesPanel />
        )}

        {/* Footer */}
        <footer className="text-center mt-10 pb-6 text-xs text-gray-400">
          Hecho con 💕 para el día más especial
        </footer>
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <ItemDetailModal
          category={detailModal.category}
          item={detailModal.item}
          onSave={handleSaveDetails}
          onClose={() => setDetailModal(null)}
        />
      )}
    </div>
  );
}
