export type TshirtSize = 'P' | 'M' | 'G' | 'GG' | 'EG';
export type ExpenseType = 'fixo' | 'variavel' | 'investimento';
export type ProductStatus = 'ideia' | 'produzindo' | 'pronta' | 'vendendo' | 'esgotada';
export type PrintType = 'frente' | 'costas' | 'manga' | 'etiqueta';

export interface InventoryItem {
  id: string;
  userId: string;
  color: string;
  size: TshirtSize;
  model: string;
  unitPrice: number;
  supplierId: string;
  purchaseDate: string;
  initialQuantity: number;
  soldQuantity: number;
  currentStock: number;
}

export interface DTFStock {
  id: string;
  userId: string;
  meters: number;
  pricePerMeter: number;
  printsPerMeter: number;
  purchaseDate: string;
}

export interface Print {
  id: string;
  userId: string;
  name: string;
  type: PrintType;
  size: string;
  unitCost: number;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  collectionId: string;
  mockupUrl: string;
  color: string;
  baseShirtCost: number;
  prints: string[]; // IDs of prints
  extraCosts: {
    packaging: number;
    label: number;
    bag: number;
    tagFee: number;
    shipping: number;
    commission: number;
  };
  totalCost: number;
  salePrice: number;
  status: ProductStatus;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  launchDate: string;
  status: string;
}

export interface Sale {
  id: string;
  userId: string;
  clientId: string;
  productId: string;
  size: TshirtSize;
  amountPaid: number;
  paymentMethod: string;
  deliveryStatus: string;
  paymentStatus: string;
  profit: number;
  timestamp: any;
}

export interface Expense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  type: ExpenseType;
  timestamp: any;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  type: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Supplier {
  id: string;
  userId: string;
  name: string;
  contact: string;
}
