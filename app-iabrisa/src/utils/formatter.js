export const formatCurrency = (value, currency = 'BRL', editing = false) => {
  const isBRL = currency === 'BRL';

  const numValue =
    typeof value === 'number'
      ? value
      : Number(`${value}`.replace(/[^0-9]/g, '')) / 100;

  if (editing) {
    let strValue = numValue.toFixed(2);

    if (isBRL) {
      strValue = strValue.replace('.', ',');
      const parts = strValue.split(',');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return parts.join(',');
    } else {
      const parts = strValue.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    }
  }

  return numValue.toLocaleString(isBRL ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
