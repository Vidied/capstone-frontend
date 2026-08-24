export interface Category {
  id: number;
  name: string;
}

export interface Ingredient {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  ingredients?: Ingredient[]; //Per le bevande si crea semplicemente un product senza ingredienti, per questo motivo gli ingredienti non sono obbligatori
}

export interface ProductRequestDTO {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  ingredientIds?: number[];
}
