export const convertTemperature = (celsius: number, unit: 'celsius' | 'fahrenheit'): number => {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9/5) + 32);
  }
  return Math.round(celsius);
};

export const formatTemperature = (celsius: number, unit: 'celsius' | 'fahrenheit'): string => {
  const temp = convertTemperature(celsius, unit);
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${temp}${symbol}`;
};

export const getTemperatureSymbol = (unit: 'celsius' | 'fahrenheit'): string => {
  return unit === 'celsius' ? '°C' : '°F';
};