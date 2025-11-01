export class FavoriteResponseDto {
  id: string;
  userId: string;
  companyId: string;
  productId: string;
  createdAt: Date;
  product?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
  };
  company?: {
    id: string;
    name: string;
  };
}
