"use client";

import { useState, useEffect } from "react";
import { ItemDetail, ChecklistCategory, ChecklistItem } from "@/types/checklist";

interface ItemDetailModalProps {
  category: ChecklistCategory;
  item: ChecklistItem;
  onSave: (details: ItemDetail) => void;
  onClose: () => void;
}

const defaultDetails: ItemDetail = {
  notes: "",
  images: [],
  links: [],
  customFields: [],
};

export default function ItemDetailModal({
  category,
  item,
  onSave,
  onClose,
}: ItemDetailModalProps) {
  const [details, setDetails] = useState<ItemDetail>(item.details || defaultDetails);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setDetails((d) => ({ ...d, images: [...d.images, newImageUrl.trim()] }));
    setNewImageUrl("");
  };

  const removeImage = (idx: number) => {
    setDetails((d) => ({ ...d, images: d.images.filter((_, i) => i !== idx) }));
  };

  const addLink = () => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
    setDetails((d) => ({
      ...d,
      links: [...d.links, { label: newLinkLabel.trim(), url: newLinkUrl.trim() }],
    }));
    setNewLinkLabel("");
    setNewLinkUrl("");
  };

  const removeLink = (idx: number) => {
    setDetails((d) => ({ ...d, links: d.links.filter((_, i) => i !== idx) }));
  };

  const addField = () => {
    if (!newFieldLabel.trim()) return;
    setDetails((d) => ({
      ...d,
      customFields: [
        ...d.customFields,
        { label: newFieldLabel.trim(), value: newFieldValue.trim() },
      ],
    }));
    setNewFieldLabel("");
    setNewFieldValue("");
  };

  const handleSave = () => {
    onSave(details);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xl">{category.emoji}</span>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">{item.label}</h2>
              <p className="text-xs text-gray-500">{category.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Custom fields from category template */}
          {category.detailFields && category.detailFields.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Detalles
              </h4>
              {category.detailFields.map((field) => {
                const existing = details.customFields.find((f) => f.label === field.label);
                const fieldIdx = details.customFields.findIndex((f) => f.label === field.label);
                return (
                  <div key={field.label}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={existing?.value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDetails((d) => {
                          const updated = [...d.customFields];
                          if (fieldIdx >= 0) {
                            updated[fieldIdx] = { ...updated[fieldIdx], value: val };
                          } else {
                            updated.push({ label: field.label, value: val });
                          }
                          return { ...d, customFields: updated };
                        });
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Notes */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Notas
            </h4>
            <textarea
              placeholder="Escribe notas, recordatorios, ideas..."
              value={details.notes}
              onChange={(e) => setDetails((d) => ({ ...d, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Images */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Imágenes / Referencias visuales
            </h4>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="URL de la imagen"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addImage()}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
              <button
                onClick={addImage}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
              >
                +
              </button>
            </div>
            {details.images.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {details.images.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-xs text-gray-600 hover:underline truncate"
                    >
                      {url}
                    </a>
                    <button
                      onClick={() => removeImage(idx)}
                      className="p-1 rounded text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Enlaces
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Etiqueta"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                className="w-1/3 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
              <input
                type="url"
                placeholder="https://..."
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLink()}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
              <button
                onClick={addLink}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
              >
                +
              </button>
            </div>
            {details.links.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {details.links.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <span className="text-xs text-gray-500 shrink-0">{link.label}:</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-xs text-gray-600 hover:underline truncate"
                    >
                      {link.url}
                    </a>
                    <button
                      onClick={() => removeLink(idx)}
                      className="p-1 rounded text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom extra fields */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Campos personalizados
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nombre del campo"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                className="w-1/3 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
              <input
                type="text"
                placeholder="Valor"
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addField()}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
              <button
                onClick={addField}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 flex gap-2 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
