export const phoneMask = value => {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{2})(\d)/, '($1) $2');
  value = value.replace(/(\d)(\d{4})$/, '$1-$2');
  return value;
};

export const cpfCnpjMask = (value = '') => {
  const numericValue = value.replace(/\D/g, '');

  if (numericValue.length <= 11) {
    return numericValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  } else {
    return numericValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }
};

export const cepMask = (value = '') => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

export const creditCardMask = (value = '') => {
  const onlyNumbers = value.replace(/\D/g, '');

  if (onlyNumbers.length === 15) {
    return onlyNumbers.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  }

  return onlyNumbers.replace(/(\d{4})(?=\d)/g, '$1 ');
};

export const monthYearMask = (value = '') => {
  let newValue = value.replace(/\D/g, '');

  if (newValue.length > 2) {
    newValue = newValue.substring(0, 2) + '/' + newValue.substring(2);
  }
  return newValue;
};
