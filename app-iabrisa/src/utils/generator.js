const names = [
  'Gabriel',
  'Gustavo',
  'Julio',
  'Ismael',
  'Aquino',
  'Geovane',
  'Eva',
  'Maria',
  'Cecilia',
  'Clara',
  'Simone',
  'Marie',
  'Margaret',
  'Valentina',
  'Rosa',
  'Nadia',
  'Lucas',
  'Diana',
  'Maísa',
  'Olívia',
  'Rômero',
  'Fabio',
  'Pedro',
  'Guilherme',
  'Izaias',
  'Joana',
  'Mary',
  'Thiago',
  'Evandro',
  'Anita',
  'Helen',
  'Amelia',
  'Naele',
  'Fernanda',
  'Catarina',
  'João',
  'Lucas',
  'Diana',
  'Maísa',
  'Olívia',
  'Rômero',
  'Fabio',
  'Pedro',
  'Guilherme',
  'Izaias',
  'Luis',
  'Luan',
  'Jhonatan',
  'Eduardo',
  'Arthur',
  'Antonio',
  'Felipe',
  'Elton',
  'Iran',
  'Alisson',
  'Miguel',
  'Marcos',
  'Alexandre',
  'Alerrandro',
  'Eva',
  'Maria',
  'Cecilia',
  'Clara',
  'Simone',
  'Ryan',
  'Bruno',
  'Flavio',
  'Francisco',
  'Rômulo',
  'Kelly',
  'Marie',
  'Margaret',
  'Valentina',
  'Rosa',
  'Nadia',
  'Joana',
  'Mary',
  'Thiago',
  'Evandro',
  'Anita',
  'Helen',
  'Amelia',
  'Naele',
  'Fernanda',
  'Catarina',
  'Carolina',
  'Alex',
  'Ryan',
  'Angela',
  'Michelle',
  'Rita',
  'Nísia',
  'Lili',
  'Katharine',
  'Vitória',
  'Elizabeth',
  'Anne',
  'Ana',
  'Alex',
  'Margaret',
  'Valentina',
  'Rosa',
  'Nadia',
  'Joana',
  'Mary',
  'Thiago',
  'Evandro',
  'Ryan',
  'Bruno',
  'Flavio',
  'Francisco',
  'Rômulo',
  'Kelly',
  'Margaret',
  'Valentina',
  'Rosa',
  'Nadia',
  'Joana',
  'Mary',
  'Thiago',
  'Evandro',
  'Anita',
  'Helen',
  'Amelia',
  'Naele',
  'Fernanda',
  'Catarina',
  'Carolina'
];

const currencies = {
  ja: {
    currency: 'JPY',
    factor: 29.7
  }, // Japão
  'es-AR': {
    currency: 'ARS',
    factor: 69.4
  }, // Argentina
  'es-CL': {
    currency: 'CLP',
    factor: 186
  }, // Chile
  'es-MX': {
    currency: 'MXN',
    factor: 3.57
  }, // México
  'pt-BR': {
    currency: 'BRL',
    factor: 1
  }, // Brasil
  en: {
    currency: 'USD',
    factor: 0.2
  }, // Qualquer inglês
  es: {
    currency: 'EUR',
    factor: 0.19
  } // Qualquer espanhol
};

export const namesGenerator = qtd => {
  const list = [];

  while (list.length < qtd) {
    const drawNames = Math.floor(Math.random() * names.length);
    list.push(names[drawNames]);
  }

  return list;
};

export const valueGenerator = (min, max, currency = 'BRL') => {
  const currencyConfig = Object.values(currencies).find(
    config => config.currency === currency
  ) || { currency: 'BRL', factor: 1 };

  const value = Math.floor(
    (Math.floor(Math.random() * (min - max + 1)) + max) * currencyConfig.factor
  );

  const cents = Math.floor(Math.random() * (75 - 12 + 1)) + 12;

  return Number(`${value}.${cents}`).toLocaleString('pt-BR', {
    style: 'currency',
    currency: currencyConfig.currency,
    minimumFractionDigits: 2
  });
};

export const gameGenerator = games => {
  const position = Math.floor(Math.random() * games.length);
  return games[position]?.name;
};

export const getRandomPercentage = (percentage, min, max) => {
  const number = Math.random() * (max - min) + min;

  const value = Math.round(number) + percentage;
  return value < 100 ? value : getRandomPercentage(value, -10, 10);
};
