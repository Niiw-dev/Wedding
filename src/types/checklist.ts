export interface ItemDetail {
  notes: string;
  images: string[];
  links: { label: string; url: string }[];
  customFields: { label: string; value: string }[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  details?: ItemDetail;
}

export interface ChecklistCategory {
  id: string;
  emoji: string;
  title: string;
  detailFields?: { label: string; placeholder: string }[];
  items: ChecklistItem[];
}

export interface ChecklistData {
  categories: ChecklistCategory[];
  lastModified: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  priority: "green" | "yellow" | "red";
}
