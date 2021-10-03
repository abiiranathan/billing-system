export function formatCurrency(amount) {
  if (!amount) return 0;
  return Number(amount.toFixed(2)).toLocaleString();
}
