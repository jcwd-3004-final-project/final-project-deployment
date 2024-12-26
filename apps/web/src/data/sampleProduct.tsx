export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
  }
  
  export const sampleProducts: Product[] = [
    { id: 1, name: "Apples", price: 4.99, stock: 25 },
    { id: 2, name: "Bread", price: 3.49, stock: 15 },
    { id: 3, name: "Almond Milk", price: 2.99, stock: 0 },
    { id: 4, name: "Eggs (12 Count)", price: 5.99, stock: 30 },
  ];
  