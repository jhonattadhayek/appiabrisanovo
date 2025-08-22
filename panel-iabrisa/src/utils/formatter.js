export const shortenNumber = (number, toFixed = 0) => {
  if (number < 1000) return number.toString();

  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const i = Math.floor(Math.log10(number) / 3);

  const numberEncurtado = (number / Math.pow(1000, i)).toFixed(toFixed);

  return `${numberEncurtado}${suffixes[i]}`;
};

export const formatDate = date => {
  const timestamp = parseInt(date, 10);
  const dataHora = new Date(timestamp);

  return dataHora.toLocaleDateString();
};

export const formatCurrency = value => {
  value = `${value}`.replace(/\D/g, '');

  value = (value * 0.01).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  });

  return value;
};

export const numberCompact = value => {
  const formater = Intl.NumberFormat('pt-br', {
    notation: 'compact',
    compactDisplay: 'short'
  });
  return formater.format(value);
};

export const convertUndefinedToFalse = obj => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  for (const key in obj) {
    if (obj[key] === undefined) {
      obj[key] = false;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      convertUndefinedToFalse(obj[key]);
    }
  }

  return obj;
};

export const areAllValuesFalse = obj => {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('O argumento deve ser um objeto.');
  }

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (!areAllValuesFalse(obj[key])) {
        return false;
      }
    } else if (obj[key] !== false) {
      return false;
    }
  }

  return true;
};

export const formatSeconds = seconds => {
  if (seconds < 60) {
    return `S${seconds}`;
  }

  const minutes = seconds / 60;

  if (minutes < 60) {
    return `M${minutes}`;
  }

  const hours = minutes / 60;
  return `H${hours}`;
};
