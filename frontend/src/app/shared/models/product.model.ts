export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  carbonImpact: number;
  ecoCertified: boolean;
  ecoRating: string;
  category: string;
  stockQuantity: number;
  imageUrl?: string;
  sellerId: number;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
