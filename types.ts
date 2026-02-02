export interface FinancialRecord {
  id: string;
  date: string;
  suprimento: number;
  relatorio: number;
  dinheiro: number;
  cartao: number;
  pix: number;
  despesas: number;
  description?: string; // Optional note
}

export interface CalculatedValues {
  real: number;
  lucro: number;
  diferenca: number;
}

export type RecordFormData = Omit<FinancialRecord, 'id'>;