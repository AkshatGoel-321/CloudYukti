// types/index.ts
export interface UserInput {
    modelType: string;
    datasetSize: string;
    budget: number;
    region: string;
  }
  
  export interface GPUOption {
    name: string;
    cpu: string;
    ram: string;
    price_per_hour: number;
    price_per_month: number;
    price_per_spot: number;
    region: string;
  }
  