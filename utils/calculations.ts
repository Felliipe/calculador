import { FinancialRecord, CalculatedValues } from '../types';

export const calculateValues = (record: FinancialRecord | Partial<FinancialRecord>): CalculatedValues => {
  const dinheiro = Number(record.dinheiro) || 0;
  const cartao = Number(record.cartao) || 0;
  const pix = Number(record.pix) || 0;
  const despesas = Number(record.despesas) || 0;
  const suprimento = Number(record.suprimento) || 0;
  const relatorio = Number(record.relatorio) || 0;

  const totalEntradas = dinheiro + cartao + pix;

  // Real = Dinheiro + Cartão + Pix - Despesas
  const real = totalEntradas - despesas;

  // Lucro = (Dinheiro + Cartão + Pix) - Despesas - Suprimento
  // Equivalent to: Real - Suprimento
  const lucro = real - suprimento;

  // Diferença = Relatório - (Dinheiro + Cartão + Pix)
  const diferenca = relatorio - totalEntradas;

  return { real, lucro, diferenca };
};

export const calculateTotals = (records: FinancialRecord[]) => {
  return records.reduce(
    (acc, record) => {
      const vals = calculateValues(record);
      return {
        real: acc.real + vals.real,
        lucro: acc.lucro + vals.lucro,
        diferenca: acc.diferenca + vals.diferenca,
        despesas: acc.despesas + record.despesas,
        faturamento: acc.faturamento + (record.dinheiro + record.cartao + record.pix)
      };
    },
    { real: 0, lucro: 0, diferenca: 0, despesas: 0, faturamento: 0 }
  );
};