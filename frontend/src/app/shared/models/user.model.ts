export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  ecoScore: number;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
