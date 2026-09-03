import type { DestinationArea } from "./Order";

export interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

export interface CategoryRequestDTO {
  name: string;
  displayOrder?: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  categoryId?: number;
  categoryName?: string;
  category?: Category;
  ingredientNames?: string[];
  ingredients?: Ingredient[];
  destinationArea: DestinationArea;
}

export interface ProductDTO {
  name: string;
  description?: string;
  price: number;
  isAvailable?: boolean;
  categoryId: number;
  ingredientIds: number[];
}

export interface ProductRequestDTO {
  name: string;
  description?: string;
  price: number;
  isAvailable?: boolean;
  categoryId: number;
  ingredientIds?: number[];
}

export interface ProductResponseDTO {
  id: number;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  categoryId?: number;
  categoryName?: string;
  ingredientNames?: string[];
}

export interface Ingredient {
  id: number;
  name: string;
  isAvailable: boolean;
}

export interface IngredientRequestDTO {
  name: string;
  isAvailable: boolean;
}
