export type TabType = "products" | "ingredients" | "categories";

const SEARCH_PLACEHOLDERS: Record<TabType, string> = {
  products: "Cerca prodotti...",
  ingredients: "Cerca ingredienti...",
  categories: "Cerca categorie...",
};

export const getSearchPlaceholder = (activeTab: string): string => {
  return SEARCH_PLACEHOLDERS[activeTab as TabType] ?? "Cerca...";
};
