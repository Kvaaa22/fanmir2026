export type CartProduct = {
  id: string;
  imageUrl: string;
  titleLineOne: string;
  titleLineTwo: string;
  meta: Array<{
    label: string;
    value: string;
  }>;
  price: string;
  pricePerM2?: string;
  unitPriceRub: number | null;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
};

export type CartSnapshot = {
  items: Record<string, CartItem>;
  updatedAt: number;
};
